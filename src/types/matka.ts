export type MarketId =
  | 'time-bazar'
  | 'madhur-day'
  | 'milan-day'
  | 'rajdhani-day'
  | 'kalyan'
  | 'madhur-night'
  | 'milan-night'
  | 'kalyan-night';

export type MarketStatus = 'OPEN' | 'CLOSED' | 'DECLARED';

export interface MatkaMarket {
  id: MarketId;
  name: string;
  session: 'DAY' | 'NIGHT';
  status: MarketStatus;
  openPana: string; // e.g. "128" or "***"
  jodi: string; // e.g. "14" or "**"
  closePana: string; // e.g. "356" or "***"
  finalAnk: string; // e.g. "4"
  roundLabel: string; // e.g. "Round 1"
}

export type GameMode =
  | 'SINGLE_DIGIT' // Haruf (0-9) - Rate 1:9.5
  | 'JODI' // (00-99) - Rate 1:90
  | 'SINGLE_PANA' // 120 combos - Rate 1:140
  | 'DOUBLE_PANA' // 90 combos - Rate 1:280
  | 'TRIPLE_PANA' // 10 combos - Rate 1:700
  | 'HALF_SANGAM' // Open Pana + Close Ank or Open Ank + Close Pana - Rate 1:1000
  | 'FULL_SANGAM'; // Open Pana + Close Pana - Rate 1:10000

export interface AgencyRates {
  singleDigit: number; // 9.5
  jodi: number; // 90
  singlePana: number; // 140
  doublePana: number; // 280
  triplePana: number; // 700
  halfSangam: number; // 1000
  fullSangam: number; // 10000
}

export type TicketStatus = 'PENDING' | 'WON' | 'LOST' | 'CANCELLED';

export interface MatkaTicket {
  id: string; // e.g. "DLX-849201"
  marketId: MarketId;
  marketName: string;
  gameMode: GameMode;
  numberSelection: string; // e.g. "48", "128", "7"
  betType?: 'OPEN' | 'CLOSE';
  amount: number;
  rate: number;
  potentialWin: number;
  status: TicketStatus;
  wonAmount?: number;
  createdAt: string;
  cryptographicHash: string;
  userName: string;
}

export type WithdrawalStatus = 'SUCCESSFUL' | 'PENDING' | 'REJECTED' | 'CANCELLED';

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  method: 'UPI' | 'BANK';
  upiId?: string;
  bankAccount?: {
    accountNumber: string;
    ifsc: string;
    beneficiaryName: string;
    bankName: string;
  };
  status: WithdrawalStatus;
  referenceNumber: string;
  createdAt: string;
  completedAt?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  mobile: string;
  balance: number;
  totalBetsCount: number;
  totalWonAmount: number;
  totalBetAmount: number;
  isBlocked: boolean;
  joinedDate: string;
}
