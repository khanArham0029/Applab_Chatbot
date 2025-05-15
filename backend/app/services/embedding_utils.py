import re
from pathlib import Path
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from app.core.config import GEMINI_KEY

def sanitize_filename(name):
    return re.sub(r'[\\/*?:"<>|]', "_", name)

def extract_text_from_pdfs(pdf_paths):
    text = ""
    for pdf in pdf_paths:
        reader = PdfReader(pdf)
        for page in reader.pages:
            text += page.extract_text() or ""
    return text

def split_text_to_chunks(text, chunk_size=15000, chunk_overlap=100):
    splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    return splitter.split_text(text)

def get_or_create_faiss_embeddings(text_chunks, file_name):
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=GEMINI_KEY
    )
    safe_name = sanitize_filename(file_name)
    dir_path = Path(f"embeddings_{safe_name}")
    dir_path.mkdir(parents=True, exist_ok=True)
    faiss_path = dir_path / f"{safe_name}.faiss"

    if faiss_path.exists():
        print("📂 Loading existing FAISS index...")
        return FAISS.load_local(str(dir_path), embeddings, allow_dangerous_deserialization=True)

    print("✨ Creating new FAISS index...")
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    vector_store.save_local(str(dir_path))
    return vector_store
