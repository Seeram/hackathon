from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS

# Step 1: Load the PDF
pdf_path = "mx10-mx20-maintaince.pdf"  # Use your correct path
loader = PyPDFLoader(pdf_path)
docs = loader.load()

# Step 2: Split the text into chunks
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = splitter.split_documents(docs)

# Step 3: Embed the text
embeddings = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
vectorstore = FAISS.from_documents(chunks, embeddings)

# Step 4: Run a test query (e.g., user says "door not opening")
query = "elevator door does not open"
results = vectorstore.similarity_search(query, k=2)

# Step 5: Display the top-matching repair instructions
print("\n🔍 Matching sections from manual:")
for i, res in enumerate(results, 1):
    print(f"\n--- Match {i} ---\n{res.page_content.strip()}")
