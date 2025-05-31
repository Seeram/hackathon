import whisper
import torch

def process_image():
    pass

def process_speech(user_input):
    # Receive speech input from user
    # Ideally perform planning

    # TODO Compute embeddings, perform semantic search
    # TODO Perform planning, or maybe planning should be done at the beginning step?
    pass

device = "cuda" if torch.cuda.is_available() else "cpu"

def process_dialogue():
    # Receive input from user, which could be speech or image
    end = False
    model = whisper.load_model("tiny", device=device)

    while not end:
        # Ensure modality = text or image
        user_input = None
        modality = None # Some function of the user input
        match modality:
            case "image":
                pass
            case "speech":
                user_input_speech = model.transcribe(user_input, fp16=True,
                                                  language="en", condition_on_previous_text=False)
                output = process_speech(user_input_speech)
            case None:
                pass
