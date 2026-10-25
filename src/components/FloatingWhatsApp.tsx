import React from 'react';

interface FloatingWhatsAppProps {
  whatsAppPhone: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ whatsAppPhone }) => {
  const cleanPhone = whatsAppPhone.replace(/[^0-9]/g, '');

  return (
    <aside className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2 group">
      {/* Tooltip Pill */}
      <div className="hidden sm:flex items-center gap-2 bg-white text-[#131b2e] px-3.5 py-1.5 rounded-full shadow-lg border border-[#bccac0]/30 transition-all opacity-95 group-hover:opacity-100">
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping"></span>
        <span className="text-xs font-semibold">যেকোনো তথ্যের জন্য সরাসরি চ্যাট করুন</span>
      </div>

      {/* Floating Action Button */}
      <a
        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
          'আসসালামু আলাইকুম সহজ শপ টিম! আমার একটি পণ্য সম্পর্কে জানার ছিল।'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform"
        title="হোয়াটসঅ্যাপ হেল্প ডেস্ক"
      >
        <span className="material-symbols-outlined text-[28px] sm:text-[32px]">chat</span>
      </a>
    </aside>
  );
};
