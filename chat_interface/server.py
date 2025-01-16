from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import re
import requests
import time
from supabase import create_client, Client


app = Flask(__name__)
CORS(app)


supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


MAX_CONVERSATIONS_PER_USER = 5 



headers = {"Authorization": f"Bearer {API_TOKEN}"}




def load_conversation_memory(convo_id: int) -> str:
   """Load the content field for the given conversation ID."""
   response = supabase.table("conversations").select("content").eq("id", convo_id).execute()
   rows = response.data
   if rows and len(rows) > 0:
       return rows[0].get("content", "")
   return ""


def create_new_conversation(user_id: str, initial_context: str) -> int:
   res = supabase.table("conversations").insert({
       "user_id": user_id,
       "content": f"{initial_context}\n"
   }).execute()


   new_id = res.data[0]["id"]
   return new_id


def append_turn_to_db(convo_id: int, user_id: str, user_text: str, assistant_text: str):
   existing_content = load_conversation_memory(convo_id)
   new_content = existing_content + f"User: {user_text}\nAssistant: {assistant_text}\n\n"
   supabase.table("conversations").update({"content": new_content}).eq("id", convo_id).eq("user_id", user_id).execute()


def list_user_conversations(user_id: str):
   response = supabase.table("conversations").select("id").eq("user_id", user_id).execute()
   rows = response.data
   if rows:
       return [row["id"] for row in rows]
   return []


def delete_conversation_db(convo_id: int, user_id: str):
   supabase.table("conversations").delete().eq("id", convo_id).eq("user_id", user_id).execute()




@app.route("/")
def home():
   return jsonify({"message": "Hello, Flask is running on Supabase with auto-increment IDs!"})


@app.route("/chat", methods=["POST"])
def chat():
   """
   This endpoint receives:
       {
           "message": "...",
           "conversation_id": <optional integer>,
           "user_id": "..."
       }
   and returns:
       {
           "conversation_id": <the int id of the conversation>,
           "response": "..."
       }
   """
   data = request.json
   user_message = data.get("message", "").strip()
   conversation_id = data.get("conversation_id")  # might be None or int
   user_id = data.get("user_id")


   if not user_message or not user_id:
       return jsonify({"error": "Message and user ID are required"}), 400


   # Check if user wants a new conversation or continuing an existing one
   if not conversation_id:
       # Enforce per-user conversation limit
       user_convos = list_user_conversations(user_id)
       if len(user_convos) >= MAX_CONVERSATIONS_PER_USER:
           return jsonify({"error": "Maximum number of conversations reached"}), 403


       # Create a brand new conversation with an auto-incremented ID
       initial_context = "The first president of the United States was George Washington."
       conversation_id = create_new_conversation(user_id, "")
       conversation_history = initial_context
   else:
       # conversation_id is provided. We assume it's an int.
       # If it's a string on the client, parse it to int first, or let the client pass an integer.
       try:
           conversation_id = int(conversation_id)
       except ValueError:
           return jsonify({"error": "conversation_id must be an integer"}), 400
       conversation_history = load_conversation_memory(conversation_id) + f"User: {user_message}\n"


   # Call the external AI model
   try:
       print(f"Sending request to API with context: {conversation_history} and question: {user_message}")
       response = requests.post(API_URL, headers=headers, json={
           "inputs": {
               "context": conversation_history,
               "question": user_message
           }
       })
       print(f"API response status: {response.status_code}, response: {response.text}")
       result = response.json()


       if response.status_code != 200:
           return jsonify({"error": "Failed to generate response", "details": result}), response.status_code


       if 'error' in result:
           # Model might be loading or an error occurred
           if 'loading' in result['error']:
               print("Model is loading, retrying in 20 seconds...")
               time.sleep(20)
               return chat()  # Retry
           else:
               return jsonify({"error": result['error']}), 500


       assistant_text = result.get('answer', 'No answer found.')
       append_turn_to_db(conversation_id, user_id, user_message, assistant_text)


       return jsonify({
           "conversation_id": conversation_id,
           "response": assistant_text
       })


   except Exception as e:
       print("Error in API request:", str(e))
       return jsonify({"error": "Failed to generate response", "details": str(e)}), 500


@app.route("/conversations", methods=["GET"])
def list_conversations_route():
   """
   GET /conversations?user_id=...
   Returns a list of conversation IDs (ints).
   """
   user_id = request.args.get("user_id")
   if not user_id:
       return jsonify({"error": "User ID is required"}), 400


   convos = list_user_conversations(user_id)
   # Return them as strings if you prefer, or keep as numbers
   return jsonify(convos), 200


@app.route("/conversations/<convo_id>", methods=["GET"])
def get_conversation_route(convo_id):
   """
   GET /conversations/<id>?user_id=...
   """
   user_id = request.args.get("user_id")
   if not user_id:
       return jsonify({"error": "User ID is required"}), 400


   # parse the conversation_id
   try:
       convo_id = int(convo_id)
   except ValueError:
       return jsonify({"error": "Conversation ID must be an integer"}), 400


   content = load_conversation_memory(convo_id)
   if not content:
       return jsonify({"error": "Conversation not found"}), 404


   return jsonify({
       "conversation_id": convo_id,
       "content": content
   }), 200


@app.route("/conversations/<convo_id>", methods=["DELETE"])
def delete_conversation_route(convo_id):
   """
   DELETE /conversations/<id>?user_id=...
   """
   user_id = request.args.get("user_id")
   if not user_id:
       return jsonify({"error": "User ID is required"}), 400


   try:
       convo_id = int(convo_id)
   except ValueError:
       return jsonify({"error": "Conversation ID must be an integer"}), 400


   # Actually delete
   delete_conversation_db(convo_id, user_id)
   return jsonify({"message": f"Conversation '{convo_id}' deleted"}), 200


if __name__ == "__main__":
   app.run(debug=True, host="0.0.0.0", port=5000)