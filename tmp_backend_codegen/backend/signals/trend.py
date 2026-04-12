from __future__ import annotations

import pandas as pd


def _ema(series: pd.Series, span: int) -> pd.Series:
    return series.ewm(span=span, adjust=False).mean()


def compute_rsi(prices: pd.Series, window: int = 14) -> pd.Series:
    delta = prices.diff()
    gain = delta.clip(lower=0).rolling(window=window).mean()
    loss = -delta.clip(upper=0).rolling(window=window).mean()
    rs = gain / loss.replace(0, pd.NA)
    rsi = 100 - (100 / (1 + rs))
    return rsi.fillna(50)


def compute_macd(prices: pd.Series) -> pd.DataFrame:
    ema12 = _ema(prices, 12)
    ema26 = _ema(prices, 26)
    macd_line = ema12 - ema26
    signal = _ema(macd_line, 9)
    hist = macd_line - signal
    return pd.DataFrame({"macd": macd_line, "signal": signal, "hist": hist})


def generate_trend_signal(prices: pd.Series) -> dict:
    if prices.empty:
        raise ValueError("Price series is empty")

    sma20 = prices.rolling(window=20).mean()
    sma50 = prices.rolling(window=50).mean()
    rsi = compute_rsi(prices)
    macd = compute_macd(prices)

    latest_price = float(prices.iloc[-1])
    latest_sma20 = float(sma20.iloc[-1]) if pd.notna(sma20.iloc[-1]) else latest_price
    latest_sma50 = float(sma50.iloc[-1]) if pd.notna(sma50.iloc[-1]) else latest_price
    latest_rsi = float(rsi.iloc[-1])
    latest_macd = float(macd["macd"].iloc[-1])
    latest_signal = float(macd["signal"].iloc[-1])

    bullish = latest_price > latest_sma20 > latest_sma50 and latest_macd > latest_signal and latest_rsi < 70
    bearish = latest_price < latest_sma20 < latest_sma50 and latest_macd < latest_signal and latest_rsi > 30

    if bullish:
        verdict = "BUY"
    elif bearish:
        verdict = "SELL"
    else:
        verdict = "HOLD"

    return {
        "signal": verdict,
        "last_price": latest_price,
        "sma20": latest_sma20,
        "sma50": latest_sma50,
        "rsi14": latest_rsi,
        "macd": latest_macd,
        "macd_signal": latest_signal,
    }


def analyze_trends(price_table: pd.DataFrame) -> dict:
    results = {}
    for ticker in price_table.columns:
        series = price_table[ticker].dropna()
        if len(series) < 30:
            results[ticker] = {"signal": "HOLD", "reason": "insufficient_history"}
            continue
        results[ticker] = generate_trend_signal(series)
    return results
