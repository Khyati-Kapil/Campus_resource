from __future__ import annotations

from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from backend.data.fetcher import fetch_price_history, fetch_single_price_series
from backend.data.preprocessor import (
    build_portfolio_returns,
    compute_returns,
    normalize_weights,
)
from backend.risk.beta import beta_alpha
from backend.risk.correlation import correlation_matrix
from backend.risk.sharpe import sharpe_ratio, sortino_ratio
from backend.risk.var import (
    historical_cvar,
    historical_var,
    monte_carlo_var,
    parametric_var_cvar,
)
from backend.signals.sentiment import summarize_ticker_sentiment
from backend.signals.trend import analyze_trends
from backend.simulation.monte_carlo import simulate_portfolio_paths


class Holding(BaseModel):
    ticker: str = Field(..., min_length=1)
    weight: float = Field(..., gt=0)


class ScenarioShock(BaseModel):
    ticker: Optional[str] = None
    drop_pct: float = Field(..., gt=0, lt=1)


class PortfolioRequest(BaseModel):
    holdings: List[Holding] = Field(..., min_length=1)
    benchmark: str = "^NSEI"
    period: str = "2y"
    interval: str = "1d"
    confidence: float = Field(0.95, gt=0, lt=1)
    risk_free_rate: float = 0.065
    horizon_days: int = Field(30, gt=0)
    simulations: int = Field(2000, gt=0, le=20000)
    seed: Optional[int] = None


class SentimentRequest(BaseModel):
    tickers: List[str] = Field(..., min_length=1)
    news_api_key: Optional[str] = None


app = FastAPI(title="Stock Portfolio Risk Analyzer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _extract_holdings(payload: PortfolioRequest) -> tuple[list[str], list[float]]:
    tickers = [item.ticker for item in payload.holdings]
    weights = [item.weight for item in payload.holdings]
    normalize_weights(weights)
    return tickers, weights


def _load_portfolio_data(payload: PortfolioRequest):
    tickers, weights = _extract_holdings(payload)
    prices = fetch_price_history(
        tickers=tickers,
        period=payload.period,
        interval=payload.interval,
        add_ns_suffix=True,
    )
    if prices.shape[1] != len(tickers):
        raise ValueError("Some tickers returned no data from source")

    asset_returns = compute_returns(prices, method="simple")
    portfolio_ret = build_portfolio_returns(asset_returns, weights)

    benchmark_prices = fetch_single_price_series(
        ticker=payload.benchmark,
        period=payload.period,
        interval=payload.interval,
        add_ns_suffix=False,
    )
    benchmark_ret = compute_returns(benchmark_prices.to_frame("benchmark"), method="simple").iloc[:, 0]

    return prices, asset_returns, portfolio_ret, benchmark_ret, normalize_weights(weights)


def _analysis_response(payload: PortfolioRequest) -> dict:
    prices, asset_returns, portfolio_ret, benchmark_ret, normalized_weights = _load_portfolio_data(payload)

    h_var = historical_var(portfolio_ret, payload.confidence)
    h_cvar = historical_cvar(portfolio_ret, payload.confidence)
    p_var, p_cvar = parametric_var_cvar(portfolio_ret, payload.confidence)
    mc_var = monte_carlo_var(
        portfolio_ret,
        confidence=payload.confidence,
        n_sims=payload.simulations,
        horizon_days=payload.horizon_days,
        seed=payload.seed,
    )

    sharpe = sharpe_ratio(portfolio_ret, risk_free_rate=payload.risk_free_rate)
    sortino = sortino_ratio(portfolio_ret, risk_free_rate=payload.risk_free_rate)
    beta = beta_alpha(portfolio_ret, benchmark_ret, risk_free_rate=payload.risk_free_rate)

    corr = correlation_matrix(asset_returns)
    simulation = simulate_portfolio_paths(
        prices=prices,
        weights=normalized_weights,
        horizon_days=payload.horizon_days,
        n_sims=payload.simulations,
        seed=payload.seed,
    )
    trends = analyze_trends(prices)

    return {
        "inputs": payload.model_dump(),
        "metrics": {
            "historical_var": h_var,
            "historical_cvar": h_cvar,
            "parametric_var": p_var,
            "parametric_cvar": p_cvar,
            "monte_carlo_var": mc_var,
            "sharpe_ratio": sharpe,
            "sortino_ratio": sortino,
            "beta": beta["beta"],
            "alpha_annual": beta["alpha_annual"],
            "r_squared": beta["r_squared"],
            "observations": beta["observations"],
        },
        "correlation_matrix": corr.round(4).to_dict(),
        "portfolio_returns": {
            "dates": [str(idx.date()) for idx in portfolio_ret.index],
            "values": [float(v) for v in portfolio_ret.values],
        },
        "simulation": simulation,
        "trend_signals": trends,
    }


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/api/analyze")
def analyze_portfolio(payload: PortfolioRequest) -> dict:
    try:
        return _analysis_response(payload)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/api/simulate")
def simulate(payload: PortfolioRequest) -> dict:
    try:
        prices, _, _, _, weights = _load_portfolio_data(payload)
        return simulate_portfolio_paths(
            prices=prices,
            weights=weights,
            horizon_days=payload.horizon_days,
            n_sims=payload.simulations,
            seed=payload.seed,
        )
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/api/scenario")
def scenario_analysis(payload: PortfolioRequest, scenario: ScenarioShock) -> dict:
    try:
        prices, asset_returns, _, _, weights = _load_portfolio_data(payload)

        shocked_prices = prices.copy()
        if scenario.ticker:
            candidates = [c for c in shocked_prices.columns if c.startswith(scenario.ticker.upper())]
            if not candidates:
                raise ValueError(f"Ticker {scenario.ticker} not found in portfolio")
            target = candidates[0]
            shocked_prices[target] = shocked_prices[target] * (1 - scenario.drop_pct)
        else:
            shocked_prices = shocked_prices * (1 - scenario.drop_pct)

        shocked_returns = compute_returns(shocked_prices, method="simple")
        baseline_port = build_portfolio_returns(asset_returns, weights)
        shocked_port = build_portfolio_returns(shocked_returns, weights)

        baseline_var = historical_var(baseline_port, payload.confidence)
        shocked_var = historical_var(shocked_port, payload.confidence)

        return {
            "scenario": scenario.model_dump(),
            "baseline": {
                "historical_var": baseline_var,
                "mean_return": float(baseline_port.mean()),
            },
            "shocked": {
                "historical_var": shocked_var,
                "mean_return": float(shocked_port.mean()),
            },
            "delta_var": shocked_var - baseline_var,
        }
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/api/signals")
def signals(payload: PortfolioRequest) -> dict:
    try:
        tickers, _ = _extract_holdings(payload)
        prices = fetch_price_history(tickers=tickers, period=payload.period, interval=payload.interval)
        return {"signals": analyze_trends(prices)}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/api/sentiment")
def sentiment(payload: SentimentRequest) -> dict:
    try:
        results = [summarize_ticker_sentiment(ticker, payload.news_api_key) for ticker in payload.tickers]
        return {"sentiment": results}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
