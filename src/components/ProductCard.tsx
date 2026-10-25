import React from 'react';
import { Product, Language } from '../types';
import { formatPrice } from '../utils/bengali';
import { translations } from '../data/translations';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOrderWhatsApp: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  lang: Language;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenModal,
  onAddToCart,
  onOrderWhatsApp,
  isWishlisted,
  onToggleWishlist,
  lang,
}) => {
  const t = translations[lang];
  const isOutOfStock = product.stockStatus === 'out-of-stock';
  const discountPct = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  let badgeBg = 'bg-[#fd761a] text-white';
  if (product.badgeType === 'organic') badgeBg = 'bg-[#00873c] text-white';
  if (product.badgeType === 'sold-out' || isOutOfStock) badgeBg = 'bg-[#dae2fd] text-[#131b2e]';
  if (product.badgeType === 'fashion') badgeBg = 'bg-[#ffb690] text-[#783200]';

  const stockText = isOutOfStock
    ? t.outOfStock
    : product.stockStatus === 'low-stock'
    ? t.lowStock
    : t.inStock;

  return (
    <article className="group relative flex flex-col justify-between bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-[#bccac0]/30 overflow-hidden">
      {/* Top Media Aspect Zone */}
      <div
        className="relative w-full aspect-square bg-[#f2f3ff] overflow-hidden cursor-pointer"
        onClick={() => onOpenModal(product)}
      >
        <img
          src={product.image}
          alt={product.imageAlt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Floating Badges Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          <span className={`${badgeBg} text-xs font-bold px-2.5 py-1 rounded-full shadow-sm`}>
            {product.badge}
          </span>
          {!isOutOfStock && discountPct > 0 && (
            <span className="bg-white/95 backdrop-blur-md text-[#9d4300] text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-sm border border-[#bccac0]/30">
              -{discountPct}% {lang === 'bn' ? 'ছাড়' : 'OFF'}
            </span>
          )}
        </div>

        {/* Quick Action Favorite Right */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-[#3d4a42] hover:text-[#ba1a1a] flex items-center justify-center shadow-sm transition-transform active:scale-90 z-10"
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <span
            className={`material-symbols-outlined text-[20px] transition-colors ${
              isWishlisted ? 'text-[#ba1a1a] fill-icon' : ''
            }`}
          >
            favorite
          </span>
        </button>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-[#283044]/60 backdrop-blur-xs flex items-center justify-center z-10">
            <span className="bg-white text-[#ba1a1a] text-sm font-extrabold px-4 py-1.5 rounded-xl shadow-lg border border-[#ba1a1a]/20">
              {t.outOfStock}
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-3">
        <div>
          {/* Stock & Rating Row */}
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="inline-flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOutOfStock
                    ? 'bg-[#ba1a1a]'
                    : product.stockStatus === 'low-stock'
                    ? 'bg-[#fd761a]'
                    : 'bg-[#00873c]'
                }`}
              ></span>
              <span
                className={`font-semibold ${
                  isOutOfStock
                    ? 'text-[#ba1a1a]'
                    : product.stockStatus === 'low-stock'
                    ? 'text-[#9d4300]'
                    : 'text-[#006948]'
                }`}
              >
                {stockText}
              </span>
            </span>

            <span className="inline-flex items-center gap-0.5 text-[#9d4300] font-bold">
              <span className="material-symbols-outlined text-[15px] fill-icon text-[#fd761a]">
                star
              </span>
              <span>{product.rating}</span>
              <span className="text-[#3d4a42]/70 font-normal">({product.reviews})</span>
            </span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onOpenModal(product)}
            className="text-base sm:text-lg text-[#131b2e] hover:text-[#006948] font-bold line-clamp-1 cursor-pointer transition-colors leading-snug"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Description Snippet */}
          <p className="text-xs text-[#3d4a42] line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2 space-y-3 border-t border-[#bccac0]/20">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-[#006948]">
                {formatPrice(product.price, lang)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-[#6d7a72] line-through">
                  {formatPrice(product.originalPrice, lang)}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => onOpenModal(product)}
              className="text-xs text-[#006948] hover:underline font-bold"
            >
              {t.details}
            </button>
          </div>

          {/* Button CTAs */}
          <div className="flex items-center gap-2">
            {isOutOfStock ? (
              <button
                disabled
                className="w-full py-2.5 px-3 rounded-xl bg-[#e2e7ff] text-[#6d7a72] text-xs font-bold cursor-not-allowed text-center"
              >
                {t.outOfStockBtn}
              </button>
            ) : (
              <>
                {/* 1-Click WhatsApp Order CTA -> Triggers Order Details Form */}
                <button
                  type="button"
                  onClick={() => onOrderWhatsApp(product)}
                  className="group/wa flex-1 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all text-center cursor-pointer"
                  title="হোয়াটসঅ্যাপে এক ক্লিকে অর্ডার করুন"
                >
                  <span className="material-symbols-outlined text-[18px] group-hover/wa:rotate-12 transition-transform">
                    chat
                  </span>
                  <span>{t.orderOnWhatsApp}</span>
                </button>

                {/* Add to Bag Cart Button */}
                <button
                  type="button"
                  onClick={() => onAddToCart(product)}
                  className="p-2.5 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#006948] flex items-center justify-center transition-colors active:scale-90"
                  title={t.addToCart}
                >
                  <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                </button>

                {/* View Details Modal Button */}
                <button
                  type="button"
                  onClick={() => onOpenModal(product)}
                  className="p-2.5 rounded-xl bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e] flex items-center justify-center transition-colors"
                  title={t.details}
                >
                  <span className="material-symbols-outlined text-[20px]">visibility</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
