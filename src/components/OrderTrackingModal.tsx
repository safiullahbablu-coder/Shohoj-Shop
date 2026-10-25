import React, { useState } from 'react';
import { Order } from '../types';
import { formatBDT } from '../utils/bengali';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    orders.length > 0 ? orders[0] : null
  );

  if (!isOpen) return null;

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchVal.toLowerCase()) ||
      o.customerPhone.includes(searchVal) ||
      o.customerName.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#283044]/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-[#bccac0]/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#f2f3ff] border-b border-[#bccac0]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006948] text-[24px]">
              local_shipping
            </span>
            <h3 className="text-lg font-bold text-[#131b2e]">লাইভ অর্ডার ট্র্যাকিং</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Search Box */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6d7a72] text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="অর্ডার আইডি (যেমন ORD-8821) বা ফোন নম্বর দিন..."
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-[#faf8ff] border border-[#bccac0] text-sm text-[#131b2e] focus:outline-none focus:border-[#006948]"
            />
          </div>

          {/* Order Selector Chips if multiple match */}
          {filteredOrders.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {filteredOrders.map((ord) => (
                <button
                  key={ord.id}
                  type="button"
                  onClick={() => setSelectedOrder(ord)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedOrder?.id === ord.id
                      ? 'bg-[#006948] text-white shadow-sm'
                      : 'bg-[#f2f3ff] text-[#3d4a42] hover:bg-[#eaedff]'
                  }`}
                >
                  #{ord.id} ({ord.customerName})
                </button>
              ))}
            </div>
          )}

          {selectedOrder ? (
            <div className="space-y-5">
              {/* Status Header Banner */}
              <div className="p-4 bg-[#f2f3ff] rounded-2xl border border-[#bccac0]/30 flex flex-col sm:flex-row justify-between gap-2 items-start sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[#131b2e]">#{selectedOrder.id}</span>
                    <span className="bg-[#00873c] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {selectedOrder.status === 'delivered'
                        ? 'ডেলিভার্ড 🟢'
                        : selectedOrder.status === 'processing'
                        ? 'প্রসেসিং এ আছে 🚚'
                        : 'অর্ডার গৃহীত 📦'}
                    </span>
                  </div>
                  <p className="text-xs text-[#3d4a42] mt-0.5">{selectedOrder.date}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#6d7a72] block">সর্বমোট মূল্য</span>
                  <span className="text-lg font-extrabold text-[#006948]">
                    {formatBDT(selectedOrder.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="py-2">
                <div className="relative flex items-center justify-between">
                  <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-[#bccac0]/40 -z-0">
                    <div
                      className="h-full bg-[#006948] transition-all duration-500"
                      style={{
                        width:
                          selectedOrder.status === 'delivered'
                            ? '100%'
                            : selectedOrder.status === 'processing'
                            ? '66%'
                            : '33%',
                      }}
                    ></div>
                  </div>

                  {/* Step 1 */}
                  <div className="flex flex-col items-center relative z-10">
                    <div className="w-10 h-10 rounded-full bg-[#006948] text-white flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                    </div>
                    <span className="text-xs font-bold text-[#131b2e] mt-2">অর্ডার গৃহীত</span>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                        selectedOrder.status === 'processing' || selectedOrder.status === 'delivered'
                          ? 'bg-[#006948] text-white'
                          : 'bg-white border-2 border-[#bccac0] text-[#6d7a72]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">package_2</span>
                    </div>
                    <span className="text-xs font-bold text-[#131b2e] mt-2">প্রসেসিং সম্পন্ন</span>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                        selectedOrder.status === 'delivered'
                          ? 'bg-[#006948] text-white'
                          : 'bg-white border-2 border-[#bccac0] text-[#6d7a72]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">done_all</span>
                    </div>
                    <span className="text-xs font-bold text-[#131b2e] mt-2">হাতে পৌঁছেছে</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2 border-t border-[#bccac0]/20 pt-3">
                <span className="text-xs font-bold text-[#6d7a72] uppercase tracking-wider">
                  অর্ডারের পণ্যসমূহ
                </span>
                {selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#faf8ff] rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#131b2e]">{item.title}</span>
                      <span className="text-[#6d7a72] block">পরিমাণ: {item.quantity} টি</span>
                    </div>
                    <span className="font-bold text-[#006948]">
                      {formatBDT(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Customer info */}
              <div className="p-3.5 bg-[#f2f3ff] rounded-xl text-xs space-y-1">
                <p>
                  <strong>গ্রাহকের নাম:</strong> {selectedOrder.customerName}
                </p>
                <p>
                  <strong>মোবাইল:</strong> {selectedOrder.customerPhone}
                </p>
                {selectedOrder.customerAddress && (
                  <p>
                    <strong>ডেলিভারি ঠিকানা:</strong> {selectedOrder.customerAddress}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#6d7a72]">
              কোনো অর্ডার পাওয়া যায়নি। অনুসন্ধান পুনরায় চেক করুন।
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#f2f3ff] border-t border-[#bccac0]/30 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#006948] text-white text-xs font-bold hover:bg-[#00855d] transition-colors"
          >
            ঠিক আছে
          </button>
        </div>
      </div>
    </div>
  );
};
