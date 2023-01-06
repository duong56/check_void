import speech_recognition as sr


def get_audio():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Đang lắng nghe ...")
        audio = r.listen(source, phrase_time_limit=5)
        try:
            text = r.recognize_google(audio, language="vi-VN")
            print("Tôi: ", text)
            return text
        except:
            print("Tôi không nghe được bạn nói gì !")
            return 0