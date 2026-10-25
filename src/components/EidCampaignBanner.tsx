import React, { useState, useEffect } from 'react';
import { HERO_BANNER_IMG } from '../data/initialData';
import { toBengaliDigits } from '../utils/bengali';
import { Language } from '../types';
import { translations } from '../data/translations';

interface EidCampaignBannerProps {
  onCopyCoupon: (code: string) => void;
  onOpenAdminPin: () => void;
  onScrollToProducts: () => void;
  lang: Language;
  isAdmin?: boolean;
}

export const EidCampaignBanner: React.FC<EidCampaignBannerProps> = ({
  onCopyCoupon,
  onOpenAdminPin,
  onScrollToProducts,
  lang,
  isAdmin = false,
}) => {
  const t = translations[lang];

  // Countdown state: 8 hours, 45 minutes, 19 seconds
  const [totalSeconds, setTotalSeconds] = useState(8 * 3600 + 45 * 60 + 19);

  useEffect(() => {
    const timer = setInterval(() => {
      setTotalSeconds((prev) => (prev > 0 ? prev - 1 : 24 * 3600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const padZero = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  const formatDigit = (num: number) => {
    const str = padZero(num);
    return lang === 'bn' ? toBengaliDigits(str) : str;
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#f2f3ff] py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-[1360px] mx-auto overflow-hidden rounded-2xl bg-gradient-to-r from-[#006948] via-[#00855d] to-[#006b2e] text-white shadow-xl">
        {/* Decorative radial ambient backdrops */}
        <div className="absolute -right-20 -bottom-24 w-96 h-96 rounded-full bg-[#fd761a]/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-12 -top-12 w-64 h-64 rounded-full bg-[#85f8c4]/20 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-5 sm:p-8 lg:p-10">
          {/* Left Column: Headlines & Action CTAs */}
          <div className="lg:col-span-8 space-y-4">
            {/* Pill Banner */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full">
              <span className="material-symbols-outlined text-[18px] text-[#ffdbca] animate-pulse">
                local_fire_department
              </span>
              <span className="text-xs sm:text-sm text-[#ffdbca] font-bold tracking-wide">
                {t.megaOfferTag}
              </span>
              <span className="text-white/40">•</span>
              <span className="text-[11px] sm:text-xs text-white font-medium">
                {t.codTag}
              </span>
            </div>

            {/* Display Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight font-extrabold leading-tight">
              {t.bannerTitle} <br className="hidden sm:inline" />
              <span className="text-[#ffb690] drop-shadow-sm">{t.bannerSubtitle}</span>
            </h1>

            <p className="text-sm sm:text-base text-white/90 max-w-2xl leading-relaxed">
              {t.bannerDesc}
            </p>

            {/* Countdown timer & Coupon Code row */}
            <div className="pt-1 flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Countdown badge */}
              <div className="flex items-center gap-2 bg-[#283044]/60 backdrop-blur-md px-3.5 py-2 rounded-xl text-white shadow-sm border border-white/10">
                <span className="material-symbols-outlined text-[#fd761a] text-[18px]">timer</span>
                <div className="flex items-center gap-1 text-sm font-bold">
                  <span className="bg-[#85f8c4] text-[#002114] px-1.5 py-0.5 rounded text-xs font-mono font-extrabold">
                    {formatDigit(hours)}
                  </span>
                  :
                  <span className="bg-[#85f8c4] text-[#002114] px-1.5 py-0.5 rounded text-xs font-mono font-extrabold">
                    {formatDigit(minutes)}
                  </span>
                  :
                  <span className="bg-[#85f8c4] text-[#002114] px-1.5 py-0.5 rounded text-xs font-mono font-extrabold">
                    {formatDigit(seconds)}
                  </span>
                </div>
                <span className="text-xs text-white/80 ml-1">{t.timeLeft}</span>
              </div>

              {/* Coupon code with copy */}
              <button
                type="button"
                onClick={() => onCopyCoupon('SHOHOJ25')}
                className="group flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md px-3.5 py-2 rounded-xl text-white transition-all active:scale-95 border border-white/20"
                title="Click to copy coupon code"
              >
                <span className="material-symbols-outlined text-[18px] text-[#66ff8e]">
                  confirmation_number
                </span>
                <span className="text-xs text-white/90 font-medium">{t.couponLabel}</span>
                <span className="text-sm font-mono font-extrabold tracking-wider text-[#85f8c4]">
                  SHOHOJ25
                </span>
                <span className="material-symbols-outlined text-[16px] text-white/70 group-hover:text-white">
                  content_copy
                </span>
              </button>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onScrollToProducts}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#fd761a] text-white text-sm font-bold hover:brightness-110 active:scale-95 shadow-lg transition-transform"
              >
                <span>{t.buyNow}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={onOpenAdminPin}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm font-semibold transition-colors backdrop-blur-md border border-white/20"
                >
                  <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                  <span>{t.adminLogin}</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Showcase Card Graphic */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm p-3 border border-white/20">
              <img
                src={HERO_BANNER_IMG}
                alt="Shohoj Shop Campaign Showcase"
                className="w-full h-56 sm:h-64 object-cover rounded-xl shadow-md transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-5 left-5 right-5 bg-[#283044]/90 backdrop-blur-md p-3 rounded-xl text-white shadow-lg flex items-center justify-between border border-white/15">
                <div>
                  <p className="text-xs text-[#85f8c4] font-semibold">{t.dealCampaign}</p>
                  <p className="text-sm font-bold">{t.dealOffer}</p>
                </div>
                <span className="w-10 h-10 rounded-full bg-[#006948] flex items-center justify-center text-white shrink-0 shadow">
                  <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
