from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Import endpoints from both files
import single_diamond
import multi_diamond

app = FastAPI(title="GIA PDF API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files (images & JSONs)
app.mount("/files", StaticFiles(directory="output"), name="files")

# Include routes from both files
app.post("/upload-pdf/")(single_diamond.upload_pdf)
app.post("/upload-multi-pdf/")(multi_diamond.upload_multi_pdf)

@app.get("/hello")
def hello():
    return {"message": "hello"}

# Optional root endpoint
@app.get("/")
def home():
    return {"message": "GIA PDF API is running with Single & Multi endpoints"}
# Optional root endpoint
@app.get("/")
def home():
    return {"message": "GIA PDF API is running with Single & Multi endpoints"}
