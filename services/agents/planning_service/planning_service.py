from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

app = Flask(__name__)

# Load model and tokenizer via Hugging Face Transformers
model = "openchat/openchat-3.5-0106"

tokenizer = AutoTokenizer.from_pretrained(model)
model = AutoModelForCausalLM.from_pretrained(model)
generator = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    device=0  # set to -1 for CPU, 0 for first CUDA GPU
)

def make_prompt(context, instruction):
    return (
        f"Given the following context:\n{context}\n\n"
        f"Instruction:\n{instruction}\n\n"
        "Return a step-by-step plan to accomplish the task."
    )

@app.route('/plan', methods=['POST'])
def plan():
    data = request.get_json()
    context = data.get('context', '')
    instruction = data.get('instruction', '')
    if not context or not instruction:
        return jsonify({'error': 'context and instruction are required.'}), 400
    prompt = make_prompt(context, instruction)
    result = generator(prompt, max_new_tokens=256, do_sample=True, temperature=0.7)[0]['generated_text']
    # Extract plan after "Instruction:" if the model echoes the prompt
    plan_text = result.split("Instruction:")[-1].strip()
    return jsonify({'plan': plan_text})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8002)
