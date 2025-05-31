FROM python:3.11-slim

# For GPU support and audio processing
RUN apt-get update && apt-get install -y \
    libsndfile1 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# We'll mount the code at runtime, so no need to COPY
# The CMD will use the mounted code

EXPOSE 5000

# Run with Flask's development server for auto-reload
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0", "--port=5000", "--debug"]

