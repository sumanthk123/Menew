from Bio import Entrez
import pandas as pd
import numpy as np

 
def search(query):
    Entrez.email = 'email@example.com'
    handle = Entrez.esearch(db='pubmed',
                           sort='relevance',
                           retmax='250000',
                           retmode='xml',
                           term=query)
    results = Entrez.read(handle)
    return results

studies = search('COVID-19')
studiesIdList = studies['IdList']

def fetch_details(id_list):
    ids = ','.join(id_list)
    Entrez.email = 'email@example.com'
    handle = Entrez.efetch(db='pubmed',
                          retmode='xml',
                          id=ids)
    results = Entrez.read(handle)
    return results

title_list = []
abstract_list = []
journal_list = []
language_list = []
pubdate_year_list = []
pubdate_month_list = []
studies = fetch_details(studiesIdList)
chunk_size = 10000
for chunk_i in range(0, len(studiesIdList), chunk_size):
    chunk = studiesIdList[chunk_i:chunk_i + chunk_size]
    papers = fetch_details(chunk)
    for i, paper in enumerate(papers['PubmedArticle']):
        title_list.append(paper['MedlineCitation']['Article']['ArticleTitle'])
        try:
            abstract_list.append(paper['MedlineCitation']['Article']['Abstract']['AbstractText'][0])
        except:
            abstract_list.append('No Abstract')
        journal_list.append(paper['MedlineCitation']['Article']['Journal']['Title'])
        language_list.append(paper['MedlineCitation']['Article']['Language'][0])
        try:
            pubdate_year_list.append(paper['MedlineCitation']['Article']['Journal']['JournalIssue']['PubDate']['Year'])
        except:
            pubdate_year_list.append('No Data')
        try:
            pubdate_month_list.append(paper['MedlineCitation']['Article']['Journal']['JournalIssue']['PubDate']['Month'])
        except:
            pubdate_month_list.append('No Data')
df = pd.DataFrame(list(zip(
    title_list, abstract_list, journal_list, language_list, pubdate_year_list, pubdate_month_list
)),
columns=[
    'Title', 'Abstract', 'Journal', 'Language', 'Year', 'Month'
])

df.to_csv('pubmed_data.csv', index=False)