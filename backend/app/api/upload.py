from fastapi import APIRouter, UploadFile, File
from app.services.embedding_utils import extract_text_from_pdfs, split_text_to_chunks, get_or_create_faiss_embeddings

router = APIRouter()

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    contents = await file.read()
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(contents)

    text = extract_text_from_pdfs([temp_path])
    chunks = split_text_to_chunks(text)
    vec_store = get_or_create_faiss_embeddings(chunks, file.filename)
    return {"status": "success", "message": "Document processed", "filename": file.filename}
