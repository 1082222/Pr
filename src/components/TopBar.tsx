import React from 'react';
import { useMatka } from '../context/MatkaContext';
import { ShieldAlert, Wallet, Sparkles } from 'lucide-react';
import lakshmiAvatar from '../assets/images/lakshmi_portrait_1790513816399.jpg';

export const TopBar: React.FC = () => {
  const { currentUser, setActiveTab, isAdminMode, setIsAdminMode } = useMatka();

  return (
    <header className="sticky top-0 z-40 w-full shadow-xl bg-[#380611] border-b border-[#d4af37]/40">
      {/* Main Top Bar */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Left: Avatar + Stacked Title */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="relative">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#d4af37] via-[#fef08a] to-[#b8860b] shadow-md group-hover:scale-105 transition-transform duration-200">
              <img
                src={lakshmiAvatar}
                alt="Goddess Sri Maha Dhanalaxmi"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#380611]" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-black italic tracking-wide text-sm sm:text-base md:text-lg text-white group-hover:text-[#fef08a] transition-colors leading-tight">
                DHANALAXMI MATKA AGENCY
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-[#d4af37] font-semibold tracking-wider">
              <span>100% Full Profit</span>
              <span className="text-[#d4af37]/50">•</span>
              <span>Fast Result</span>
            </div>
          </div>
        </div>

        {/* Right: Wallet Badge & Admin Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Points Wallet Badge */}
          <button
            onClick={() => setActiveTab('account')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#500818] to-[#6b0f24] border border-[#d4af37]/50 hover:border-[#d4af37] text-white shadow-sm hover:shadow transition-all group"
            title="Open Wallet Account"
          >
            <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#fef08a]">
              <Wallet className="w-3.5 h-3.5 text-[#fef08a]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase tracking-wider text-[#d4af37] font-bold">
                Points
              </span>
              <span className="font-num font-bold text-xs sm:text-sm text-[#fffdf7] group-hover:text-[#fef08a] transition-colors">
                ₹{currentUser.balance.toLocaleString()}
              </span>
            </div>
          </button>

          {/* Admin Mode Switch Button */}
          <button
            onClick={() => {
              const nextMode = !isAdminMode;
              setIsAdminMode(nextMode);
              if (nextMode) setActiveTab('admin');
            }}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              isAdminMode
                ? 'bg-[#d4af37] text-[#380611] border-[#fef08a] shadow-md font-black'
                : 'bg-[#2a040d] text-[#d4af37] border-[#d4af37]/40 hover:bg-[#440715]'
            }`}
            title="Toggle Admin Control Console"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAdminMode ? 'Admin Active' : 'Admin Panel'}</span>
            <span className="sm:hidden">{isAdminMode ? 'Admin' : 'Admin'}</span>
          </button>
        </div>
      </div>

      {/* Ticker Strip: Burgundy bar with gold text */}
      <div className="w-full bg-[#200208] border-t border-[#d4af37]/20 py-1 px-4 overflow-hidden relative flex items-center">
        <div className="flex items-center gap-2 whitespace-nowrap animate-marquee text-[11px] sm:text-xs font-semibold text-[#fef08a] tracking-wide">
          <Sparkles className="w-3 h-3 text-[#f3c623] inline-block" />
          <span>
            !! WELCOME TO DHANALAXMI MATKA AGENCY !! Jodi: ₹1 = 90 | Single Pana: ₹1 = 140 | Double Pana: ₹1 = 280 | Triple Pana: ₹1 = 700 | Half Sangam: ₹1 = 1,000 | Full Sangam: ₹1 = 10,000 !! 100% Full Profit Agency Guaranteed !!
          </span>
          <span className="mx-4 text-[#d4af37]">•</span>
          <Sparkles className="w-3 h-3 text-[#f3c623] inline-block" />
          <span>
            Fast Live Satta Matka Results • Goddess Dhanalaxmi Prosperity & Blessings • India&apos;s No. 1 Trusted Matka Agency
          </span>
        </div>
      </div>
    </header>
  );
};
