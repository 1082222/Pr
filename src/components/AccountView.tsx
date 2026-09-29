import React, { useState } from 'react';
import { useMatka } from '../context/MatkaContext';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Copy,
  Check,
  Building2,
  QrCode,
  ShieldCheck,
  History,
  AlertCircle,
} from 'lucide-react';

export const AccountView: React.FC = () => {
  const { currentUser, depositPoints, requestWithdrawal, withdrawals } = useMatka();
  const [subTab, setSubTab] = useState<'OVERVIEW' | 'DEPOSIT' | 'WITHDRAW' | 'HISTORY'>('OVERVIEW');

  // Deposit Form State
  const [depositAmount, setDepositAmount] = useState<number>(1000);
  const [depositMethod, setDepositMethod] = useState<'PHONEPE' | 'GPAY' | 'UPI_QR'>('UPI_QR');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Withdrawal Form State
  const [withdrawAmount, setWithdrawAmount] = useState<number>(2000);
  const [withdrawMethod, setWithdrawMethod] = useState<'UPI' | 'BANK'>('UPI');
  const [upiId, setUpiId] = useState<string>('rajesh.varma@okaxis');
  const [bankAccNumber, setBankAccNumber] = useState<string>('50100492817291');
  const [bankIfsc, setBankIfsc] = useState<string>('HDFC0001234');
  const [bankBeneficiary, setBankBeneficiary] = useState<string>('Rajesh Varma');
  const [bankName, setBankName] = useState<string>('HDFC Bank Ltd');
  const [formError, setFormError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const agencyUpi = 'dhanalaxmi.agency@icici';

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(agencyUpi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleConfirmDeposit = () => {
    const fakeRef = `UPI/DEP/${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    depositPoints(depositAmount, fakeRef);
    setSubTab('OVERVIEW');
  };

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (withdrawAmount <= 0) {
      setFormError('Please enter a valid withdrawal amount.');
      return;
    }
    if (withdrawAmount > currentUser.balance) {
      setFormError(
        `Insufficient wallet points. Your balance is ₹${currentUser.balance.toLocaleString()}.`
      );
      return;
    }

    if (withdrawMethod === 'UPI') {
      if (!upiId || !upiId.includes('@')) {
        setFormError('Please enter a valid UPI ID (e.g. yourname@okhdfcbank).');
        return;
      }
    } else {
      if (!bankAccNumber || !bankIfsc || !bankBeneficiary) {
        setFormError('Please fill all bank account details.');
        return;
      }
    }

    setIsProcessing(true);

    // Simulate instant payout processing
    setTimeout(async () => {
      await requestWithdrawal(withdrawAmount, withdrawMethod, {
        upiId: withdrawMethod === 'UPI' ? upiId : undefined,
        bankAccount:
          withdrawMethod === 'BANK'
            ? {
                accountNumber: bankAccNumber,
                ifsc: bankIfsc,
                beneficiaryName: bankBeneficiary,
                bankName,
              }
            : undefined,
      });
      setIsProcessing(false);
      setSubTab('HISTORY');
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* 1. Patron Wallet Header Card */}
      <div className="rounded-2xl bg-gradient-to-r from-[#4d0818] via-[#350510] to-[#200207] border-2 border-[#d4af37]/60 p-5 sm:p-6 shadow-2xl relative overflow-hidden gold-border-glow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#d4af37]">
                Patron ID: {currentUser.id}
              </span>
              <span className="text-xs text-[#10b981] bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40 font-bold">
                ✓ Verified Account
              </span>
            </div>
            <h1 className="font-heading font-black italic text-xl sm:text-2xl text-white tracking-wide uppercase mt-1">
              {currentUser.name}
            </h1>
            <p className="text-xs text-[#fbf3e4]/70">
              Mobile: {currentUser.mobile} • Joined: {currentUser.joinedDate}
            </p>
          </div>

          {/* Points Balance Box */}
          <div className="bg-[#180206] p-4 rounded-xl border border-[#d4af37]/50 shadow-inner sm:min-w-[220px] text-right">
            <span className="text-[11px] uppercase font-bold text-[#d4af37] block">
              Available Wallet Points
            </span>
            <div className="font-num font-black text-3xl sm:text-4xl text-[#fef08a] mt-0.5 tracking-tight">
              ₹{currentUser.balance.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
              Instant 0% Payout Guaranteed
            </span>
          </div>
        </div>

        {/* Quick Action Navigation Tabs */}
        <div className="mt-5 pt-4 border-t border-[#d4af37]/20 flex flex-wrap gap-2">
          <button
            onClick={() => setSubTab('OVERVIEW')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              subTab === 'OVERVIEW'
                ? 'bg-[#d4af37] text-[#24030a] font-black'
                : 'bg-[#24030a] text-[#fffdf7] hover:bg-[#3d0614]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSubTab('DEPOSIT')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              subTab === 'DEPOSIT'
                ? 'bg-[#d4af37] text-[#24030a] font-black'
                : 'bg-[#24030a] text-[#fffdf7] hover:bg-[#3d0614]'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span>Deposit Points</span>
          </button>
          <button
            onClick={() => setSubTab('WITHDRAW')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              subTab === 'WITHDRAW'
                ? 'bg-emerald-600 text-white font-black'
                : 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 hover:bg-emerald-900'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Withdraw Points</span>
          </button>
          <button
            onClick={() => setSubTab('HISTORY')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              subTab === 'HISTORY'
                ? 'bg-[#d4af37] text-[#24030a] font-black'
                : 'bg-[#24030a] text-[#fffdf7] hover:bg-[#3d0614]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Withdrawal History</span>
          </button>
        </div>
      </div>

      {/* 2. SUBTAB: OVERVIEW */}
      {subTab === 'OVERVIEW' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-[#2a040d] border border-[#d4af37]/40 shadow">
              <span className="text-[11px] uppercase font-bold text-[#d4af37]">Total Bets Placed</span>
              <div className="font-num font-bold text-2xl text-white mt-1">
                {currentUser.totalBetsCount} Slips
              </div>
              <span className="text-[11px] text-[#fbf3e4]/60">Total: ₹{currentUser.totalBetAmount.toLocaleString()}</span>
            </div>

            <div className="p-4 rounded-xl bg-[#2a040d] border border-[#d4af37]/40 shadow">
              <span className="text-[11px] uppercase font-bold text-emerald-400">Total Winnings Won</span>
              <div className="font-num font-bold text-2xl text-emerald-400 mt-1">
                ₹{currentUser.totalWonAmount.toLocaleString()}
              </div>
              <span className="text-[11px] text-[#fbf3e4]/60">100% Full Profit rates credited</span>
            </div>

            <div className="p-4 rounded-xl bg-[#2a040d] border border-[#d4af37]/40 shadow">
              <span className="text-[11px] uppercase font-bold text-[#d4af37]">Agency Trust Status</span>
              <div className="text-base font-bold text-[#fef08a] mt-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                <span>Premium VIP Patron</span>
              </div>
              <span className="text-[11px] text-[#fbf3e4]/60">Instant automated settlement</span>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="p-5 rounded-2xl bg-[#360510] border border-[#d4af37]/40 shadow-lg space-y-3">
            <h3 className="font-heading font-black italic text-base text-[#fef08a] uppercase">
              Fast Agency Cashier
            </h3>
            <p className="text-xs text-[#fbf3e4]/80">
              Deposit points instantly using Google Pay, PhonePe, or UPI QR. Withdraw your winnings directly to your bank account or UPI with immediate processing.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setSubTab('DEPOSIT')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8010] text-[#24030a] font-bold text-xs uppercase tracking-wider shadow"
              >
                + Add Deposit Points
              </button>
              <button
                onClick={() => setSubTab('WITHDRAW')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow"
              >
                Withdraw to Bank / UPI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. SUBTAB: DEPOSIT */}
      {subTab === 'DEPOSIT' && (
        <div className="rounded-2xl bg-[#2e040e] border-2 border-[#d4af37]/50 p-5 sm:p-6 shadow-xl space-y-5">
          <div>
            <h2 className="font-heading font-black italic text-lg sm:text-xl text-[#fef08a] uppercase">
              Add Wallet Points (Instant Deposit)
            </h2>
            <p className="text-xs text-[#fbf3e4]/80 mt-0.5">
              Scan UPI QR code or pay via PhonePe / Google Pay. Points are added immediately.
            </p>
          </div>

          {/* Quick Preset Amounts */}
          <div>
            <label className="block text-xs font-bold uppercase text-[#d4af37] mb-2">
              Select Deposit Amount (Points)
            </label>
            <div className="flex flex-wrap gap-2">
              {[200, 500, 1000, 2000, 5000, 10000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setDepositAmount(amt)}
                  className={`px-4 py-2 rounded-xl text-xs font-num font-bold transition-all ${
                    depositAmount === amt
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#24030a] shadow-md scale-105'
                      : 'bg-[#1b0207] text-[#fffdf7] border border-[#d4af37]/30 hover:border-[#d4af37]'
                  }`}
                >
                  ₹{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Deposit Method Selector */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'UPI_QR', label: 'UPI QR Code', icon: QrCode },
              { id: 'PHONEPE', label: 'PhonePe', icon: ArrowDownLeft },
              { id: 'GPAY', label: 'Google Pay', icon: ArrowDownLeft },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setDepositMethod(m.id as any)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    depositMethod === m.id
                      ? 'bg-[#500818] border-[#fef08a] text-[#fef08a] font-bold'
                      : 'bg-[#1b0207] border-[#d4af37]/30 text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 mx-auto mb-1 text-[#f3c623]" />
                  <span className="text-xs font-semibold">{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* UPI Payment Box */}
          <div className="p-4 rounded-xl bg-[#1a0207] border border-[#d4af37]/40 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-28 h-28 bg-white p-2 rounded-xl border-2 border-[#d4af37] shrink-0 flex flex-col items-center justify-center">
              <QrCode className="w-20 h-20 text-[#24030a]" />
              <span className="text-[8px] font-bold text-black uppercase">Scan to Pay</span>
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="text-xs font-bold text-[#d4af37] uppercase">Official Agency UPI ID</div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="font-mono text-sm sm:text-base font-bold text-white bg-[#2e040e] px-3 py-1 rounded-lg border border-[#d4af37]/40">
                  {agencyUpi}
                </span>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="p-1.5 rounded-lg bg-[#500818] border border-[#d4af37]/50 text-[#fef08a] hover:bg-[#6b0f24]"
                >
                  {copiedUpi ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-[#fbf3e4]/70">
                Deposit ₹{depositAmount.toLocaleString()} to credit your Dhanalaxmi balance immediately.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleConfirmDeposit}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#fef08a] to-[#b8860b] text-[#24030a] font-heading font-black italic text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            Confirm & Add ₹{depositAmount.toLocaleString()} Points
          </button>
        </div>
      )}

      {/* 4. SUBTAB: WITHDRAWAL SYSTEM */}
      {subTab === 'WITHDRAW' && (
        <form
          onSubmit={handleWithdrawalSubmit}
          className="rounded-2xl bg-[#2e040e] border-2 border-emerald-600/60 p-5 sm:p-6 shadow-xl space-y-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                <h2 className="font-heading font-black italic text-lg sm:text-xl text-emerald-100 uppercase">
                  Instant Points Withdrawal
                </h2>
              </div>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                0% deduction • 100% full profit transfer to your UPI or Bank Account.
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-[#d4af37] uppercase font-bold block">Available</span>
              <span className="font-num font-bold text-emerald-400 text-base">
                ₹{currentUser.balance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold uppercase text-[#d4af37] mb-1.5">
              Withdrawal Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 font-bold text-[#d4af37]">₹</span>
              <input
                type="number"
                min={100}
                max={currentUser.balance}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(parseInt(e.target.value, 10) || 0)}
                className="w-full py-2.5 pl-8 pr-4 font-num font-bold text-xl bg-[#1b0207] border-2 border-emerald-500/60 rounded-xl text-emerald-300 focus:outline-none focus:border-emerald-400"
              />
            </div>
            {/* Quick buttons */}
            <div className="flex gap-2 mt-2">
              {[500, 1000, 2000, 5000].map((quick) => (
                <button
                  key={quick}
                  type="button"
                  onClick={() => setWithdrawAmount(quick)}
                  className="px-2.5 py-1 rounded bg-[#1b0207] hover:bg-[#3d0614] border border-[#d4af37]/30 text-xs font-num font-bold text-[#fef08a]"
                >
                  ₹{quick.toLocaleString()}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setWithdrawAmount(currentUser.balance)}
                className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-500/40 text-xs font-bold text-emerald-300"
              >
                Withdraw All (₹{currentUser.balance.toLocaleString()})
              </button>
            </div>
          </div>

          {/* Destination Method Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase text-[#d4af37] mb-2">
              Select Payout Channel
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setWithdrawMethod('UPI')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                  withdrawMethod === 'UPI'
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                    : 'bg-[#1b0207] text-[#fffdf7] border-[#d4af37]/30'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Instant UPI Address</span>
              </button>

              <button
                type="button"
                onClick={() => setWithdrawMethod('BANK')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                  withdrawMethod === 'BANK'
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                    : 'bg-[#1b0207] text-[#fffdf7] border-[#d4af37]/30'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Bank Account (IMPS)</span>
              </button>
            </div>
          </div>

          {/* UPI Field */}
          {withdrawMethod === 'UPI' ? (
            <div className="p-4 rounded-xl bg-[#1b0207] border border-emerald-500/40 space-y-2">
              <label className="block text-xs font-bold text-emerald-200">
                Your UPI Virtual ID (VPA)
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. mobile@upi or username@okaxis"
                className="w-full py-2.5 px-3 rounded-lg bg-[#2e040e] border border-emerald-500/50 text-emerald-100 font-mono text-sm focus:outline-none focus:border-emerald-400"
              />
              <span className="text-[11px] text-[#fbf3e4]/60 block">
                Compatible with PhonePe, Google Pay, Paytm, BHIM UPI.
              </span>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#1b0207] border border-emerald-500/40 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-200 mb-1">
                    Beneficiary Name
                  </label>
                  <input
                    type="text"
                    value={bankBeneficiary}
                    onChange={(e) => setBankBeneficiary(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg bg-[#2e040e] border border-emerald-500/50 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-200 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg bg-[#2e040e] border border-emerald-500/50 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-200 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={bankAccNumber}
                    onChange={(e) => setBankAccNumber(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg bg-[#2e040e] border border-emerald-500/50 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-200 mb-1">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={bankIfsc}
                    onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                    className="w-full py-2 px-3 rounded-lg bg-[#2e040e] border border-emerald-500/50 text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {formError && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 text-xs text-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Emerald Green Action Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-black italic text-sm uppercase tracking-wider shadow-lg hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>
              {isProcessing
                ? 'Processing Direct Transfer...'
                : `Confirm Instant Payout of ₹${withdrawAmount.toLocaleString()}`}
            </span>
          </button>
        </form>
      )}

      {/* 5. SUBTAB: WITHDRAWAL HISTORY */}
      {subTab === 'HISTORY' && (
        <div className="rounded-2xl bg-[#2e040e] border border-[#d4af37]/40 shadow-xl overflow-hidden">
          <div className="p-4 bg-[#230209] border-b border-[#d4af37]/30 flex items-center justify-between">
            <div>
              <h2 className="font-heading font-black italic text-base text-[#fef08a] uppercase">
                Withdrawal Payout History
              </h2>
              <p className="text-xs text-[#fbf3e4]/70">
                Official transaction ledger with verified status
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/40">
              100% Payout Rate
            </span>
          </div>

          <div className="divide-y divide-[#d4af37]/15">
            {withdrawals.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#fbf3e4]/60">
                No past withdrawals recorded yet.
              </div>
            ) : (
              withdrawals.map((w) => (
                <div
                  key={w.id}
                  className="p-4 hover:bg-[#3d0614]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-num font-bold text-sm text-white">{w.id}</span>
                      <span className="text-[11px] text-[#fbf3e4]/50">• {w.createdAt}</span>
                    </div>
                    <div className="text-xs text-[#d4af37] font-medium">
                      Destination:{' '}
                      <strong className="text-white">
                        {w.method === 'UPI' ? w.upiId : `${w.bankAccount?.bankName} (${w.bankAccount?.accountNumber})`}
                      </strong>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Ref: {w.referenceNumber}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <span className="font-num font-black text-xl text-emerald-400">
                        ₹{w.amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-[#fbf3e4]/60 block">Direct Payout</span>
                    </div>

                    {/* MANDATORY EMERALD GREEN SUCCESSFUL BADGE */}
                    {w.status === 'SUCCESSFUL' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-[11px] uppercase tracking-wider shadow-md">
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>SUCCESSFUL</span>
                      </span>
                    ) : w.status === 'PENDING' ? (
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase tracking-wider">
                        PENDING
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold uppercase tracking-wider">
                        {w.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
