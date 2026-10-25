import { Product, CartItem, Language } from '../types';

export const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliDigits(num: number | string): string {
  return String(num).replace(/[0-9]/g, (digit) => BENGALI_DIGITS[parseInt(digit, 10)]);
}

export function formatPrice(amount: number, lang: Language = 'bn'): string {
  const formatted = amount.toLocaleString('en-IN');
  if (lang === 'en') {
    return `৳${formatted}`;
  }
  return '৳' + toBengaliDigits(formatted);
}

export function formatBDT(amount: number): string {
  return formatPrice(amount, 'bn');
}

export interface CustomerOrderData {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryArea: string;
  deliveryCharge: number;
  couponCode?: string;
  items: {
    product: Product;
    quantity: number;
  }[];
  totalAmount: number;
}

export function buildFullWhatsAppOrderUrl(
  phone: string,
  data: CustomerOrderData,
  lang: Language = 'bn'
): string {
  // Normalize phone (ensure Bangladesh country code 88)
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('01')) {
    cleanPhone = '88' + cleanPhone;
  }

  let text = '';

  if (lang === 'bn') {
    text = `🛒 *সহজ শপ - নতুন অর্ডার কনফার্মেশন* 🛒\n\n`;
    text += `👤 *গ্রাহকের তথ্য:*\n`;
    text += `• নাম: ${data.customerName}\n`;
    text += `• মোবাইল: ${data.customerPhone}\n`;
    text += `• ঠিকানা: ${data.customerAddress}\n`;
    text += `• এলাকা: ${data.deliveryArea}\n\n`;

    text += `📦 *অর্ডারকৃত পণ্যসমূহ:*\n`;
    data.items.forEach((item, index) => {
      text += `\n${index + 1}. *${item.product.title}*\n`;
      text += `   • কোড: #${item.product.id} (SKU: ${item.product.sku})\n`;
      text += `   • পরিমাণ: ${toBengaliDigits(item.quantity)} টি\n`;
      text += `   • মূল্য: ৳${toBengaliDigits(item.product.price * item.quantity)}\n`;
      text += `   • ছবি: ${item.product.image}\n`;
    });

    text += `\n💰 *হিসাব:*\n`;
    text += `• ডেলিভারি চার্জ: ৳${toBengaliDigits(data.deliveryCharge)}\n`;
    if (data.couponCode) {
      text += `• কুপন কোড: ${data.couponCode}\n`;
    }
    text += `• *সর্বমোট পরিশোধযোগ্য: ৳${toBengaliDigits(data.totalAmount)}*\n\n`;
    text += `দয়া করে অর্ডারটি দ্রুত প্রসেসিং করে ডেলিভারি নিশ্চিত করুন। ধন্যবাদ!`;
  } else {
    text = `🛒 *Shohoj Shop - New Order Confirmation* 🛒\n\n`;
    text += `👤 *Customer Details:*\n`;
    text += `• Name: ${data.customerName}\n`;
    text += `• Phone: ${data.customerPhone}\n`;
    text += `• Address: ${data.customerAddress}\n`;
    text += `• Delivery Area: ${data.deliveryArea}\n\n`;

    text += `📦 *Ordered Items:*\n`;
    data.items.forEach((item, index) => {
      text += `\n${index + 1}. *${item.product.title}*\n`;
      text += `   • Code: #${item.product.id} (SKU: ${item.product.sku})\n`;
      text += `   • Quantity: ${item.quantity}\n`;
      text += `   • Price: ৳${item.product.price * item.quantity}\n`;
      text += `   • Photo: ${item.product.image}\n`;
    });

    text += `\n💰 *Total Calculation:*\n`;
    text += `• Delivery Fee: ৳${data.deliveryCharge}\n`;
    if (data.couponCode) {
      text += `• Coupon: ${data.couponCode}\n`;
    }
    text += `• *Total Amount: ৳${data.totalAmount}*\n\n`;
    text += `Please process and confirm my order. Thank you!`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function buildWhatsAppOrderUrl(
  phone: string,
  template: string,
  product: Product,
  coupon = 'SHOHOJ25'
): string {
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('01')) {
    cleanPhone = '88' + cleanPhone;
  }

  let text = template
    .replace(/{PRODUCT_NAME}/g, product.title)
    .replace(/{PRICE}/g, toBengaliDigits(product.price))
    .replace(/{PRODUCT_ID}/g, product.id);

  if (coupon && !text.includes(coupon)) {
    text += `\nকুপন কোড: ${coupon} (ফ্রি হোম ডেলিভারি)`;
  }
  text += `\nপণ্যের ছবি: ${product.image}`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function buildCartWhatsAppOrderUrl(
  phone: string,
  items: CartItem[],
  totalAmount: number,
  coupon = 'SHOHOJ25'
): string {
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('01')) {
    cleanPhone = '88' + cleanPhone;
  }

  let msg = `আসসালামু আলাইকুম সহজ শপ! 🛒\nআমি নিম্নোক্ত পণ্যগুলো অর্ডার করতে চাই:\n\n`;

  items.forEach((item, idx) => {
    msg += `${idx + 1}. ${item.product.title}\n   কোড: #${item.product.id} | পরিমাণ: ${toBengaliDigits(item.quantity)} টি | মূল্য: ৳${toBengaliDigits(item.product.price * item.quantity)}\n   ছবি: ${item.product.image}\n`;
  });

  msg += `\nসর্বমোট মূল্য: ${formatBDT(totalAmount)}`;
  if (coupon) {
    msg += `\nকুপন কোড: ${coupon} (ঈদ স্পেশাল অফার)`;
  }
  msg += `\n\nঅনুগ্রহ করে আমার ডেলিভারি প্রক্রিয়া সম্পন্ন করার বিস্তারিত জানান।`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
}
