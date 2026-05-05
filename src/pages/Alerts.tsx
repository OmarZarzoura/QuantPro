import { useState, useEffect } from 'react';
import { alertStore, Alert, AlertPreferences } from '../lib/alertStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/UI';
import { Bell, Mail, Smartphone, Trash2, Power, TrendingUp, TrendingDown, AlertTriangle, Terminal, Settings2 } from 'lucide-react';
import { cn } from '../lib/utils';

export function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [prefs, setPrefs] = useState<AlertPreferences>(alertStore.preferences);

  useEffect(() => {
    const unsubAlerts = alertStore.subscribe(setAlerts);
    const unsubPrefs = alertStore.subscribePrefs(setPrefs);
    return () => {
      unsubAlerts();
      unsubPrefs();
    };
  }, []);

  const togglePref = (key: keyof AlertPreferences) => {
    alertStore.updatePrefs({ [key]: !prefs[key] });
  };

  const updateField = (key: keyof AlertPreferences, value: string) => {
    alertStore.updatePrefs({ [key]: value });
  };

  const handleClear = () => {
    alertStore.clearAlerts();
  };

  return (
    <div className="p-8 h-full overflow-y-auto w-full max-w-7xl mx-auto flex flex-col xl:flex-row gap-8">
      
      {/* Left Column: Notification History */}
      <div className="flex-1 flex flex-col min-h-0">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
              <Bell className="w-8 h-8 text-indigo-400" />
              Alert History
            </h1>
            <p className="text-slate-400">Recent signals and sentiment shift tracking.</p>
          </div>
          {alerts.length > 0 && (
            <button 
              onClick={handleClear}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          {alerts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 opacity-60 bg-slate-900/20 border border-slate-800/50 rounded-xl border-dashed">
              <Bell className="w-12 h-12 mb-4" />
              <p>No alerts recorded yet. History will appear here.</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const isBuyOrPos = alert.title.includes('BUY') || alert.title.includes('POSITIVE') || alert.title.includes('Positive');
              const isSellOrNeg = alert.title.includes('SELL') || alert.title.includes('NEGATIVE');
              const Icon = alert.type === 'signal' ? (isBuyOrPos ? TrendingUp : TrendingDown) : alert.type === 'sentiment' ? AlertTriangle : Terminal;

              return (
                <div key={alert.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-start gap-4 hover:border-slate-700 transition-colors">
                   <div className={cn(
                    "p-2.5 rounded-full shrink-0",
                    isBuyOrPos ? 'bg-emerald-500/10 text-emerald-400' :
                    isSellOrNeg ? 'bg-rose-500/10 text-rose-400' :
                    'bg-amber-500/10 text-amber-500'
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h4 className="font-medium text-slate-200">{alert.title}</h4>
                      <span className="text-xs font-mono text-slate-500">
                        {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{alert.message}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Settings */}
      <div className="w-full xl:w-96 shrink-0 flex flex-col gap-6">
        <Card className="border-indigo-500/20 shadow-xl shadow-indigo-500/5">
          <CardHeader className="bg-indigo-500/5 border-b border-indigo-500/10 py-5">
            <CardTitle className="flex items-center gap-2 text-indigo-400">
              <Settings2 className="w-5 h-5" />
              Alert Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             
             {/* Master Engine Switch */}
             <div className="p-5 border-b border-slate-800 flex items-center justify-between">
               <div>
                  <div className="font-medium text-slate-200">Alert Engine</div>
                  <div className="text-xs text-slate-500 mt-1">Master switch for real-time monitoring</div>
               </div>
               <button 
                 onClick={() => togglePref('enabled')}
                 className={cn(
                   "w-12 h-6 rounded-full transition-colors relative", 
                   prefs.enabled ? "bg-emerald-500/80" : "bg-slate-700"
                 )}
               >
                 <div className={cn(
                   "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform",
                   prefs.enabled ? "translate-x-6" : "translate-x-0"
                 )} />
               </button>
             </div>

             <div className={cn("transition-opacity", !prefs.enabled && "opacity-40 pointer-events-none")}>
               {/* Internal Modules */}
               <div className="p-5 border-b border-slate-800 space-y-4">
                 <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Triggers</h4>
                 
                 <label className="flex items-center justify-between cursor-pointer group">
                   <div className="flex items-center gap-3">
                     <TrendingUp className="w-4 h-4 text-emerald-400" />
                     <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Strong Buy/Sell Signals</span>
                   </div>
                   <input 
                     type="checkbox" 
                     className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500" 
                     checked={prefs.signalAlerts} 
                     onChange={() => togglePref('signalAlerts')}
                   />
                 </label>
                 
                 <label className="flex items-center justify-between cursor-pointer group">
                   <div className="flex items-center gap-3">
                     <AlertTriangle className="w-4 h-4 text-amber-400" />
                     <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Macro Sentiment Shifts</span>
                   </div>
                   <input 
                     type="checkbox" 
                     className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500" 
                     checked={prefs.sentimentAlerts} 
                     onChange={() => togglePref('sentimentAlerts')}
                   />
                 </label>
               </div>

               {/* External Channels */}
               <div className="p-5 space-y-5">
                 <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Delivery Channels</h4>
                 
                 <div className="space-y-3">
                   <label className="flex items-center justify-between cursor-pointer group">
                     <div className="flex items-center gap-3">
                       <Power className="w-4 h-4 text-indigo-400" />
                       <div>
                         <span className="text-sm text-slate-300 group-hover:text-white transition-colors block">Browser Push Notifications</span>
                         <span className="text-xs text-slate-500">Native OS alerts</span>
                       </div>
                     </div>
                     <input 
                       type="checkbox" 
                       className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500" 
                       checked={prefs.pushEnabled} 
                       onChange={() => togglePref('pushEnabled')}
                     />
                   </label>
                 </div>

                 <div className="space-y-3">
                   <label className="flex items-center justify-between cursor-pointer group">
                     <div className="flex items-center gap-3">
                       <Mail className="w-4 h-4 text-indigo-400" />
                       <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Email Delivery</span>
                     </div>
                     <input 
                       type="checkbox" 
                       className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500" 
                       checked={prefs.emailEnabled} 
                       onChange={() => togglePref('emailEnabled')}
                     />
                   </label>
                   {prefs.emailEnabled && (
                     <input 
                       type="email" 
                       value={prefs.emailAddress}
                       onChange={(e) => updateField('emailAddress', e.target.value)}
                       placeholder="investor@example.com"
                       className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-sm text-slate-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ml-7 w-[calc(100%-28px)]"
                     />
                   )}
                 </div>

                 <div className="space-y-3">
                   <label className="flex items-center justify-between cursor-pointer group">
                     <div className="flex items-center gap-3">
                       <Smartphone className="w-4 h-4 text-indigo-400" />
                       <span className="text-sm text-slate-300 group-hover:text-white transition-colors">SMS Alerts</span>
                     </div>
                     <input 
                       type="checkbox" 
                       className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500" 
                       checked={prefs.smsEnabled} 
                       onChange={() => togglePref('smsEnabled')}
                     />
                   </label>
                   {prefs.smsEnabled && (
                     <input 
                       type="tel" 
                       value={prefs.phoneNumber}
                       onChange={(e) => updateField('phoneNumber', e.target.value)}
                       placeholder="+1 555-0198"
                       className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-sm text-slate-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ml-7 w-[calc(100%-28px)]"
                     />
                   )}
                 </div>

               </div>
             </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
