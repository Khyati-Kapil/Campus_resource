from __future__ import annotations

from typing import List

import requests

POSITIVE_WORDS = {
    "gain",
    "growth",
    "beat",
    "surge",
    "strong",
    "bullish",
    "profit",
    "upgrade",
    "outperform",
}
NEGATIVE_WORDS = {
    "loss",
    "drop",
    "fall",
    "weak",
    "bearish",
    "downgrade",
    "miss",
    "decline",
    "risk",
}


def score_sentiment(text: str) -> float:
    words = text.lower().split()
    pos = sum(1 for word in words if word.strip(".,:;!?()[]{}\"'") in POSITIVE_WORDS)
    neg = sum(1 for word in words if word.strip(".,:;!?()[]{}\"'") in NEGATIVE_WORDS)
    total = pos + neg
    if total == 0:
        return 0.0
    return (pos - neg) / total


def sentiment_label(score: float) -> str:
    if score > 0.15:
        return "POSITIVE"
    if score < -0.15:
        return "NEGATIVE"
    return "NEUTRAL"


def fetch_news_headlines(ticker: str, api_key: str, page_size: int = 10) -> List[str]:
    if not api_key:
        return []

    url = "https://newsapi.org/v2/everything"
    params = {
        "q": ticker,
        "sortBy": "publishedAt",
        "language": "en",
        "pageSize": page_size,
        "apiKey": api_key,
    }
    resp = requests.get(url, params=params, timeout=10)
    resp.raise_for_status()
    payload = resp.json()
    articles = payload.get("articles", [])
    return [item.get("title", "").strip() for item in articles if item.get("title")]


def summarize_ticker_sentiment(ticker: str, api_key: str | None = None) -> dict:
    headlines = fetch_news_headlines(ticker, api_key) if api_key else []
    if not headlines:
        return {
            "ticker": ticker,
            "score": 0.0,
            "label": "NEUTRAL",
            "headlines": [],
            "note": "No NewsAPI key or no recent headlines",
        }

    scores = [score_sentiment(title) for title in headlines]
    avg = sum(scores) / len(scores)
    return {
        "ticker": ticker,
        "score": avg,
        "label": sentiment_label(avg),
        "headlines": headlines,
    }
