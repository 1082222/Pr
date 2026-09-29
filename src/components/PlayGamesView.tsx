import React, { useState } from 'react';
import { useMatka } from '../context/MatkaContext';
import { GameMode, MarketId } from '../types/matka';
import { normalizePana, classifyPana } from '../utils/matkaEngine';
import { ShieldCheck, Sparkles, Check, AlertCircle } from 'lucide-react';

export const PlayGamesView: React.FC = () => {
  const {
    markets,
    selectedMarketForBet,
    setSelectedMarketForBet,
    rates,
    placeTicket,
    currentUser,
    setActiveTab,
  } = useMatka();

  const [gameMode, setGameMode] = useState<GameMode>('SINGLE_DIGIT');
  const [betType, setBetType] = useState<'OPEN' | 'CLOSE'>('OPEN');
  const [numberInput, setNumberInput] = useState<string>('7');
  const [amount, setAmount] = useState<number>(100);
  const [halfSangamAnk, setHalfSangamAnk] = useState<string>('4');
  const [fullSangamClosePana, setFullSangamClosePana] = useState<string>('356');
  const [validationError, setValidationError] = useState<string | null>(null);

  const activeMarket = selectedMarketForBet || markets[0];

  // Get current rate multiplier
  const getCurrentRate = (): number => {
    switch (gameMode) {
      case 'SINGLE_DIGIT':
        return rates.singleDigit;
      case 'JODI':
        return rates.jodi;
      case 'SINGLE_PANA':
        return rates.singlePana;
      case 'DOUBLE_PANA':
        return rates.doublePana;
      case 'TRIPLE_PANA':
        return rates.triplePana;
      case 'HALF_SANGAM':
        return rates.halfSangam;
      case 'FULL_SANGAM':
        return rates.fullSangam;
      default:
        return rates.singleDigit;
    }
  };

  const currentRate = getCurrentRate();
  const potentialWin = amount * currentRate;

  // Handle number input change with instant auto-validation
  const handleNumberChange = (val: string) => {
    setValidationError(null);
    const cleaned = val.replace(/\D/g, '');

    if (gameMode === 'SINGLE_DIGIT') {
      setNumberInput(cleaned.slice(0, 1));
    } else if (gameMode === 'JODI') {
      setNumberInput(cleaned.slice(0, 2));
    } else if (gameMode === 'SINGLE_PANA' || gameMode === 'DOUBLE_PANA' || gameMode === 'TRIPLE_PANA') {
      const sliced = cleaned.slice(0, 3);
      if (sliced.length === 3) {
        // Auto-sort digits according to Matka rules
        const sorted = normalizePana(sliced);
        setNumberInput(sorted);

        // Validate pana type
        const pType = classifyPana(sorted);
        if (gameMode === 'SINGLE_PANA' && pType !== 'SINGLE_PANA') {
          setValidationError(`Notice: ${sorted} is a ${pType.replace('_', ' ')}. Single Pana requires 3 distinct digits.`);
        } else if (gameMode === 'DOUBLE_PANA' && pType !== 'DOUBLE_PANA') {
          setValidationError(`Notice: ${sorted} is a ${pType.replace('_', ' ')}. Double Pana requires 2 identical digits.`);
        } else if (gameMode === 'TRIPLE_PANA' && pType !== 'TRIPLE_PANA') {
          setValidationError(`Notice: ${sorted} is a ${pType.replace('_', ' ')}. Triple Pana requires 3 identical digits.`);
        }
      } else {
        setNumberInput(sliced);
      }
    } else {
      setNumberInput(cleaned.slice(0, 3));
    }
  };

  // Quick Amount addition
  const addAmount = (plus: number) => {
    setAmount((prev) => Math.max(10, prev + plus));
  };

  // Place bet action
  const handlePlaceBet = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Final validation
    if (gameMode === 'SINGLE_DIGIT' && (!numberInput || numberInput.length !== 1)) {
      setValidationError('Please select a valid single digit (0 to 9).');
      return;
    }
    if (gameMode === 'JODI' && (!numberInput || numberInput.length !== 2)) {
      setValidationError('Please enter a valid 2-digit Jodi number (00 to 99).');
      return;
    }
    if (
      (gameMode === 'SINGLE_PANA' || gameMode === 'DOUBLE_PANA' || gameMode === 'TRIPLE_PANA') &&
      (!numberInput || numberInput.length !== 3)
    ) {
      setValidationError('Please enter a valid 3-digit Pana number.');
      return;
    }

    let finalSelection = numberInput;
    if (gameMode === 'HALF_SANGAM') {
      finalSelection = `${numberInput}-${halfSangamAnk}`;
    } else if (gameMode === 'FULL_SANGAM') {
      finalSelection = `${numberInput}-${fullSangamClosePana}`;
    }

    const res = placeTicket(
      activeMarket.id as MarketId,
      gameMode,
      finalSelection,
      amount,
      gameMode === 'JODI' || gameMode === 'FULL_SANGAM' ? undefined : betType
    );

    if (!res.success && res.error) {
      setValidationError(res.error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#4d0818] via-[#360510] to-[#25030b] border-2 border-[#d4af37]/60 p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#f3c623]" />
              Official Entry Slip
            </span>
            <h1 className="font-heading font-black italic text-xl sm:text-2xl text-white tracking-wide uppercase mt-0.5">
              Place Matka Prediction
            </h1>
            <p className="text-xs text-[#fbf3e4]/80">
              Guaranteed 100% full profit payout powered by Dhanalaxmi Matka Agency.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#1b0207] p-2.5 rounded-xl border border-[#d4af37]/40 shrink-0">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-[#d4af37]">Wallet Balance</div>
              <div className="font-num font-bold text-base text-[#fef08a]">
                ₹{currentUser.balance.toLocaleString()}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('account')}
              className="px-2.5 py-1.5 rounded-lg bg-[#54091a] hover:bg-[#6b0f24] text-xs font-bold text-white border border-[#d4af37]/40"
            >
              Add Points
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handlePlaceBet} className="space-y-5">
        {/* Step 1: Market Selector */}
        <div className="rounded-2xl bg-[#340510]/90 border border-[#d4af37]/50 p-4 sm:p-5 shadow-lg space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#fef08a]">
            1. Select Indian Matka Market
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {markets.map((m) => {
              const isSelected = activeMarket.id === m.id;
              return (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setSelectedMarketForBet(m)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#24030a] border-[#fef08a] shadow-md font-bold'
                      : 'bg-[#220309] text-[#fffdf7] border-[#d4af37]/30 hover:border-[#d4af37]'
                  }`}
                >
                  <div className="text-xs font-heading font-black italic truncate">{m.name}</div>
                  <div className="text-[10px] mt-0.5 opacity-80 font-medium">
                    {m.status === 'OPEN' ? '🟢 Open' : '🔴 ' + m.status}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Game Mode Selector */}
        <div className="rounded-2xl bg-[#340510]/90 border border-[#d4af37]/50 p-4 sm:p-5 shadow-lg space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#fef08a]">
            2. Choose Game Mode & Payout Rate
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'SINGLE_DIGIT', label: 'Single Digit', rate: `₹1 = ₹${rates.singleDigit}`, def: '7' },
              { id: 'JODI', label: 'Jodi (00-99)', rate: `₹1 = ₹${rates.jodi}`, def: '48' },
              { id: 'SINGLE_PANA', label: 'Single Pana', rate: `₹1 = ₹${rates.singlePana}`, def: '128' },
              { id: 'DOUBLE_PANA', label: 'Double Pana', rate: `₹1 = ₹${rates.doublePana}`, def: '228' },
              { id: 'TRIPLE_PANA', label: 'Triple Pana', rate: `₹1 = ₹${rates.triplePana}`, def: '333' },
              { id: 'HALF_SANGAM', label: 'Half Sangam', rate: `₹1 = ₹${rates.halfSangam}`, def: '128' },
              { id: 'FULL_SANGAM', label: 'Full Sangam', rate: `₹1 = ₹${rates.fullSangam}`, def: '128' },
            ].map((mode) => {
              const isSelected = gameMode === mode.id;
              return (
                <button
                  type="button"
                  key={mode.id}
                  onClick={() => {
                    setGameMode(mode.id as GameMode);
                    setNumberInput(mode.def);
                    setValidationError(null);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#5c091d] border-[#fef08a] text-white shadow-md ring-1 ring-[#fef08a]'
                      : 'bg-[#220309] border-[#d4af37]/30 text-[#fffdf7] hover:border-[#d4af37]'
                  }`}
                >
                  <div className="text-xs font-bold truncate text-[#fef08a]">{mode.label}</div>
                  <div className="text-[11px] font-num font-semibold text-[#f3c623] mt-0.5">{mode.rate}</div>
                </button>
              );
            })}
          </div>

          {/* Session Switcher (Open / Close) for Pana & Single */}
          {gameMode !== 'JODI' && gameMode !== 'FULL_SANGAM' && (
            <div className="pt-2 border-t border-[#d4af37]/20 flex items-center gap-3">
              <span className="text-xs font-bold text-[#fbf3e4]/80">Bet Session:</span>
              <div className="flex rounded-lg bg-[#1f0208] p-1 border border-[#d4af37]/40">
                <button
                  type="button"
                  onClick={() => setBetType('OPEN')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    betType === 'OPEN'
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#24030a]'
                      : 'text-[#fffdf7] hover:text-[#fef08a]'
                  }`}
                >
                  Open Session
                </button>
                <button
                  type="button"
                  onClick={() => setBetType('CLOSE')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    betType === 'CLOSE'
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#24030a]'
                      : 'text-[#fffdf7] hover:text-[#fef08a]'
                  }`}
                >
                  Close Session
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Number Selection & Interactive Keypad */}
        <div className="rounded-2xl bg-[#340510]/90 border border-[#d4af37]/50 p-4 sm:p-5 shadow-lg space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#fef08a]">
            3. Enter Prediction Number(s)
          </label>

          {gameMode === 'SINGLE_DIGIT' && (
            <div>
              <div className="text-xs text-[#fbf3e4]/80 mb-2">
                Click any lucky single digit (Haruf / Ank 0 to 9):
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    type="button"
                    key={digit}
                    onClick={() => setNumberInput(digit)}
                    className={`py-3 rounded-xl font-num font-black text-xl border transition-all ${
                      numberInput === digit
                        ? 'bg-gradient-to-b from-[#fef08a] to-[#d4af37] text-[#24030a] border-white shadow-lg scale-105'
                        : 'bg-[#200207] border-[#d4af37]/40 text-[#fffdf7] hover:border-[#fef08a]'
                    }`}
                  >
                    {digit}
                  </button>
                ))}
              </div>
            </div>
          )}

          {gameMode === 'JODI' && (
            <div className="space-y-3">
              <div className="text-xs text-[#fbf3e4]/80">
                Enter any 2-digit Jodi (00 to 99) or pick quick popular pairs:
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  maxLength={2}
                  value={numberInput}
                  onChange={(e) => handleNumberChange(e.target.value)}
                  placeholder="e.g. 48"
                  className="w-32 py-2.5 px-4 text-center font-num font-black text-2xl bg-[#1b0207] border-2 border-[#d4af37] rounded-xl text-[#fef08a] focus:outline-none focus:border-[#fef08a]"
                />
                <span className="text-xs text-[#d4af37]">
                  Selected Jodi: <strong className="text-white text-sm">{numberInput || '--'}</strong>
                </span>
              </div>

              {/* Popular Jodi quick chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['14', '28', '35', '48', '59', '63', '72', '80', '91', '05'].map((pair) => (
                  <button
                    type="button"
                    key={pair}
                    onClick={() => setNumberInput(pair)}
                    className="px-2.5 py-1 rounded bg-[#200207] hover:bg-[#54091a] border border-[#d4af37]/40 text-xs font-num font-bold text-[#fef08a]"
                  >
                    {pair}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(gameMode === 'SINGLE_PANA' || gameMode === 'DOUBLE_PANA' || gameMode === 'TRIPLE_PANA') && (
            <div className="space-y-3">
              <div className="text-xs text-[#fbf3e4]/80">
                Enter 3-digit Pana (Digits are automatically sorted in ascending order):
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <input
                  type="text"
                  maxLength={3}
                  value={numberInput}
                  onChange={(e) => handleNumberChange(e.target.value)}
                  placeholder="e.g. 128"
                  className="w-36 py-2.5 px-4 text-center font-num font-black text-2xl bg-[#1b0207] border-2 border-[#d4af37] rounded-xl text-[#fef08a] focus:outline-none focus:border-[#fef08a]"
                />
                <div className="text-xs text-[#d4af37] space-y-0.5">
                  <div>
                    Pana Digits: <span className="text-white font-num font-bold">{numberInput}</span>
                  </div>
                  <div>
                    Sum Modulo 10 (Single Ank):{' '}
                    <span className="text-[#fef08a] font-black font-num">
                      {numberInput.length === 3
                        ? (numberInput.split('').reduce((a, b) => a + parseInt(b, 10), 0) % 10)
                        : '*'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick sample buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {gameMode === 'SINGLE_PANA' &&
                  ['128', '149', '247', '348', '356', '279'].map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setNumberInput(p)}
                      className="px-2.5 py-1 rounded bg-[#200207] hover:bg-[#54091a] border border-[#d4af37]/40 text-xs font-num font-bold text-[#fef08a]"
                    >
                      {p}
                    </button>
                  ))}
                {gameMode === 'DOUBLE_PANA' &&
                  ['112', '228', '334', '445', '779', '889'].map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setNumberInput(p)}
                      className="px-2.5 py-1 rounded bg-[#200207] hover:bg-[#54091a] border border-[#d4af37]/40 text-xs font-num font-bold text-[#fef08a]"
                    >
                      {p}
                    </button>
                  ))}
                {gameMode === 'TRIPLE_PANA' &&
                  ['000', '111', '222', '333', '444', '555', '666', '777', '888', '999'].map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setNumberInput(p)}
                      className="px-2 py-1 rounded bg-[#200207] hover:bg-[#54091a] border border-[#d4af37]/40 text-xs font-num font-bold text-[#fef08a]"
                    >
                      {p}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {gameMode === 'HALF_SANGAM' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#200207] border border-[#d4af37]/30">
                <span className="text-xs font-bold text-[#d4af37]">Open Pana (3-Digits):</span>
                <input
                  type="text"
                  maxLength={3}
                  value={numberInput}
                  onChange={(e) => handleNumberChange(e.target.value)}
                  placeholder="128"
                  className="mt-1 w-full py-2 px-3 font-num font-bold text-center bg-[#150105] border border-[#d4af37]/50 rounded-lg text-[#fef08a]"
                />
              </div>
              <div className="p-3 rounded-xl bg-[#200207] border border-[#d4af37]/30">
                <span className="text-xs font-bold text-[#d4af37]">Close Single Ank (0-9):</span>
                <input
                  type="text"
                  maxLength={1}
                  value={halfSangamAnk}
                  onChange={(e) => setHalfSangamAnk(e.target.value.replace(/\D/g, '').slice(0, 1))}
                  placeholder="4"
                  className="mt-1 w-full py-2 px-3 font-num font-bold text-center bg-[#150105] border border-[#d4af37]/50 rounded-lg text-[#fef08a]"
                />
              </div>
            </div>
          )}

          {gameMode === 'FULL_SANGAM' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#200207] border border-[#d4af37]/30">
                <span className="text-xs font-bold text-[#d4af37]">Open Pana (3-Digits):</span>
                <input
                  type="text"
                  maxLength={3}
                  value={numberInput}
                  onChange={(e) => handleNumberChange(e.target.value)}
                  placeholder="128"
                  className="mt-1 w-full py-2 px-3 font-num font-bold text-center bg-[#150105] border border-[#d4af37]/50 rounded-lg text-[#fef08a]"
                />
              </div>
              <div className="p-3 rounded-xl bg-[#200207] border border-[#d4af37]/30">
                <span className="text-xs font-bold text-[#d4af37]">Close Pana (3-Digits):</span>
                <input
                  type="text"
                  maxLength={3}
                  value={fullSangamClosePana}
                  onChange={(e) => setFullSangamClosePana(normalizePana(e.target.value))}
                  placeholder="356"
                  className="mt-1 w-full py-2 px-3 font-num font-bold text-center bg-[#150105] border border-[#d4af37]/50 rounded-lg text-[#fef08a]"
                />
              </div>
            </div>
          )}

          {validationError && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 text-xs text-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Step 4: Amount & Quick Amount Buttons */}
        <div className="rounded-2xl bg-[#340510]/90 border border-[#d4af37]/50 p-4 sm:p-5 shadow-lg space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#fef08a]">
            4. Enter Entry Amount (Points)
          </label>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative">
              <span className="absolute left-3 top-2.5 font-bold text-[#d4af37]">₹</span>
              <input
                type="number"
                min={10}
                max={50000}
                value={amount}
                onChange={(e) => setAmount(Math.max(10, parseInt(e.target.value, 10) || 0))}
                className="w-full sm:w-44 py-2.5 pl-8 pr-4 font-num font-bold text-xl bg-[#1b0207] border-2 border-[#d4af37] rounded-xl text-[#fef08a] focus:outline-none focus:border-[#fef08a]"
              />
            </div>

            {/* Quick Amount Buttons: +50, +100, +500, +1000, +5000 */}
            <div className="flex flex-wrap items-center gap-2">
              {[50, 100, 500, 1000, 5000].map((plus) => (
                <button
                  type="button"
                  key={plus}
                  onClick={() => addAmount(plus)}
                  className="px-3 py-1.5 rounded-lg bg-[#200207] hover:bg-[#54091a] border border-[#d4af37]/50 text-xs font-num font-bold text-[#fef08a] transition-all cursor-pointer"
                >
                  +₹{plus.toLocaleString()}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setAmount(100)}
                className="px-2.5 py-1.5 rounded-lg bg-[#200207] text-[11px] text-slate-300 hover:text-white"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Live Potential Win Calculation Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#24030a] to-[#180105] border-2 border-[#d4af37] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#d4af37]">
              Live Calculated Potential Payout
            </div>
            <div className="font-num font-black text-2xl sm:text-3xl text-emerald-400 drop-shadow flex items-baseline gap-2">
              <span>₹{potentialWin.toLocaleString()}</span>
              <span className="text-xs font-normal text-[#d4af37] tracking-normal">
                (Rate: ₹1 = ₹{currentRate})
              </span>
            </div>
            <div className="text-[11px] text-[#fbf3e4]/70 mt-0.5">
              Market: <strong className="text-white">{activeMarket.name}</strong> • Selection:{' '}
              <strong className="text-[#fef08a]">{numberInput}</strong>
            </div>
          </div>

          <button
            type="submit"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#fef08a] via-[#d4af37] to-[#b8860b] hover:from-[#fff7ad] hover:to-[#d4af37] text-[#24030a] font-heading font-black italic text-base tracking-wide uppercase shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5 text-[#24030a]" />
            <span>Place Prediction Entry</span>
          </button>
        </div>
      </form>
    </div>
  );
};
