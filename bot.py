import telebot

TOKEN = "7375741329:AAEGlkVDknj8PTS_4HCVuw08uJpe2X3HEQg"
CHAT_ID = "2114237158"

bot = telebot.TeleBot(TOKEN)

@bot.message_handler(func=lambda message: True)
def reply_to_web(message):
    if str(message.chat.id) == CHAT_ID:
        with open("messages.txt", "a") as file:
            file.write(message.text + "\n")

bot.polling()
