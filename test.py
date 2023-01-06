# # Craw Data
# from word_embedding.utils import download_html
# url_path = "https://dantri.com.vn/the-thao/hlv-park-hang-seo-lien-tuc-doi-chieu-tuyen-thu-viet-nam-chong-mat-20211123215952001.htm"
# output_path = "data/word_embedding/real/html/html_data3.txt"
# download_html(url_path, output_path, should_clean=True)
#

# Clean and tokenize text
from tokenization.crf_tokenizer import CrfTokenizer
from word_embedding.utils import clean_files_from_dir
input_dir = 'data/word_embedding/real/html'
output_dir = 'data/word_embedding/real/training'
crf_config_root_path = "tokenization/"
crf_model_path = "models/pretrained_tokenizer.crfsuite"
tokenizer = CrfTokenizer(config_root_path=crf_config_root_path, model_path=crf_model_path)
clean_files_from_dir(input_dir, output_dir, should_tokenize=True, tokenizer=tokenizer)

# Training
from word_embedding.word2vec_gensim import train
data_path = "data/word_embedding/real/training"
model_path = "models/word2vec.model"
train(data_path=data_path, model_path=model_path)

# Testing
from word_embedding.word2vec_gensim import test
# model_path = "models/pretrained_word2vec.bin"
model_path = "models/word2vec.model"
test_word = "dở_tệ"
test(model_path=model_path, word=test_word)

