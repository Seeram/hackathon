def is_relevant_fault(question, content):
    prompt = filter_prompt.format(question=question, context=content)
    print("\n--- Prompt Sent to LLM ---\n", prompt)
    response = llm.invoke(prompt)
    print("\n--- LLM Response ---\n", response)
    return "yes" in response.lower(), response
