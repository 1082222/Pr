import React from 'react';
import { MatkaProvider, useMatka } from './context/MatkaContext';
import { TopBar } from './components/TopBar';
import { HomeView } from './components/HomeView';
import { PlayGamesView } from './components/PlayGamesView';
import { MyTicketsView } from './components/MyTicketsView';
import { ResultsView } from './components/ResultsView';
import { AccountView } from './components/AccountView';
import { AdminPortal } from './components/AdminPortal';
import { BottomNav } from './components/BottomNav';
import { DigitalReceiptModal } from './components/DigitalReceiptModal';
import { WithdrawalSuccessModal } from './components/WithdrawalSuccessModal';
import { Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, toastMessage } = useMatka();

  return (
    <div className="min-h-screen bg-[#24030a] text-[#fffdf7] flex flex-col justify-between selection:bg-[#d4af37] selection:text-[#24030a]">
      {/* Sticky Top Bar */}
      <TopBar />

      {/* Dynamic Main Body Content */}
      <main className="max-w-6xl w-full mx-auto px-3 sm:px-6 pt-5 pb-10 flex-1">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'play' && <PlayGamesView />}
        {activeTab === 'tickets' && <MyTicketsView />}
        {activeTab === 'results' && <ResultsView />}
        {activeTab === 'account' && <AccountView />}
        {activeTab === 'admin' && <AdminPortal />}
      </main>

      {/* Global Agency Footer */}
      <footer className="w-full bg-[#180206] border-t border-[#d4af37]/30 py-6 mb-14 text-center text-xs text-[#fbf3e4]/60 space-y-2">
        <div className="flex items-center justify-center gap-2 text-[#d4af37] font-heading font-black italic tracking-wide text-sm uppercase">
          <Sparkles className="w-4 h-4 text-[#f3c623]" />
          <span>DHANALAXMI MATKA AGENCY</span>
          <Sparkles className="w-4 h-4 text-[#f3c623]" />
        </div>
        <p className="max-w-md mx-auto text-[11px] px-4">
          India&apos;s No. 1 Trusted Matka Agency • 100% Full Profit Agency • Goddess Dhanalaxmi Prosperity & Blessings • Fast Live Satta Matka Results
        </p>
        <div className="text-[10px] text-[#d4af37]/70 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Cryptographically Sealed Entry Slips & Instant Bank / UPI Settlements</span>
        </div>
        <div className="text-[10px] text-[#fbf3e4]/40 pt-1">
          © {new Date().getFullYear()} Dhanalaxmi Matka Agency. All Rights Reserved.
        </div>
      </footer>

      {/* Bottom Sticky Navigation */}
      <BottomNav />

      {/* Modals */}
      <DigitalReceiptModal />
      <WithdrawalSuccessModal />

      {/* Global Floating Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top duration-200">
          <div className="bg-[#24030a] border-2 border-[#d4af37] text-[#fef08a] px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold gold-border-glow">
            <HeartHandshake className="w-4 h-4 text-[#f3c623] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <MatkaProvider>
      <MainContent />
    </MatkaProvider>
  );
}
