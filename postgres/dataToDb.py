import pandas as pd
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv
# from ..arxiv.fetchpapers import get_recent_arxiv_papers
import arxiv
import pandas as pd
from datetime import datetime, timedelta
from sqlalchemy.exc import OperationalError
import psycopg2

# def get_recent_arxiv_papers(weeks_ago=1, max_results=1000):
#     # Calculate the date range
#     today = datetime.now()
#     start_date = (today - timedelta(weeks=weeks_ago)).strftime('%Y%m%d%H%M%S')
#     end_date = today.strftime('%Y%m%d%H%M%S')

#     # Create search query
#     search_query = f'submittedDate:[{start_date} TO {end_date}]'

#     # Initialize the arXiv API client
#     search = arxiv.Search(
#         query=search_query,
#         max_results=max_results,
#         sort_by=arxiv.SortCriterion.SubmittedDate
#     )

#     # Create lists to store the data
#     papers_data = []

#     # Iterate over the search results
#     for result in search.results():
#         paper = {
#             'Title': result.title,
#             'Abstract': result.summary,
#             'Journal Reference': result.journal_ref if result.journal_ref else 'No journal reference',
#             'Authors': ', '.join([author.name for author in result.authors]),
#             'Published Date': result.published.strftime('%Y-%m-%d'),
#             'Link': result.entry_id
#         }
#         papers_data.append(paper)

#     # Convert to DataFrame
#     return pd.DataFrame(papers_data)

# load_dotenv()
# db_params = {
#     'host': os.getenv('DB_HOST'),
#     'port': os.getenv('DB_PORT'),
#     'database': os.getenv('DB_NAME'),
#     'user': os.getenv('DB_USER'),
#     'password': os.getenv('DB_PASSWORD')
# }

# print(db_params)

# connection_string = f"postgresql://postgres:MenewDatabase1234@db.mvrxbescteqrmkqgoqsd.supabase.co:5432/postgres"

# engine = create_engine(connection_string)

# try:
#     # Attempt to connect to the database
#     with engine.connect() as connection:
#         print("Connection to the database was successful.")
# except OperationalError as e:
#     print("Failed to connect to the database.")
#     print(e)


load_dotenv()
USER = os.getenv("DB_USER")
PASSWORD = os.getenv("DB_PASSWORD")
HOST = os.getenv("DB_HOST")
PORT = os.getenv("DB_PORT")
DBNAME = os.getenv("DB_NAME")

# Connect to the database
try:
    connection = psycopg2.connect(
        user=USER,
        password=PASSWORD,
        host=HOST,
        port=PORT,
        dbname=DBNAME
    )
    print("Connection successful!")
    
    # Create a cursor to execute SQL queries
    cursor = connection.cursor()
    
    # Example query
    cursor.execute("SELECT NOW();")
    result = cursor.fetchone()
    print("Current Time:", result)

    # Close the cursor and connection
    cursor.close()
    connection.close()
    print("Connection closed.")

except Exception as e:
    print(f"Failed to connect: {e}")

# df = get_recent_arxiv_papers()
# print(df)
df = pd.DataFrame()
# df.to_sql('arxiv_data', engine, if_exists='replace', index=False)
