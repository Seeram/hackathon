from langchain.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

# Use the same GPU-enabled embedding model
embeddings = HuggingFaceEmbeddings(
    model_name='sentence-transformers/all-MiniLM-L6-v2',
    model_kwargs={"device": "cuda"}
)

# ✅ Load saved vectorstore with safety flag
vectorstore = FAISS.load_local(
    "mx20_index", 
    embeddings, 
    allow_dangerous_deserialization=True
)

# Run query
query = "elevator door does not open"
results = vectorstore.similarity_search(query, k=2)

# Display top results
print("\n🔍 Matching sections from manual:")
for i, res in enumerate(results, 1):
    print(f"\n--- Match {i} ---\n{res.page_content.strip()}")
