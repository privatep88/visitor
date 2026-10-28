import React, { useState, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  KeyRound,
  ArrowLeft,
  ArrowRight,
  X,
  Info,
} from 'lucide-react';
import {
  SupportedLang,
  LOGIN_TRANSLATIONS,
  getInitialLanguage,
  persistLanguage,
  validateCredentials,
} from './loginTranslations';

interface LoginPageProps {
  onLoginSuccess: (username: string) => void;
}

/**
 * Decorative Golden Emblem (3 Visitors/Users + Smart ID Card Badge)
 * Matches the top-left institutional emblem from the reference design.
 * Pure SVG vector — contains zero embedded text.
 */
const GoldenVisitorsEmblem: React.FC<{ className?: string }> = ({
  className = 'w-20 h-20',
}) => (
  <svg
    viewBox="0 0 104 104"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <defs>
      <linearGradient id="goldEmblemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F7E2AA" />
        <stop offset="45%" stopColor="#DFBE77" />
        <stop offset="100%" stopColor="#B48532" />
      </linearGradient>
    </defs>
    {/* Center Person Head */}
    <circle cx="52" cy="23" r="11.5" fill="url(#goldEmblemGrad)" />
    {/* Left Person Head */}
    <circle cx="24" cy="34" r="9" fill="url(#goldEmblemGrad)" />
    {/* Right Person Head */}
    <circle cx="80" cy="34" r="9" fill="url(#goldEmblemGrad)" />
    {/* Left Person Shoulders */}
    <path
      d="M7 66C7 55.5 14.2 48.5 24 48.5C28.2 48.5 31.8 49.8 34.6 52.1C31.4 56.3 29.5 61.5 29.5 67.5V72H10.5C8.6 72 7 70.4 7 68.5V66Z"
      fill="url(#goldEmblemGrad)"
    />
    {/* Right Person Shoulders */}
    <path
      d="M97 66C97 55.5 89.8 48.5 80 48.5C75.8 48.5 72.2 49.8 69.4 52.1C72.6 56.3 74.5 61.5 74.5 67.5V72H93.5C95.4 72 97 70.4 97 68.5V66Z"
      fill="url(#goldEmblemGrad)"
    />
    {/* Center Person Shoulders Arch */}
    <path
      d="M28.5 60C28.5 47.5 38.8 39 52 39C65.2 39 75.5 47.5 75.5 60V64H70V58C70 53 66 49 61 49H43C38 49 34 53 34 58V64H28.5V60Z"
      fill="url(#goldEmblemGrad)"
    />
    {/* Smart Visitor ID Card Badge */}
    <rect
      x="36"
      y="53"
      width="32"
      height="38"
      rx="6"
      fill="url(#goldEmblemGrad)"
    />
    {/* Badge Top Clip */}
    <rect x="47" y="48" width="10" height="6" rx="2" fill="#F7E2AA" />
    {/* Badge Avatar Silhouette Cutout */}
    <circle cx="47.5" cy="69" r="4.5" fill="#06214F" />
    <path
      d="M40.5 82.5C40.5 78.6 43.6 75.8 47.5 75.8C51.4 75.8 54.5 78.6 54.5 82.5V84H40.5V82.5Z"
      fill="#06214F"
    />
    {/* Badge Info Lines Cutout */}
    <rect x="56.5" y="68" width="7" height="3" rx="1.5" fill="#06214F" />
    <rect x="56.5" y="74" width="7" height="3" rx="1.5" fill="#06214F" />
  </svg>
);

/**
 * Corporate Towers Emblem at top of the Login Card
 * Matches the blue & gold architectural towers + orbital swoosh ring in the reference card.
 */
const SystemTowersLogo: React.FC<{ className?: string }> = ({
  className = 'w-20 h-20',
}) => (
  <svg
    viewBox="0 0 108 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <defs>
      <linearGradient id="towerBlueMain" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#267CE8" />
        <stop offset="55%" stopColor="#00499E" />
        <stop offset="100%" stopColor="#002659" />
      </linearGradient>
      <linearGradient id="towerBlueDark" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1251AD" />
        <stop offset="100%" stopColor="#062252" />
      </linearGradient>
      <linearGradient id="towerGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F6DF9E" />
        <stop offset="50%" stopColor="#DAB05C" />
        <stop offset="100%" stopColor="#AD7E29" />
      </linearGradient>
    </defs>

    {/* Left Golden Tower */}
    <path d="M29 41L43 30V75H29V41Z" fill="url(#towerGold)" />
    <path d="M24 44L29 41V75H24V44Z" fill="#B58631" />

    {/* Center Tall Royal Blue Tower */}
    <path d="M47 20L62 9V76H47V20Z" fill="url(#towerBlueMain)" />
    <path d="M62 9L66 12.5V76H62V9Z" fill="#051F4B" />

    {/* Right Blue Tower */}
    <path d="M69 30L82 40V74H69V30Z" fill="url(#towerBlueDark)" />

    {/* Orbital Swoosh Ring */}
    <path
      d="M18 71C20 81 42 87 66 81C84 76.5 96 66 90 57.5C88 54 83.5 52 79 51C84.5 54.5 85.5 60 79 65C69.5 73.5 47 77.5 30 74.5C22.5 73 18.5 69.5 20.5 66L18 71Z"
      fill="url(#towerBlueMain)"
    />
    <path
      d="M22 76.5C34 85 62 86 83 75.5C65 83 38 82 22 76.5Z"
      fill="url(#towerGold)"
    />
  </svg>
);

/**
 * Custom Outline Input Icons matching the Reference Design
 */
const InputUserIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M5 20c0-3.866 3.134-7 7-7s7 3.134 7 7" />
  </svg>
);

const InputLockKeyholeIcon: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <rect x="4" y="11" width="16" height="10" rx="2.5" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    <circle cx="12" cy="15.5" r="1" fill="currentColor" />
    <path d="M12 16.5v2" />
  </svg>
);

/**
 * Four Golden Line Feature Icons matching the bottom-left bar in the Reference Design
 */
const FeatureShieldIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M18 4L6.5 9V17.5C6.5 25.2 11.4 31.8 18 34C24.6 31.8 29.5 25.2 29.5 17.5V9L18 4Z"
      stroke="#E6C370"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13 18.5L16.5 22L23.5 15"
      stroke="#E6C370"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FeatureClockIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <circle
      cx="18"
      cy="18"
      r="13.5"
      stroke="#E6C370"
      strokeWidth="2.1"
    />
    <path
      d="M18 10.5V18.5L23.5 21.5"
      stroke="#E6C370"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FeaturePeopleIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <circle cx="18" cy="11.5" r="4.2" stroke="#E6C370" strokeWidth="2" />
    <circle cx="9.5" cy="14" r="3.2" stroke="#E6C370" strokeWidth="1.9" />
    <circle cx="26.5" cy="14" r="3.2" stroke="#E6C370" strokeWidth="1.9" />
    <path
      d="M10.5 28.5V26C10.5 22.1 13.9 19 18 19C22.1 19 25.5 22.1 25.5 26V28.5"
      stroke="#E6C370"
      strokeWidth="2.1"
      strokeLinecap="round"
    />
    <path
      d="M4 28.5V26.5C4 23.6 6.2 21.2 9.2 21"
      stroke="#E6C370"
      strokeWidth="1.9"
      strokeLinecap="round"
    />
    <path
      d="M32 28.5V26.5C32 23.6 29.8 21.2 26.8 21"
      stroke="#E6C370"
      strokeWidth="1.9"
      strokeLinecap="round"
    />
  </svg>
);

const FeatureGearIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <circle cx="18" cy="18" r="4.5" stroke="#E6C370" strokeWidth="2.1" />
    <path
      d="M18 5.5V8.5M18 27.5V30.5M5.5 18H8.5M27.5 18H30.5M9.2 9.2L11.4 11.4M24.6 24.6L26.8 26.8M26.8 9.2L24.6 11.4M11.4 24.6L9.2 26.8"
      stroke="#E6C370"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <circle
      cx="18"
      cy="18"
      r="9.5"
      stroke="#E6C370"
      strokeWidth="2"
      strokeDasharray="4 2.5"
    />
  </svg>
);

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [lang, setLang] = useState<SupportedLang>(() => getInitialLanguage());
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [invalidField, setInvalidField] = useState<'both' | 'username' | 'password' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  // Forgot password modal state
  const [isForgotOpen, setIsForgotOpen] = useState<boolean>(false);

  const isRTL = lang === 'ar';
  const t = LOGIN_TRANSLATIONS[lang];
  const ar = LOGIN_TRANSLATIONS.ar;
  const en = LOGIN_TRANSLATIONS.en;

  useEffect(() => {
    persistLanguage(lang);
  }, [lang]);

  // Pre-fill saved username if available in localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('saher_auth_user');
      if (savedUser) {
        setUsername(savedUser);
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const handleLanguageChange = (newLang: SupportedLang) => {
    setLang(newLang);
    if (errorMessage) {
      const revalidated = validateCredentials(username, password, newLang);
      setErrorMessage(revalidated.errorMessage || null);
      setInvalidField(revalidated.field || null);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage(null);
    setInvalidField(null);

    const validation = validateCredentials(username, password, lang);
    if (!validation.valid) {
      setErrorMessage(validation.errorMessage || t.validation.bothRequired);
      setInvalidField(validation.field || 'both');
      return;
    }

    const trimmedUser = username.trim();
    setIsSubmitting(true);

    window.setTimeout(() => {
      try {
        localStorage.setItem('saher_auth_user', trimmedUser);
      } catch {
        // Ignore storage quota issues
      }
      setIsSubmitting(false);
      onLoginSuccess(trimmedUser);
    }, 450);
  };

  const closeForgotModal = () => {
    setIsForgotOpen(false);
  };

  // Close modal on Escape key
  useEffect(() => {
    if (!isForgotOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeForgotModal();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isForgotOpen]);

  const featureItems = [
    {
      id: 'security',
      icon: FeatureShieldIcon,
      arText: ar.features.security,
      enText: en.features.security,
    },
    {
      id: 'efficiency',
      icon: FeatureClockIcon,
      arText: ar.features.efficiency,
      enText: en.features.efficiency,
    },
    {
      id: 'management',
      icon: FeaturePeopleIcon,
      arText: ar.features.management,
      enText: en.features.management,
    },
    {
      id: 'service',
      icon: FeatureGearIcon,
      arText: ar.features.service,
      enText: en.features.service,
    },
  ];

  const receptionImageSrc = `${
    typeof import.meta !== 'undefined' &&
    import.meta.env &&
    typeof import.meta.env.BASE_URL === 'string'
      ? import.meta.env.BASE_URL.endsWith('/')
        ? import.meta.env.BASE_URL
        : `${import.meta.env.BASE_URL}/`
      : './'
  }assets/reception-scene.png`;

  const isUsernameInvalid = invalidField === 'both' || invalidField === 'username';
  const isPasswordInvalid = invalidField === 'both' || invalidField === 'password';

  return (
    <div
      dir={t.dir}
      lang={t.langCode}
      className="min-h-screen w-full relative overflow-x-hidden flex flex-col justify-between select-text bg-[#041838]"
      style={{
        background:
          'radial-gradient(circle at 24% 18%, #144ca4 0%, #082961 46%, #03122c 100%)',
      }}
    >
      {/* =====================================================================
          1. BACKGROUND VISUAL LAYERS:
             - Independent Reception Scene Photo on Left-Center Canvas
             - Seamless Institutional Blue Gradient Masks
             - Top-Right & Bottom Blue/Gold Geometric Curves (SVG)
         ===================================================================== */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden z-0"
      >
        {/* Top-Right Sweeping Royal Blue & Cyan Geometric Arc */}
        <svg
          viewBox="0 0 1600 960"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <linearGradient id="topRightArcGrad" x1="60%" y1="0%" x2="100%" y2="55%">
              <stop offset="0%" stopColor="#1e6bd6" stopOpacity="0.42" />
              <stop offset="50%" stopColor="#082e6b" stopOpacity="0.72" />
              <stop offset="100%" stopColor="#031129" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <path
            d="M1120,0 C1260,115 1410,145 1600,45 L1600,960 L960,960 C1100,660 1220,350 1120,0 Z"
            fill="url(#topRightArcGrad)"
          />
          <path
            d="M1415,0 C1325,110 1215,190 1090,245"
            fill="none"
            stroke="#56bdf8"
            strokeOpacity="0.32"
            strokeWidth="2.2"
          />
        </svg>
      </div>

      {/* Top Navigation Bar with AR | EN Switcher in the Top-Right Corner */}
      <header className="relative z-30 w-full max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 pt-4 sm:pt-6 flex items-center justify-end">
        <div
          role="group"
          aria-label={t.langToggleLabel}
          dir="ltr"
          className="inline-flex items-center rounded-full p-[3px] border border-[#dfbe77]/90 bg-[#051a3d]/85 backdrop-blur-md shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
        >
          <button
            type="button"
            onClick={() => handleLanguageChange('ar')}
            aria-pressed={lang === 'ar'}
            className={`min-w-[46px] min-h-[32px] px-3.5 py-1 rounded-full text-xs sm:text-sm font-extrabold font-english tracking-wide transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
              lang === 'ar'
                ? 'bg-gradient-to-b from-[#f6dfa2] via-[#e2be70] to-[#c79942] text-[#061c42] shadow-sm'
                : 'text-white/90 hover:text-white'
            }`}
          >
            AR
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('en')}
            aria-pressed={lang === 'en'}
            className={`min-w-[46px] min-h-[32px] px-3.5 py-1 rounded-full text-xs sm:text-sm font-extrabold font-english tracking-wide transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
              lang === 'en'
                ? 'bg-gradient-to-b from-[#f6dfa2] via-[#e2be70] to-[#c79942] text-[#061c42] shadow-sm'
                : 'text-white/90 hover:text-white'
            }`}
          >
            EN
          </button>
        </div>
      </header>

      {/* =====================================================================
          2. MAIN TWO-COLUMN COMPOSITION:
             - Left Showcase (Hero Titles + Seamless Reception Photo + 4 Feature Pillars)
             - Right Sign-In Card
         ===================================================================== */}
      <main className="relative z-20 flex-1 flex items-center w-full max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 pb-10 sm:pb-14 pt-2">
        {/* Keep Left Showcase on Left and Login Card on Right on Desktop (lg), while respecting inner RTL/LTR text alignment */}
        <div
          dir="ltr"
          className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-10 items-center"
        >
          {/* LEFT SECTION (7 Columns on Desktop): Hero Header + Reception Visual + 4 Feature Pillars */}
          <section
            dir={t.dir}
            aria-label={
              isRTL
                ? 'القسم التعريفي لنظام تسجيل الزوار والموردين'
                : 'Visitors & Suppliers Registration System Introduction'
            }
            className="lg:col-span-7 flex flex-col justify-between order-2 lg:order-1 relative"
          >
            {/* A. Top-Left Identity Block: Golden Emblem + Vertical Gold Divider + Selectable Bilingual Titles */}
            <div
              dir="ltr"
              className="relative z-20 flex items-center gap-4 sm:gap-6 px-1 sm:px-2 mb-2 sm:mb-3"
            >
              {/* Golden Visitors & ID Badge Emblem */}
              <div className="shrink-0">
                <GoldenVisitorsEmblem className="w-16 h-16 sm:w-20 sm:h-20 xl:w-24 xl:h-24 drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]" />
              </div>

              {/* Vertical Golden Line Separating Icon from Text */}
              <div
                aria-hidden="true"
                className="w-[2.5px] self-stretch min-h-[88px] sm:min-h-[112px] rounded-full bg-gradient-to-b from-[#f6dfa4] via-[#dfbe77] to-[#b48532] shrink-0 shadow-[0_0_10px_rgba(223,190,119,0.35)]"
              />

              {/* Real Selectable HTML Headings & Descriptions */}
              <div
                dir={t.dir}
                className={`flex-1 min-w-0 space-y-1.5 ${
                  isRTL ? 'text-right lg:text-left' : 'text-left'
                }`}
              >
                {isRTL ? (
                  <>
                    <h1 className="text-2xl sm:text-3xl xl:text-[42px] font-extrabold text-white leading-tight tracking-tight font-arabic drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                      {ar.heroTitle}
                    </h1>
                    <h2
                      dir="ltr"
                      className="text-base sm:text-xl xl:text-[24px] font-bold text-white leading-snug font-english drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
                    >
                      {en.heroTitle}
                    </h2>
                    <div className="pt-1.5 space-y-1">
                      <p className="text-sm sm:text-lg xl:text-[21px] font-medium text-white/95 leading-relaxed font-arabic drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
                        {ar.heroDescription}
                      </p>
                      <p
                        dir="ltr"
                        className="text-xs sm:text-sm xl:text-[15.5px] font-normal text-slate-100/95 leading-relaxed font-english drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]"
                      >
                        {en.heroDescription}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="text-xl sm:text-2xl xl:text-[31px] font-extrabold text-white leading-tight tracking-tight font-english drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                      {en.heroTitle}
                    </h1>
                    <h2
                      dir="rtl"
                      className="text-xl sm:text-2xl xl:text-[34px] font-bold text-white leading-snug font-arabic drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
                    >
                      {ar.heroTitle}
                    </h2>
                    <div className="pt-1.5 space-y-1">
                      <p className="text-xs sm:text-base xl:text-[17px] font-medium text-white/95 leading-relaxed font-english drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
                        {en.heroDescription}
                      </p>
                      <p
                        dir="rtl"
                        className="text-sm sm:text-base xl:text-[19px] font-normal text-slate-100/95 leading-relaxed font-arabic drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]"
                      >
                        {ar.heroDescription}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* B. Photorealistic Corporate Reception Scene (Seamless Visual Blend + Bottom Feature Bar) */}
            <div className="relative w-full mt-1">
              {/* Reception Scene Image Container */}
              <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-[380px] xl:h-[425px] rounded-2xl lg:rounded-3xl overflow-hidden">
                {!imageError ? (
                  <img
                    src={receptionImageSrc}
                    alt={t.heroImageAlt}
                    width={905}
                    height={502}
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover object-left sm:object-center select-none"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#072252] via-[#0d3b82] to-[#041533] flex items-center justify-center">
                    <GoldenVisitorsEmblem className="w-24 h-24 opacity-30" />
                  </div>
                )}

                {/* Soft Top, Right, Left & Bottom Gradient Feathering to blend into Royal Blue Canvas */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#092b66]/85 via-[#092b66]/30 to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-28 bg-gradient-to-l from-[#06204d]/85 via-[#06204d]/30 to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#06204d]/50 to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-28 sm:h-36 bg-gradient-to-t from-[#041738] via-[#061f4c]/85 to-transparent"
                />
              </div>

              {/* C. Four Feature Pillars Row at Bottom of Left Section (Matching Reference Layout) */}
              <div
                dir="ltr"
                className="relative z-20 -mt-12 sm:-mt-16 px-2 sm:px-6 pt-2 pb-1"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-5 gap-x-1 items-start">
                  {featureItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={item.id}
                        className={`flex flex-col items-center text-center px-2 sm:px-3 ${
                          index < featureItems.length - 1
                            ? 'sm:border-r sm:border-white/25'
                            : ''
                        }`}
                      >
                        <div className="mb-2 flex items-center justify-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
                          <IconComponent className="w-7 h-7 sm:w-8 sm:h-8" />
                        </div>

                        {isRTL ? (
                          <>
                            <span
                              dir="rtl"
                              className="text-xs sm:text-[15px] font-bold text-white leading-snug font-arabic drop-shadow-sm"
                            >
                              {item.arText}
                            </span>
                            <span
                              dir="ltr"
                              className="text-[11px] sm:text-xs font-medium text-white/90 leading-snug font-english mt-0.5"
                            >
                              {item.enText}
                            </span>
                          </>
                        ) : (
                          <>
                            <span
                              dir="ltr"
                              className="text-xs sm:text-[14px] font-bold text-white leading-snug font-english drop-shadow-sm"
                            >
                              {item.enText}
                            </span>
                            <span
                              dir="rtl"
                              className="text-[11px] sm:text-xs font-medium text-white/90 leading-snug font-arabic mt-0.5"
                            >
                              {item.arText}
                            </span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT SECTION (5 Columns on Desktop): Light Institutional Login Card */}
          <section
            dir={t.dir}
            aria-label={isRTL ? 'لوحة تسجيل الدخول' : 'Sign In Panel'}
            className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2 relative z-30"
          >
            <div className="w-full max-w-[465px] rounded-[28px] bg-gradient-to-b from-[#f8fbff] via-[#f2f7fd] to-[#ebf3fc] border border-white/95 shadow-[0_28px_70px_rgba(2,10,28,0.65)] px-6 sm:px-10 py-8 sm:py-10 text-[#0a2e65] flex flex-col justify-between">
              {/* Top Section: Architectural Logo + Sign In Headings */}
              <div>
                <div className="flex flex-col items-center text-center mb-6 sm:mb-7">
                  <SystemTowersLogo className="w-20 h-20 sm:w-24 sm:h-22 mb-2.5 drop-shadow-sm" />

                  {isRTL ? (
                    <>
                      <h2 className="text-2xl sm:text-[32px] font-extrabold text-[#0b3574] leading-tight font-arabic">
                        {ar.cardTitle}
                      </h2>
                      <p
                        dir="ltr"
                        className="text-lg sm:text-[22px] font-bold text-[#0e3f88] mt-0.5 font-english"
                      >
                        {en.cardTitle}
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl sm:text-[30px] font-extrabold text-[#0b3574] leading-tight font-english">
                        {en.cardTitle}
                      </h2>
                      <p
                        dir="rtl"
                        className="text-xl sm:text-[26px] font-bold text-[#0e3f88] mt-0.5 font-arabic"
                      >
                        {ar.cardTitle}
                      </p>
                    </>
                  )}

                  {/* Golden Divider Line Below Sign In */}
                  <div
                    aria-hidden="true"
                    className="w-14 h-[3px] rounded-full bg-gradient-to-r from-[#d4a84f] via-[#ebd08e] to-[#d4a84f] mt-3.5"
                  />
                </div>

                {/* Validation / Error Message Alert */}
                {errorMessage && (
                  <div
                    id="login-error-message"
                    role="alert"
                    aria-live="assertive"
                    className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <span className="font-semibold leading-relaxed">{errorMessage}</span>
                  </div>
                )}

                {/* Interactive Sign In Form */}
                <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
                  {/* 1. Username Field */}
                  <div>
                    <label
                      htmlFor="login-username"
                      className="flex items-center justify-between text-xs sm:text-[13px] font-bold text-[#163d77] mb-1.5 px-1 cursor-pointer"
                    >
                      {isRTL ? (
                        <>
                          <span className="font-arabic">{ar.usernameLabel}</span>
                          <span dir="ltr" className="font-english text-xs text-[#4b6790]">
                            {en.usernameLabel}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="font-english">{en.usernameLabel}</span>
                          <span dir="rtl" className="font-arabic text-xs text-[#4b6790]">
                            {ar.usernameLabel}
                          </span>
                        </>
                      )}
                    </label>

                    <div className="relative flex items-center">
                      {/* Icon positioned on the left (matching reference) in LTR or right in RTL */}
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-y-0 flex items-center text-[#0c3c82] ${
                          isRTL ? 'right-0 pr-4' : 'left-0 pl-4'
                        }`}
                      >
                        <InputUserIcon className="w-5 h-5" />
                      </span>

                      <input
                        id="login-username"
                        name="username"
                        type="text"
                        required
                        autoComplete="username"
                        aria-invalid={isUsernameInvalid}
                        aria-describedby={errorMessage ? 'login-error-message' : undefined}
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          if (errorMessage) {
                            setErrorMessage(null);
                            setInvalidField(null);
                          }
                        }}
                        placeholder={t.usernamePlaceholder}
                        className={`w-full min-h-[54px] py-3 rounded-xl bg-white border ${
                          isUsernameInvalid
                            ? 'border-red-400 focus:border-red-600 focus:ring-red-500/15'
                            : 'border-[#c9d9ee] focus:border-[#004799] focus:ring-[#004799]/15'
                        } text-[#0a2958] placeholder-[#567096] text-sm sm:text-base font-medium shadow-[inset_0_1px_2px_rgba(10,41,88,0.04)] transition-all duration-200 focus:outline-none focus:ring-3 ${
                          isRTL ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'
                        }`}
                      />
                    </div>
                  </div>

                  {/* 2. Password Field */}
                  <div>
                    <label
                      htmlFor="login-password"
                      className="flex items-center justify-between text-xs sm:text-[13px] font-bold text-[#163d77] mb-1.5 px-1 cursor-pointer"
                    >
                      {isRTL ? (
                        <>
                          <span className="font-arabic">{ar.passwordLabel}</span>
                          <span dir="ltr" className="font-english text-xs text-[#4b6790]">
                            {en.passwordLabel}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="font-english">{en.passwordLabel}</span>
                          <span dir="rtl" className="font-arabic text-xs text-[#4b6790]">
                            {ar.passwordLabel}
                          </span>
                        </>
                      )}
                    </label>

                    <div className="relative flex items-center">
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-y-0 flex items-center text-[#0c3c82] ${
                          isRTL ? 'right-0 pr-4' : 'left-0 pl-4'
                        }`}
                      >
                        <InputLockKeyholeIcon className="w-5 h-5" />
                      </span>

                      <input
                        id="login-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="current-password"
                        aria-invalid={isPasswordInvalid}
                        aria-describedby={errorMessage ? 'login-error-message' : undefined}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errorMessage) {
                            setErrorMessage(null);
                            setInvalidField(null);
                          }
                        }}
                        placeholder={t.passwordPlaceholder}
                        className={`w-full min-h-[54px] py-3 rounded-xl bg-white border ${
                          isPasswordInvalid
                            ? 'border-red-400 focus:border-red-600 focus:ring-red-500/15'
                            : 'border-[#c9d9ee] focus:border-[#004799] focus:ring-[#004799]/15'
                        } text-[#0a2958] placeholder-[#567096] text-sm sm:text-base font-medium shadow-[inset_0_1px_2px_rgba(10,41,88,0.04)] transition-all duration-200 focus:outline-none focus:ring-3 ${
                          isRTL ? 'pr-12 pl-12 text-right' : 'pl-12 pr-12 text-left'
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? t.hidePasswordAria : t.showPasswordAria}
                        aria-pressed={showPassword}
                        className={`absolute inset-y-0 flex items-center px-3.5 text-[#0c3c82] hover:text-[#0055cc] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004799] rounded-lg ${
                          isRTL ? 'left-0' : 'right-0'
                        }`}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 3. Forgot Password Link */}
                  <div
                    className={`pt-1 flex ${
                      isRTL ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setIsForgotOpen(true)}
                      className="text-xs sm:text-[13.5px] font-semibold text-[#0052b5] hover:text-[#002f6c] hover:underline transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004799] rounded px-1 py-0.5"
                    >
                      {isRTL ? (
                        <span>
                          <span className="font-arabic">{ar.forgotPassword}</span>
                          <span className="mx-1.5 text-slate-400">|</span>
                          <span dir="ltr" className="font-english">
                            {en.forgotPassword}
                          </span>
                        </span>
                      ) : (
                        <span>
                          <span className="font-english">{en.forgotPassword}</span>
                          <span className="mx-1.5 text-slate-400">|</span>
                          <span dir="rtl" className="font-arabic">
                            {ar.forgotPassword}
                          </span>
                        </span>
                      )}
                    </button>
                  </div>

                  {/* 4. Primary Royal Blue Sign In Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full min-h-[56px] py-3.5 px-6 rounded-xl bg-gradient-to-b from-[#0057b8] via-[#003f8a] to-[#00295c] hover:from-[#0062cf] hover:via-[#00499e] hover:to-[#00316e] active:scale-[0.99] text-white font-bold text-base sm:text-lg shadow-[0_10px_24px_rgba(0,45,104,0.42),inset_0_1px_0_rgba(255,255,255,0.22)] hover:shadow-[0_14px_28px_rgba(0,45,104,0.52)] transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-65 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#004799]/50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin text-white" />
                          <span>{t.signingInStatus}</span>
                        </>
                      ) : isRTL ? (
                        <>
                          <span className="font-arabic font-extrabold">{ar.signInButton}</span>
                          <span aria-hidden="true" className="text-white/60 font-light">
                            |
                          </span>
                          <span dir="ltr" className="font-english font-bold">
                            {en.signInButton}
                          </span>
                          <ArrowLeft className="w-5 h-5 text-white shrink-0" />
                        </>
                      ) : (
                        <>
                          <span className="font-english font-bold">{en.signInButton}</span>
                          <span aria-hidden="true" className="text-white/60 font-light">
                            |
                          </span>
                          <span dir="rtl" className="font-arabic font-extrabold">
                            {ar.signInButton}
                          </span>
                          <ArrowRight className="w-5 h-5 text-white shrink-0" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Card Footer (التذييل) with Golden Flanking Lines */}
              <footer className="mt-8 pt-4 text-center">
                <div className="flex items-center justify-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#d4a953] to-[#d4a953]"
                  />
                  <span className="text-xs sm:text-[13.5px] font-bold text-[#0c3c82] font-arabic whitespace-nowrap">
                    {ar.footerTitle}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#d4a953] to-[#d4a953]"
                  />
                </div>
                <p
                  dir="ltr"
                  className="text-[11px] sm:text-xs font-semibold text-[#154b96] font-english mt-1"
                >
                  {en.footerTitle}
                </p>
              </footer>
            </div>
          </section>
        </div>
      </main>

      {/* =====================================================================
          3. BOTTOM SWEEPING ROYAL BLUE & METALLIC GOLD WAVES (Matching Reference)
         ===================================================================== */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-36 sm:h-48 overflow-hidden z-10"
      >
        <svg
          viewBox="0 0 1600 240"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="bottomGoldRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b88930" />
              <stop offset="28%" stopColor="#f7dfa3" />
              <stop offset="62%" stopColor="#d9ae57" />
              <stop offset="100%" stopColor="#a87924" />
            </linearGradient>
            <linearGradient id="bottomBlueWave" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#07275f" />
              <stop offset="50%" stopColor="#0e49a3" />
              <stop offset="100%" stopColor="#03122c" />
            </linearGradient>
          </defs>

          {/* Deep Navy Base Wave */}
          <path
            d="M0,115 C310,235 760,210 1220,115 C1390,80 1510,38 1600,5 L1600,240 L0,240 Z"
            fill="url(#bottomBlueWave)"
          />
          {/* Left Sweeping Metallic Gold Ribbon */}
          <path
            d="M0,98 C115,172 260,212 445,226 C255,222 115,190 0,134 Z"
            fill="url(#bottomGoldRibbon)"
          />
          {/* Long Center-to-Right Metallic Gold Wave Line */}
          <path
            d="M250,234 C690,218 1150,135 1600,0 L1600,18 C1150,150 695,228 250,234 Z"
            fill="url(#bottomGoldRibbon)"
            opacity="0.92"
          />
          {/* Foreground Dark Royal Curve */}
          <path
            d="M0,185 C470,255 1010,198 1600,65 L1600,240 L0,240 Z"
            fill="#031129"
            opacity="0.88"
          />
        </svg>
      </div>

      {/* =====================================================================
          4. TRANSPARENT PASSWORD RECOVERY NOTICE MODAL (Per Section 5)
         ===================================================================== */}
      {isForgotOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#030d22]/75 backdrop-blur-sm p-4"
          onClick={closeForgotModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 text-[#0a2958] animate-modal-in"
          >
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                  <KeyRound className="w-5 h-5 text-[#004799]" />
                </div>
                <h3
                  id="forgot-modal-title"
                  className="text-sm sm:text-base font-extrabold text-[#0a2958]"
                >
                  {t.recoveryModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeForgotModal}
                aria-label={t.recoveryModal.closeAria}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.recoveryModal.description}
              </p>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-2.5">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm space-y-1 leading-relaxed">
                  <p className="font-bold text-amber-900">
                    {t.recoveryModal.badgeText}
                  </p>
                  <p>{t.recoveryModal.independentNote}</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm font-medium text-[#0c3c82] bg-blue-50/70 border border-blue-100 rounded-xl p-3 leading-relaxed">
                {t.recoveryModal.supportContactLabel}
              </p>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={closeForgotModal}
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#004799] hover:bg-[#003575] text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004799]"
                >
                  {t.recoveryModal.backToLoginButton}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
