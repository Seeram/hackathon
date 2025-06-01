from flask import Flask, request, jsonify
import os
import time
from dialogue import process_dialogue

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "time": time.time()})

@app.route('/process', methods=['POST'])
def process_audio():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if file and file.filename.endswith('.wav'):
        # Save temporarily
        filepath = os.path.join('/tmp', file.filename)
        file.save(filepath)

        response = process_dialogue(filepath)

        # Just return file info for now
        file_info = {
            "filename": file.filename,
            "size_bytes": os.path.getsize(filepath),
            "save_path": filepath,
            "received_at": time.time()
        }

        # Clean up
        os.remove(filepath)

        return jsonify({
            "status": "success",
            "response": response,
            "message": "File received successfully",
            "file_info": file_info
        })

    return jsonify({"error": "Invalid file format"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
