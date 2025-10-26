# borkiss.trade# Welcome to your Lovable project



Market analytics and dashboard tools.## Project info



## Tech Stack**URL**: https://lovable.dev/projects/f3fc6053-e1fb-4358-a1f8-bbac87153c3a



- **Vite** - Build tool## How can I edit this code?

- **React 18** - UI framework

- **TypeScript** - Type safetyThere are several ways of editing your application.

- **Tailwind CSS** - Styling

- **shadcn/ui** - Component library**Use Lovable**

- **React Router** - Client-side routing

- **lightweight-charts** - Charting librarySimply visit the [Lovable Project](https://lovable.dev/projects/f3fc6053-e1fb-4358-a1f8-bbac87153c3a) and start prompting.

- **Vercel Analytics** - Web analytics

Changes made via Lovable will be committed automatically to this repo.

## Getting Started

**Use your preferred IDE**

### Prerequisites

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

- Node.js 18+ ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

- npm or bunThe only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)



### InstallationFollow these steps:



```bash```sh

# Clone the repository# Step 1: Clone the repository using the project's Git URL.

git clone https://github.com/lubluniky/borkiss.site.gitgit clone <YOUR_GIT_URL>

cd borkiss.site

# Step 2: Navigate to the project directory.

# Install dependenciescd <YOUR_PROJECT_NAME>

npm install

# Step 3: Install the necessary dependencies.

# Start development servernpm i

npm run dev

```# Step 4: Start the development server with auto-reloading and an instant preview.

npm run dev

The app will be available at `http://localhost:8080````



### Build for Production**Edit a file directly in GitHub**



```bash- Navigate to the desired file(s).

npm run build- Click the "Edit" button (pencil icon) at the top right of the file view.

```- Make your changes and commit the changes.



Output will be in the `dist/` directory.**Use GitHub Codespaces**



## Project Structure- Navigate to the main page of your repository.

- Click on the "Code" button (green button) near the top right.

```- Select the "Codespaces" tab.

src/- Click on "New codespace" to launch a new Codespace environment.

├── components/       # Reusable UI components- Edit files directly within the Codespace and commit and push your changes once you're done.

│   ├── ohlc/        # Chart components

│   └── ui/          # shadcn/ui components## What technologies are used for this project?

├── hooks/           # Custom React hooks

├── lib/             # Utility functions and API clientsThis project is built with:

├── pages/           # Route pages

│   ├── Index.tsx           # Home page- Vite

│   ├── MtmDashboard.tsx    # Market Tension Map- TypeScript

│   └── NotFound.tsx        # 404 page- React

└── App.tsx          # Root component with routing- shadcn-ui

```- Tailwind CSS



## MTM Dashboard## How can I deploy this project?



The Market Tension Map (MTM) Dashboard displays real-time OHLC candlestick charts with tension histograms for crypto markets.Simply open [Lovable](https://lovable.dev/projects/f3fc6053-e1fb-4358-a1f8-bbac87153c3a) and click on Share -> Publish.



### Features## Can I connect a custom domain to my Lovable project?



- **Multi-Timeframe Analysis**: M15, 1H, 4H chartsYes, you can!

- **Auto-Refresh**: Updates every 15 seconds with rate limiting

- **Tension Indicators**: Volatility + volume scores (0-100)To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

- **Binance Integration**: Spot and Futures data

- **Synchronized Charts**: Histogram aligned with candlesticksRead more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)



### Data Source---



Fetches from Binance public REST API:## MTM Dashboard (Market Tension Map)

- Spot: `https://api.binance.com/api/v3/klines`

- Futures: `https://fapi.binance.com/fapi/v1/klines`### Overview



### Tension CalculationThe MTM Dashboard is a real-time market analysis tool that displays OHLC candlestick charts alongside "Tension Map" histograms for multiple timeframes. It helps identify potential market compression zones by analyzing volatility and volume patterns.



Tension Index = (Volatility Score + Volume Score) / 2### Features



- **Volatility Score**: Normalized rolling std dev (inverted)- **Three Timeframes**: M15 (4 days), 1H (10 days), 4H (40 days)

- **Volume Score**: Normalized volume against rolling window- **Real-time Data**: Auto-refreshes every 15 seconds with intelligent rate limiting

- Bars above threshold highlighted in green- **Tension Indicators**: Combined volatility and volume score normalized to 0-100

- **Interactive Charts**: Lightweight candlestick charts with synchronized tension histograms

### Configuration- **Symbol Selection**: Switch between BTCUSDT and ETHUSDT

- **Data Source Toggle**: Choose between Binance Spot or Futures API

Adjust settings in `src/pages/MtmDashboard.tsx`:

### Installation

```typescript

const TIMEFRAMES = [The dashboard uses the `lightweight-charts` library for charting. To install dependencies:

  { interval: '15m', lookbackDays: 4 },

  { interval: '1h', lookbackDays: 10 },```bash

  { interval: '4h', lookbackDays: 40 },npm install

];```

```

All required dependencies are already listed in `package.json`.

Periods and thresholds in `src/lib/tension.ts`:

### Running Locally

```typescript

getRecommendedPeriod(interval);  // Rolling window sizeStart the development server:

getRecommendedThreshold(interval); // Tension threshold

``````bash

npm run dev

## Deployment```



The site is deployed on Vercel at [borkiss.trade](https://borkiss.trade).Then navigate to: `http://localhost:8080/dashboard/mtm`



Auto-deploys on push to `main` branch.### Data Source



## LicenseThe dashboard fetches data from Binance's public REST API:

- **Spot**: `https://api.binance.com/api/v3/klines`

Private project - All rights reserved.- **Futures**: `https://fapi.binance.com/fapi/v1/klines`


No authentication is required for public market data.

### Rate Limiting & Resilience

To avoid hammering the Binance API, the dashboard implements:

1. **15-second refresh interval** per panel (configurable)
2. **In-memory caching** keyed by symbol, interval, and lookback
3. **Exponential backoff** on 429/5xx errors (500ms, 1s, 2s, up to 4 retries)
4. **Jitter** to desynchronize requests across panels
5. **AbortController** for canceling stale requests

If a refresh occurs before 15 seconds have elapsed, cached data is returned immediately.

### Tension Map Calculation

The tension index combines two normalized scores (0-100):

1. **Volatility Score** (inverted):
   - Calculate rolling standard deviation of close prices
   - Normalize to relative volatility (std / price)
   - Lower volatility → higher score

2. **Volume Score**:
   - Normalize volume against rolling min/max
   - Higher volume → higher score

3. **Tension Index** = (Volatility Score + Volume Score) / 2

Bars exceeding the threshold are highlighted in green, indicating potential compression zones.

### Configuration

#### Timeframe Settings

You can adjust lookback periods and thresholds in `/src/pages/MtmDashboard.tsx`:

```typescript
const TIMEFRAMES = [
  {
    id: 'm15',
    label: 'M15',
    interval: '15m',
    lookbackDays: 4,      // Change this
    description: 'Last 4 Days',
  },
  // ...
];
```

#### Calculation Periods & Thresholds

Default values are defined in `/src/lib/tension.ts`:

```typescript
export function getRecommendedPeriod(interval: string): number {
  const periodMap: Record<string, number> = {
    '15m': 55,  // Rolling window for M15
    '1h': 40,   // Rolling window for 1H
    '4h': 35,   // Rolling window for 4H
  };
  return periodMap[interval] || 40;
}

export function getRecommendedThreshold(interval: string): number {
  const thresholdMap: Record<string, number> = {
    '15m': 74,  // Tension threshold for M15
    '1h': 75,   // Tension threshold for 1H
    '4h': 80,   // Tension threshold for 4H
  };
  return thresholdMap[interval] || 75;
}
```

#### Refresh Interval

To change the refresh cadence, modify the `minRefreshMs` parameter in `/src/pages/MtmDashboard.tsx`:

```typescript
const { klines, tensionData, ... } = useKlines({
  // ...
  minRefreshMs: 15000,  // Change to 30000 for 30 seconds, etc.
});
```

### Styling

The dashboard uses your existing Tailwind theme with:
- Dark background (`bg-background`)
- Subtle borders (`border-border`)
- Monospace fonts for numeric data
- Card components from shadcn/ui
- No glassmorphism or neon effects

Charts use a transparent background to blend with the dark theme.

### Architecture

```
src/
├── pages/
│   └── MtmDashboard.tsx       # Main dashboard page
├── components/
│   └── ohlc/
│       ├── OhlcChart.tsx      # Candlestick chart wrapper
│       └── TensionHistogram.tsx # Canvas-based histogram
├── hooks/
│   └── useKlines.ts           # Data fetching hook with caching
└── lib/
    ├── binance.ts             # API client with retry logic
    └── tension.ts             # Tension calculation utilities
```

### Limitations

- **Client-side only**: No server or cron jobs required
- **No Open Interest**: OI data is not included in this version
- **Public API only**: Uses Binance's public endpoints (no auth)
- **No persistence**: Data is cached in-memory only

### Troubleshooting

**Charts not loading?**
- Check browser console for API errors
- Verify Binance API is accessible (not blocked by firewall/VPN)
- Ensure you're not hitting rate limits (dashboard handles this automatically)

**Tension data missing?**
- Tension calculations require a minimum number of candles (equal to the period)
- Check that klines are being fetched successfully

**TypeScript errors?**
- Run `npm install` to ensure all dependencies are installed
- Check that lightweight-charts is properly installed

### Future Enhancements

Potential additions (not implemented):
- Open Interest integration
- Backtesting interface
- Export to CSV
- Custom alerts when tension exceeds threshold
- Multiple symbol comparison
- WebSocket for real-time updates
````# trigger deploy Sat Oct 25 03:07:25 CEST 2025
