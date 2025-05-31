import whisper
import torch

def process_image():
    pass

def process_speech(user_input):
    # Receive speech input from user
    # Ideally perform planning

    # TODO Compute embeddings, perform semantic search
    # TODO Perform planning, or maybe planning should be done at the beginning step?
    return user_input

device = "cuda" if torch.cuda.is_available() else "cpu"

def process_dialogue(user_input):
    # Receive input from user, which could be speech or image
    model = whisper.load_model("tiny", device=device)

    while user_input:
        # Ensure modality = text or image
        modality = "speech" # Some function of the user input
        match modality:
            case "image":
                pass
            case "speech":
                user_input_speech = model.transcribe(user_input, 
                                                     fp16=True,
                                                     language="en", 
                                                     condition_on_previous_text=False)
                output = process_speech(user_input_speech)
            case None:
                pass
        user_input = None
    return output
