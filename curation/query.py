from supabase import create_client, Client
import os
from dotenv import load_dotenv
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask import jsonify


load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(url, key)



def query_arxiv_data():
    response = supabase.table('arxiv_data').select('*').execute()
    return response

def keywords_query(user_id):
    # with open('insights.txt', 'r') as file:
    #     keywords = file.read().splitlines()
    response = supabase.table('conversations').select('insights').eq('user_id', user_id).execute()
    keywords = []
    if response.data:
        for row in response.data:
            if row.get('insights'):
                keywords.extend(row['insights'])
    print(keywords)

    response = query_arxiv_data()
    index = 30
    temp = []
    for i in range(index):
        temp.append(response.data[i])
    print(temp[0])

    print(type(response.data[0]))
    # print(jsonify(response.data[0]))
    abstracts = [paper['Abstract'] for paper in response.data]
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(abstracts)
    keyword_vectors = vectorizer.transform(keywords)
    num_top_matches = 30
    for i, keyword in enumerate(keywords):
        keyword_vector = keyword_vectors[i]
        cosine_similarities = cosine_similarity(keyword_vector, tfidf_matrix).flatten()
        top_indices = cosine_similarities.argsort()[-num_top_matches:][::-1]
        # print(f"Top {num_top_matches} matches for keyword '{keyword}':")
    return [int(i)+2 for i in top_indices]
    # return [abstracts[index] for index in top_indices]
        
# temp = [paper for paper in keywords_query().data]
print(keywords_query('a63a6d1c-4e74-4368-a58a-b189b01de574'))

