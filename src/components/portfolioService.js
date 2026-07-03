// Per-user portfolio persistence in localStorage.
// A holding is { coinId, amount, buyPrice } where buyPrice (cost basis per unit)
// is optional — when present it enables profit/loss tracking.

const keyFor = (email) => `crypto-tracker:portfolio:${(email || 'guest').toLowerCase()}`;

const load = (email) => {
  const raw = localStorage.getItem(keyFor(email));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const save = (email, holdings) =>
  localStorage.setItem(keyFor(email), JSON.stringify(holdings));

const portfolioService = {
  getHoldings: load,

  // Add a new holding, or merge into an existing one for the same coin
  // (weighted-average the cost basis so P/L stays correct).
  addHolding: (email, { coinId, amount, buyPrice }) => {
    const holdings = load(email);
    const existing = holdings.find((h) => h.coinId === coinId);

    if (existing) {
      const prevAmount = existing.amount;
      const newAmount = prevAmount + amount;
      // Blend cost basis only when both sides have one.
      if (existing.buyPrice != null && buyPrice != null) {
        existing.buyPrice =
          (existing.buyPrice * prevAmount + buyPrice * amount) / newAmount;
      } else if (buyPrice != null) {
        existing.buyPrice = buyPrice;
      }
      existing.amount = newAmount;
    } else {
      holdings.push({ coinId, amount, buyPrice: buyPrice ?? null });
    }

    save(email, holdings);
    return holdings;
  },

  removeHolding: (email, coinId) => {
    const holdings = load(email).filter((h) => h.coinId !== coinId);
    save(email, holdings);
    return holdings;
  },

  clear: (email) => {
    save(email, []);
    return [];
  },
};

export default portfolioService;
