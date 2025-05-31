import speech_recognition as sr
from langchain.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

# 🎧 Initialize recognizer
recognizer = sr.Recognizer()

# 🎤 Listen to user's voice input
with sr.Microphone() as source:
    print("🔊 Please ask your elevator repair question...")
    recognizer.adjust_for_ambient_noise(source, duration=0.5)
    audio = recognizer.listen(source)

    try:
        query = recognizer.recognize_google(audio)
        print(f"🗣️ You asked: {query}")
    except sr.UnknownValueError:
        print("❌ Could not understand the audio.")
        exit()
    except sr.RequestError as e:
        print(f"❌ Error with speech recognition service: {e}")
        exit()

# 🤖 Load embedding model using GPU
embeddings = HuggingFaceEmbeddings(
    model_name='sentence-transformers/all-MiniLM-L6-v2',
    model_kwargs={"device": "cuda"}
)

# 📚 Load vectorstore (your pre-embedded PDF)
vectorstore = FAISS.load_local(
    "mx20_index", 
    embeddings, 
    allow_dangerous_deserialization=True
)

# 🔍 Perform semantic search
results = vectorstore.similarity_search(query, k=2)

# 📄 Show results
print("\n🔧 Matching sections from the elevator manual:")
for i, res in enumerate(results, 1):
    print(f"\n--- Match {i} ---\n{res.page_content.strip()}")
