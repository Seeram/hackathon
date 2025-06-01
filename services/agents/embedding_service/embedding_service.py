from flask import Flask, request, jsonify
from langchain_huggingface import HuggingFaceEmbeddings

app = Flask(__name__)
embedder = HuggingFaceEmbeddings(model_name="BAAI/bge-large-en-v1.5")

@app.route("/embed", methods=["POST"])
def embed():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400
    try:
        emb = embedder.embed_query(text)
        return jsonify({"embeddings": emb})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
