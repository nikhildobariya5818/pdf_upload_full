from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import fitz  # PyMuPDF
import re
import json
import os
import shutil
from fastapi.middleware.cors import CORSMiddleware
import qrcode

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def create_and_save_qr_code(report_number, folder_path):
    # Construct URL for GIA report check (strip spaces from report number)
    url = f"https://www.gia.edu/report-check?reportno={report_number.strip().replace(' ', '')}"
    qr = qrcode.make(url)
    qr_path = os.path.join(folder_path, 'qrcode.png')
    qr.save(qr_path)
    return qr_path

def process_gia_pdf(pdf_path):
    """
    Extracts data and images from a single GIA PDF, and saves them
    into a folder named after the GIA report number.
    Returns the extracted JSON data or error message.
    """
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        return {"error": f"Error opening PDF: {e}"}

    page = doc[0]
    text = page.get_text("text")

    # --- Helper function to search for values ---
    def find_value(pattern, text_block=text):
        match = re.search(pattern, text_block, re.MULTILINE)
        return match.group(1).strip() if match else None

    # --- Extract GIA Report Number to use for folder/file names ---
    gia_report_number = find_value(r"GIA Report Number \.+ ([\d\s]+)")
    if not gia_report_number:
        doc.close()
        return {"error": "Could not find GIA Report Number in the PDF."}

    # --- Create a dedicated folder for this report ---
    folder_name = gia_report_number.strip().replace(' ', '_')
    os.makedirs(folder_name, exist_ok=True)

    # --- Generate QR code and save it in the folder ---
    qr_code_path = create_and_save_qr_code(gia_report_number, folder_name)

    # --- Determine Report Type ---
    report_type = "GIANATURALDIAMONDGRADINGREPORT"
    if "DOSSIER" in text:
        report_type = "GIANATURALDIAMONDOSSIER"

    # --- Extract Text Data ---
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

    # --- Extract Clarity Symbols ---
    symbols = []
    char_match = re.search(r"Clarity Characteristics\.+ (.+)", text)
    if char_match:
        characteristics = [c.strip() for c in char_match.group(1).split(',')]
        symbols.extend([{"icon": None, "name": char} for char in characteristics])
    elif "KEY TO SYMBOLS" in text:
        key_to_symbols_text = text.split("KEY TO SYMBOLS*")[1]
        characteristics = re.findall(r"\s*([a-zA-Z\s]+)\s*", key_to_symbols_text.split("Red symbols denote")[0])
        symbols.extend([{"icon": None, "name": char.strip()} for char in characteristics if char.strip()])

    # --- Extract and Save Images ---
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

    # --- Assemble Final JSON Structure ---
    final_data = {
        report_type: gia_report_data,
        "GRADINGRESULTS": grading_results,
        "ADDITIONALGRADINGINFORMATION": additional_info,
        "PROPORTIONS": proportions_img_path.replace("\\", "/") if proportions_img_path else None,
        "CLARITYCHARACTERISTICS": clarity_img_path.replace("\\", "/") if clarity_img_path else None,
        "QRCODE": qr_code_path.replace("\\", "/") if qr_code_path else None,
        "symbols": symbols
    }

    # --- Save JSON file ---
    json_file_path = os.path.join(folder_name, f"{folder_name}.json")
    with open(json_file_path, 'w') as jf:
        json.dump(final_data, jf, indent=4)

    doc.close()
    return final_data

@app.post("/upload-multi-pdf/")
async def upload_multi_pdf(file: UploadFile = File(...)):
    # Save uploaded file temporarily
    temp_pdf_path = file.filename
    with open(temp_pdf_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Process PDF
    result = process_gia_pdf(temp_pdf_path)

    # Remove temp file after processing
    os.remove(temp_pdf_path)

    return JSONResponse(content=result)
