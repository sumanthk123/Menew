from supabase import create_client, Client
import os
from dotenv import load_dotenv
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(url, key)



def query_arxiv_data():
    response = supabase.table('arxiv_data').select('*').execute()
    return response

def keywords_query():
    # with open('insights.txt', 'r') as file:
    #     keywords = file.read().splitlines()
    keywords = [
    "Organic Chemistry",
    "Inorganic Chemistry",
    "Analytical Chemistry",
    "Physical Chemistry",
    "Quantum Chemistry",
    "Computational Chemistry",
    "Chemical Kinetics",
    "Spectroscopy",
    "Polymer Chemistry",
    "Nanomaterials",
    "Catalysis",
    "Electrochemistry",
    "Green Chemistry",
    "Biochemistry",
    "Drug Discovery",
    "Crystallography",
    "Photochemistry",
    "Supramolecular Chemistry",
    "Materials Chemistry",
    "Chemical Engineering"
]

    response = query_arxiv_data()
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
print(keywords_query())

