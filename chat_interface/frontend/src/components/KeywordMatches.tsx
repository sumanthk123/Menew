import React from 'react';

interface Paper {
    Title: string;
    Abstract: string;
    Authors: string;
    'Published Date': string;
}

interface KeywordMatchesProps {
    papers: Paper[];
}

const KeywordMatches: React.FC<KeywordMatchesProps> = ({ papers }) => {
    if (!papers.length) {
        return null;
    }

    return (
        <div className="w-full max-w-4xl mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4 text-violet-600">
                Papers Matching Your Interests
            </h2>
            <div className="space-y-4">
                {papers.map((paper, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow">
                        <h3 className="font-semibold text-lg mb-2">{paper.Title}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                            {paper.Authors} • {paper['Published Date']}
                        </p>
                        <p className="text-gray-700">{paper.Abstract}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default KeywordMatches;