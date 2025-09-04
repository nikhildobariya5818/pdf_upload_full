from fastapi import File, UploadFile, APIRouter
from fastapi.responses import JSONResponse
import fitz  # PyMuPDF
import re
import json
import os
import shutil
import qrcode
import barcode
from barcode.writer import ImageWriter
import random
from PIL import Image
import numpy as np

OUTPUT_DIR = 'output'

def clear_output_directory():
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    os.makedirs(OUTPUT_DIR, exist_ok=True)

def remove_white_background(image_path):
    img = Image.open(image_path).convert("RGBA")
    datas = img.getdata()
    new_data = []
    for item in datas:
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    img.putdata(new_data)
    img.save(image_path, "PNG")
    

def create_and_save_qr_code(report_number, folder_path):
    url = f"https://www.gia.edu/report-check?reportno={report_number.strip().replace(' ', '')}"
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="black", back_color="white").convert("RGBA")
    datas = qr_img.getdata()
    new_data = []
    for item in datas:
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    qr_img.putdata(new_data)
    qr_path = os.path.join(folder_path, 'qrcode.png')
    qr_img.save(qr_path, format="PNG")
    return qr_path

def generate_unique_barcode(number_of_digits, start_digit, save_path):
    number = str(start_digit) + ''.join(str(random.randint(0, 9)) for _ in range(number_of_digits - 1))
    number_with_spaces = f"{' ' * 4}{number}{' ' * 4}"
    code = barcode.get('code128', number_with_spaces, writer=ImageWriter())
    module_width = 3.0 if number_of_digits == 10 else 3.8
    module_height = 50.0 if number_of_digits == 10 else 75.0
    writer_options = {
        'write_text': False,
        'module_width': module_width,
        'module_height': module_height,
        'quiet_zone': 15.0,
        'font_size': 0,
    }
    filename = code.save(save_path, options=writer_options)
    remove_white_background(filename)
    return number_with_spaces, filename

def extract_report_date(text):
    pattern = r"\b([A-Z][a-z]+ \d{2}, \d{4})\b"
    match = re.search(pattern, text)
    if match:
        return match.group(1)
    return None



def darken_entire_image(image_path, factor=0.5):
    """
    Darken the whole image uniformly.
    factor < 1.0 makes it darker (e.g., 0.5 = 50% brightness).
    """
    im = Image.open(image_path).convert("RGBA")
    arr = np.array(im).astype(np.float32)

    # Scale RGB channels, keep alpha unchanged
    arr[..., :3] = np.clip(arr[..., :3] * factor, 0, 255)

    Image.fromarray(arr.astype(np.uint8), mode="RGBA").save(image_path)


def extract_key_to_symbols_image(doc, page_index, save_path):
    page = doc[page_index]
    text_instances = page.search_for("KEY TO SYMBOLS*")
    if not text_instances:
        return None

    rect = text_instances[0]
    rect.y1 += 60
    rect.x0 -= 10
    rect.x1 += 90

    # Extract image from page
    pix = page.get_pixmap(clip=rect, dpi=300)
    pix.save(save_path)

    # Remove white background (make transparent)
    remove_white_background(save_path)

    # Darken entire image (text + symbols)
    darken_entire_image(save_path, factor=0.4)  # smaller = darker

    return save_path

def extract_notes_image(doc, page_index, save_path):
    page = doc[page_index]
    text_instances = page.search_for("* Red symbols denote internal characteristics (inclusions). Green or black symbols denote external characteristics")
    if not text_instances:
        return None
    rect = text_instances[0]
    rect.y1 += 25
    rect.x0 -= 5
    rect.x1 += 5
    pix = page.get_pixmap(clip=rect, dpi=300)
    pix.save(save_path)
    remove_white_background(save_path)
    return save_path

def find_value(pattern, text_block):
    match = re.search(pattern, text_block, re.IGNORECASE | re.MULTILINE)
    return match.group(1).strip() if match else None

def extract_diagram_image_by_heading(page, doc, heading_text, save_path, fallback_size=(400, 400)):
    heading_boxes = page.search_for(heading_text)
    if not heading_boxes:
        print(f"Could not find heading: {heading_text}")
        return None

    heading_rect = heading_boxes[0]

    # Special handling for PROPORTIONS: fixed crop region, keep PNG
    if heading_text.upper().startswith("PROPORTIONS"):
        x0 = heading_rect.x0
        y0 = heading_rect.y1 + 20
        x1 = heading_rect.x0 + 250
        y1 = heading_rect.y1 + 150
        crop_rect = fitz.Rect(x0, y0, x1, y1)
        pix = page.get_pixmap(clip=crop_rect, dpi=300)
        pix.save(save_path)  # PNG
        remove_white_background(save_path)
        print(f"Saved fixed region for 'PROPORTIONS'")
        return save_path

    images = page.get_images(full=True)
    candidate_imgs = [
        img for img in images
        if page.get_image_bbox(img).get_area() > 10000
    ]
    print(f"{heading_text}: Found {len(candidate_imgs)} large images.")

    min_dist = float('inf')
    chosen_img = None
    for img in candidate_imgs:
        bbox = page.get_image_bbox(img)
        dist = abs(bbox.y0 - heading_rect.y0)
        if dist < min_dist:
            min_dist = dist
            chosen_img = img

    def _save_pix_as_jpg(pix: fitz.Pixmap, out_jpg_path: str):
        # Convert fitz.Pixmap to PIL Image and save as JPEG with white background if alpha present
        if pix.n in (4, 5):  # has alpha channel
            pil = Image.frombytes("RGBA", (pix.width, pix.height), pix.samples)
            bg = Image.new("RGB", pil.size, (255, 255, 255))
            bg.paste(pil, mask=pil.split()[-1])
            bg.save(out_jpg_path, format="JPEG", quality=95)
        else:
            pil = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
            pil.save(out_jpg_path, format="JPEG", quality=95)

    if chosen_img:
        xref = chosen_img[0]
        pix = fitz.Pixmap(doc, xref)
        if heading_text.upper().startswith("CLARITY CHARACTERISTICS"):
            # Force JPG for clarity characteristics
            jpg_path = os.path.splitext(save_path)[0] + ".jpg"
            _save_pix_as_jpg(pix, jpg_path)
            print(f"Saved image for '{heading_text}' as JPG from xref={xref}")
            return jpg_path
        else:
            # Keep PNG for other diagrams
            pix.save(save_path)
            remove_white_background(save_path)
            print(f"Saved image for '{heading_text}' from xref={xref}")
            return save_path

    # Fallback crop when no image object is detected
    crop_rect = fitz.Rect(
        heading_rect.x0,
        heading_rect.y1 + 5,
        heading_rect.x0 + fallback_size[0],
        heading_rect.y1 + fallback_size[1]
    )
    pix = page.get_pixmap(clip=crop_rect, dpi=300)

    if heading_text.upper().startswith("CLARITY CHARACTERISTICS"):
        jpg_path = os.path.splitext(save_path)[0] + ".jpg"
        _save_pix_as_jpg(pix, jpg_path)
        print(f"Saved fallback cropped region for '{heading_text}' as JPG")
        return jpg_path
    else:
        pix.save(save_path)
        remove_white_background(save_path)
        print(f"Saved fallback cropped region for '{heading_text}'")
        return save_path

def extract_comments(text):
    lines = text.splitlines()
    comments_lines = []
    capture = False

    for line in lines:
        stripped = line.strip()

        if stripped.startswith("Comments:") or stripped.startswith("Comment:"):
            # Start capturing after removing "Comments:" prefix
            after_colon = stripped.split(":", 1)[1].strip()
            if after_colon:
                comments_lines.append(after_colon)
            capture = True
            continue

        if capture:
            # Stop if we hit report number (all digits and length ≥ 6)
            if re.fullmatch(r"\d{6,}", stripped):
                break
            # Stop if "KEY TO SYMBOLS" line
            if "KEY TO SYMBOLS" in stripped.upper():
                break
            # Stop if it's an ALL CAPS heading
            if stripped.isupper() and len(stripped) > 3:
                break
            # Stop if blank line
            if stripped == "":
                break

            comments_lines.append(stripped)

    return " ".join(comments_lines).strip() if comments_lines else None

def process_gia_pdf(pdf_path):
    clear_output_directory()
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        return {"error": f"Error opening PDF: {e}"}

    page = doc[0]
    text = page.get_text("text")

    def get_clarity_grade(text_block):
        pattern = r"Clarity Grade\s*[:\.]*\s*([A-Za-z0-9\+-/]+)"
        match = re.search(pattern, text_block)
        if match:
            return match.group(1).strip()
        for line in text_block.split('\n'):
            if "Clarity Grade" in line:
                found = re.split(r"Clarity Grade[\s\.\:]*", line, maxsplit=1)
                if len(found) > 1 and found[1].strip():
                    val = found[1].strip()
                    if re.match(r'^[A-Za-z0-9\+-/]+$', val):
                        return val
        return None

    def get_cut_grade(text_block):
        pattern = r"Cut Grade\s*[:\.]*\s*([A-Za-z0-9\+-/ ]+)"
        match = re.search(pattern, text_block)
        if match:
            return match.group(1).strip()
        for line in text_block.split('\n'):
            if "Cut Grade" in line:
                found = re.split(r"Cut Grade[\s\.\:]*", line, maxsplit=1)
                if len(found) > 1 and found[1].strip():
                    return found[1].strip()
        return None

    gia_report_number = find_value(r"GIA Report Number[\s\.]*([0-9 ]+)", text)
    if not gia_report_number:
        doc.close()
        return {"error": "Could not find GIA Report Number in the PDF."}

    qr_code_path = create_and_save_qr_code(gia_report_number, OUTPUT_DIR)
    barcode12_number, barcode12_path = generate_unique_barcode(12, 1, os.path.join(OUTPUT_DIR, "barcode12"))
    barcode10_number, barcode10_path = generate_unique_barcode(10, 1, os.path.join(OUTPUT_DIR, "barcode10"))

    report_type = "GIANATURALDIAMONDGRADINGREPORT"
    if "DOSSIER" in text.upper():
        report_type = "GIANATURALDIAMONDOSSIER"

    gia_report_data = {
        "GIAReportNumber": gia_report_number,
        "ShapeandCuttingStyle": find_value(r"Shape and Cutting Style[\s\.]*([^\n]+)", text) or None,
        "Measurements": find_value(r"Measurements[\s\.]*([^\n]+)", text) or None,
    }

    grading_results = {
        "CaratWeight": find_value(r"Carat Weight[\s\.]*([^\n]+)", text) or None,
        "ColorGrade": find_value(r"Color Grade[\s\.]*([A-Za-z0-9 \+-/]+)", text) or None,
        "ClarityGrade": get_clarity_grade(text) or None,
        "CutGrade": get_cut_grade(text) or None
    }

    comments_value = extract_comments(text)
    additional_info = {
        "polish": find_value(r"Polish[\s\.]*([^\n]+)", text) or None,
        "symmetry": find_value(r"Symmetry[\s\.]*([^\n]+)", text) or None,
        "fluorescence": find_value(r"Fluorescence[\s\.]*([^\n]+)", text) or None,
        "inscription": find_value(r"Inscription\(s\)[\s\.]*([^\n]+)", text) or None,
        "comments": comments_value if comments_value else None,
    }

    symbols = []
    char_match = re.search(r"Clarity Characteristics\.+ (.+)", text)
    if char_match:
        characteristics = [c.strip() for c in char_match.group(1).split(',')]
        symbols.extend([{"icon": None, "name": char} for char in characteristics])
    elif "KEY TO SYMBOLS" in text:
        key_to_symbols_text = text.split("KEY TO SYMBOLS*")[1]
        characteristics = re.findall(r"\s*([a-zA-Z\s]+)\s*", key_to_symbols_text.split("Red symbols denote")[0])
        symbols.extend([{"icon": None, "name": char.strip()} for char in characteristics if char.strip()])

    proportions_img_path = os.path.join(OUTPUT_DIR, "proportions.png")
    clarity_img_path = os.path.join(OUTPUT_DIR, "clarity_characteristics.jpg")  # explicit .jpg name

    proportions_img = extract_diagram_image_by_heading(page, doc, "PROPORTIONS", proportions_img_path)
    clarity_img = extract_diagram_image_by_heading(page, doc, "CLARITY CHARACTERISTICS", clarity_img_path)

    key_to_symbols_img_path = os.path.join(OUTPUT_DIR, "key_to_symbols.png")
    key_to_symbols_img = extract_key_to_symbols_image(doc, 0, key_to_symbols_img_path)

    notes_img_path = os.path.join(OUTPUT_DIR, "notes.png")
    notes_img = extract_notes_image(doc, 0, notes_img_path)

    report_date = extract_report_date(text)

    final_data = {
        "ReportDate": report_date,
        report_type: gia_report_data,
        "GRADINGRESULTS": grading_results,
        "ADDITIONALGRADINGINFORMATION": additional_info,
        "PROPORTIONS": proportions_img.replace("\\", "/") if proportions_img else None,
        "CLARITYCHARACTERISTICS": clarity_img.replace("\\", "/") if clarity_img else None,
        "KEYTOSYMBOLS": key_to_symbols_img.replace("\\", "/") if key_to_symbols_img else None,
        "NOTES": notes_img.replace("\\", "/") if notes_img else None,
        "QRCODE": qr_code_path.replace("\\", "/") if qr_code_path else None,
        "symbols": symbols,
        "BARCODE12": {"number": barcode12_number, "image": barcode12_path.replace("\\", "/")},
        "BARCODE10": {"number": barcode10_number, "image": barcode10_path.replace("\\", "/")}
    }

    json_file_path = os.path.join(OUTPUT_DIR, f"{gia_report_number.strip().replace(' ', '_')}.json")
    with open(json_file_path, 'w') as jf:
        json.dump(final_data, jf, indent=4)
    doc.close()
    return final_data

router = APIRouter()

@router.post("/upload-multi-pdf/")
async def upload_multi_pdf(file: UploadFile = File(...)):
    temp_pdf_path = file.filename
    with open(temp_pdf_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    result = process_gia_pdf(temp_pdf_path)
    os.remove(temp_pdf_path)
    return JSONResponse(content=result)

upload_multi_pdf = upload_multi_pdf
