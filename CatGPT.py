# Made with love on a random puja 2023 by Rishav Paul
# Uses characterAI for responses




from flask import Flask, request, jsonify, render_template
import importlib
import subprocess
from flask_cors import CORS
from characterai import PyCAI
import threading
import webview

# List of libraries to check and install
libraries_to_check = ["characterai", "websockets", "flask_cors"]

for library in libraries_to_check:
    try:
        importlib.import_module(library)
        print(f"{library} is already installed.")
    except ImportError:
        print(f"{library} is not installed. Installing it now...")
        subprocess.check_call(["pip", "install", library])
        print(f"{library} has been successfully installed.")

app = Flask("CatGPT")
CORS(app)

client = PyCAI('89b526241ac2bd889ccbba7dab8e9782c201373c')

char = 'hTP85l95BwEyURXYCKMJ9WQ54eRrzsjHUr4gJG-SYng'

chat = client.chat.get_chat(char)

participants = chat['participants']

if not participants[0]['is_human']:
    tgt = participants[0]['user']['username']
else:
    tgt = participants[1]['user']['username']

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/process_message', methods=['POST'])
def process_message():
    data = request.get_json()
    user_message = data.get('user_message')

    while True:
        message = user_message

        data = client.chat.send_message(chat['external_id'], tgt, message)

        name = data['src_char']['participant']['name']
        text = data['replies'][0]['text']

        return jsonify({'bot_response': text})

def start_flask_app():
    app.run(debug=False)

if __name__ == '__main__':
    threading.Thread(target=start_flask_app).start()
    webview.create_window("CatGPT by Rishav Paul", "http://127.0.0.1:5000", width=600, height=800)
    webview.start()
