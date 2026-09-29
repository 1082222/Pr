import React from 'react';
import { useMatka } from '../context/MatkaContext';
import { CheckCircle2, ShieldCheck, Check, X, ArrowDownCircle } from 'lucide-react';

export const WithdrawalSuccessModal: React.FC = () => {
  const { successfulWithdrawalModal, setSuccessfulWithdrawalModal } = useMatka();

  if (!successfulWithdrawalModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#032e1f] border-2 border-[#10b981] p-6 text-center shadow-2xl overflow-hidden ring-4 ring-[#059669]/30">
        {/* Decorative Green Glow Backdrops */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-[#10b981]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-[#059669]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Icon */}
        <button
          onClick={() => setSuccessfulWithdrawalModal(null)}
          className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-lg bg-[#04432d] border border-[#10b981]/30 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Green Checkmark Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-lg ring-4 ring-emerald-400/40 animate-bounce">
          <CheckCircle2 className="w-10 h-10 text-white stroke-[2.5]" />
        </div>

        {/* Rich Emerald Green Status Badge */}
        <div className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-600 border border-emerald-400 text-white text-xs font-black uppercase tracking-wider shadow-md">
          <ShieldCheck className="w-4 h-4 text-white" />
          <span>WITHDRAWAL SUCCESSFUL</span>
        </div>

        {/* Heading */}
        <h2 className="mt-3 font-heading font-black italic text-xl sm:text-2xl text-emerald-100 uppercase tracking-wide">
          Direct Payout Transferred
        </h2>
        <p className="text-xs text-emerald-200/90 mt-1">
          Dhanalaxmi Matka Agency guaranteed instant payout processed.
        </p>

        {/* Transferred Amount Highlight in Rich Emerald Green */}
        <div className="my-5 p-4 rounded-xl bg-gradient-to-b from-[#04432d] to-[#022619] border border-emerald-500/50 shadow-inner">
          <div className="text-[11px] uppercase font-bold text-emerald-300 tracking-wider">
            Transferred Amount
          </div>
          <div className="font-num font-black text-3xl sm:text-4xl text-emerald-400 mt-0.5 tracking-tight">
            ₹{successfulWithdrawalModal.amount.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-300/80 mt-1 flex items-center justify-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>0% Agency Fee • 100% Full Profit Amount Credited</span>
          </div>
        </div>

        {/* Details Table */}
        <div className="space-y-2 text-left text-xs bg-[#04432d]/60 p-3.5 rounded-xl border border-emerald-500/30">
          <div className="flex justify-between py-1 border-b border-emerald-500/20">
            <span className="text-emerald-200/70">Transaction ID:</span>
            <span className="font-num font-bold text-emerald-100">
              {successfulWithdrawalModal.referenceNumber}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-emerald-500/20">
            <span className="text-emerald-200/70">Payment Method:</span>
            <span className="font-bold text-white uppercase">
              {successfulWithdrawalModal.method === 'UPI' ? 'Instant UPI' : 'IMPS Bank Transfer'}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-emerald-500/20">
            <span className="text-emerald-200/70">Destination:</span>
            <span className="font-bold text-emerald-300 truncate max-w-[200px]">
              {successfulWithdrawalModal.method === 'UPI'
                ? successfulWithdrawalModal.upiId
                : `${successfulWithdrawalModal.bankAccount?.bankName} (${successfulWithdrawalModal.bankAccount?.accountNumber})`}
            </span>
          </div>

          <div className="flex justify-between py-1 pt-1.5">
            <span className="text-emerald-200/70">Status:</span>
            <span className="font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              SUCCESSFUL
            </span>
          </div>
        </div>

        {/* Action Button in Emerald Green */}
        <button
          onClick={() => setSuccessfulWithdrawalModal(null)}
          className="mt-5 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-emerald-500/30 transition-all cursor-pointer"
        >
          View Withdrawal History
        </button>
      </div>
    </div>
  );
};
