import whisper
from utils import timer

with timer("whisper"):
    model = whisper.load_model("tiny", device="cuda")
    result = model.transcribe("test_speech.wav", fp16=True, language="en", condition_on_previous_text=False)
    print(result["text"])

    """ 
    # load audio and pad/trim it to fit 30 seconds
    audio = whisper.load_audio("test_speech.wav")
    audio = whisper.pad_or_trim(audio)

    # make log-Mel spectrogram and move to the same device as the model
    mel = whisper.log_mel_spectrogram(audio).to(model.device)

    # detect the spoken language
    _, probs = model.detect_language(mel)
    print(f"Detected language: {max(probs, key=probs.get)}")

    # decode the audio
    options = whisper.DecodingOptions()
    result = whisper.decode(model, mel, options)

    # print the recognized text
    print(result.text)
    """
