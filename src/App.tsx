import { useState, useEffect } from 'react';
import { Product, CartItem, WhatsAppConfig, Order, Language, AppUser } from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_WHATSAPP_CONFIG,
  INITIAL_ORDERS,
  CATEGORIES,
} from './data/initialData';
import { toBengaliDigits } from './utils/bengali';
import { translations } from './data/translations';
import { Header } from './components/Header';
import { EidCampaignBanner } from './components/EidCampaignBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminPinModal } from './components/AdminPinModal';
import { AdminDashboard } from './components/AdminDashboard';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { WhatsAppOrderModal } from './components/WhatsAppOrderModal';
import { AuthModal } from './components/AuthModal';
import { TrustBadgesAndFooter } from './components/TrustBadgesAndFooter';
import { LiveChatWidget } from './components/LiveChatWidget';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Toast } from './components/Toast';
import {
  testFirestoreConnection,
  subscribeToProducts,
  saveProductToFirestore,
  deleteProductFromFirestore,
  seedProductsIfEmpty,
  subscribeToOrders,
  saveOrderToFirestore,
  updateOrderStatusInFirestore,
  logoutApp,
  ADMIN_EMAIL,
} from './firebase';

export default function App() {
  // Language State: 'bn' (Bangla) or 'en' (English)
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('shohoj_lang');
    return saved === 'en' ? 'en' : 'bn';
  });

  useEffect(() => {
    localStorage.setItem('shohoj_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  const t = translations[lang];

  // Mode: Storefront vs Admin
  const [currentView, setCurrentView] = useState<'storefront' | 'admin'>('storefront');

  // Products Data Store with LocalStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('shohoj_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('shohoj_products', JSON.stringify(products));
  }, [products]);

  // WhatsApp Config with LocalStorage persistence (defaults to 01724814128)
  const [whatsAppConfig, setWhatsAppConfig] = useState<WhatsAppConfig>(() => {
    const saved = localStorage.getItem('shohoj_wa_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.phoneNumber || parsed.phoneNumber.includes('1712345678')) {
          parsed.phoneNumber = '+8801724814128';
        }
        return parsed;
      } catch {
        return INITIAL_WHATSAPP_CONFIG;
      }
    }
    return INITIAL_WHATSAPP_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem('shohoj_wa_config', JSON.stringify(whatsAppConfig));
  }, [whatsAppConfig]);

  // Orders Store
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('shohoj_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ORDERS;
      }
    }
    return INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('shohoj_orders', JSON.stringify(orders));
  }, [orders]);

  // Real-time synchronization with Firebase Firestore
  useEffect(() => {
    // Test server connection as per skill
    testFirestoreConnection();

    // Auto-seed initial catalog products to Firestore if collection is empty
    seedProductsIfEmpty(INITIAL_PRODUCTS);

    // Listen to real-time products updates from Firestore
    const unsubProducts = subscribeToProducts((cloudProducts) => {
      if (cloudProducts && cloudProducts.length > 0) {
        setProducts(cloudProducts);
      }
    });

    // Listen to real-time orders updates from Firestore
    const unsubOrders = subscribeToOrders((cloudOrders) => {
      if (cloudOrders && cloudOrders.length > 0) {
        setOrders(cloudOrders);
      }
    });

    return () => {
      if (unsubProducts) unsubProducts();
      if (unsubOrders) unsubOrders();
    };
  }, []);

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('shohoj_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [
      { product: INITIAL_PRODUCTS[0], quantity: 1 },
      { product: INITIAL_PRODUCTS[2], quantity: 1 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('shohoj_cart', JSON.stringify(cart));
  }, [cart]);

  const [wishlist, setWishlist] = useState<string[]>([]);

  // Filtering & Sorting State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('popular');
  const [activeNavTab, setActiveNavTab] = useState<string>('all');

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminPinOpen, setIsAdminPinOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  // Dedicated WhatsApp Order Checkout Modal (prompts for Name, Mobile, Address + displays picture, price, code)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderModalItems, setOrderModalItems] = useState<{ product: Product; quantity: number }[]>([]);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem('shohoj_auth_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const isUserAdmin = parsed?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase();
        return {
          ...parsed,
          role: isUserAdmin ? 'admin' : 'customer',
        };
      } catch {
        return null;
      }
    }
    return null;
  });

  const isAdmin = currentUser?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase();

  // Route protection: strictly restrict admin dashboard to msbablu87@gmail.com
  useEffect(() => {
    if (currentView === 'admin' && !isAdmin) {
      setCurrentView('storefront');
      showToast(
        lang === 'bn'
          ? 'অননুমোদিত অ্যাক্সেস! শুধুমাত্র msbablu87@gmail.com অ্যাডমিন প্যানেল দেখতে পারবেন।'
          : 'Unauthorized! Only msbablu87@gmail.com has admin access.',
        'lock'
      );
    }
  }, [currentView, isAdmin, lang]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingOrderItems, setPendingOrderItems] = useState<{ product: Product; quantity: number }[] | null>(null);
  const [authNoticeMessage, setAuthNoticeMessage] = useState<string | null>(null);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastIcon, setToastIcon] = useState<string>('check_circle');

  const showToast = (msg: string, icon = 'check_circle') => {
    setToastMessage(msg);
    setToastIcon(icon);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

  const handleLogout = async () => {
    await logoutApp();
    setCurrentUser(null);
    showToast(
      lang === 'bn' ? 'সফলভাবে লগআউট সম্পন্ন হয়েছে' : 'Logged out successfully',
      'logout'
    );
  };

  // Launch Order Form when clicking "Order on WhatsApp" (Requires customer to be signed in)
  const handleOpenWhatsAppOrder = (itemOrItems: { product: Product; quantity?: number } | { product: Product; quantity: number }[]) => {
    const normalizedItems: { product: Product; quantity: number }[] = Array.isArray(itemOrItems)
      ? itemOrItems.map((item) => ({ product: item.product, quantity: item.quantity || 1 }))
      : [
          {
            product: itemOrItems.product,
            quantity: itemOrItems.quantity || 1,
          },
        ];

    // Check if customer is authenticated
    if (!currentUser) {
      // Save pending order items to reopen immediately after sign in or registration
      setPendingOrderItems(normalizedItems);
      setAuthNoticeMessage(
        lang === 'bn'
          ? 'অর্ডার কনফার্ম করার জন্য দয়া করে প্রথমে সাইন ইন বা নতুন একাউন্ট নিবন্ধন করুন।'
          : 'Please sign in or create an account before placing your order.'
      );
      setAuthInitialMode('register');
      setIsAuthModalOpen(true);
      showToast(
        lang === 'bn'
          ? 'অর্ডার করতে অনুগ্রহ করে প্রথমে সাইন ইন বা একাউন্ট তৈরি করুন'
          : 'Please sign in or register before placing order',
        'lock'
      );
      return;
    }

    setOrderModalItems(normalizedItems);
    setIsOrderModalOpen(true);
  };

  // Cart Operations
  const handleAddToCart = (product: Product) => {
    if (product.stockStatus === 'out-of-stock') {
      showToast(lang === 'bn' ? 'দুঃখিত, এই পণ্যটি বর্তমানে স্টক শেষ' : 'Sorry, this item is out of stock', 'remove_shopping_cart');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(
      lang === 'bn' ? `"${product.title}" ব্যাগে যুক্ত হয়েছে!` : `"${product.title}" added to bag!`,
      'shopping_bag'
    );
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast(lang === 'bn' ? 'ব্যাগ থেকে পণ্যটি সরানো হয়েছে' : 'Item removed from bag', 'delete');
  };

  const handleClearCart = () => {
    setCart([]);
    showToast(lang === 'bn' ? 'শপিং ব্যাগ খালি করা হয়েছে' : 'Bag cleared');
  };

  // Wishlist Toggle
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.includes(product.id)) {
        showToast(lang === 'bn' ? 'পছন্দের তালিকা থেকে সরানো হয়েছে' : 'Removed from wishlist', 'favorite_border');
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(lang === 'bn' ? 'পছন্দের তালিকায় যুক্ত হয়েছে!' : 'Added to wishlist!', 'favorite');
        return [...prev, product.id];
      }
    });
  };

  // Copy Coupon
  const handleCopyCoupon = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          showToast(lang === 'bn' ? `কুপন কোড '${code}' সফলভাবে কপি হয়েছে!` : `Coupon '${code}' copied!`, 'content_copy');
        })
        .catch(() => {
          showToast(`Coupon: ${code}`, 'content_copy');
        });
    } else {
      showToast(`Coupon: ${code}`, 'content_copy');
    }
  };

  // Product CRUD in Admin with Firebase Firestore persistence
  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    saveProductToFirestore(updated).catch((err) =>
      console.warn('Firebase update failed, cached locally:', err)
    );
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    saveProductToFirestore(newProduct).catch((err) =>
      console.warn('Firebase add product failed, cached locally:', err)
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    deleteProductFromFirestore(productId).catch((err) =>
      console.warn('Firebase delete product failed, cached locally:', err)
    );
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    updateOrderStatusInFirestore(orderId, status).catch((err) =>
      console.warn('Firebase order status update failed:', err)
    );
    showToast(
      lang === 'bn'
        ? `অর্ডার #${orderId} এর স্ট্যাটাস আপডেট হয়েছে`
        : `Order #${orderId} status updated`,
      'local_shipping'
    );
  };

  const handleOrderConfirmed = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    saveOrderToFirestore(newOrder).catch((err) =>
      console.warn('Firebase save order failed, cached locally:', err)
    );
  };

  // Filtered & Sorted Product List
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'price-low') return a.price - b.price;
    if (sortOrder === 'price-high') return b.price - a.price;
    if (sortOrder === 'discount') {
      const discA = a.originalPrice - a.price;
      const discB = b.originalPrice - b.price;
      return discB - discA;
    }
    return 0; // Default popularity
  });

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // If Admin View is active, render the dedicated Admin Dashboard
  if (currentView === 'admin') {
    return (
      <div className="w-full min-h-screen bg-[#faf8ff]">
        <AdminDashboard
          products={products}
          onUpdateProduct={handleUpdateProduct}
          onAddProduct={handleAddProduct}
          onDeleteProduct={handleDeleteProduct}
          whatsAppConfig={whatsAppConfig}
          onSaveWhatsAppConfig={setWhatsAppConfig}
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onBackToStore={() => setCurrentView('storefront')}
          onLogout={() => {
            setCurrentView('storefront');
            showToast(lang === 'bn' ? 'অ্যাডমিন সেশন সমাপ্ত হয়েছে' : 'Admin session locked', 'lock');
          }}
          onShowToast={showToast}
        />
        <Toast
          message={toastMessage}
          icon={toastIcon}
          onClose={() => setToastMessage(null)}
        />
      </div>
    );
  }

  // Storefront View
  return (
    <div className="min-h-screen flex flex-col bg-[#faf8ff] text-[#131b2e]">
      {/* Top Header */}
      <Header
        cartCount={totalCartCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdminPin={() => {
          if (isAdmin) {
            setCurrentView('admin');
          } else {
            setIsAdminPinOpen(true);
          }
        }}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById('store-products');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        activeNavTab={activeNavTab}
        setActiveNavTab={setActiveNavTab}
        onOpenOrderTracking={() => setIsTrackingOpen(true)}
        whatsAppPhone={whatsAppConfig.phoneNumber}
        lang={lang}
        onToggleLang={toggleLanguage}
        currentUser={currentUser}
        onOpenAuth={() => {
          setAuthNoticeMessage(null);
          setAuthInitialMode('login');
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Main Storefront Flow */}
      <main className="w-full pt-20 flex-1">
        {/* Eid Mega Offer Highlight Banner */}
        <EidCampaignBanner
          onCopyCoupon={handleCopyCoupon}
          onOpenAdminPin={() => {
            if (isAdmin) {
              setCurrentView('admin');
            } else {
              setIsAdminPinOpen(true);
            }
          }}
          onScrollToProducts={() => {
            const el = document.getElementById('store-products');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          lang={lang}
          isAdmin={isAdmin}
        />

        {/* Navigation, Filter & Search Command Center */}
        <section
          id="store-products"
          className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6"
        >
          {/* Category Tabs */}
          <div className="w-full overflow-x-auto pb-2 no-scrollbar">
            <div className="inline-flex items-center gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-[#bccac0]/30">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                let label = cat.label;
                if (lang === 'en') {
                  if (cat.id === 'all') label = t.catAll;
                  if (cat.id === 'electronics') label = t.catElectronics;
                  if (cat.id === 'fashion') label = t.catFashion;
                  if (cat.id === 'home') label = t.catHome;
                  if (cat.id === 'grocery') label = t.catGrocery;
                }
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setActiveNavTab(cat.id);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#006948] text-white shadow-md font-bold'
                        : 'bg-[#faf8ff] text-[#3d4a42] hover:bg-[#eaedff] hover:text-[#131b2e]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Search & Sort Control Panel */}
          <div className="mt-4 bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-[#bccac0]/30 flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6d7a72] text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchProductPlaceholder}
                className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#f2f3ff] text-[#131b2e] placeholder:text-[#6d7a72] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#006948] transition-all border border-[#bccac0]/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7a72] hover:text-[#131b2e]"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Result Counter & Sort Dropdown */}
            <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-4">
              <div className="flex items-center gap-1.5 text-xs text-[#3d4a42]">
                <span>{t.totalProducts}</span>
                <span className="text-sm font-extrabold text-[#006948]">
                  {lang === 'bn' ? toBengaliDigits(sortedProducts.length) : sortedProducts.length} {t.itemsUnit}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6d7a72] text-[18px]">
                  sort
                </span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="h-10 px-3 pr-8 rounded-xl bg-[#f2f3ff] text-[#131b2e] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#006948] cursor-pointer border border-[#bccac0]/30"
                >
                  <option value="popular">{t.sortPopular}</option>
                  <option value="price-low">{t.sortPriceLow}</option>
                  <option value="price-high">{t.sortPriceHigh}</option>
                  <option value="discount">{t.sortDiscount}</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Product Grid Canvas */}
        <section className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-2 mb-10">
          {sortedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl shadow-sm border border-[#bccac0]/30">
              <span className="material-symbols-outlined text-5xl text-[#6d7a72] mb-2">
                search_off
              </span>
              <h3 className="text-lg font-bold text-[#131b2e]">{t.noProductsFound}</h3>
              <p className="text-xs text-[#3d4a42] max-w-sm mt-1">
                {t.noProductsDesc}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-4 px-5 py-2.5 bg-[#006948] text-white rounded-xl text-xs font-bold hover:bg-[#00855d] transition-all shadow cursor-pointer"
              >
                {t.showAllProducts}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenModal={setSelectedProduct}
                  onAddToCart={handleAddToCart}
                  onOrderWhatsApp={(prod) => handleOpenWhatsAppOrder({ product: prod, quantity: 1 })}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  lang={lang}
                />
              ))}
            </div>
          )}
        </section>

        {/* Trust Badges & Footer */}
        <TrustBadgesAndFooter
          whatsAppPhone={whatsAppConfig.phoneNumber}
          onOpenAdminPin={() => {
            if (isAdmin) {
              setCurrentView('admin');
            } else {
              setIsAdminPinOpen(true);
            }
          }}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            const el = document.getElementById('store-products');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenOrderTracking={() => setIsTrackingOpen(true)}
          lang={lang}
          currentUser={currentUser}
        />
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onOrderWhatsApp={(prod) => handleOpenWhatsAppOrder({ product: prod, quantity: 1 })}
        lang={lang}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckoutWhatsApp={(cartItems) => handleOpenWhatsAppOrder(cartItems)}
        lang={lang}
      />

      {/* Dedicated Customer Order Information & WhatsApp Dispatch Modal */}
      <WhatsAppOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        orderItems={orderModalItems}
        whatsAppPhone={whatsAppConfig.phoneNumber}
        lang={lang}
        onOrderConfirmed={handleOrderConfirmed}
        onShowToast={showToast}
        currentUser={currentUser}
        onRequestAuth={() => {
          setPendingOrderItems(orderModalItems);
          setIsOrderModalOpen(false);
          setAuthNoticeMessage(
            lang === 'bn'
              ? 'অর্ডার সম্পন্ন করার জন্য অনুগ্রহ করে সাইন ইন বা নিবন্ধন করুন।'
              : 'Please sign in or register to complete your order.'
          );
          setAuthInitialMode('register');
          setIsAuthModalOpen(true);
        }}
      />

      {/* Customer & Admin Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setAuthNoticeMessage(null);
        }}
        lang={lang}
        noticeMessage={authNoticeMessage}
        initialMode={authInitialMode}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          // Seamless order continuation if customer clicked Order prior to signing in
          if (pendingOrderItems && pendingOrderItems.length > 0) {
            setOrderModalItems(pendingOrderItems);
            setPendingOrderItems(null);
            setAuthNoticeMessage(null);
            setIsAuthModalOpen(false);
            setIsOrderModalOpen(true);
            showToast(
              lang === 'bn'
                ? `স্বাগতম ${user.displayName}! এবার আপনার অর্ডারের তথ্য নিশ্চিত করুন`
                : `Welcome ${user.displayName}! Please confirm your order details`,
              'shopping_bag'
            );
          }
        }}
        onAdminLoginSuccess={() => {
          setCurrentView('admin');
        }}
        onShowToast={showToast}
      />

      {/* Admin PIN Unlock Modal */}
      <AdminPinModal
        isOpen={isAdminPinOpen}
        onClose={() => setIsAdminPinOpen(false)}
        onSuccess={() => {
          setIsAdminPinOpen(false);
          const adminUser: AppUser = {
            uid: 'admin_msbablu87',
            email: ADMIN_EMAIL,
            displayName: lang === 'bn' ? 'অ্যাডমিন (msbablu87)' : 'Admin (msbablu87)',
            phoneNumber: '01724814128',
            role: 'admin',
          };
          setCurrentUser(adminUser);
          localStorage.setItem('shohoj_auth_user', JSON.stringify(adminUser));
          setCurrentView('admin');
          showToast(
            lang === 'bn'
              ? `অ্যাডমিন লগইন সফল! স্বাগতম ${ADMIN_EMAIL}`
              : `Admin login successful! Welcome ${ADMIN_EMAIL}`,
            'verified_user'
          );
        }}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        orders={orders}
      />

      {/* Live Chat Widget with Firebase Firestore Sync & WhatsApp integration */}
      <LiveChatWidget whatsAppPhone={whatsAppConfig.phoneNumber} lang={lang} />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab="home"
        onSelectTab={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenWhatsApp={() => {
          const cleanPhone = whatsAppConfig.phoneNumber.replace(/[^0-9]/g, '');
          window.open(
            `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              lang === 'bn'
                ? 'আসসালামু আলাইকুম সহজ শপ! আমি অর্ডার করতে চাই।'
                : 'Hello Shohoj Shop! I would like to place an order.'
            )}`,
            '_blank'
          );
        }}
        onOpenCategories={() => {
          const el = document.getElementById('store-products');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenOffers={() => {
          const el = document.getElementById('store-products');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          showToast(
            lang === 'bn' ? 'ঈদ ধামাকা অফারে সর্বোচ্চ ৪০% ছাড়!' : 'Eid Mega Offer up to 40% OFF!',
            'local_fire_department'
          );
        }}
        onOpenAuth={() => {
          setAuthNoticeMessage(null);
          setAuthInitialMode('login');
          setIsAuthModalOpen(true);
        }}
        currentUser={currentUser}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        icon={toastIcon}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
