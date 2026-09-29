import React, { useState } from 'react';
import { useMatka } from '../context/MatkaContext';
import { Copy, Check, Printer, X, ShieldCheck, Sparkles } from 'lucide-react';
import lakshmiWatermark from '../assets/images/lakshmi_portrait_1790513816399.jpg';

export const DigitalReceiptModal: React.FC = () => {
  const { receiptModalTicket, setReceiptModalTicket } = useMatka();
  const [copied, setCopied] = useState(false);

  if (!receiptModalTicket) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(receiptModalTicket.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#420614] via-[#2f040e] to-[#1c0208] border-2 border-[#d4af37] p-6 shadow-2xl overflow-hidden gold-border-glow">
        {/* Sacred Watermark in background */}
        <div
          className="absolute inset-0 opacity-[0.06] bg-center bg-no-repeat bg-cover pointer-events-none"
          style={{ backgroundImage: `url(${lakshmiWatermark})` }}
        />

        {/* Close Button */}
        <button
          onClick={() => setReceiptModalTicket(null)}
          className="absolute top-4 right-4 text-[#d4af37] hover:text-white p-1 rounded-lg bg-[#24030a] border border-[#d4af37]/30 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Agency Seal Header */}
        <div className="text-center space-y-1.5 pb-4 border-b border-[#d4af37]/30">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#f3c623]/20 border border-[#f3c623]/40 text-[#fef08a] text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3 text-[#f3c623]" />
            Official Prediction Slip
          </div>
          <h2 className="font-heading font-black italic text-lg sm:text-xl text-[#fef08a] tracking-wide uppercase">
            DHANALAXMI MATKA AGENCY
          </h2>
          <p className="text-[11px] text-[#d4af37] tracking-wider uppercase font-semibold">
            100% Full Profit • Cryptographic Receipt
          </p>
        </div>

        {/* Receipt Content */}
        <div className="mt-4 space-y-3 text-xs">
          {/* Ticket ID Box */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#180207] border border-[#d4af37]/40">
            <div>
              <span className="text-[10px] text-[#d4af37] uppercase font-bold block">
                Slip Number / Ticket ID
              </span>
              <span className="font-num font-black text-base text-white tracking-wider">
                {receiptModalTicket.id}
              </span>
            </div>
            <button
              onClick={handleCopyId}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#3a0612] hover:bg-[#54091a] text-[11px] font-bold text-[#fef08a] border border-[#d4af37]/40 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Details Table */}
          <div className="rounded-xl bg-[#1b0207]/80 p-3 space-y-2 border border-[#d4af37]/20">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-[#fbf3e4]/70">Market:</span>
              <strong className="text-white font-heading font-black italic">
                {receiptModalTicket.marketName}
              </strong>
            </div>

            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-[#fbf3e4]/70">Game Mode:</span>
              <span className="text-[#fef08a] font-bold">
                {receiptModalTicket.gameMode.replace('_', ' ')}
                {receiptModalTicket.betType ? ` (${receiptModalTicket.betType})` : ''}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-[#fbf3e4]/70">Predicted Number(s):</span>
              <span className="font-num font-black text-base text-[#fef08a] bg-[#3a0612] px-2 py-0.5 rounded border border-[#d4af37]/30">
                {receiptModalTicket.numberSelection}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-[#fbf3e4]/70">Amount Placed:</span>
              <span className="font-num font-bold text-white">
                ₹{receiptModalTicket.amount.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-[#fbf3e4]/70">Payout Rate:</span>
              <span className="text-[#d4af37] font-semibold font-num">
                ₹1 = ₹{receiptModalTicket.rate}
              </span>
            </div>

            <div className="flex justify-between py-1.5 pt-2">
              <span className="text-xs font-bold text-[#fef08a] uppercase">Potential Win:</span>
              <span className="font-num font-black text-lg text-emerald-400">
                ₹{receiptModalTicket.potentialWin.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Cryptographic Hash */}
          <div className="p-2 rounded-lg bg-[#140105] text-[10px] text-slate-400 font-mono text-center truncate border border-[#d4af37]/20">
            Hash: {receiptModalTicket.cryptographicHash}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            onClick={handlePrint}
            className="py-2.5 rounded-xl bg-[#2b040e] hover:bg-[#3d0614] border border-[#d4af37]/40 text-xs font-bold text-[#fef08a] flex items-center justify-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={() => setReceiptModalTicket(null)}
            className="py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8010] hover:from-[#fef08a] hover:to-[#d4af37] text-[#24030a] text-xs font-black uppercase tracking-wider shadow transition-all"
          >
            Done / Close
          </button>
        </div>

        <div className="mt-3 text-center text-[10px] text-[#fbf3e4]/60">
          Blessings of Goddess Sri Maha Lakshmi Dhanalaxmi
        </div>
      </div>
    </div>
  );
};
