export const PREDEFINED_LOCATIONS: string[] = [
  "مقر ساهر - ابوظبي - عمارات",
  "مقر ساهر - أبوظبي - فيلا مدينة خليفة",
  "مقر ساهر - دبي - ابن سينا مول",
  "مقرات ساهر - أخرى"
];

export const CURRENT_YEAR: number = new Date().getFullYear();
export const END_YEAR: number = 2060;
export const YEARS: number[] = Array.from({ length: END_YEAR - CURRENT_YEAR + 1 }, (_, i) => CURRENT_YEAR + i);

export const MONTHS: { value: string; name: string }[] = [
  { value: '01', name: 'يناير' },
  { value: '02', name: 'فبراير' },
  { value: '03', name: 'مارس' },
  { value: '04', name: 'أبريل' },
  { value: '05', name: 'مايو' },
  { value: '06', name: 'يونيو' },
  { value: '07', name: 'يوليو' },
  { value: '08', name: 'أغسطس' },
  { value: '09', name: 'سبتمبر' },
  { value: '10', name: 'أكتوبر' },
  { value: '11', name: 'نوفمبر' },
  { value: '12', name: 'ديسمبر' },
];