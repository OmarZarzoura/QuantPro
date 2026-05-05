import { ASSETS } from '../data/mockData';
import { formatCurrency, formatPercentage } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../lib/utils';

export function Dashboard() {
  const assetsArray = Object.values(ASSETS);

  return (
    <div className="p-8 h-full overflow-y-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-light tracking-tight text-white mb-2">Market Overview</h1>
        <p className="text-slate-400">Track key assets and overall market momentum.</p>
      </header>

      {/* Grid of Key Assets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {assetsArray.map((asset) => {
          const TrendIcon = asset.trend === 'bullish' ? TrendingUp : asset.trend === 'bearish' ? TrendingDown : Minus;
          const trendColor = asset.trend === 'bullish' ? 'text-emerald-400' : asset.trend === 'bearish' ? 'text-rose-400' : 'text-slate-400';
          
          return (
            <Card key={asset.symbol} className="hover:bg-slate-800/50 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-mono font-medium text-slate-300">{asset.symbol}</div>
                    <div className="text-xs text-slate-500">{asset.name}</div>
                  </div>
                  <TrendIcon className={cn("w-4 h-4", trendColor)} />
                </div>
                <div className="mt-4">
                  <div className="text-xl font-light text-white">{formatCurrency(asset.price)}</div>
                  <div className={cn("text-xs mt-1 font-mono", trendColor)}>
                    {asset.change > 0 ? '+' : ''}{asset.change}%
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 shadow-2xl shadow-indigo-500/5">
          <CardHeader>
             <CardTitle>Market Performance (BTC/USD Benchmark)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[...ASSETS['BTC'].data].reverse()} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#475569" 
                    tick={{ fill: '#475569', fontSize: 12 }} 
                    tickFormatter={(val) => val.slice(5)} 
                    tickMargin={10} 
                    axisLine={false} 
                    tickLine={false} 
                    minTickGap={30} 
                  />
                  <YAxis 
                    domain={['dataMin - 1000', 'dataMax + 1000']} 
                    stroke="#475569" 
                    tick={{ fill: '#475569', fontSize: 12 }}
                    tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`}
                    axisLine={false}
                    tickLine={false}
                    width={50}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9', borderRadius: '8px' }}
                    itemStyle={{ color: '#818cf8' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="close" 
                    stroke="#818cf8" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Watchlist Summary */}
        <Card>
          <CardHeader>
             <CardTitle>Market Cap Distribution</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-6 mt-4">
                {assetsArray.map((asset) => (
                  <div key={asset.symbol} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-mono text-xs text-slate-300">
                        {asset.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-200">{asset.name}</div>
                        <div className="text-xs text-slate-500">{asset.type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="text-sm font-mono text-slate-300">{asset.marketCap}</div>
                    </div>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
