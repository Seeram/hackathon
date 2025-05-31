import speech_recognition as sr

# Initialize recognizer class (for recognizing the speech)
r = sr.Recognizer()

# Reading Microphone as source
# listening the speech and store in audio_text variable
with sr.Microphone() as source:
    print("Please speak now...")
    audio_text = r.listen(source)
    print("Recording complete, recognizing...")

    try:
        # using google speech recognition
        text = r.recognize_google(audio_text)
        print("You said: {}".format(text))
    except sr.UnknownValueError:
        print("Sorry, I could not understand the audio.")
    except sr.RequestError as e:
        print("Could not request results; {0}".format(e))
