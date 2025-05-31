from faster_whisper import WhisperModel
from utils import timer

with timer():
    model = WhisperModel("small", device="cuda", compute_type="int8_float16")
    segments, info = model.transcribe("test_speech.wav")

