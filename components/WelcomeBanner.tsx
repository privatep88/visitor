import React from 'react';
import { PartyPopper, X } from 'lucide-react';

interface WelcomeBannerProps {
  isVisible: boolean;
  onDismiss: () => void;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ isVisible, onDismiss }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="bg-gradient-to-l from-[#07162C] via-[#102a52] to-[#07162C] border border-[#F4BF19]/60 rounded-2xl px-4 py-3 mb-4 flex items-center justify-between shadow-md animate-fadeIn print:hidden"
      role="alert"
    >
      <div className="flex items-center gap-3.5">
        <div className="bg-[#F4BF19]/15 border border-[#F4BF19]/40 p-2 rounded-xl shadow-inner shrink-0">
          <PartyPopper className="w-5 h-5 text-[#F4BF19]" />
        </div>
        <div>
          <h4 className="font-bold text-sm sm:text-base text-white">
            أهلاً بك في نظام تسجيل الزوار والموردين!
          </h4>
          <p className="text-xs sm:text-sm text-slate-200/90 mt-0.5">
            يمكنك البدء بتسجيل دخول جديد أو استعراض السجلات السابقة من الأزرار أدناه.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="text-[#FFD45B] hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer shrink-0"
        aria-label="إغلاق رسالة الترحيب"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};

export default WelcomeBanner;
