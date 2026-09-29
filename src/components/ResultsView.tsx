import React, { useState } from 'react';
import { useMatka } from '../context/MatkaContext';
import { MatkaMarket } from '../types/matka';
import { Sun, Moon, ArrowRight, Trophy, Sparkles, RefreshCw } from 'lucide-react';

export const ResultsView: React.FC = () => {
  const { markets, setSelectedMarketForBet, setActiveTab, showToast } = useMatka();
  const [selectedChartMarket, setSelectedChartMarket] = useState<MatkaMarket | null>(null);

  // Generate sample historical round records for the selected market
  const sampleHistory = [
    { round: 'Round 1 (Today)', openPana: '128', jodi: '14', closePana: '356' },
    { round: 'Previous Round 2', openPana: '247', jodi: '38', closePana: '170' },
    { round: 'Previous Round 3', openPana: '348', jodi: '59', closePana: '469' },
    { round: 'Previous Round 4', openPana: '149', jodi: '42', closePana: '228' },
    { round: 'Previous Round 5', openPana: '157', jodi: '31', closePana: '380' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#4d0818] via-[#350510] to-[#200207] border border-[#d4af37]/60 p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#f3c623]" />
            Live Matka Declaration
          </span>
          <h1 className="font-heading font-black italic text-xl sm:text-2xl text-white tracking-wide uppercase mt-0.5">
            All 8 Traditional Market Results
          </h1>
          <p className="text-xs text-[#fbf3e4]/80">
            Real-time verified Open Pana, Jodi, and Close Pana results.
          </p>
        </div>

        <button
          onClick={() => showToast('Results board refreshed from central Dhanalaxmi server!')}
          className="px-3.5 py-2 rounded-xl bg-[#24030a] border border-[#d4af37]/40 hover:border-[#fef08a] text-xs font-bold text-[#fef08a] flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Results</span>
        </button>
      </div>

      {/* Main Results Table Card */}
      <div className="rounded-2xl bg-[#2f040e]/95 border-2 border-[#d4af37]/50 shadow-2xl overflow-hidden">
        <div className="p-4 bg-[#230209] border-b border-[#d4af37]/30 flex items-center justify-between">
          <h2 className="font-heading font-black italic text-sm sm:text-base text-[#fef08a] uppercase tracking-wide">
            Live Daily Result Board
          </h2>
          <span className="text-xs text-[#d4af37] font-semibold">
            Pana - Jodi - Pana
          </span>
        </div>

        <div className="divide-y divide-[#d4af37]/15">
          {markets.map((m) => (
            <div
              key={m.id}
              className="p-4 sm:p-5 hover:bg-[#3d0614]/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Left Column: Market Name and Badges */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {m.session === 'DAY' ? (
                    <Sun className="w-4 h-4 text-[#f3c623]" />
                  ) : (
                    <Moon className="w-4 h-4 text-cyan-300" />
                  )}
                  <h3 className="font-heading font-black italic text-base sm:text-lg text-white">
                    {m.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider ${
                      m.status === 'OPEN'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                        : m.status === 'DECLARED'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                        : 'bg-rose-950 text-rose-300 border border-rose-500/50'
                    }`}
                  >
                    {m.status}
                  </span>
                  <span className="text-[#fbf3e4]/60">•</span>
                  <span className="text-[#d4af37] font-semibold">{m.roundLabel}</span>
                  <span className="text-[#fbf3e4]/60">•</span>
                  <span className="text-slate-300">
                    Final Ank: <strong className="text-[#fef08a] font-num">{m.finalAnk}</strong>
                  </span>
                </div>
              </div>

              {/* Center Column: The Big Result Display */}
              <div className="bg-[#180206] px-5 py-2.5 rounded-xl border border-[#d4af37]/40 text-center shadow-inner self-center sm:self-auto">
                <div className="font-num font-black text-2xl sm:text-3xl tracking-widest text-[#fef08a] drop-shadow flex items-center justify-center gap-2">
                  <span className="tracking-normal">{m.openPana}</span>
                  <span className="text-[#d4af37] text-lg">-</span>
                  <span className="text-white bg-[#5c091d] px-2.5 py-0.5 rounded border border-[#d4af37]/60">
                    {m.jodi}
                  </span>
                  <span className="text-[#d4af37] text-lg">-</span>
                  <span className="tracking-normal">{m.closePana}</span>
                </div>
                <div className="text-[9px] uppercase font-bold text-[#d4af37] tracking-wider mt-0.5">
                  Open Pana • Single Jodi • Close Pana
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => setSelectedChartMarket(m)}
                  className="px-3 py-2 rounded-xl bg-[#24030a] hover:bg-[#380611] border border-[#d4af37]/40 text-xs font-bold text-[#d4af37] hover:text-[#fef08a] transition-all"
                >
                  Pana Chart
                </button>

                <button
                  onClick={() => {
                    setSelectedMarketForBet(m);
                    setActiveTab('play');
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8010] hover:from-[#fef08a] hover:to-[#d4af37] text-[#24030a] text-xs font-black uppercase tracking-wider shadow transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Play</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Pana Chart Drawer/Modal */}
      {selectedChartMarket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#3d0614] to-[#1c0208] border-2 border-[#d4af37] p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/30">
              <div>
                <h3 className="font-heading font-black italic text-lg text-[#fef08a] uppercase">
                  {selectedChartMarket.name} Pana & Jodi Chart
                </h3>
                <p className="text-xs text-[#fbf3e4]/70">Recent official declared combinations</p>
              </div>
              <button
                onClick={() => setSelectedChartMarket(null)}
                className="px-2.5 py-1 rounded bg-[#24030a] border border-[#d4af37]/30 text-xs text-[#d4af37] hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="my-4 divide-y divide-white/10 rounded-xl bg-[#140105] border border-[#d4af37]/30 overflow-hidden">
              <div className="grid grid-cols-4 p-2.5 text-[11px] font-bold text-[#d4af37] uppercase bg-[#200207]">
                <span>Round</span>
                <span className="text-center">Open Pana</span>
                <span className="text-center">Jodi</span>
                <span className="text-right">Close Pana</span>
              </div>
              {sampleHistory.map((row, i) => (
                <div key={i} className="grid grid-cols-4 p-2.5 text-xs text-white items-center">
                  <span className="text-[11px] text-[#fbf3e4]/80 font-medium">{row.round}</span>
                  <span className="text-center font-num font-bold text-[#fef08a]">{row.openPana}</span>
                  <span className="text-center font-num font-black text-emerald-400 bg-[#360510] py-0.5 rounded border border-[#d4af37]/20">
                    {row.jodi}
                  </span>
                  <span className="text-right font-num font-bold text-[#fef08a]">{row.closePana}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setSelectedMarketForBet(selectedChartMarket);
                setSelectedChartMarket(null);
                setActiveTab('play');
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8010] text-[#24030a] font-black text-xs uppercase tracking-wider"
            >
              Predict On {selectedChartMarket.name}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
