# Agents Service

Python-based AI service providing speech recognition, dialogue management, and PDF processing capabilities.

## Overview

This service handles AI-powered interactions including:
- Speech-to-text transcription using Whisper
- Natural language dialogue processing with LLMs
- PDF document embedding and retrieval
- Voice synthesis and audio processing
- Integration with LangChain for advanced AI workflows

## Technology Stack

- **Framework**: Flask/FastAPI
- **Language**: Python 3.9+
- **AI/ML**: Transformers, Whisper, LangChain
- **Audio**: PyDub, SoundFile, SpeechRecognition
- **Document Processing**: PyPDF2, ChromaDB
- **Vector Store**: ChromaDB for embeddings
- **Container**: Docker with optimized builds

## Development

### Local Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
python app.py

# Run specific services
python dialogue.py
python predialogue.py
python postdialogue.py
```

### Docker Usage

```bash
# Build agents container
docker build -t agents-service .

# Run with Docker Compose
docker compose up agents

# Use optimized production build
docker build -f Dockerfile.optimized -t agents-service-opt .
```

## Services

### Core Services
- **Speech Transcription**: Real-time audio-to-text conversion
- **Dialogue Management**: AI-powered conversation handling
- **PDF Processing**: Document embedding and semantic search
- **Voice Synthesis**: Text-to-speech capabilities

### Microservices
- **Embedding Service**: Standalone PDF processing and vector storage
- **Transcription Service**: Dedicated speech-to-text processing

## API Endpoints

- **Health Check**: `GET /health`
- **Transcribe Audio**: `POST /transcribe`
- **Process Dialogue**: `POST /dialogue`
- **Embed Document**: `POST /embed`
- **Query Documents**: `POST /query`

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `FLASK_ENV` | Environment mode | development |
| `PORT` | Service port | 5000 |
| `OPENAI_API_KEY` | OpenAI API key | - |
| `HUGGINGFACE_API_KEY` | HuggingFace API key | - |

### Model Configuration

The service supports multiple AI models:
- **Whisper**: For speech recognition
- **LangChain LLMs**: For dialogue processing
- **HuggingFace Transformers**: For text processing
- **ChromaDB**: For vector embeddings

## Development Features

- **Mock Services**: Test implementations for development
- **Audio Testing**: Comprehensive audio processing tests
- **Model Testing**: AI model validation utilities
- **Integration Tests**: End-to-end service testing

## Performance Optimizations

- **Optimized Docker builds** for production
- **Model caching** for faster inference
- **Async processing** for concurrent requests
- **Resource management** for memory efficiency
