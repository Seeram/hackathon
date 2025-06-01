FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY embedding_service.py .

CMD ["python", "embedding_service.py"]
