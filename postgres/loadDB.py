from supabase import create_client
import os
from dotenv import load_dotenv
import pandas as pd
from sqlalchemy import create_engine
import arxiv
from datetime import datetime, timedelta
from sqlalchemy.exc import OperationalError
import psycopg2

def get_recent_arxiv_papers(weeks_ago=1, max_results=1000):
    # Calculate the date range
    today = datetime.now()
    start_date = (today - timedelta(weeks=weeks_ago)).strftime('%Y%m%d%H%M%S')
    end_date = today.strftime('%Y%m%d%H%M%S')

    # Create search query
    search_query = f'submittedDate:[{start_date} TO {end_date}]'

    # Initialize the arXiv API client
    search = arxiv.Search(
        query=search_query,
        max_results=max_results,
        sort_by=arxiv.SortCriterion.SubmittedDate
    )

    # Create lists to store the data
    papers_data = []

    # Iterate over the search results
    for result in search.results():
        paper = {
            'Title': result.title,
            'Abstract': result.summary,
            'Authors': ', '.join([author.name for author in result.authors]),
            'Published Date': result.published.strftime('%Y-%m-%d'),
            'Link': result.entry_id
        }
        papers_data.append(paper)

    # Convert to DataFrame
    return pd.DataFrame(papers_data)

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

supabase = create_client(url, key)

df = get_recent_arxiv_papers()

print('Data fetched successfully')

data_dict = df.to_dict(orient='records')

supabase.table('arxiv_data').insert(data_dict).execute()

print('Data inserted successfully')