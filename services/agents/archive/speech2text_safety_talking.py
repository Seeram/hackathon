import speech_recognition as sr
import pyttsx3

# Initialize text-to-speech engine
engine = pyttsx3.init()
engine.setProperty('rate', 150)

# Initialize speech recognizer
recognizer = sr.Recognizer()

# Safety checklist prompts
safety_prompts = [
    "Have you switched off the main power supply to the elevator system?",
    "Are you wearing appropriate Personal Protective Equipment like helmet, gloves, and safety shoes?",
    "Have you applied lockout tagout procedures to prevent accidental energizing?",
    "Have you clearly marked the elevator as out of service?",
    "Do you have the elevator's wiring diagram or repair manual with you?",
    "Do you have the right tools for the repair?",
    "Are you working with a second person or have you informed someone nearby in case of emergency?"
]

def speak(text):
    engine.say(text)
    engine.runAndWait()

def listen_for_answer():
    with sr.Microphone() as source:
        print("🎤 Listening for your response (say 'yes' or 'no')...")
        audio = recognizer.listen(source)
        try:
            answer = recognizer.recognize_google(audio).lower()
            print(f"🗣 You said: {answer}")
            return answer
        except sr.UnknownValueError:
            print("❌ Could not understand audio. Please repeat.")
            speak("I didn't catch that. Please say yes or no.")
            return listen_for_answer()
        except sr.RequestError as e:
            print(f"Error: {e}")
            return "no"  # default to safety

# Ask each question
for prompt in safety_prompts:
    print(f"🛡️ {prompt}")
    speak(prompt)
    response = listen_for_answer()
    if response != "yes":
        print("⚠️ Safety requirement not confirmed. Please fix the issue before proceeding.")
        speak("Safety requirement not confirmed. Please fix the issue before continuing.")
        exit()

print("✅ All safety checks confirmed. You may proceed with the repair.")
speak("All safety checks confirmed. You may proceed with the repair.")
