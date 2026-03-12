"use client";
import { useState } from "react";
import { Terminal, Shield, Zap, Star, Check, ArrowRight, Loader2 } from "lucide-react";

export default function Home() {
  const [loadingTier, setLoadingTier] = useState(null);

  const handleCheckout = async (tier) => {
    if (tier.price === "$0") return; // Starter is free
    
    setLoadingTier(tier.name);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: tier.priceId, // This needs to be provided by user later
          isSubscription: tier.duration !== "one-time"
        })
      });
      const { sessionId } = await res.json();
      if (sessionId) {
          // Typically we would use stripe-js here, but redirecting to session is fine
          window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
      }
    } catch (err) {
      console.error(err);
      alert("Please connect your Stripe keys to enable checkout.");
    } finally {
      setLoadingTier(null);
    }
  };

  const tiers = [
    {
      name: "Active Trader",
      price: "$19",
      priceId: "price_active_placeholder",
      duration: "per month",
      savings: null,
      description: "Perfect for beginners testing their edge.",
      features: ["Full Trading Journal", "AI Auditor (Limited)", "Basic Risk Engines", "Browser Sync"],
      color: "border-zinc-800",
      buttonColor: "bg-white text-black hover:bg-zinc-200",
    },
    {
      name: "Serious Sniper",
      price: "$49",
      priceId: "price_sniper_placeholder",
      duration: "per 3 months",
      savings: "Save 15%",
      description: "Committed to a full quarter of discipline.",
      features: ["Everything in Active", "Unlimited AI Audits", "Adv. Tilt Tracking", "Priority API Support"],
      color: "border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.1)]",
      buttonColor: "bg-indigo-600 text-white hover:bg-indigo-500",
      featured: true
    },
    {
      name: "Sovereign Elite",
      price: "$149",
      priceId: "price_elite_placeholder",
      duration: "per year",
      savings: "Save 35%",
      description: "The professional choice for serious growth.",
      features: ["Everything in Sniper", "Custom AI Playbooks", "Beta Access Features", "Data Export (CSV/JSON)"],
      color: "border-zinc-800",
      buttonColor: "bg-white text-black hover:bg-zinc-200",
    },
    {
      name: "Lifetime Access",
      price: "$299",
      priceId: "price_lifetime_placeholder",
      duration: "one-time",
      savings: "Best Value",
      description: "Never pay for a trading tool again.",
      features: ["Everything Forever", "No Recurring Fees", "Founder Badge Status", "Direct Developer Access"],
      color: "border-[#00ff88]/50 shadow-[0_0_20px_rgba(0,255,136,0.1)]",
      buttonColor: "bg-[#00ff88] text-black hover:bg-[#00cc6e]",
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#00ff88] selection:text-black">
      {/* Navigation */}
      <nav className="border-b border-white/5 py-6 px-8 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg rotate-3 shadow-lg">
             <Terminal className="w-5 h-5 text-white" />
          </div>
          <span className="font-black italic text-xl tracking-tighter uppercase whitespace-nowrap">Sovereign<span className="text-indigo-500">Pro</span></span>
        </div>
        <div className="flex gap-6 items-center">
          <button className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition">Sign In</button>
          <button className="bg-white text-black text-xs font-black uppercase tracking-widest px-6 py-2.5 rounded-full hover:bg-zinc-200 transition">Get Started</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-24">
          <div className="inline-block px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Institutional Infrastructure</p>
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.9]">
            The Elite Trader's <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-[#00ff88] to-indigo-500 animate-gradient">Modular Workflow.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-500 text-lg md:text-xl font-medium leading-relaxed">
            Stop gambling. Start auditing. A unified ecosystem for chart roasting, journaling, and behavior-enforced risk management.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {tiers.map((tier, idx) => (
            <div 
              key={idx} 
              className={`glass-panel border-2 rounded-[32px] p-8 flex flex-col justify-between transition-all hover:translate-y-[-8px] ${tier.color} relative overflow-hidden group`}
            >
              {tier.featured && (
                <div className="absolute top-4 right-4 animate-pulse">
                  <Star className="w-5 h-5 text-indigo-400 fill-indigo-400" />
                </div>
              )}
              
              <div>
                <div className="mb-8">
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black tracking-tighter">{tier.price}</span>
                    <span className="text-zinc-600 text-xs font-bold uppercase">{tier.duration}</span>
                  </div>
                  {tier.savings && (
                    <span className="inline-block mt-3 px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-black text-indigo-400 uppercase rounded-full">
                      {tier.savings}
                    </span>
                  )}
                </div>

                <p className="text-sm text-zinc-400 mb-8 leading-relaxed">{tier.description}</p>

                <ul className="space-y-4 mb-12">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3 text-sm text-zinc-300">
                      <Check className={`w-4 h-4 flex-shrink-0 ${idx === 3 ? 'text-[#00ff88]' : 'text-indigo-500'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => handleCheckout(tier)}
                disabled={loadingTier === tier.name}
                className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${tier.buttonColor} flex items-center justify-center gap-2`}
              >
                {loadingTier === tier.name ? <Loader2 className="w-4 h-4 animate-spin" /> : tier.price === "$0" ? "Current Plan" : "Select Plan"}
              </button>
            </div>
          ))}
        </div>

        {/* Audit Callout */}
        <div className="mt-32 p-1 bg-gradient-to-r from-indigo-500 via-[#00ff88] to-indigo-500 rounded-[40px] shadow-[0_0_50px_rgba(0,255,136,0.1)]">
           <div className="bg-black/95 rounded-[38px] p-12 md:p-20 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-20 bg-indigo-600/10 blur-[120px] rounded-full"></div>
              <div className="relative z-10 space-y-8">
                 <h2 className="text-4xl md:text-5xl font-black italic uppercase italic tracking-tighter">Your AI Auditor is <span className="text-[#00ff88]">Watching.</span></h2>
                 <p className="max-w-xl mx-auto text-zinc-400 text-lg">Integrated directly with your journal to enforce rules, track tilt, and shout at you when you break your playbook.</p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                    <button className="bg-indigo-600 px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-4 group">
                      Initialize Pro Access <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-8 flex flex-col items-center gap-6 mt-20">
        <div className="flex items-center gap-2 text-zinc-600 scale-75 grayscale opacity-50">
          <Terminal className="w-5 h-5" />
          <span className="font-black italic text-lg uppercase">Sovereign Pro</span>
        </div>
        <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.3em]">Built for the disciplined few.</p>
      </footer>

      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 5s linear infinite;
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(25px);
        }
      `}</style>
    </div>
  );
}
