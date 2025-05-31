import speech_recognition as sr

# Define safety checklist prompts
safety_prompts = [
    "🛡️ Have you switched off the main power supply to the elevator system?",
    "🧤 Are you wearing appropriate Personal Protective Equipment such as helmet, gloves, and safety shoes?",
    "🔒 Have you applied lockout-tagout procedures to prevent accidental energizing?",
    "🧭 Have you clearly marked the elevator as 'Out of Service'?",
    "📄 Do you have the elevator's wiring diagram or repair manual with you?",
    "🧰 Do you have the right tools for the repair?",
    "👥 Are you working with a second person or have you informed someone nearby in case of emergency?"
]

# Initialize recognizer
r = sr.Recognizer()

def ask_question(prompt_text):
    print(prompt_text)
    with sr.Microphone() as source:
        print("Please say 'yes' or 'no'...")
        audio = r.listen(source)
        print("Recognizing your answer...")
        try:
            response = r.recognize_google(audio).lower()
            print("You said:", response)
            return response
        except sr.UnknownValueError:
            print("Could not understand. Please repeat.")
            return ask_question(prompt_text)
        except sr.RequestError as e:
            print(f"Request error: {e}")
            return "no"  # treat failure as "no" to stay safe

# Run through safety prompts
for prompt in safety_prompts:
    answer = ask_question(prompt)
    if answer != "yes":
        print("⚠️  Safety requirement not confirmed. Please resolve before proceeding.")
        exit()

print("✅ All safety checks confirmed. You may proceed with the repair.")
