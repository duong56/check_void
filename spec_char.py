import re


def delete_special_character(file_txt):
    words = []
    str = file_txt.strip().split()
    for word in str:
        words.append(word.strip(".,!\":;'?"))
    return words

# input_path = 'data/word_embedding/real/training/html_data.txt'
# str = ""
# inputFile = open(input_path, 'r',encoding="utf8")
# for word in inputFile:
#     s1 = re.sub("[$@&'\":.,)(\-/]","",word)
#     print(s1)
# inputFile.close()
