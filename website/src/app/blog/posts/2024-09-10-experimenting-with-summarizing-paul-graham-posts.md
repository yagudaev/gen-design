---
slug: experimenting-with-summarizing-paul-graham-posts
title: 'AI Summarization Experiments: From Paul Graham to Personalized Advice'
excerpt: 'Exploring AI summarization with Paul Graham essays and beyond'
date: '2024-09-10T08:35:07.322Z'
author:
  name: Michael Yagudaev
  slug: yagudaev
category: 'our-story'
chapterId: 2622
---

Video:
[![IMAGE ALT TEXT](http://img.youtube.com/vi/oL6k7GV0uvo/0.jpg)](http://www.youtube.com/watch?v=oL6k7GV0uvo 'Video Title')

## The Experiment

- Loaded Paul Graham's essays into AudioWave (3 million characters, ~750,000 tokens)
- Used AI to summarize and generate personalized advice
- Compared AI impersonations of Paul Graham and Peter Levels
- Created a chat feature for Peter Levels' "12 startups in 12 months" posts

## Key Findings

- Most LLMs struggle with long content due to token limits.
- Gemini 1.5 Pro with 2M token context window performed the best.
- GPT-4o and Claude 3.5 Sonnet have context windows of 250K and 300K respectively. This required splitting the content and summarizing each chunk. Then a summary of summaries was generated.
- Personalized advice from AI was surprisingly relevant
- AI impersonations of different entrepreneurs yielded similar advice, likely due to them already having the data in the training and perhaps due to generic advice seeming the "most correct".
- Cost was about $7 for close to the ~1M tokens on Gemini and similar cost for the LLM APIs.

## Future Explorations

- Improved prompt engineering
- Retrieval augmentation (RAG)
- Fine-tuning models
- On device models like ChromeAI, Gemini Nano, Apple Intelligence, etc (main issue is small context window)
- Format length consideration 5min, 10min, 30min, 60min, 90min summaries. Concise writing like Paul Graham's essay might mean a lot of relevant information is lost when doing a 5min summary based on over 60hrs of content.
- Compare to human summaries [like this one](https://www.audiowaveai.com/p/3723-summary-human---part-1).

Interested in collaborating or have ideas? Let's chat!

P.S. Check the video for more details.
