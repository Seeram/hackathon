To test, first start the backend server and relevant LLM services:
```
docker compose up --build
```

Send a local audio file, e.g.
```
curl -X POST -F "file=@$HOME/projects/hackathon/services/agents/data/audio/test_speech.wav" http://localhost:5000/process
```
