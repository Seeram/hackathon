import os
import PyPDF2
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter

# 1. Setup embeddings model
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# 2. Extract text from PDFs with page information
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

# The rest of the code remains the same
def process_pdf_directory(directory):
    all_pages = []
    for file in os.listdir(directory):
        if file.lower().endswith('.pdf'):
            pdf_path = os.path.join(directory, file)
            all_pages.extend(extract_pdf_text(pdf_path))
    return all_pages

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


def build_vector_store(documents, save_path="data/vectorstore"):
    vector_store = Chroma.from_documents(
        documents, 
        embeddings,
        persist_directory=save_path
    )
    return vector_store

def search_pdfs(query, save_path="data/vectorstore", k=3):
    vector_store = Chroma(
        persist_directory=save_path,
        embedding_function=embeddings
    )
    results = vector_store.similarity_search(query, k=k)
    return [(result.page_content, result.metadata["source"], result.metadata["page"]) 
            for result in results]

# Example usage:
# 1. Ingest PDFs
# pages = process_pdf_directory("path/to/pdfs")
# documents = split_pages(pages)
# build_vector_store(documents)

# 2. Search (later)
# results = search_pdfs("your search query")
# for content, source, page in results:
#     print(f"PDF: {os.path.basename(source)}, Page: {page}")
#     print(f"Content: {content[:100]}...\n")

if __name__ == "__main__":
    script_dir = os.path.dirname(__file__)
    py_dir = os.path.dirname(script_dir)
    pdfs_dir = os.path.join(py_dir, "data/pdfs")
    pages = process_pdf_directory(pdfs_dir)
    documents = split_pages(pages)
    build_vector_store(documents)
    
    query = input("Enter query: ") # "How to finalize the commisioning for MR elevators"
    results = search_pdfs(f"{query}")
    for content, source, page in results:
        print(f"PDF: {os.path.basename(source)}, Page: {page}")
        print(f"Content: {content[:100]}...\n")
