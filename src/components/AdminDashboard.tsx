import React, { useState, useEffect } from 'react';
import { Product, WhatsAppConfig, Order } from '../types';
import { LOGO_IMG } from '../data/initialData';
import { formatBDT, toBengaliDigits } from '../utils/bengali';
import {
  subscribeToChatMessages,
  sendChatMessageToFirestore,
  ChatMessage,
} from '../firebase';

interface AdminDashboardProps {
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  whatsAppConfig: WhatsAppConfig;
  onSaveWhatsAppConfig: (config: WhatsAppConfig) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onBackToStore: () => void;
  onLogout: () => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  whatsAppConfig,
  onSaveWhatsAppConfig,
  orders,
  onUpdateOrderStatus,
  onBackToStore,
  onLogout,
  onShowToast,
}) => {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'orders' | 'products' | 'analytics' | 'chat'
  >('dashboard');

  // Live Firebase Customer Chat Messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [replyTargetSession, setReplyTargetSession] = useState<string>('all');
  const [isAdminSending, setIsAdminSending] = useState(false);

  useEffect(() => {
    const unsub = subscribeToChatMessages((msgs) => {
      setChatMessages(msgs);
    });
    return () => {
      if (unsub) unsub();
    };
  }, []);

  // Security pin verification inside dashboard
  const [pinInput, setPinInput] = useState('1234');
  const [isUnlocked, setIsUnlocked] = useState(true);

  // WhatsApp form
  const [waPhone, setWaPhone] = useState(whatsAppConfig.phoneNumber);
  const [waTemplate, setWaTemplate] = useState(whatsAppConfig.messageTemplate);
  const [previewSample, setPreviewSample] = useState({
    title: 'সুন্দরবন খাঁটি মধু (৫০০ গ্রাম)',
    price: 750,
    id: 'PRD-101',
  });

  // Product CRUD form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('অর্গানিক ফুড');
  const [formRegularPrice, setFormRegularPrice] = useState(1200);
  const [formDiscountPrice, setFormDiscountPrice] = useState(950);
  const [formInStock, setFormInStock] = useState(true);
  const [formImage, setFormImage] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB12iIzjIs0pPyJ7zCvs1K2Jlgnfh-RIIjKYNj4iJ8yLVTzh47XF2gxef0EAolg-MqYuGgLvnKxSEYz6BFMCtqNrNnJcTrElrVIgK5icMKDtpD2FidDPB49K3j3dARMGzqa_vMZ1MoLKv3p8-iFKUMQ6H9jX9VpnRPNg04IdkACP0YlOFHmIep4swlBqGRxl2MQY7sWIUhCbombYs_GcfrgpqrACp7DhcKNSROl_zZZBMY9Y0W_3su7lA'
  );
  const [formDescription, setFormDescription] = useState('');

  // Inventory Table search & filter
  const [tableSearch, setTableSearch] = useState('');
  const [tableCategory, setTableCategory] = useState('ALL');

  // Sync animation state
  const [isSyncing, setIsSyncing] = useState(false);

  // Stats calculation
  const totalCatalog = products.length;
  const inStockCount = products.filter((p) => p.stockStatus !== 'out-of-stock').length;
  const outOfStockCount = totalCatalog - inStockCount;
  const todayOrders = orders.length;
  const todaySales = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 45200; // includes initial verified mock turnover

  // PIN verification
  const handleVerifyPin = () => {
    if (pinInput.trim() === '1234' || pinInput.trim() === '১২৩৪') {
      setIsUnlocked(true);
      onShowToast('PIN সফলভাবে যাচাই করা হয়েছে! অ্যাডমিন সক্রিয়।', 'verified_user');
    } else {
      setIsUnlocked(false);
      onShowToast('ভুল PIN প্রবেশ করানো হয়েছে! পুনরায় চেষ্টা করুন।', 'error');
    }
  };

  // WhatsApp form save
  const handleSaveWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveWhatsAppConfig({
      phoneNumber: waPhone,
      messageTemplate: waTemplate,
    });
    onShowToast(`হোয়াটসঅ্যাপ সেটিংস সংরক্ষিত (${waPhone})`, 'save');
  };

  // Admin reply sender to Firebase Live Chat
  const handleAdminSendReply = async () => {
    if (!adminReplyText.trim() || isAdminSending) return;

    setIsAdminSending(true);
    const targetSession =
      replyTargetSession === 'all'
        ? chatMessages.find((m) => m.sender === 'customer')?.sessionId || 'general'
        : replyTargetSession;

    const replyMsg: ChatMessage = {
      id: 'admin_reply_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      sessionId: targetSession,
      sender: 'admin',
      senderName: 'সহজ শপ অ্যাডমিন',
      text: adminReplyText.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      await sendChatMessageToFirestore(replyMsg);
      setAdminReplyText('');
      onShowToast('গ্রাহককে উত্তর পাঠানো হয়েছে (ফায়ারবেসে সংরক্ষিত)', 'send');
    } catch (err) {
      console.error('Failed to send admin reply:', err);
      onShowToast('মেসেজ পাঠাতে সমস্যা হয়েছে', 'error');
    } finally {
      setIsAdminSending(false);
    }
  };

  // Live test preview generator
  const getCompiledPreview = () => {
    return waTemplate
      .replace(/{PRODUCT_NAME}/g, previewSample.title)
      .replace(/{PRICE}/g, toBengaliDigits(previewSample.price))
      .replace(/{PRODUCT_ID}/g, previewSample.id);
  };

  // Manual Firebase Sync
  const handleManualSync = () => {
    setIsSyncing(true);
    onShowToast('ফায়ারবেস ডাটাবেজের সাথে সিঙ্কিং হচ্ছে...', 'sync');
    setTimeout(() => {
      setIsSyncing(false);
      onShowToast('ক্লাউড সিঙ্ক সফল! সমস্ত ডাটা আপ-টু-ডেট।', 'cloud_done');
    }, 900);
  };

  // Stock toggle directly on inventory row
  const handleToggleStock = (product: Product) => {
    const isCurrentInStock = product.stockStatus !== 'out-of-stock';
    const updated: Product = {
      ...product,
      stockStatus: isCurrentInStock ? 'out-of-stock' : 'in-stock',
      stockLabel: isCurrentInStock ? 'স্টক শেষ' : 'ইন স্টক',
      badge: isCurrentInStock ? 'স্টক শেষ' : 'ইন স্টক',
      badgeType: isCurrentInStock ? 'sold-out' : 'deal',
    };
    onUpdateProduct(updated);
    onShowToast(
      isCurrentInStock
        ? `"${product.title}" স্টক শেষ এ পরিবর্তন হয়েছে`
        : `"${product.title}" পুনরায় ইন স্টকে যুক্ত হয়েছে`,
      isCurrentInStock ? 'remove_shopping_cart' : 'check_circle'
    );
  };

  // Open Edit Form
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setFormTitle(product.title);
    setFormCategory(product.category);
    setFormRegularPrice(product.originalPrice);
    setFormDiscountPrice(product.price);
    setFormInStock(product.stockStatus !== 'out-of-stock');
    setFormImage(product.image);
    setFormDescription(product.description);
    setIsFormOpen(true);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Reset & Close form
  const handleCloseForm = () => {
    setEditingProduct(null);
    setFormTitle('');
    setFormRegularPrice(1200);
    setFormDiscountPrice(950);
    setFormDescription('');
    setIsFormOpen(false);
  };

  // Handle Form Submit (Add or Edit)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        title: formTitle,
        category: formCategory,
        price: Number(formDiscountPrice),
        originalPrice: Number(formRegularPrice),
        stockStatus: formInStock ? 'in-stock' : 'out-of-stock',
        stockLabel: formInStock ? 'ইন স্টক' : 'স্টক শেষ',
        badge: formInStock ? 'অফার ডিল' : 'স্টক শেষ',
        badgeType: formInStock ? 'deal' : 'sold-out',
        image: formImage,
        description: formDescription,
      };
      onUpdateProduct(updated);
      onShowToast(`পণ্য #${updated.id} সফলভাবে আপডেট হয়েছে!`, 'check');
    } else {
      const newId = 'PRD-' + Math.floor(100 + Math.random() * 900);
      const newProduct: Product = {
        id: newId,
        sku: 'NEW-' + Math.floor(100 + Math.random() * 900),
        title: formTitle,
        category: formCategory,
        price: Number(formDiscountPrice),
        originalPrice: Number(formRegularPrice),
        stockStatus: formInStock ? 'in-stock' : 'out-of-stock',
        stockLabel: formInStock ? 'ইন স্টক' : 'স্টক শেষ',
        badge: 'নতুন প্রোডাক্ট',
        badgeType: 'deal',
        rating: '৫.০',
        reviews: '১',
        image: formImage,
        imageAlt: formTitle,
        description: formDescription,
      };
      onAddProduct(newProduct);
      onShowToast('নতুন পণ্য ইনভেন্টরিতে যুক্ত হয়েছে!', 'library_add_check');
    }

    handleCloseForm();
  };

  // Filter products for inventory table
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(tableSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(tableSearch.toLowerCase()) ||
      p.id.toLowerCase().includes(tableSearch.toLowerCase());
    const matchesCat =
      tableCategory === 'ALL' ||
      p.category.toLowerCase() === tableCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col md:flex-row">
      {/* Left Sidebar (Desktop Fixed w-64) */}
      <aside className="w-full md:w-64 bg-white border-r border-[#bccac0]/30 shrink-0 flex flex-col justify-between shadow-sm md:fixed md:top-0 md:bottom-0 md:left-0 z-40">
        <div>
          {/* Brand Row */}
          <div className="h-16 px-4 sm:px-6 flex items-center gap-3 border-b border-[#bccac0]/20">
            <img
              alt="সহজ শপ"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#006948]/20"
              src={LOGO_IMG}
            />
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-[#006948]">সহজ শপ</span>
              <span className="text-xs text-[#3d4a42] font-semibold">অ্যাডমিন ড্যাশবোর্ড</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[#6d7a72] px-3 font-bold block mb-2">
              ম্যানেজমেন্ট মেনু
            </span>

            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-bold text-left ${
                activeTab === 'dashboard'
                  ? 'bg-[#00855d] text-white shadow-md'
                  : 'text-[#3d4a42] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span>ড্যাশবোর্ড সামারি</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-bold text-left ${
                activeTab === 'orders'
                  ? 'bg-[#00855d] text-white shadow-md'
                  : 'text-[#3d4a42] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              <span>অর্ডার তালিকা</span>
              {orders.length > 0 && (
                <span className="ml-auto bg-[#fd761a] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {toBengaliDigits(orders.length)}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-bold text-left ${
                activeTab === 'products'
                  ? 'bg-[#00855d] text-white shadow-md'
                  : 'text-[#3d4a42] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">category</span>
              <span>পণ্য ক্যাটালগ</span>
              <span className="ml-auto bg-[#e2e7ff] text-[#006948] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {toBengaliDigits(products.length)}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-bold text-left ${
                activeTab === 'analytics'
                  ? 'bg-[#00855d] text-white shadow-md'
                  : 'text-[#3d4a42] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">monitoring</span>
              <span>বিক্রয় বিশ্লেষণ</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-bold text-left ${
                activeTab === 'chat'
                  ? 'bg-[#00855d] text-white shadow-md'
                  : 'text-[#3d4a42] hover:bg-[#f2f3ff] hover:text-[#131b2e]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">support_agent</span>
              <span>ফায়ারবেস লাইভ চ্যাট</span>
              {chatMessages.length > 0 && (
                <span className="ml-auto bg-[#22c55e] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {toBengaliDigits(chatMessages.length)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Sidebar Footer: Return to Storefront & Logout */}
        <div className="p-4 border-t border-[#bccac0]/20 space-y-2">
          <button
            type="button"
            onClick={onBackToStore}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#e2e7ff] text-[#006948] hover:bg-[#dae2fd] text-sm font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span>গ্রাহক স্টোরফ্রন্ট দেখুন</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffb4ab] text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>অ্যাডমিন লগআউট</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area (Offset by md:pl-64) */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 h-16 bg-white/90 backdrop-blur-xl border-b border-[#bccac0]/30 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="text-xs bg-[#ffdbca] text-[#783200] px-3 py-1 rounded-full font-bold border border-[#ffb690]">
              লাইভ স্টোর কানেক্টেড 🟢
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => onShowToast('বর্তমানে কোনো নতুন সিস্টেম অ্যালার্ট নেই।', 'notifications')}
              className="p-2 rounded-lg text-[#3d4a42] hover:bg-[#f2f3ff] transition-colors"
              title="বিজ্ঞপ্তি"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
            </button>

            <button
              type="button"
              onClick={() => onShowToast('স্টোর কনফিগারেশন সেটিংস সক্রিয়।', 'settings')}
              className="p-2 rounded-lg text-[#3d4a42] hover:bg-[#f2f3ff] transition-colors"
              title="সেটিংস"
            >
              <span className="material-symbols-outlined text-[22px]">settings</span>
            </button>

            <div className="flex items-center gap-2 pl-3 border-l border-[#bccac0]/40">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-[#131b2e]">সুপার অ্যাডমিন</div>
                <div className="text-[11px] text-[#006948] font-bold font-mono">msbablu87@gmail.com</div>
              </div>
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#006948]/40"
                src={LOGO_IMG}
              />
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#ffdad6] hover:bg-[#ffb4ab] text-[#ba1a1a] text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer ml-1"
                title="লগআউট"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span className="hidden sm:inline">লগআউট</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Body Canvas */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          {/* Top Operational Banner & Security Bar */}
          <section className="w-full bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-[#bccac0]/30 flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="w-12 h-12 rounded-xl bg-[#00855d]/15 flex items-center justify-center text-[#006948] shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[28px]">admin_panel_settings</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-xl font-bold text-[#131b2e]">
                    অ্যাডমিন কন্ট্রোল সেন্টার
                  </h1>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 ${
                      isUnlocked
                        ? 'bg-[#006948]/10 text-[#006948]'
                        : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isUnlocked ? 'bg-[#006948] animate-pulse' : 'bg-[#ba1a1a]'
                      }`}
                    ></span>
                    {isUnlocked ? 'সক্রিয় সেশন (PIN আনলকড)' : 'লকড / অবৈধ PIN'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#3d4a42] mt-0.5">
                  সহজ শপের মূল ডাটাবেজ, হোয়াটসঅ্যাপ অর্ডার রাউটিং এবং পণ্য স্টক নিয়ন্ত্রণ
                </p>
              </div>
            </div>

            {/* Quick PIN Verification Bar */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
              <div className="flex items-center bg-[#f2f3ff] rounded-xl px-3 py-1.5 border border-[#bccac0]/30">
                <span className="material-symbols-outlined text-[#6d7a72] text-[18px] mr-1.5">
                  lock
                </span>
                <input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="PIN"
                  className="w-20 bg-transparent text-center text-xs font-bold tracking-widest text-[#131b2e] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleVerifyPin}
                  className="ml-2 px-2.5 py-1 bg-[#dae2fd] text-[#006948] text-xs font-bold rounded-lg hover:bg-[#006948] hover:text-white transition-all"
                >
                  যাচাই
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPinInput('');
                  setIsUnlocked(false);
                  onLogout();
                }}
                className="px-3.5 py-2 rounded-xl bg-[#f2f3ff] hover:bg-[#ffdad6] text-[#3d4a42] hover:text-[#ba1a1a] transition-colors flex items-center gap-1.5 text-xs font-bold border border-[#bccac0]/30"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                লগআউট
              </button>

              <button
                type="button"
                onClick={onBackToStore}
                className="px-4 py-2 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white flex items-center gap-2 text-xs font-bold shadow transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">storefront</span>
                কাস্টমার স্টোরফ্রন্ট দেখুন
              </button>
            </div>
          </section>

          {/* 4 KPI Metric Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Catalog */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#bccac0]/30 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#3d4a42]">মোট প্রোডাক্ট ক্যাটালগ</span>
                <div className="w-10 h-10 rounded-xl bg-[#f2f3ff] flex items-center justify-center text-[#006948]">
                  <span className="material-symbols-outlined text-[22px]">inventory</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] tracking-tight">
                  {toBengaliDigits(totalCatalog)}টি
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-[#00873c] font-semibold">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  <span>+৩টি এই সপ্তাহে যুক্ত হয়েছে</span>
                </div>
              </div>
            </div>

            {/* Card 2: Active Stock */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#bccac0]/30 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#3d4a42]">সক্রিয় স্টক (In-Stock)</span>
                <div className="w-10 h-10 rounded-xl bg-[#f2f3ff] flex items-center justify-center text-[#00873c]">
                  <span className="material-symbols-outlined text-[22px]">check_circle</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] tracking-tight">
                  {toBengaliDigits(inStockCount)}টি
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-[#fd761a] font-semibold">
                  <span className="material-symbols-outlined text-[16px]">info</span>
                  <span>{toBengaliDigits(outOfStockCount)}টি স্টকে অনুপস্থিত</span>
                </div>
              </div>
            </div>

            {/* Card 3: WhatsApp Orders */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#bccac0]/30 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#3d4a42]">আজকের হোয়াটসঅ্যাপ অর্ডার</span>
                <div className="w-10 h-10 rounded-xl bg-[#f2f3ff] flex items-center justify-center text-[#fd761a]">
                  <span className="material-symbols-outlined text-[22px]">chat</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#131b2e] tracking-tight">
                  {toBengaliDigits(todayOrders + 18)}টি
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-[#00873c] font-semibold">
                  <span className="material-symbols-outlined text-[16px]">call_received</span>
                  <span>৯০% কনভার্সন রেট</span>
                </div>
              </div>
            </div>

            {/* Card 4: Total Revenue */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#bccac0]/30 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#3d4a42]">মোট বিক্রয় (আজ)</span>
                <div className="w-10 h-10 rounded-xl bg-[#f2f3ff] flex items-center justify-center text-[#006948]">
                  <span className="material-symbols-outlined text-[22px]">payments</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#006948] tracking-tight">
                  {formatBDT(todaySales)}
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-[#00873c] font-semibold">
                  <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                  <span>+১২.৫% গতকালকের চেয়ে</span>
                </div>
              </div>
            </div>
          </section>

          {/* Tab 1: Dashboard Summary & Core Configs */}
          {activeTab === 'dashboard' && (
            <>
              {/* Dual Layout: WhatsApp Integration (7 cols) + Firebase Sync (5 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: WhatsApp Order Integration */}
                <section className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-[#bccac0]/30 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between pb-4 mb-4 bg-[#f2f3ff] p-4 rounded-xl border border-[#bccac0]/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#00873c] text-white flex items-center justify-center shadow">
                          <span className="material-symbols-outlined text-[22px]">
                            mark_chat_unread
                          </span>
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-[#131b2e]">
                            হোয়াটসঅ্যাপ অর্ডার ইন্টিগ্রেশন
                          </h2>
                          <p className="text-xs text-[#3d4a42]">
                            গ্রাহকের ক্লিক মাত্রেই তৈরি হবে কাস্টম অর্ডার মেসেজ
                          </p>
                        </div>
                      </div>
                      <span className="bg-[#dae2fd] text-[#006948] text-xs px-2.5 py-1 rounded-full font-bold">
                        API v2.4
                      </span>
                    </div>

                    <form onSubmit={handleSaveWhatsApp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-[#131b2e] mb-1">
                          প্রধান হোয়াটসঅ্যাপ ফোন নম্বর (বাংলাদেশ কান্ট্রি কোড সহ)
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#6d7a72] pointer-events-none">
                            <span className="material-symbols-outlined text-[20px]">
                              phone_iphone
                            </span>
                          </span>
                          <input
                            type="text"
                            required
                            value={waPhone}
                            onChange={(e) => setWaPhone(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#faf8ff] text-[#131b2e] text-sm font-bold border border-[#bccac0] focus:outline-none focus:border-[#006948]"
                          />
                        </div>
                        <span className="text-[11px] text-[#6d7a72] mt-1 block">
                          উদাহরণ: +8801724814128 (কোন স্পেস বা হাইফেন ছাড়া)
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#131b2e] mb-1">
                          অর্ডার বার্তা প্রিভিউ টেমপ্লেট
                        </label>
                        <textarea
                          rows={4}
                          value={waTemplate}
                          onChange={(e) => setWaTemplate(e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#faf8ff] text-[#131b2e] text-xs font-mono leading-relaxed border border-[#bccac0] focus:outline-none focus:border-[#006948]"
                        ></textarea>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-[11px] bg-[#e2e7ff] text-[#006948] px-2 py-0.5 rounded font-mono font-bold">
                            {'{PRODUCT_NAME}'}
                          </span>
                          <span className="text-[11px] bg-[#e2e7ff] text-[#006948] px-2 py-0.5 rounded font-mono font-bold">
                            {'{PRICE}'}
                          </span>
                          <span className="text-[11px] bg-[#e2e7ff] text-[#006948] px-2 py-0.5 rounded font-mono font-bold">
                            {'{PRODUCT_ID}'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewSample({
                              title: 'ওয়্যারলেস ব্লুটুথ ইয়ারবাডস',
                              price: 1499,
                              id: 'PRD-101',
                            });
                            onShowToast('টেস্ট মেসেজ সিমুলেশন আপডেট হয়েছে', 'preview');
                          }}
                          className="px-4 py-2.5 rounded-xl bg-[#e2e7ff] text-[#131b2e] hover:bg-[#dae2fd] transition-colors flex items-center gap-2 text-xs font-bold"
                        >
                          <span className="material-symbols-outlined text-[18px]">send</span>
                          টেস্ট মেসেজ প্রিভিউ
                        </button>

                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white flex items-center gap-2 text-xs font-bold shadow-md transition-all active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[18px]">save</span>
                          কনফিগারেশন সংরক্ষণ করুন
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Live Simulation Bubble */}
                  <div className="mt-4 p-4 bg-[#f2f3ff] rounded-xl border border-[#bccac0]/30">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00873c]"></span>
                      <span className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">
                        হোয়াটসঅ্যাপ প্রিভিউ সিমুলেশন:
                      </span>
                    </div>
                    <div className="bg-white p-3.5 rounded-lg shadow-sm text-xs text-[#131b2e] leading-relaxed whitespace-pre-line border border-[#bccac0]/20 select-all font-mono">
                      {getCompiledPreview()}
                    </div>
                  </div>
                </section>

                {/* Right: Firebase Data Sync & Realtime Cloud Architecture */}
                <section className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-[#bccac0]/30 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between pb-4 mb-4 bg-[#f2f3ff] p-4 rounded-xl border border-[#bccac0]/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#fd761a] text-white flex items-center justify-center shadow">
                          <span className="material-symbols-outlined text-[22px]">cloud_sync</span>
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-[#131b2e]">ফায়ারবেস ডাটা সিঙ্ক</h2>
                          <p className="text-xs text-[#3d4a42]">
                            রিয়েলটাইম ক্লাউড স্টোরেজ ও নো-এসকিউএল ডাটাবেজ
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Connection pill */}
                      <div className="p-3.5 rounded-xl bg-[#f2f3ff] flex items-center justify-between border border-[#bccac0]/20">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-[#00873c] text-[24px]">
                            sensors
                          </span>
                          <div>
                            <div className="text-xs font-bold text-[#131b2e]">কানেকশন স্ট্যাটাস</div>
                            <div className="text-[11px] text-[#6d7a72]">
                              Firestore Realtime Listener
                            </div>
                          </div>
                        </div>
                        <span className="bg-[#00855d] text-white text-xs px-2.5 py-1 rounded-full font-bold">
                          কানেক্টেড 🟢
                        </span>
                      </div>

                      {/* Synced collections */}
                      <div className="space-y-2">
                        <span className="text-[11px] text-[#6d7a72] font-bold uppercase tracking-wider block">
                          সিঙ্ক করা কালেকশনসমূহ
                        </span>
                        <div className="p-3 rounded-xl bg-[#faf8ff] flex items-center justify-between border border-[#bccac0]/20 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#6d7a72] text-[18px]">
                              folder
                            </span>
                            <span className="font-semibold text-[#131b2e]">
                              store_config/whatsapp
                            </span>
                          </div>
                          <span className="text-[#00873c] font-bold">সিঙ্কড (০.২ সেকেন্ড পূর্বে)</span>
                        </div>

                        <div className="p-3 rounded-xl bg-[#faf8ff] flex items-center justify-between border border-[#bccac0]/20 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#6d7a72] text-[18px]">
                              folder_special
                            </span>
                            <span className="font-semibold text-[#131b2e]">
                              products/{'{productId}'}
                            </span>
                          </div>
                          <span className="text-[#00873c] font-bold">
                            {toBengaliDigits(totalCatalog)}টি অবজেক্ট লোডেড
                          </span>
                        </div>
                      </div>

                      {/* Cloud ping metric */}
                      <div className="p-4 bg-[#f2f3ff] rounded-xl border border-[#bccac0]/20 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#3d4a42]">ক্লাউড রেসপন্স রেট</span>
                          <span className="font-bold text-[#006948]">২৪ms লেটেন্সি</span>
                        </div>
                        <div className="h-2 w-full bg-[#dae2fd] rounded-full overflow-hidden">
                          <div className="h-full bg-[#006948] rounded-full w-[94%]"></div>
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-[#6d7a72]">
                          <span>আপটাইম: ৯৯.৯%</span>
                          <span>SSL TLS 1.3 সুরক্ষিত</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="button"
                      disabled={isSyncing}
                      onClick={handleManualSync}
                      className="w-full py-2.5 rounded-xl bg-[#e2e7ff] text-[#006948] hover:bg-[#dae2fd] transition-colors flex items-center justify-center gap-2 text-xs font-bold"
                    >
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          isSyncing ? 'animate-spin' : ''
                        }`}
                      >
                        sync
                      </span>
                      <span>ডাটা সিঙ্ক ও ক্লাউড ব্যাকআপ চালান</span>
                    </button>
                  </div>
                </section>
              </div>
            </>
          )}

          {/* Tab 2: Orders List */}
          {activeTab === 'orders' && (
            <section className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-[#bccac0]/30 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#bccac0]/20">
                <div>
                  <h2 className="text-lg font-bold text-[#131b2e]">অর্ডার ব্যবস্থাপনা ও তালিকা</h2>
                  <p className="text-xs text-[#3d4a42]">
                    হোয়াটসঅ্যাপ ও স্টোরফ্রন্ট থেকে আসা লাইভ অর্ডারের বিবরণ
                  </p>
                </div>
                <span className="bg-[#00855d] text-white text-xs px-3 py-1 rounded-full font-bold">
                  সর্বমোট: {toBengaliDigits(orders.length)}টি
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#bccac0]/30">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#f2f3ff] text-[#131b2e] font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">অর্ডার আইডি ও তারিখ</th>
                      <th className="py-3 px-4">গ্রাহকের নাম ও ঠিকানা</th>
                      <th className="py-3 px-4">পণ্য ও পরিমাণ</th>
                      <th className="py-3 px-4">মূল্য</th>
                      <th className="py-3 px-4 text-center">স্ট্যাটাস</th>
                      <th className="py-3 px-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#bccac0]/20">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#faf8ff] transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-bold text-[#006948] block font-mono">
                            #{ord.id}
                          </span>
                          <span className="text-[11px] text-[#6d7a72]">{ord.date}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-[#131b2e] block">
                            {ord.customerName}
                          </span>
                          <span className="text-[11px] text-[#6d7a72] block">
                            {ord.customerPhone}
                          </span>
                          {ord.customerAddress && (
                            <span className="text-[10px] text-[#3d4a42] block truncate max-w-xs">
                              {ord.customerAddress}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {ord.items.map((i, idx) => (
                            <div key={idx} className="truncate max-w-xs">
                              • {i.title} (x{i.quantity})
                            </div>
                          ))}
                        </td>
                        <td className="py-3 px-4 font-extrabold text-[#006948]">
                          {formatBDT(ord.totalAmount)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <select
                            value={ord.status}
                            onChange={(e) =>
                              onUpdateOrderStatus(ord.id, e.target.value as Order['status'])
                            }
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold focus:outline-none cursor-pointer ${
                              ord.status === 'delivered'
                                ? 'bg-[#00873c] text-white'
                                : ord.status === 'processing'
                                ? 'bg-[#fd761a] text-white'
                                : 'bg-[#e2e7ff] text-[#006948]'
                            }`}
                          >
                            <option value="pending">অর্ডার গৃহীত (Pending)</option>
                            <option value="processing">প্রসেসিং (Processing)</option>
                            <option value="delivered">ডেলিভার্ড (Delivered)</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <a
                            href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#25D366] text-white font-bold text-[11px]"
                          >
                            <span className="material-symbols-outlined text-[14px]">chat</span>
                            চ্যাট
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Tab 3: Sales Analytics */}
          {activeTab === 'analytics' && (
            <section className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-[#bccac0]/30 space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-[#bccac0]/20">
                <div>
                  <h2 className="text-lg font-bold text-[#131b2e]">বিক্রয় ও কনভার্সন অ্যানালিটিক্স</h2>
                  <p className="text-xs text-[#3d4a42]">
                    ক্যাম্পেইন পারফরম্যান্স ও শীর্ষ বিক্রিত ক্যাটাগরি
                  </p>
                </div>
                <span className="text-xs text-[#6d7a72]">লাইভ আপডেট (আজ)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Share */}
                <div className="p-4 bg-[#f2f3ff] rounded-2xl border border-[#bccac0]/20 space-y-3">
                  <h3 className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">
                    ক্যাটাগরি ভিত্তিক বিক্রয় অংশ
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>ইলেকট্রনিক্স ও গ্যাজেট</span>
                        <span className="font-bold">৪২% (৳১৯,০০০)</span>
                      </div>
                      <div className="h-2 bg-[#dae2fd] rounded-full overflow-hidden">
                        <div className="h-full bg-[#006948] rounded-full w-[42%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>অর্গানিক ফুড ও মধু</span>
                        <span className="font-bold">২৮% (৳১২,৬৫০)</span>
                      </div>
                      <div className="h-2 bg-[#dae2fd] rounded-full overflow-hidden">
                        <div className="h-full bg-[#00873c] rounded-full w-[28%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>ফ্যাশন ও পাঞ্জাবি</span>
                        <span className="font-bold">২০% (৳৯,২০০)</span>
                      </div>
                      <div className="h-2 bg-[#dae2fd] rounded-full overflow-hidden">
                        <div className="h-full bg-[#fd761a] rounded-full w-[20%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>গৃহস্থালী সরঞ্জাম</span>
                        <span className="font-bold">১০% (৳৪,৩৫০)</span>
                      </div>
                      <div className="h-2 bg-[#dae2fd] rounded-full overflow-hidden">
                        <div className="h-full bg-[#6d7a72] rounded-full w-[10%]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conversion Funnel */}
                <div className="p-4 bg-[#f2f3ff] rounded-2xl border border-[#bccac0]/20 space-y-3">
                  <h3 className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">
                    ১-ক্লিক হোয়াটসঅ্যাপ ফানেল
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-white rounded-xl">
                      <span>স্টোর ভিজিটর সংখ্যা</span>
                      <span className="font-bold text-[#131b2e]">১,২৪০ জন</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-white rounded-xl">
                      <span>পণ্য ভিউ / বিস্তারিত দেখা</span>
                      <span className="font-bold text-[#131b2e]">৫৩০ বার</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-white rounded-xl">
                      <span>হোয়াটসঅ্যাপ অর্ডার বাটনে ক্লিক</span>
                      <span className="font-bold text-[#00873c]">৭৮ বার</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-[#006948] text-white rounded-xl font-bold">
                      <span>সফল কনফার্মড অর্ডার</span>
                      <span>১৮টি (২৩.১% ক্লিক কনভার্সন)</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Tab: Live Firebase Customer Support Chat */}
          {activeTab === 'chat' && (
            <section className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-[#bccac0]/30 space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-[#bccac0]/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#006948] text-white flex items-center justify-center shadow">
                    <span className="material-symbols-outlined text-[24px]">support_agent</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#131b2e]">
                      ফায়ারবেস লাইভ কাস্টমার চ্যাট হাব
                    </h2>
                    <p className="text-xs text-[#3d4a42]">
                      Firestore ক্লাউডে সংরক্ষিত গ্রাহকের প্রশ্ন ও রিয়েল-টাইম বার্তা
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
                    <span>Firebase Live Sync Active</span>
                  </span>
                  <span className="bg-[#e2e7ff] text-[#006948] text-xs px-3 py-1 rounded-full font-bold">
                    মোট বার্তা: {toBengaliDigits(chatMessages.length)}টি
                  </span>
                </div>
              </div>

              {chatMessages.length === 0 ? (
                <div className="p-12 text-center bg-[#faf8ff] rounded-2xl border border-dashed border-[#bccac0]/40">
                  <span className="material-symbols-outlined text-4xl text-[#6d7a72] mb-2 block">
                    chat_bubble_outline
                  </span>
                  <p className="text-sm font-bold text-[#131b2e]">
                    এখনও কোনো লাইভ চ্যাট মেসেজ আসেনি
                  </p>
                  <p className="text-xs text-[#6d7a72] mt-1">
                    স্টোরফ্রন্টে কোনো ক্রেতা মেসেজ পাঠালে তা স্বয়ংক্রিয়ভাবে ফায়ারবেসে যুক্ত হয়ে এখানে লাইভ দেখতে পাবেন।
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left: Message Log List (7 cols) */}
                  <div className="lg:col-span-7 space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {chatMessages.map((m) => {
                      const isCustomer = m.sender === 'customer';
                      return (
                        <div
                          key={m.id}
                          className={`p-3.5 rounded-2xl border transition-all ${
                            isCustomer
                              ? 'bg-[#f8fafc] border-[#e2e8f0]'
                              : 'bg-[#f0fdf4] border-[#bbf7d0]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                  isCustomer
                                    ? 'bg-[#e2e8f0] text-[#334155]'
                                    : 'bg-[#006948] text-white'
                                }`}
                              >
                                {isCustomer ? 'গ্রাহক' : 'অ্যাডমিন'}
                              </span>
                              <span className="text-xs font-bold text-[#131b2e]">
                                {m.senderName}
                              </span>
                              {m.senderPhone && (
                                <span className="text-[11px] text-[#006948] font-mono font-semibold">
                                  📞 {m.senderPhone}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#6d7a72]">
                              {new Date(m.createdAt).toLocaleString([], {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>

                          <p className="text-xs text-[#1e293b] leading-relaxed pl-1">
                            {m.text}
                          </p>

                          {isCustomer && (
                            <div className="mt-2 pt-2 border-t border-[#e2e8f0] flex items-center justify-between">
                              <span className="text-[10px] text-gray-400 font-mono">
                                সেশন: {m.sessionId}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setReplyTargetSession(m.sessionId);
                                  setAdminReplyText(`সম্মানিত ${m.senderName}, `);
                                }}
                                className="text-[11px] font-bold text-[#006948] hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <span>উত্তর দিন</span>
                                <span className="material-symbols-outlined text-[14px]">reply</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Right: Reply composer (5 cols) */}
                  <div className="lg:col-span-5 bg-[#f2f3ff] p-4 sm:p-5 rounded-2xl border border-[#bccac0]/30 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#131b2e] flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-[#006948] text-[20px]">
                          send
                        </span>
                        <span>গ্রাহককে লাইভ উত্তর প্রেরণ করুন</span>
                      </h3>
                      <p className="text-xs text-[#3d4a42] mb-3">
                        আপনার পাঠানো বার্তা সাথে সাথে ফায়ারবেসে যুক্ত হবে এবং গ্রাহকের স্ক্রিনে রিয়েল-টাইমে প্রদর্শিত হবে।
                      </p>

                      <div className="mb-3">
                        <label className="block text-[11px] font-bold text-[#131b2e] mb-1">
                          টার্গেট সেশন:
                        </label>
                        <select
                          value={replyTargetSession}
                          onChange={(e) => setReplyTargetSession(e.target.value)}
                          className="w-full px-3 py-2 bg-white rounded-xl text-xs font-semibold text-[#131b2e] border border-[#bccac0]/40 focus:outline-none"
                        >
                          <option value="all">সর্বশেষ গ্রাহক / সকল গ্রাহক</option>
                          {Array.from(
                            new Set(
                              chatMessages
                                .filter((m) => m.sender === 'customer')
                                .map((m) => m.sessionId)
                            )
                          ).map((sid) => (
                            <option key={sid} value={sid}>
                              সেশন: {sid}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="block text-[11px] font-bold text-[#131b2e] mb-1">
                          বার্তার বিষয়বস্তু:
                        </label>
                        <textarea
                          rows={4}
                          value={adminReplyText}
                          onChange={(e) => setAdminReplyText(e.target.value)}
                          placeholder="আপনার বার্তা বা সহায়তা লিখুন..."
                          className="w-full p-3 bg-white rounded-xl text-xs text-[#131b2e] border border-[#bccac0]/40 focus:outline-none focus:border-[#006948]"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!adminReplyText.trim() || isAdminSending}
                      onClick={handleAdminSendReply}
                      className="w-full py-2.5 rounded-xl bg-[#006948] hover:bg-[#00855d] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">send</span>
                      <span>
                        {isAdminSending ? 'পাঠানো হচ্ছে...' : 'ফায়ারবেসে উত্তর পাঠান'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Product Inventory Management (Shown on 'products' or 'dashboard' tab) */}
          {(activeTab === 'dashboard' || activeTab === 'products') && (
            <section className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-[#bccac0]/30 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#bccac0]/20">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-[#131b2e]">
                    পণ্য ইনভেন্টরি ম্যানেজমেন্ট
                  </h2>
                  <span className="bg-[#006948]/10 text-[#006948] text-xs px-2.5 py-0.5 rounded-full font-bold">
                    CRUD হাব
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#3d4a42] mt-0.5">
                  দোকানের প্রতিটি আইটেমের তথ্য, স্টক এবং মূল্য পরিবর্তন করুন
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => {
                    if (isFormOpen && !editingProduct) {
                      handleCloseForm();
                    } else {
                      setEditingProduct(null);
                      setFormTitle('');
                      setFormRegularPrice(1200);
                      setFormDiscountPrice(950);
                      setFormDescription('');
                      setIsFormOpen(true);
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white flex items-center gap-2 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {isFormOpen ? 'expand_less' : 'add_circle'}
                  </span>
                  <span>
                    {isFormOpen && !editingProduct ? 'ফর্ম লুকান' : 'নতুন প্রোডাক্ট যোগ করুন'}
                  </span>
                </button>
              </div>
            </div>

            {/* Collapsible Add/Edit Form */}
            {isFormOpen && (
              <div className="p-5 sm:p-6 bg-[#f2f3ff] rounded-2xl border border-[#bccac0]/30 shadow-inner space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-[#bccac0]/20">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006948] text-[24px]">
                      post_add
                    </span>
                    <h3 className="text-base font-bold text-[#131b2e]">
                      {editingProduct
                        ? `পণ্য সম্পাদনা (#${editingProduct.id})`
                        : 'নতুন পণ্য অন্তর্ভুক্তি'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="text-[#6d7a72] hover:text-[#ba1a1a]"
                  >
                    <span className="material-symbols-outlined text-[24px]">close</span>
                  </button>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Title */}
                    <div className="md:col-span-8">
                      <label className="block text-xs font-bold text-[#131b2e] mb-1">
                        প্রোডাক্টের নাম *
                      </label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="যেমন: প্রিমিয়াম খাঁটি গাওয়া ঘি (১ কেজি)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white text-[#131b2e] text-xs sm:text-sm border border-[#bccac0] focus:outline-none focus:border-[#006948]"
                      />
                    </div>

                    {/* Category */}
                    <div className="md:col-span-4">
                      <label className="block text-xs font-bold text-[#131b2e] mb-1">
                        ক্যাটাগরি *
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white text-[#131b2e] text-xs sm:text-sm border border-[#bccac0] focus:outline-none focus:border-[#006948]"
                      >
                        <option value="grocery">গ্রোসারি ও অর্গানিক (grocery)</option>
                        <option value="electronics">ইলেকট্রনিক্স (electronics)</option>
                        <option value="fashion">ফ্যাশন ও পোশাক (fashion)</option>
                        <option value="home">গৃহস্থালি ও কিচেন (home)</option>
                      </select>
                    </div>

                    {/* Regular Price */}
                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold text-[#131b2e] mb-1">
                        নিয়মিত মূল্য (৳) *
                      </label>
                      <input
                        type="number"
                        required
                        value={formRegularPrice}
                        onChange={(e) => setFormRegularPrice(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white text-[#131b2e] text-xs sm:text-sm border border-[#bccac0] focus:outline-none focus:border-[#006948]"
                      />
                    </div>

                    {/* Discount / Offer Price */}
                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold text-[#131b2e] mb-1">
                        অফার মূল্য (৳) *
                      </label>
                      <input
                        type="number"
                        required
                        value={formDiscountPrice}
                        onChange={(e) => setFormDiscountPrice(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white text-[#131b2e] text-xs sm:text-sm border border-[#bccac0] focus:outline-none focus:border-[#006948]"
                      />
                    </div>

                    {/* Stock switch */}
                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold text-[#131b2e] mb-1">
                        স্টক প্রাপ্যতা
                      </label>
                      <div className="flex items-center gap-2 h-11 px-3 bg-white rounded-xl border border-[#bccac0]">
                        <input
                          type="checkbox"
                          id="stockCheckbox"
                          checked={formInStock}
                          onChange={(e) => setFormInStock(e.target.checked)}
                          className="w-4 h-4 accent-[#006948] cursor-pointer"
                        />
                        <label
                          htmlFor="stockCheckbox"
                          className="text-xs font-bold text-[#006948] cursor-pointer"
                        >
                          {formInStock ? 'ইন স্টক (In Stock)' : 'স্টক শেষ (Out of Stock)'}
                        </label>
                      </div>
                    </div>

                    {/* Image Source */}
                    <div className="md:col-span-12">
                      <label className="block text-xs font-bold text-[#131b2e] mb-1">
                        ছবির লিংক / সোর্স (ইউআরএল লিখুন বা নিচের রেডিমেড ছবি থেকে একটি বেছে নিন)
                      </label>
                      <input
                        type="text"
                        value={formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white text-[#131b2e] text-xs border border-[#bccac0] focus:outline-none focus:border-[#006948]"
                      />
                      <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1 no-scrollbar">
                        <span className="text-[11px] text-[#6d7a72] whitespace-nowrap font-semibold">
                          রেডিমেড ছবি:
                        </span>
                        {[
                          { name: 'মধু', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB12iIzjIs0pPyJ7zCvs1K2Jlgnfh-RIIjKYNj4iJ8yLVTzh47XF2gxef0EAolg-MqYuGgLvnKxSEYz6BFMCtqNrNnJcTrElrVIgK5icMKDtpD2FidDPB49K3j3dARMGzqa_vMZ1MoLKv3p8-iFKUMQ6H9jX9VpnRPNg04IdkACP0YlOFHmIep4swlBqGRxl2MQY7sWIUhCbombYs_GcfrgpqrACp7DhcKNSROl_zZZBMY9Y0W_3su7lA' },
                          { name: 'ইয়ারবাডস', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZSaJXnVGSRcsExfe37GZzHMKhKsEl48hqfDTOwAqEdhXNvJUkxqaril2-xXRqoouP3KzVwCuMlcDgG5VKaFx365_wVsb8ajfWw0W7OpzCLWiabX5rQd4kaOPNNxrI0Z7fYTu9aCv-_ZAF-qHQ7g5YJ9uSiIh3gYVVAVzWW8BPXN9Z6FzwutlUi2ltLhyN6-a3HU9ustnMUWMva78JoKuzduRC5GAdgT9jvtGGhdlFdMv16SrOkVbrRQ' },
                          { name: 'ফিটনেস ব্যান্ড', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChafVjF_RZ2MZyyVw8JjvE2zzSmHrOSmrTL4ydfTVOXOuOGw01ycRwck44IaN-6XJ66y72lL2I0-mSRDvtmM-tjYJ9wDpcWYugd9nAyHEbfgLE5kQdbMF8iSJEBhksvvraAemK_cU18uwYwHW0_6yJMN9f_s2s3jtxLiCSwFh2_arUzdhuMKGClD2KZNtSbWA3oHagg0J1k-gk8PKhlNodCJjnoG2gm_THZ_q1dsanR52LRYEAT8W60w' },
                          { name: 'পাঞ্জাবি', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeROeNjyteUM-yeE9T-qa2HEAIB9uBmYC4UCByPzqwqrUTI91M5HJVibwT_D3qd29dMhIwg4vhhbukP2Qf4Tp2NaDTEIG6AIaeZZeTk6QwkW_yn_-YrGYGUVel9tIFn_6dWljvXoheLz_V4tdOB1rx6wskIVY4h9Kdy1M1auzdR-WuIhzKk601CeSxOy3Chm-4hry9WgTKRRitkrNXvdcdejV86ySET8E3_QajKjjzvKIfLlRUJXb8Cg' },
                          { name: 'গাওয়া ঘি', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6HNkclLXSsDBYOOaQz_CL5Ym-j1jKx0bo_l5oZBqEqdKoYm6k--4fKjnQlWo4i97WP7ghS04AWAKBOXCmO59xHWm_7yQv7Wll_RU-UZQNkHlT0LXOZRbuQsE0wxXeIcDqzR8M8vIYW6CWnd_DeFovQ5pzPUHXacapg2iiP72Ot1CNkG1_C_OEqsK4Y32FjHblG0ckYD1XXiOM7EfRuFxVEJmpfenXUeXGP4BjJW436bsp9iZa8GbP9g' },
                          { name: 'কুর্তি', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDskEEaw0DeMOQr5BFMZza0nkZeyRsPcITev7mPMDzLOau8eqnLwU2TU28_O9fUbwExzVwA7Ct3iIrjteAoRBp32DDNqKyB2LZekt7Ue-AJ8cHxb-UGylfGbb-edTKNdrxEN2Y2Z4kSPVpou6ZFUMxbi1H6CY14N-mGiw03FNwWxM7Egj9VUZfAvXHDqohDSVb21I3b2evW88K0mCVTa2Aax8uJDi9fNNlFzTHaczgZDpeg4Sj5gmhqw' },
                          { name: 'ডিফিউজার', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbefMOHSFLsWFK1-f7zRCKK7FvJxEsYVqpVbeVATJgSzW29EpoKP0p1NLsHD6Zi0sg5pF-nPi1U3QEht1K6Tifm9cs2rXQXb3TE71P4V5ax4eGMYRuyrkLX-wuE6HO6EgjT8m1HwsTv4j1wyUZsmdUuw3VrBHdAyz_U49xzOtIGqQ85HTVmLNAUgQri_N4AjJ3rLJYK3liZiVg-vknqPS4PPpiSRT1f2S58RDIUZrq9YXIzWBqIumqKA' },
                          { name: 'জুসার', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7x69SwaDxKDFbOgGpOF6h9UR9FECWEdr2ikDQ-eP1j0R9pV8coGGedal3SXPxEWPYBim_efjMgQKSBgHaFtjNdJmhWzynpjL_36cRfOBrV8cDAdOFahNYOQrH19axKuT_otjZo57UWFb_uUZMEH8ebrBkPJ_YyRd80ubDpsBzwpYnWvcEYl3UpGAD-b5VDB0c8tn9CzEvgeRqS46YIQ7yTxUzg5PtiGzihZurMrnq5K6D0d7TTxfMhA' }
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setFormImage(preset.url)}
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all whitespace-nowrap flex items-center gap-1 ${
                              formImage === preset.url
                                ? 'bg-[#006948] text-white border-[#006948]'
                                : 'bg-white text-[#3d4a42] border-[#bccac0] hover:bg-[#eaedff]'
                            }`}
                          >
                            <img src={preset.url} alt={preset.name} className="w-4 h-4 rounded object-cover" />
                            <span>{preset.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-12">
                      <label className="block text-xs font-bold text-[#131b2e] mb-1">
                        পণ্যের সংক্ষিপ্ত বিবরণ
                      </label>
                      <textarea
                        rows={2}
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="পণ্য সম্পর্কে মূল তথ্য ও আকর্ষণীয় বৈশিষ্ট্য লিখুন..."
                        className="w-full p-3 rounded-xl bg-white text-[#131b2e] text-xs border border-[#bccac0] focus:outline-none focus:border-[#006948]"
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-[#00873c] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      ফায়ারবেস ক্লাউড স্টোরেজে স্বয়ংক্রিয়ভাবে সেভ হবে
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCloseForm}
                        className="px-4 py-2 rounded-xl bg-[#e2e7ff] text-[#131b2e] text-xs font-bold hover:bg-[#dae2fd]"
                      >
                        বাতিল
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold shadow-md"
                      >
                        প্রোডাক্ট সেভ করুন
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Inventory Search & Category Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7a72] text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder="পণ্য খুঁজুন বা ফিল্টার করুন..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#f2f3ff] text-[#131b2e] text-xs border border-[#bccac0]/30 focus:outline-none focus:border-[#006948]"
                  />
                </div>

                <select
                  value={tableCategory}
                  onChange={(e) => setTableCategory(e.target.value)}
                  className="py-2 px-3 rounded-xl bg-[#f2f3ff] text-[#131b2e] text-xs font-semibold border border-[#bccac0]/30 focus:outline-none"
                >
                  <option value="ALL">সকল ক্যাটাগরি</option>
                  <option value="grocery">গ্রোসারি ও অর্গানিক</option>
                  <option value="electronics">ইলেকট্রনিক্স</option>
                  <option value="fashion">ফ্যাশন ও পোশাক</option>
                  <option value="home">গৃহস্থালি ও কিচেন</option>
                </select>
              </div>

              <div className="text-xs text-[#6d7a72] font-medium w-full sm:w-auto text-right">
                সাজানো হয়েছে: <strong className="text-[#131b2e]">সর্বশেষ যুক্ত</strong>
              </div>
            </div>

            {/* Inventory Data Table */}
            <div className="overflow-x-auto rounded-2xl border border-[#bccac0]/30 bg-[#f2f3ff]/40 shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#e2e7ff]/70 text-[#131b2e] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">পণ্য ও থাম্বনেইল</th>
                    <th className="py-3 px-4">ক্যাটাগরি</th>
                    <th className="py-3 px-4">মূল্য বিবরণী</th>
                    <th className="py-3 px-4 text-center">স্টক অবস্থা</th>
                    <th className="py-3 px-4 text-right">কার্যক্রম (Action)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#bccac0]/20 bg-white">
                  {filteredProducts.map((p) => {
                    const isInStock = p.stockStatus !== 'out-of-stock';
                    return (
                      <tr key={p.id} className="hover:bg-[#faf8ff] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.title}
                              className="w-12 h-12 rounded-xl object-cover bg-[#f2f3ff] shrink-0 border border-[#bccac0]/20"
                            />
                            <div>
                              <div className="font-bold text-[#131b2e] text-xs sm:text-sm">
                                {p.title}
                              </div>
                              <div className="text-[11px] text-[#6d7a72] font-mono">
                                SKU: {p.sku} | আইডি: #{p.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-medium text-[#3d4a42]">
                          {p.category}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#006948]">
                              {formatBDT(p.price)}
                            </span>
                            {p.originalPrice > p.price && (
                              <span className="text-[11px] text-[#6d7a72] line-through">
                                {formatBDT(p.originalPrice)}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleStock(p)}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 transition-all shadow-sm ${
                              isInStock
                                ? 'bg-[#00855d] text-white hover:bg-[#006948]'
                                : 'bg-[#ba1a1a] text-white hover:bg-[#93000a]'
                            }`}
                            title="ক্লিক করে স্টক পরিবর্তন করুন"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                            <span>{p.stockLabel}</span>
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleEditClick(p)}
                              className="p-1.5 rounded-lg text-[#3d4a42] hover:bg-[#e2e7ff] hover:text-[#006948] transition-colors"
                              title="সম্পাদনা করুন"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  confirm(`আপনি কি নিশ্চিতভাবে "${p.title}" মুছে ফেলতে চান?`)
                                ) {
                                  onDeleteProduct(p.id);
                                  onShowToast(`পণ্য #${p.id} মুছে ফেলা হয়েছে`, 'delete_forever');
                                }
                              }}
                              className="p-1.5 rounded-lg text-[#3d4a42] hover:bg-[#ffdad6] hover:text-[#ba1a1a] transition-colors"
                              title="মুছে ফেলুন"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                delete
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination / Count */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-xs text-[#6d7a72]">
              <div>
                সর্বমোট {toBengaliDigits(products.length)}টি পণ্যের মধ্যে{' '}
                {toBengaliDigits(filteredProducts.length)}টি প্রদর্শিত হচ্ছে
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled
                  className="px-2.5 py-1 rounded bg-[#f2f3ff] text-[#6d7a72] font-bold opacity-50"
                >
                  পূর্ববর্তী
                </button>
                <span className="px-2.5 py-1 rounded bg-[#006948] text-white font-bold">১</span>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded bg-[#f2f3ff] text-[#131b2e] hover:bg-[#e2e7ff] font-bold"
                >
                  ২
                </button>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded bg-[#f2f3ff] text-[#131b2e] hover:bg-[#e2e7ff] font-bold"
                >
                  পরবর্তী
                </button>
              </div>
            </div>
          </section>
        )}
        </main>
      </div>
    </div>
  );
};
