from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from llama_index.llms.ollama import Ollama
app = Flask(__name__)
CORS(app)

class ChatbotMemory:
    def __init__(self):
        self.conversation_history = []

    def add_to_memory(self, user_input, assistant_response):
        self.conversation_history.append((user_input, assistant_response))

    def get_memory(self):
        return "\n".join([f"User: {user}\nAssistant: {assistant}" for user, assistant in self.conversation_history])


llm = Ollama(model="hf.co/bartowski/Llama-3.2-3B-Instruct-GGUF:latest", request_timeout=120.0)
memory = ChatbotMemory()

@app.route('/chat', methods=['POST'])
def chat_with_bot():
    user_question = request.json.get('message')
    if not user_question:
        return jsonify({'error': 'No message provided'}), 400
    
    memory_context = memory.get_memory()
    
    print(f"Memory context: {memory_context}")
    
    prompt = f"""
    You are a research assistant specializing in academic papers.
    Provide brief, focused answers using the available knowledge.
    
    History: {memory_context}
    
    User: {user_question}
    Assistant: Let me provide a concise answer based on the research papers and relevant military context.
    """
    
    try:
        response = llm.complete(prompt)
        print("LLM Response:", response.text)  # Add this line
        return jsonify({'response': response.text})
    except Exception as e:
        print("Error during LLM completion:", str(e))
        return jsonify({'error': 'Failed to generate response'}), 500
    
if __name__ == '__main__':
    app.run(debug=True, port=5000)