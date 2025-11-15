from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# Import routers (these files should be in same directory)
# import single_diamond
import multi_diamond

app = FastAPI(title="GIA PDF API")

# Ensure output directory exists (so StaticFiles mount won't fail)
OUTPUT_DIR = os.getenv("OUTPUT_DIR", "output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files (images & JSONs)
app.mount("/output", StaticFiles(directory=OUTPUT_DIR), name="output")

# Register routers (they define their own paths)
# app.include_router(single_diamond.router)
app.include_router(multi_diamond.router)

@app.get("/hello")
def hello():
    return {"message": "hello"}

@app.get("/")
def home():
    return {"message": "GIA PDF API is running with Single & Multi endpoints"}
