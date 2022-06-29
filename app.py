import re
from flask import Flask, render_template, request,jsonify
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer
from transformers import pipeline
from flask_cors import CORS
import json

emotion = pipeline('sentiment-analysis', model='arpanghoshal/EmoRoBERTa')

app = Flask(__name__)
CORS(app)

english_bot = ChatBot("Chatterbot", storage_adapter="chatterbot.storage.SQLStorageAdapter")
trainer = ChatterBotCorpusTrainer(english_bot)
trainer.train("chatterbot.corpus.english")

data = []
messages = []
statusChat = [{"status": "bot"}]

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get")
def get_bot_response():
    userText = request.args.get('msg')
    emotion_labels = emotion(userText)
    botText = english_bot.get_response(userText)
    json_string = {"user": str(userText), "bot": str(botText) , "emotion": str(emotion_labels[0]['label'])}
    data.append(json.loads(json.dumps(json_string)))
    return str(botText)

@app.route("/getemotion")
def get_emotion():
    return jsonify(data)

@app.route("/setstatuschat")
def set_status_chat():
    status = request.args.get('msg')
    json_string = {"status": str(status)}
    statusChat.append(json.loads(json.dumps(json_string)))
    return jsonify(statusChat)

@app.route("/getstatuschat")
def get_status_chat():
    return jsonify(statusChat)

@app.route("/setmanagerresponse")
def get_manager_response():
    managerText = request.args.get('msg')
    json_string = {"manager": str(managerText)}
    messages.append(json.loads(json.dumps(json_string)))
    return jsonify(messages)

@app.route("/setuserresponse")
def get_user_response():
    userText = request.args.get('msg')
    json_string = {"user": str(userText)}
    messages.append(json.loads(json.dumps(json_string)))
    return jsonify(messages)

@app.route("/getmessages")
def get_messages():
    return jsonify(messages)

if __name__ == "__main__":
    app.run()