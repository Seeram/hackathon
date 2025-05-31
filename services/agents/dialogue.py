import whisper
import torch

def process_image():
    pass

def process_speech(user_input, mock=True):
    # Receive speech input from user
    # Ideally perform planning

    # TODO Compute embeddings, perform semantic search

    # TODO Perform planning, or maybe planning should be done at the beginning step?

    # TODO Return PDF name and page number if relevant

    # TODO Should we use another LLM for reasoning...

    output = user_input if mock else None
    assert output is not None
    return output

device = "cuda" if torch.cuda.is_available() else "cpu"

def process_modality(user_input):
    # TODO Match on filetype
    pass

def process_dialogue(user_input, mock=True):
    # Receive input from user, which could be speech or image
    model = whisper.load_model("tiny", device=device)

    while user_input:
        # Ensure modality = text or image
        modality = "speech" if mock else process_modality(user_input) # Some function of the user input
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

        # TODO Make proper dialogue loop
        user_input = None
    return output
