"""
Main runner for OE-BTC Backtest
Usage: python run_backtest.py
"""

import pandas as pd
from data_fetcher import fetch_all_data
from backtester import run_backtest

def main():
    print("🚀 OE-BTC Backtest Starting...\n")
    
    # 1. Загрузить данные
    data = fetch_all_data()
    
    if 'BTC-USD' not in data or 'SPY' not in data or 'QQQ' not in data or 'EEM' not in data or 'GLD' not in data:
        print("❌ Missing required data. Exiting.")
        return
    
    # 2. Запустить backtest
    results = run_backtest(
        btc_df=data['BTC-USD'],
        spy_df=data['SPY'],
        qqq_df=data['QQQ'],
        eem_df=data['EEM'],
        gld_df=data['GLD']
    )
    
    print("🎉 Backtest Complete!\n")

if __name__ == "__main__":
    main()
