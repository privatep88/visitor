import React, { useState, useEffect } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Clock,
  Users,
  Settings,
  AlertCircle,
  CheckCircle2,
  Loader2,
  KeyRound,
  ArrowLeft,
  ArrowRight,
  X,
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
 * Contains zero embedded text.
 */
const GoldenVisitorsEmblem: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg
    viewBox="0 0 96 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <defs>
      <linearGradient id="goldEmblemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F5DDA0" />
        <stop offset="50%" stopColor="#DFBE77" />
        <stop offset="100%" stopColor="#B68938" />
      </linearGradient>
    </defs>
    {/* Center Person Head */}
    <circle cx="48" cy="22" r="10.5" fill="url(#goldEmblemGrad)" />
    {/* Left Person Head */}
    <circle cx="23" cy="31" r="8" fill="url(#goldEmblemGrad)" />
    {/* Right Person Head */}
    <circle cx="73" cy="31" r="8" fill="url(#goldEmblemGrad)" />
    {/* Left Person Shoulders */}
    <path
      d="M8 61C8 51.5 14.5 45 23 45C26.8 45 30.2 46.2 32.8 48.3C29.8 52.2 28 57 28 62.5V67H11C9.3 67 8 65.7 8 64V61Z"
      fill="url(#goldEmblemGrad)"
    />
    {/* Right Person Shoulders */}
    <path
      d="M88 61C88 51.5 81.5 45 73 45C69.2 45 65.8 46.2 63.2 48.3C66.2 52.2 68 57 68 62.5V67H85C86.7 67 88 65.7 88 64V61Z"
      fill="url(#goldEmblemGrad)"
    />
    {/* Center Person Arch around Badge */}
    <path
      d="M27 56C27 44.5 36.2 36.5 48 36.5C59.8 36.5 69 44.5 69 56V59H64V54C64 49.6 60.4 46 56 46H40C35.6 46 32 49.6 32 54V59H27V56Z"
      fill="url(#goldEmblemGrad)"
    />
    {/* Smart Visitor ID Card Badge */}
    <rect
      x="34"
      y="50"
      width="28"
      height="34"
      rx="5"
      fill="url(#goldEmblemGrad)"
    />
    {/* Badge Top Clip */}
    <path
      d="M44 46H52V51H44V46Z"
       rx="2"
      fill="#F5DDA0"
    />
    {/* Badge Avatar Silhouette Cutout */}
    <circle cx="44" cy="64" r="4" fill="#072252" />
    <path
      d="M38 76C38 72.5 40.7 70 44 70C47.3 70 50 72.5 50 76V77H38V76Z"
      fill="#072252"
    />
    {/* Badge Info Lines Cutout */}
    <rect x="52" y="63" width="6" height="2.5" rx="1.2" fill="#072252" />
    <rect x="52" y="68" width="6" height="2.5" rx="1.2" fill="#072252" />
  </svg>
);

/**
 * Corporate Towers Emblem at top of the Login Card
 * Matches the blue & gold architectural towers + orbital ring in the reference card.
 */
const SystemTowersLogo: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg
    viewBox="0 0 100 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <defs>
      <linearGradient id="towerBlueMain" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E6FD9" />
        <stop offset="55%" stopColor="#004799" />
        <stop offset="100%" stopColor="#002960" />
      </linearGradient>
      <linearGradient id="towerBlueDark" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0D47A1" />
        <stop offset="100%" stopColor="#062356" />
      </linearGradient>
      <linearGradient id="towerGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F4DC9B" />
        <stop offset="50%" stopColor="#D9AF5B" />
        <stop offset="100%" stopColor="#AE802B" />
      </linearGradient>
    </defs>

    {/* Left Golden Tower */}
    <path d="M26 39L39 29V72H26V39Z" fill="url(#towerGold)" />
    <path d="M22 42L26 39V72H22V42Z" fill="#B58732" />

    {/* Center Tall Royal Blue Tower */}
    <path d="M43 20L57 10V73H43V20Z" fill="url(#towerBlueMain)" />
    <path d="M57 10L61 13V73H57V10Z" fill="#052150" />

    {/* Right Blue Tower */}
    <path d="M64 29L76 38V71H64V29Z" fill="url(#towerBlueDark)" />

    {/* Orbital Swoosh Ring */}
    <path
      d="M17 69C19 78 39 83 61 78C78 74 89 64 84 56C82 53 78 51 74 50C79 53 80 58 74 63C65 71 44 75 28 72C21 70.5 17.5 67.5 19 64L17 69Z"
      fill="url(#towerBlueMain)"
    />
    <path
      d="M21 74C32 82 58 83 77 73C60 80 35 79 21 74Z"
      fill="url(#towerGold)"
    />
  </svg>
);

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [lang, setLang] = useState<SupportedLang>(() => getInitialLanguage());
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  // Forgot password modal state
  const [isForgotOpen, setIsForgotOpen] = useState<boolean>(false);
  const [recoveryInput, setRecoveryInput] = useState<string>('');
  const [recoverySubmitted, setRecoverySubmitted] = useState<boolean>(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

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
    }
  };

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const validation = validateCredentials(username, password, lang);
    if (!validation.valid) {
      setErrorMessage(validation.errorMessage || t.validation.bothRequired);
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
    }, 500);
  };

  const handleRecoverySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRecoveryError(null);
    if (!recoveryInput.trim()) {
      setRecoveryError(t.recoveryModal.requiredError);
      return;
    }
    setRecoverySubmitted(true);
  };

  const closeForgotModal = () => {
    setIsForgotOpen(false);
    setRecoverySubmitted(false);
    setRecoveryError(null);
    setRecoveryInput('');
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
      icon: ShieldCheck,
      arText: ar.features.security,
      enText: en.features.security,
    },
    {
      id: 'efficiency',
      icon: Clock,
      arText: ar.features.efficiency,
      enText: en.features.efficiency,
    },
    {
      id: 'management',
      icon: Users,
      arText: ar.features.management,
      enText: en.features.management,
    },
    {
      id: 'service',
      icon: Settings,
      arText: ar.features.service,
      enText: en.features.service,
    },
  ];

  return (
    <div
      dir={t.dir}
      lang={t.langCode}
      className="min-h-screen w-full relative overflow-x-hidden flex flex-col justify-between select-text"
      style={{
        background:
          'radial-gradient(circle at 28% 22%, #12489c 0%, #08275c 45%, #041533 100%)',
      }}
    >
      {/* Decorative Background Technical Curves & Golden Ribbons (Pure SVG, No Text) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      >
        {/* Top-Right Sweeping Royal Blue & Cyan Arc */}
        <svg
          viewBox="0 0 1600 900"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <linearGradient id="topRightArc" x1="65%" y1="0%" x2="100%" y2="55%">
              <stop offset="0%" stopColor="#1b64c8" stopOpacity="0.38" />
              <stop offset="50%" stopColor="#09306e" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#03122b" stopOpacity="0.92" />
            </linearGradient>
            <linearGradient id="goldWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c5973e" />
              <stop offset="30%" stopColor="#f5dca2" />
              <stop offset="65%" stopColor="#d8ad56" />
              <stop offset="100%" stopColor="#b0822c" />
            </linearGradient>
            <linearGradient id="bottomRoyalWave" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#062356" />
              <stop offset="50%" stopColor="#0d47a1" />
              <stop offset="100%" stopColor="#041533" />
            </linearGradient>
          </defs>

          {/* Upper right diagonal institutional arc */}
          <path
            d="M1080,0 C1230,110 1380,140 1600,40 L1600,900 L920,900 C1060,640 1190,340 1080,0 Z"
            fill="url(#topRightArc)"
          />
          <path
            d="M1390,0 C1310,95 1210,165 1110,210"
            fill="none"
            stroke="#38bdf8"
            strokeOpacity="0.28"
            strokeWidth="2"
          />

          {/* Bottom Sweeping Layered Blue & Gold Waves */}
          <path
            d="M0,745 C260,885 680,865 1160,760 C1350,718 1490,665 1600,610 L1600,900 L0,900 Z"
            fill="url(#bottomRoyalWave)"
          />
          {/* Left Gold Ribbon Accent */}
          <path
            d="M0,735 C95,805 225,848 390,865 C220,860 95,825 0,768 Z"
            fill="url(#goldWaveGrad)"
            opacity="0.92"
          />
          {/* Sweeping Center-Right Gold & Cyan Wave Accent */}
          <path
            d="M220,885 C650,865 1120,785 1600,600 L1600,622 C1120,800 660,875 220,885 Z"
            fill="url(#goldWaveGrad)"
            opacity="0.88"
          />
          <path
            d="M0,825 C460,910 980,855 1600,685 L1600,900 L0,900 Z"
            fill="#04132d"
            opacity="0.85"
          />
        </svg>
      </div>

      {/* Top Language Toggle Bar (AR | EN Pill Switcher in Top Right) */}
      <header className="relative z-30 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-4 sm:pt-6 flex items-center justify-end">
        <div
          role="group"
          aria-label={t.langToggleLabel}
          dir="ltr"
          className="inline-flex items-center rounded-full p-0.5 border border-[var(--login-gold)] bg-[#061b40]/80 backdrop-blur-md shadow-lg"
        >
          <button
            type="button"
            onClick={() => handleLanguageChange('ar')}
            aria-pressed={lang === 'ar'}
            className={`min-w-[48px] min-h-[34px] px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold font-english transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
              lang === 'ar'
                ? 'bg-gradient-to-b from-[#f3d999] to-[#d6ae5f] text-[#061c42] shadow-sm'
                : 'text-slate-200 hover:text-white'
            }`}
          >
            AR
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('en')}
            aria-pressed={lang === 'en'}
            className={`min-w-[48px] min-h-[34px] px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold font-english transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
              lang === 'en'
                ? 'bg-gradient-to-b from-[#f3d999] to-[#d6ae5f] text-[#061c42] shadow-sm'
                : 'text-slate-200 hover:text-white'
            }`}
          >
            EN
          </button>
        </div>
      </header>

      {/* Main Content Container: Left Institutional Showcase + Right Light Login Card on Desktop */}
      <main className="relative z-20 flex-1 flex items-center w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-4 sm:py-6 lg:py-8">
        {/* Note: On desktop (lg), keep left showcase on left and login card on right via lg:dir-ltr grid placement while preserving inner RTL/LTR direction */}
        <div
          dir="ltr"
          className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center"
        >
          {/* LEFT COLUMN (Desktop): Hero Identity + Reception Lobby Scene + 4 Feature Pillars */}
          <section
            dir={t.dir}
            aria-label={isRTL ? 'القسم التعريفي والمزايا' : 'System Introduction and Features'}
            className="lg:col-span-7 flex flex-col justify-between space-y-5 sm:space-y-6 order-2 lg:order-1"
          >
            {/* 1. Hero Header Block with Golden Emblem & Vertical Gold Divider */}
            <div
              dir="ltr"
              className="flex items-center gap-4 sm:gap-6 px-1 sm:px-2"
            >
              {/* Golden Visitors + Badge Icon */}
              <div className="shrink-0">
                <GoldenVisitorsEmblem className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 drop-shadow-[0_6px_16px_rgba(0,0,0,0.4)]" />
              </div>

              {/* Vertical Golden Line */}
              <div
                aria-hidden="true"
                className="w-[2.5px] self-stretch min-h-[84px] sm:min-h-[108px] rounded-full bg-gradient-to-b from-[#f3d999] via-[#dfbe77] to-[#b68938] shrink-0"
              />

              {/* Selectable Real HTML Titles & Descriptions */}
              <div
                dir={t.dir}
                className={`flex-1 min-w-0 space-y-2 ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
              >
                {isRTL ? (
                  <>
                    <h1 className="text-2xl sm:text-3xl xl:text-[40px] font-extrabold text-white leading-tight tracking-tight font-arabic drop-shadow-sm">
                      {ar.heroTitle}
                    </h1>
                    <h2
                      dir="ltr"
                      className="text-base sm:text-xl xl:text-[23px] font-bold text-white/95 leading-snug font-english"
                    >
                      {en.heroTitle}
                    </h2>
                    <div className="pt-1 space-y-1">
                      <p className="text-sm sm:text-lg xl:text-xl font-medium text-slate-100 leading-relaxed font-arabic">
                        {ar.heroDescription}
                      </p>
                      <p
                        dir="ltr"
                        className="text-xs sm:text-sm xl:text-[15px] font-normal text-slate-200/95 leading-relaxed font-english"
                      >
                        {en.heroDescription}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="text-xl sm:text-2xl xl:text-[30px] font-extrabold text-white leading-tight tracking-tight font-english drop-shadow-sm">
                      {en.heroTitle}
                    </h1>
                    <h2
                      dir="rtl"
                      className="text-xl sm:text-2xl xl:text-[32px] font-bold text-white/95 leading-snug font-arabic"
                    >
                      {ar.heroTitle}
                    </h2>
                    <div className="pt-1 space-y-1">
                      <p className="text-xs sm:text-base xl:text-[17px] font-medium text-slate-100 leading-relaxed font-english">
                        {en.heroDescription}
                      </p>
                      <p
                        dir="rtl"
                        className="text-sm sm:text-base xl:text-lg font-normal text-slate-200/95 leading-relaxed font-arabic"
                      >
                        {ar.heroDescription}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 2. Photorealistic UAE Corporate Reception Scene */}
            <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(2,10,28,0.55)] border border-white/15 bg-[#082250]">
              <div className="relative w-full h-52 sm:h-72 md:h-80 lg:h-[360px] xl:h-[390px]">
                {!imageError ? (
                  <img
                    src="./assets/reception-scene.png"
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

                {/* Subtle Edge Blending Overlays into Institutional Royal Blue */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061d47] via-transparent to-[#072353]/40"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#061d47]/25 via-transparent to-[#072353]/45"
                />
              </div>

              {/* 3. Four Feature Pillars Row Integrated at Bottom of Showcase */}
              <div
                dir={t.dir}
                className="relative z-10 bg-gradient-to-t from-[#041533]/95 via-[#07214e]/90 to-[#082659]/80 backdrop-blur-md border-t border-white/15 px-3 sm:px-6 py-4"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-2">
                  {featureItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={item.id}
                        className={`flex flex-col items-center text-center px-2 ${
                          index < featureItems.length - 1
                            ? isRTL
                              ? 'sm:border-l sm:border-white/20'
                              : 'sm:border-r sm:border-white/20'
                            : ''
                        }`}
                      >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-[var(--login-gold)]/40 flex items-center justify-center mb-2 shadow-inner">
                          <IconComponent
                            className="w-5 h-5 text-[var(--login-gold)]"
                            strokeWidth={1.8}
                          />
                        </div>
                        {isRTL ? (
                          <>
                            <span className="text-xs sm:text-sm font-bold text-white leading-snug font-arabic">
                              {item.arText}
                            </span>
                            <span
                              dir="ltr"
                              className="text-[11px] sm:text-xs font-medium text-slate-200/90 leading-snug font-english mt-0.5"
                            >
                              {item.enText}
                            </span>
                          </>
                        ) : (
                          <>
                            <span
                              dir="ltr"
                              className="text-xs sm:text-sm font-bold text-white leading-snug font-english"
                            >
                              {item.enText}
                            </span>
                            <span
                              dir="rtl"
                              className="text-[11px] sm:text-xs font-medium text-slate-200/90 leading-snug font-arabic mt-0.5"
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

          {/* RIGHT COLUMN (Desktop): Light Institutional Login Card */}
          <section
            dir={t.dir}
            aria-label={isRTL ? 'بطاقة تسجيل الدخول' : 'Sign In Card'}
            className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2"
          >
            <div className="w-full max-w-[460px] rounded-[28px] bg-[var(--login-card-bg)] border border-[var(--login-card-border)] shadow-[0_25px_65px_rgba(2,10,28,0.6)] px-6 sm:px-10 py-8 sm:py-10 text-[var(--login-text-heading)] flex flex-col justify-between backdrop-blur-xl">
              {/* Top Section: Architectural Logo + Sign In Headings */}
              <div>
                <div className="flex flex-col items-center text-center mb-7">
                  <SystemTowersLogo className="w-20 h-20 sm:w-22 sm:h-22 mb-3 drop-shadow-sm" />

                  {isRTL ? (
                    <>
                      <h2 className="text-2xl sm:text-[30px] font-extrabold text-[#0a316d] leading-tight font-arabic">
                        {ar.cardTitle}
                      </h2>
                      <p
                        dir="ltr"
                        className="text-lg sm:text-xl font-bold text-[#0f3d82] mt-0.5 font-english"
                      >
                        {en.cardTitle}
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#0a316d] leading-tight font-english">
                        {en.cardTitle}
                      </h2>
                      <p
                        dir="rtl"
                        className="text-xl sm:text-2xl font-bold text-[#0f3d82] mt-0.5 font-arabic"
                      >
                        {ar.cardTitle}
                      </p>
                    </>
                  )}

                  {/* Subtle Golden Accent Bar below Sign In */}
                  <div
                    aria-hidden="true"
                    className="w-16 h-[3px] rounded-full bg-gradient-to-r from-[#d4a953] via-[#ebd08e] to-[#d4a953] mt-3.5"
                  />
                </div>

                {/* Validation / Error Message Box */}
                {errorMessage && (
                  <div
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
                      className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#1e3f73] mb-1.5 px-1 cursor-pointer"
                    >
                      {isRTL ? (
                        <>
                          <span className="font-arabic">{ar.usernameLabel}</span>
                          <span dir="ltr" className="font-english text-xs text-[#4b658c]">
                            {en.usernameLabel}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="font-english">{en.usernameLabel}</span>
                          <span dir="rtl" className="font-arabic text-xs text-[#4b658c]">
                            {ar.usernameLabel}
                          </span>
                        </>
                      )}
                    </label>

                    <div className="relative flex items-center">
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-y-0 flex items-center text-[#0b3978] ${
                          isRTL ? 'right-0 pr-4' : 'left-0 pl-4'
                        }`}
                      >
                        <User className="w-5 h-5" strokeWidth={2} />
                      </span>

                      <input
                        id="login-username"
                        name="username"
                        type="text"
                        required
                        autoComplete="username"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        placeholder={`${ar.usernamePlaceholder} | ${en.usernamePlaceholder}`}
                        className={`w-full min-h-[52px] py-3 rounded-xl bg-[var(--login-input-bg)] border border-[var(--login-input-border)] text-[#0a2958] placeholder-[#5b7396] text-sm sm:text-base font-medium shadow-inner transition-all duration-200 focus:outline-none focus:border-[var(--login-input-border-focus)] focus:ring-3 focus:ring-[#004799]/15 ${
                          isRTL ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'
                        }`}
                      />
                    </div>
                  </div>

                  {/* 2. Password Field */}
                  <div>
                    <label
                      htmlFor="login-password"
                      className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#1e3f73] mb-1.5 px-1 cursor-pointer"
                    >
                      {isRTL ? (
                        <>
                          <span className="font-arabic">{ar.passwordLabel}</span>
                          <span dir="ltr" className="font-english text-xs text-[#4b658c]">
                            {en.passwordLabel}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="font-english">{en.passwordLabel}</span>
                          <span dir="rtl" className="font-arabic text-xs text-[#4b658c]">
                            {ar.passwordLabel}
                          </span>
                        </>
                      )}
                    </label>

                    <div className="relative flex items-center">
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-y-0 flex items-center text-[#0b3978] ${
                          isRTL ? 'right-0 pr-4' : 'left-0 pl-4'
                        }`}
                      >
                        <Lock className="w-5 h-5" strokeWidth={2} />
                      </span>

                      <input
                        id="login-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        placeholder={`${ar.passwordPlaceholder} | ${en.passwordPlaceholder}`}
                        className={`w-full min-h-[52px] py-3 rounded-xl bg-[var(--login-input-bg)] border border-[var(--login-input-border)] text-[#0a2958] placeholder-[#5b7396] text-sm sm:text-base font-medium shadow-inner transition-all duration-200 focus:outline-none focus:border-[var(--login-input-border-focus)] focus:ring-3 focus:ring-[#004799]/15 ${
                          isRTL ? 'pr-12 pl-12 text-right' : 'pl-12 pr-12 text-left'
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? t.hidePasswordAria : t.showPasswordAria}
                        aria-pressed={showPassword}
                        className={`absolute inset-y-0 flex items-center px-3.5 text-[#0b3978] hover:text-[#0055cc] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004799] rounded-lg ${
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
                      className="text-xs sm:text-sm font-semibold text-[#0050b3] hover:text-[#002f6c] hover:underline transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004799] rounded px-1 py-0.5"
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
                      className="w-full min-h-[54px] py-3.5 px-6 rounded-xl bg-gradient-to-b from-[#0052a8] via-[#003e82] to-[#002b5e] hover:from-[#005ec0] hover:via-[#004794] hover:to-[#00336e] active:scale-[0.99] text-white font-bold text-base sm:text-lg shadow-[0_10px_24px_rgba(0,48,107,0.38)] hover:shadow-[0_14px_28px_rgba(0,48,107,0.48)] transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-65 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#004799]/50"
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
                  <span className="text-xs sm:text-sm font-bold text-[#0b3978] font-arabic whitespace-nowrap">
                    {ar.footerTitle}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#d4a953] to-[#d4a953]"
                  />
                </div>
                <p
                  dir="ltr"
                  className="text-[11px] sm:text-xs font-semibold text-[#1e4b8f] font-english mt-1"
                >
                  {en.footerTitle}
                </p>
              </footer>
            </div>
          </section>
        </div>
      </main>

      {/* Subtle Bottom Page Margin Spacer */}
      <div className="h-4 sm:h-6 relative z-10" aria-hidden="true" />

      {/* Accessible Password Recovery Modal */}
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
                <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-[#004799]" />
                </div>
                <h3 id="forgot-modal-title" className="text-base sm:text-lg font-extrabold text-[#0a2958]">
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

            {recoverySubmitted ? (
              <div className="space-y-4 py-1">
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-[#0a2958] flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#004799] shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm space-y-1.5 leading-relaxed">
                    <p className="font-bold text-[#0a2958]">
                      {t.recoveryModal.successTitle}
                    </p>
                    <p className="text-slate-600">
                      {t.recoveryModal.successNotice}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeForgotModal}
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#004799] hover:bg-[#003575] text-white font-bold text-sm transition-colors cursor-pointer"
                >
                  {t.recoveryModal.backToLoginButton}
                </button>
              </div>
            ) : (
              <form onSubmit={handleRecoverySubmit} noValidate className="space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.recoveryModal.description}
                </p>

                {recoveryError && (
                  <div
                    role="alert"
                    className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="font-medium">{recoveryError}</span>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="recovery-account"
                    className="block text-xs sm:text-sm font-bold text-[#0a2958] mb-1.5"
                  >
                    {t.recoveryModal.inputLabel}
                  </label>
                  <input
                    id="recovery-account"
                    type="text"
                    dir="ltr"
                    value={recoveryInput}
                    onChange={(e) => {
                      setRecoveryInput(e.target.value);
                      if (recoveryError) setRecoveryError(null);
                    }}
                    placeholder={t.recoveryModal.inputPlaceholder}
                    className="w-full min-h-[46px] px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-[#0a2958] placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-[#004799] focus:ring-2 focus:ring-[#004799]/20"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={closeForgotModal}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    {t.recoveryModal.cancelButton}
                  </button>
                  <button
                    type="submit"
                    className="min-h-[44px] px-5 py-2 rounded-xl bg-[#004799] hover:bg-[#003575] text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                  >
                    {t.recoveryModal.submitButton}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
