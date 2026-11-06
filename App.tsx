import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Users,
  UserPlus,
  UserRound,
  Save,
  Calendar,
  CalendarDays,
  Download,
  Pencil,
  CheckCircle,
  AlertCircle,
  Truck,
  UserCog,
  ClipboardList,
  MapPin,
  User,
  Phone,
  Clock,
  CreditCard,
  FilePenLine,
  Mail,
  FilterX,
  Database,
  Printer,
  Bell,
  LogOut,
  Building2,
  Network,
  BarChart2,
  Home,
  LayoutGrid,
  Send,
  IdCard
} from 'lucide-react';

import { PREDEFINED_LOCATIONS, YEARS, CURRENT_YEAR, MONTHS } from './constants.ts';
import { Record, RecordType, FormDataState, SubmitStatus, SortOrder, ImportStatusState } from './types.ts';
import TableSection from './components/TableSection.tsx';
import ConfirmationModal from './components/ConfirmationModal.tsx';
import WelcomeBanner from './components/WelcomeBanner.tsx';
import DashboardView from './components/DashboardView.tsx';
import LoginPage from './components/LoginPage.tsx';

declare global {
  interface Window {
    XLSX: any;
  }
}

const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const getBaseUrl = (): string => {
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

/**
 * Golden ID Badge Outline Icon for the Right Hero Section
 */
const HeroVisitorBadgeIcon: React.FC<{ className?: string }> = ({
  className = 'w-12 h-12',
}) => (
  <svg
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <rect
      x="6"
      y="14"
      width="44"
      height="34"
      rx="6"
      stroke="#F4BF19"
      strokeWidth="2.8"
    />
    <path
      d="M22 14V10C22 7.79086 23.7909 6 26 6H30C32.2091 6 34 7.79086 34 10V14"
      stroke="#F4BF19"
      strokeWidth="2.8"
      strokeLinecap="round"
    />
    <circle cx="20" cy="28" r="4.2" stroke="#F4BF19" strokeWidth="2.5" />
    <path
      d="M13 39C13 35.6863 16.134 33 20 33C23.866 33 27 35.6863 27 39"
      stroke="#F4BF19"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <line
      x1="32"
      y1="25"
      x2="42"
      y2="25"
      stroke="#F4BF19"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
    <line
      x1="32"
      y1="31"
      x2="42"
      y2="31"
      stroke="#F4BF19"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
    <line
      x1="32"
      y1="37"
      x2="39"
      y2="37"
      stroke="#F4BF19"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
  </svg>
);

const demoRecords: Record[] = [
  // Visitors
  { id: 'demo_v1', type: 'visitor', year: CURRENT_YEAR, location: PREDEFINED_LOCATIONS[0], name: 'أحمد محمد', phone: '0501234567', department: 'الإدارة المالية', purpose: 'اجتماع عمل', date: `${CURRENT_YEAR}-05-21`, timeIn: '09:15', timeOut: '10:30', idType: 'الهوية الوطنية', notes: '', createdAt: new Date() },
  { id: 'demo_v2', type: 'visitor', year: CURRENT_YEAR, location: PREDEFINED_LOCATIONS[2], name: 'فاطمة علي', phone: '0567654321', department: 'الموارد البشرية', purpose: 'مقابلة وظيفية', date: `${CURRENT_YEAR}-05-22`, timeIn: '11:00', timeOut: '11:45', idType: 'جواز سفر', notes: '', createdAt: new Date() },
  { id: 'demo_v3', type: 'visitor', year: CURRENT_YEAR, location: PREDEFINED_LOCATIONS[1], name: 'يوسف حسن', phone: '0551122334', department: 'الشؤون القانونية', purpose: 'تسليم مستندات', date: `${CURRENT_YEAR}-05-22`, timeIn: '14:00', timeOut: '14:10', idType: 'رخصة قيادة', notes: '', createdAt: new Date() },
  { id: 'demo_v4', type: 'visitor', year: CURRENT_YEAR, location: PREDEFINED_LOCATIONS[0], name: 'سارة خالد', phone: '0523344556', department: 'الموارد البشرية', purpose: 'زيارة', date: `${CURRENT_YEAR}-05-23`, timeIn: '10:00', timeOut: '', idType: 'الهوية الوطنية', notes: '', createdAt: new Date() },
  // Suppliers
  { id: 'demo_s1', type: 'supplier', year: CURRENT_YEAR, location: PREDEFINED_LOCATIONS[0], name: 'شركة النور للتوريدات (مندوب: علي)', phone: '0509876543', department: 'قسم المشتريات', purpose: 'توريد أجهزة مكتبية', date: `${CURRENT_YEAR}-05-21`, timeIn: '10:00', timeOut: '10:20', idType: 'بطاقة عمل', notes: '', createdAt: new Date() },
  { id: 'demo_s2', type: 'supplier', year: CURRENT_YEAR, location: PREDEFINED_LOCATIONS[2], name: 'مطبعة المستقبل (مندوب: هدى)', phone: '0561237890', department: 'قسم التسويق', purpose: 'تسليم مطبوعات', date: `${CURRENT_YEAR}-05-21`, timeIn: '15:30', timeOut: '15:45', idType: 'بطاقة عمل', notes: '', createdAt: new Date() },
  { id: 'demo_s3', type: 'supplier', year: CURRENT_YEAR, location: PREDEFINED_LOCATIONS[1], name: 'خدمات الصيانة السريعة (فني: عمر)', phone: '0558765432', department: 'قسم الصيانة', purpose: 'صيانة دورية', date: `${CURRENT_YEAR}-05-22`, timeIn: '09:00', timeOut: '11:00', idType: 'بطاقة عمل', notes: '', createdAt: new Date() },
  { id: 'demo_s4', type: 'supplier', year: CURRENT_YEAR, location: PREDEFINED_LOCATIONS[3], name: 'مورد أغذية (مندوب: ليلى)', phone: '0523456789', department: 'الكافتيريا', purpose: 'توصيل طلبية', date: `${CURRENT_YEAR}-05-23`, timeIn: '08:30', timeOut: '08:45', idType: 'أخرى', notes: '', createdAt: new Date() },
  // Employees
  { id: 'demo_e1', type: 'employee', year: CURRENT_YEAR, location: PREDEFINED_LOCATIONS[0], name: 'عبدالله سالم', phone: '', department: 'تقنية المعلومات', purpose: 'نسيان بطاقة الدخول', date: `${CURRENT_YEAR}-05-21`, timeIn: '08:05', timeOut: '', idType: 'الهوية الوطنية', notes: '', createdAt: new Date() },
  { id: 'demo_e2', type: 'employee', year: CURRENT_YEAR, location: PREDEFINED_LOCATIONS[2], name: 'مريم سعيد', phone: '', department: 'التصميم', purpose: 'موظف جديد', date: `${CURRENT_YEAR}-05-22`, timeIn: '08:50', timeOut: '', idType: 'الهوية الوطنية', notes: '', createdAt: new Date() },
  { id: 'demo_e3', type: 'employee', year: CURRENT_YEAR, location: PREDEFINED_LOCATIONS[1], name: 'خالد العامري', phone: '', department: 'المبيعات', purpose: 'زيارة قسم آخر', date: `${CURRENT_YEAR}-05-22`, timeIn: '13:20', timeOut: '', idType: 'بطاقة عمل', notes: '', createdAt: new Date() },
  { id: 'demo_e4', type: 'employee', year: CURRENT_YEAR, location: PREDEFINED_LOCATIONS[2], name: 'نورة المنصوري', phone: '', department: 'خدمة العملاء', purpose: 'نسيان بطاقة الدخول', date: `${CURRENT_YEAR}-05-23`, timeIn: '08:10', timeOut: '', idType: 'الهوية الوطنية', notes: '', createdAt: new Date() },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('saher_session_active') === 'true';
    } catch {
      return false;
    }
  });
  const [currentUser, setCurrentUser] = useState<string>(() => {
    try {
      return sessionStorage.getItem('saher_session_user') || '';
    } catch {
      return '';
    }
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [records, setRecords] = useState<Record[]>(() => {
    try {
      const localData = localStorage.getItem('visitor_records');
      const notesClearedFlag = localStorage.getItem('saher_notes_cleared_v1');
      if (localData) {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          let parsedRecords: Record[] = parsed;
          if (!notesClearedFlag) {
            parsedRecords = parsedRecords.map(rec => ({ ...rec, notes: '' }));
            localStorage.setItem('visitor_records', JSON.stringify(parsedRecords));
            localStorage.setItem('saher_notes_cleared_v1', 'true');
          }
          return parsedRecords;
        }
      }
      localStorage.setItem('saher_notes_cleared_v1', 'true');
      return demoRecords;
    } catch {
      return demoRecords;
    }
  });
  const [activeTab, setActiveTab] = useState<'form' | 'list' | 'dashboard'>('form');
  const [xlsxLoaded, setXlsxLoaded] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<ImportStatusState>({ status: 'idle' });
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filterLocation, setFilterLocation] = useState<string>('');
  const [filterYear, setFilterYear] = useState<string>('');
  const [filterMonth, setFilterMonth] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showWelcomeBanner, setShowWelcomeBanner] = useState<boolean>(false);
  const isInitialMount = useRef(true);

  const baseUrl = getBaseUrl();
  const [logoSrc, setLogoSrc] = useState<string>(`${baseUrl}assets/aistudio/logo_1afd1154.png`);
  const handleLogoError = () => {
    if (logoSrc !== `${baseUrl}assets/saaed/saaed-logo.png`) {
      setLogoSrc(`${baseUrl}assets/saaed/saaed-logo.png`);
    }
  };

  // Helper to get local date string (YYYY-MM-DD)
  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const now = new Date();
  const initialFormState: FormDataState = {
    type: 'visitor',
    year: now.getFullYear(),
    location: '',
    name: '',
    phone: '',
    department: '',
    purpose: '',
    receivedBy: '',
    date: getLocalDateString(now),
    timeIn: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    timeOut: '',
    idType: 'الهوية الوطنية',
    notes: ''
  };
  const [formData, setFormData] = useState<FormDataState>(initialFormState);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Quick Stats Calculations
  const quickStats = useMemo(() => {
    if (records.length === 0) return { last: 'لا يوجد', today: 0, topLoc: 'لا يوجد', suppliersToday: 0, employeesToday: 0 };

    // 1. Last Registered Visitor (Based on Date and Time)
    const latestRecord = [...records].sort((a, b) => {
      const timeA = a.timeIn || '00:00';
      const timeB = b.timeIn || '00:00';
      const dateA = new Date(`${a.date}T${timeA}`);
      const dateB = new Date(`${b.date}T${timeB}`);
      return dateB.getTime() - dateA.getTime();
    })[0];

    const last = latestRecord ? `${latestRecord.name} (${latestRecord.timeIn})` : 'لا يوجد';

    // 2. Today's Statistics
    const todayStr = getLocalDateString(new Date());
    const todayRecords = records.filter(r => r.date === todayStr);
    const today = todayRecords.length;
    const suppliersToday = todayRecords.filter(r => r.type === 'supplier').length;
    const employeesToday = todayRecords.filter(r => r.type === 'employee').length;

    // 3. Most Active Location
    const locCounts: { [key: string]: number } = {};
    records.forEach(r => {
      const loc = r.location || 'غير محدد';
      locCounts[loc] = (locCounts[loc] || 0) + 1;
    });
    const topLocEntry = Object.entries(locCounts).sort((a, b) => b[1] - a[1])[0];
    const topLoc = topLocEntry ? topLocEntry[0] : 'لا يوجد';

    return { last, today, topLoc, suppliersToday, employeesToday };
  }, [records]);

  useEffect(() => {
    loadScript("https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js")
      .then(() => setXlsxLoaded(true))
      .catch(e => console.error("Failed to load XLSX script", e));

    try {
      const bannerDismissed = sessionStorage.getItem('welcomeBannerDismissed');
      if (!bannerDismissed) {
        setShowWelcomeBanner(true);
      }
    } catch {
      setShowWelcomeBanner(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      setSortOrder('desc');
    }
  }, [filterYear]);

  const handleDismissBanner = () => {
    setShowWelcomeBanner(false);
    try {
      sessionStorage.setItem('welcomeBannerDismissed', 'true');
    } catch {
      // Ignore storage access errors
    }
  };

  const filteredRecords = useMemo(() => {
    let data = [...records];
    if (startDate) data = data.filter(record => record.date >= startDate);
    if (endDate) data = data.filter(record => record.date <= endDate);
    if (filterLocation) data = data.filter(record => record.location === filterLocation);
    if (filterYear) data = data.filter(record => String(record.year) === String(filterYear));
    if (filterMonth) data = data.filter(record => record.date.substring(5, 7) === filterMonth);
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter(record => Object.values(record).some(val => String(val).toLowerCase().includes(lowerSearch)));
    }
    data.sort((a, b) => {
      const timeAStr = a.timeIn || '00:00';
      const timeBStr = b.timeIn || '00:00';

      const dateA = new Date(`${a.date}T${timeAStr}`);
      const dateB = new Date(`${b.date}T${timeBStr}`);

      const timeA = dateA.getTime();
      const timeB = dateB.getTime();

      const aIsInvalid = isNaN(timeA);
      const bIsInvalid = isNaN(timeB);

      if (aIsInvalid && bIsInvalid) return 0;
      if (aIsInvalid) return 1;
      if (bIsInvalid) return -1;

      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });
    return data;
  }, [records, startDate, endDate, filterLocation, filterYear, filterMonth, sortOrder, searchTerm]);

  // Combine predefined locations with any new locations found in records
  const allLocations = useMemo(() => {
    const customLocations = new Set<string>();
    records.forEach(record => {
      if (record.location && record.location.trim() && !PREDEFINED_LOCATIONS.includes(record.location)) {
        customLocations.add(record.location);
      }
    });
    return [...PREDEFINED_LOCATIONS, ...Array.from(customLocations).sort()];
  }, [records]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const newData = { ...prev, [name]: value };

      if (name === 'date' && value) {
        const dateYear = new Date(value).getFullYear();
        if (!isNaN(dateYear)) {
          newData.year = dateYear;
        }
      }

      return newData;
    });

    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = 'اسم المراجع مطلوب.';
    if (!formData.location.trim()) errors.location = 'اسم المقر مطلوب.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const startEdit = (record: Record) => {
    setFormData({ type: record.type, year: record.year, location: record.location, name: record.name, phone: record.phone, department: record.department, purpose: record.purpose, receivedBy: record.receivedBy || '', date: record.date, timeIn: record.timeIn, timeOut: record.timeOut, idType: record.idType, notes: record.notes });
    setEditingId(record.id);
    setActiveTab('form');
    setFormErrors({});
    const allTouched = Object.keys(record).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setFormErrors({});
    setTouched({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const currentSubmitTime = new Date();
    let finalRecord: Record;

    if (editingId) {
      const originalRecord = records.find(r => r.id === editingId);
      finalRecord = {
        ...formData,
        id: editingId,
        createdAt: originalRecord?.createdAt || currentSubmitTime,
        lastModified: currentSubmitTime
      };
    } else {
      finalRecord = {
        ...formData,
        id: `local_${currentSubmitTime.getTime()}`,
        createdAt: currentSubmitTime
      };
    }

    const newRecords = editingId
      ? records.map(rec => (rec.id === editingId ? finalRecord : rec))
      : [finalRecord, ...records];

    setRecords(newRecords);
    try {
      localStorage.setItem('visitor_records', JSON.stringify(newRecords));
    } catch {
      // Ignore storage quota or access errors
    }
    setSubmitStatus(editingId ? 'updated' : 'success_offline');

    setFormData(initialFormState);
    setTouched({});
    setEditingId(null);

    setTimeout(() => setSubmitStatus(null), 3000);
  };

  const handleConfirmDelete = () => {
    if (!recordToDelete) return;
    const newRecords = records.filter(record => record.id !== recordToDelete);
    setRecords(newRecords);
    try {
      localStorage.setItem('visitor_records', JSON.stringify(newRecords));
    } catch {
      // Ignore storage quota or access errors
    }
    setRecordToDelete(null);
  };

  const handleSortChange = () => {
    setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
  };

  const handleExportExcel = () => {
    if (!window.XLSX || !xlsxLoaded) {
      alert("مكتبة التصدير لم يتم تحميلها بعد.");
      return;
    }

    const sourceRecords = filteredRecords.length > 0 ? filteredRecords : records;
    const visitorsToExport = sourceRecords.filter(r => r.type === 'visitor');
    const suppliersToExport = sourceRecords.filter(r => r.type === 'supplier');
    const employeesToExport = sourceRecords.filter(r => r.type === 'employee');

    if (sourceRecords.length === 0) {
      alert("لا توجد سجلات للتصدير حالياً.");
      return;
    }

    const wb = window.XLSX.utils.book_new();
    const fileName = `سجلات_الزوار_والموردين_والموظفين_${new Date().toISOString().split('T')[0]}.xlsx`;

    const createSheet = (data: Record[], sheetName: string, isVisitor: boolean = false) => {
      const baseHeaders = ["م", "السنة", "التاريخ", "اليوم", "اسم المقر", "الإسم", "رقم الهاتف", "الإدارة المتجه اليها", "الغرض"];
      const extraHeaders = isVisitor
        ? ["الموظف المستقبل", "توقيت الدخول", "توقيت الخروج", "اثبات الهوية", "الملاحظات"]
        : ["توقيت الدخول", "توقيت الخروج", "اثبات الهوية", "الملاحظات"];
      const currentHeaders = [...baseHeaders, ...extraHeaders];

      const sheetData = data.map((rec, i) => {
        const dayName = rec.date ? new Date(rec.date).toLocaleDateString('ar-AE', { weekday: 'long' }) : '';
        const baseData = [i + 1, rec.year, rec.date, dayName, rec.location, rec.name, rec.phone, rec.department, rec.purpose];
        const extraData = isVisitor
          ? [rec.receivedBy || '', rec.timeIn, rec.timeOut, rec.idType, rec.notes]
          : [rec.timeIn, rec.timeOut, rec.idType, rec.notes];
        return [...baseData, ...extraData];
      });

      const finalSheetData = [currentHeaders, ...sheetData];
      const ws = window.XLSX.utils.aoa_to_sheet(finalSheetData);
      ws['!cols'] = Array(currentHeaders.length).fill({ wch: 20 });
      ws['!views'] = [{ rightToLeft: true }];
      window.XLSX.utils.book_append_sheet(wb, ws, sheetName);
    };

    const createCombinedSheet = (allData: Record[], sheetName: string) => {
      const typeLabelMap: { [key in RecordType]: string } = {
        visitor: 'سجل الزوار',
        supplier: 'سجل الموردين',
        employee: 'سجل الموظفين'
      };
      const headers = ["م", "نوع السجل", "السنة", "التاريخ", "اليوم", "اسم المقر", "الإسم", "رقم الهاتف", "الإدارة المتجه اليها", "الغرض", "الموظف المستقبل", "توقيت الدخول", "توقيت الخروج", "اثبات الهوية", "الملاحظات"];
      const rows = allData.map((rec, i) => {
        const dayName = rec.date ? new Date(rec.date).toLocaleDateString('ar-AE', { weekday: 'long' }) : '';
        return [
          i + 1,
          typeLabelMap[rec.type] || rec.type,
          rec.year,
          rec.date,
          dayName,
          rec.location,
          rec.name,
          rec.phone,
          rec.department,
          rec.purpose,
          rec.type === 'visitor' ? (rec.receivedBy || '') : '-',
          rec.timeIn,
          rec.timeOut,
          rec.idType,
          rec.notes
        ];
      });
      const ws = window.XLSX.utils.aoa_to_sheet([headers, ...rows]);
      ws['!cols'] = Array(headers.length).fill({ wch: 20 });
      ws['!views'] = [{ rightToLeft: true }];
      window.XLSX.utils.book_append_sheet(wb, ws, sheetName);
    };

    createSheet(visitorsToExport, "سجل الزوار", true);
    createSheet(suppliersToExport, "سجل الموردين", false);
    createSheet(employeesToExport, "سجل الموظفين", false);
    createCombinedSheet(sourceRecords, "جميع السجلات");

    window.XLSX.writeFile(wb, fileName);
  };

  const handleSectionExcelImport = async (file: File, targetType: RecordType) => {
    if (!file) return;
    const sectionLabels: { [key in RecordType]: { title: string; sheetNames: string[] } } = {
      visitor: { title: 'سجل الزوار', sheetNames: ['سجل الزوار', 'الزوار'] },
      supplier: { title: 'سجل الموردين', sheetNames: ['سجل الموردين', 'الموردين'] },
      employee: { title: 'سجل الموظفين', sheetNames: ['سجل الموظفين', 'الموظفين', 'سجل الموظفين (بدون تصريح)'] }
    };
    const targetInfo = sectionLabels[targetType];

    setImportStatus({
      status: 'importing',
      targetType,
      message: `جاري استيراد البيانات إلى ${targetInfo.title}...`
    });

    try {
      if (!window.XLSX) await loadScript("https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js");
      const data = await file.arrayBuffer();
      const wb = window.XLSX.read(data);
      const preferredSheetName =
        wb.SheetNames.find((name: string) => targetInfo.sheetNames.includes(name.trim())) ||
        wb.SheetNames[0];
      const ws = wb.Sheets[preferredSheetName];

      const rows: any[][] = window.XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
      const headerRowIndex = rows.findIndex(r =>
        r.some(cell => typeof cell === 'string' && (cell.trim() === "الإسم" || cell.trim() === "الاسم")) &&
        r.some(cell => typeof cell === 'string' && cell.trim() === "التاريخ")
      );
      if (headerRowIndex === -1) {
        throw new Error(`فشل الاستيراد في ${targetInfo.title}: لم يتم العثور على رؤوس الأعمدة المتوقعة (مثل 'الاسم' و 'التاريخ').`);
      }

      const headers = rows[headerRowIndex].map(h => String(h || '').trim());
      const dataRows = rows.slice(headerRowIndex + 1);
      if (dataRows.length === 0) {
        throw new Error(`فشل الاستيراد في ${targetInfo.title}: الملف لا يحتوي على أي بيانات صالحة.`);
      }

      const headerMap: { [key: string]: keyof FormDataState } = {
        "السنة": "year",
        "التاريخ": "date",
        "اسم المقر": "location",
        "المقر": "location",
        "الإسم": "name",
        "الاسم": "name",
        "رقم الهاتف": "phone",
        "الهاتف": "phone",
        "الإدارة المتجه اليها": "department",
        "الإدارة": "department",
        "الغرض": "purpose",
        "الغرض من الزيارة": "purpose",
        "الموظف المستقبل": "receivedBy",
        "توقيت الدخول": "timeIn",
        "توقيت الخروج": "timeOut",
        "اثبات الهوية": "idType",
        "إثبات الهوية": "idType",
        "الملاحظات": "notes"
      };
      const indices: { [key in keyof FormDataState]?: number } = {};
      Object.entries(headerMap).forEach(([header, modelKey]) => {
        const index = headers.indexOf(header);
        if (index > -1 && indices[modelKey] === undefined) indices[modelKey] = index;
      });

      if (indices.name === undefined || indices.date === undefined) {
        throw new Error(`فشل الاستيراد في ${targetInfo.title}: الملف يفتقد لأعمدة أساسية (الاسم أو التاريخ).`);
      }

      const excelSerialToJSDate = (s: number) => new Date(Math.round((s - 25569) * 86400 * 1000));

      const importedRecords = dataRows.map((row, i) => {
        const record: Partial<Record> = {};
        for (const key in indices) {
          const modelKey = key as keyof typeof indices;
          const idx = indices[modelKey];
          if (idx !== undefined && row[idx] !== null && row[idx] !== undefined) {
            let value = row[idx];
            if (modelKey === 'date' && typeof value === 'number' && value > 1) {
              value = excelSerialToJSDate(value).toISOString().split('T')[0];
            }
            if (modelKey === 'year') {
              const parsedYear = Number(value);
              if (!isNaN(parsedYear) && parsedYear > 1900) {
                record.year = parsedYear;
              }
            } else {
              (record as any)[modelKey] = String(value).trim();
            }
          }
        }

        if (!record.year && record.date) {
          const derivedYear = new Date(record.date).getFullYear();
          if (!isNaN(derivedYear)) {
            record.year = derivedYear;
          }
        }

        return {
          ...initialFormState,
          ...record,
          type: targetType,
          receivedBy: targetType === 'visitor' ? (record.receivedBy || '') : '',
          id: `imported_${targetType}_${Date.now()}_${i}`,
          createdAt: new Date()
        } as Record;
      }).filter(r => r.name && r.date);

      if (importedRecords.length === 0) {
        throw new Error(`لم يتم العثور على سجلات صالحة للاستيراد في ${targetInfo.title}.`);
      }

      const updatedRecords = [...importedRecords, ...records];
      setRecords(updatedRecords);
      try {
        localStorage.setItem('visitor_records', JSON.stringify(updatedRecords));
      } catch {
        // Ignore storage quota or access errors
      }
      setImportStatus({
        status: 'success',
        targetType,
        message: `تم استيراد ${importedRecords.length} سجل إلى ${targetInfo.title} بنجاح!`
      });
    } catch (error: any) {
      setImportStatus({
        status: 'error',
        targetType,
        message: error.message
      });
    } finally {
      setTimeout(() => setImportStatus({ status: 'idle' }), 5000);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setFilterLocation('');
    setFilterYear('');
    setFilterMonth('');
    setSortOrder('desc');
  };

  const visitorRecords = filteredRecords.filter(r => r.type === 'visitor');
  const supplierRecords = filteredRecords.filter(r => r.type === 'supplier');
  const employeeRecords = filteredRecords.filter(r => r.type === 'employee');

  //SAAED Field & Label Styling matching Reference Image
  const saaedInputClasses =
    "flex-1 min-w-0 h-8 sm:h-[31px] px-3 text-xs sm:text-[13px] font-semibold border border-[#BACDE7] rounded-lg bg-[#E7F0FC] text-[#102442] placeholder-[#526784] shadow-[inset_0_1px_2px_rgba(16,36,66,0.05)] transition-all duration-200 focus:outline-none focus:bg-white focus:border-[#2563A8] focus:ring-2 focus:ring-[#2563A8]/20";
  const saaedIconBoxClasses =
    "w-8 h-8 sm:w-[31px] sm:h-[31px] rounded-lg bg-gradient-to-b from-[#EBF3FE] to-[#DCE8FA] border border-[#BACDE7] flex items-center justify-center text-[#102442] shadow-xs shrink-0";
  const saaedLabelClasses =
    "block mb-0.5 pr-1 text-[11px] sm:text-xs leading-tight font-extrabold text-[#102442] text-right";
  const filterInputClasses =
    "px-3 py-2 min-h-[40px] border border-[#BACDE7] rounded-xl text-xs sm:text-sm bg-[#F7FAFF] text-[#102442] placeholder-[#526784] focus:outline-none focus:bg-white focus:border-[#2563A8] focus:ring-2 focus:ring-[#2563A8]/20 transition-colors";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#EAF2FD]">
        <div className="w-8 h-8 border-4 border-[#153B73] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleLoginSuccess = (username: string) => {
    try {
      sessionStorage.setItem('saher_session_active', 'true');
      sessionStorage.setItem('saher_session_user', username);
    } catch {
      // Ignore storage restrictions
    }
    setCurrentUser(username);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('saher_session_active');
      sessionStorage.removeItem('saher_session_user');
    } catch {
      // Ignore storage restrictions
    }
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Format Active Location for KPI Card 1 into primary & secondary lines matching Reference Image
  const rawActiveLocation = quickStats.topLoc !== 'لا يوجد' ? quickStats.topLoc : PREDEFINED_LOCATIONS[0];
  const locationParts = rawActiveLocation.split('-').map(part => part.trim()).filter(Boolean);
  const locationTitleLine = locationParts[0] ? locationParts[0].replace('ساهر', 'ساعد') : 'مقر ساعد';
  const locationSubLine =
    locationParts.length > 1 ? locationParts.slice(1).join(' - ') : 'أبوظبي - عمارات';

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#DCE9FA] via-[#EAF2FD] to-[#DDEAFD] text-[#102442] font-arabic flex flex-col select-text"
      dir="rtl"
    >
      {/* =====================================================================
          1. EXACT SAAED TOP HEADER (الترويسة الكحلية العليا)
         ===================================================================== */}
      <header className="relative bg-gradient-to-l from-[#07162C] via-[#0B2246] to-[#061329] text-white shadow-xl z-40 print:hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-2.5 pb-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
            {/* RIGHT: Official SAAED Logo + Vertical Divider */}
            <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-start">
              <div className="flex items-center gap-3.5">
                <img
                  src={logoSrc}
                  onError={handleLogoError}
                  alt="SAAED ساعد"
                  className="h-11 sm:h-14 w-auto object-contain select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
                />
                <div
                  aria-hidden="true"
                  className="hidden lg:block w-[1px] h-11 bg-gradient-to-b from-transparent via-white/30 to-transparent"
                />
              </div>

              {/* Mobile-only compact Logout & Date */}
              <div className="flex lg:hidden items-center gap-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  title={`تسجيل الخروج (${currentUser})`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#0d2244]/90 hover:bg-red-900/80 border border-[#F4BF19]/60 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <span>خروج</span>
                  <LogOut className="w-3.5 h-3.5 text-[#F4BF19]" />
                </button>
              </div>
            </div>

            {/* CENTER: Department Badge + System Arabic & English Titles */}
            <div className="text-center flex flex-col items-center">
              <div className="inline-flex items-center justify-center border border-[#F4BF19]/75 bg-[#091c3a]/90 px-4 py-0.5 rounded-full shadow-inner mb-1">
                <span className="text-[11px] sm:text-xs md:text-[13px] font-bold text-[#FFD45B] tracking-wide">
                  إدارة الخدمات العامة / قسم إدارة المرافق
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-[28px] font-extrabold text-white leading-tight tracking-tight drop-shadow-sm">
                نظام تسجيل الزوار والموردين
              </h1>
              <p
                dir="ltr"
                className="text-[10px] sm:text-xs md:text-[13px] font-bold text-white/95 tracking-[0.07em] uppercase font-english mt-0.5"
              >
                VISITOR &amp; SUPPLIER MANAGEMENT SYSTEM
              </p>
            </div>

            {/* LEFT: Current Date Pill + Logout Button */}
            <div className="hidden lg:flex items-center gap-2.5">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white bg-[#0b1f3f]/90 border border-[#F4BF19]/50 px-3.5 py-1.5 rounded-lg shadow-inner">
                <Calendar className="w-4 h-4 text-[#F4BF19] shrink-0" />
                <span className="font-bold">
                  {new Date().toLocaleDateString('ar-AE', { weekday: 'long' })}
                </span>
                <span dir="ltr" className="font-english font-semibold text-slate-100">
                  {new Date().toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                title={`تسجيل الخروج (${currentUser})`}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-[#0b1f3f]/90 hover:bg-red-900/75 border border-[#F4BF19]/55 hover:border-red-400 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-inner"
              >
                <span>خروج</span>
                <LogOut className="w-4 h-4 text-[#F4BF19] shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* Sweeping Golden Wave Border at Bottom of Header */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -bottom-2 h-4 w-full overflow-hidden z-20"
        >
          <svg
            viewBox="0 0 1440 24"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="headerGoldWave" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d49b12" />
                <stop offset="20%" stopColor="#FFE17D" />
                <stop offset="55%" stopColor="#F4BF19" />
                <stop offset="100%" stopColor="#b8820a" />
              </linearGradient>
            </defs>
            <path
              d="M0,18 C220,2 480,2 760,14 C1040,24 1260,16 1440,8 L1440,13 C1260,21 1040,27 760,18 C480,7 220,8 0,24 Z"
              fill="url(#headerGoldWave)"
            />
          </svg>
        </div>
      </header>

      {/* =====================================================================
          2. EXACT HERO SECTION (قسم الترحيب المصور)
             - Left: Photorealistic UAE Reception Scene (Men only) + Independent SAAED Logo on Wall
             - Right: Navy Gradient + Welcome Heading & Description + Golden Badge Icon
         ===================================================================== */}
      <section
        aria-label="قسم الترحيب"
        className="relative w-full bg-[#07162C] overflow-hidden border-b border-[#1c3b6e] print:hidden"
      >
        <div
          dir="ltr"
          className="relative max-w-[1440px] mx-auto min-h-[165px] sm:min-h-[190px] lg:h-[196px] flex items-center"
        >
          {/* Left Reception Scene Photographic Layer */}
          <div className="relative w-full lg:w-[58%] h-[180px] sm:h-[196px] shrink-0 overflow-hidden">
            <img
              src={`${baseUrl}assets/saaed/hero-reception-clean.png`}
              alt="مشهد استقبال مؤسسي في شركة ساعد يظهر موظف الاستقبال يستلم بطاقة الزائر"
              width={812}
              height={176}
              className="w-full h-full object-cover object-left select-none"
            />

            {/* Independent Original SAAED Logo Placed Directly Over the Reception Wall (Location #2) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-[14%] left-[69%] w-[23%] max-w-[175px] flex items-center justify-center"
            >
              <img
                src={logoSrc}
                onError={handleLogoError}
                alt=""
                className="w-full h-auto object-contain select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)]"
              />
            </div>

            {/* Smooth Right-Edge Gradient Blend into the Navy Welcome Area */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-[#081d3f] via-[#081d3f]/75 to-transparent"
            />
          </div>

          {/* Right Modern Glass Facade Accent */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute right-0 inset-y-0 w-[95px] overflow-hidden"
          >
            <img
              src={`${baseUrl}assets/saaed/hero-building-right.png`}
              alt=""
              width={78}
              height={176}
              className="w-full h-full object-cover object-right opacity-90 select-none"
            />
            <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#081d3f] to-transparent" />
          </div>

          {/* Right Welcome Text Overlay (Real Selectable HTML in RTL) */}
          <div
            dir="rtl"
            className="absolute inset-0 lg:static lg:flex-1 bg-gradient-to-l from-[#07162C]/95 via-[#092147]/90 to-[#07162C]/65 lg:bg-gradient-to-r lg:from-[#081d3f] lg:via-[#0b2652] lg:to-[#071835] flex items-center justify-end px-4 sm:px-8 lg:pl-10 lg:pr-20 z-10"
          >
            <div className="flex items-start gap-3.5 sm:gap-5 max-w-xl text-right">
              {/* Golden Visitor Badge Icon on the Right */}
              <div className="shrink-0 mt-1">
                <HeroVisitorBadgeIcon className="w-11 h-11 sm:w-14 sm:h-14 drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)]" />
              </div>

              {/* Selectable Arabic Heading, Description & Golden Accent Bar */}
              <div className="space-y-1.5">
                <h2 className="text-lg sm:text-2xl lg:text-[26px] font-extrabold text-white leading-snug drop-shadow-sm">
                  مرحباً بك في نظام تسجيل الزوار والموردين
                </h2>
                <p className="text-xs sm:text-sm lg:text-[14.5px] font-medium text-slate-100/95 leading-relaxed">
                  منصة مؤسسية ذكية لتنظيم وإدارة عمليات تسجيل الزوار والموردين ومتابعة حركة الدخول والخروج بكفاءة واحترافية.
                </p>
                <div className="pt-1.5 flex justify-start">
                  <span
                    aria-hidden="true"
                    className="block w-36 sm:w-44 h-[4px] rounded-full bg-gradient-to-l from-[#FFD45B] via-[#F4BF19] to-[#c58f0e] shadow-[0_0_10px_rgba(244,191,25,0.45)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          MAIN WORKSPACE AREA
         ===================================================================== */}
      <main className="max-w-[1440px] w-full mx-auto px-3 sm:px-6 pb-8 flex-grow relative z-30">
        {/* ===================================================================
            3. ALERTS & LIVE INFO BAR (شريط التنبيهات والمعلومات)
           =================================================================== */}
        <div className="mt-3.5 sm:mt-4 mb-4 print:hidden">
          <div className="bg-gradient-to-r from-[#07162C] via-[#0c2347] to-[#07162C] rounded-full shadow-[0_8px_24px_rgba(6,19,41,0.38)] border border-[#3b5c8f]/80 h-11 sm:h-12 flex items-center relative overflow-hidden group">
            {/* Far Right Golden Pill: آخر التنبيهات */}
            <div className="bg-gradient-to-b from-[#FFD45B] to-[#F4BF19] h-full px-4 sm:px-6 flex items-center gap-2 z-20 relative shadow-[4px_0_15px_rgba(0,0,0,0.35)] shrink-0 rounded-r-full">
              <Bell className="w-4 h-4 text-[#07162C] shrink-0" />
              <span className="text-[#07162C] font-extrabold text-xs sm:text-sm whitespace-nowrap">
                آخر التنبيهات
              </span>
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 w-4 h-full bg-gradient-to-b from-[#FFD45B] to-[#F4BF19] -skew-x-12 -translate-x-2"
              />
            </div>

            {/* Live Indicators Stream (Preserves Left-to-Right Marquee + Real quickStats Data) */}
            <div
              className="flex-1 min-w-0 h-full relative flex items-center overflow-hidden"
              dir="ltr"
            >
              <div className="absolute inset-y-0 left-0 flex items-center whitespace-nowrap animate-ticker w-max z-10">
                {[0, 1].map((halfIndex) => (
                  <div key={halfIndex} className="flex items-center gap-8 pr-8 shrink-0">
                    {[0, 1].map((repeatIndex) => (
                      <React.Fragment key={`${halfIndex}-${repeatIndex}`}>
                        {/* المقر النشط */}
                        <div className="flex items-center gap-2" dir="rtl">
                          <MapPin className="w-4 h-4 text-[#F4BF19] shrink-0" />
                          <span className="text-slate-300 text-xs sm:text-sm font-medium">
                            المقر النشط :
                          </span>
                          <span className="text-white font-bold text-xs sm:text-sm">
                            {rawActiveLocation.replace('ساهر', 'ساعد')}
                          </span>
                        </div>

                        <span className="text-[#F4BF19]/50 font-bold">‹</span>

                        {/* موظفين اليوم */}
                        <div className="flex items-center gap-2" dir="rtl">
                          <Users className="w-4 h-4 text-[#F4BF19] shrink-0" />
                          <span className="text-slate-300 text-xs sm:text-sm font-medium">
                            موظفين اليوم
                          </span>
                          <span className="text-white font-extrabold text-xs sm:text-sm">
                            {quickStats.employeesToday}
                          </span>
                        </div>

                        <span className="text-[#F4BF19]/50 font-bold">‹</span>

                        {/* موردين اليوم */}
                        <div className="flex items-center gap-2" dir="rtl">
                          <Truck className="w-4 h-4 text-[#F4BF19] shrink-0" />
                          <span className="text-slate-300 text-xs sm:text-sm font-medium">
                            موردين اليوم
                          </span>
                          <span className="text-white font-extrabold text-xs sm:text-sm">
                            {quickStats.suppliersToday}
                          </span>
                        </div>

                        <span className="text-[#F4BF19]/50 font-bold">‹</span>

                        {/* زوار اليوم */}
                        <div className="flex items-center gap-2" dir="rtl">
                          <UserPlus className="w-4 h-4 text-[#F4BF19] shrink-0" />
                          <span className="text-slate-300 text-xs sm:text-sm font-medium">
                            زوار اليوم
                          </span>
                          <span className="text-white font-extrabold text-xs sm:text-sm">
                            {quickStats.today}
                          </span>
                        </div>

                        <span className="text-[#F4BF19]/50 font-bold">‹</span>

                        {/* آخر زائر */}
                        <div className="flex items-center gap-2" dir="rtl">
                          <User className="w-4 h-4 text-[#F4BF19] shrink-0" />
                          <span className="text-slate-300 text-xs sm:text-sm font-medium">
                            آخر زائر :
                          </span>
                          <span className="text-white font-bold text-xs sm:text-sm" dir="ltr">
                            {quickStats.last}
                          </span>
                        </div>

                        <span className="text-[#F4BF19]/50 font-bold">‹</span>
                      </React.Fragment>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preserved Welcome Banner Notification */}
        <WelcomeBanner isVisible={showWelcomeBanner} onDismiss={handleDismissBanner} />

        {/* ===================================================================
            4. EXACT FIVE KPI CARDS ROW (بطاقات الإحصائيات الخمس)
               Ordered Right-to-Left matching Reference Image:
               1. المقر الحالي | 2. زوار اليوم | 3. موردو اليوم | 4. موظفو اليوم | 5. إجمالي السجلات
           =================================================================== */}
        <section
          aria-label="ملخص الإحصائيات السريعة"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-5 print:hidden"
        >
          {/* Card 1: Active Location (Far Right) */}
          <div className="bg-gradient-to-b from-[#FFFFFF] to-[#ECF4FE] border border-[#BFD4EE] rounded-2xl px-4 py-3 shadow-[0_4px_14px_rgba(16,36,66,0.06)] flex items-center justify-between gap-3 min-h-[78px]">
            <div className="text-right min-w-0 flex-1">
              <p className="text-sm sm:text-base font-extrabold text-[#102442] leading-snug truncate">
                {locationTitleLine}
              </p>
              <p className="text-xs sm:text-[13px] font-semibold text-[#3B5272] truncate mt-0.5">
                {locationSubLine}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FDF4DC] to-[#F3DC9E] border border-[#E4C26B] flex items-center justify-center text-[#A16B0B] shadow-xs shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: زوار اليوم */}
          <div className="bg-gradient-to-b from-[#FFFFFF] to-[#ECF4FE] border border-[#BFD4EE] rounded-2xl px-4 py-3 shadow-[0_4px_14px_rgba(16,36,66,0.06)] flex items-center justify-between gap-3 min-h-[78px]">
            <div className="text-right min-w-0 flex-1">
              <p className="text-xl sm:text-2xl font-extrabold text-[#102442] leading-none font-english">
                {quickStats.today}
              </p>
              <p className="text-xs sm:text-[13px] font-bold text-[#3B5272] mt-1">
                زوار اليوم
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EEF5FF] to-[#D6E6FB] border border-[#B5CFF2] flex items-center justify-center text-[#153B73] shadow-xs shrink-0">
              <UserRound className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: موردو اليوم */}
          <div className="bg-gradient-to-b from-[#FFFFFF] to-[#ECF4FE] border border-[#BFD4EE] rounded-2xl px-4 py-3 shadow-[0_4px_14px_rgba(16,36,66,0.06)] flex items-center justify-between gap-3 min-h-[78px]">
            <div className="text-right min-w-0 flex-1">
              <p className="text-xl sm:text-2xl font-extrabold text-[#102442] leading-none font-english">
                {quickStats.suppliersToday}
              </p>
              <p className="text-xs sm:text-[13px] font-bold text-[#3B5272] mt-1">
                موردو اليوم
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FDF4DC] to-[#F3DC9E] border border-[#E4C26B] flex items-center justify-center text-[#B87B0E] shadow-xs shrink-0">
              <Truck className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: موظفو اليوم */}
          <div className="bg-gradient-to-b from-[#FFFFFF] to-[#ECF4FE] border border-[#BFD4EE] rounded-2xl px-4 py-3 shadow-[0_4px_14px_rgba(16,36,66,0.06)] flex items-center justify-between gap-3 min-h-[78px]">
            <div className="text-right min-w-0 flex-1">
              <p className="text-xl sm:text-2xl font-extrabold text-[#102442] leading-none font-english">
                {quickStats.employeesToday}
              </p>
              <p className="text-xs sm:text-[13px] font-bold text-[#3B5272] mt-1">
                موظفو اليوم
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EEF5FF] to-[#D6E6FB] border border-[#B5CFF2] flex items-center justify-center text-[#102442] shadow-xs shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 5: إجمالي السجلات (Far Left) */}
          <div className="bg-gradient-to-b from-[#FFFFFF] to-[#ECF4FE] border border-[#BFD4EE] rounded-2xl px-4 py-3 shadow-[0_4px_14px_rgba(16,36,66,0.06)] flex items-center justify-between gap-3 min-h-[78px]">
            <div className="text-right min-w-0 flex-1">
              <p className="text-xl sm:text-2xl font-extrabold text-[#102442] leading-none font-english">
                {records.length}
              </p>
              <p className="text-xs sm:text-[13px] font-bold text-[#3B5272] mt-1">
                إجمالي السجلات
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EEF5FF] to-[#D6E6FB] border border-[#B5CFF2] flex items-center justify-center text-[#153B73] shadow-xs shrink-0">
              <ClipboardList className="w-6 h-6" />
            </div>
          </div>
        </section>

        {/* ===================================================================
            5 & 6. MAIN WORKSPACE CONTAINER (شريط التبويبات + منطقة المحتوى)
           =================================================================== */}
        <div className="bg-[#F4F8FE]/95 border border-[#C6DAF3] rounded-[26px] p-3.5 sm:p-5 shadow-[0_14px_38px_rgba(15,38,74,0.08)]">
          {/* 5. THREE EQUAL-WIDTH NAVIGATION TABS (شريط التبويبات) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5 print:hidden">
            {/* Right Tab: تسجيل دخول جديد */}
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`min-h-[48px] px-4 py-2.5 rounded-xl font-extrabold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-gradient-to-b from-[#0D2346] to-[#07162C] text-white border-b-[3px] border-[#F4BF19] shadow-md'
                  : 'bg-gradient-to-b from-[#FFFFFF] to-[#EAF2FD] text-[#102442] border border-[#C2D6F0] hover:to-[#DCE9FB] shadow-xs'
              }`}
            >
              <UserPlus
                className={`w-5 h-5 shrink-0 ${
                  activeTab === 'form' ? 'text-[#F4BF19]' : 'text-[#153B73]'
                }`}
              />
              <span className="truncate">
                {editingId ? 'تعديل السجل' : 'تسجيل دخول جديد'}
              </span>
            </button>

            {/* Center Tab: عرض السجلات */}
            <button
              type="button"
              onClick={() => {
                if (editingId) cancelEdit();
                setActiveTab('list');
              }}
              className={`min-h-[48px] px-4 py-2.5 rounded-xl font-extrabold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-gradient-to-b from-[#0D2346] to-[#07162C] text-white border-b-[3px] border-[#F4BF19] shadow-md'
                  : 'bg-gradient-to-b from-[#FFFFFF] to-[#EAF2FD] text-[#102442] border border-[#C2D6F0] hover:to-[#DCE9FB] shadow-xs'
              }`}
            >
              <ClipboardList
                className={`w-5 h-5 shrink-0 ${
                  activeTab === 'list' ? 'text-[#F4BF19]' : 'text-[#153B73]'
                }`}
              />
              <span className="truncate">عرض السجلات ({filteredRecords.length})</span>
            </button>

            {/* Left Tab: الإحصائيات والتقارير */}
            <button
              type="button"
              onClick={() => {
                if (editingId) cancelEdit();
                setActiveTab('dashboard');
              }}
              className={`min-h-[48px] px-4 py-2.5 rounded-xl font-extrabold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-b from-[#0D2346] to-[#07162C] text-white border-b-[3px] border-[#F4BF19] shadow-md'
                  : 'bg-gradient-to-b from-[#FFFFFF] to-[#EAF2FD] text-[#102442] border border-[#C2D6F0] hover:to-[#DCE9FB] shadow-xs'
              }`}
            >
              <BarChart2
                className={`w-5 h-5 shrink-0 ${
                  activeTab === 'dashboard' ? 'text-[#F4BF19]' : 'text-[#153B73]'
                }`}
              />
              <span className="truncate">الإحصائيات والتقارير</span>
            </button>
          </div>

          {/* =================================================================
              6A. TAB 1 CONTENT: FORM (Right ~77%) + VISITOR ID CARD (Left ~23%)
             ================================================================= */}
          {activeTab === 'form' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch animate-fadeIn">
              {/* RIGHT COLUMN IN RTL (lg:col-span-9): PIXEL-PERFECT REGISTRATION FORM */}
              <div className="lg:col-span-9 bg-[#EAF2FD]/90 border border-[#C7DBF4] rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 shadow-inner flex flex-col justify-between order-1">
                <div>
                  {/* Centered Navy Form Title Bar with Golden Bottom Border */}
                  <div className="bg-gradient-to-b from-[#0D2346] to-[#07162C] border-b-[3px] border-[#F4BF19] rounded-full h-9 sm:h-[36px] mb-2.5 flex items-center justify-center gap-2 shadow-md w-full max-w-md mx-auto px-6">
                    <FilePenLine className="w-4 h-4 text-[#F4BF19] shrink-0" />
                    <h2 className="text-xs sm:text-sm md:text-[15px] font-extrabold text-white text-center truncate">
                      {editingId ? 'تعديل بيانات السجل' : 'بيانات تسجيل الدخول'}
                    </h2>
                  </div>

                  {/* Preserved Submit Status Notification */}
                  {submitStatus && (
                    <div
                      role="alert"
                      className={`mb-2.5 p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                        submitStatus.startsWith('success') || submitStatus === 'updated'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-red-100 text-red-900 border border-red-300'
                      }`}
                    >
                      {submitStatus.startsWith('success') || submitStatus === 'updated' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                      )}
                      <span>
                        {
                          {
                            success_offline: 'تم الحفظ بنجاح.',
                            updated: 'تم التحديث بنجاح.',
                            error: 'حدث خطأ.',
                          }[submitStatus]
                        }
                      </span>
                    </div>
                  )}

                  {/* Main Registration Form — Exact 7-Row Reference Layout */}
                  <form onSubmit={handleSubmit} className="space-y-1.5">
                    {/* ROW 1: النوع | السنة | التاريخ */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3.5">
                      {/* النوع */}
                      <div>
                        <label htmlFor="type" className={saaedLabelClasses}>
                          <span>النوع</span>
                          <span className="text-red-600 mr-0.5">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <div className={saaedIconBoxClasses} aria-hidden="true">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            className={`${saaedInputClasses} ${touched.type ? 'bg-white' : ''}`}
                          >
                            <option value="visitor">زائر</option>
                            <option value="supplier">مورد</option>
                            <option value="employee">موظف</option>
                          </select>
                        </div>
                      </div>

                      {/* السنة */}
                      <div>
                        <label htmlFor="year" className={saaedLabelClasses}>
                          <span>السنة</span>
                          <span className="text-red-600 mr-0.5">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <div className={saaedIconBoxClasses} aria-hidden="true">
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <select
                            id="year"
                            name="year"
                            value={formData.year}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            className={`${saaedInputClasses} font-english ${
                              touched.year ? 'bg-white' : ''
                            }`}
                          >
                            {YEARS.map((y) => (
                              <option key={y} value={y}>
                                {y}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* التاريخ */}
                      <div>
                        <label htmlFor="date" className={saaedLabelClasses}>
                          <span>التاريخ</span>
                          <span className="text-red-600 mr-0.5">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <div className={saaedIconBoxClasses} aria-hidden="true">
                            <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <input
                            id="date"
                            type="date"
                            name="date"
                            required
                            value={formData.date}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            dir="ltr"
                            className={`${saaedInputClasses} font-english text-right ${
                              touched.date ? 'bg-white' : ''
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* ROW 2: اسم المقر | اسم المراجع */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                      {/* اسم المقر */}
                      <div>
                        <label htmlFor="location" className={saaedLabelClasses}>
                          <span>اسم المقر</span>
                          <span className="text-red-600 mr-0.5">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <div className={saaedIconBoxClasses} aria-hidden="true">
                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <input
                            id="location"
                            type="text"
                            list="locations-list"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            placeholder="اسم المقر"
                            className={`${saaedInputClasses} ${
                              touched.location ? 'bg-white' : ''
                            } ${formErrors.location ? 'border-red-500 focus:border-red-500' : ''}`}
                          />
                          <datalist id="locations-list">
                            {allLocations.map((l) => (
                              <option key={l} value={l} />
                            ))}
                          </datalist>
                        </div>
                        {formErrors.location && (
                          <p className="text-red-600 text-xs font-bold mt-1 pr-12">
                            {formErrors.location}
                          </p>
                        )}
                      </div>

                      {/* اسم المراجع */}
                      <div>
                        <label htmlFor="name" className={saaedLabelClasses}>
                          <span>اسم المراجع</span>
                          <span className="text-red-600 mr-0.5">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <div className={saaedIconBoxClasses} aria-hidden="true">
                            <UserRound className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <input
                            id="name"
                            type="text"
                            name="name"
                            required
                            placeholder="اسم المراجع"
                            value={formData.name}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            className={`${saaedInputClasses} ${
                              formData.name ? 'bg-white' : ''
                            } ${formErrors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                          />
                        </div>
                        {formErrors.name && (
                          <p className="text-red-600 text-xs font-bold mt-1 pr-12">
                            {formErrors.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ROW 3: رقم الهاتف | الإدارة المنتمي إليها */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                      {/* رقم الهاتف */}
                      <div>
                        <label htmlFor="phone" className={saaedLabelClasses}>
                          <span>رقم الهاتف</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <div className={saaedIconBoxClasses} aria-hidden="true">
                            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <input
                            id="phone"
                            type="tel"
                            name="phone"
                            placeholder="رقم الهاتف"
                            value={formData.phone}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            dir="ltr"
                            className={`${saaedInputClasses} text-right ${
                              formData.phone ? 'bg-white' : ''
                            }`}
                          />
                        </div>
                      </div>

                      {/* الإدارة المنتمي إليها */}
                      <div>
                        <label htmlFor="department" className={saaedLabelClasses}>
                          <span>الإدارة المنتمي إليها</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <div className={saaedIconBoxClasses} aria-hidden="true">
                            <Network className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <input
                            id="department"
                            type="text"
                            name="department"
                            placeholder="الإدارة المنتمي إليها"
                            value={formData.department}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            className={`${saaedInputClasses} ${
                              touched.department ? 'bg-white' : ''
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* ROW 4: الغرض من الزيارة | الموظف الذي قام باستقبال الزائر */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                      {/* الغرض من الزيارة */}
                      <div className={formData.type !== 'visitor' ? 'md:col-span-2' : ''}>
                        <label htmlFor="purpose" className={saaedLabelClasses}>
                          <span>الغرض من الزيارة</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <div className={saaedIconBoxClasses} aria-hidden="true">
                            <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <input
                            id="purpose"
                            type="text"
                            name="purpose"
                            placeholder="الغرض من الزيارة"
                            value={formData.purpose}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            className={`${saaedInputClasses} ${
                              touched.purpose ? 'bg-white' : ''
                            }`}
                          />
                        </div>
                      </div>

                      {/* الموظف الذي قام باستقبال الزائر */}
                      {formData.type === 'visitor' && (
                        <div>
                          <label htmlFor="receivedBy" className={saaedLabelClasses}>
                            <span>الموظف الذي قام باستقبال الزائر</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <div className={saaedIconBoxClasses} aria-hidden="true">
                              <UserRound className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <input
                              id="receivedBy"
                              type="text"
                              name="receivedBy"
                              placeholder="اسم الموظف"
                              value={formData.receivedBy || ''}
                              onChange={handleInputChange}
                              onFocus={handleFocus}
                              className={`${saaedInputClasses} ${
                                touched.receivedBy ? 'bg-white' : ''
                              }`}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ROW 5: توقيت الدخول | توقيت الخروج */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                      {/* توقيت الدخول */}
                      <div>
                        <label htmlFor="timeIn" className={saaedLabelClasses}>
                          <span>توقيت الدخول</span>
                          <span className="text-red-600 mr-0.5">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <div className={saaedIconBoxClasses} aria-hidden="true">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <input
                            id="timeIn"
                            type="time"
                            name="timeIn"
                            value={formData.timeIn}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            dir="ltr"
                            className={`${saaedInputClasses} font-english text-right ${
                              touched.timeIn ? 'bg-white' : ''
                            }`}
                          />
                        </div>
                      </div>

                      {/* توقيت الخروج */}
                      <div>
                        <label htmlFor="timeOut" className={saaedLabelClasses}>
                          <span>توقيت الخروج</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <div className={saaedIconBoxClasses} aria-hidden="true">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <input
                            id="timeOut"
                            type="time"
                            name="timeOut"
                            value={formData.timeOut}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            dir="ltr"
                            className={`${saaedInputClasses} font-english text-right ${
                              touched.timeOut ? 'bg-white' : ''
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* ROW 6: إثبات الهوية */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                      <div>
                        <label htmlFor="idType" className={saaedLabelClasses}>
                          <span>إثبات الهوية</span>
                          <span className="text-red-600 mr-0.5">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <div className={saaedIconBoxClasses} aria-hidden="true">
                            <IdCard className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <select
                            id="idType"
                            name="idType"
                            value={formData.idType}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            className={`${saaedInputClasses} ${
                              touched.idType ? 'bg-white' : ''
                            }`}
                          >
                            <option>الهوية الوطنية</option>
                            <option>رخصة قيادة</option>
                            <option>جواز سفر</option>
                            <option>بطاقة عمل</option>
                            <option>أخرى</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* ROW 7: الملاحظات */}
                    <div>
                      <label htmlFor="notes" className={saaedLabelClasses}>
                        <span>الملاحظات</span>
                      </label>
                      <div className="flex items-start gap-2">
                        <div className={saaedIconBoxClasses} aria-hidden="true">
                          <Pencil className="w-4 h-4" />
                        </div>
                        <textarea
                          id="notes"
                          name="notes"
                          rows={1}
                          placeholder="الملاحظات"
                          value={formData.notes}
                          onChange={handleInputChange}
                          onFocus={handleFocus}
                          className={`flex-1 min-w-0 h-9 sm:h-[36px] px-3 py-1.5 text-xs sm:text-[13px] font-semibold border border-[#BACDE7] rounded-lg bg-[#E7F0FC] text-[#102442] placeholder-[#526784] shadow-[inset_0_1px_2px_rgba(16,36,66,0.05)] resize-none transition-all duration-200 focus:outline-none focus:bg-white focus:border-[#2563A8] focus:ring-2 focus:ring-[#2563A8]/20 ${
                            touched.notes ? 'bg-white' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* SUBMIT BUTTON ROW: حفظ البيانات */}
                    <div className="pt-1.5 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3">
                      <button
                        type="submit"
                        className="w-full sm:w-72 h-9 sm:h-[38px] bg-gradient-to-b from-[#0D2346] to-[#07162C] border-b-[3px] border-[#F4BF19] rounded-full shadow-[0_6px_18px_rgba(7,22,44,0.35)] flex items-center justify-center gap-2 text-white font-extrabold text-xs sm:text-sm hover:from-[#143261] hover:to-[#0A1E3C] active:scale-[0.99] transition-all duration-200 cursor-pointer"
                      >
                        <Save className="w-4 h-4 text-[#F4BF19] shrink-0" />
                        <span>{editingId ? 'تحديث البيانات' : 'حفظ البيانات'}</span>
                      </button>

                      {editingId && (
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="w-full sm:w-28 h-9 sm:h-[38px] bg-white border border-[#BACDE7] rounded-full shadow-sm flex items-center justify-center text-[#102442] font-bold text-xs sm:text-sm hover:bg-slate-100 active:scale-[0.99] transition-all cursor-pointer"
                        >
                          إلغاء
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              {/* LEFT COLUMN IN RTL (lg:col-span-3): VISITOR ID VISUAL CARD */}
              <aside
                aria-label="بطاقة تعريف الزائر"
                className="lg:col-span-3 relative w-full max-w-[360px] lg:max-w-none mx-auto aspect-[560/756] lg:aspect-auto rounded-2xl overflow-hidden border border-[#C2D6F0] shadow-md bg-[#081C3A] flex items-center justify-center order-2"
              >
                <img
                  src={`${baseUrl}assets/saaed/visitor-id-card.png`}
                  alt="بطاقة تعريف زائر تحمل شعار ساعد على مكتب الاستقبال"
                  width={560}
                  height={756}
                  className="w-full h-full object-fill select-none block"
                />
              </aside>
            </div>
          )}

          {/* =================================================================
              6B. TAB 2 CONTENT: RECORDS LIST & FILTERS (عرض السجلات)
             ================================================================= */}
          {activeTab === 'list' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-[#EAF2FD]/90 p-4 sm:p-6 rounded-2xl shadow-inner border border-[#C7DBF4]">
                <div className="bg-gradient-to-b from-[#0D2346] to-[#07162C] border-b-[3px] border-[#F4BF19] rounded-full h-11 mb-5 flex items-center justify-center gap-2.5 shadow-md w-full max-w-md mx-auto px-6 print:hidden">
                  <Database className="w-5 h-5 text-[#F4BF19] shrink-0" />
                  <h2 className="text-sm sm:text-base md:text-lg font-extrabold text-white text-center truncate">
                    قاعدة البيانات ({filteredRecords.length} سجل)
                  </h2>
                </div>

                {/* Action Toolbar */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-5 gap-3 print:hidden">
                  <div className="flex-1">
                    {importStatus.status !== 'idle' && (
                      <div
                        className={`p-2.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-2 w-fit ${
                          importStatus.status === 'importing'
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : importStatus.status === 'success'
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}
                      >
                        {importStatus.status === 'importing' && (
                          <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        )}
                        {importStatus.status === 'success' && (
                          <CheckCircle className="w-4 h-4 shrink-0" />
                        )}
                        {importStatus.status === 'error' && (
                          <AlertCircle className="w-4 h-4 shrink-0" />
                        )}
                        <span>{importStatus.message}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:flex gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="min-h-[40px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#07162C] text-white border-b-2 border-[#F4BF19] flex items-center justify-center gap-2 hover:bg-[#102a52] transition-colors shadow-sm cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-[#F4BF19]" />
                      <span>طباعة</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleExportExcel}
                      disabled={!xlsxLoaded || filteredRecords.length === 0}
                      className="min-h-[40px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#153B73] text-white border-b-2 border-[#F4BF19] disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-[#1d4d94] transition-colors shadow-sm cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-[#F4BF19]" />
                      <span>تصدير</span>
                    </button>
                  </div>
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2.5 sm:gap-3 items-center print:hidden bg-white/85 p-3 sm:p-4 rounded-xl border border-[#BACDE7]">
                  <div className="lg:col-span-2">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="بحث بالاسم أو الهاتف..."
                      className={`${filterInputClasses} w-full`}
                    />
                  </div>
                  <div>
                    <select
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                      className={`${filterInputClasses} w-full`}
                      aria-label="السنة"
                    >
                      <option value="">كل السنوات</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      value={filterMonth}
                      onChange={(e) => setFilterMonth(e.target.value)}
                      className={`${filterInputClasses} w-full`}
                      aria-label="الشهر"
                    >
                      <option value="">كل الشهور</option>
                      {MONTHS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      title="من تاريخ"
                      className={`${filterInputClasses} w-full text-xs sm:text-sm`}
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      title="إلى تاريخ"
                      className={`${filterInputClasses} w-full text-xs sm:text-sm`}
                      dir="ltr"
                    />
                  </div>
                  <div className="flex gap-2 lg:col-span-1">
                    <select
                      value={filterLocation}
                      onChange={(e) => setFilterLocation(e.target.value)}
                      className={`${filterInputClasses} flex-1 min-w-0`}
                      aria-label="المقر"
                    >
                      <option value="">كل المقرات</option>
                      {allLocations.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className={`${filterInputClasses} bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-1 px-3 shrink-0 cursor-pointer`}
                      title="مسح الفلاتر"
                    >
                      <FilterX className="w-4 h-4 text-[#102442]" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6 hide-when-printing-matrix">
                <TableSection
                  title="سجل الزوار"
                  recordType="visitor"
                  data={visitorRecords}
                  icon={Users}
                  colorTheme="navy"
                  onEdit={startEdit}
                  onDelete={setRecordToDelete}
                  sortOrder={sortOrder}
                  onSortChange={handleSortChange}
                  isVisitorTable={true}
                  onImportExcel={handleSectionExcelImport}
                  xlsxLoaded={xlsxLoaded}
                  importStatus={importStatus}
                />

                <TableSection
                  title="سجل الموردين"
                  recordType="supplier"
                  data={supplierRecords}
                  icon={Truck}
                  colorTheme="teal"
                  onEdit={startEdit}
                  onDelete={setRecordToDelete}
                  sortOrder={sortOrder}
                  onSortChange={handleSortChange}
                  onImportExcel={handleSectionExcelImport}
                  xlsxLoaded={xlsxLoaded}
                  importStatus={importStatus}
                />

                <TableSection
                  title="سجل الموظفين (بدون تصريح)"
                  recordType="employee"
                  data={employeeRecords}
                  icon={UserCog}
                  colorTheme="purple"
                  onEdit={startEdit}
                  onDelete={setRecordToDelete}
                  sortOrder={sortOrder}
                  onSortChange={handleSortChange}
                  onImportExcel={handleSectionExcelImport}
                  xlsxLoaded={xlsxLoaded}
                  importStatus={importStatus}
                />
              </div>
            </div>
          )}

          {/* =================================================================
              6C. TAB 3 CONTENT: DASHBOARD & REPORTS (الإحصائيات والتقارير)
             ================================================================= */}
          {activeTab === 'dashboard' && <DashboardView records={records} />}
        </div>
      </main>

      {/* =====================================================================
          7. EXACT CORPORATE FOOTER (التذييل المؤسسي لشركة ساعد)
         ===================================================================== */}
      <footer className="relative bg-gradient-to-b from-[#07162C] to-[#051022] text-slate-200 pt-6 pb-[calc(1rem+env(safe-area-inset-bottom))] mt-auto border-t-2 border-[#F4BF19] overflow-hidden print:hidden">
        {/* Top-Right Golden Corner Ribbon Accent (Matching Reference Image) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 w-44 h-24 overflow-hidden z-10"
        >
          <svg viewBox="0 0 200 110" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="footerRightGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE07D" />
                <stop offset="55%" stopColor="#F4BF19" />
                <stop offset="100%" stopColor="#A67408" />
              </linearGradient>
            </defs>
            <path
              d="M60,0 L200,0 L200,85 C155,55 110,22 60,0 Z"
              fill="url(#footerRightGold)"
            />
          </svg>
        </div>

        {/* Bottom-Left Abu Dhabi Skyline Towers (Seamless Reference Integration) */}
        <div
          aria-hidden="true"
          className="pointer-events-none hidden lg:block absolute left-0 bottom-0 top-0 w-[300px] z-0 overflow-hidden [mask-image:linear-gradient(to_right,black_75%,transparent_100%)]"
        >
          <img
            src={`${baseUrl}assets/saaed/footer-skyline.png`}
            alt=""
            width={290}
            height={146}
            className="w-full h-full object-contain object-left-bottom select-none"
          />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-right lg:pl-60">
            {/* RIGHT COLUMN (md:col-span-5): Original SAAED Logo + Company Description (Location #4) */}
            <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-right md:pl-6 md:border-l md:border-white/20">
              <img
                src={logoSrc}
                onError={handleLogoError}
                alt="SAAED ساعد"
                className="h-12 sm:h-14 w-auto object-contain mb-2.5 select-none"
              />
              <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed max-w-md">
                شركة ساعد في تقديم الحلول والخدمات الذكية، ملتزمون بالابتكار والجودة لتحقيق أعلى مستويات الكفاءة والخدمات الذكية.
              </p>
            </div>

            {/* CENTER COLUMN (md:col-span-3): روابط سريعة */}
            <div className="md:col-span-3 flex flex-col items-center md:items-start md:px-4 md:border-l md:border-white/20">
              <div className="mb-2.5">
                <h3 className="text-sm sm:text-base font-extrabold text-white pb-1">
                  روابط سريعة
                </h3>
                <span
                  aria-hidden="true"
                  className="block w-14 h-[2px] bg-[#F4BF19] rounded-full"
                />
              </div>
              <ul className="space-y-1.5 text-xs sm:text-[13px] text-slate-200">
                <li>
                  <a
                    href="#form"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('form');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[#FFD45B] transition-colors flex items-center gap-2 py-0.5"
                  >
                    <Home className="w-4 h-4 text-white shrink-0" />
                    <span>الرئيسية</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#list"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('list');
                    }}
                    className="hover:text-[#FFD45B] transition-colors flex items-center gap-2 py-0.5"
                  >
                    <LayoutGrid className="w-4 h-4 text-white shrink-0" />
                    <span>خدماتنا</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:Logistic@saaed.ae"
                    className="hover:text-[#FFD45B] transition-colors flex items-center gap-2 py-0.5"
                  >
                    <Send className="w-4 h-4 text-white shrink-0" />
                    <span>تواصل معنا</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* LEFT COLUMN (md:col-span-4): تواصل معنا */}
            <div className="md:col-span-4 flex flex-col items-center md:items-start md:pr-2">
              <div className="mb-2.5">
                <h3 className="text-sm sm:text-base font-extrabold text-white pb-1">
                  تواصل معنا
                </h3>
                <span
                  aria-hidden="true"
                  className="block w-14 h-[2px] bg-[#F4BF19] rounded-full"
                />
              </div>
              <ul className="space-y-2 text-xs sm:text-[13px] text-slate-200">
                <li className="flex items-center justify-end gap-2.5" dir="ltr">
                  <span className="font-english text-slate-100">
                    Level 3, Baynona Building, Khalif City A
                  </span>
                  <MapPin className="w-4 h-4 text-white shrink-0" />
                </li>
                <li className="flex items-center justify-end gap-2.5" dir="ltr">
                  <a
                    href="tel:+97141234567"
                    className="hover:text-[#FFD45B] transition-colors font-english text-slate-100"
                  >
                    +971 4 123 4567
                  </a>
                  <Phone className="w-4 h-4 text-white shrink-0" />
                </li>
                <li className="flex items-center justify-end gap-2.5" dir="ltr">
                  <a
                    href="mailto:Logistic@saaed.ae"
                    className="hover:text-[#FFD45B] transition-colors font-english text-slate-100"
                  >
                    Logistic@saaed.ae
                  </a>
                  <Mail className="w-4 h-4 text-white shrink-0" />
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="border-t border-[#F4BF19]/40 mt-4 pt-3 text-center">
            <p className="text-xs sm:text-[13px] font-bold text-white mb-0.5">
              إعداد وتصميم / خالد الهاشمي
            </p>
            <p className="text-[11px] sm:text-xs text-slate-300 font-english">
              جميع الحقوق محفوظة لـ © 2026 SAAED FOR SMART SERVICES
            </p>
          </div>
        </div>
      </footer>

      {/* Preserved Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!recordToDelete}
        onClose={() => setRecordToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="تأكيد الحذف"
        message="هل أنت متأكد من رغبتك في حذف هذا السجل؟ لا يمكن التراجع عن هذا الإجراء."
      />
    </div>
  );
}