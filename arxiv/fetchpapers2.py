import arxiv
import pandas as pd
from datetime import datetime, timedelta

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
            'Journal Reference': result.journal_ref if result.journal_ref else 'No journal reference',
            'Authors': ', '.join([author.name for author in result.authors]),
            'Published Date': result.published.strftime('%Y-%m-%d'),
            'Link': result.entry_id
        }
        papers_data.append(paper)

    # Convert to DataFrame
    return pd.DataFrame(papers_data)
