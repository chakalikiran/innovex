import { Check, Clock, BookOpen, Home, Trophy, CreditCard } from 'lucide-react';

export function HeroWorkflowVisual() {
  return (
    <div className="w-full max-w-md mx-auto lg:ml-auto rounded-[1.75rem] bg-[#34383C] border border-white/10 p-6 sm:p-7 shadow-2xl text-white">
      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-base font-bold text-white tracking-tight block">
            Student Request
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            ID: REQ-2026-048 • CS Cohort
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live Status
        </span>
      </div>

      {/* Visual Status Chips (Non-clickable visual indicators) */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#2A2D31] text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
          <Check className="w-3 h-3 text-emerald-400" />
          Library
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#2A2D31] text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
          <Check className="w-3 h-3 text-emerald-400" />
          Hostel
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-950/60 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-amber-400" />
          Sports
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#2A2D31] text-slate-300 border border-white/10 flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-slate-400" />
          Accounts
        </span>
      </div>

      {/* Department Clearance Status Overview (Pure visual information) */}
      <div className="bg-[#2A2D31] rounded-2xl p-4 border border-white/5 space-y-3 mb-5">
        {/* Central Library */}
        <div className="flex items-center justify-between text-xs pb-2.5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-blue-950/80 text-blue-400 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold text-white block leading-tight">Central Library</span>
              <span className="text-[10px] text-slate-400 font-mono">Books & journals returned</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30 flex items-center gap-1">
            <Check className="w-3 h-3" /> Cleared
          </span>
        </div>

        {/* Hostel */}
        <div className="flex items-center justify-between text-xs pb-2.5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-emerald-950/80 text-emerald-400 flex items-center justify-center">
              <Home className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold text-white block leading-tight">Residence Directorate</span>
              <span className="text-[10px] text-slate-400 font-mono">Room inspected & mess dues clear</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30 flex items-center gap-1">
            <Check className="w-3 h-3" /> Cleared
          </span>
        </div>

        {/* Sports */}
        <div className="flex items-center justify-between text-xs pb-2.5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-amber-950/80 text-amber-400 flex items-center justify-center">
              <Trophy className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold text-white block leading-tight">Physical Education</span>
              <span className="text-[10px] text-slate-400 font-mono">Sports inventory sign-off pending</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-400 text-[10px] font-mono font-bold border border-amber-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3" /> In Review
          </span>
        </div>

        {/* Accounts */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-purple-950/80 text-purple-400 flex items-center justify-center">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold text-white block leading-tight">Accounts & Finance</span>
              <span className="text-[10px] text-slate-400 font-mono">Caution deposit statement queued</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono font-bold border border-white/10 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Queued
          </span>
        </div>
      </div>

      {/* Subtle Divider */}
      <div className="h-px w-full bg-white/10 mb-4" />

      {/* Bottom Status Row */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 block mb-0.5 font-mono uppercase tracking-wider">
            Verification Progress
          </span>
          <span className="text-sm sm:text-base font-bold text-white">
            3 of 4 Departments Cleared
          </span>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#454B51] border border-white/10 flex items-center justify-center font-mono font-bold text-sm text-white shadow-inner">
          75%
        </div>
      </div>
    </div>
  );
}

