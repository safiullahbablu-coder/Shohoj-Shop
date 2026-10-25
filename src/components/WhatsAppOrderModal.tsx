import React, { useState, useEffect } from 'react';
import { Product, Language, Order, AppUser } from '../types';
import { translations } from '../data/translations';
import { formatPrice, buildFullWhatsAppOrderUrl, toBengaliDigits } from '../utils/bengali';

interface OrderItemData {
  product: Product;
  quantity: number;
}

interface WhatsAppOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: OrderItemData[];
  whatsAppPhone: string;
  lang: Language;
  onOrderConfirmed: (newOrder: Order) => void;
  onShowToast: (msg: string, icon?: string) => void;
  currentUser?: AppUser | null;
  onRequestAuth?: () => void;
}

export const WhatsAppOrderModal: React.FC<WhatsAppOrderModalProps> = ({
  isOpen,
  onClose,
  orderItems,
  whatsAppPhone,
  lang,
  onOrderConfirmed,
  onShowToast,
  currentUser,
  onRequestAuth,
}) => {
  const t = translations[lang];

  // Customer form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryArea, setDeliveryArea] = useState<'inside' | 'outside'>('inside');
  const [appliedCoupon, setAppliedCoupon] = useState('SHOHOJ25');
  const [items, setItems] = useState<OrderItemData[]>(orderItems);
  const [errorMsg, setErrorMsg] = useState('');

  // Keep items synced if prop changes & prefill if logged in
  useEffect(() => {
    setItems(orderItems);
  }, [orderItems]);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.displayName && !customerName) setCustomerName(currentUser.displayName);
      if (currentUser.phoneNumber && !customerPhone) setCustomerPhone(currentUser.phoneNumber);
      if (currentUser.address && !customerAddress) setCustomerAddress(currentUser.address);
    }
  }, [currentUser, isOpen]);

  if (!isOpen || items.length === 0) return null;

  const isFreeDelivery = appliedCoupon.toUpperCase() === 'SHOHOJ25';
  const deliveryCharge = isFreeDelivery ? 0 : deliveryArea === 'inside' ? 60 : 120;
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const totalAmount = subtotal + deliveryCharge;

  const handleQuantityChange = (productId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = Math.max(1, item.quantity + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        })
    );
  };

  const compiledWhatsAppUrl = buildFullWhatsAppOrderUrl(
    whatsAppPhone,
    {
      customerName: customerName || (lang === 'bn' ? '[গ্রাহকের নাম]' : '[Customer Name]'),
      customerPhone: customerPhone || (lang === 'bn' ? '[মোবাইল নম্বর]' : '[Mobile Number]'),
      customerAddress: customerAddress || (lang === 'bn' ? '[ডেলিভারি ঠিকানা]' : '[Address]'),
      deliveryArea:
        deliveryArea === 'inside'
          ? lang === 'bn'
            ? 'ঢাকার ভিতরে'
            : 'Inside Dhaka'
          : lang === 'bn'
          ? 'ঢাকার বাইরে'
          : 'Outside Dhaka',
      deliveryCharge,
      couponCode: appliedCoupon || undefined,
      items,
      totalAmount,
    },
    lang
  );

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      setErrorMsg(
        lang === 'bn'
          ? 'অর্ডার সম্পন্ন করার জন্য অনুগ্রহ করে প্রথমে সাইন ইন বা নিবন্ধন করুন!'
          : 'Please sign in or register before confirming your order!'
      );
      if (onRequestAuth) {
        onRequestAuth();
      }
      return;
    }

    if (!customerName.trim()) {
      setErrorMsg(lang === 'bn' ? 'অনুগ্রহ করে আপনার নাম লিখুন।' : 'Please enter your name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 11) {
      setErrorMsg(
        lang === 'bn'
          ? 'অনুগ্রহ করে সঠিক মোবাইল নম্বর প্রদান করুন (১১ ডিজিট)।'
          : 'Please enter a valid 11-digit mobile number.'
      );
      return;
    }
    if (!customerAddress.trim()) {
      setErrorMsg(
        lang === 'bn'
          ? 'অনুগ্রহ করে আপনার পূর্ণ ডেলিভারি ঠিকানা লিখুন।'
          : 'Please enter your complete delivery address.'
      );
      return;
    }

    setErrorMsg('');

    // Generate Order ID
    const newOrderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: newOrderId,
      customerName,
      customerPhone,
      customerAddress,
      deliveryArea: deliveryArea === 'inside' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে',
      items: items.map((i) => ({
        productId: i.product.id,
        title: i.product.title,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image,
      })),
      totalAmount,
      status: 'pending',
      date: new Date().toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      couponCode: appliedCoupon,
    };

    // Save to store orders
    onOrderConfirmed(newOrder);

    // Open WhatsApp
    window.open(compiledWhatsAppUrl, '_blank');

    onShowToast(
      lang === 'bn'
        ? `অর্ডার #${newOrderId} কনফার্ম হয়েছে এবং হোয়াটসঅ্যাপে পাঠানো হচ্ছে!`
        : `Order #${newOrderId} confirmed and sent to WhatsApp!`,
      'send'
    );

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#283044]/65 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-[#bccac0]/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#006948] to-[#00855d] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[24px]">chat</span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold leading-tight">
                {t.orderModalTitle}
              </h3>
              <p className="text-[11px] sm:text-xs text-white/90 mt-0.5">
                {lang === 'bn'
                  ? 'অর্ডার পাঠাতে নাম, মোবাইল ও ঠিকানা লিখুন (গন্তব্য: 01724814128)'
                  : 'Enter info to send order directly to WhatsApp (01724814128)'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Form & Order View */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3 bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-xs font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Guest User Warning Banner */}
          {!currentUser ? (
            <div className="p-3.5 bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-start sm:items-center gap-2.5">
                <span className="material-symbols-outlined text-amber-600 text-[24px] shrink-0">
                  lock_person
                </span>
                <div>
                  <p className="font-bold text-xs sm:text-sm text-amber-950">
                    {lang === 'bn' ? 'অর্ডার করতে সাইন ইন আবশ্যক' : 'Sign In Required to Order'}
                  </p>
                  <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                    {lang === 'bn'
                      ? 'নতুন গ্রাহক হলে সহজেই ১ মিনিটে নিবন্ধন করে অর্ডার কনফার্ম করুন।'
                      : 'New customer? Register or log in to confirm your order easily.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onRequestAuth?.();
                }}
                className="px-4 py-2 bg-[#006948] hover:bg-[#005237] text-white rounded-xl text-xs font-bold shrink-0 flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">login</span>
                <span>{lang === 'bn' ? 'সাইন ইন / একাউন্ট খুলুন' : 'Sign In / Register'}</span>
              </button>
            </div>
          ) : (
            <div className="px-3.5 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-emerald-600 text-[20px] shrink-0">
                  verified_user
                </span>
                <span className="truncate">
                  {lang === 'bn' ? 'লগইন গ্রাহক:' : 'Signed in as:'}{' '}
                  <strong>{currentUser.displayName}</strong>{' '}
                  <span className="text-emerald-700 font-mono text-[11px]">
                    ({currentUser.email})
                  </span>
                </span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                {lang === 'bn' ? 'ভেরিফাইড' : 'Verified'}
              </span>
            </div>
          )}

          {/* 1. Customer Information Section */}
          <div className="bg-[#f2f3ff] p-4 rounded-2xl border border-[#bccac0]/30 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-[#131b2e] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006948] text-[18px]">person</span>
              <span>
                {lang === 'bn' ? '১. গ্রাহকের ডেলিভারি তথ্য' : '1. Customer Delivery Details'}
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-[#131b2e] mb-1">
                  {t.customerName} <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder={t.customerNamePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-xs sm:text-sm border border-[#bccac0] focus:outline-none focus:border-[#006948]"
                />
              </div>

              {/* Mobile Phone */}
              <div>
                <label className="block text-xs font-bold text-[#131b2e] mb-1">
                  {t.customerPhone} <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => {
                    setCustomerPhone(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder={t.customerPhonePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-xs sm:text-sm font-mono border border-[#bccac0] focus:outline-none focus:border-[#006948]"
                />
              </div>

              {/* Delivery Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#131b2e] mb-1">
                  {t.customerAddress} <span className="text-[#ba1a1a]">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={customerAddress}
                  onChange={(e) => {
                    setCustomerAddress(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder={t.customerAddressPlaceholder}
                  className="w-full p-3 rounded-xl bg-white text-xs sm:text-sm border border-[#bccac0] focus:outline-none focus:border-[#006948] leading-relaxed"
                ></textarea>
              </div>

              {/* Delivery Area Selection */}
              <div className="sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1">
                <span className="text-xs font-bold text-[#131b2e]">{t.deliveryArea}:</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-[#131b2e] cursor-pointer">
                    <input
                      type="radio"
                      name="area"
                      checked={deliveryArea === 'inside'}
                      onChange={() => setDeliveryArea('inside')}
                      className="accent-[#006948]"
                    />
                    <span>{t.insideDhaka}</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-[#131b2e] cursor-pointer">
                    <input
                      type="radio"
                      name="area"
                      checked={deliveryArea === 'outside'}
                      onChange={() => setDeliveryArea('outside')}
                      className="accent-[#006948]"
                    />
                    <span>{t.outsideDhaka}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Order View & Products Summary */}
          <div className="bg-white p-4 rounded-2xl border border-[#bccac0]/30 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-[#131b2e] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006948] text-[18px]">
                  inventory_2
                </span>
                <span>{t.orderSummary}</span>
              </span>
              <span className="text-xs text-[#006948] font-bold">
                {items.length} {lang === 'bn' ? 'আইটেম' : 'item(s)'}
              </span>
            </h4>

            {/* Product Items List with Pictures, Price & Code */}
            <div className="space-y-3 divide-y divide-[#bccac0]/20">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="pt-2 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-14 h-14 rounded-xl object-cover bg-[#f2f3ff] shrink-0 border border-[#bccac0]/30"
                    />
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-[#131b2e] line-clamp-1">
                        {item.product.title}
                      </h5>
                      <div className="flex items-center gap-2 text-[11px] text-[#6d7a72] mt-0.5">
                        <span className="bg-[#e2e7ff] text-[#006948] font-mono font-bold px-1.5 py-0.2 rounded">
                          #{item.product.id}
                        </span>
                        <span>
                          {t.unitPrice}: {formatPrice(item.product.price, lang)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 bg-[#f2f3ff] rounded-lg p-1 border border-[#bccac0]/30">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.product.id, -1)}
                        className="w-5 h-5 rounded bg-white flex items-center justify-center text-xs font-bold text-[#131b2e] hover:bg-[#eaedff]"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-4 text-center font-mono">
                        {lang === 'bn' ? toBengaliDigits(item.quantity) : item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.product.id, 1)}
                        className="w-5 h-5 rounded bg-white flex items-center justify-center text-xs font-bold text-[#131b2e] hover:bg-[#eaedff]"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs sm:text-sm font-extrabold text-[#006948] w-20 text-right">
                      {formatPrice(item.product.price * item.quantity, lang)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-[#bccac0]/20 space-y-1.5 text-xs text-[#3d4a42]">
              <div className="flex justify-between">
                <span>{lang === 'bn' ? 'সাবটোটাল' : 'Subtotal'}:</span>
                <span className="font-bold text-[#131b2e]">{formatPrice(subtotal, lang)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.deliveryCharge}:</span>
                {isFreeDelivery ? (
                  <span className="font-bold text-[#00873c]">{t.freeDeliveryWithCoupon}</span>
                ) : (
                  <span className="font-bold text-[#131b2e]">
                    {formatPrice(deliveryCharge, lang)}
                  </span>
                )}
              </div>
              <div className="flex justify-between text-sm sm:text-base font-extrabold text-[#131b2e] pt-1.5 border-t border-[#bccac0]/20">
                <span>{t.totalPayable}:</span>
                <span className="text-[#006948]">{formatPrice(totalAmount, lang)}</span>
              </div>
            </div>
          </div>

          {/* 3. Live WhatsApp Preview Box */}
          <div className="bg-[#faf8ff] p-3.5 rounded-2xl border border-[#bccac0]/30 space-y-2">
            <span className="text-xs font-bold text-[#006948] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>{t.waMessagePreview}</span>
            </span>
            <div className="font-mono text-[11px] bg-white p-3 rounded-xl border border-[#bccac0]/30 text-[#3d4a42] whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto select-all">
              {lang === 'bn' ? (
                <>
                  🛒 *সহজ শপ - নতুন অর্ডার কনফার্মেশন* 🛒
                  {'\n'}• নাম: {customerName || 'মোহাম্মদ রহিম'}
                  {'\n'}• মোবাইল: {customerPhone || '017XXXXXXXX'}
                  {'\n'}• ঠিকানা: {customerAddress || 'ধানমন্ডি, ঢাকা'}
                  {'\n'}
                  {items.map(
                    (it, idx) =>
                      `\n${idx + 1}. *${it.product.title}*\n   • কোড: #${it.product.id}\n   • পরিমাণ: ${toBengaliDigits(
                        it.quantity
                      )} টি\n   • মূল্য: ৳${toBengaliDigits(
                        it.product.price * it.quantity
                      )}\n   • ছবি: ${it.product.image}`
                  )}
                  {'\n\n'}• সর্বমোট: ৳{toBengaliDigits(totalAmount)}
                </>
              ) : (
                <>
                  🛒 *Shohoj Shop - New Order Confirmation* 🛒
                  {'\n'}• Name: {customerName || 'John Doe'}
                  {'\n'}• Phone: {customerPhone || '017XXXXXXXX'}
                  {'\n'}• Address: {customerAddress || 'Dhaka, Bangladesh'}
                  {'\n'}
                  {items.map(
                    (it, idx) =>
                      `\n${idx + 1}. *${it.product.title}*\n   • Code: #${it.product.id}\n   • Quantity: ${
                        it.quantity
                      }\n   • Price: ৳${it.product.price * it.quantity}\n   • Photo: ${
                        it.product.image
                      }`
                  )}
                  {'\n\n'}• Total Amount: ৳{totalAmount}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#f2f3ff] border-t border-[#bccac0]/30 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={handleSubmitOrder}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">chat</span>
            <span>{t.confirmAndSendWhatsApp}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-white hover:bg-[#e2e7ff] text-[#131b2e] text-xs sm:text-sm font-semibold border border-[#bccac0]/40 transition-colors"
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};
