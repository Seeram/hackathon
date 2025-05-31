import speech_recognition as sr

r = sr.Recognizer()

with sr.Microphone() as source:
    r.adjust_for_ambient_noise(source, duration=1)  # calibrate for 1 second
    r.energy_threshold = 100  # Increase or decrease as needed
    print("Please speak now...")
    audio_text = r.listen(source)
    print("Recording complete, recognizing...")

    # Save the audio to a .wav file
    with open("output.wav", "wb") as f:
        f.write(audio_text.get_wav_data())
