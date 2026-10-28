export type SupportedLang = 'ar' | 'en';

export interface LoginLocaleStrings {
  langCode: SupportedLang;
  dir: 'rtl' | 'ltr';
  langToggleLabel: string;
  heroTitle: string;
  heroDescription: string;
  heroImageAlt: string;
  cardTitle: string;
  usernameLabel: string;
  usernamePlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  showPasswordAria: string;
  hidePasswordAria: string;
  forgotPassword: string;
  signInButton: string;
  signingInStatus: string;
  footerTitle: string;
  features: {
    security: string;
    efficiency: string;
    management: string;
    service: string;
  };
  validation: {
    bothRequired: string;
    usernameRequired: string;
    passwordRequired: string;
    passwordTooShort: string;
  };
  recoveryModal: {
    title: string;
    badgeText: string;
    description: string;
    independentNote: string;
    supportContactLabel: string;
    backToLoginButton: string;
    closeAria: string;
  };
}

export const LOGIN_TRANSLATIONS: Record<SupportedLang, LoginLocaleStrings> = {
  ar: {
    langCode: 'ar',
    dir: 'rtl',
    langToggleLabel: 'تبديل لغة الواجهة بين العربية والإنجليزية',
    heroTitle: 'تسجيل الزوار والموردين',
    heroDescription: 'بوابتك الرقمية لتسجيل وإدارة الزوار والموردين',
    heroImageAlt:
      'مشهد استقبال مؤسسي حديث يظهر موظف الاستقبال يتعامل مع زائر ويسلمه بطاقة الزيارة الذكية',
    cardTitle: 'تسجيل الدخول',
    usernameLabel: 'اسم المستخدم',
    usernamePlaceholder: 'اسم المستخدم | Username',
    passwordLabel: 'كلمة المرور',
    passwordPlaceholder: 'كلمة المرور | Password',
    showPasswordAria: 'إظهار كلمة المرور',
    hidePasswordAria: 'إخفاء كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور؟',
    signInButton: 'تسجيل الدخول',
    signingInStatus: 'جاري التحقق وتسجيل الدخول...',
    footerTitle: 'نظام تسجيل الزوار والموردين',
    features: {
      security: 'أمان وموثوقية',
      efficiency: 'سهولة وسرعة',
      management: 'إدارة منظمة',
      service: 'خدمة أفضل',
    },
    validation: {
      bothRequired: 'يرجى إدخال اسم المستخدم وكلمة المرور للمتابعة.',
      usernameRequired: 'يرجى إدخال اسم المستخدم.',
      passwordRequired: 'يرجى إدخال كلمة المرور.',
      passwordTooShort:
        'كلمة المرور المدخلة قصيرة جداً (يجب ألا تقل عن 3 أحرف). يرجى التحقق من البيانات.',
    },
    recoveryModal: {
      title: 'استعادة كلمة المرور | Forgot Password',
      badgeText: 'تنبيه النظام',
      description:
        'تعتمد آلية المصادقة الحالية في النظام على التحقق المباشر من جلسة المستخدم دون خادم خلفي لإرسال روابط إعادة التعيين الآلية.',
      independentNote:
        'خدمة استعادة كلمة المرور الذاتية غير مفعّلة حالياً في هذا الإصدار وتحتاج إلى تنفيذ مستقل وربطها بخادم البريد المؤسسي أو خدمة إدارة الهوية.',
      supportContactLabel:
        'للمساعدة الفورية في بيانات الدخول، يرجى التواصل مع مسؤول النظام أو إدارة المرافق (Logistic@saher.ae).',
      backToLoginButton: 'حسناً، العودة إلى تسجيل الدخول',
      closeAria: 'إغلاق نافذة استعادة كلمة المرور',
    },
  },
  en: {
    langCode: 'en',
    dir: 'ltr',
    langToggleLabel: 'Switch interface language between Arabic and English',
    heroTitle: 'Visitors & Suppliers Registration System',
    heroDescription: 'Your Digital Gateway for Visitor and Supplier Management',
    heroImageAlt:
      'Modern corporate reception lobby showing a receptionist welcoming a visitor and handing over a smart visitor badge',
    cardTitle: 'Sign In',
    usernameLabel: 'Username',
    usernamePlaceholder: 'Username | اسم المستخدم',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Password | كلمة المرور',
    showPasswordAria: 'Show Password',
    hidePasswordAria: 'Hide Password',
    forgotPassword: 'Forgot Password?',
    signInButton: 'Sign In',
    signingInStatus: 'Verifying & Signing In...',
    footerTitle: 'Visitors & Suppliers Registration System',
    features: {
      security: 'Security & Reliability',
      efficiency: 'Ease & Efficiency',
      management: 'Organized Management',
      service: 'Better Service',
    },
    validation: {
      bothRequired: 'Please enter both your username and password to continue.',
      usernameRequired: 'Please enter your username.',
      passwordRequired: 'Please enter your password.',
      passwordTooShort:
        'The entered password is too short (minimum 3 characters required). Please check your credentials.',
    },
    recoveryModal: {
      title: 'Forgot Password? | استعادة كلمة المرور',
      badgeText: 'System Notice',
      description:
        'The current authentication mechanism validates user sessions directly without a backend mail server for automated password reset links.',
      independentNote:
        'Automated self-service password recovery is not currently implemented in this build and requires independent backend integration with corporate directory or email services.',
      supportContactLabel:
        'For immediate assistance with your credentials, please contact the System Administrator or Facilities Management (Logistic@saher.ae).',
      backToLoginButton: 'Back to Sign In',
      closeAria: 'Close password recovery dialog',
    },
  },
};

const LANG_STORAGE_KEY = 'saher_portal_lang';

export function getInitialLanguage(): SupportedLang {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'ar' || saved === 'en') {
      return saved;
    }
  } catch {
    // Ignore storage read restrictions
  }
  return 'ar';
}

export function persistLanguage(lang: SupportedLang): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Ignore storage write restrictions
  }
}

export interface AuthValidationResult {
  valid: boolean;
  field?: 'both' | 'username' | 'password';
  errorMessage?: string;
}

export function validateCredentials(
  username: string,
  password: string,
  lang: SupportedLang
): AuthValidationResult {
  const t = LOGIN_TRANSLATIONS[lang];
  const trimmedUser = username.trim();

  if (!trimmedUser && !password) {
    return { valid: false, field: 'both', errorMessage: t.validation.bothRequired };
  }
  if (!trimmedUser) {
    return { valid: false, field: 'username', errorMessage: t.validation.usernameRequired };
  }
  if (!password) {
    return { valid: false, field: 'password', errorMessage: t.validation.passwordRequired };
  }
  if (password.length < 3) {
    return { valid: false, field: 'password', errorMessage: t.validation.passwordTooShort };
  }

  return { valid: true };
}
