import React from 'react';
import { AppUser } from '../types';

interface MobileBottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenWhatsApp: () => void;
  onOpenCategories: () => void;
  onOpenOffers: () => void;
  onOpenAuth: () => void;
  currentUser: AppUser | null;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenWhatsApp,
  onOpenCategories,
  onOpenOffers,
  onOpenAuth,
  currentUser,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#bccac0]/30 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      <div className="flex justify-around items-center h-16 px-1">
        {/* Home */}
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
            activeTab === 'home'
              ? 'text-[#006948] font-bold'
              : 'text-[#3d4a42] hover:text-[#131b2e]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">home</span>
          <span className="text-[10px] mt-0.5">হোম</span>
        </button>

        {/* Categories */}
        <button
          type="button"
          onClick={onOpenCategories}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
            activeTab === 'categories'
              ? 'text-[#006948] font-bold'
              : 'text-[#3d4a42] hover:text-[#131b2e]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">grid_view</span>
          <span className="text-[10px] mt-0.5">ক্যাটাগরি</span>
        </button>

        {/* Offers */}
        <button
          type="button"
          onClick={onOpenOffers}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
            activeTab === 'offers'
              ? 'text-[#006948] font-bold'
              : 'text-[#3d4a42] hover:text-[#131b2e]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">local_offer</span>
          <span className="text-[10px] mt-0.5">অফার</span>
        </button>

        {/* WhatsApp */}
        <button
          type="button"
          onClick={onOpenWhatsApp}
          className="flex flex-col items-center justify-center min-w-[56px] py-1 text-[#00873c] hover:text-[#006b2e] transition-colors"
        >
          <span className="material-symbols-outlined text-[22px]">chat</span>
          <span className="text-[10px] font-bold mt-0.5">হোয়াটসঅ্যাপ</span>
        </button>

        {/* User Account / Login */}
        <button
          type="button"
          onClick={onOpenAuth}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-colors ${
            currentUser
              ? 'text-[#006948] font-bold'
              : 'text-[#3d4a42] hover:text-[#131b2e]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">
            {currentUser ? 'account_circle' : 'login'}
          </span>
          <span className="text-[10px] mt-0.5 truncate max-w-[50px]">
            {currentUser ? currentUser.displayName.split(' ')[0] : 'লগইন'}
          </span>
        </button>
      </div>
    </nav>
  );
};
