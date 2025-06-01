import os
import requests

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-large-en-v1.5")

def process_image():
    pass

def search_pdfs(query, save_path="data/vectorstore", k=3):
    vector_store = Chroma(
        persist_directory=save_path,
        embedding_function=embeddings
    )
    results = vector_store.similarity_search(query, k=k)
    return [(result.page_content, result.metadata["source"], result.metadata["page"])
            for result in results]

def process_speech(user_input, mock=True):
    # Receive speech input from user
    # Ideally perform planning

    # Compute embeddings, perform semantic search
    # embedding_endpoint = "http://embedding_service:8000/embed"
    # payload = {"text": user_input}
    # response = requests.post(embedding_endpoint, json=payload).json()
    # embedding = response["embeddings"] # list
    planning_endpoint = "http://planning_service:8002/plan"

    output = search_pdfs(user_input)
    search_results = []
    for content, source, page in output:
        search_results.append({"pdf": f"{os.path.basename(source)}", "page": f"{page}"})

    plan = requests.post(planning_endpoint, json={"context": "you are a good emacs user", "instruction": "prepare a plan for someone to start emacs, via a good config file"}).json()["plan"]

    # TODO Perform planning, or maybe planning should be done at the beginning step?

    # TODO Should we use another LLM for reasoning...

    assert output is not None
    return plan
    # return search_results

def process_modality(user_input):
    # TODO Match on filetype
    pass

def process_dialogue(user_input_filepath, mock=True):
    # Receive input from user, which could be speech or image
    output = None
    transcribe_endpoint = "http://transcribe_service:8001/transcribe"

    while user_input_filepath:
        # Ensure modality = text or image
        modality = "speech" if mock else process_modality(user_input_filepath) # Some function of the user input
        match modality:
            case "image":
                user_input_image = None
                pass
            case "speech":
                # TODO Currently limited to speech of 30s
                user_input_speech = requests.post(transcribe_endpoint, files={"file": open(user_input_filepath, "rb")}).json()["text"]
                output = process_speech(user_input_speech)
            case None:
                pass

        # TODO Make proper dialogue loop
        user_input_filepath = None
    assert output is not None
    return output
