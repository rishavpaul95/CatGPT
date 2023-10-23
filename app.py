# Made with love on 20 Oct 2023 by Rishav Paul
# Uses characterAI for responses

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from characterai import PyCAI
import threading
import webview

app = Flask(__name__, static_folder='./static', template_folder='./templates')
CORS(app)

client = PyCAI('89b526241ac2bd889ccbba7dab8e9782c201373c')

char = 'hTP85l95BwEyURXYCKMJ9WQ54eRrzsjHUr4gJG-SYng'

chat = client.chat.get_chat(char)

participants = chat['participants']

if not participants[0]['is_human']:
    tgt = participants[0]['user']['username']
else:
    tgt = participants[1]['user']['username']

# Define the route for the index page
@app.route('/')
def index():
    return render_template('index.html')

# Define the route for processing messages
@app.route('/process_message', methods=['POST'])
def process_message():
    data = request.get_json()
    user_message = data.get('user_message')

    # Process the user's message
    message = user_message
    data = client.chat.send_message(chat['external_id'], tgt, message)

    name = data['src_char']['participant']['name']
    text = data['replies'][0]['text']

    return jsonify({'bot_response': text})


def start_flask_app():
    app.run(debug=False)

if __name__ == '__main__':
    threading.Thread(target=start_flask_app).start()
    webview.create_window("CatGPT", "http://localhost:5000", width=600, height=800)
    webview.start()
