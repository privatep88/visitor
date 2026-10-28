export type SupportedLang = 'ar' | 'en';

export interface FeatureItemTranslation {
  id: 'security' | 'efficiency' | 'management' | 'service';
  title: string;
}

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
    description: string;
    inputLabel: string;
    inputPlaceholder: string;
    submitButton: string;
    cancelButton: string;
    backToLoginButton: string;
    closeAria: string;
    requiredError: string;
    successTitle: string;
    successNotice: string;
  };
}

export const LOGIN_TRANSLATIONS: Record<SupportedLang, LoginLocaleStrings> = {
  ar: {
    langCode: 'ar',
    dir: 'rtl',
    langToggleLabel: 'تبديل اللغة إلى الإنجليزية',
    heroTitle: 'تسجيل الزوار والموردين',
    heroDescription: 'بوابتك الرقمية لتسجيل وإدارة الزوار والموردين',
    heroImageAlt: 'بهو استقبال مؤسسي حديث يظهر موظف الاستقبال يرحب بزائر يرتدي الزي الإماراتي التقليدي ويسلمه بطاقة الدخول',
    cardTitle: 'تسجيل الدخول',
    usernameLabel: 'اسم المستخدم',
    usernamePlaceholder: 'اسم المستخدم',
    passwordLabel: 'كلمة المرور',
    passwordPlaceholder: 'كلمة المرور',
    showPasswordAria: 'إظهار كلمة المرور',
    hidePasswordAria: 'إخفاء كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور؟',
    signInButton: 'تسجيل الدخول',
    signingInStatus: 'جاري تسجيل الدخول...',
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
      passwordTooShort: 'كلمة المرور المدخلة قصيرة جداً. يرجى التحقق من البيانات.',
    },
    recoveryModal: {
      title: 'استعادة كلمة المرور',
      description:
        'لاستعادة كلمة المرور أو إعادة تعيين بيانات الدخول الخاصة بك، يرجى إدخال اسم المستخدم المؤسسي أو التواصل مع إدارة المرافق والدعم الفني.',
      inputLabel: 'اسم المستخدم أو البريد المؤسسي',
      inputPlaceholder: 'username@saher.ae',
      submitButton: 'إرسال طلب الاستعادة',
      cancelButton: 'إلغاء',
      backToLoginButton: 'العودة إلى تسجيل الدخول',
      closeAria: 'إغلاق النافذة',
      requiredError: 'يرجى إدخال اسم المستخدم أو البريد الإلكتروني المؤسسي.',
      successTitle: 'تم تسجيل طلب استعادة كلمة المرور',
      successNotice:
        'يرجى مراجعة مسؤول النظام أو التواصل مع قسم إدارة المرافق (Logistic@saher.ae) لإتمام إعادة تعيين كلمة المرور.',
    },
  },
  en: {
    langCode: 'en',
    dir: 'ltr',
    langToggleLabel: 'Switch language to Arabic',
    heroTitle: 'Visitors & Suppliers Registration System',
    heroDescription: 'Your Digital Gateway for Visitor and Supplier Management',
    heroImageAlt: 'Modern UAE corporate reception lobby showing a receptionist welcoming a visitor in traditional Emirati attire',
    cardTitle: 'Sign In',
    usernameLabel: 'Username',
    usernamePlaceholder: 'Username',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Password',
    showPasswordAria: 'Show Password',
    hidePasswordAria: 'Hide Password',
    forgotPassword: 'Forgot Password?',
    signInButton: 'Sign In',
    signingInStatus: 'Signing In...',
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
      passwordTooShort: 'The entered password is too short. Please check your credentials.',
    },
    recoveryModal: {
      title: 'Forgot Password?',
      description:
        'To recover or reset your account credentials, please enter your corporate username or contact the Facilities Management & IT Support desk.',
      inputLabel: 'Username or Corporate Email',
      inputPlaceholder: 'username@saher.ae',
      submitButton: 'Submit Recovery Request',
      cancelButton: 'Cancel',
      backToLoginButton: 'Back to Sign In',
      closeAria: 'Close modal',
      requiredError: 'Please enter your username or corporate email address.',
      successTitle: 'Password Recovery Request Recorded',
      successNotice:
        'Please contact your system administrator or Facilities Management division (Logistic@saher.ae) to complete your password reset.',
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
    return { valid: false, errorMessage: t.validation.bothRequired };
  }
  if (!trimmedUser) {
    return { valid: false, errorMessage: t.validation.usernameRequired };
  }
  if (!password) {
    return { valid: false, errorMessage: t.validation.passwordRequired };
  }
  if (password.length < 3) {
    return { valid: false, errorMessage: t.validation.passwordTooShort };
  }

  return { valid: true };
}
