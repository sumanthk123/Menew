from keybert import KeyBERT
from transformers import AutoTokenizer, AutoModel
from sentence_transformers import SentenceTransformer, models
from supabase import create_client


def extract_keywords(text, num_keywords=10):
    word_embedding_model = models.Transformer('allenai/scibert_scivocab_uncased')
    pooling_model = models.Pooling(word_embedding_model.get_word_embedding_dimension())
    sentence_model = SentenceTransformer(modules=[word_embedding_model, pooling_model])
    kw_model = KeyBERT(model=sentence_model)
    
    text = ' '.join(text.split())
    keywords = kw_model.extract_keywords(
        text,
        stop_words='english',
        use_maxsum=True,
        top_n=num_keywords,
        diversity=0.7
    )
    return keywords

def extract_keywords_from_db():
    supabase_url = "https://lffgvxlrhtnxwrbedvhc.supabase.co"
    supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZmd2eGxyaHRueHdyYmVkdmhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5OTY2NTAsImV4cCI6MjA1MjU3MjY1MH0.mJpVa789C7rCdXg3QEp3jWJWXtc4XCQ8Xu0yh-ztiEY"
    supabase = create_client(supabase_url, supabase_key)
    
    words_to_remove = [
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'if',
    'in', 'into', 'is', 'it', 'no', 'not', 'of', 'on', 'or', 'such', 
    'that', 'the', 'their', 'then', 'there', 'these', 'they', 'this', 
    'to', 'was', 'will', 'with', 'from', 'which', 'what', 'when', 'where', 
    'who', 'whom', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 
    'more', 'most', 'other', 'some', 'such', 'only', 'own', 'same', 
    'so', 'than', 'too', 'very',

    'used', 'using', 'used', 'can', 'could', 'may', 'might', 'should', 
    'would', 'will', 'shall', 'does', 'do', 'did', 'done', 'make', 'made', 
    'data', 'analysis', 'study', 'research', 'result', 'results', 'based', 
    'approach', 'method', 'methods', 'model', 'models', 'algorithm', 
    'algorithms', 'system', 'systems', 'study', 'report', 'findings',

    'paper', 'article', 'journal', 'review', 'evidence', 'information', 
    'knowledge', 'science', 'scientific', 'experiment', 'experiments', 
    'conclusion', 'conclusions', 'finding', 'observed', 'based', 'analysis',

    'new', 'used', 'use', 'one', 'two', 'first', 'second', 'third', 
    'many', 'various', 'often', 'also', 'further', 'furthermore', 'although', 
    'however', 'therefore', 'thus', 'hence', 'mean', 'means', 'using', 
    'within', 'among', 'between'
]
    response = supabase.table('conversations').select('id,content').execute()
    conversations = response.data
    
    for conversation in conversations:
        text = conversation['content']
        text = text.split()
        text = [word for word in text if word not in words_to_remove]
        text = ' '.join(text)

        keywords = extract_keywords(text)
        keyword_list = [keyword for keyword, score in keywords]
        
        supabase.table('conversations').update({
            'insights': keyword_list
        }).eq('id', conversation['id']).execute()

if __name__ == "__main__":
    extract_keywords_from_db()