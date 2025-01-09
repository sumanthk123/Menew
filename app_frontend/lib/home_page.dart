// lib/home_page.dart

import 'package:flutter/material.dart';
import 'detail_page.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    // Dummy data for articles
    final List<Map<String, String>> articles = [
      {
        'headline': 'Rudy Giuliani Held in Contempt',
        'subHeadline': 'A federal judge found Giuliani in contempt...',
        'imageUrl': 'https://via.placeholder.com/600x300?text=Article+Image+1'
      },
      {
        'headline': 'Biden Permanently Bans Offshore Drilling',
        'subHeadline': 'In over 625 million acres of ocean...',
        'imageUrl': 'https://via.placeholder.com/600x300?text=Article+Image+2'
      },
      // Add more dummy articles as needed
    ];

    return Scaffold(
      backgroundColor: Colors.black, // match the dark background from screenshot
      body: SafeArea(
        child: Column(
          children: [
            // Top Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
              child: _buildHeader(context),
            ),

            // Main content - scrollable list of articles
            Expanded(
              child: ListView.builder(
                itemCount: articles.length,
                itemBuilder: (context, index) {
                  final article = articles[index];
                  return _buildArticleCard(
                    context,
                    article['headline']!,
                    article['subHeadline']!,
                    article['imageUrl']!,
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Good Evening',
          style: TextStyle(
            color: Colors.white,
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        Row(
          children: [
            Icon(Icons.location_on, color: Colors.purple[300], size: 16),
            const SizedBox(width: 4),
            Text(
              'Nearby: Washington',
              style: TextStyle(
                color: Colors.purple[300],
                fontSize: 14,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildArticleCard(
    BuildContext context,
    String headline,
    String subHeadline,
    String imageUrl,
  ) {
    return GestureDetector(
      onTap: () {
        // Navigate to detail page with the headline as argument
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => DetailPage(
              headline: headline,
              subHeadline: subHeadline,
              imageUrl: imageUrl,
            ),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
        decoration: BoxDecoration(
          color: Colors.grey[900],
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          children: [
            // Image
            ClipRRect(
              borderRadius: BorderRadius.vertical(top: Radius.circular(8)),
              child: Image.network(
                imageUrl,
                height: 180,
                width: double.infinity,
                fit: BoxFit.cover,
              ),
            ),

            // Text content
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    headline,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    subHeadline,
                    style: TextStyle(
                      color: Colors.grey[300],
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
