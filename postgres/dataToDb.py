import pandas as pd
from sqlalchemy import create_engine
import os
from arxiv.fetchpapers2 import get_recent_arxiv_papers

db_params = {
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT'),
    'database': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD')
}

connection_string = f"postgresql://{db_params['user']}:{db_params['password']}@{db_params['host']}:{db_params['port']}/{db_params['database']}"

engine = create_engine(connection_string)

df = get_recent_arxiv_papers()
df.to_sql('arxiv_data', engine, if_exists='replace', index=False)
