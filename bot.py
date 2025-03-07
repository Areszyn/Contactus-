import telebot
from flask import Flask, request, jsonify

BOT_TOKEN = "7375741329:AAEGlkVDknj8PTS_4HCVuw08uJpe2X3HEQg"
CHAT_ID = "2114237158"

bot = telebot.TeleBot(BOT_TOKEN)
app = Flask(__name__)

bot_replies = []  # Store bot messages

@bot.message_handler(commands=['start'])
def start(message):
    bot.send_message(message.chat.id, "Hello! Send me a message and I will reply.")

@bot.message_handler(func=lambda message: message.chat.id == int(CHAT_ID))
def handle_reply(message):
    bot_replies.append(message.text)  # Save bot reply
    bot.send_message(CHAT_ID, f"Received: {message.text}")

@app.route('/getMessages', methods=['GET'])
def get_messages():
    return jsonify({"messages": bot_replies})

if __name__ == "__main__":
    bot.polling()
