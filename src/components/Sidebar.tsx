import { Home, Activity, BrainCircuit, Network, Bell, Settings, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Market Overview', icon: Home },
    { id: 'predictions', label: 'Prediction Engine', icon: BrainCircuit },
    { id: 'news', label: 'Sentiment Analysis', icon: Activity },
    { id: 'alerts', label: 'Alerts & Signals', icon: Bell },
    { id: 'architecture', label: 'System Architecture', icon: Network },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-indigo-400 font-mono font-bold text-xl tracking-tight">
          <BrainCircuit className="w-6 h-6" />
          <span>QuantPro</span>
        </div>
      </div>
      
      <div className="flex-1 py-6 px-3 flex flex-col gap-1">
        <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Main Menu
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-400" 
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:bg-slate-900 cursor-pointer transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </div>
        <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:bg-slate-900 cursor-pointer transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
        </div>
      </div>
    </aside>
  );
}
