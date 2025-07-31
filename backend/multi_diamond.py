from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import fitz  # PyMuPDF
import re
import json
import os
import shutil
from fastapi.middleware.cors import CORSMiddleware
import qrcode
import barcode
from barcode.writer import ImageWriter
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create QR code
def create_and_save_qr_code(report_number, folder_path):
    url = f"https://www.gia.edu/report-check?reportno={report_number.strip().replace(' ', '')}"
    qr = qrcode.make(url)
    qr_path = os.path.join(folder_path, 'qrcode.png')
    qr.save(qr_path)
    return qr_path

# Generate barcode PNG without number
def generate_unique_barcode(number_of_digits, start_digit, save_path, barcode_type):
    # Generate a unique number as a string
    number = str(start_digit) + ''.join(str(random.randint(0, 9)) for _ in range(number_of_digits - 1))

    # Select barcode class
    if barcode_type == 'upca':  # 12 digits
        code = barcode.get('upca', number, writer=ImageWriter())
    elif barcode_type == 'code128':  # For any digit length
        code = barcode.get('code128', number, writer=ImageWriter())
    else:
        raise ValueError("Unsupported barcode type")

    # Barcode style configuration
    writer_options = {
        'write_text': False,    # Hide numbers
        'module_width': 0.8,    # Bar width (thicker bars)
        'module_height': 35.0,  # Bar height
        'quiet_zone': 1.0,      # Small white margins
        'font_size': 0          # No font
    }

    # Save barcode as PNG
    filename = code.save(save_path, options=writer_options)
    return number, filename

# Process GIA PDF
def process_gia_pdf(pdf_path):
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

    folder_name = gia_report_number.strip().replace(' ', '_')
    os.makedirs(folder_name, exist_ok=True)

    # Generate QR code
    qr_code_path = create_and_save_qr_code(gia_report_number, folder_name)

    # Generate Barcodes (PNG without numbers)
    barcode12_number, barcode12_path = generate_unique_barcode(
        number_of_digits=12,
        start_digit=1,
        save_path=os.path.join(folder_name, "barcode12"),
        barcode_type='upca'
    )
    barcode10_number, barcode10_path = generate_unique_barcode(
        number_of_digits=10,
        start_digit=1,
        save_path=os.path.join(folder_name, "barcode10"),
        barcode_type='code128'
    )

    # Determine Report Type
    report_type = "GIANATURALDIAMONDGRADINGREPORT"
    if "DOSSIER" in text:
        report_type = "GIANATURALDIAMONDOSSIER"

    # Extract Text Data
    gia_report_data = {
        "GIA Report Number": gia_report_number,
        "Shape and Cutting Style": find_value(r"Shape and Cutting Style \.+ (.+)"),
        "Measurements": find_value(r"Measurements \.+ (.+)"),
    }
    grading_results = {
        "Carat Weight": find_value(r"Carat Weight \.+ (.+)"),
        "Color Grade": find_value(r"Color Grade \.+ (.+)"),
        "Clarity Grade": find_value(r"Clarity Grade \.+ (.+)"),
        "Cut Grade": find_value(r"Cut Grade \.+ (.+)"),
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
            proportions_img_path = os.path.join(folder_name, "proportions.png")
            xref = main_diagrams[0][0]
            pix = fitz.Pixmap(doc, xref)
            pix.save(proportions_img_path)
        if len(main_diagrams) > 1:
            clarity_img_path = os.path.join(folder_name, "clarity_characteristics.png")
            xref = main_diagrams[1][0]
            pix = fitz.Pixmap(doc, xref)
            pix.save(clarity_img_path)

    # Final JSON
    final_data = {
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
    json_file_path = os.path.join(folder_name, f"{folder_name}.json")
    with open(json_file_path, 'w') as jf:
        json.dump(final_data, jf, indent=4)

    doc.close()
    return final_data

# FastAPI endpoint
@app.post("/upload-multi-pdf/")
async def upload_multi_pdf(file: UploadFile = File(...)):
    temp_pdf_path = file.filename
    with open(temp_pdf_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = process_gia_pdf(temp_pdf_path)
    os.remove(temp_pdf_path)

    return JSONResponse(content=result)
