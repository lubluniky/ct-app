"""
OE-BTC Backtest - Data Fetcher
Загружает 5 лет исторических данных через yfinance
"""

import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
import json

def fetch_yahoo_data(ticker: str, period: str = "5y") -> pd.DataFrame:
    """Загрузить данные с Yahoo Finance"""
    print(f"[Yahoo Finance] Fetching {ticker}...")
    
    try:
        stock = yf.Ticker(ticker)
        df = stock.history(period=period)
        
        # Переименовываем колонки
        df = df.rename(columns={'Close': 'close', 'Open': 'open', 'High': 'high', 'Low': 'low', 'Volume': 'volume'})
        df = df[['open', 'high', 'low', 'close', 'volume']]
        
        print(f"[Yahoo Finance] ✅ {ticker}: {len(df)} bars")
        return df
    
    except Exception as e:
        print(f"[Yahoo Finance] ❌ Failed to fetch {ticker}: {e}")
        raise

def fetch_all_data():
    """Загрузить все необходимые данные"""
    print("\n🚀 Fetching Historical Data (5 years)...\n")
    
    tickers = {
        'BTC-USD': 'Bitcoin',
        'SPY': 'S&P 500',
        'QQQ': 'Nasdaq-100',
        'EEM': 'Emerging Markets',
        'GLD': 'Gold ETF',
    }
    
    data = {}
    
    for ticker, name in tickers.items():
        try:
            df = fetch_yahoo_data(ticker, period="5y")
            data[ticker] = df
        except Exception as e:
            print(f"⚠️ Skipping {ticker} due to error")
            continue
    
    return data

def save_to_csv(data: dict, output_dir: str = "."):
    """Сохранить данные в CSV файлы"""
    print("\n💾 Saving data to CSV files...")
    
    for ticker, df in data.items():
        filename = f"{output_dir}/{ticker.replace('-', '_')}_data.csv"
        df.to_csv(filename)
        print(f"✅ Saved: {filename}")

if __name__ == "__main__":
    # Загрузить данные
    data = fetch_all_data()
    
    # Показать статистику
    print("\n📊 Data Summary:")
    for ticker, df in data.items():
        print(f"  {ticker}: {df.index[0].date()} to {df.index[-1].date()} ({len(df)} days)")
    
    # Сохранить в CSV
    save_to_csv(data)
    
    print("\n✅ Data fetch complete!")
