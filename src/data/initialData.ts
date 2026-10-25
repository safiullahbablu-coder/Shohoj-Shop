import { Product, WhatsAppConfig, Order } from '../types';

export const INITIAL_WHATSAPP_CONFIG: WhatsAppConfig = {
  phoneNumber: '+8801724814128',
  messageTemplate: `আসসালামু আলাইকুম সহজ শপ! 🛒
আমি আপনার স্টোর থেকে নিম্নোক্ত পণ্যটি অর্ডার করতে চাই:
- পণ্য: {PRODUCT_NAME}
- মূল্য: ৳{PRICE}
- কোড: #{PRODUCT_ID}
দয়া করে আমার ডেলিভারি প্রক্রিয়া সম্পন্ন করুন।`,
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'PRD-101',
    sku: 'AUD-882',
    title: 'প্রিমিয়াম ওয়্যারলেস ব্লুটুথ ইয়ারবাডস',
    category: 'electronics',
    price: 1499,
    originalPrice: 2200,
    stockStatus: 'in-stock',
    stockLabel: 'ইন স্টক',
    badge: '২৫% ছাড়',
    badgeType: 'sale',
    rating: '৪.৯',
    reviews: '১২২',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZSaJXnVGSRcsExfe37GZzHMKhKsEl48hqfDTOwAqEdhXNvJUkxqaril2-xXRqoouP3KzVwCuMlcDgG5VKaFx365_wVsb8ajfWw0W7OpzCLWiabX5rQd4kaOPNNxrI0Z7fYTu9aCv-_ZAF-qHQ7g5YJ9uSiIh3gYVVAVzWW8BPXN9Z6FzwutlUi2ltLhyN6-a3HU9ustnMUWMva78JoKuzduRC5GAdgT9jvtGGhdlFdMv16SrOkVbrRQ',
    imageAlt: 'Matte black sleek modern wireless earbuds with charging case glowing soft emerald LED indicators on clean reflective light stone surface',
    description: 'হাই-ফাই স্টেরিও সাউন্ড, অ্যাক্টিভ নয়েজ ক্যান্সেলেশন (ANC) এবং ৩৬ ঘণ্টা পর্যন্ত দীর্ঘ ব্যাটারি লাইফ। টাইপ-সি ফাস্ট চার্জিং এবং ঘাম প্রতিরোধী ডিজাইন যা দৈনন্দিন ব্যবহারে অসাধারণ পারফরম্যান্স দেবে।'
  },
  {
    id: 'PRD-102',
    sku: 'SMT-774',
    title: 'স্মার্ট ওয়াটারপ্রুফ ফিটনেস ব্যান্ড',
    category: 'electronics',
    price: 1950,
    originalPrice: 2600,
    stockStatus: 'in-stock',
    stockLabel: 'ইন স্টক',
    badge: 'হট ডিল',
    badgeType: 'deal',
    rating: '৪.৮',
    reviews: '৮৯',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChafVjF_RZ2MZyyVw8JjvE2zzSmHrOSmrTL4ydfTVOXOuOGw01ycRwck44IaN-6XJ66y72lL2I0-mSRDvtmM-tjYJ9wDpcWYugd9nAyHEbfgLE5kQdbMF8iSJEBhksvvraAemK_cU18uwYwHW0_6yJMN9f_s2s3jtxLiCSwFh2_arUzdhuMKGClD2KZNtSbWA3oHagg0J1k-gk8PKhlNodCJjnoG2gm_THZ_q1dsanR52LRYEAT8W60w',
    imageAlt: 'Modern waterproof smartwatch fitness tracker with vibrant OLED colored display resting on charcoal textured slate',
    description: 'রিয়েলটাইম হার্ট-রেট ও রক্তে অক্সিজেনের মাত্রা ট্র্যাকিং, স্লিপ মনিটর এবং ৫০ মিটার ওয়াটার রেজিস্ট্যান্স। ফুল চার্জে ১৪ দিন পর্যন্ত ব্যাকআপ সুবিধা।'
  },
  {
    id: 'PRD-103',
    sku: 'HON-500',
    title: 'খাঁটি সুন্দরবনের প্রাকৃতিক মধু (১ কেজি)',
    category: 'grocery',
    price: 950,
    originalPrice: 1100,
    stockStatus: 'in-stock',
    stockLabel: 'ইন স্টক',
    badge: '১০০% অর্গানিক',
    badgeType: 'organic',
    rating: '৫.০',
    reviews: '২১০',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB12iIzjIs0pPyJ7zCvs1K2Jlgnfh-RIIjKYNj4iJ8yLVTzh47XF2gxef0EAolg-MqYuGgLvnKxSEYz6BFMCtqNrNnJcTrElrVIgK5icMKDtpD2FidDPB49K3j3dARMGzqa_vMZ1MoLKv3p8-iFKUMQ6H9jX9VpnRPNg04IdkACP0YlOFHmIep4swlBqGRxl2MQY7sWIUhCbombYs_GcfrgpqrACp7DhcKNSROl_zZZBMY9Y0W_3su7lA',
    imageAlt: 'Authentic organic golden natural raw honey inside clear glass jar with wooden dipper drizzling honey',
    description: 'সুন্দরবনের গভীর অরণ্য থেকে সরাসরি সংগৃহীত ১০০% প্রাকৃতিক ও খাঁটি খলিসা ফুলের মধু। কোনো প্রকার চিনি বা কৃত্রিম উপাদান মিশ্রিত নয়। ল্যাব টেস্টে পরীক্ষিত বিশুদ্ধতা।'
  },
  {
    id: 'PRD-104',
    sku: 'FAS-309',
    title: 'প্রিমিয়াম কটন হ্যান্ডলুম পাঞ্জাবি',
    category: 'fashion',
    price: 1850,
    originalPrice: 2350,
    stockStatus: 'low-stock',
    stockLabel: 'সীমিত স্টক',
    badge: 'ঈদ কালেকশন',
    badgeType: 'fashion',
    rating: '৪.৯',
    reviews: '৭৪',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeROeNjyteUM-yeE9T-qa2HEAIB9uBmYC4UCByPzqwqrUTI91M5HJVibwT_D3qd29dMhIwg4vhhbukP2Qf4Tp2NaDTEIG6AIaeZZeTk6QwkW_yn_-YrGYGUVel9tIFn_6dWljvXoheLz_V4tdOB1rx6wskIVY4h9Kdy1M1auzdR-WuIhzKk601CeSxOy3Chm-4hry9WgTKRRitkrNXvdcdejV86ySET8E3_QajKjjzvKIfLlRUJXb8Cg',
    imageAlt: 'Elegant Bengali pure cotton handloom Punjabi in pastel emerald green with delicate collar embroidery',
    description: '১০০% সুতি সুতায় নিখুঁত বোনা সুদৃশ্য হ্যান্ডলুম পাঞ্জাবি। কলার ও প্লেকেটে সুক্ষ্ম সুতার হাতের কাজ। গ্রীষ্ম ও উৎসবের জন্য আরামদায়ক ও আভিজাত্যপূর্ণ পোশাক।'
  },
  {
    id: 'PRD-105',
    sku: 'HOM-921',
    title: 'পোর্টেবল ব্লেন্ডার রিচার্জেবল জুসার',
    category: 'home',
    price: 1250,
    originalPrice: 1600,
    stockStatus: 'out-of-stock',
    stockLabel: 'স্টক শেষ',
    badge: 'স্টক শেষ',
    badgeType: 'sold-out',
    rating: '৪.৭',
    reviews: '৫৮',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7x69SwaDxKDFbOgGpOF6h9UR9FECWEdr2ikDQ-eP1j0R9pV8coGGedal3SXPxEWPYBim_efjMgQKSBgHaFtjNdJmhWzynpjL_36cRfOBrV8cDAdOFahNYOQrH19axKuT_otjZo57UWFb_uUZMEH8ebrBkPJ_YyRd80ubDpsBzwpYnWvcEYl3UpGAD-b5VDB0c8tn9CzEvgeRqS46YIQ7yTxUzg5PtiGzihZurMrnq5K6D0d7TTxfMhA',
    imageAlt: 'Compact portable USB rechargeable blender bottle with fresh fruit juice on minimal clean kitchen counter surface',
    description: 'ইউএসবি রিচার্জেবল ৬-ব্লেড পাওয়ারফুল পোর্টেবল জুসার। জিম, ভ্রমণ বা অফিসে সরাসরি ফ্রেশ জুস ও স্মুদি বানাতে সেরা সমাধান।'
  },
  {
    id: 'PRD-106',
    sku: 'HOM-442',
    title: 'অ্যারোমা এসেনশিয়াল অয়েল ডিফিউজার',
    category: 'home',
    price: 1100,
    originalPrice: 1450,
    stockStatus: 'in-stock',
    stockLabel: 'ইন স্টক',
    badge: 'বেস্ট সেলার',
    badgeType: 'deal',
    rating: '৪.৮',
    reviews: '৯৬',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbefMOHSFLsWFK1-f7zRCKK7FvJxEsYVqpVbeVATJgSzW29EpoKP0p1NLsHD6Zi0sg5pF-nPi1U3QEht1K6Tifm9cs2rXQXb3TE71P4V5ax4eGMYRuyrkLX-wuE6HO6EgjT8m1HwsTv4j1wyUZsmdUuw3VrBHdAyz_U49xzOtIGqQ85HTVmLNAUgQri_N4AjJ3rLJYK3liZiVg-vknqPS4PPpiSRT1f2S58RDIUZrq9YXIzWBqIumqKA',
    imageAlt: 'Ultrasonic essential oil diffuser emitting delicate white mist with soft amber LED ambient light',
    description: 'আল্ট্রাসনিক কুল মিস্ট টেকনোলজি এবং ৭ রঙের স্নিগ্ধ এলইডি লাইট। ঘরের বাতাস আর্দ্র রাখে এবং পছন্দের সুবাসে ঘরকে করে তোলে শান্তিময়।'
  },
  {
    id: 'PRD-107',
    sku: 'GHEE-1K',
    title: 'খাঁটি গাওয়া ঘি (১ কেজি)',
    category: 'grocery',
    price: 1450,
    originalPrice: 1650,
    stockStatus: 'in-stock',
    stockLabel: 'ইন স্টক',
    badge: 'প্রাকৃতিক স্বাদ',
    badgeType: 'organic',
    rating: '৪.৯',
    reviews: '১৪৫',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6HNkclLXSsDBYOOaQz_CL5Ym-j1jKx0bo_l5oZBqEqdKoYm6k--4fKjnQlWo4i97WP7ghS04AWAKBOXCmO59xHWm_7yQv7Wll_RU-UZQNkHlT0LXOZRbuQsE0wxXeIcDqzR8M8vIYW6CWnd_DeFovQ5pzPUHXacapg2iiP72Ot1CNkG1_C_OEqsK4Y32FjHblG0ckYD1XXiOM7EfRuFxVEJmpfenXUeXGP4BjJW436bsp9iZa8GbP9g',
    imageAlt: 'Traditional glass jar of golden aromatic organic pure cow ghee from Bangladesh village dairy farm',
    description: 'গ্রামের তাজা খাঁটি গরুর দুধের ক্রিম হতে ঐতিহ্যবাহী পদ্ধতিতে প্রস্তুতকৃত সুস্বাদু ও সুগন্ধযুক্ত গাওয়া ঘি।'
  },
  {
    id: 'PRD-108',
    sku: 'FAS-802',
    title: 'প্রিমিয়াম কটন হ্যান্ডলুম কুর্তি',
    category: 'fashion',
    price: 1850,
    originalPrice: 2200,
    stockStatus: 'in-stock',
    stockLabel: 'ইন স্টক',
    badge: 'নতুন আগমন',
    badgeType: 'fashion',
    rating: '৪.৮',
    reviews: '৮৭',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDskEEaw0DeMOQr5BFMZza0nkZeyRsPcITev7mPMDzLOau8eqnLwU2TU28_O9fUbwExzVwA7Ct3iIrjteAoRBp32DDNqKyB2LZekt7Ue-AJ8cHxb-UGylfGbb-edTKNdrxEN2Y2Z4kSPVpou6ZFUMxbi1H6CY14N-mGiw03FNwWxM7Egj9VUZfAvXHDqohDSVb21I3b2evW88K0mCVTa2Aax8uJDi9fNNlFzTHaczgZDpeg4Sj5gmhqw',
    imageAlt: 'Exquisite handwoven traditional Bengali cotton kurti with delicate needlework embroidery on pure soft neutral background',
    description: '১০০% পিওর হ্যান্ডক্রাফটেড সুতি ফেব্রিক, রুচিশীল কালার ও ঐতিহ্যবাহী নকশার মেলবন্ধন। গ্রীষ্ম ও উৎসবের জন্য আদর্শ পোশাক।'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-8821',
    customerName: 'তানভীর আহমেদ',
    customerPhone: '+8801819234567',
    customerAddress: 'হাউজ #১২, রোড #৫, মিরপুর-১০, ঢাকা',
    items: [
      { productId: 'PRD-101', title: 'প্রিমিয়াম ওয়্যারলেস ব্লুটুথ ইয়ারবাডস', price: 1499, quantity: 1 }
    ],
    totalAmount: 1499,
    status: 'delivered',
    date: '২৩ অক্টোবর ২০২৬, সকাল ১০:২৪',
    couponCode: 'SHOHOJ25'
  },
  {
    id: 'ORD-8820',
    customerName: 'নুসরাত জাহান',
    customerPhone: '+8801723456789',
    customerAddress: 'ফ্ল্যাট ৪বি, ধানমন্ডি ৩/এ, ঢাকা',
    items: [
      { productId: 'PRD-103', title: 'খাঁটি সুন্দরবনের প্রাকৃতিক মধু (১ কেজি)', price: 950, quantity: 2 },
      { productId: 'PRD-107', title: 'খাঁটি গাওয়া ঘি (১ কেজি)', price: 1450, quantity: 1 }
    ],
    totalAmount: 3350,
    status: 'processing',
    date: '২৩ অক্টোবর ২০২৬, দুপুর ১২:১৫',
    couponCode: 'SHOHOJ25'
  },
  {
    id: 'ORD-8819',
    customerName: 'মাহমুদুল হাসান',
    customerPhone: '+8801934567890',
    customerAddress: 'জিইসি মোড়, চট্টগ্রাম',
    items: [
      { productId: 'PRD-104', title: 'প্রিমিয়াম কটন হ্যান্ডলুম পাঞ্জাবি', price: 1850, quantity: 1 }
    ],
    totalAmount: 1850,
    status: 'pending',
    date: '২৩ অক্টোবর ২০২৬, দুপুর ১:০৫',
    couponCode: 'SHOHOJ25'
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'সব প্রোডাক্ট (All)', icon: 'dashboard' },
  { id: 'electronics', label: 'ইলেকট্রনিক্স', icon: 'devices' },
  { id: 'fashion', label: 'ফ্যাশন ও পোশাক', icon: 'styler' },
  { id: 'home', label: 'গৃহস্থালি ও কিচেন', icon: 'kitchen' },
  { id: 'grocery', label: 'গ্রোসারি ও অর্গানিক', icon: 'eco' }
];

export const HERO_BANNER_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDrHT5RrUjzSXB3KdGUaVKWop0-AUpodefJxJ_cP7o7X7U47fAuGXsCB08-nexcS4spANtjS2I8PjVshXd0cMXYVjNlkbZQvs8AJqRkyZ-UYCOXQ7dHwDSkAfa0ecyqz1ctn_sF_ZBTycCpJDNItCd4P98kKXWMMaP9seP-uJwJS4X6ObwVlLBZOfQoLGK6K8Mex_s8aeJ60fzxMH6psUu5fvalbB5CzPfiJdwb9W6aJ9Xq8FEO0tuh1w';

export const LOGO_IMG =
  'https://lh3.googleusercontent.com/aida/AEtjO1XyAdPdR89CLsvf3aRb45OUmq_I2j-fcmlfV1gfUR-MhSuB-FxF_fUzH-5NZBW41ktPf6qg9paF9ddBuUWY0k-gIPAXuTgIeqkgHH7cQJt3hcxGUhGB8tJsnIrTFtrcknU4K-1eENHlvuDpEn2FobveWO52AyzCA-_jBUzA7xm9TcJKragb5JtItNcU0-8hleCDsQSEgpB4Hf-XgJHDEOwMxJxmlpgpcfeJBg4QoSEGaIuJx9-WMNZ3gu4';
