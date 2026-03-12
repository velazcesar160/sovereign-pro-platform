"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Terminal, LogOut, LayoutDashboard, Notebook, Settings } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black/50 backdrop-blur-md flex flex-col hidden md:flex">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-1.5 rounded-lg rotate-3 shadow-lg">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <span className="font-black italic text-lg tracking-tighter uppercase whitespace-nowrap">Sovereign<span className="text-indigo-500">Pro</span></span>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition text-zinc-400 hover:text-white">
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Overview</span>
          </Link>
          <Link href="/dashboard/journal" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 transition">
            <Notebook className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Journal</span>
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition text-zinc-400 hover:text-white">
            <Settings className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => signOut()}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto">
        <header className="border-b border-white/5 py-4 px-8 flex justify-between items-center bg-black/50 md:hidden">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-500" />
              <span className="font-black italic text-md uppercase">Sovereign Pro</span>
            </div>
            <button onClick={() => signOut()} className="text-zinc-500 hover:text-white transition"><LogOut className="w-4 h-4" /></button>
        </header>
        {children}
      </main>
    </div>
  );
}
