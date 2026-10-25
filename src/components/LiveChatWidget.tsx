import React, { useState, useEffect, useRef } from 'react';
import {
  subscribeToChatMessages,
  sendChatMessageToFirestore,
  ChatMessage,
} from '../firebase';
import { Language } from '../types';

interface LiveChatWidgetProps {
  whatsAppPhone: string;
  lang: Language;
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({
  whatsAppPhone,
  lang,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [customerName, setCustomerName] = useState(() => {
    return localStorage.getItem('shohoj_chat_name') || '';
  });
  const [customerPhone, setCustomerPhone] = useState(() => {
    return localStorage.getItem('shohoj_chat_phone') || '';
  });
  const [sessionId] = useState(() => {
    let sid = localStorage.getItem('shohoj_chat_sid');
    if (!sid) {
      sid = 'session_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('shohoj_chat_sid', sid);
    }
    return sid;
  });

  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to real-time chat messages from Firebase Firestore
  useEffect(() => {
    const unsubscribe = subscribeToChatMessages((loadedMsgs) => {
      // Filter messages for this customer session or general store announcements
      const relevant = loadedMsgs.filter(
        (m) => m.sessionId === sessionId || m.sender === 'admin'
      );
      setMessages(relevant);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [sessionId]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const cleanPhone = whatsAppPhone.replace(/[^0-9]/g, '');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    setIsSending(true);
    const msgId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const newMsg: ChatMessage = {
      id: msgId,
      sessionId,
      sender: 'customer',
      senderName: customerName.trim() || (lang === 'bn' ? 'সম্মানিত ক্রেতা' : 'Valued Customer'),
      senderPhone: customerPhone.trim() || undefined,
      text: inputText.trim(),
      createdAt: new Date().toISOString(),
    };

    if (customerName) localStorage.setItem('shohoj_chat_name', customerName);
    if (customerPhone) localStorage.setItem('shohoj_chat_phone', customerPhone);

    try {
      await sendChatMessageToFirestore(newMsg);
      setInputText('');
    } catch (err) {
      console.error('Failed to send chat message:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <aside className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end">
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <div className="flex flex-col items-end gap-2 group">
          <div className="hidden sm:flex items-center gap-2 bg-white text-[#131b2e] px-3.5 py-1.5 rounded-full shadow-lg border border-[#bccac0]/30 transition-all opacity-95 group-hover:opacity-100">
            <span className="w-2 h-2 rounded-full bg-[#00873c] animate-ping"></span>
            <span className="text-xs font-semibold">
              {lang === 'bn' ? 'ফায়ারবেস লাইভ চ্যাট ও সাপোর্ট' : 'Firebase Live Chat & Support'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick WhatsApp button */}
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                lang === 'bn'
                  ? 'আসসালামু আলাইকুম সহজ শপ টিম! আমার একটি পণ্য সম্পর্কে জানার ছিল।'
                  : 'Hello Shohoj Shop! I have an inquiry about a product.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
              title={lang === 'bn' ? 'হোয়াটসঅ্যাপে চ্যাট করুন' : 'Chat on WhatsApp'}
            >
              <span className="material-symbols-outlined text-[24px]">chat</span>
            </a>

            {/* In-app live chat button */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#006948] hover:bg-[#00855d] text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer relative"
              title={lang === 'bn' ? 'লাইভ চ্যাট খুলুন' : 'Open Live Chat'}
            >
              <span className="material-symbols-outlined text-[28px] sm:text-[32px]">
                support_agent
              </span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#25D366] border-2 border-white rounded-full"></span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Chat Modal Box */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[380px] h-[520px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-[#bccac0]/30 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#006948] text-white p-3.5 sm:p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[22px]">
                  support_agent
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">
                  {lang === 'bn' ? 'সহজ শপ লাইভ সাপোর্ট' : 'Shohoj Shop Live Support'}
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-[#86efac]">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
                  <span>
                    {lang === 'bn' ? 'ফায়ারবেস ক্লাউড কানেক্টেড' : 'Firebase Cloud Connected'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          {/* Customer Info Form (if not set) */}
          {(!customerName || !customerPhone) && (
            <div className="bg-[#f0fdf4] border-b border-[#bbf7d0] px-3.5 py-2 text-xs flex flex-col gap-1.5">
              <span className="font-semibold text-[#166534]">
                {lang === 'bn'
                  ? 'দ্রুত উত্তরের জন্য আপনার নাম ও মোবাইল নম্বর লিখুন:'
                  : 'Enter your name & mobile number for quick assistance:'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder={lang === 'bn' ? 'আপনার নাম' : 'Your Name'}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="px-2 py-1 bg-white border border-[#86efac] rounded text-xs text-[#131b2e] focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder={lang === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="px-2 py-1 bg-white border border-[#86efac] rounded text-xs text-[#131b2e] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#f8fafc] text-xs">
            {/* Welcome message */}
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-[#006948] text-white flex items-center justify-center shrink-0 text-xs font-bold">
                সহজ
              </div>
              <div className="bg-white border border-[#e2e8f0] p-2.5 rounded-2xl rounded-tl-sm text-[#1e293b] max-w-[85%] shadow-xs">
                <p>
                  {lang === 'bn'
                    ? 'আসসালামু আলাইকুম! সহজ শপ লাইভ সাপোর্টে আপনাকে স্বাগতম। আপনার যেকোনো পণ্যের প্রশ্ন বা অর্ডারের সহায়তার জন্য লিখুন।'
                    : 'Hello! Welcome to Shohoj Shop Live Support. Please feel free to ask about any product or order assistance.'}
                </p>
                <span className="text-[10px] text-gray-400 mt-1 block">
                  {lang === 'bn' ? 'সহজ শপ টিম' : 'Shohoj Support'}
                </span>
              </div>
            </div>

            {/* List of real-time Firebase messages */}
            {messages.map((m) => {
              const isMe = m.sender === 'customer';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2 ${
                    isMe ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {!isMe && (
                    <div className="w-7 h-7 rounded-full bg-[#006948] text-white flex items-center justify-center shrink-0 text-xs font-bold">
                      অ্যাডমিন
                    </div>
                  )}
                  <div
                    className={`p-2.5 rounded-2xl max-w-[85%] shadow-xs ${
                      isMe
                        ? 'bg-[#006948] text-white rounded-tr-sm'
                        : 'bg-white border border-[#e2e8f0] text-[#1e293b] rounded-tl-sm'
                    }`}
                  >
                    {!isMe && (
                      <span className="text-[10px] font-bold text-[#006948] block mb-0.5">
                        {m.senderName}
                      </span>
                    )}
                    <p className="break-words leading-relaxed">{m.text}</p>
                    <span
                      className={`text-[9px] mt-1 block text-right ${
                        isMe ? 'text-white/70' : 'text-gray-400'
                      }`}
                    >
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick WhatsApp Action Banner */}
          <div className="bg-[#f0fdf4] border-t border-[#bbf7d0] px-3 py-1.5 flex items-center justify-between text-[11px] text-[#166534]">
            <span>{lang === 'bn' ? 'অথবা সরাসরি হোয়াটসঅ্যাপে:' : 'Or direct WhatsApp:'}</span>
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#15803d] hover:underline flex items-center gap-1"
            >
              <span>{whatsAppPhone}</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          </div>

          {/* Message Input Footer */}
          <form
            onSubmit={handleSendMessage}
            className="p-2.5 bg-white border-t border-[#e2e8f0] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={
                lang === 'bn' ? 'মেসেজ লিখুন...' : 'Type your message...'
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3 py-2 bg-[#f1f5f9] rounded-xl text-xs text-[#0f172a] focus:outline-none focus:ring-1 focus:ring-[#006948]"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="w-9 h-9 rounded-xl bg-[#006948] hover:bg-[#00855d] disabled:opacity-50 text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
      )}
    </aside>
  );
};
