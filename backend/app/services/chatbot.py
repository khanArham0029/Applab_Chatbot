from langchain.prompts import PromptTemplate
from langchain.schema.output_parser import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import GEMINI_KEY

def get_answer_from_context(context_chunks, question):
    model = ChatGoogleGenerativeAI(model="gemini-1.5-flash", api_key=GEMINI_KEY)
    prompt_template = """
    Answer the question as detailed as possible from the provided context. 
    If the answer is not in the context, say, "Answer is not available in the Context." 
    Don't make up information.

    Context:
    {context}

    Question:
    {question}

    Answer:
    """

    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    chain = prompt | model | StrOutputParser()
    return chain.invoke({"context": context_chunks, "question": question})
