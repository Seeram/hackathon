from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS

# Step 1: Load and split PDF
loader = PyPDFLoader("mx10-mx20-maintaince.pdf")
docs = loader.load()
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = splitter.split_documents(docs)

# Step 2: GPU-enabled embeddings
embeddings = HuggingFaceEmbeddings(
    model_name='sentence-transformers/all-MiniLM-L6-v2',
    model_kwargs={"device": "cuda"}  # Use GPU here
)

# Step 3: Create and save vectorstore
vectorstore = FAISS.from_documents(chunks, embeddings)
vectorstore.save_local("mx20_index")
