import pandas as pd
from sqlalchemy import create_engine
import os

db_params = {
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT'),
    'database': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD')
}

connection_string = f"postgresql://{db_params['user']}:{db_params['password']}@{db_params['host']}:{db_params['port']}/{db_params['database']}"

engine = create_engine(connection_string)

df = pd.read_csv('pubmed_data.csv')
df.to_sql('pubmed_data', engine, if_exists='replace', index=False)
