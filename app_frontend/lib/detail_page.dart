// lib/detail_page.dart

import 'package:flutter/material.dart';

class DetailPage extends StatelessWidget {
  final String headline;
  final String subHeadline;
  final String imageUrl;

  const DetailPage({
    super.key,
    required this.headline,
    required this.subHeadline,
    required this.imageUrl,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: Text(headline),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                // Big image on top
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.network(
                    imageUrl,
                    fit: BoxFit.cover,
                  ),
                ),
                const SizedBox(height: 16),
                // Headline
                Text(
                  headline,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                // Sub headline
                Text(
                  subHeadline,
                  style: TextStyle(
                    color: Colors.grey[300],
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 16),
                // Placeholder for article content
                Text(
                  'Full article content goes here... '
                  'Replace with real news article text or widgets as desired.',
                  style: TextStyle(
                    color: Colors.grey[400],
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
