import React, { useState } from 'react';
import { LOGO_IMG } from '../data/initialData';
import { toBengaliDigits } from '../utils/bengali';
import { Language, AppUser } from '../types';
import { translations } from '../data/translations';
import { ADMIN_EMAIL } from '../firebase';

interface HeaderProps {
  cartCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCart: () => void;
  onOpenAdminPin: () => void;
  onSelectCategory: (category: string) => void;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
  onOpenOrderTracking: () => void;
  whatsAppPhone: string;
  lang: Language;
  onToggleLang: () => void;
  currentUser: AppUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  searchQuery,
  onSearchChange,
  onOpenCart,
  onOpenAdminPin,
  onSelectCategory,
  activeNavTab,
  setActiveNavTab,
  onOpenOrderTracking,
  whatsAppPhone,
  lang,
  onToggleLang,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const cleanPhone = whatsAppPhone.replace(/[^0-9]/g, '');
  const t = translations[lang];
  const isAdmin = currentUser?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase();

  const navLinks = [
    { id: 'all', label: t.allProducts, category: 'all' },
    { id: 'deals', label: t.flashDeals, category: 'all' },
    { id: 'grocery', label: t.grocery, category: 'grocery' },
    { id: 'fashion', label: t.fashion, category: 'fashion' },
    { id: 'electronics', label: t.electronics, category: 'electronics' },
    { id: 'tracking', label: t.orderTracking, action: onOpenOrderTracking },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[#bccac0]/30 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Top Navbar Row */}
      <div className="h-20 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand & Hotline */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => {
              setActiveNavTab('all');
              onSelectCategory('all');
            }}
          >
            <img
              alt="সহজ শপ লোগো"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#006948]/20"
              src={LOGO_IMG}
            />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl text-[#006948] tracking-tight font-extrabold leading-none">
                {t.siteTitle}
              </span>
              <span className="text-[11px] text-[#3d4a42] font-semibold tracking-wide leading-none mt-1">
                {t.siteSubtitle}
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-[#f2f3ff] rounded-full border border-[#bccac0]/40">
            <span className="material-symbols-outlined text-[#006948] text-[18px]">support_agent</span>
            <span className="text-[12px] text-[#3d4a42] font-medium">
              {t.hotline}
            </span>
          </div>
        </div>

        {/* Center Search Bar (Desktop) */}
        <div className="flex-1 max-w-xl mx-2 hidden md:block">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-[#6d7a72] text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full h-11 pl-10 pr-24 bg-[#faf8ff] rounded-xl border border-[#bccac0] focus:border-[#006948] focus:bg-white focus:outline-none text-[14px] text-[#131b2e] placeholder:text-[#6d7a72] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-20 text-[#6d7a72] hover:text-[#131b2e] p-1"
                title="Clear"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
            <button
              type="button"
              className="absolute right-1.5 h-8 px-4 bg-[#006948] hover:bg-[#00855d] text-white rounded-lg text-xs font-bold transition-colors"
            >
              {t.searchBtn}
            </button>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Language Switcher Pill */}
          <button
            type="button"
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#006948] border border-[#bccac0]/40 text-xs font-bold transition-all"
            title="ভাষা পরিবর্তন / Switch Language"
          >
            <span className="material-symbols-outlined text-[16px]">translate</span>
            <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>

          {/* Mobile search toggle */}
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="md:hidden p-2 text-[#3d4a42] hover:bg-[#f2f3ff] rounded-xl transition-colors"
            aria-label="Search"
          >
            <span className="material-symbols-outlined text-[22px]">
              {isMobileSearchOpen ? 'close' : 'search'}
            </span>
          </button>

          {/* WhatsApp Direct Order Button */}
          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              lang === 'bn'
                ? 'আসসালামু আলাইকুম সহজ শপ! আমি অর্ডার বা পণ্য সংক্রান্ত তথ্যের জন্য যোগাযোগ করছি।'
                : 'Hello Shohoj Shop! I am contacting you for product details & ordering.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 bg-[#00873c] text-white rounded-xl text-xs sm:text-sm font-bold hover:opacity-95 transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span className="hidden lg:inline">{t.waOrder}</span>
          </a>

          {/* Admin Panel Button - ONLY visible to msbablu87@gmail.com */}
          {isAdmin && (
            <button
              type="button"
              onClick={onOpenAdminPin}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-[#e2e7ff] text-[#131b2e] rounded-xl border border-[#bccac0]/50 text-xs sm:text-sm font-semibold hover:bg-[#dae2fd] transition-colors"
              title={t.adminPanel}
            >
              <span className="material-symbols-outlined text-[18px] text-[#006948]">
                admin_panel_settings
              </span>
              <span className="hidden sm:inline">{t.adminPanel}</span>
            </button>
          )}

          {/* User Authentication & Login Button - Placed right next to Admin Button */}
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#131b2e] border border-[#bccac0]/40 transition-all cursor-pointer"
                title="ব্যবহারকারী মেনু"
              >
                <div className="w-7 h-7 rounded-full bg-[#006948] text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden md:inline text-xs font-bold truncate max-w-[100px]">
                  {currentUser.displayName}
                </span>
                <span className="material-symbols-outlined text-[18px] text-[#6d7a72]">
                  expand_more
                </span>
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#bccac0]/30 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-4 py-2.5 border-b border-[#bccac0]/20">
                    <p className="text-xs font-bold text-[#131b2e] truncate">
                      {currentUser.displayName}
                    </p>
                    <p className="text-[11px] text-[#6d7a72] truncate font-mono">
                      {currentUser.email}
                    </p>
                    {currentUser.phoneNumber && (
                      <p className="text-[10px] text-[#006948] mt-0.5">
                        📞 {currentUser.phoneNumber}
                      </p>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenOrderTracking();
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-[#131b2e] hover:bg-[#f2f3ff] flex items-center gap-2.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[#006948] text-[18px]">
                        local_shipping
                      </span>
                      <span>{t.orderTracking}</span>
                    </button>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenAdminPin();
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-[#131b2e] hover:bg-[#f2f3ff] flex items-center gap-2.5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[#006948] text-[18px]">
                          admin_panel_settings
                        </span>
                        <span>{t.adminPanel}</span>
                      </button>
                    )}
                  </div>

                  <div className="pt-1 border-t border-[#bccac0]/20">
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-[#ba1a1a] hover:bg-[#ffdad6]/40 flex items-center gap-2.5 font-bold transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span>{lang === 'bn' ? 'লগআউট করুন' : 'Sign Out'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
              title="লগইন বা একাউন্ট তৈরি করুন"
            >
              <span className="material-symbols-outlined text-[18px]">account_circle</span>
              <span>
                {lang === 'bn' ? 'লগইন' : 'Sign In'}
              </span>
            </button>
          )}

          {/* Shopping Bag Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] transition-colors active:scale-95"
            aria-label="Shopping bag"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#fd761a] text-white text-[11px] font-bold flex items-center justify-center shadow-sm animate-pulse">
                {lang === 'bn' ? toBengaliDigits(cartCount) : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search expanded */}
      {isMobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-[#bccac0]/20 bg-[#faf8ff]">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-[#6d7a72] text-[18px]">
              search
            </span>
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full h-10 pl-9 pr-10 bg-white rounded-xl border border-[#bccac0] focus:border-[#006948] focus:outline-none text-xs text-[#131b2e]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2 text-[#6d7a72] p-1"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Secondary Category Navigation (Desktop) */}
      <div className="bg-white border-t border-[#bccac0]/20 hidden md:block">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-6 lg:gap-8 overflow-x-auto py-2.5 no-scrollbar">
            {navLinks.map((link) => {
              const isActive = activeNavTab === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => {
                    setActiveNavTab(link.id);
                    if (link.action) {
                      link.action();
                    } else if (link.category) {
                      onSelectCategory(link.category);
                    }
                  }}
                  className={`whitespace-nowrap pb-1 text-sm font-semibold transition-all border-b-2 ${
                    isActive
                      ? 'text-[#006948] font-bold border-[#006948]'
                      : 'text-[#3d4a42] hover:text-[#131b2e] border-transparent hover:border-[#bccac0]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
