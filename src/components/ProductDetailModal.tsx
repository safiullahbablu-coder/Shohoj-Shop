import React from 'react';
import { Product, Language } from '../types';
import { formatPrice } from '../utils/bengali';
import { translations } from '../data/translations';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onOrderWhatsApp: (product: Product) => void;
  lang: Language;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOrderWhatsApp,
  lang,
}) => {
  if (!product) return null;

  const t = translations[lang];
  const isOutOfStock = product.stockStatus === 'out-of-stock';
  const discountPct = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#283044]/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-[#bccac0]/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between bg-[#f2f3ff] border-b border-[#bccac0]/30">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs bg-[#006948]/10 text-[#006948] font-bold">
              {product.category.toUpperCase()}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isOutOfStock
                  ? 'bg-[#ffdad6] text-[#ba1a1a]'
                  : 'bg-[#e2e7ff] text-[#006948]'
              }`}
            >
              {isOutOfStock ? t.outOfStock : product.stockLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e] flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden bg-[#f2f3ff] aspect-square shadow-inner">
              <img
                src={product.image}
                alt={product.imageAlt}
                className="w-full h-full object-cover"
              />
              {discountPct > 0 && (
                <span className="absolute top-3 left-3 bg-[#fd761a] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                  -{discountPct}% {lang === 'bn' ? 'ছাড়' : 'OFF'}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-[#fd761a]">
                <span className="material-symbols-outlined text-[18px] fill-icon">star</span>
                <span className="material-symbols-outlined text-[18px] fill-icon">star</span>
                <span className="material-symbols-outlined text-[18px] fill-icon">star</span>
                <span className="material-symbols-outlined text-[18px] fill-icon">star</span>
                <span className="material-symbols-outlined text-[18px] fill-icon">star_half</span>
                <span className="text-xs text-[#3d4a42] font-bold ml-1">
                  ({product.rating} / 5 • {product.reviews} reviews)
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl text-[#131b2e] font-extrabold leading-snug">
                {product.title}
              </h2>

              <div className="text-xs font-mono font-bold text-[#6d7a72]">
                {t.productCode}: #{product.id} (SKU: {product.sku})
              </div>

              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#006948]">
                  {formatPrice(product.price, lang)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-base text-[#6d7a72] line-through">
                    {formatPrice(product.originalPrice, lang)}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#3d4a42] pt-2 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="p-3 sm:p-4 bg-[#f2f3ff] rounded-2xl grid grid-cols-3 gap-2 text-center border border-[#bccac0]/30">
            <div className="p-1 sm:p-2">
              <span className="material-symbols-outlined text-[#006948] text-[22px]">
                local_shipping
              </span>
              <p className="text-xs text-[#131b2e] font-bold mt-1">{t.fastDelivery}</p>
              <p className="text-[10px] text-[#3d4a42]">{t.couponLabel} SHOHOJ25</p>
            </div>
            <div className="p-1 sm:p-2">
              <span className="material-symbols-outlined text-[#006948] text-[22px]">payments</span>
              <p className="text-xs text-[#131b2e] font-bold mt-1">{t.cod}</p>
              <p className="text-[10px] text-[#3d4a42]">{t.codDesc}</p>
            </div>
            <div className="p-1 sm:p-2">
              <span className="material-symbols-outlined text-[#006948] text-[22px]">
                verified_user
              </span>
              <p className="text-xs text-[#131b2e] font-bold mt-1">{t.authenticProducts}</p>
              <p className="text-[10px] text-[#3d4a42]">{t.returnPolicy}</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-[#f2f3ff] border-t border-[#bccac0]/30 flex flex-col sm:flex-row items-center gap-3">
          {isOutOfStock ? (
            <button
              disabled
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#dae2fd] text-[#6d7a72] text-sm font-bold cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">block</span>
              <span>{t.outOfStockBtn}</span>
            </button>
          ) : (
            <>
              {/* WhatsApp Order Button -> triggers order form with customer info */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOrderWhatsApp(product);
                }}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">chat</span>
                <span>{t.orderOnWhatsApp} (01724814128)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                <span>{t.addToCart}</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#e2e7ff] hover:bg-[#dae2fd] text-[#131b2e] text-sm font-semibold transition-colors"
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};
