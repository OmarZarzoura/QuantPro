import { useState, useEffect } from 'react';
import { ASSETS } from '../data/mockData';
import { formatCurrency } from '../lib/utils';
import { generatePrediction } from '../lib/gemini';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI';
import { BrainCircuit, Loader2, Target, AlertTriangle, AlertOctagon, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { cn } from '../lib/utils';

export function PredictionEngine() {
  const [selectedAsset, setSelectedAsset] = useState<string>('BTC');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const asset = ASSETS[selectedAsset];

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setPrediction(null);
    setError(null);
    try {
      const result = await generatePrediction(selectedAsset, asset);
      setPrediction(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate prediction. Re-run or try another asset.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Pre-run analysis on mount or asset change if cached, else we wait for user.
  useEffect(() => {
    setPrediction(null);
    setError(null);
  }, [selectedAsset]);

  return (
    <div className="p-8 h-full flex flex-col">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-indigo-400" />
            Prediction Engine
          </h1>
          <p className="text-slate-400">Deep Learning Pattern Recognition & NLP Sentiment Analysis</p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-slate-500 uppercase">Select Target</span>
          <select 
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none font-mono"
            disabled={isAnalyzing}
          >
            {Object.keys(ASSETS).map((key) => (
              <option key={key} value={key}>{key} - {ASSETS[key].name}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Chart & Control */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="flex-1 flex flex-col min-h-0">
            <CardHeader className="flex flex-row justify-between items-center py-4">
              <CardTitle className="font-mono">{selectedAsset} Historical Price</CardTitle>
              <div className="text-2xl font-light text-white">{formatCurrency(asset.price)}</div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-0 relative">
               <div className="absolute inset-0 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[...asset.data].reverse()} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPriceEngine" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="date" hide />
                      <YAxis 
                        domain={['dataMin', 'dataMax']} 
                        hide
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
                        itemStyle={{ color: '#10b981' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="close" 
                        stroke="#10b981" 
                        strokeWidth={2} 
                        fillOpacity={1} 
                        fill="url(#colorPriceEngine)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </CardContent>
          </Card>

          {/* Action Area */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 flex items-center justify-between">
             <div>
               <h3 className="text-lg font-medium text-slate-200">Run Inference Pipeline</h3>
               <p className="text-sm text-slate-500 mt-1 max-w-md">Analyzes last 90 days of price action, volume anomalies, and integrates decoupled NLP macro sentiment scoring.</p>
             </div>
             <button
               onClick={handleRunAnalysis}
               disabled={isAnalyzing}
               className={cn(
                 "flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all shadow-lg text-sm",
                 isAnalyzing 
                   ? "bg-slate-800 text-slate-400 cursor-not-allowed" 
                   : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20"
               )}
             >
               {isAnalyzing ? (
                 <>
                   <Loader2 className="w-5 h-5 animate-spin" />
                   Processing Variables...
                 </>
               ) : (
                 <>
                   Execute Analysis
                   <ArrowRight className="w-5 h-5" />
                 </>
               )}
             </button>
          </div>
        </div>

        {/* Right Column: AI Output */}
        <div className="lg:col-span-1 h-full flex flex-col">
          <Card className="flex-1 flex flex-col shadow-2xl relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950">
             
             {isAnalyzing && (
               <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8 text-center">
                 <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-6" />
                 <div className="font-mono text-sm text-indigo-400 mb-2">LOADING NEURAL NET...</div>
                 <div className="text-xs text-slate-500 animate-pulse">Running Transformer sequence 4/7...</div>
               </div>
             )}

             <CardHeader className="border-b border-white/5 bg-white/5">
                <CardTitle className="flex justify-between items-center">
                  <span>AI Diagnostics</span>
                  {prediction && (
                    <span className="text-xs font-mono text-slate-500">
                      CONF: <span className="text-white">{prediction.confidenceScore}%</span>
                    </span>
                  )}
                </CardTitle>
             </CardHeader>
             
             <CardContent className="flex-1 overflow-y-auto p-6">
                {!prediction && !error && !isAnalyzing && (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 opacity-60">
                    <BrainCircuit className="w-16 h-16 mb-4 stroke-1" />
                    <p className="text-sm">Awaiting execution command to process dataset against QuantPro weights.</p>
                  </div>
                )}

                {error && !isAnalyzing && (
                  <div className="h-full flex flex-col items-center justify-center text-center text-rose-500/80">
                    <AlertOctagon className="w-12 h-12 mb-4 stroke-1" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {prediction && !isAnalyzing && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    <div className="text-center">
                      <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">Primary Signal</div>
                      <div className={cn(
                        "text-5xl font-black font-display tracking-tight",
                        prediction.recommendation === 'BUY' ? 'text-emerald-500' :
                        prediction.recommendation === 'SELL' ? 'text-rose-500' : 'text-amber-500'
                      )}>
                         {prediction.recommendation}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                         <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                           <Target className="w-3 h-3" /> Target Price
                         </div>
                         <div className="text-xl font-mono text-slate-200">{formatCurrency(prediction.targetPrice)}</div>
                       </div>
                       <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                         <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                           <AlertTriangle className="w-3 h-3" /> Stop Loss
                         </div>
                         <div className="text-xl font-mono text-slate-200">{formatCurrency(prediction.stopLoss)}</div>
                       </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Reasoning Engine</h4>
                        <div className={cn(
                          "px-2 py-1 rounded text-xs font-mono font-medium",
                          prediction.riskLevel === 'Low' ? 'bg-emerald-500/10 text-emerald-400' :
                          prediction.riskLevel === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-rose-500/10 text-rose-400'
                        )}>
                          Risk: {prediction.riskLevel}
                        </div>
                      </div>
                      <ul className="space-y-3">
                        {prediction.reasoning.map((reason: string, i: number) => (
                          <li key={i} className="flex gap-3 text-sm text-slate-400 leading-relaxed">
                            <span className="text-indigo-500 font-mono mt-0.5">{(i + 1).toString().padStart(2, '0')}</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                )}
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
