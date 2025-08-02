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

# Ensure output directory exists
OUTPUT_DIR = 'output'


def clear_output_directory():
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    os.makedirs(OUTPUT_DIR, exist_ok=True)


def create_and_save_qr_code(report_number, folder_path):
    url = f"https://www.gia.edu/report-check?reportno={report_number.strip().replace(' ', '')}"
    qr = qrcode.make(url)
    qr_path = os.path.join(folder_path, 'qrcode.png')
    qr.save(qr_path)
    return qr_path


def generate_unique_barcode(number_of_digits, start_digit, save_path):
    """
    Generate wide Code128 barcodes for both 10 and 12 digits.
    Both barcodes are visually wide and fully scannable.
    """
    # Generate numeric string
    number = str(start_digit) + ''.join(str(random.randint(0, 9)) for _ in range(number_of_digits - 1))

    # Add spaces for visual width
    number_with_spaces = f"{' ' * 2}{number}{' ' * 2}"

    # Always use Code128 for width control
    barcode_number = number_with_spaces
    code = barcode.get('code128', barcode_number, writer=ImageWriter())

    # Adjust width based on digits
    writer_options = {
        'write_text': False,
        'module_width': 4.0 if number_of_digits == 10 else 3.5,  # 10-digit is slightly wider
        'module_height': 50.0,
        'quiet_zone': 15.0,  # Padding around barcode
        'font_size': 0
    }

    filename = code.save(save_path, options=writer_options)
    return number_with_spaces, filename


def extract_report_date(text):
    # Pattern matches "March 02, 2022"
    pattern = r"\b([A-Z][a-z]+ \d{2}, \d{4})\b"
    match = re.search(pattern, text)
    if match:
        return match.group(1)
    return None


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

    # Generate QR Code and Barcodes
    qr_code_path = create_and_save_qr_code(gia_report_number, OUTPUT_DIR)
    barcode12_number, barcode12_path = generate_unique_barcode(
        number_of_digits=12,
        start_digit=1,
        save_path=os.path.join(OUTPUT_DIR, "barcode12")
    )
    barcode10_number, barcode10_path = generate_unique_barcode(
        number_of_digits=10,
        start_digit=1,
        save_path=os.path.join(OUTPUT_DIR, "barcode10")
    )

    # Determine Report Type
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
        "CaratWeight": find_value(r"Carat Weight \.+ (.+)"),
        "ColorGrade": find_value(r"Color Grade \.+ (.+)"),
        "ClarityGrade": find_value(r"Clarity Grade \.+ (.+)"),
        "CutGrade": find_value(r"Cut Grade \.+ (.+)"),
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
    proportions_img_path = None
    clarity_img_path = None
    images = page.get_images(full=True)
    if images:
        main_diagrams = sorted(
            [img for img in images if page.get_image_bbox(img).get_area() > 10000],
            key=lambda img: page.get_image_bbox(img).x0
        )
        if len(main_diagrams) > 0:
            proportions_img_path = os.path.join(OUTPUT_DIR, "proportions.png")
            xref = main_diagrams[0][0]
            pix = fitz.Pixmap(doc, xref)
            pix.save(proportions_img_path)
        if len(main_diagrams) > 1:
            clarity_img_path = os.path.join(OUTPUT_DIR, "clarity_characteristics.png")
            xref = main_diagrams[1][0]
            pix = fitz.Pixmap(doc, xref)
            pix.save(clarity_img_path)

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

# For main to register: use "upload_multi_pdf" as in main.py
upload_multi_pdf = upload_multi_pdf
