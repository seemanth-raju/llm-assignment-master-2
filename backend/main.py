from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from starlette.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, List
from PyPDF2 import PdfReader
import docx
import re,os
import pandas as pd
import requests
from pymongo import MongoClient


MONGO_URI = "mongodb+srv://Admin:Seemanth11@cluster0.5zclou7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME = "question_answers"
COLLECTION_NAME = "questions"

load_dotenv()
API_KEY = os.getenv("API_KEY")


API_URL = "https://api-inference.huggingface.co/models/HuggingFaceH4/starchat2-15b-v0.1"
headers = {"Authorization": f"Bearer {API_KEY}"}


class Response(BaseModel):
    result: str | None

origins = [
    "http://localhost:8080",
    "http://localhost",
    "http://localhost:3000"
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def store_in_mongodb(question_text, file_question, result):
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]

    document = {
        "question_text": question_text,
        "file_question": file_question,
        "result": result
    }

    collection.insert_one(document)

    client.close()

def retrieve_from_mongodb() -> List[dict]:
    # Connect to MongoDB
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]
    documents = list(collection.find({}, {"_id": 0}))
    client.close()
    return documents

def process_file(file: UploadFile) -> str:
    if file.content_type == "text/csv":  
        df = pd.read_csv(file.file)
        cell_strings = []
        for index, row in df.iterrows():
            for value in row:
                if pd.notna(value):  
                    cell_strings.append(str(value))
        result_string = "\n".join(cell_strings)
        return result_string
    elif file.content_type == "text/plain":  
        return file.file.read().decode("utf-8")  
    elif file.content_type == "application/pdf":  
        pdf_reader = PdfReader(file.file)  
        num_pages = len(pdf_reader.pages)  
        text = ""
        for page_num in range(num_pages):  
            text += pdf_reader.pages[page_num].extract_text()  
        return text
    elif file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":  
        docx_text = ""
        doc = docx.Document(file.file)  
        for paragraph in doc.paragraphs:  
            docx_text += paragraph.text + "\n"  
        return docx_text
    else:
        return "Unsupported file format. Please upload a CSV, TXT, or PDF file."


def process_result(result, question):
    pattern = re.compile(r'(^|\n)(%s|result)[:\s]+.*?(\n|\Z)' % re.escape(question), re.IGNORECASE)
    processed_result = re.sub(pattern, '\n', result)
    return processed_result.strip()

def modify_text(text):
    text = ' '.join(text.split())
    text = text.capitalize()
    text = re.sub(r'\*\*(.*?)\*\*', r'\n\n\1:', text)
    lines = text.split('\n')
    modified_lines = []
    for line in lines:
        if line.strip().startswith('*'):
            modified_lines.append('- ' + line.strip()[1:])
        else:
            modified_lines.append(line)
    text = '\n'.join(modified_lines)

    return text

def query(payload):
	response = requests.post(API_URL, headers=headers, json=payload)
	return response.json()

	
@app.post("/predict", response_model=Response)
async def predict(question: str = Form(None), file: UploadFile = File(None)) -> Any:
    if question:
        output = query({"inputs": question})
        if not output:
            raise HTTPException(status_code=500, detail="Error occurred during processing.")
        result = output[0]['generated_text']
    elif file:
        question = process_file(file)
        output1 = query({"inputs": question})
        if not output1:
            raise HTTPException(status_code=500, detail="Error occurred during processing.")
        result = output1[0]['generated_text']
    else:
        raise HTTPException(status_code=400, detail="No question or file provided.")
    result = process_result(result, question)
    result = modify_text(result)
    store_in_mongodb(question, file.filename if file else None, result)

    return {"result": result}

@app.get("/retrieve-data", response_class=JSONResponse)
async def retrieve_data() -> List[dict]:
    data = retrieve_from_mongodb()
    return data