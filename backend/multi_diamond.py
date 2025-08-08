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

def extract_key_to_symbols_image(doc, page_index, save_path):
    page = doc[page_index]
    text_instances = page.search_for("KEY TO SYMBOLS*")
    if not text_instances:
        return None
    rect = text_instances[0]
    rect.y1 += 60
    rect.x0 -= 5
    rect.x1 += 5
    pix = page.get_pixmap(clip=rect, dpi=300)
    pix.save(save_path)
    remove_white_background(save_path)
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
    # Modification: Always fixed crop if "PROPORTIONS"
    if heading_text.upper().startswith("PROPORTIONS"):
        # Adjust these offsets as needed for your PDFs
        x0 = heading_rect.x0
        y0 = heading_rect.y1 + 20       # ~20 pixels below heading
        x1 = heading_rect.x0 + 250      # width ~350px (tune for your PDFs)
        y1 = heading_rect.y1 + 150      # height ~180px (tune for your PDFs)
        crop_rect = fitz.Rect(x0, y0, x1, y1)
        pix = page.get_pixmap(clip=crop_rect, dpi=300)
        pix.save(save_path)
        remove_white_background(save_path)
        print(f"Saved fixed region for 'PROPORTIONS'")
        return save_path
    # Existing logic for other headings remains unchanged:
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
    if chosen_img:
        xref = chosen_img[0]
        pix = fitz.Pixmap(doc, xref)
        pix.save(save_path)
        remove_white_background(save_path)
        print(f"Saved image for '{heading_text}' from xref={xref}")
        return save_path
    # Default fallback crop for other headings
    crop_rect = fitz.Rect(
        heading_rect.x0,
        heading_rect.y1 + 5,
        heading_rect.x0 + fallback_size[0],
        heading_rect.y1 + fallback_size[1])
    pix = page.get_pixmap(clip=crop_rect, dpi=300)
    pix.save(save_path)
    remove_white_background(save_path)
    print(f"Saved fallback cropped region for '{heading_text}'")
    return save_path

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

    def extract_comments(text):
        pattern = r"Comments?:([\s\S]+?)(?:\n[A-Z][a-zA-Z\s\(\):]+[:\.]|\n\n|$)"
        match = re.search(pattern, text)
        if match:
            return match.group(1).strip().replace('\r', '')
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

    comments_value = find_value(r"Comments?[\s:\.]*([^\n]+)", text)
    additional_info = {
        "polish": find_value(r"Polish[\s\.]*([^\n]+)", text) or None,
        "symmetry": find_value(r"Symmetry[\s\.]*([^\n]+)", text) or None,
        "fluorescence": find_value(r"Fluorescence[\s\.]*([^\n]+)", text) or None,
        "inscription": find_value(r"Inscription\(s\)[\s\.]*([^\n]+)", text) or None,
        "comments": comments_value if comments_value else None,
    }

    # Extract Clarity Symbols
    symbols = []
    char_match = re.search(r"Clarity Characteristics\.+ (.+)", text)
    if char_match:
        characteristics = [c.strip() for c in char_match.group(1).split(',')]
        symbols.extend([{"icon": None, "name": char} for char in characteristics])
    elif "KEY TO SYMBOLS" in text:
        key_to_symbols_text = text.split("KEY TO SYMBOLS*")[1]
        characteristics = re.findall(r"\s*([a-zA-Z\s]+)\s*", key_to_symbols_text.split("Red symbols denote")[0])
        symbols.extend([{"icon": None, "name": char.strip()} for char in characteristics if char.strip()])

    # --- Improved image extraction section ---
    proportions_img_path = os.path.join(OUTPUT_DIR, "proportions.png")
    clarity_img_path = os.path.join(OUTPUT_DIR, "clarity_characteristics.png")
    proportions_img = extract_diagram_image_by_heading(page, doc, "PROPORTIONS", proportions_img_path)
    clarity_img = extract_diagram_image_by_heading(page, doc, "CLARITY CHARACTERISTICS", clarity_img_path)
    # ----------------------------------------

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

# FastAPI Router
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
