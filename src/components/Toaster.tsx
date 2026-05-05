import React, { useEffect, useState } from 'react';
import { alertStore, Alert } from '../lib/alertStore';
import { Terminal, X, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

interface ToastProps {
  key?: React.Key;
  alert: Alert;
  onDismiss: (id: string) => void;
}

function Toast({ alert, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(alert.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [alert.id, onDismiss]);

  const isBuyOrPos = alert.title.includes('BUY') || alert.title.includes('POSITIVE') || alert.title.includes('Positive');
  const isSellOrNeg = alert.title.includes('SELL') || alert.title.includes('NEGATIVE') || alert.title.includes('Negative');
  
  const Icon = alert.type === 'signal' ? (isBuyOrPos ? TrendingUp : TrendingDown) : alert.type === 'sentiment' ? AlertTriangle : Terminal;

  return (
    <div className="bg-slate-900 border border-slate-700 shadow-2xl rounded-lg p-4 w-96 text-sm animate-in slide-in-from-right-8 fade-in duration-300 flex gap-3 relative pointer-events-auto group">
      <div className={cn(
        "p-2 rounded-full shrink-0 h-fit",
        isBuyOrPos ? 'bg-emerald-500/10 text-emerald-400' :
        isSellOrNeg ? 'bg-rose-500/10 text-rose-400' :
        'bg-amber-500/10 text-amber-500'
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 pr-4 pt-1">
        <h4 className="font-semibold text-slate-200 mb-1 leading-none">{alert.title}</h4>
        <p className="text-slate-400 leading-relaxed text-xs">{alert.message}</p>
      </div>
      <button 
        onClick={() => onDismiss(alert.id)} 
        className="absolute top-2 right-2 text-slate-500 hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function Toaster() {
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const unsubscribe = alertStore.onNewAlert((alert) => {
      setActiveAlerts(prev => [alert, ...prev].slice(0, 3)); // show max 3 active
    });
    return unsubscribe;
  }, []);

  const handleDismiss = (id: string) => {
    setActiveAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {activeAlerts.map(alert => (
        <Toast key={alert.id} alert={alert} onDismiss={handleDismiss} />
      ))}
    </div>
  );
}
