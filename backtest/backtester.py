"""
OE-BTC Backtester
Запускает полный backtest с анализом результатов
"""

import pandas as pd
import numpy as np
from calculator import (
    calculate_macro_risk_on,
    calculate_etf_flows_real,
    calculate_btc_momentum,
    calculate_oe_btc,
    align_data
)

def calculate_forward_returns(prices: pd.Series, periods: list = [1, 7, 30]) -> pd.DataFrame:
    """
    Рассчитать будущую доходность для каждого периода
    """
    returns = pd.DataFrame(index=prices.index)
    
    for period in periods:
        future_price = prices.shift(-period)
        returns[f'return_{period}d'] = ((future_price - prices) / prices) * 100
    
    return returns

def analyze_signals(oe_btc: pd.Series, returns: pd.DataFrame) -> dict:
    """
    Анализ точности сигналов
    """
    results = {}
    
    # Risk-On signals (OE-BTC > 0.5)
    risk_on = oe_btc > 0.5
    risk_on_count = risk_on.sum()
    
    # Risk-Off signals (OE-BTC < -0.5)
    risk_off = oe_btc < -0.5
    risk_off_count = risk_off.sum()
    
    results['risk_on_count'] = risk_on_count
    results['risk_off_count'] = risk_off_count
    results['neutral_count'] = len(oe_btc) - risk_on_count - risk_off_count
    
    # Win rates для каждого периода
    for period in [1, 7, 30]:
        col = f'return_{period}d'
        
        # Risk-On win rate (положительная доходность)
        if risk_on_count > 0:
            risk_on_wins = (returns.loc[risk_on, col] > 0).sum()
            results[f'risk_on_winrate_{period}d'] = risk_on_wins / risk_on_count
            results[f'risk_on_avg_return_{period}d'] = returns.loc[risk_on, col].mean()
        else:
            results[f'risk_on_winrate_{period}d'] = 0
            results[f'risk_on_avg_return_{period}d'] = 0
        
        # Risk-Off win rate (отрицательная доходность = правильный сигнал)
        if risk_off_count > 0:
            risk_off_wins = (returns.loc[risk_off, col] < 0).sum()
            results[f'risk_off_winrate_{period}d'] = risk_off_wins / risk_off_count
            results[f'risk_off_avg_return_{period}d'] = returns.loc[risk_off, col].mean()
        else:
            results[f'risk_off_winrate_{period}d'] = 0
            results[f'risk_off_avg_return_{period}d'] = 0
    
    # Корреляция
    for period in [1, 7, 30]:
        col = f'return_{period}d'
        valid = returns[col].notna() & oe_btc.notna()
        if valid.sum() > 10:
            results[f'correlation_{period}d'] = oe_btc[valid].corr(returns.loc[valid, col])
        else:
            results[f'correlation_{period}d'] = 0
    
    return results

def print_results(results: dict, oe_btc: pd.Series):
    """
    Красивый вывод результатов
    """
    print("\n" + "="*60)
    print("🎯 BACKTEST RESULTS")
    print("="*60)
    
    print(f"\n📅 Total Days Analyzed: {len(oe_btc)}")
    print(f"📊 Average OE-BTC: {oe_btc.mean():.3f}")
    print(f"📈 OE-BTC Range: [{oe_btc.min():.3f}, {oe_btc.max():.3f}]")
    
    print(f"\n📊 Signal Distribution:")
    print(f"   🟢 Risk-On (>0.5):  {results['risk_on_count']} ({results['risk_on_count']/len(oe_btc)*100:.1f}%)")
    print(f"   🔴 Risk-Off (<-0.5): {results['risk_off_count']} ({results['risk_off_count']/len(oe_btc)*100:.1f}%)")
    print(f"   🟡 Neutral:          {results['neutral_count']} ({results['neutral_count']/len(oe_btc)*100:.1f}%)")
    
    print(f"\n📈 CORRELATIONS (OE-BTC vs Future BTC Returns):")
    print(f"   1-Day:  {results['correlation_1d']*100:.2f}%")
    print(f"   7-Day:  {results['correlation_7d']*100:.2f}%")
    print(f"   30-Day: {results['correlation_30d']*100:.2f}%")
    
    print(f"\n🟢 RISK-ON SIGNALS (OE-BTC > 0.5):")
    print(f"   Win Rate 1d:  {results['risk_on_winrate_1d']*100:.1f}%")
    print(f"   Win Rate 7d:  {results['risk_on_winrate_7d']*100:.1f}%")
    print(f"   Win Rate 30d: {results['risk_on_winrate_30d']*100:.1f}%")
    print(f"   Avg Return 1d:  {results['risk_on_avg_return_1d']:.2f}%")
    print(f"   Avg Return 7d:  {results['risk_on_avg_return_7d']:.2f}%")
    print(f"   Avg Return 30d: {results['risk_on_avg_return_30d']:.2f}%")
    
    print(f"\n🔴 RISK-OFF SIGNALS (OE-BTC < -0.5):")
    print(f"   Win Rate 1d:  {results['risk_off_winrate_1d']*100:.1f}%")
    print(f"   Win Rate 7d:  {results['risk_off_winrate_7d']*100:.1f}%")
    print(f"   Win Rate 30d: {results['risk_off_winrate_30d']*100:.1f}%")
    print(f"   Avg Return 1d:  {results['risk_off_avg_return_1d']:.2f}%")
    print(f"   Avg Return 7d:  {results['risk_off_avg_return_7d']:.2f}%")
    print(f"   Avg Return 30d: {results['risk_off_avg_return_30d']:.2f}%")
    
    print("\n" + "="*60)
    
    # Интерпретация
    if results['correlation_30d'] > 0.3:
        print("✅ Strong positive correlation! Formula is predictive.")
    elif results['correlation_30d'] > 0.1:
        print("⚠️ Weak correlation. Formula needs improvement.")
    else:
        print("❌ No correlation. Formula is not predictive.")
    
    if results['risk_on_winrate_30d'] > 0.6:
        print("✅ Risk-On signals have good win rate!")
    
    if results['risk_off_winrate_30d'] > 0.6:
        print("✅ Risk-Off signals correctly predict downside!")
    
    print()

def run_backtest(btc_df: pd.DataFrame, spy_df: pd.DataFrame, qqq_df: pd.DataFrame, eem_df: pd.DataFrame, gld_df: pd.DataFrame):
    """
    Главная функция backtesting (ORIGINAL FORMULA)
    """
    print("\n🔬 Running OE-BTC Backtest (ORIGINAL FORMULA)...\n")
    
    # 1. Выровнять данные
    df = align_data(btc_df, qqq_df, spy_df, eem_df, gld_df)
    print(f"📅 Date range: {df.index[0].date()} to {df.index[-1].date()}")
    print(f"📊 Total days: {len(df)}\n")
    
    # 2. Рассчитать компоненты
    print("📊 Calculating components...")
    
    # Macro Risk-On (SPY, QQQ, EEM, GLD)
    macro = calculate_macro_risk_on(df['spy_close'], df['qqq_close'], df['eem_close'], df['gld_close'], sma_period=200)
    print("  ✅ Macro Risk-On (SPY, QQQ, EEM, GLD↓ above SMA200)")
    
    # ETF Flows (REAL from Farside)
    etf = calculate_etf_flows_real(df.index)
    print("  ✅ ETF Flows (REAL from Farside or fallback)")
    
    # BTC Momentum
    btc_mom = calculate_btc_momentum(df['btc_close'], sma_period=15)
    print("  ✅ BTC Momentum (BTC > SMA15)")
    
    # 3. Рассчитать OE-BTC
    print("\n📊 Calculating OE-BTC (0.4×Macro + 0.35×ETF + 0.25×BTC)...")
    oe_btc = calculate_oe_btc(macro, etf, btc_mom)
    
    # Удалить NaN (первые 200 дней для SMA200)
    valid = oe_btc.notna()
    oe_btc = oe_btc[valid]
    df = df[valid]
    
    print(f"✅ OE-BTC calculated for {len(oe_btc)} days\n")
    
    # 4. Рассчитать будущую доходность BTC
    print("📈 Calculating forward returns...")
    returns = calculate_forward_returns(df['btc_close'])
    
    # 5. Анализ
    print("📊 Analyzing signals...\n")
    results = analyze_signals(oe_btc, returns)
    
    # 6. Вывод результатов
    print_results(results, oe_btc)
    
    # 7. Сохранить результаты в CSV
    output = pd.DataFrame({
        'date': df.index,
        'oe_btc': oe_btc,
        'btc_price': df['btc_close'],
        'return_1d': returns['return_1d'],
        'return_7d': returns['return_7d'],
        'return_30d': returns['return_30d'],
    })
    output.to_csv('backtest_results.csv', index=False)
    print("💾 Results saved to: backtest_results.csv\n")
    
    return results
