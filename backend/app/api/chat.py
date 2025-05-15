from fastapi import APIRouter
from pydantic import BaseModel
from app.services.embedding_utils import sanitize_filename
from app.services.chatbot import get_answer_from_context
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from app.core.config import GEMINI_KEY

router = APIRouter()

class ChatRequest(BaseModel):
    filename: str
    question: str

@router.post("/chat")
async def chat(request: ChatRequest):  # ✅ <--- this is the key
    safe_name = sanitize_filename(request.filename)
    dir_path = f"embeddings_{safe_name}"
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=GEMINI_KEY)
    db = FAISS.load_local(dir_path, embeddings, allow_dangerous_deserialization=True)
    docs = db.similarity_search(request.question)
    response = get_answer_from_context(docs, request.question)
    return {"answer": response}
