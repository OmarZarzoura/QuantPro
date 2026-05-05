import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { PredictionEngine } from './pages/PredictionEngine';
import { NewsSentiment } from './pages/NewsSentiment';
import { Architecture } from './pages/Architecture';
import { Alerts } from './pages/Alerts';
import { Toaster } from './components/Toaster';
import { alertStore } from './lib/alertStore';

// Mock signals simulating an incoming WebSockets stream or polling service
const MOCK_EVENTS = [
  { title: 'STRONG BUY: SOL', message: 'Confidence 92%. Momentum breakout detected over 4H time horizon with rising volume.', type: 'signal' as const },
  { title: 'SENTIMENT SHIFT: ETH', message: 'Macro sentiment turned NEGATIVE. Upcoming regulatory pressure expected.', type: 'sentiment' as const },
  { title: 'STRONG SELL: TSLA', message: 'Confidence 85%. Critical support level breached at 180.00.', type: 'signal' as const },
  { title: 'VOLATILITY WARNING', message: 'BTC volume spiked 400% in the last 15 minutes. Prepare for sudden movements.', type: 'system' as const },
  { title: 'STRONG BUY: NVDA', message: 'Confidence 96%. Structural accumulation entering final phase.', type: 'signal' as const },
  { title: 'POSITIVE TREND: AAPL', message: 'Corporate earnings leaked positive margins. Supply chain recovered.', type: 'sentiment' as const },
];

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  // Background Alert Engine simulation
  useEffect(() => {
    // Fire an initial alert to guide user attention
    setTimeout(() => {
      alertStore.addAlert(MOCK_EVENTS[0]);
    }, 3000);

    const interval = setInterval(() => {
      // Randomly pick an event from the stream
      const event = MOCK_EVENTS[Math.floor(Math.random() * MOCK_EVENTS.length)];
      alertStore.addAlert(event);
    }, Math.random() * 20000 + 25000); // Fire random events every 25-45 seconds
    
    return () => clearInterval(interval);
  }, []);

  let Content = Dashboard;
  if (currentView === 'predictions') Content = PredictionEngine;
  if (currentView === 'news') Content = NewsSentiment;
  if (currentView === 'alerts') Content = Alerts;
  if (currentView === 'architecture') Content = Architecture;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-200">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 h-full overflow-hidden relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="relative h-full z-10 w-full">
           <Content />
        </div>
      </main>
      <Toaster />
    </div>
  );
}
