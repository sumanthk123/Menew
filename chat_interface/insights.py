from keybert import KeyBERT
import nltk
import os
from transformers import AutoTokenizer, AutoModel
from sentence_transformers import SentenceTransformer, models

def extract_keywords(text, num_keywords=10):
    word_embedding_model = models.Transformer('allenai/scibert_scivocab_uncased')
    pooling_model = models.Pooling(word_embedding_model.get_word_embedding_dimension())
    sentence_model = SentenceTransformer(modules=[word_embedding_model, pooling_model])
    kw_model = KeyBERT(model=sentence_model)
    
    # custom_stop_words = ['said', 'doing', 'got', 'wow', 'use', 'would', 'like', 
    #                    'can', 'please', 'looking', 'specific', 'just', 'something',
    #                    'actually', 'really', 'think', 'know', 'want', 'need', 'make',
    #                    'sure', 'well', 'right', 'see', 'one', 'get', 'even', 'also',
    #                   'back', 'still', 'going', 'much', 'many', 'thing', 'things']
    text = ' '.join(text.split())
    keywords = kw_model.extract_keywords(
        text,
        stop_words='english',
        use_maxsum=True,
        top_n=num_keywords,
        diversity=0.7
    )
    return keywords


def extract_keywords_from_folder(folder_path="./conversations"):
    keywords_folder = "insights"      
    if not os.path.exists(keywords_folder):
        os.makedirs(keywords_folder)
    else:
        for filename in os.listdir(keywords_folder):
            file_path = os.path.join(keywords_folder, filename)
            if os.path.isfile(file_path):
                os.remove(file_path)
    for file_name in os.listdir(folder_path):
            with open(os.path.join(folder_path, file_name), 'r', encoding='utf-8') as file:
                text = file.read()
                keywords = extract_keywords(text)
                bname = os.path.splitext(file_name)[0]
                keywords_file_path = os.path.join(keywords_folder, f"{bname}_keywords.txt")
                with open(keywords_file_path, 'w', encoding='utf-8') as keywords_file:
                    for keyword, score in keywords:
                        keywords_file.write(f"{keyword}: {score:.4f}\n")
            

if __name__ == "__main__":
    extract_keywords_from_folder()