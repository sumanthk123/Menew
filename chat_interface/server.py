from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import re
from llama_index.llms.ollama import Ollama
import subprocess

app = Flask(__name__)
CORS(app)

CONVERSATIONS_FOLDER = "conversations"
if not os.path.exists(CONVERSATIONS_FOLDER):
    os.makedirs(CONVERSATIONS_FOLDER)

llm = Ollama(
    model="hf.co/bartowski/Llama-3.2-3B-Instruct-GGUF:latest",
    request_timeout=120.0
)


def sanitize_filename(text: str) -> str:
    text = text.strip().lower()
    text = re.sub(r"[^a-z0-9_\- ]", "", text)
    text = text.replace(" ", "_")
    if not text:
        text = "conversation"
    text = text[:50]

    base_name = text
    file_path = os.path.join(CONVERSATIONS_FOLDER, f"{base_name}.txt")
    suffix = 2

    while os.path.exists(file_path):
        new_name = f"{base_name}_{suffix}"
        file_path = os.path.join(CONVERSATIONS_FOLDER, f"{new_name}.txt")
        suffix += 1

    final_name = os.path.splitext(os.path.basename(file_path))[0]
    return final_name


def load_conversation_memory(conversation_id: str) -> str:
   
    file_path = os.path.join(CONVERSATIONS_FOLDER, f"{conversation_id}.txt")
    if not os.path.isfile(file_path):
        return ""  

    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()


def append_turn_to_file(conversation_id: str, user_text: str, assistant_text: str):
   
    file_path = os.path.join(CONVERSATIONS_FOLDER, f"{conversation_id}.txt")
    mode = "a" if os.path.exists(file_path) else "w"
    with open(file_path, mode, encoding="utf-8") as f:
        f.write(f"User: {user_text}\n")
        f.write(f"Assistant: {assistant_text}\n\n")
    subprocess.run(["python", "insights.py"])


@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "").strip()
    conversation_id = data.get("conversation_id")  # optional

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    if not conversation_id:
        conversation_id = sanitize_filename(user_message)
        conversation_history = ""
    else:
        conversation_history = load_conversation_memory(conversation_id)

    prompt = f"""
You are a research assistant specializing in academic papers.
Provide a brief, focused answer using the available knowledge.

History:
{conversation_history}


User: {user_message}
Assistant:
"""
    print(conversation_history)
    try:
        response_obj = llm.complete(prompt)
        assistant_text = response_obj.text.strip()

        append_turn_to_file(conversation_id, user_message, assistant_text)

        return jsonify({
            "conversation_id": conversation_id,
            "response": assistant_text
        })
    except Exception as e:
        print("Error in LLM completion:", str(e))
        return jsonify({"error": "Failed to generate response"}), 500


@app.route("/conversations", methods=["GET"])
def list_conversations():
    """
    Returns an array of conversation IDs (file names without .txt).
    """
    files = os.listdir(CONVERSATIONS_FOLDER)
    conversation_ids = [
        f.replace(".txt", "") for f in files if f.endswith(".txt")
    ]
    return jsonify(conversation_ids), 200


@app.route("/conversations/<conversation_id>", methods=["GET"])
def get_conversation(conversation_id):

    file_path = os.path.join(CONVERSATIONS_FOLDER, f"{conversation_id}.txt")
    if not os.path.isfile(file_path):
        return jsonify({"error": "Conversation not found"}), 404

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    return jsonify({
        "conversation_id": conversation_id,
        "content": content
    }), 200


@app.route("/conversations/<conversation_id>", methods=["DELETE"])
def delete_conversation(conversation_id):
   
    file_path = os.path.join(CONVERSATIONS_FOLDER, f"{conversation_id}.txt")
    if not os.path.isfile(file_path):
        return jsonify({"error": "Conversation not found"}), 404

    os.remove(file_path)
    return jsonify({"message": f"Conversation '{conversation_id}' deleted"}), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)
