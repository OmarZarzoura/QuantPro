export function Architecture() {
  return (
    <div className="p-8 h-full overflow-y-auto w-full max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-light tracking-tight text-white mb-2">System Architecture</h1>
        <p className="text-slate-400">High-level design of the QuantPro Financial Predictor.</p>
      </header>

      <div className="prose prose-invert prose-slate max-w-none">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h3 className="text-indigo-400 font-mono mt-0 mb-4 flex items-center gap-2">
              <span>01.</span> Frontend Layer
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-0">
              The presentation layer uses <strong>React</strong> in a Single Page Application architecture. 
              Vite is utilized for ultra-fast HMR and building. The UI leverages <strong>Tailwind CSS</strong> for a utilitarian, dark-mode financial feel, and <strong>Recharts</strong> for rendering lightweight yet interactive canvas/SVG charts based on historical data. 
              API calls are handled asynchronously with optimistic UI updates.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h3 className="text-indigo-400 font-mono mt-0 mb-4 flex items-center gap-2">
              <span>02.</span> AI Prediction Engine Layer
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-0">
              Predictions are powered by <strong>Google Gemini (gemini-3.1-pro-preview)</strong>. 
              The application translates numerical OHLC (Open, High, Low, Close) price actions, moving averages, and mock news sentiment into an engineered system prompt. 
              The model acts as a reasoning engine, returning a strictly parsed <strong>JSON Schema</strong> encompassing Buy/Sell triggers, confidence scores, and calculated risk tolerances.
            </p>
          </div>
        </div>

        <h2 className="border-b border-slate-800 pb-4 mb-6">Backend & Data Pipeline (Hypothetical Architecture)</h2>
        <p className="text-slate-400 leading-relaxed mb-8">
          While this prototype runs entirely client-side using advanced LLM reasoning, a full production deployment of this system incorporates dedicated microservices for data ingestion and high-frequency model inference.
        </p>

        <div className="bg-[#0b1120] border border-slate-800 rounded-xl p-8 mb-8 font-mono text-sm overflow-x-auto text-emerald-400/80 shadow-2xl">
          <pre className="!bg-transparent !p-0 !m-0">
{`[ Data Sources ]       [ Data Lake / DB ]       [ Inference Services ]       [ Client App ]

Yahoo Finance (REST) -+                         +- LSTM Trends (Python)  -+
Alpha Vantage (WSS)  -+->  Apache Kafka   ------+                         +-> React GUI
Twitter News API     -+    (Event Stream)       +- NLP Sentiment (BERT)  -+-> WebSockets
CoinGecko (REST)     -+           |                                       |
                                  v                                       v
                           [ PostgreSQL ] <------ [ Strategy Backtester ]-`}
          </pre>
        </div>

        <h3 className="text-xl text-white mb-4">Core Components for Production</h3>
        <ul className="space-y-4">
          <li className="flex gap-4">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
            <div>
              <strong className="text-slate-200 block mb-1">Data Ingestion Service (Go/Python)</strong>
              <span className="text-slate-400 text-sm">Maintains active WebSocket connections to exchanges for Level 2 order book data and OHLCV streaming. Uses Kafka or RabbitMQ for high-throughput local buffering.</span>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
            <div>
              <strong className="text-slate-200 block mb-1">Sentiment Analysis Worker (FastAPI)</strong>
              <span className="text-slate-400 text-sm">Long-polling news aggregators and social media. Runs lightweight DistilBERT models locally to tag events (Warning, Earnings, SEC action) with continuous normalized scores (-1 to 1).</span>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
            <div>
              <strong className="text-slate-200 block mb-1">LLM Reasoning Coordinator</strong>
              <span className="text-slate-400 text-sm">Compiles the numerical feature embeddings and sentiment scores into a final context window for Google Gemini, allowing the LLM to output human-readable reasoning and risk disclosures.</span>
            </div>
          </li>
        </ul>

      </div>
    </div>
  );
}
