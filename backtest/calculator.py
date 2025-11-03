"""
OE-BTC Calculator
Расчет компонентов формулы (ORIGINAL VERSION from site):
- Macro Risk-On: SPY, QQQ, EEM, GLD↓ above SMA200
- BTC Momentum: BTC > SMA15
- ETF Flows: tanh((daily - ma5) / 100M)
"""

import pandas as pd
import numpy as np
from real_data_fetchers import fetch_etf_flows_farside, calculate_etf_flow_signal

def calculate_sma(data: pd.Series, period: int) -> pd.Series:
    """Простая скользящая средняя"""
    return data.rolling(window=period).mean()

def calculate_macro_risk_on(spy: pd.Series, qqq: pd.Series, eem: pd.Series, gld: pd.Series, sma_period: int = 200) -> pd.Series:
    """
    Macro Risk-On component (ORIGINAL)
    Counts assets above their SMA200
    
    Assets:
    - SPY, QQQ, EEM: +1 if above SMA
    - GLD: +1 if BELOW SMA (inverted)
    
    Formula: (count - 2) / 4  -> range [-0.5, 0.5]
    Aggressive: (count - 2) / 2  -> range [-1, 1]
    """
    # Calculate SMA200 for each
    spy_sma = calculate_sma(spy, sma_period)
    qqq_sma = calculate_sma(qqq, sma_period)
    eem_sma = calculate_sma(eem, sma_period)
    gld_sma = calculate_sma(gld, sma_period)
    
    # Count assets above SMA
    count = pd.Series(0, index=spy.index)
    count += (spy > spy_sma).astype(int)
    count += (qqq > qqq_sma).astype(int)
    count += (eem > eem_sma).astype(int)
    count += (gld < gld_sma).astype(int)  # GLD inverted
    
    # Normalize to [-1, 1] (aggressive)
    macro_signal = (count - 2) / 2
    
    return macro_signal.clip(-1, 1)

def calculate_btc_momentum(btc: pd.Series, sma_period: int = 15) -> pd.Series:
    """
    BTC Momentum (ORIGINAL): +1 if above SMA15, -1 if below
    """
    sma = calculate_sma(btc, sma_period)
    momentum = np.where(btc > sma, 1, -1)
    
    return pd.Series(momentum, index=btc.index)

def calculate_etf_flows_real(dates: pd.DatetimeIndex) -> pd.Series:
    """
    Real ETF flows from Farside Investors
    Available from Jan 2024 onwards
    """
    # Fetch real ETF flow data
    etf_df = fetch_etf_flows_farside()
    
    # Calculate signal
    etf_signal = calculate_etf_flow_signal(etf_df)
    
    # Resample to match dates (fill earlier dates with 0)
    etf_signal = etf_signal.reindex(dates, fill_value=0)
    
    return etf_signal

def calculate_oe_btc(macro: pd.Series, etf: pd.Series, btc_momentum: pd.Series) -> pd.Series:
    """
    ORIGINAL OE-BTC Formula from website:
    
    OE-BTC = 0.4 × Macro + 0.35 × ETF + 0.25 × BTC_Momentum
    """
    oe_btc = 0.4 * macro + 0.35 * etf + 0.25 * btc_momentum
    
    # Clamp to [-1, 1]
    oe_btc = oe_btc.clip(-1, 1)
    
    return oe_btc

def align_data(btc_df: pd.DataFrame, qqq_df: pd.DataFrame, spy_df: pd.DataFrame, eem_df: pd.DataFrame, gld_df: pd.DataFrame) -> pd.DataFrame:
    """
    Выровнять все данные по общим датам
    BTC торгуется 7/24, поэтому используем forward fill для weekends
    """
    # Remove timezone info
    btc_df.index = btc_df.index.tz_localize(None)
    qqq_df.index = qqq_df.index.tz_localize(None)
    spy_df.index = spy_df.index.tz_localize(None)
    eem_df.index = eem_df.index.tz_localize(None)
    gld_df.index = gld_df.index.tz_localize(None)
    
    # Resample to business days
    btc_bd = btc_df.resample('B').last().ffill()
    qqq_bd = qqq_df.resample('B').last().ffill()
    spy_bd = spy_df.resample('B').last().ffill()
    eem_bd = eem_df.resample('B').last().ffill()
    gld_bd = gld_df.resample('B').last().ffill()
    
    # Создаем DataFrame с общими датами
    common_dates = btc_bd.index.intersection(qqq_bd.index).intersection(spy_bd.index).intersection(eem_bd.index).intersection(gld_bd.index)
    
    df = pd.DataFrame(index=common_dates)
    df['btc_close'] = btc_bd.loc[common_dates, 'close']
    df['qqq_close'] = qqq_bd.loc[common_dates, 'close']
    df['spy_close'] = spy_bd.loc[common_dates, 'close']
    df['eem_close'] = eem_bd.loc[common_dates, 'close']
    df['gld_close'] = gld_bd.loc[common_dates, 'close']
    
    return df.dropna()
