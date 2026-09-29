import React, { useState } from 'react';
import { useMatka } from '../context/MatkaContext';
import { MatkaTicket } from '../types/matka';
import { Trophy, Copy, Check, Sparkles, Filter, Ticket } from 'lucide-react';

export const MyTicketsView: React.FC = () => {
  const { tickets, triggerConfetti, setReceiptModalTicket, setActiveTab } = useMatka();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'WON' | 'LOST'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleWinnerClick = (t: MatkaTicket) => {
    if (t.status === 'WON') {
      triggerConfetti();
    }
    setReceiptModalTicket(t);
  };

  const filteredTickets = tickets.filter((t) => {
    if (filter === 'ALL') return true;
    return t.status === filter;
  });

  const wonTotal = tickets
    .filter((t) => t.status === 'WON')
    .reduce((acc, t) => acc + (t.wonAmount || t.potentialWin), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-24">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#4d0818] via-[#350510] to-[#200207] border border-[#d4af37]/60 p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1">
            <Ticket className="w-3.5 h-3.5 text-[#f3c623]" />
            Patron Prediction Ledger
          </span>
          <h1 className="font-heading font-black italic text-xl sm:text-2xl text-white tracking-wide uppercase mt-0.5">
            My Prediction Tickets
          </h1>
          <p className="text-xs text-[#fbf3e4]/80">
            Official cryptographic slips with Dhanalaxmi 100% full profit payouts.
          </p>
        </div>

        {/* Total Won Badge */}
        <div className="bg-[#1b0207] p-3 rounded-xl border border-[#d4af37]/40 text-right sm:min-w-[180px]">
          <span className="text-[10px] uppercase font-bold text-[#d4af37] flex items-center justify-end gap-1">
            <Trophy className="w-3 h-3 text-[#f3c623]" />
            Total Winnings
          </span>
          <span className="font-num font-black text-xl text-emerald-400">
            ₹{wonTotal.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#24030a] border border-[#d4af37]/30 overflow-x-auto">
        {[
          { id: 'ALL', label: 'All Tickets' },
          { id: 'PENDING', label: 'Active / Pending' },
          { id: 'WON', label: '🏆 Big Winners' },
          { id: 'LOST', label: 'Closed / Lost' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setFilter(tab.id as any);
              if (tab.id === 'WON') triggerConfetti();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filter === tab.id
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#24030a] shadow-md font-black'
                : 'text-[#fffdf7] hover:bg-[#3d0614] hover:text-[#fef08a]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tickets List */}
      {filteredTickets.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-[#2a040d]/70 border border-[#d4af37]/20 p-6 space-y-3">
          <Ticket className="w-12 h-12 text-[#d4af37]/50 mx-auto" />
          <h3 className="font-heading font-black italic text-lg text-white">No Tickets Found</h3>
          <p className="text-xs text-[#fbf3e4]/60 max-w-sm mx-auto">
            You don&apos;t have any tickets under this filter. Place your predictions on any of the 8 markets.
          </p>
          <button
            onClick={() => setActiveTab('play')}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8010] text-[#24030a] font-bold text-xs uppercase shadow hover:scale-105 transition-all"
          >
            Play Now
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((t) => {
            const isWinner = t.status === 'WON';

            return (
              <div
                key={t.id}
                onClick={() => handleWinnerClick(t)}
                className={`relative rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer border ${
                  isWinner
                    ? 'bg-gradient-to-r from-[#173822] via-[#24030a] to-[#3a0612] border-[#10b981] shadow-xl hover:shadow-emerald-500/20 ring-1 ring-[#10b981]'
                    : 'bg-[#2b040e] border-[#d4af37]/30 hover:border-[#d4af37] shadow-md'
                }`}
              >
                {/* Top Row: Ticket ID, Market, Status */}
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-num font-black text-sm text-white tracking-wider">
                      {t.id}
                    </span>
                    <button
                      onClick={(e) => handleCopy(t.id, e)}
                      className="text-[#d4af37] hover:text-white p-1 rounded hover:bg-white/10"
                      title="Copy Slip ID"
                    >
                      {copiedId === t.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span className="text-[11px] text-[#fbf3e4]/50 hidden sm:inline">
                      • {t.createdAt}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isWinner ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-[11px] uppercase tracking-wider shadow-md animate-pulse">
                        <Trophy className="w-3.5 h-3.5 text-[#fef08a]" />
                        <span>WINNER</span>
                      </span>
                    ) : t.status === 'PENDING' ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase tracking-wider">
                        ACTIVE / PENDING
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold uppercase tracking-wider">
                        CLOSED
                      </span>
                    )}
                  </div>
                </div>

                {/* Main Ticket Info */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-3">
                  <div>
                    <span className="text-[10px] text-[#d4af37] uppercase font-bold block">
                      Market Name
                    </span>
                    <span className="font-heading font-black italic text-sm text-[#fef08a]">
                      {t.marketName}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#d4af37] uppercase font-bold block">
                      Game Mode
                    </span>
                    <span className="text-xs text-white font-semibold">
                      {t.gameMode.replace('_', ' ')}
                      {t.betType ? ` (${t.betType})` : ''}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#d4af37] uppercase font-bold block">
                      Selected Number(s)
                    </span>
                    <span className="font-num font-black text-lg text-white bg-[#190206] px-2 py-0.5 rounded border border-[#d4af37]/30 inline-block">
                      {t.numberSelection}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[#d4af37] uppercase font-bold block">
                      {isWinner ? 'Won Payout' : 'Potential Win'}
                    </span>
                    <span
                      className={`font-num font-black text-lg ${
                        isWinner ? 'text-emerald-400' : 'text-[#fef08a]'
                      }`}
                    >
                      ₹{(isWinner ? t.wonAmount || t.potentialWin : t.potentialWin).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#fbf3e4]/60 block">
                      Bet: ₹{t.amount.toLocaleString()} (Rate: ₹1={t.rate})
                    </span>
                  </div>
                </div>

                {/* Footer Hash Note */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-[#fbf3e4]/60">
                  <span className="truncate max-w-[250px]">Hash: {t.cryptographicHash}</span>
                  <span className="text-[#d4af37] font-semibold hover:underline">
                    View Full Slip Receipt →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
