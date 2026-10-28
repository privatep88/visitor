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
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between animate-fadeIn" role="alert">
      <div className="flex items-center gap-4">
        <div className="bg-white/70 p-2 rounded-lg shadow-sm">
          <PartyPopper className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h4 className="font-bold text-blue-800">أهلاً بك في نظام تسجيل الزوار والموردين!</h4>
          <p className="text-sm text-blue-700">يمكنك البدء بتسجيل دخول جديد أو استعراض السجلات السابقة من الأزرار أدناه.</p>
        </div>
      </div>
      <button 
        onClick={onDismiss} 
        className="text-blue-500 hover:bg-blue-100 p-2 rounded-full transition-colors"
        aria-label="إغلاق رسالة الترحيب"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default WelcomeBanner;
