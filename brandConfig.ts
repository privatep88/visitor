/**
 * Centralized SAHER Enterprise Brand Identity Configuration
 * Single source of truth for brand names, logos, contact identity, and asset URLs.
 */

export const BRAND_CONFIG = {
  nameAr: 'ساهر',
  nameEn: 'SAHER',
  companyNameAr: 'شركة ساهر للخدمات الذكية',
  companyNameEn: 'SAHER FOR SMART SERVICES',
  defaultLocationLabelAr: 'مقر ساهر',
  supportEmail: 'Logistic@saher.ae',
  supportPhone: '+971 4 123 4567',
  addressEn: 'Level 3, Baynona Building, Khalif City A',
  footerDescriptionLine1Ar: 'شركة ساهر في تقديم الحلول والخدمات الذكية، ملتزمون',
  footerDescriptionLine2Ar: 'بالابتكار والجودة لتحقيق أعلى مستويات الكفاءة والخدمات الذكية.',
  copyrightText: 'جميع الحقوق محفوظة لـ © 2026 SAHER FOR SMART SERVICES',
  logoAlt: 'SAHER ساهر',
  logoPath: 'assets/saher/saher-logo.png',
  logoFallbackPath: 'assets/aistudio/ChatGPT_Image_Nov_23__2026__04_18_34_PM_54a6e944.webp',
  visitorCardPath: 'assets/saher/visitor-id-card.png',
  visitorCardAlt: 'بطاقة تعريف زائر تحمل شعار ساهر على مكتب الاستقبال',
  heroReceptionAlt: 'مشهد استقبال مؤسسي في شركة ساهر يظهر موظف الاستقبال يستلم بطاقة الزائر',
  faviconPath: 'assets/saher/favicon.png',
} as const;

export const getBrandBaseUrl = (): string => {
  if (
    typeof import.meta !== 'undefined' &&
    import.meta.env &&
    typeof import.meta.env.BASE_URL === 'string'
  ) {
    return import.meta.env.BASE_URL.endsWith('/')
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`;
  }
  return './';
};

export const getBrandAssetUrl = (relativePath: string, baseUrl: string = getBrandBaseUrl()): string => {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  return `${normalizedBase}${normalizedPath}`;
};
