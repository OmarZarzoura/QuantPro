import { NEWS_FEED } from '../data/mockData';
import { Card, CardContent } from '../components/UI';
import { Newspaper, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../lib/utils';

export function NewsSentiment() {
  return (
    <div className="p-8 h-full overflow-y-auto w-full max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
          <Newspaper className="w-8 h-8 text-indigo-400" />
          Global Macro Sentiment
        </h1>
        <p className="text-slate-400">Aggregated NLP sentiment scoring from news APIs and social streams.</p>
      </header>

      <div className="grid gap-4">
        {NEWS_FEED.map((news) => {
          const isPositive = news.sentiment === 'positive';
          const isNegative = news.sentiment === 'negative';
          const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
          
          return (
            <Card key={news.id} className="hover:bg-slate-800/50 transition-colors cursor-pointer group">
              <CardContent className="p-0 flex flex-col sm:flex-row">
                {/* Visual Indicator */}
                <div className={cn(
                  "w-full sm:w-2 h-2 sm:h-auto",
                  isPositive ? "bg-emerald-500" : isNegative ? "bg-rose-500" : "bg-slate-500"
                )} />
                
                <div className="p-6 flex-1 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                  <div>
                    <div className="flex gap-3 items-center mb-2 text-xs font-mono uppercase tracking-widest text-slate-500">
                      <span>{news.time}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-600" />
                      <span className="text-indigo-400 font-medium">Tick: {news.asset}</span>
                    </div>
                    <h3 className="text-lg font-medium text-slate-200 group-hover:text-white transition-colors">
                      {news.title}
                    </h3>
                  </div>
                  
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider shrink-0",
                    isPositive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : 
                    isNegative ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : 
                    "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                  )}>
                    <Icon className="w-3 h-3" />
                    {news.sentiment}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
