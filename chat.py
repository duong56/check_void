from flask import Flask, render_template, request
from nlp import nlp_word


##Logging
import logging
logging.basicConfig(level=logging.INFO)
app = Flask(__name__)


@app.route("/")
def home():
    return render_template("dashboard.html")


@app.route("/get")
def get_bot_response():

    userText = request.args.get('msg')
    nlp = nlp_word(userText)
    print("Kết quả: " + str(nlp))
    return str(nlp)


if __name__ == "__main__":
    app.run(host='localhost', port=8080)



