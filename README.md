# CryptoTracker

A React single-page app for tracking the top 100 cryptocurrencies in real time —
live prices, 24h change, and interactive price-history charts, powered by the
free [CoinGecko API](https://www.coingecko.com/en/api).

![React](https://img.shields.io/badge/React-18-149eca)

## Features

- **Live market data** — top 100 coins by market cap, auto-refreshing every 60s
- **Search** coins by name or symbol
- **Interactive charts** — 7 / 30 / 90-day price history (Chart.js)
- **Portfolio tracker** — add holdings and see total value, weighted 24h change,
  cost basis, and profit/loss ($ and %) with an allocation doughnut chart. Uses a
  weighted-average cost basis when you add to a coin you already hold, persists
  per-user in `localStorage`, and reuses the fetched market data (no extra API calls)
- **Auth flow** — demo login/signup with client-side persistence
- **Responsive dark UI**

> ⚠️ The auth is a **client-side demo only** (credentials live in `localStorage`
> in plain text). Do not use it to protect real accounts.

## Getting started

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

**Demo login:** `user@example.com` / `password123`

## Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm start`     | Run the dev server                   |
| `npm test`      | Run tests in watch mode              |
| `npm run build` | Production build into `build/`       |

## Project structure

```
src/
├── api/cryptoApi.js          # CoinGecko data + history fetchers
├── components/
│   ├── CryptoList.js         # searchable coin list
│   ├── CryptoChart.js        # price-history chart with range toggle
│   ├── Portfolio.js          # holdings, P/L metrics, allocation chart
│   ├── portfolioService.js   # per-user portfolio persistence (localStorage)
│   ├── Login.js / signup.js  # auth screens
│   └── authservice.js        # demo auth (localStorage)
└── App.js                    # routing, data fetching, refresh
```

## Notes

- Built with [Create React App](https://github.com/facebook/create-react-app).
- CoinGecko's free tier is rate-limited; the app refreshes at a conservative
  interval and surfaces a clear message if you hit the limit.

## Screenshots

![CryptoTracker screenshot](https://github.com/user-attachments/assets/aa34f307-d521-404d-a2c9-ca3e75da7600)
![CryptoTracker screenshot](https://github.com/user-attachments/assets/b1da9318-09f2-4b2e-8c62-ed1fe4471e18)
![CryptoTracker screenshot](https://github.com/user-attachments/assets/dbd4fb48-c802-4bd7-a090-873a2278ce06)
![CryptoTracker screenshot](https://github.com/user-attachments/assets/96d1d7bc-03b2-45ba-9c99-e2d722872531)
