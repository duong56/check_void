from tokenization.crf_tokenizer import CrfTokenizer
from word_embedding.word2vec_gensim import Word2Vec
from text_classification.short_text_classifiers import BiDirectionalLSTMClassifier, load_synonym_dict

# Please give the correct paths
# Load word2vec model from file.
word2vec_model = Word2Vec.load('models/pretrained_word2vec.bin')

# Load tokenizer model for word segmentation.
# Khởi tạo mô hình pretrain tokenizer
tokenizer = CrfTokenizer(config_root_path='tokenization/',
                         model_path='models/pretrained_tokenizer.crfsuite')
#từ đồng nghĩa
sym_dict = load_synonym_dict('data/sentiment/synonym.txt')
#Khởi tạo mô hình phân loại xây dựng bằng BiDirectional Layer
keras_text_classifier = BiDirectionalLSTMClassifier(tokenizer=tokenizer, word2vec=word2vec_model.wv,
                                                    model_path='models/sentiment_model.h5',
                                                    max_length=20, n_epochs=20,
                                                    sym_dict=sym_dict)
# Load and prepare data
X, y = keras_text_classifier.load_data(['data/sentiment/samples/positive.txt',
                                       'data/sentiment/samples/negative.txt'],
                                       load_method=keras_text_classifier.load_data_from_file)

# Train your classifier and test the model
keras_text_classifier.train(X, y)
label_dict = {0: 'tích cực', 1: 'tiêu cực'}
test_sentences = ['Môn học này quá khó']
labels = keras_text_classifier.classify(test_sentences, label_dict=label_dict)
print(labels)
