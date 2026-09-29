import React from 'react';
import { useMatka } from '../context/MatkaContext';
import { MatkaMarket } from '../types/matka';
import { GOLDEN_ANK } from '../data/initialData';
import { Sun, Moon, ArrowRight, ShieldCheck, Zap, Award, Flame, RefreshCw } from 'lucide-react';
import lakshmiPhoto from '../assets/images/lakshmi_portrait_1790513816399.jpg';

export const HomeView: React.FC = () => {
  const { markets, setSelectedMarketForBet, setActiveTab, rates, showToast } = useMatka();

  const handlePlayMarket = (market: MatkaMarket) => {
    setSelectedMarketForBet(market);
    setActiveTab('play');
  };

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Fully Vertical Centered Hero Card in Burgundy and Gold */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#5c091d] via-[#420614] to-[#26030b] border-2 border-[#d4af37] p-5 sm:p-7 text-center shadow-2xl gold-border-glow">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-36 h-36 bg-[#f3c623]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-36 h-36 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Sacred Avatar & Header */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#d4af37] via-[#fef08a] to-[#b8860b] shadow-xl">
            <img
              src={lakshmiPhoto}
              alt="Goddess Sri Maha Dhanalaxmi Blessings"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-inner"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 bg-[#26030b] px-2.5 py-0.5 rounded-full border border-[#d4af37] text-[10px] font-bold text-[#fef08a] uppercase tracking-wider shadow">
              Shree Mahalakshmi
            </div>
          </div>

          <div>
            <h1 className="font-heading font-black italic tracking-wide text-2xl sm:text-3xl md:text-4xl gold-gradient-text uppercase leading-tight drop-shadow-md">
              DHANALAXMI MATKA AGENCY
            </h1>
            <p className="mt-1 text-xs sm:text-sm font-bold text-[#fef08a] tracking-widest uppercase flex items-center justify-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#f3c623] inline" />
              Goddess Dhanalaxmi Blessings • Live Fast Results
            </p>
          </div>

          <div className="inline-block bg-[#1f0208]/90 border border-[#d4af37]/60 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold text-[#fffdf7]">
            <span className="text-[#fef08a] font-black">!! NOTICE !!</span> &quot;Welcome to Dhanalaxmi Matka Agency !! 100% Full Profit Rates Guaranteed&quot;
          </div>
        </div>

        {/* Sacred Welcome Box: Photo and Divine Prosperity Blessings */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="p-3 rounded-xl bg-[#360510]/80 border border-[#d4af37]/30 flex items-start gap-2.5">
            <Award className="w-5 h-5 text-[#f3c623] shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xs font-bold text-[#fef08a] uppercase">100% Full Profit Rates</h2>
              <p className="text-[11px] text-[#fbf3e4]/80 mt-0.5">
                Maximum market payout rates on Single, Jodi, Pana, and Sangam games.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#360510]/80 border border-[#d4af37]/30 flex items-start gap-2.5">
            <Zap className="w-5 h-5 text-[#f3c623] shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xs font-bold text-[#fef08a] uppercase">Instant Fast Results</h2>
              <p className="text-[11px] text-[#fbf3e4]/80 mt-0.5">
                Real-time result updates across all 8 traditional Indian markets.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#360510]/80 border border-[#d4af37]/30 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xs font-bold text-[#fef08a] uppercase">India&apos;s No. 1 Trusted</h2>
              <p className="text-[11px] text-[#fbf3e4]/80 mt-0.5">
                Divine blessings of Goddess Sri Dhanalaxmi with guaranteed fast payout.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Rate Board Strip */}
        <div className="mt-4 pt-3 border-t border-[#d4af37]/20 flex flex-wrap items-center justify-around gap-2 text-xs font-bold">
          <div className="bg-[#24030a] px-3 py-1.5 rounded-lg border border-[#d4af37]/40">
            <span className="text-slate-300">Single Digit: </span>
            <span className="text-[#fef08a] font-num">₹1 = ₹{rates.singleDigit}</span>
          </div>
          <div className="bg-[#24030a] px-3 py-1.5 rounded-lg border border-[#d4af37]/40">
            <span className="text-slate-300">Jodi: </span>
            <span className="text-[#fef08a] font-num">₹1 = ₹{rates.jodi}</span>
          </div>
          <div className="bg-[#24030a] px-3 py-1.5 rounded-lg border border-[#d4af37]/40">
            <span className="text-slate-300">Single Pana: </span>
            <span className="text-[#fef08a] font-num">₹1 = ₹{rates.singlePana}</span>
          </div>
          <div className="bg-[#24030a] px-3 py-1.5 rounded-lg border border-[#d4af37]/40">
            <span className="text-slate-300">Double Pana: </span>
            <span className="text-[#fef08a] font-num">₹1 = ₹{rates.doublePana}</span>
          </div>
          <div className="bg-[#24030a] px-3 py-1.5 rounded-lg border border-[#d4af37]/40">
            <span className="text-slate-300">Triple Pana: </span>
            <span className="text-[#fef08a] font-num">₹1 = ₹{rates.triplePana}</span>
          </div>
        </div>
      </div>

      {/* 2. Today Lucky Number Section: Golden Ank & Final Ank Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Golden Ank Box */}
        <div className="lg:col-span-1 rounded-2xl bg-gradient-to-br from-[#4d0818] to-[#2c040d] border border-[#d4af37]/60 p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#f3c623]" />
                <h3 className="font-heading font-black italic text-sm text-[#fef08a] tracking-wide uppercase">
                  Today Golden Ank
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#f3c623]/20 text-[#fef08a] border border-[#f3c623]/40">
                Lucky 4
              </span>
            </div>
            <p className="text-[11px] text-[#fbf3e4]/70 mt-1">
              Astrological lucky numbers energized by Goddess Dhanalaxmi.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 my-4">
            {GOLDEN_ANK.map((ank, idx) => (
              <div
                key={idx}
                className="py-3 text-center rounded-xl bg-gradient-to-b from-[#24030a] to-[#150206] border-2 border-[#d4af37] shadow-md group hover:border-[#fef08a] transition-all"
              >
                <span className="font-num font-black text-2xl sm:text-3xl text-[#fef08a] drop-shadow">
                  {ank}
                </span>
                <span className="block text-[9px] text-[#d4af37] uppercase font-bold mt-0.5">
                  Ank {idx + 1}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('play')}
            className="w-full py-2 bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:from-[#fef08a] hover:to-[#d4af37] text-[#24030a] font-bold text-xs rounded-lg shadow uppercase tracking-wider transition-all"
          >
            Play Golden Ank Numbers
          </button>
        </div>

        {/* Final Ank Table for All 8 Markets */}
        <div className="lg:col-span-2 rounded-2xl bg-[#360510]/90 border border-[#d4af37]/50 p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#d4af37]" />
              <h3 className="font-heading font-black italic text-sm text-[#fffdf7] tracking-wide uppercase">
                Final Ank Daily Chart
              </h3>
            </div>
            <button
              onClick={() => showToast('Final Ank Table refreshed with latest market digits!')}
              className="text-xs text-[#d4af37] hover:text-[#fef08a] flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {markets.map((m) => (
              <div
                key={m.id}
                className="p-2.5 rounded-xl bg-[#24030a] border border-[#d4af37]/30 flex flex-col justify-between hover:border-[#d4af37] transition-all"
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-[#fbf3e4]/80">
                  <span className="truncate">{m.name}</span>
                  {m.session === 'DAY' ? (
                    <Sun className="w-3 h-3 text-[#f3c623] shrink-0" />
                  ) : (
                    <Moon className="w-3 h-3 text-cyan-400 shrink-0" />
                  )}
                </div>
                <div className="my-1.5 flex items-baseline justify-center gap-1">
                  <span className="text-[10px] text-[#d4af37] uppercase font-bold">Ank:</span>
                  <span className="font-num font-black text-xl text-[#fef08a]">{m.finalAnk}</span>
                </div>
                <div className="text-[9px] text-center font-bold text-emerald-400 uppercase tracking-wider">
                  Active
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. 8 Authentic Indian Matka Markets Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-black italic text-lg sm:text-xl text-[#fef08a] tracking-wide uppercase">
              All 8 Traditional Indian Markets
            </h2>
            <p className="text-xs text-[#fbf3e4]/70">
              Live results, Jodi & Pana combinations. Select any market to place your prediction.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('results')}
            className="text-xs text-[#d4af37] hover:text-[#fef08a] font-bold flex items-center gap-1"
          >
            <span>Full Results</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {markets.map((market) => (
            <div
              key={market.id}
              className="rounded-2xl bg-gradient-to-b from-[#420614] to-[#28040d] border border-[#d4af37]/40 hover:border-[#d4af37] p-4 flex flex-col justify-between shadow-lg hover:shadow-2xl transition-all duration-200 group"
            >
              {/* Market Header */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {market.session === 'DAY' ? (
                      <Sun className="w-4 h-4 text-[#f3c623]" />
                    ) : (
                      <Moon className="w-4 h-4 text-cyan-300" />
                    )}
                    <span className="font-heading font-black italic text-sm text-[#fffdf7] group-hover:text-[#fef08a] transition-colors tracking-wide">
                      {market.name}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider ${
                      market.status === 'OPEN'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                        : market.status === 'DECLARED'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                        : 'bg-rose-950 text-rose-300 border border-rose-500/50'
                    }`}
                  >
                    {market.status}
                  </span>
                </div>

                <div className="mt-1 text-[11px] text-[#fbf3e4]/60">
                  {market.roundLabel}
                </div>
              </div>

              {/* Central Result Display: Pana - Jodi - Pana format */}
              <div className="my-4 py-2.5 px-3 rounded-xl bg-[#1b0207] border border-[#d4af37]/30 text-center shadow-inner">
                <div className="font-num font-black text-xl sm:text-2xl tracking-widest text-[#fef08a] drop-shadow">
                  <span>{market.openPana}</span>
                  <span className="text-[#d4af37] mx-1.5">-</span>
                  <span className="text-white bg-[#54091a] px-2 py-0.5 rounded border border-[#d4af37]/50">
                    {market.jodi}
                  </span>
                  <span className="text-[#d4af37] mx-1.5">-</span>
                  <span>{market.closePana}</span>
                </div>
                <div className="mt-1 text-[9px] text-[#d4af37] uppercase font-bold tracking-wider">
                  Open Pana • Jodi • Close Pana
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handlePlayMarket(market)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8010] hover:from-[#fef08a] hover:to-[#d4af37] text-[#24030a] font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Play Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Rates & Agency Guarantee Description Card */}
      <div className="rounded-2xl bg-gradient-to-r from-[#3e0513] to-[#25030b] border border-[#d4af37]/50 p-5 shadow-xl text-left space-y-3">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-[#f3c623]" />
          <h3 className="font-heading font-black italic text-base sm:text-lg text-[#fef08a] uppercase tracking-wide">
            Dhanalaxmi Matka Agency Official Rules & Payout Policy
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-[#fbf3e4]/80 leading-relaxed">
          Welcome to Dhanalaxmi Matka Agency, India&apos;s most reputable and dependable destination for traditional Indian Matka predictions. We guarantee complete transparency, zero deductions, and immediate automatic point payouts directly into your wallet immediately upon result declaration.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-2 text-xs font-semibold text-[#fef08a]">
          <div className="p-2.5 rounded-lg bg-[#1f0208] border border-[#d4af37]/30">
            ✓ Full Winning Ratio Guaranteed
          </div>
          <div className="p-2.5 rounded-lg bg-[#1f0208] border border-[#d4af37]/30">
            ✓ Instant Withdrawal to UPI & Bank
          </div>
          <div className="p-2.5 rounded-lg bg-[#1f0208] border border-[#d4af37]/30">
            ✓ Cryptographic Entry Receipts
          </div>
          <div className="p-2.5 rounded-lg bg-[#1f0208] border border-[#d4af37]/30">
            ✓ 24/7 Agency Desk Support
          </div>
        </div>
      </div>
    </div>
  );
};
