import os
import re
import io
import json
import fitz  # PyMuPDF
from PIL import Image
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import shutil

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Change if frontend runs on different port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve output folder as static files
OUTPUT_DIR = "output"
os.makedirs(OUTPUT_DIR, exist_ok=True)
app.mount("/files", StaticFiles(directory=OUTPUT_DIR), name="files")


def scrape_gia_report_with_images(pdf_path: str):
    if not os.path.exists(pdf_path):
        return {"error": f"File not found: {pdf_path}"}

    try:
        with fitz.open(pdf_path) as doc:
            page = doc[0]
            text = page.get_text()

            if not text:
                return {"error": "No text could be extracted from the PDF."}

            # --- Regex Patterns ---
            patterns = {
                "GIA Report Number": r"GIA Report Number \.+ (\d+)",
                "Shape and Cutting Style": r"Shape and Cutting Style \.+ (.+?)\n",
                "Measurements": r"Measurements \.+ ([\d.\s\-x]+mm)",
                "Carat Weight": r"Carat Weight \.+ ([\d.]+\s+carat)",
                "Color Grade": r"Color Grade \.+ ([A-Z])",
                "Clarity Grade": r"Clarity Grade \.+ ([A-Z0-9]+)",
                "Polish": r"Polish \.+ ([\w\s]+)",
                "Symmetry": r"Symmetry \.+ ([\w\s]+)",
                "Fluorescence": r"Fluorescence \.+ ([\w\s]+)",
                "Inscription(s)": r"Inscription\(s\): ([\w\s]+)",
                "Clarity Characteristics": r"Clarity Characteristics\.+ ([\w,\s]+)"
            }

            # --- Extract Text Data ---
            scraped_data = {}
            for key, pattern in patterns.items():
                match = re.search(pattern, text)
                scraped_data[key] = match.group(1).strip() if match else None

            # --- Validate Report Number ---
            report_number = scraped_data.get("GIA Report Number") or "unknown_report"
            report_folder = os.path.join(OUTPUT_DIR, report_number)
            os.makedirs(report_folder, exist_ok=True)

            # --- Extract Images ---
            image_list = page.get_images(full=True)
            images_with_size = []
            for img in image_list:
                xref = img[0]
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                try:
                    image = Image.open(io.BytesIO(image_bytes))
                    images_with_size.append({'xref': xref, 'size': image.width * image.height})
                except Exception:
                    continue

            # Sort by size (largest first)
            images_with_size.sort(key=lambda i: i['size'], reverse=True)

            # Save top 2 largest images
            diagram_keys = ["PROPORTIONS", "CLARITY_CHARACTERISTICS"]
            image_filenames = {}

            for i, img_info in enumerate(images_with_size[:2]):
                xref = img_info['xref']
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]

                image_name = f"{diagram_keys[i].lower()}.{image_ext}"
                image_path = os.path.join(report_folder, image_name)

                with open(image_path, "wb") as f:
                    f.write(image_bytes)

                image_filenames[diagram_keys[i]] = f"{report_number}/{image_name}"

            # --- Parse Clarity Characteristics ---
            symbols_list = []
            if scraped_data.get("Clarity Characteristics"):
                for symbol_name in scraped_data["Clarity Characteristics"].split(','):
                    symbols_list.append({"icon": None, "name": symbol_name.strip()})

            # --- Final JSON ---
            output_json = {
                "GIANATURALDIAMONDGRADINGREPORT": {
                    "GIA Report Number": scraped_data.get("GIA Report Number"),
                    "Shape and Cutting Style": scraped_data.get("Shape and Cutting Style"),
                    "Measurements": scraped_data.get("Measurements")
                },
                "GRADINGRESULTS": {
                    "Carat Weight": scraped_data.get("Carat Weight"),
                    "Color Grade": scraped_data.get("Color Grade"),
                    "Clarity Grade": scraped_data.get("Clarity Grade")
                },
                "ADDITIONALGRADINGINFORMATION": {
                    "polish": scraped_data.get("Polish"),
                    "symmetry": scraped_data.get("Symmetry"),
                    "fluorescence": scraped_data.get("Fluorescence"),
                    "inscription": scraped_data.get("Inscription(s)")
                },
                "PROPORTIONS": f"/files/{image_filenames.get('PROPORTIONS')}" if image_filenames.get('PROPORTIONS') else None,
                "CLARITY_CHARACTERISTICS": f"/files/{image_filenames.get('CLARITY_CHARACTERISTICS')}" if image_filenames.get('CLARITY_CHARACTERISTICS') else None,
                "symbols": symbols_list
            }

            # Save JSON
            json_path = os.path.join(report_folder, f"{report_number}.json")
            with open(json_path, "w") as jf:
                json.dump(output_json, jf, indent=4)

            output_json["json_file"] = f"/files/{report_number}/{report_number}.json"
            return output_json

    except Exception as e:
        return {"error": f"An error occurred: {e}"}

@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    temp_pdf_path = os.path.join(OUTPUT_DIR, file.filename)
    with open(temp_pdf_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = scrape_gia_report_with_images(temp_pdf_path)

    os.remove(temp_pdf_path)  # Remove temporary uploaded file

    return JSONResponse(content=result)
