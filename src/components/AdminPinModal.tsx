import React, { useState } from 'react';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [hasError, setHasError] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin.trim() === '1234' || pin.trim() === '১২৩৪') {
      setHasError(false);
      setPin('');
      onSuccess();
    } else {
      setHasError(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#283044]/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-center space-y-4 border border-[#bccac0]/40 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#006948]/10 flex items-center justify-center text-[#006948]">
          <span className="material-symbols-outlined text-3xl">lock</span>
        </div>

        <div>
          <h3 className="text-xl font-bold text-[#131b2e]">অ্যাডমিন সিকিউরিটি অ্যাক্সেস</h3>
          <p className="text-xs sm:text-sm text-[#3d4a42] mt-1.5 leading-relaxed">
            দোকানের সেটিংস ও ইনভেন্টরি ম্যানেজ করতে ৪ ডিজিটের গোপন পিন প্রদান করুন। (ডেমো পিন:{' '}
            <strong className="text-[#006948] font-mono">১২৩৪</strong>)
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-3">
          <div className="flex justify-center">
            <input
              type="password"
              maxLength={4}
              autoFocus
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setHasError(false);
              }}
              placeholder="••••"
              className="w-44 h-14 text-center tracking-[0.5em] text-2xl font-bold rounded-2xl bg-[#f2f3ff] text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006948] shadow-inner border border-[#bccac0]/40"
            />
          </div>

          {hasError && (
            <p className="text-[#ba1a1a] text-xs font-semibold animate-shake">
              ভুল পিন নম্বর! পুনরায় চেষ্টা করুন। (সঠিক: ১২৩৪)
            </p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-[#e2e7ff] hover:bg-[#dae2fd] text-[#131b2e] text-xs sm:text-sm font-semibold transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
            >
              আনলক করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
