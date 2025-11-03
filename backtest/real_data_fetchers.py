"""
Real Data Fetchers
1. M2 Global Liquidity from FRED
2. ETF Flows from Farside Investors
"""

import pandas as pd
import requests
from datetime import datetime, timedelta
from fredapi import Fred
from bs4 import BeautifulSoup

# FRED API Key (бесплатный)
# Get yours at: https://fred.stlouisfed.org/docs/api/api_key.html
FRED_API_KEY = "d8cc74b2c62b2bf3f6372347efdbf1b9"  # Замени на свой ключ

def fetch_m2_global_liquidity(start_date: str = "2019-01-01") -> pd.Series:
    """
    Fetch M2 Global Liquidity from FRED
    
    Components:
    - M2SL: USA M2 Money Supply
    - TODO: Add EU, CN, JP M2 when available
    
    For now: just USA M2 as proxy
    """
    print("[FRED] Fetching M2 Money Supply (USA)...")
    
    try:
        fred = Fred(api_key=FRED_API_KEY)
        
        # M2 Money Supply (USA) - monthly data
        m2_usa = fred.get_series('M2SL', observation_start=start_date)
        
        # Convert to daily (forward fill)
        m2_daily = m2_usa.resample('D').ffill()
        
        # Normalize to [-1, 1] using percent change from mean
        m2_mean = m2_daily.mean()
        m2_normalized = (m2_daily - m2_mean) / m2_mean
        
        # Clip to [-1, 1]
        m2_normalized = m2_normalized.clip(-1, 1)
        
        print(f"[FRED] ✅ M2 data: {len(m2_daily)} days")
        return m2_normalized
        
    except Exception as e:
        print(f"[FRED] ❌ Failed to fetch M2: {e}")
        print("[FRED] Using fallback synthetic M2...")
        
        # Fallback: synthetic data
        dates = pd.date_range(start=start_date, end=datetime.now(), freq='D')
        days = range(len(dates))
        m2 = pd.Series(
            [0.3 * (i / len(dates)) + 0.2 * (i % 365 / 365) for i in days],
            index=dates
        )
        return m2.clip(-1, 1)

def fetch_etf_flows_farside() -> pd.DataFrame:
    """
    Scrape BTC ETF flows from Farside Investors
    https://farside.co.uk/btc/
    
    Returns DataFrame with columns: date, total_flow
    """
    print("[Farside] Fetching BTC ETF flows...")
    
    url = "https://farside.co.uk/btc/"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find the table with ETF data
        table = soup.find('table')
        
        if not table:
            raise Exception("Table not found on page")
        
        # Parse table into DataFrame
        rows = []
        for tr in table.find_all('tr')[1:]:  # Skip header
            cols = tr.find_all('td')
            if len(cols) < 2:
                continue
            
            date_str = cols[0].text.strip()
            try:
                # Parse date (format: "Oct 30")
                date = datetime.strptime(f"{date_str} 2024", "%b %d %Y")
            except:
                continue
            
            # Sum all ETF flows (skip first column which is date)
            total_flow = 0
            for col in cols[1:]:
                try:
                    value = col.text.strip().replace(',', '').replace('$', '')
                    if value and value != '-':
                        total_flow += float(value)
                except:
                    pass
            
            rows.append({'date': date, 'flow': total_flow * 1_000_000})  # Convert to dollars
        
        df = pd.DataFrame(rows)
        df = df.set_index('date').sort_index()
        
        print(f"[Farside] ✅ ETF flows: {len(df)} days")
        return df
        
    except Exception as e:
        print(f"[Farside] ❌ Failed to scrape: {e}")
        print("[Farside] Using fallback synthetic ETF flows...")
        
        # Fallback: synthetic data from Jan 2024
        dates = pd.date_range(start="2024-01-01", end=datetime.now(), freq='D')
        flows = pd.Series(
            [float(i % 30 - 15) * 50_000_000 for i in range(len(dates))],  # -750M to +750M
            index=dates
        )
        return pd.DataFrame({'flow': flows})

def calculate_etf_flow_signal(etf_df: pd.DataFrame, ma_window: int = 5) -> pd.Series:
    """
    Calculate ETF flow signal
    
    Formula: tanh((daily_flow - ma5_flow) / 100M)
    Range: [-1, 1]
    """
    if etf_df.empty:
        return pd.Series(dtype=float)
    
    # 5-day moving average
    ma5 = etf_df['flow'].rolling(ma_window).mean()
    
    # Deviation from MA
    deviation = etf_df['flow'] - ma5
    
    # Normalize using tanh
    import numpy as np
    signal = np.tanh(deviation / 100_000_000)  # 100M normalization
    
    return pd.Series(signal, index=etf_df.index)
