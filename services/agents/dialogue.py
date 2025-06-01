import os
import requests

import whisper
import torch
import PyPDF2
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter

embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-large-en-v1.5")

def extract_pdf_text(pdf_path):
    pages = []
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for page_num in range(len(reader.pages)):
            text = reader.pages[page_num].extract_text()
            if text.strip():  # Skip empty pages
                pages.append({
                    "content": text,
                    "metadata": {"source": pdf_path, "page": page_num + 1}
                })
    return pages

def split_pages(pages):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100
    )
    documents = []
    for page in pages:
        chunks = text_splitter.create_documents(
            [page["content"]],
            metadatas=[page["metadata"]]
        )
        documents.extend(chunks)
    return documents

def process_pdf_directory(directory):
    all_pages = []
    for file in os.listdir(directory):
        if file.lower().endswith('.pdf'):
            pdf_path = os.path.join(directory, file)
            all_pages.extend(extract_pdf_text(pdf_path))
    return all_pages

def process_image():
    pass

def process_speech(user_input, mock=True):
    # Receive speech input from user
    # Ideally perform planning

    # TODO Compute embeddings, perform semantic search

    # TODO Perform planning, or maybe planning should be done at the beginning step?

    # TODO Return PDF name and page number if relevant

    # TODO Should we use another LLM for reasoning...

    output = user_input if mock else None

    assert output is not None
    return output

device = "cuda" if torch.cuda.is_available() else "cpu"

def process_modality(user_input):
    # TODO Match on filetype
    pass

def process_dialogue(user_input_filepath, mock=True):
    # Receive input from user, which could be speech or image
    # model = whisper.load_model("tiny", device=device)
    output = None
    transcribe_endpoint = "http://localhost:8000/transcribe"

    while user_input_filepath:
        # Ensure modality = text or image
        modality = "speech" if mock else process_modality(user_input_filepath) # Some function of the user input
        match modality:
            case "image":
                pass
            case "speech":
                # user_input_speech = model.transcribe(user_input_filepath,
                #                                      fp16=True,
                #                                      language="en",
                #                                      condition_on_previous_text=False)

                user_input_speech = requests.post(transcribe_endpoint, files={"file": open(user_input_filepath, "rb")}).json()["text"]
                output = process_speech(user_input_speech)
            case None:
                pass

        # TODO Make proper dialogue loop
        user_input_filepath = None
    assert output is not None
    return output
