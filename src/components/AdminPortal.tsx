import React, { useState } from 'react';
import { useMatka } from '../context/MatkaContext';
import { MarketId } from '../types/matka';
import { calculateAnkFromPana, normalizePana } from '../utils/matkaEngine';
import {
  ShieldAlert,
  Trophy,
  Users,
  FileSpreadsheet,
  Banknote,
  Sliders,
  CheckCircle2,
  XCircle,
  Search,
  Check,
  Zap,
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const {
    markets,
    tickets,
    withdrawals,
    users,
    rates,
    declareMarketResult,
    toggleMarketStatus,
    updateRates,
    updateUserBalance,
    toggleUserBlock,
    updateWithdrawalStatus,
    setIsAdminMode,
    setActiveTab,
  } = useMatka();

  const [adminTab, setAdminTab] = useState<
    'RESULTS' | 'USERS' | 'ENTRIES' | 'WITHDRAWALS' | 'RATES'
  >('RESULTS');

  // Results Declaration State
  const [selectedMarketId, setSelectedMarketId] = useState<MarketId>('time-bazar');
  const [openPanaInput, setOpenPanaInput] = useState<string>('128');
  const [closePanaInput, setClosePanaInput] = useState<string>('356');

  // User Search State
  const [userSearch, setUserSearch] = useState<string>('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editedBalance, setEditedBalance] = useState<number>(0);

  // Rate Editing State
  const [customRates, setCustomRates] = useState(rates);

  // Withdrawals Filter State
  const [wdrFilter, setWdrFilter] = useState<'ALL' | 'SUCCESSFUL' | 'PENDING' | 'REJECTED'>(
    'ALL'
  );

  const selectedMarket = markets.find((m) => m.id === selectedMarketId) || markets[0];
  const calculatedOpenAnk = calculateAnkFromPana(openPanaInput);
  const calculatedCloseAnk = calculateAnkFromPana(closePanaInput);
  const calculatedJodi = `${calculatedOpenAnk}${calculatedCloseAnk}`;

  const handleDeclare = (e: React.FormEvent) => {
    e.preventDefault();
    const sortedOpen = normalizePana(openPanaInput);
    const sortedClose = normalizePana(closePanaInput);
    declareMarketResult(selectedMarketId, sortedOpen, sortedClose);
  };

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    updateRates(customRates);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.id.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.mobile.includes(userSearch)
  );

  const filteredWithdrawals = withdrawals.filter((w) => {
    if (wdrFilter === 'ALL') return true;
    return w.status === wdrFilter;
  });

  // Calculate Market Liabilities for Entries Ledger
  const marketLiabilities = markets.map((m) => {
    const marketTickets = tickets.filter((t) => t.marketId === m.id && t.status === 'PENDING');
    const totalBet = marketTickets.reduce((sum, t) => sum + t.amount, 0);
    const totalLiability = marketTickets.reduce((sum, t) => sum + t.potentialWin, 0);
    return {
      market: m,
      ticketsCount: marketTickets.length,
      totalBet,
      totalLiability,
    };
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      {/* Admin Top Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#200207] via-[#380611] to-[#500818] border-2 border-[#d4af37] p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37] text-[#24030a] text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow">
              <ShieldAlert className="w-3.5 h-3.5" />
              Agency Master Console
            </span>
            <span className="text-xs text-emerald-400 font-bold">● System Authoritative</span>
          </div>
          <h1 className="font-heading font-black italic text-xl sm:text-2xl text-white tracking-wide uppercase mt-1">
            DHANALAXMI MATKA AGENCY ADMIN PORTAL
          </h1>
          <p className="text-xs text-[#fbf3e4]/80">
            Results declaration, patron balances, live liabilities, and instant payouts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('home')}
            className="px-3 py-1.5 rounded-lg bg-[#24030a] hover:bg-[#3d0614] border border-[#d4af37]/40 text-xs font-bold text-[#fef08a]"
          >
            Switch to Patron UI
          </button>
          <button
            onClick={() => {
              setIsAdminMode(false);
              setActiveTab('home');
            }}
            className="px-3 py-1.5 rounded-lg bg-rose-950 border border-rose-600/50 hover:bg-rose-900 text-xs font-bold text-rose-200"
          >
            Exit Admin
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#24030a] border border-[#d4af37]/40 overflow-x-auto">
        {[
          { id: 'RESULTS', label: '1. Declare Results & Payout', icon: Trophy },
          { id: 'USERS', label: '2. Users Management', icon: Users },
          { id: 'ENTRIES', label: '3. Entries & Liabilities', icon: FileSpreadsheet },
          { id: 'WITHDRAWALS', label: '4. Withdrawals Approval', icon: Banknote },
          { id: 'RATES', label: '5. Agency Multipliers', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                adminTab === tab.id
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#aa8010] text-[#24030a] shadow-md font-black'
                  : 'text-[#fffdf7] hover:bg-[#380611] hover:text-[#fef08a]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: RESULTS DECLARATION */}
      {adminTab === 'RESULTS' && (
        <div className="space-y-5">
          <form
            onSubmit={handleDeclare}
            className="rounded-2xl bg-[#2e040e] border-2 border-[#d4af37]/60 p-5 sm:p-6 shadow-xl space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#d4af37]/20">
              <div>
                <h2 className="font-heading font-black italic text-lg text-[#fef08a] uppercase">
                  Declare Result & Trigger Auto-Payout
                </h2>
                <p className="text-xs text-[#fbf3e4]/80">
                  Selecting Pana digits will automatically calculate Jodi, Ank, and credit all winning patron wallets.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#d4af37] font-bold">Market Status:</span>
                <button
                  type="button"
                  onClick={() =>
                    toggleMarketStatus(
                      selectedMarket.id,
                      selectedMarket.status === 'OPEN' ? 'CLOSED' : 'OPEN'
                    )
                  }
                  className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-all ${
                    selectedMarket.status === 'OPEN'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-950 border border-rose-500 text-rose-200'
                  }`}
                >
                  {selectedMarket.status === 'OPEN' ? 'Open (Click to Close)' : 'Closed (Click to Open)'}
                </button>
              </div>
            </div>

            {/* Select Target Market */}
            <div>
              <label className="block text-xs font-bold uppercase text-[#d4af37] mb-2">
                Select Market to Declare
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {markets.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setSelectedMarketId(m.id);
                      if (m.openPana !== '***') setOpenPanaInput(m.openPana);
                      if (m.closePana !== '***') setClosePanaInput(m.closePana);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedMarketId === m.id
                        ? 'bg-[#5c091d] border-[#fef08a] text-white shadow-md'
                        : 'bg-[#1b0207] border-[#d4af37]/30 text-white'
                    }`}
                  >
                    <div className="text-xs font-heading font-black italic truncate">{m.name}</div>
                    <div className="text-[10px] text-[#fef08a] mt-0.5">
                      Current: {m.openPana}-{m.jodi}-{m.closePana}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Pana & Live Result Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#1b0207] border border-[#d4af37]/40 space-y-2">
                <label className="block text-xs font-bold text-[#fef08a] uppercase">
                  Open Pana (3-Digits)
                </label>
                <input
                  type="text"
                  maxLength={3}
                  value={openPanaInput}
                  onChange={(e) => setOpenPanaInput(normalizePana(e.target.value))}
                  placeholder="128"
                  className="w-full py-2.5 px-3 rounded-lg bg-[#2e040e] border border-[#d4af37]/60 text-2xl font-num font-black text-center text-[#fef08a]"
                />
                <span className="text-[11px] text-[#d4af37] block text-center">
                  Open Single Ank: <strong className="text-white font-num text-sm">{calculatedOpenAnk}</strong>
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#1b0207] border border-[#d4af37]/40 space-y-2">
                <label className="block text-xs font-bold text-[#fef08a] uppercase">
                  Close Pana (3-Digits)
                </label>
                <input
                  type="text"
                  maxLength={3}
                  value={closePanaInput}
                  onChange={(e) => setClosePanaInput(normalizePana(e.target.value))}
                  placeholder="356"
                  className="w-full py-2.5 px-3 rounded-lg bg-[#2e040e] border border-[#d4af37]/60 text-2xl font-num font-black text-center text-[#fef08a]"
                />
                <span className="text-[11px] text-[#d4af37] block text-center">
                  Close Single Ank: <strong className="text-white font-num text-sm">{calculatedCloseAnk}</strong>
                </span>
              </div>
            </div>

            {/* Result Preview Box */}
            <div className="p-4 rounded-xl bg-[#200207] border border-[#d4af37]/50 text-center">
              <span className="text-[11px] uppercase font-bold text-[#d4af37] tracking-wider">
                Full Declaration Result for {selectedMarket.name}
              </span>
              <div className="font-num font-black text-3xl sm:text-4xl text-[#fef08a] tracking-widest mt-1">
                <span>{openPanaInput || '***'}</span>
                <span className="text-[#d4af37] mx-2">-</span>
                <span className="text-white bg-[#54091a] px-3 py-1 rounded border border-[#d4af37]">
                  {calculatedJodi}
                </span>
                <span className="text-[#d4af37] mx-2">-</span>
                <span>{closePanaInput || '***'}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#fef08a] to-[#aa8010] text-[#24030a] font-heading font-black italic text-sm uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 text-[#24030a]" />
              <span>Declare & Automatically Pay Winners</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: USERS MANAGEMENT */}
      {adminTab === 'USERS' && (
        <div className="rounded-2xl bg-[#2e040e] border border-[#d4af37]/40 shadow-xl overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading font-black italic text-base sm:text-lg text-[#fef08a] uppercase">
                Agency Patrons Registry
              </h2>
              <p className="text-xs text-[#fbf3e4]/70">
                Search patrons, audit balances, adjust points, and toggle account access.
              </p>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#d4af37] absolute left-3 top-2.5" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by name, ID or mobile..."
                className="py-2 pl-9 pr-3 rounded-xl bg-[#1b0207] border border-[#d4af37]/40 text-xs text-white focus:outline-none focus:border-[#fef08a] w-full sm:w-64"
              />
            </div>
          </div>

          <div className="divide-y divide-[#d4af37]/20 border border-[#d4af37]/30 rounded-xl overflow-hidden">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="p-4 bg-[#230209] hover:bg-[#340510] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-black text-sm text-white">{u.name}</span>
                    <span className="text-[10px] text-[#d4af37] font-mono">({u.id})</span>
                    {u.isBlocked && (
                      <span className="text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-500/50 font-bold uppercase">
                        Blocked
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#fbf3e4]/60 mt-0.5">
                    Mobile: {u.mobile} • Bets: {u.totalBetsCount} • Won: ₹{u.totalWonAmount.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Balance Display & Edit */}
                  {editingUserId === u.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editedBalance}
                        onChange={(e) => setEditedBalance(parseInt(e.target.value, 10) || 0)}
                        className="w-28 py-1 px-2 rounded bg-[#150105] border border-[#d4af37] text-xs font-num font-bold text-[#fef08a]"
                      />
                      <button
                        onClick={() => {
                          updateUserBalance(u.id, editedBalance);
                          setEditingUserId(null);
                        }}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUserId(null)}
                        className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="text-right">
                      <span className="text-[10px] text-[#d4af37] block uppercase font-bold">
                        Points
                      </span>
                      <span className="font-num font-black text-lg text-emerald-400">
                        ₹{u.balance.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {editingUserId !== u.id && (
                    <button
                      onClick={() => {
                        setEditingUserId(u.id);
                        setEditedBalance(u.balance);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#3a0612] hover:bg-[#54091a] border border-[#d4af37]/40 text-xs font-bold text-[#d4af37]"
                    >
                      Edit Points
                    </button>
                  )}

                  <button
                    onClick={() => toggleUserBlock(u.id)}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      u.isBlocked
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        : 'bg-rose-950 border-rose-500 text-rose-300'
                    }`}
                  >
                    {u.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ENTRIES LEDGER & LIABILITIES */}
      {adminTab === 'ENTRIES' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#2e040e] border border-[#d4af37]/40 p-5 shadow-xl space-y-4">
            <h2 className="font-heading font-black italic text-base sm:text-lg text-[#fef08a] uppercase">
              Live Market Exposure & Liabilities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {marketLiabilities.map((item) => (
                <div
                  key={item.market.id}
                  className="p-3.5 rounded-xl bg-[#1d0207] border border-[#d4af37]/30 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span className="font-heading truncate">{item.market.name}</span>
                    <span className="text-[10px] text-[#d4af37]">{item.ticketsCount} Bets</span>
                  </div>
                  <div className="text-[11px] text-[#fbf3e4]/60">
                    Total Volume: <strong className="text-white">₹{item.totalBet.toLocaleString()}</strong>
                  </div>
                  <div className="text-[11px] text-amber-300">
                    Max Liability: <strong className="text-rose-400 font-num">₹{item.totalLiability.toLocaleString()}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Bets Stream */}
          <div className="rounded-2xl bg-[#2e040e] border border-[#d4af37]/40 shadow-xl overflow-hidden p-5 space-y-3">
            <h3 className="font-heading font-black italic text-sm text-[#fef08a] uppercase">
              All Tickets Ledger ({tickets.length} total entries)
            </h3>
            <div className="divide-y divide-white/10 rounded-xl bg-[#180206] border border-[#d4af37]/30 max-h-96 overflow-y-auto">
              {tickets.map((t) => (
                <div key={t.id} className="p-3 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-num font-bold text-white mr-2">{t.id}</span>
                    <span className="text-[#fef08a] font-semibold">{t.marketName}</span>
                    <span className="text-slate-400 ml-2">
                      ({t.gameMode.replace('_', ' ')}: {t.numberSelection})
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-num font-bold text-emerald-400">
                      ₹{t.amount} → ₹{t.potentialWin}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-black uppercase ${
                        t.status === 'WON'
                          ? 'bg-emerald-600 text-white'
                          : t.status === 'PENDING'
                          ? 'bg-amber-600/30 text-amber-300'
                          : 'bg-rose-950 text-rose-300'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: WITHDRAWALS APPROVAL */}
      {adminTab === 'WITHDRAWALS' && (
        <div className="rounded-2xl bg-[#2e040e] border border-[#d4af37]/40 shadow-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading font-black italic text-base sm:text-lg text-[#fef08a] uppercase">
                Agency Payout Requests Console
              </h2>
              <p className="text-xs text-[#fbf3e4]/70">
                Review and approve instant payout transfers. Status is displayed in Emerald Green upon approval.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex gap-1.5">
              {['ALL', 'SUCCESSFUL', 'PENDING', 'REJECTED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setWdrFilter(st as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    wdrFilter === st
                      ? 'bg-[#d4af37] text-[#24030a] font-black'
                      : 'bg-[#1b0207] text-white hover:bg-[#340510]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-[#d4af37]/20 border border-[#d4af37]/30 rounded-xl overflow-hidden">
            {filteredWithdrawals.map((w) => (
              <div
                key={w.id}
                className="p-4 bg-[#230209] hover:bg-[#340510] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-num font-black text-sm text-white">{w.id}</span>
                    <span className="text-xs text-[#fef08a] font-bold">• {w.userName}</span>
                    <span className="text-[10px] text-[#fbf3e4]/50">({w.createdAt})</span>
                  </div>
                  <div className="text-xs text-[#d4af37] mt-1">
                    Destination:{' '}
                    <strong className="text-white">
                      {w.method === 'UPI'
                        ? `UPI: ${w.upiId}`
                        : `${w.bankAccount?.bankName} A/C ${w.bankAccount?.accountNumber} (IFSC: ${w.bankAccount?.ifsc})`}
                    </strong>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">Ref: {w.referenceNumber}</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-num font-black text-xl text-emerald-400">
                      ₹{w.amount.toLocaleString()}
                    </span>
                  </div>

                  {/* Status Badge */}
                  {w.status === 'SUCCESSFUL' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-[11px] uppercase tracking-wider shadow-md">
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>SUCCESSFUL</span>
                    </span>
                  ) : w.status === 'PENDING' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase tracking-wider">
                      PENDING
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold uppercase tracking-wider">
                      {w.status}
                    </span>
                  )}

                  {/* Admin Action Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateWithdrawalStatus(w.id, 'SUCCESSFUL')}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                      title="Mark Successful"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateWithdrawalStatus(w.id, 'REJECTED')}
                      className="px-2.5 py-1 rounded bg-rose-950 hover:bg-rose-900 border border-rose-600 text-rose-300 text-xs font-bold"
                      title="Reject"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AGENCY RATES & SETTINGS */}
      {adminTab === 'RATES' && (
        <form
          onSubmit={handleSaveRates}
          className="rounded-2xl bg-[#2e040e] border border-[#d4af37]/40 shadow-xl p-5 space-y-5"
        >
          <div>
            <h2 className="font-heading font-black italic text-base sm:text-lg text-[#fef08a] uppercase">
              Configure Payout Multipliers (Full Profit Guarantee)
            </h2>
            <p className="text-xs text-[#fbf3e4]/70">
              Adjust return rates for ₹1 bet across all traditional game formats.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-[#1b0207] border border-[#d4af37]/30 space-y-1">
              <label className="block text-xs font-bold text-[#d4af37]">Single Digit (1 : X)</label>
              <input
                type="number"
                step="0.1"
                value={customRates.singleDigit}
                onChange={(e) =>
                  setCustomRates({ ...customRates, singleDigit: parseFloat(e.target.value) || 0 })
                }
                className="w-full py-2 px-3 rounded-lg bg-[#2e040e] border border-[#d4af37]/50 font-num font-bold text-white text-sm"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#1b0207] border border-[#d4af37]/30 space-y-1">
              <label className="block text-xs font-bold text-[#d4af37]">Jodi (1 : X)</label>
              <input
                type="number"
                value={customRates.jodi}
                onChange={(e) =>
                  setCustomRates({ ...customRates, jodi: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full py-2 px-3 rounded-lg bg-[#2e040e] border border-[#d4af37]/50 font-num font-bold text-white text-sm"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#1b0207] border border-[#d4af37]/30 space-y-1">
              <label className="block text-xs font-bold text-[#d4af37]">Single Pana (1 : X)</label>
              <input
                type="number"
                value={customRates.singlePana}
                onChange={(e) =>
                  setCustomRates({ ...customRates, singlePana: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full py-2 px-3 rounded-lg bg-[#2e040e] border border-[#d4af37]/50 font-num font-bold text-white text-sm"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#1b0207] border border-[#d4af37]/30 space-y-1">
              <label className="block text-xs font-bold text-[#d4af37]">Double Pana (1 : X)</label>
              <input
                type="number"
                value={customRates.doublePana}
                onChange={(e) =>
                  setCustomRates({ ...customRates, doublePana: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full py-2 px-3 rounded-lg bg-[#2e040e] border border-[#d4af37]/50 font-num font-bold text-white text-sm"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#1b0207] border border-[#d4af37]/30 space-y-1">
              <label className="block text-xs font-bold text-[#d4af37]">Triple Pana (1 : X)</label>
              <input
                type="number"
                value={customRates.triplePana}
                onChange={(e) =>
                  setCustomRates({ ...customRates, triplePana: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full py-2 px-3 rounded-lg bg-[#2e040e] border border-[#d4af37]/50 font-num font-bold text-white text-sm"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#1b0207] border border-[#d4af37]/30 space-y-1">
              <label className="block text-xs font-bold text-[#d4af37]">Half Sangam (1 : X)</label>
              <input
                type="number"
                value={customRates.halfSangam}
                onChange={(e) =>
                  setCustomRates({ ...customRates, halfSangam: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full py-2 px-3 rounded-lg bg-[#2e040e] border border-[#d4af37]/50 font-num font-bold text-white text-sm"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#1b0207] border border-[#d4af37]/30 space-y-1">
              <label className="block text-xs font-bold text-[#d4af37]">Full Sangam (1 : X)</label>
              <input
                type="number"
                value={customRates.fullSangam}
                onChange={(e) =>
                  setCustomRates({ ...customRates, fullSangam: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full py-2 px-3 rounded-lg bg-[#2e040e] border border-[#d4af37]/50 font-num font-bold text-white text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8010] text-[#24030a] font-heading font-black italic text-xs uppercase tracking-wider shadow"
          >
            Save Agency Multipliers
          </button>
        </form>
      )}
    </div>
  );
};
