import React, { useState } from 'react';
import { CartItem, Language } from '../types';
import { formatPrice, toBengaliDigits } from '../utils/bengali';
import { translations } from '../data/translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckoutWhatsApp: (items: CartItem[]) => void;
  lang: Language;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckoutWhatsApp,
  lang,
}) => {
  const t = translations[lang];
  const [coupon, setCoupon] = useState('SHOHOJ25');
  const [isCouponApplied, setIsCouponApplied] = useState(true);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const deliveryCharge = isCouponApplied ? 0 : 60;
  const total = subtotal + deliveryCharge;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#283044]/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#bccac0]/40 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-[#f2f3ff] border-b border-[#bccac0]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006948] text-[24px]">
              shopping_bag
            </span>
            <h3 className="text-lg font-bold text-[#131b2e]">
              {lang === 'bn' ? 'আপনার শপিং ব্যাগ' : 'Your Shopping Bag'}
            </h3>
            <span className="bg-[#006948] text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {lang === 'bn'
                ? toBengaliDigits(items.reduce((s, i) => s + i.quantity, 0)) + ' টি'
                : items.reduce((s, i) => s + i.quantity, 0) + ' items'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#6d7a72]">
                <span className="material-symbols-outlined text-4xl">remove_shopping_cart</span>
              </div>
              <h4 className="text-base font-bold text-[#131b2e]">
                {lang === 'bn' ? 'আপনার ব্যাগটি খালি' : 'Your bag is empty'}
              </h4>
              <p className="text-xs text-[#3d4a42]">
                {lang === 'bn'
                  ? 'পছন্দের পণ্য খুঁজে পেতে স্টোরফ্রন্ট ব্রাউজ করুন এবং সহজেই ১-ক্লিকে অর্ডার করুন।'
                  : 'Browse our collection and order easily with WhatsApp.'}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-5 py-2.5 bg-[#006948] hover:bg-[#00855d] text-white rounded-xl text-xs font-bold transition-all shadow"
              >
                {lang === 'bn' ? 'শপিং শুরু করুন' : 'Start Shopping'}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="p-3 bg-[#faf8ff] rounded-2xl border border-[#bccac0]/30 flex items-center gap-3 relative group"
              >
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="w-16 h-16 rounded-xl object-cover bg-white shrink-0 border border-[#bccac0]/20"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-[#131b2e] truncate">
                    {item.product.title}
                  </h4>
                  <div className="text-[11px] font-mono text-[#6d7a72]">
                    #{item.product.id}
                  </div>
                  <div className="text-xs font-bold text-[#006948] mt-0.5">
                    {formatPrice(item.product.price, lang)}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-lg bg-white border border-[#bccac0] text-[#131b2e] flex items-center justify-center text-sm font-bold hover:bg-[#f2f3ff]"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-[#131b2e] w-5 text-center font-mono">
                      {lang === 'bn' ? toBengaliDigits(item.quantity) : item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-lg bg-white border border-[#bccac0] text-[#131b2e] flex items-center justify-center text-sm font-bold hover:bg-[#f2f3ff]"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove Item */}
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.product.id)}
                  className="p-1.5 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg transition-colors"
                  title="Remove"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer (if items exist) */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-[#f2f3ff] border-t border-[#bccac0]/30 space-y-3">
            {/* Coupon Code input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                placeholder="Coupon (SHOHOJ25)"
                className="flex-1 px-3 py-2 bg-white rounded-xl border border-[#bccac0] text-xs font-mono font-bold focus:outline-none focus:border-[#006948]"
              />
              <button
                type="button"
                onClick={() => setIsCouponApplied(coupon.trim() === 'SHOHOJ25')}
                className="px-3.5 py-2 bg-[#006948] text-white rounded-xl text-xs font-bold hover:bg-[#00855d] transition-colors"
              >
                {lang === 'bn' ? 'প্রয়োগ' : 'Apply'}
              </button>
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-[#3d4a42] border-t border-[#bccac0]/20 pt-2">
              <div className="flex justify-between">
                <span>{lang === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
                <span className="font-bold text-[#131b2e]">{formatPrice(subtotal, lang)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.deliveryCharge}</span>
                {isCouponApplied ? (
                  <span className="font-bold text-[#00873c]">{t.freeDeliveryWithCoupon}</span>
                ) : (
                  <span className="font-bold text-[#131b2e]">
                    {formatPrice(deliveryCharge, lang)}
                  </span>
                )}
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[#131b2e] pt-1 border-t border-[#bccac0]/20">
                <span>{t.totalPayable}</span>
                <span className="text-base text-[#006948]">{formatPrice(total, lang)}</span>
              </div>
            </div>

            {/* 1-Click WhatsApp Checkout Button -> triggers customer info form */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onCheckoutWhatsApp(items);
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
              <span>
                {lang === 'bn'
                  ? 'হোয়াটসঅ্যাপে অর্ডার তথ্য দিন ও পাঠান (০১৭২৪৮১৪১২৮)'
                  : 'Enter Details & Order on WhatsApp (01724814128)'}
              </span>
            </button>

            <button
              type="button"
              onClick={onClearCart}
              className="w-full py-1.5 text-xs text-[#6d7a72] hover:text-[#ba1a1a] text-center font-medium transition-colors cursor-pointer"
            >
              {lang === 'bn' ? 'ব্যাগ খালি করুন' : 'Clear Bag'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
