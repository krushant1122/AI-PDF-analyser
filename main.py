import spacy
from spacy.cli import download
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
import fitz  # PyMuPDF
import logging
from transformers import pipeline
from database import SessionLocal, Document

# Check if the model is installed, if not, install it
try:
    nlp = spacy.load("en_core_web_trf")
except OSError:
    download("en_core_web_trf")
    nlp = spacy.load("en_core_web_trf")

class QuestionRequest(BaseModel):
    document_id: int
    question: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to restrict access to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize the Hugging Face pipeline for question answering
qa_pipeline = pipeline("question-answering", model="deepset/roberta-base-squad2")

@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if file.content_type != 'application/pdf':
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    pdf_text = extract_text_from_pdf(file.file)
    document = Document(filename=file.filename, content=pdf_text)
    db.add(document)
    db.commit()
    db.refresh(document)
    
    return {"filename": file.filename, "document_id": document.id}

def extract_text_from_pdf(file):
    document = fitz.open(stream=file.read(), filetype="pdf")
    text = ""
    for page in document:
        text += page.get_text()
    return text

@app.post("/ask/")
async def ask_question(request: QuestionRequest, db: Session = Depends(get_db)):
    logger.info(f"Received question request: {request}")
    document = db.query(Document).filter(Document.id == request.document_id).first()
    if not document:
        logger.error(f"Document ID {request.document_id} not found")
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Use Hugging Face pipeline for question answering
    context = document.content
    question = request.question
    
    try:
        result = qa_pipeline(question=question, context=context, max_length=150)
        answer = result['answer']
        logger.info(f"Answer: {answer}")
        return {"answer": answer}
    except Exception as e:
        logger.error(f"Error generating answer: {e}")
        raise HTTPException(status_code=500, detail="Error generating answer.")
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
