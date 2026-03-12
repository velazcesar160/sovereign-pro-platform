"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Zap, Clock, Globe, Target, TrendingUp, Notebook, 
  Plus, Trash2, Download, Upload, Settings, 
  ShieldAlert, Mic, Send, X, CheckCircle2,
  AlertCircle, Info, Flame
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function JournalPage() {
  const [trades, setTrades] = useState([]);
  const [stats, setStats] = useState({ A: 0, B: 0, F: 0, total: 0 });
  const [sessionTime, setSessionTime] = useState(0);
  const [clocks, setClocks] = useState({ ny: "--:--", lon: "--:--", asia: "--:--" });
  const [checklist, setChecklist] = useState({ chk1: false, chk2: false, chk3: false, chk4: false });
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [pnlHeader, setPnlHeader] = useState(0);

  // Form State
  const [form, setForm] = useState({
    asset: "NAS100",
    manualAsset: "",
    grade: "A",
    pnl: "",
    rr: "",
    notes: "",
    screenshot: "",
    ghost: false,
    strategy: "ICC Standard"
  });

  useEffect(() => {
    // Initial Load
    const savedTrades = localStorage.getItem("me_trades_v201"); // Updated version for the app
    if (savedTrades) {
      const parsed = JSON.parse(savedTrades);
      setTrades(parsed);
      recalcStats(parsed);
    }

    // Clocks
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
      updateWorldClocks();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const updateWorldClocks = () => {
    const opts = { hour: '2-digit', minute: '2-digit', hour12: true };
    setClocks({
      ny: new Date().toLocaleTimeString("en-US", { ...opts, timeZone: "America/New_York" }),
      lon: new Date().toLocaleTimeString("en-US", { ...opts, timeZone: "Europe/London" }),
      asia: new Date().toLocaleTimeString("en-US", { ...opts, timeZone: "Asia/Tokyo" }),
    });
  };

  const recalcStats = (tradeList) => {
    const newStats = { A: 0, B: 0, F: 0, total: 0 };
    let totalPnl = 0;
    tradeList.forEach(t => {
      if (!t.ghost) {
        newStats[t.grade]++;
        newStats.total++;
        totalPnl += parseFloat(t.pnl) || 0;
      }
    });
    setStats(newStats);
    setPnlHeader(totalPnl);
  };

  const handleCommit = (e) => {
    e.preventDefault();
    const newTrade = {
      ...form,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      discipline: Object.values(checklist),
      asset: form.asset === "OTHER" ? form.manualAsset : form.asset
    };

    let updatedTrades;
    if (editingIndex >= 0) {
      updatedTrades = [...trades];
      updatedTrades[editingIndex] = newTrade;
      setEditingIndex(-1);
    } else {
      updatedTrades = [newTrade, ...trades];
    }

    setTrades(updatedTrades);
    localStorage.setItem("me_trades_v201", JSON.stringify(updatedTrades));
    recalcStats(updatedTrades);
    
    // Reset
    setForm({ asset: "NAS100", manualAsset: "", grade: "A", pnl: "", rr: "", notes: "", screenshot: "", ghost: false, strategy: "ICC Standard" });
    setChecklist({ chk1: false, chk2: false, chk3: false, chk4: false });
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const isChecklistComplete = Object.values(checklist).every(v => v);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Clocks */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-card p-3 border-rose-500/20 bg-rose-500/5 flex flex-col items-center">
          <span className="text-[10px] font-black uppercase text-rose-500 flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Kill Switch</span>
          <span className="text-sm font-mono text-rose-400">READY</span>
        </div>
        <div className="glass-card p-3 flex flex-col items-center">
          <span className="text-[10px] font-black uppercase text-zinc-500 flex items-center gap-1"><Clock className="w-3 h-3"/> Session</span>
          <span className="text-sm font-mono text-white">{formatTime(sessionTime)}</span>
        </div>
        <div className="glass-card p-3 flex flex-col items-center">
          <span className="text-[10px] font-black uppercase text-blue-400 flex items-center gap-1"><Globe className="w-3 h-3"/> Asia</span>
          <span className="text-sm font-mono text-white">{clocks.asia}</span>
        </div>
        <div className="glass-card p-3 flex flex-col items-center">
          <span className="text-[10px] font-black uppercase text-green-400 flex items-center gap-1"><Globe className="w-3 h-3"/> London</span>
          <span className="text-sm font-mono text-white">{clocks.lon}</span>
        </div>
        <div className="glass-card p-3 flex flex-col items-center">
          <span className="text-[10px] font-black uppercase text-indigo-400 flex items-center gap-1"><Globe className="w-3 h-3"/> New York</span>
          <span className="text-sm font-mono text-white">{clocks.ny}</span>
        </div>
        <div className="glass-card p-3 border-emerald-500/20 bg-emerald-500/5 flex flex-col items-center">
          <span className="text-[10px] font-black uppercase text-emerald-400 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Net P&L</span>
          <span className={cn("text-sm font-mono font-black", pnlHeader >= 0 ? "text-emerald-400" : "text-rose-400")}>
            {pnlHeader >= 0 ? "+" : "-"}${Math.abs(pnlHeader).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Grade Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['A', 'B', 'F'].map(g => (
          <div key={g} className="glass-card p-4">
            <div className="flex justify-between mb-2">
              <span className={cn("text-[10px] font-black uppercase", g === 'A' ? "text-emerald-400" : g === 'B' ? "text-indigo-400" : "text-rose-500")}>Grade: {g === 'A' ? 'A+' : g}</span>
              <span className="text-[10px] font-bold">{stats[g]}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
               <div 
                  className={cn("h-full transition-all duration-500", g === 'A' ? "bg-emerald-500" : g === 'B' ? "bg-indigo-500" : "bg-rose-500")}
                  style={{ width: `${stats.total > 0 ? (stats[g]/stats.total)*100 : 0}%` }}
               />
            </div>
          </div>
        ))}
      </div>

      {/* Main Journal Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Execution Form */}
        <div className="lg:col-span-8 glass-card p-6 md:p-8 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2"><Plus className="w-4 h-4 text-indigo-500"/> Execute Journal</h3>
            <div className="flex gap-2">
               <button className="p-2 glass-card hover:bg-white/10 transition text-zinc-400"><Download className="w-3.5 h-3.5"/></button>
               <button className="p-2 glass-card hover:bg-white/10 transition text-zinc-400"><Upload className="w-3.5 h-3.5"/></button>
               <button className="p-2 glass-card border-rose-500/20 hover:bg-rose-500/10 transition text-rose-500"><Trash2 className="w-3.5 h-3.5"/></button>
            </div>
          </div>

          <form onSubmit={handleCommit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Checklist */}
              <div className="bg-black/40 p-6 rounded-3xl border border-white/5 space-y-4">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                   <Target className="w-3 h-3"/> Gatekeeper
                </p>
                {[
                  { id: 'chk1', label: 'BOS / Structural Break' },
                  { id: 'chk2', label: 'No Red Folder News' },
                  { id: 'chk3', label: 'Risk Exactly 1% or Less' },
                  { id: 'chk4', label: 'Mood: Mechanical & Calm' }
                ].map(item => (
                  <label key={item.id} className="flex items-center gap-3 text-xs font-bold cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-white/10 bg-black text-indigo-500 focus:ring-offset-black"
                      checked={checklist[item.id]}
                      onChange={() => setChecklist(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                    />
                    <span className="group-hover:text-indigo-400 transition">{item.label}</span>
                  </label>
                ))}
              </div>

              {/* Inputs */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <select 
                    className="flex-grow p-3 rounded-xl bg-black border border-white/10 text-[11px] font-black uppercase"
                    value={form.asset}
                    onChange={(e) => setForm(prev => ({ ...prev, asset: e.target.value }))}
                  >
                    <option value="NAS100">NAS100</option>
                    <option value="GOLD">XAUUSD</option>
                    <option value="EURUSD">EURUSD</option>
                    <option value="OTHER">Manual</option>
                  </select>
                  <select 
                    className="p-3 rounded-xl bg-black border border-white/10 text-[11px] font-black uppercase"
                    value={form.grade}
                    onChange={(e) => setForm(prev => ({ ...prev, grade: e.target.value }))}
                  >
                    <option value="A">Grade: A+</option>
                    <option value="B">Grade: B</option>
                    <option value="F">Grade: F</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="number" 
                    placeholder="Net P&L ($)" 
                    className="p-3 rounded-xl bg-black border border-white/10 text-xs font-bold"
                    value={form.pnl}
                    onChange={(e) => setForm(prev => ({ ...prev, pnl: e.target.value }))}
                  />
                  <input 
                    type="number" 
                    placeholder="R:R Ratio" 
                    className="p-3 rounded-xl bg-black border border-white/10 text-xs font-bold"
                    value={form.rr}
                    onChange={(e) => setForm(prev => ({ ...prev, rr: e.target.value }))}
                  />
                </div>
                <textarea 
                  placeholder="Thesis & Context..." 
                  className="w-full p-3 rounded-xl bg-black border border-white/10 text-xs min-h-[100px] resize-none"
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                type="button"
                className="w-full md:w-1/3 bg-white text-black font-black uppercase text-[11px] tracking-widest py-4 rounded-2xl hover:bg-zinc-200 transition"
              >
                M.E. AUDITOR PRO
              </button>
              <button 
                disabled={!isChecklistComplete}
                className={cn(
                  "w-full md:w-2/3 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition shadow-lg",
                  isChecklistComplete ? "bg-indigo-600 text-white hover:bg-indigo-500" : "bg-zinc-900 text-zinc-600 cursor-not-allowed border border-white/5"
                )}
              >
                {isChecklistComplete ? (editingIndex >= 0 ? "Update Execution" : "Commit Execution") : "Locked — Complete Checklist"}
              </button>
            </div>
          </form>
        </div>

        {/* Trade Ledger */}
        <div className="lg:col-span-4 glass-card p-6 min-h-[400px]">
           <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2"><Notebook className="w-4 h-4 text-emerald-400"/> Recent Ledger</h3>
           <div className="space-y-3">
              {trades.length === 0 ? (
                <div className="text-center py-20 text-zinc-600">
                  <p className="text-xs font-bold uppercase tracking-widest">No trades logged</p>
                </div>
              ) : (
                trades.map((t, i) => (
                  <div key={i} className="bg-black/50 border border-white/5 p-4 rounded-2xl hover:border-white/10 transition group">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                          <p className="text-[10px] font-black text-zinc-500 uppercase">{t.date}</p>
                          <h4 className="text-xs font-black uppercase">{t.asset}</h4>
                       </div>
                       <span className={cn("text-xs font-black", t.grade === 'A' ? "text-emerald-400" : t.grade === 'B' ? "text-indigo-400" : "text-rose-500")}>
                          {t.pnl >= 0 ? '+' : '-'}${Math.abs(t.pnl)}
                       </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 line-clamp-1 italic">{t.notes}</p>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>

      {/* AI Floating Button */}
      <button 
        onClick={() => setIsAiOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition z-[1000] border-2 border-white/10"
      >
        <Zap className="w-6 h-6 text-white fill-white" />
      </button>

      {/* AI Sidebar/Modal Placeholder */}
      {isAiOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
           <div className="max-w-md w-full glass-card border-indigo-500/50 shadow-[0_0_50px_rgba(99,102,241,0.2)] overflow-hidden flex flex-col h-[600px]">
              <div className="bg-indigo-600 p-4 flex justify-between items-center">
                 <span className="font-black italic text-xs uppercase tracking-tighter">🔱 Auditor Pro</span>
                 <button onClick={() => setIsAiOpen(false)}><X className="w-4 h-4"/></button>
              </div>
              <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                 <div className="glass-card bg-indigo-400/10 border-indigo-500/20 p-4 rounded-2xl text-xs leading-relaxed">
                    Hello CEO. I am the Auditor Pro. I've been monitoring your confluences. Your discipline score is currently <span className="text-[#00ff88] font-bold">EXCELLENT</span>.
                 </div>
              </div>
              <div className="p-4 bg-black border-t border-white/5 flex gap-2">
                 <input className="flex-grow bg-white/5 rounded-xl px-4 py-3 text-xs border border-white/5 focus:outline-none focus:border-indigo-500 transition" placeholder="Interrogate the AI..."/>
                 <button className="bg-indigo-600 p-3 rounded-xl"><Send className="w-4 h-4"/></button>
              </div>
           </div>
        </div>
      )}

      <style jsx global>{`
        .glass-card {
           background: rgba(255, 255, 255, 0.02);
           backdrop-filter: blur(25px);
           border-radius: 24px;
           border: 1px solid rgba(255, 255, 255, 0.05);
           transition: 0.3s ease;
        }
        .glass-card:hover {
           border-color: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
