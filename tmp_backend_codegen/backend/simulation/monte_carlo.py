from __future__ import annotations

import numpy as np
import pandas as pd


def simulate_portfolio_paths(
    prices: pd.DataFrame,
    weights: np.ndarray,
    horizon_days: int = 30,
    n_sims: int = 1000,
    seed: int | None = None,
) -> dict:
    if prices.empty:
        raise ValueError("Price table is empty")
    if n_sims <= 0 or horizon_days <= 0:
        raise ValueError("n_sims and horizon_days must be positive")

    w = np.asarray(weights, dtype=float)
    w = w / w.sum()

    log_returns = np.log(prices / prices.shift(1)).dropna(how="any")
    if log_returns.empty:
        raise ValueError("Not enough data to run Monte Carlo simulation")

    mu = log_returns.mean().values
    cov = log_returns.cov().values
    n_assets = len(mu)

    jitter = 1e-10 * np.eye(n_assets)
    chol = np.linalg.cholesky(cov + jitter)

    rng = np.random.default_rng(seed)
    z = rng.standard_normal(size=(horizon_days, n_sims, n_assets))
    sim_log_rets = z @ chol.T + mu

    growth = np.exp(np.cumsum(sim_log_rets, axis=0))
    port_values = np.einsum("tna,a->tn", growth, w)

    day0 = np.ones((1, n_sims))
    port_values = np.vstack([day0, port_values])

    percentiles = {
        "p5": np.percentile(port_values, 5, axis=1).tolist(),
        "p50": np.percentile(port_values, 50, axis=1).tolist(),
        "p95": np.percentile(port_values, 95, axis=1).tolist(),
    }

    return {
        "days": list(range(horizon_days + 1)),
        "sample_paths": port_values[:, : min(100, n_sims)].T.tolist(),
        "percentiles": percentiles,
        "terminal": {
            "mean": float(port_values[-1].mean()),
            "min": float(port_values[-1].min()),
            "max": float(port_values[-1].max()),
        },
    }
