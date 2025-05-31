from langchain_community.vectorstores import FAISS
from langchain_community.llms import HuggingFacePipeline
from langchain.prompts import PromptTemplate
from transformers import pipeline, AutoModelForSeq2SeqLM, AutoTokenizer
import textwrap

# Load embedding model on GPU
from langchain_huggingface import HuggingFaceEmbeddings
embeddings = HuggingFaceEmbeddings(
    model_name='sentence-transformers/all-MiniLM-L6-v2',
    model_kwargs={"device": "cuda"}
)

# Load vectorstore (allow deserialization from known safe file)
vectorstore = FAISS.load_local(
    "mx20_index",
    embeddings,
    allow_dangerous_deserialization=True
)

# Load open-access LLM (Google FLAN-T5)
model_name = "google/flan-t5-base"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
llm_pipeline = pipeline("text2text-generation", model=model, tokenizer=tokenizer, max_new_tokens=512)
llm = HuggingFacePipeline(pipeline=llm_pipeline)

# Prompt to determine relevance of each manual section
filter_prompt = PromptTemplate.from_template("""
You're a repair assistant. The user asked: "{question}"
Below is a section from the manual.

--- Content ---
{context}
---------------

Does this content relate to the symptom, possible cause, or fix for the problem (even if phrased differently)? Answer "Yes" or "No" first. If Yes, explain what repair or diagnostic action is relevant.
""")

# Function to check if a section is relevant
def is_relevant_fault(question, content):
    prompt = filter_prompt.format(question=question, context=content)
    response = llm.invoke(prompt)
    return "yes" in response.lower(), response

# Main QA process
query = input("\n🔍 What’s the fault you want to ask about? ")
raw_results = vectorstore.similarity_search(query, k=5)

filtered_results = []
summaries = []

for res in raw_results:
    relevant, summary = is_relevant_fault(query, res.page_content)
    if relevant:
        filtered_results.append(res.page_content)
        summaries.append(summary)

if filtered_results:
    print("\n✅ Relevant repair content:")
    for i, (summary, content) in enumerate(zip(summaries, filtered_results)):
        print(f"\n--- Section {i+1} ---")
        print("🔹 Summary:\n" + summary.strip())
        print("🔹 Manual Extract:\n" + textwrap.fill(content.strip(), width=100))
else:
    print("\n❌ No fault-related repair info found in the manual.")
