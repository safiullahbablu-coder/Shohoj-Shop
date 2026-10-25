import React from 'react';
import { LOGO_IMG } from '../data/initialData';
import { Language, AppUser } from '../types';
import { translations } from '../data/translations';
import { ADMIN_EMAIL } from '../firebase';

interface TrustBadgesAndFooterProps {
  whatsAppPhone: string;
  onOpenAdminPin: () => void;
  onSelectCategory: (cat: string) => void;
  onOpenOrderTracking: () => void;
  lang: Language;
  currentUser?: AppUser | null;
}

export const TrustBadgesAndFooter: React.FC<TrustBadgesAndFooterProps> = ({
  whatsAppPhone,
  onOpenAdminPin,
  onSelectCategory,
  onOpenOrderTracking,
  lang,
  currentUser,
}) => {
  const cleanPhone = whatsAppPhone.replace(/[^0-9]/g, '');
  const t = translations[lang];
  const isAdmin = currentUser?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase();

  return (
    <footer className="w-full bg-white border-t border-[#bccac0]/40 mt-12">
      {/* 1-Click WhatsApp Quick Order Payload Info Strip */}
      <section className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="bg-[#f2f3ff] p-5 sm:p-6 rounded-2xl border border-[#bccac0]/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#00873c] flex items-center justify-center text-white shrink-0 shadow-md">
              <span className="material-symbols-outlined text-2xl">electric_bolt</span>
            </div>
            <div>
              <h4 className="text-base font-bold text-[#131b2e]">
                {t.quickOrderStripTitle}
              </h4>
              <p className="text-xs text-[#3d4a42] mt-0.5">
                {t.quickOrderStripDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl text-[#3d4a42] text-xs font-semibold border border-[#bccac0]/30 shrink-0">
            <span className="material-symbols-outlined text-[#006948] text-[18px]">verified</span>
            <span>
              {lang === 'bn' ? 'অফিসিয়াল অর্ডার নম্বর: ' : 'Official Order Phone: '}
              <strong>{whatsAppPhone}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* 4 Trust Value Props Row */}
      <div className="border-y border-[#bccac0]/20 py-6">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-2">
            <span className="material-symbols-outlined text-[#006948] text-3xl">
              local_shipping
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#131b2e]">
                {t.fastDelivery}
              </h4>
              <p className="text-[11px] text-[#3d4a42]">{t.fastDeliveryDesc}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <span className="material-symbols-outlined text-[#006948] text-3xl">payments</span>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#131b2e]">{t.cod}</h4>
              <p className="text-[11px] text-[#3d4a42]">{t.codDesc}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <span className="material-symbols-outlined text-[#006948] text-3xl">
              published_with_changes
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#131b2e]">{t.returnPolicy}</h4>
              <p className="text-[11px] text-[#3d4a42]">{t.returnPolicyDesc}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <span className="material-symbols-outlined text-[#006948] text-3xl">
              verified_user
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#131b2e]">{t.authenticProducts}</h4>
              <p className="text-[11px] text-[#3d4a42]">{t.authenticProductsDesc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Brand Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <img
              alt="সহজ শপ লোগো"
              className="w-8 h-8 rounded-full object-cover"
              src={LOGO_IMG}
            />
            <span className="text-xl font-extrabold text-[#006948]">{t.siteTitle}</span>
          </div>
          <p className="text-xs text-[#3d4a42] leading-relaxed">
            {lang === 'bn'
              ? 'বাংলাদেশের যেকোনো প্রান্ত থেকে সাশ্রয়ী দামে আসল পণ্য কেনার বিশ্বস্ত মাধ্যম। আধুনিক ও নিরাপদ অনলাইন কেনাকাটার অভিজ্ঞতা।'
              : 'The most trusted platform in Bangladesh for authentic products at affordable prices. Modern & secure 1-click WhatsApp shopping.'}
          </p>
          <div className="pt-1">
            <span className="px-2.5 py-1 rounded-md bg-[#f2f3ff] text-[#131b2e] text-[11px] font-bold border border-[#bccac0]/30 inline-block">
              {lang === 'bn' ? 'ট্রেড লাইসেন্স নং: TRAD/DSCC/0129' : 'Trade License No: TRAD/DSCC/0129'}
            </span>
          </div>
        </div>

        {/* Col 2: Useful Links */}
        <div>
          <h4 className="text-sm font-bold text-[#131b2e] mb-3">
            {lang === 'bn' ? 'প্রয়োজনীয় লিংক' : 'Quick Links'}
          </h4>
          <ul className="space-y-2 text-xs text-[#3d4a42]">
            <li>
              <button
                type="button"
                onClick={() => onSelectCategory('all')}
                className="hover:text-[#006948] transition-colors"
              >
                {t.allProducts}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onOpenOrderTracking}
                className="hover:text-[#006948] transition-colors"
              >
                {t.orderTracking}
              </button>
            </li>
            {isAdmin && (
              <li>
                <button
                  type="button"
                  onClick={onOpenAdminPin}
                  className="hover:text-[#006948] transition-colors flex items-center gap-1 text-[#006948] font-bold"
                >
                  <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
                  {t.adminPanel}
                </button>
              </li>
            )}
            <li>
              <span className="text-[#6d7a72]">{t.returnPolicy}</span>
            </li>
          </ul>
        </div>

        {/* Col 3: Customer Service */}
        <div>
          <h4 className="text-sm font-bold text-[#131b2e] mb-3">
            {lang === 'bn' ? 'গ্রাহক সেবা ও যোগাযোগ' : 'Customer Support'}
          </h4>
          <div className="space-y-2 text-xs text-[#3d4a42]">
            <p className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#006948] text-[18px] shrink-0 mt-0.5">
                location_on
              </span>
              <span>{lang === 'bn' ? 'হাউজ #১২, রোড #৪, ধানমন্ডি, ঢাকা - ১২০৫' : 'House #12, Road #4, Dhanmondi, Dhaka - 1205'}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006948] text-[18px] shrink-0">
                call
              </span>
              <span>{whatsAppPhone}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006948] text-[18px] shrink-0">
                mail
              </span>
              <span>support@shohojshop.com.bd</span>
            </p>
          </div>
        </div>

        {/* Col 4: Direct WhatsApp Service */}
        <div>
          <h4 className="text-sm font-bold text-[#131b2e] mb-3">
            {lang === 'bn' ? 'সরাসরি হোয়াটসঅ্যাপ সেবা' : 'Direct WhatsApp Service'}
          </h4>
          <p className="text-xs text-[#3d4a42] mb-3 leading-relaxed">
            {lang === 'bn'
              ? 'অর্ডারে কোনো সমস্যা হলে সরাসরি মেসেজ দিন আমাদের হেল্পডেস্কে।'
              : 'Directly message our official helpline for instant support.'}
          </p>
          <a
            href={`https://wa.me/${cleanPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#006b2e] text-white rounded-xl text-xs font-bold hover:bg-[#00873c] transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>WhatsApp: {whatsAppPhone}</span>
          </a>
        </div>
      </div>

      {/* Bottom Copyright & Payment Partners */}
      <div className="border-t border-[#bccac0]/30 py-4 bg-[#faf8ff]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#6d7a72]">
          <p>{t.rightsReserved}</p>
          <div className="flex items-center gap-2 font-medium">
            <span>{lang === 'bn' ? 'নিরাপদ পেমেন্ট পার্টনার: bKash, Nagad, Rocket, Visa, Mastercard' : 'Payment Partners: bKash, Nagad, Rocket, Visa, Mastercard'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
