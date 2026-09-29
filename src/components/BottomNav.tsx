import React from 'react';
import { useMatka } from '../context/MatkaContext';
import { Home, Zap, Ticket, Trophy, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useMatka();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'play', label: 'Play Games', icon: Zap },
    { id: 'tickets', label: 'My Tickets', icon: Ticket },
    { id: 'results', label: 'Results', icon: Trophy },
    { id: 'account', label: 'Account', icon: User },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#28040d]/95 backdrop-blur-md border-t border-[#d4af37]/40 shadow-2xl">
      <div className="max-w-md md:max-w-xl mx-auto px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'text-[#fef08a] scale-105'
                  : 'text-[#fbf3e4]/60 hover:text-white'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#24030a] shadow-lg'
                    : 'bg-transparent text-current'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-[10px] font-bold tracking-tight mt-0.5 whitespace-nowrap ${
                  isActive ? 'text-[#fef08a] font-black' : 'text-current'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
