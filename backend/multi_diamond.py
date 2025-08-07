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

# Ensure output directory exists
OUTPUT_DIR = 'output'


def clear_output_directory():
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    os.makedirs(OUTPUT_DIR, exist_ok=True)


def remove_white_background(image_path):
    """Remove white background from an image and save with transparency."""
    img = Image.open(image_path).convert("RGBA")
    datas = img.getdata()
    new_data = []
    for item in datas:
        # Turn white pixels transparent
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

    # Convert white to transparent
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
    """Generate wide Code128 barcodes for both 10 and 12 digits with transparent background."""
    number = str(start_digit) + ''.join(str(random.randint(0, 9)) for _ in range(number_of_digits - 1))

    # Add spaces for visual width
    number_with_spaces = f"{' ' * 4}{number}{' ' * 4}"

    code = barcode.get('code128', number_with_spaces, writer=ImageWriter())

    writer_options = {
        'write_text': False,
        'module_width': 3.0 if number_of_digits == 10 else 3.5,
        'module_height': 50.0,
        'quiet_zone': 15.0,
        'font_size': 0
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
    """Extract 'KEY TO SYMBOLS' section as image."""
    page = doc[page_index]
    text_instances = page.search_for("KEY TO SYMBOLS*")
    if not text_instances:
        return None
    
    rect = text_instances[0]
    rect.y1 += 60  # Expand downward to include the explanation
    rect.x0 -= 5
    rect.x1 += 5
    pix = page.get_pixmap(clip=rect, dpi=300)
    pix.save(save_path)
    remove_white_background(save_path)
    return save_path


def extract_notes_image(doc, page_index, save_path):
    """Extract the note text about red/green symbols as image."""
    page = doc[page_index]
    text_instances = page.search_for("* Red symbols denote internal characteristics (inclusions). Green or black symbols denote external characteristics")
    if not text_instances:
        return None

    rect = text_instances[0]
    rect.y1 += 25   # Expand down for full text
    rect.x0 -= 5
    rect.x1 += 5
    pix = page.get_pixmap(clip=rect, dpi=300)
    pix.save(save_path)
    remove_white_background(save_path)
    return save_path


def process_gia_pdf(pdf_path):
    clear_output_directory()

    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        return {"error": f"Error opening PDF: {e}"}

    page = doc[0]
    text = page.get_text("text")

    def find_value(pattern, text_block=text):
        match = re.search(pattern, text_block, re.MULTILINE)
        return match.group(1).strip() if match else None

    # Extract GIA Report Number
    gia_report_number = find_value(r"GIA Report Number \.+ ([\d\s]+)")
    if not gia_report_number:
        doc.close()
        return {"error": "Could not find GIA Report Number in the PDF."}

    # Generate QR and Barcodes
    qr_code_path = create_and_save_qr_code(gia_report_number, OUTPUT_DIR)
    barcode12_number, barcode12_path = generate_unique_barcode(12, 1, os.path.join(OUTPUT_DIR, "barcode12"))
    barcode10_number, barcode10_path = generate_unique_barcode(10, 1, os.path.join(OUTPUT_DIR, "barcode10"))

    # Report Type
    report_type = "GIANATURALDIAMONDGRADINGREPORT"
    if "DOSSIER" in text:
        report_type = "GIANATURALDIAMONDOSSIER"

    # Extract Report Data
    gia_report_data = {
        "GIAReportNumber": gia_report_number,
        "ShapeandCuttingStyle": find_value(r"Shape and Cutting Style \.+ (.+)"),
        "Measurements": find_value(r"Measurements \.+ (.+)"),
    }
    grading_results = {
    "CaratWeight": find_value(r"Carat Weight\s*\.\s(.+)"),
    "ColorGrade": find_value(r"Color Grade\s*\.\s(.+)"),
    "ClarityGrade": find_value(r"Clarity Grade\s*\.\s(.+)"),
    "CutGrade": find_value(r"Cut Grade\s*\.\s(.+)"),
    }
    additional_info = {
        "polish": find_value(r"Polish \.+ (.+)"),
        "symmetry": find_value(r"Symmetry \.+ (.+)"),
        "fluorescence": find_value(r"Fluorescence \.+ (.+)"),
        "inscription": find_value(r"Inscription\(s\): (.+)"),
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

    # Extract and Save Images
        # Extract and Save Images Correctly Based on Section Header Positions
    proportions_img_path = None
    clarity_img_path = None

    proportions_title_rects = page.search_for("PROPORTIONS")
    clarity_title_rects = page.search_for("CLARITY CHARACTERISTICS")

    proportions_y = proportions_title_rects[0].y0 if proportions_title_rects else None
    clarity_y = clarity_title_rects[0].y0 if clarity_title_rects else None

    images = page.get_images(full=True)
    image_mappings = {}

    if proportions_y is not None and clarity_y is not None and images:
        # Consider only large images (likely diagrams)
        diagram_images = [img for img in images if page.get_image_bbox(img).get_area() > 10000]

        for img in diagram_images:
            xref = img[0]
            rect = page.get_image_bbox(img)
            img_y = rect.y0

            # Assign based on proximity to section titles
            if abs(img_y - proportions_y) < abs(img_y - clarity_y):
                if 'PROPORTIONS' not in image_mappings:
                    image_mappings['PROPORTIONS'] = xref
            else:
                if 'CLARITYCHARACTERISTICS' not in image_mappings:
                    image_mappings['CLARITYCHARACTERISTICS'] = xref

    # Save the images to file with correct naming
    if 'PROPORTIONS' in image_mappings:
        proportions_img_path = os.path.join(OUTPUT_DIR, "proportions.png")
        pix = fitz.Pixmap(doc, image_mappings['PROPORTIONS'])
        pix.save(proportions_img_path)
        remove_white_background(proportions_img_path)

    if 'CLARITYCHARACTERISTICS' in image_mappings:
        clarity_img_path = os.path.join(OUTPUT_DIR, "clarity_characteristics.png")
        pix = fitz.Pixmap(doc, image_mappings['CLARITYCHARACTERISTICS'])
        pix.save(clarity_img_path)
        remove_white_background(clarity_img_path)


    # Extract extra images
    key_to_symbols_img_path = os.path.join(OUTPUT_DIR, "key_to_symbols.png")
    key_to_symbols_img = extract_key_to_symbols_image(doc, 0, key_to_symbols_img_path)

    notes_img_path = os.path.join(OUTPUT_DIR, "notes.png")
    notes_img = extract_notes_image(doc, 0, notes_img_path)

    # Extract report date
    report_date = extract_report_date(text)

    # Assemble final data
    final_data = {
        "ReportDate": report_date,
        report_type: gia_report_data,
        "GRADINGRESULTS": grading_results,
        "ADDITIONALGRADINGINFORMATION": additional_info,
        "PROPORTIONS": proportions_img_path.replace("\\", "/") if proportions_img_path else None,
        "CLARITYCHARACTERISTICS": clarity_img_path.replace("\\", "/") if clarity_img_path else None,
        "KEYTOSYMBOLS": key_to_symbols_img.replace("\\", "/") if key_to_symbols_img else None,
        "NOTES": notes_img.replace("\\", "/") if notes_img else None,
        "QRCODE": qr_code_path.replace("\\", "/") if qr_code_path else None,
        "symbols": symbols,
        "BARCODE12": {"number": barcode12_number, "image": barcode12_path.replace("\\", "/")},
        "BARCODE10": {"number": barcode10_number, "image": barcode10_path.replace("\\", "/")}
    }

    # Save JSON
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
