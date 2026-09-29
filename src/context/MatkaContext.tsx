import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AgencyRates,
  GameMode,
  MarketId,
  MarketStatus,
  MatkaMarket,
  MatkaTicket,
  UserAccount,
  WithdrawalRequest,
} from '../types/matka';
import {
  INITIAL_MARKETS,
  INITIAL_RATES,
  INITIAL_TICKETS,
  INITIAL_USERS,
  INITIAL_WITHDRAWALS,
} from '../data/initialData';
import {
  calculateAnkFromPana,
  generateCryptographicTicketId,
} from '../utils/matkaEngine';
import confetti from 'canvas-confetti';

interface MatkaContextType {
  markets: MatkaMarket[];
  rates: AgencyRates;
  tickets: MatkaTicket[];
  withdrawals: WithdrawalRequest[];
  users: UserAccount[];
  currentUser: UserAccount;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  activeTab: 'home' | 'play' | 'tickets' | 'results' | 'account' | 'admin';
  setActiveTab: (tab: 'home' | 'play' | 'tickets' | 'results' | 'account' | 'admin') => void;
  selectedMarketForBet: MatkaMarket | null;
  setSelectedMarketForBet: (market: MatkaMarket | null) => void;
  
  // Betting
  placeTicket: (
    marketId: MarketId,
    gameMode: GameMode,
    numberSelection: string,
    amount: number,
    betType?: 'OPEN' | 'CLOSE'
  ) => { success: boolean; ticket?: MatkaTicket; error?: string };
  
  // Deposit & Withdrawal
  depositPoints: (amount: number, reference: string) => void;
  requestWithdrawal: (
    amount: number,
    method: 'UPI' | 'BANK',
    details: { upiId?: string; bankAccount?: any }
  ) => Promise<{ success: boolean; withdrawal?: WithdrawalRequest; error?: string }>;
  
  // Last receipt modal
  receiptModalTicket: MatkaTicket | null;
  setReceiptModalTicket: (ticket: MatkaTicket | null) => void;
  
  // Withdrawal success modal
  successfulWithdrawalModal: WithdrawalRequest | null;
  setSuccessfulWithdrawalModal: (req: WithdrawalRequest | null) => void;
  
  // Admin Operations
  declareMarketResult: (
    marketId: MarketId,
    openPana: string,
    closePana: string
  ) => { updatedWinnersCount: number; totalPaidOut: number };
  toggleMarketStatus: (marketId: MarketId, status: MarketStatus) => void;
  updateRates: (newRates: AgencyRates) => void;
  updateUserBalance: (userId: string, newBalance: number) => void;
  toggleUserBlock: (userId: string) => void;
  updateWithdrawalStatus: (withdrawalId: string, status: 'SUCCESSFUL' | 'PENDING' | 'REJECTED' | 'CANCELLED') => void;
  
  // Audio & celebration
  triggerConfetti: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const MatkaContext = createContext<MatkaContextType | undefined>(undefined);

export const MatkaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or fallback to defaults
  const [markets, setMarkets] = useState<MatkaMarket[]>(() => {
    const saved = localStorage.getItem('dlx_markets');
    return saved ? JSON.parse(saved) : INITIAL_MARKETS;
  });

  const [rates, setRates] = useState<AgencyRates>(() => {
    const saved = localStorage.getItem('dlx_rates');
    return saved ? JSON.parse(saved) : INITIAL_RATES;
  });

  const [tickets, setTickets] = useState<MatkaTicket[]>(() => {
    const saved = localStorage.getItem('dlx_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem('dlx_withdrawals');
    return saved ? JSON.parse(saved) : INITIAL_WITHDRAWALS;
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('dlx_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return localStorage.getItem('dlx_admin_mode') === 'true';
  });

  const [activeTab, setActiveTab] = useState<'home' | 'play' | 'tickets' | 'results' | 'account' | 'admin'>('home');
  const [selectedMarketForBet, setSelectedMarketForBet] = useState<MatkaMarket | null>(INITIAL_MARKETS[0]);
  const [receiptModalTicket, setReceiptModalTicket] = useState<MatkaTicket | null>(null);
  const [successfulWithdrawalModal, setSuccessfulWithdrawalModal] = useState<WithdrawalRequest | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentUser = users[0]; // Active patron

  // Persistence
  useEffect(() => {
    localStorage.setItem('dlx_markets', JSON.stringify(markets));
  }, [markets]);

  useEffect(() => {
    localStorage.setItem('dlx_rates', JSON.stringify(rates));
  }, [rates]);

  useEffect(() => {
    localStorage.setItem('dlx_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('dlx_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem('dlx_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('dlx_admin_mode', isAdminMode.toString());
  }, [isAdminMode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#f3c623', '#059669', '#10b981', '#ffffff'],
      });
    } catch {
      // Fallback
    }
  };

  // Place Ticket handler
  const placeTicket = (
    marketId: MarketId,
    gameMode: GameMode,
    numberSelection: string,
    amount: number,
    betType: 'OPEN' | 'CLOSE' = 'OPEN'
  ) => {
    if (currentUser.isBlocked) {
      return { success: false, error: 'Your account is suspended. Please contact agency desk.' };
    }

    if (currentUser.balance < amount) {
      return {
        success: false,
        error: `Insufficient balance! You have ₹${currentUser.balance.toLocaleString()}, required ₹${amount.toLocaleString()}. Please add points.`,
      };
    }

    const market = markets.find((m) => m.id === marketId);
    if (!market) {
      return { success: false, error: 'Selected market is currently unavailable.' };
    }

    if (market.status === 'CLOSED') {
      return { success: false, error: `${market.name} is currently closed for predictions.` };
    }

    // Determine rate based on game mode
    let rate = rates.singleDigit;
    if (gameMode === 'JODI') rate = rates.jodi;
    else if (gameMode === 'SINGLE_PANA') rate = rates.singlePana;
    else if (gameMode === 'DOUBLE_PANA') rate = rates.doublePana;
    else if (gameMode === 'TRIPLE_PANA') rate = rates.triplePana;
    else if (gameMode === 'HALF_SANGAM') rate = rates.halfSangam;
    else if (gameMode === 'FULL_SANGAM') rate = rates.fullSangam;

    const potentialWin = amount * rate;
    const { id, hash } = generateCryptographicTicketId();

    const newTicket: MatkaTicket = {
      id,
      marketId,
      marketName: market.name,
      gameMode,
      numberSelection,
      betType,
      amount,
      rate,
      potentialWin,
      status: 'PENDING',
      createdAt: 'Today, Round 1',
      cryptographicHash: hash,
      userName: currentUser.name,
    };

    // Deduct user balance
    setUsers((prevUsers) =>
      prevUsers.map((u, idx) =>
        idx === 0
          ? {
              ...u,
              balance: u.balance - amount,
              totalBetAmount: u.totalBetAmount + amount,
              totalBetsCount: u.totalBetsCount + 1,
            }
          : u
      )
    );

    setTickets((prev) => [newTicket, ...prev]);
    setReceiptModalTicket(newTicket);
    showToast(`Entry Placed Successfully! Ticket ID: ${newTicket.id}`);

    return { success: true, ticket: newTicket };
  };

  // Deposit handler
  const depositPoints = (amount: number, reference: string) => {
    setUsers((prev) =>
      prev.map((u, idx) =>
        idx === 0 ? { ...u, balance: u.balance + amount } : u
      )
    );
    showToast(`₹${amount.toLocaleString()} Added to Wallet! Ref: ${reference}`);
  };

  // Request Withdrawal handler
  const requestWithdrawal = async (
    amount: number,
    method: 'UPI' | 'BANK',
    details: { upiId?: string; bankAccount?: any }
  ) => {
    if (amount <= 0) {
      return { success: false, error: 'Enter a valid withdrawal amount.' };
    }
    if (currentUser.balance < amount) {
      return {
        success: false,
        error: `Insufficient balance! Wallet balance is ₹${currentUser.balance.toLocaleString()}.`,
      };
    }

    const refNum = `${method === 'UPI' ? 'UPI' : 'IMPS'}/DLX/${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const newReq: WithdrawalRequest = {
      id: `WDR-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      amount,
      method,
      upiId: details.upiId,
      bankAccount: details.bankAccount,
      status: 'SUCCESSFUL', // Instant direct payout simulation
      referenceNumber: refNum,
      createdAt: new Date().toISOString().split('T')[0],
      completedAt: 'Instant Direct Transfer Completed',
    };

    // Deduct balance
    setUsers((prev) =>
      prev.map((u, idx) =>
        idx === 0 ? { ...u, balance: u.balance - amount } : u
      )
    );

    setWithdrawals((prev) => [newReq, ...prev]);
    setSuccessfulWithdrawalModal(newReq);
    triggerConfetti();

    return { success: true, withdrawal: newReq };
  };

  // Declare Results and Auto-Payout in Admin
  const declareMarketResult = (marketId: MarketId, openPana: string, closePana: string) => {
    const openAnk = calculateAnkFromPana(openPana);
    const closeAnk = calculateAnkFromPana(closePana);
    const jodiResult = `${openAnk}${closeAnk}`;

    // Update market state
    setMarkets((prev) =>
      prev.map((m) => {
        if (m.id === marketId) {
          return {
            ...m,
            openPana,
            closePana,
            jodi: jodiResult,
            finalAnk: openAnk,
            status: 'DECLARED',
          };
        }
        return m;
      })
    );

    // Auto-check tickets for this market
    let winnersCount = 0;
    let totalPaid = 0;

    setTickets((prevTickets) =>
      prevTickets.map((t) => {
        if (t.marketId !== marketId || t.status !== 'PENDING') return t;

        let isWinner = false;

        if (t.gameMode === 'SINGLE_DIGIT') {
          if (t.betType === 'OPEN' && t.numberSelection === openAnk) isWinner = true;
          if (t.betType === 'CLOSE' && t.numberSelection === closeAnk) isWinner = true;
        } else if (t.gameMode === 'JODI') {
          if (t.numberSelection === jodiResult) isWinner = true;
        } else if (t.gameMode === 'SINGLE_PANA' || t.gameMode === 'DOUBLE_PANA' || t.gameMode === 'TRIPLE_PANA') {
          if (t.betType === 'OPEN' && t.numberSelection === openPana) isWinner = true;
          if (t.betType === 'CLOSE' && t.numberSelection === closePana) isWinner = true;
        } else if (t.gameMode === 'HALF_SANGAM') {
          // Half Sangam: e.g. Open Pana + Close Ank or Open Ank + Close Pana
          const combo1 = `${openPana}-${closeAnk}`;
          const combo2 = `${openAnk}-${closePana}`;
          if (t.numberSelection === combo1 || t.numberSelection === combo2) isWinner = true;
        } else if (t.gameMode === 'FULL_SANGAM') {
          const fullCombo = `${openPana}-${closePana}`;
          if (t.numberSelection === fullCombo) isWinner = true;
        }

        if (isWinner) {
          winnersCount++;
          totalPaid += t.potentialWin;
          return {
            ...t,
            status: 'WON',
            wonAmount: t.potentialWin,
          };
        } else {
          return {
            ...t,
            status: 'LOST',
          };
        }
      })
    );

    if (totalPaid > 0) {
      // Credit primary user
      setUsers((prev) =>
        prev.map((u, idx) =>
          idx === 0
            ? {
                ...u,
                balance: u.balance + totalPaid,
                totalWonAmount: u.totalWonAmount + totalPaid,
              }
            : u
        )
      );
      triggerConfetti();
      showToast(`Results Declared! Paid out ₹${totalPaid.toLocaleString()} to ${winnersCount} Winning Slip(s)!`);
    } else {
      showToast(`Results Declared for ${marketId.toUpperCase()}! No winning tickets in this round.`);
    }

    return { updatedWinnersCount: winnersCount, totalPaidOut: totalPaid };
  };

  const toggleMarketStatus = (marketId: MarketId, status: MarketStatus) => {
    setMarkets((prev) =>
      prev.map((m) => (m.id === marketId ? { ...m, status } : m))
    );
    showToast(`Market status updated to ${status}`);
  };

  const updateRates = (newRates: AgencyRates) => {
    setRates(newRates);
    showToast('Agency payout rates successfully updated.');
  };

  const updateUserBalance = (userId: string, newBalance: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, balance: newBalance } : u))
    );
    showToast('Patron balance updated.');
  };

  const toggleUserBlock = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u
      )
    );
    showToast('User status updated.');
  };

  const updateWithdrawalStatus = (
    withdrawalId: string,
    status: 'SUCCESSFUL' | 'PENDING' | 'REJECTED' | 'CANCELLED'
  ) => {
    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === withdrawalId ? { ...w, status, completedAt: status === 'SUCCESSFUL' ? 'Instant Transfer Approved' : undefined } : w
      )
    );
    showToast(`Withdrawal marked as ${status}`);
  };

  return (
    <MatkaContext.Provider
      value={{
        markets,
        rates,
        tickets,
        withdrawals,
        users,
        currentUser,
        isAdminMode,
        setIsAdminMode,
        activeTab,
        setActiveTab,
        selectedMarketForBet,
        setSelectedMarketForBet,
        placeTicket,
        depositPoints,
        requestWithdrawal,
        receiptModalTicket,
        setReceiptModalTicket,
        successfulWithdrawalModal,
        setSuccessfulWithdrawalModal,
        declareMarketResult,
        toggleMarketStatus,
        updateRates,
        updateUserBalance,
        toggleUserBlock,
        updateWithdrawalStatus,
        triggerConfetti,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </MatkaContext.Provider>
  );
};

export const useMatka = () => {
  const context = useContext(MatkaContext);
  if (!context) {
    throw new Error('useMatka must be used within a MatkaProvider');
  }
  return context;
};
