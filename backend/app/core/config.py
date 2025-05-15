import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_KEY = os.getenv("gemini_key")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
