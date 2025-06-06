import pyttsx3
import soundfile as sf
from pydub import AudioSegment
import torch
import torchaudio
from torch.nn.attention import SDPBackend, sdpa_kernel
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline
from datasets import load_dataset
from tqdm import tqdm
from utils import timer

torch.set_float32_matmul_precision("high")

device = "cuda:0" if torch.cuda.is_available() else "cpu"
torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32

model_id = "openai/whisper-tiny"

model = AutoModelForSpeechSeq2Seq.from_pretrained(
    model_id, torch_dtype=torch_dtype, low_cpu_mem_usage=True
).to(device)

# Enable static cache and compile the forward pass
with timer("torch compilation"):
    model.generation_config.cache_implementation = "static"
    model.generation_config.max_new_tokens = 256
    model.forward = torch.compile(model.forward, mode="reduce-overhead", fullgraph=True)

processor = AutoProcessor.from_pretrained(model_id)

pipe = pipeline(
    "automatic-speech-recognition",
    model=model,
    tokenizer=processor.tokenizer,
    feature_extractor=processor.feature_extractor,
    torch_dtype=torch_dtype,
    device=device,
)

dataset = load_dataset("distil-whisper/librispeech_long", "clean", split="validation")
sample = dataset[0]["audio"]

duration = 5
sampling_rate = sample["sampling_rate"]
audio_array = sample["array"]
num_samples = min(duration * sampling_rate, len(audio_array))

# sf.write("test_5sec.wav", audio_array[:num_samples], sampling_rate)
sample["array"] = audio_array[:num_samples]

"""
engine = pyttsx3.init()
engine.save_to_file('Hello, this is offline speech synthesis!', 'output.wav')
engine.runAndWait()
AudioSegment.from_wav("output.wav").export("output.mp3", format="mp3")
"""

generate_kwargs = {
    "condition_on_prev_tokens": False,
    "return_timestamps": True,
    "language": "english",
}

with timer("warmup"):
    # 2 warmup steps
    for _ in tqdm(range(2), desc="Warm-up step"):
        with sdpa_kernel(SDPBackend.MATH):
            result = pipe(sample.copy(), generate_kwargs={"min_new_tokens": 256, "max_new_tokens": 256})

with timer("compiled inference"):
    # fast run
    with sdpa_kernel(SDPBackend.MATH):
        result = pipe(sample.copy())
    print(result["text"])

with timer("simple inference"):
    result = pipe("test_speech.wav", generate_kwargs=generate_kwargs)
    print(result["text"])
