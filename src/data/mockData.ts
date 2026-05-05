export interface AssetData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface AssetInfo {
  symbol: string;
  name: string;
  type: 'stock' | 'crypto';
  price: number;
  change: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  data: AssetData[];
  description: string;
  marketCap: string;
}

function generateCandles(startPrice: number, days: number, volatility: number, seedString: string): AssetData[] {
  let currentPrice = startPrice;
  const data: AssetData[] = [];
  const now = new Date();
  
  // Seed hash
  let seed = 0;
  for (let i = 0; i < seedString.length; i++) {
    seed += seedString.charCodeAt(i);
  }

  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    
    const r1 = Math.sin(seed++) * 10000;
    const rand1 = r1 - Math.floor(r1);
    
    const r2 = Math.sin(seed++) * 10000;
    const rand2 = r2 - Math.floor(r2);
    
    // Simulate daily movement
    const changePercent = (rand1 - 0.48) * volatility; 
    const close = currentPrice * (1 + changePercent);
    
    // Wicks
    const high = Math.max(currentPrice, close) * (1 + rand2 * volatility * 0.5);
    const low = Math.min(currentPrice, close) * (1 - rand2 * volatility * 0.5);
    
    const volume = Math.floor(1000000 + (rand1 * 5000000));

    data.push({
      date: d.toISOString().split('T')[0],
      open: currentPrice,
      high,
      low,
      close,
      volume
    });
    
    currentPrice = close;
  }
  return data;
}

export const ASSETS: Record<string, AssetInfo> = {
  'BTC': {
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'crypto',
    price: 88450.20,
    change: 4.2,
    trend: 'bullish',
    data: generateCandles(65000, 90, 0.04, 'bitcoin2024'),
    description: 'The first decentralized cryptocurrency.',
    marketCap: '$1.75T'
  },
  'ETH': {
    symbol: 'ETH',
    name: 'Ethereum',
    type: 'crypto',
    price: 3450.80,
    change: 1.5,
    trend: 'bullish',
    data: generateCandles(2800, 90, 0.05, 'ethereumeth2'),
    description: 'Smart contract platform with decentralized applications.',
    marketCap: '$415B'
  },
  'AAPL': {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stock',
    price: 189.50,
    change: -0.8,
    trend: 'neutral',
    data: generateCandles(175, 90, 0.02, 'appblstocks'),
    description: 'Technology company focusing on consumer electronics, software, and services.',
    marketCap: '$2.9T'
  },
  'NVDA': {
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    type: 'stock',
    price: 850.30,
    change: 8.4,
    trend: 'bullish',
    data: generateCandles(450, 90, 0.06, 'aiisboomingss'),
    description: 'Leader in GPU computing globally, heavily invested in AI chips.',
    marketCap: '$2.1T'
  },
  'TSLA': {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    type: 'stock',
    price: 185.20,
    change: -2.1,
    trend: 'bearish',
    data: generateCandles(240, 90, 0.05, 'tesladownward'),
    description: 'Electric vehicle and clean energy company.',
    marketCap: '$588B'
  }
};

export const NEWS_FEED = [
  { id: 1, title: 'Fed Signals Potential Rate Cut in Q3', sentiment: 'positive', time: '2 hours ago', asset: 'Macro' },
  { id: 2, title: 'NVIDIA Surpasses Earnings Expectations by 20%', sentiment: 'positive', time: '4 hours ago', asset: 'NVDA' },
  { id: 3, title: 'SEC Delays Decision on Ethereum ETF', sentiment: 'negative', time: '5 hours ago', asset: 'ETH' },
  { id: 4, title: 'Bitcoin Whales Accumulate $2B Over Weekend', sentiment: 'positive', time: '8 hours ago', asset: 'BTC' },
  { id: 5, title: 'Apple Smartphone Sales Sluggish in Asia', sentiment: 'negative', time: '12 hours ago', asset: 'AAPL' },
];
