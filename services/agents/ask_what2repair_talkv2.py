import speech_recognition as sr
import pyttsx3
import re
from langchain.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
import textwrap

# 🧠 Setup TTS
engine = pyttsx3.init()
engine.setProperty("rate", 160)

# 🎧 Setup Speech Recognition
recognizer = sr.Recognizer()

with sr.Microphone() as source:
    print("🔊 Ask your elevator repair question...")
    recognizer.adjust_for_ambient_noise(source, duration=0.5)
    audio = recognizer.listen(source)

    try:
        query = recognizer.recognize_google(audio)
        print(f"\n🗣️ You asked: {query}")
    except sr.UnknownValueError:
        engine.say("Sorry, I didn't catch that.")
        engine.runAndWait()
        exit()
    except sr.RequestError as e:
        engine.say("Speech service error.")
        engine.runAndWait()
        exit()

# 📚 Load vectorstore
embeddings = HuggingFaceEmbeddings(
    model_name='sentence-transformers/all-MiniLM-L6-v2',
    model_kwargs={"device": "cuda"}
)

vectorstore = FAISS.load_local(
    "mx20_index", embeddings,
    allow_dangerous_deserialization=True
)

# 🔍 Search top 3 matches
results = vectorstore.similarity_search(query, k=3)

if results:
    # Combine all matching text
    combined = "\n\n".join(res.page_content.strip() for res in results)
    print("\n🔧 Repair Info:\n", combined)

    # ✅ Break into 300-character chunks for speech
    chunks = textwrap.wrap(combined, width=300)

    engine.say("Here is the full answer from the manual.")
    engine.runAndWait()

    for chunk in chunks:
        engine.say(chunk)
        engine.runAndWait()
else:
    engine.say("No relevant section found.")
    engine.runAndWait()
