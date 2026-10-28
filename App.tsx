import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Users, 
  Save, 
  Calendar, 
  Download,
  Pencil,
  CheckCircle,
  AlertCircle,
  Truck,
  UserCog,
  Upload,
  Settings,
  ClipboardCopy,
  ClipboardList,
  MapPin,
  User,
  Phone,
  Clock,
  CreditCard,
  Calendar as CalendarIcon,
  Trash2,
  FileSpreadsheet,
  FilePenLine,
  Mail,
  FilterX,
  Database,
  Printer,
  LayoutDashboard,
  Trophy,
  Bell,
  Activity,
  LogOut
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
    year: now.getFullYear(), // Use current system year dynamically
    location: '', 
    name: '', 
    phone: '',
    department: '', 
    purpose: '', 
    receivedBy: '',
    date: getLocalDateString(now), // Use local date
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
      // Ensure robust sorting by Date > Month > Year (descending) by handling missing times
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
        
        // Auto-update Year if Date changes
        if (name === 'date' && value) {
            const dateYear = new Date(value).getFullYear();
            if (!isNaN(dateYear)) {
                newData.year = dateYear;
            }
        }
        
        return newData;
    });

    if (formErrors[name]) setFormErrors(prev => ({...prev, [name]: ''}));
  };
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setTouched(prev => ({...prev, [e.target.name]: true }));
  };

  const validateForm = (): boolean => {
      const errors: { [key: string]: string } = {};
      if (!formData.name.trim()) errors.name = 'اسم المراجع مطلوب.';
      if (!formData.location.trim()) errors.location = 'اسم المقر مطلوب.';
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
  };

  const startEdit = (record: Record) => {
    setFormData({ type: record.type, year: record.year, location: record.location, name: record.name, phone: record.phone, department: record.department, purpose: record.purpose, date: record.date, timeIn: record.timeIn, timeOut: record.timeOut, idType: record.idType, notes: record.notes });
    setEditingId(record.id); setActiveTab('form'); setFormErrors({});
    const allTouched = Object.keys(record).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const cancelEdit = () => { 
    setFormData(initialFormState); setEditingId(null); setFormErrors({}); setTouched({});
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

    // Export all three record sections + a unified master sheet
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
          localStorage.setItem('visitor_records', JSON.stringify(updatedRecords));
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
  
  const baseInputClasses = "w-full p-2.5 sm:p-3 min-h-[44px] text-sm sm:text-base border border-slate-300 rounded-lg bg-slate-100 text-black placeholder-slate-500 transition-colors duration-200 ease-in-out focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
  const filterInputClasses = "px-3 py-2 min-h-[40px] border border-slate-300 rounded-lg text-sm bg-white text-black placeholder-slate-500 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors";
  const labelClasses = "block mb-1 text-sm font-medium text-slate-700";

  if (loading) return <div className="flex items-center justify-center h-screen bg-slate-100"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

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
  
  return (
    <div className="min-h-screen bg-transparent text-slate-800 font-sans flex flex-col" dir="rtl">
      <header className="bg-[#091526] text-white shadow-lg sticky top-0 z-50 border-b-4 border-[#eab308] print:hidden">
        <div className="container mx-auto px-4 py-3 sm:py-5">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 relative">
                
                {/* Logo Section */}
                <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start" dir="ltr">
                    <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-2xl sm:text-4xl font-sans shadow-2xl transform hover:scale-105 transition-transform border-2 border-slate-600">
                           <span className="absolute top-2 right-2 sm:top-3 sm:right-3 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]"></span>
                           </span>
                            S
                        </div>
                        <div>
                            <span className="font-extrabold text-white text-lg sm:text-xl tracking-wide block leading-tight">SAHER</span>
                            <span className="text-[9px] sm:text-[10px] text-slate-300 tracking-widest uppercase block leading-tight">For Smart Services</span>
                        </div>
                    </div>
                </div>

                {/* Text Section - Center */}
                <div className="text-center w-full lg:w-auto">
                  <h2 className="text-xs sm:text-sm md:text-base font-medium text-yellow-500 border border-[#12244d] px-3 sm:px-4 py-1 rounded-md inline-block mb-1">إدارة الخدمات العامة / قسم إدارة المرافق</h2>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-0.5 sm:mt-1">نظام تسجيل الزوار والموردين</h1>
                </div>

                {/* Date & User Session Section */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto justify-center lg:justify-end">
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-base text-slate-300 bg-slate-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-inner">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />
                    <span>{new Date().toLocaleDateString('ar-AE', { weekday: 'long' })}</span>
                    <span dir="ltr">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    title={`تسجيل الخروج (${currentUser})`}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-200 hover:text-white bg-slate-800/90 hover:bg-red-900/70 border border-slate-700 hover:border-red-500/50 px-3 py-1.5 sm:py-2 rounded-full transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-yellow-500" />
                    <span>خروج</span>
                  </button>
                </div>

            </div>
        </div>
      </header>

      {/* Secondary Header */}
      <div className="container mx-auto px-4 mt-4 sm:mt-6 relative z-40 print:hidden">
        <div className="bg-[#091526] border-b-4 border-[#eab308] shadow-sm rounded-xl py-3 sm:py-4 px-4 sm:px-6 flex items-center justify-center gap-2.5 sm:gap-3">
           <ClipboardList className="w-5 h-5 sm:w-7 sm:h-7 text-yellow-500 flex-shrink-0" />
           <h1 className="text-lg sm:text-2xl font-bold text-white text-center">
             تسجيل الزوار والموردين
           </h1>
        </div>
      </div>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 flex-grow">
        
        {/* Quick Info Bar - News Ticker Style */}
        <div className="mb-6 sm:mb-8 print:hidden">
            <div className="bg-[#091526] rounded-xl shadow-xl border-y-2 border-[#eab308] h-11 sm:h-12 flex items-center relative overflow-hidden group">
                
                {/* Fixed Label */}
                <div className="bg-[#eab308] h-full px-3 sm:px-5 flex items-center gap-1.5 sm:gap-2 z-20 relative shadow-[4px_0_15px_rgba(0,0,0,0.3)] flex-shrink-0">
                     <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#091526] animate-pulse" />
                     <span className="text-[#091526] font-extrabold text-xs sm:text-sm whitespace-nowrap">آخر المستجدات</span>
                     {/* Decorative skew */}
                     <div className="absolute top-0 left-0 w-3 sm:w-4 h-full bg-[#eab308] -skew-x-12 -translate-x-1.5 sm:-translate-x-2"></div>
                </div>

                {/* Scrolling Area */}
                <div className="flex-1 h-full relative flex items-center overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                     <div className="absolute inset-0 bg-[#091526]/80"></div>
                     {/* The Ticker Track */}
                     <div className="absolute flex items-center gap-12 whitespace-nowrap animate-ticker w-max right-0 z-10 px-4"> 
                         {/* Duplicating content 3 times to ensure it covers screens and loops decently for visual effect */}
                         {[1, 2, 3].map((_, i) => (
                             <React.Fragment key={i}>
                                <div className="flex items-center gap-2">
                                    <div className="p-1 rounded bg-white/10 text-[#eab308] border border-white/5"><User className="w-3 h-3" /></div>
                                    <span className="text-slate-400 text-xs font-medium">آخر زائر:</span>
                                    <span className="text-white font-bold text-sm" dir="ltr">{quickStats.last}</span>
                                </div>

                                <span className="text-[#eab308]/30">|</span>

                                <div className="flex items-center gap-2">
                                    <div className="p-1 rounded bg-white/10 text-[#eab308] border border-white/5"><Activity className="w-3 h-3" /></div>
                                    <span className="text-slate-400 text-xs font-medium">زوار اليوم:</span>
                                    <span className="text-white font-bold text-sm">{quickStats.today} <span className="text-[10px] font-normal text-slate-500">سجل</span></span>
                                </div>

                                <span className="text-[#eab308]/30">|</span>

                                <div className="flex items-center gap-2">
                                    <div className="p-1 rounded bg-white/10 text-[#eab308] border border-white/5"><Truck className="w-3 h-3" /></div>
                                    <span className="text-slate-400 text-xs font-medium">موردين اليوم:</span>
                                    <span className="text-white font-bold text-sm">{quickStats.suppliersToday}</span>
                                </div>

                                <span className="text-[#eab308]/30">|</span>

                                <div className="flex items-center gap-2">
                                    <div className="p-1 rounded bg-white/10 text-[#eab308] border border-white/5"><UserCog className="w-3 h-3" /></div>
                                    <span className="text-slate-400 text-xs font-medium">موظفين اليوم:</span>
                                    <span className="text-white font-bold text-sm">{quickStats.employeesToday}</span>
                                </div>

                                <span className="text-[#eab308]/30">|</span>

                                <div className="flex items-center gap-2">
                                    <div className="p-1 rounded bg-white/10 text-[#eab308] border border-white/5"><Trophy className="w-3 h-3" /></div>
                                    <span className="text-slate-400 text-xs font-medium">المقر الأنشط:</span>
                                    <span className="text-white font-bold text-sm">{quickStats.topLoc}</span>
                                </div>

                                <span className="text-[#eab308]/30">|</span>
                             </React.Fragment>
                         ))}
                     </div>
                </div>
            </div>
        </div>

        <WelcomeBanner isVisible={showWelcomeBanner} onDismiss={handleDismissBanner} />
        
        {/* Navigation Tabs - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 max-w-4xl mx-auto mb-6 print:hidden">
            <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={`relative overflow-hidden group min-h-[48px] px-3 sm:px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-start gap-3 shadow-md w-full
                ${activeTab === 'form'
                    ? 'bg-[#334155] text-white border-b-4 border-[#eab308]'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
            >
                <div className={`p-2 rounded-lg transition-colors flex-shrink-0 ${activeTab === 'form' ? 'bg-white/10 text-[#eab308]' : 'bg-slate-100 text-slate-500 group-hover:bg-[#334155] group-hover:text-[#eab308]'}`}>
                    <FilePenLine className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-right flex-1 min-w-0">
                    <p className={`text-[10px] font-medium mb-0 leading-none ${activeTab === 'form' ? 'text-slate-300' : 'text-slate-500'}`}>
                        {editingId ? 'تعديل البيانات' : 'إدخال جديد'}
                    </p>
                    <h3 className="text-xs sm:text-sm font-bold leading-tight mt-1 truncate">{editingId ? 'تعديل السجل' : 'تسجيل دخول جديد'}</h3>
                </div>
            </button>

            <button
                type="button"
                onClick={() => { if (editingId) cancelEdit(); setActiveTab('list'); }}
                className={`relative overflow-hidden group min-h-[48px] px-3 sm:px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-start gap-3 shadow-md w-full
                ${activeTab === 'list'
                    ? 'bg-[#334155] text-white border-b-4 border-[#eab308]'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
            >
                <div className={`p-2 rounded-lg transition-colors flex-shrink-0 ${activeTab === 'list' ? 'bg-white/10 text-[#eab308]' : 'bg-slate-100 text-slate-500 group-hover:bg-[#334155] group-hover:text-[#eab308]'}`}>
                    <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-right flex-1 min-w-0">
                    <p className={`text-[10px] font-medium mb-0 leading-none ${activeTab === 'list' ? 'text-slate-300' : 'text-slate-500'}`}>
                        قاعدة البيانات
                    </p>
                    <h3 className="text-xs sm:text-sm font-bold leading-tight mt-1 truncate">عرض السجلات ({filteredRecords.length})</h3>
                </div>
            </button>

            <button
                type="button"
                onClick={() => { if (editingId) cancelEdit(); setActiveTab('dashboard'); }}
                className={`relative overflow-hidden group min-h-[48px] px-3 sm:px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-start gap-3 shadow-md w-full
                ${activeTab === 'dashboard'
                    ? 'bg-[#334155] text-white border-b-4 border-[#eab308]'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
            >
                <div className={`p-2 rounded-lg transition-colors flex-shrink-0 ${activeTab === 'dashboard' ? 'bg-white/10 text-[#eab308]' : 'bg-slate-100 text-slate-500 group-hover:bg-[#334155] group-hover:text-[#eab308]'}`}>
                    <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="text-right flex-1 min-w-0">
                    <p className={`text-[10px] font-medium mb-0 leading-none ${activeTab === 'dashboard' ? 'text-slate-300' : 'text-slate-500'}`}>
                        لوحة المعلومات
                    </p>
                    <h3 className="text-xs sm:text-sm font-bold leading-tight mt-1 truncate">الإحصائيات والتقارير</h3>
                </div>
            </button>
        </div>

        {activeTab === 'form' && (
          <div className="bg-slate-50 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 max-w-4xl mx-auto border border-slate-200 animate-fadeIn">
            <div className="bg-[#334155] border-b-4 border-[#eab308] rounded-xl h-12 mb-6 flex items-center justify-center gap-3 shadow-md w-full max-w-3xl mx-auto px-4">
                <div className="p-1.5 bg-white/10 rounded-lg">
                    <FilePenLine className="w-5 h-5 text-[#eab308]" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white text-center truncate">
                    {editingId ? 'تعديل بيانات السجل' : 'بيانات تسجيل الدخول'}
                </h2>
            </div>
            {submitStatus && <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${submitStatus.startsWith('success') || submitStatus === 'updated' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>{ {success_offline: 'تم الحفظ بنجاح.', updated: 'تم التحديث بنجاح.', error: 'حدث خطأ.'}[submitStatus] }</div>}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <label htmlFor="type" className={`${labelClasses} flex items-center gap-2`}>
                    <ClipboardCopy className="w-4 h-4 text-slate-500" />
                    <span>النوع</span>
                  </label>
                  <select id="type" name="type" value={formData.type} onChange={handleInputChange} onFocus={handleFocus} className={`${baseInputClasses} ${touched.type ? 'bg-white' : ''}`}><option value="visitor">زائر</option><option value="supplier">مورد</option><option value="employee">موظف</option></select>
                </div>
                <div>
                  <label htmlFor="year" className={`${labelClasses} flex items-center gap-2`}>
                    <CalendarIcon className="w-4 h-4 text-slate-500" />
                    <span>السنة</span>
                  </label>
                  <select id="year" name="year" value={formData.year} onChange={handleInputChange} onFocus={handleFocus} className={`${baseInputClasses} ${touched.year ? 'bg-white' : ''}`}>{YEARS.map(y => <option key={y} value={y}>{y}</option>)}</select>
                </div>
                <div>
                  <label htmlFor="date" className={`${labelClasses} flex items-center gap-2`}>
                    <CalendarIcon className="w-4 h-4 text-slate-500" />
                    <span>التاريخ</span>
                  </label>
                  <input id="date" type="date" name="date" required value={formData.date} onChange={handleInputChange} onFocus={handleFocus} className={`${baseInputClasses} ${touched.date ? 'bg-white' : ''}`} dir="ltr" />
                </div>
              </div>
              <div>
                  <label htmlFor="location" className={`${labelClasses} flex items-center gap-2`}>
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>اسم المقر</span>
                  </label>
                  <input id="location" type="text" list="locations-list" name="location" value={formData.location} onChange={handleInputChange} onFocus={handleFocus} placeholder="اسم المقر" className={`${baseInputClasses} ${touched.location ? 'bg-white' : ''} ${formErrors.location ? 'border-red-500 focus:border-red-500' : ''}`} /><datalist id="locations-list">{allLocations.map(l => <option key={l} value={l} />)}</datalist>
                  {formErrors.location && <p className="text-red-600 text-xs mt-1">{formErrors.location}</p>}
              </div>
              <div>
                  <label htmlFor="name" className={`${labelClasses} flex items-center gap-2`}>
                    <User className="w-4 h-4 text-slate-500" />
                    <span>اسم المراجع</span>
                  </label>
                  <input id="name" type="text" name="name" required placeholder="اسم المراجع" value={formData.name} onChange={handleInputChange} onFocus={handleFocus} className={`${baseInputClasses} ${formData.name ? 'bg-white' : ''} ${formErrors.name ? 'border-red-500 focus:border-red-500' : ''}`} />
                  {formErrors.name && <p className="text-red-600 text-xs mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label htmlFor="phone" className={`${labelClasses} flex items-center gap-2`}>
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span>رقم الهاتف</span>
                </label>
                <input id="phone" type="tel" name="phone" placeholder="رقم الهاتف" value={formData.phone} onChange={handleInputChange} onFocus={handleFocus} className={`${baseInputClasses} ${formData.phone ? 'bg-white' : ''} text-right`} dir="ltr" />
              </div>
              <div>
                <label htmlFor="department" className={`${labelClasses} flex items-center gap-2`}>
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>الإدارة المتجه اليها</span>
                </label>
                <input id="department" type="text" name="department" placeholder="الإدارة المتجه اليها" value={formData.department} onChange={handleInputChange} onFocus={handleFocus} className={`${baseInputClasses} ${touched.department ? 'bg-white' : ''}`} />
              </div>
               <div>
                <label htmlFor="purpose" className={`${labelClasses} flex items-center gap-2`}>
                  <FileSpreadsheet className="w-4 h-4 text-slate-500" />
                  <span>الغرض من الزيارة</span>
                </label>
                <input id="purpose" type="text" name="purpose" placeholder="الغرض من الزيارة" value={formData.purpose} onChange={handleInputChange} onFocus={handleFocus} className={`${baseInputClasses} ${touched.purpose ? 'bg-white' : ''}`} />
              </div>
              {formData.type === 'visitor' && (
                <div>
                  <label htmlFor="receivedBy" className={`${labelClasses} flex items-center gap-2`}>
                    <User className="w-4 h-4 text-slate-500" />
                    <span>الموظف الذي قام باستقبال الزائر</span>
                  </label>
                  <input id="receivedBy" type="text" name="receivedBy" placeholder="اسم الموظف" value={formData.receivedBy || ''} onChange={handleInputChange} onFocus={handleFocus} className={`${baseInputClasses} ${touched.receivedBy ? 'bg-white' : ''}`} />
                </div>
              )}
              <div>
                <label htmlFor="timeIn" className={`${labelClasses} flex items-center gap-2`}>
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>توقيت الدخول</span>
                </label>
                <input id="timeIn" type="time" name="timeIn" value={formData.timeIn} onChange={handleInputChange} onFocus={handleFocus} className={`${baseInputClasses} ${touched.timeIn ? 'bg-white' : ''}`} dir="ltr" />
              </div>
              <div>
                <label htmlFor="timeOut" className={`${labelClasses} flex items-center gap-2`}>
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>توقيت الخروج</span>
                </label>
                <input id="timeOut" type="time" name="timeOut" value={formData.timeOut} onChange={handleInputChange} onFocus={handleFocus} className={`${baseInputClasses} ${touched.timeOut ? 'bg-white' : ''}`} dir="ltr" />
              </div>
              <div>
                 <label htmlFor="idType" className={`${labelClasses} flex items-center gap-2`}>
                   <CreditCard className="w-4 h-4 text-slate-500" />
                   <span>إثبات الهوية</span>
                  </label>
                <select id="idType" name="idType" value={formData.idType} onChange={handleInputChange} onFocus={handleFocus} className={`${baseInputClasses} ${touched.idType ? 'bg-white' : ''}`}><option>الهوية الوطنية</option><option>رخصة قيادة</option><option>جواز سفر</option><option>بطاقة عمل</option><option>أخرى</option></select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="notes" className={`${labelClasses} flex items-center gap-2`}>
                  <Pencil className="w-4 h-4 text-slate-500" />
                  <span>الملاحظات</span>
                </label>
                <textarea id="notes" name="notes" rows={3} placeholder="الملاحظات" value={formData.notes} onChange={handleInputChange} onFocus={handleFocus} className={`${baseInputClasses} ${touched.notes ? 'bg-white' : ''}`} />
              </div>
              <div className="md:col-span-2 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 mt-4">
                <button type="submit" className="w-full sm:max-w-md h-12 min-h-[48px] bg-[#334155] border-b-4 border-[#eab308] rounded-xl shadow-md flex items-center justify-center gap-3 text-white font-bold hover:bg-[#1e293b] active:scale-[0.99] transition-all duration-300 group">
                    <div className="p-1.5 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                        <Save className="w-5 h-5 text-[#eab308]" />
                    </div>
                    <span>{editingId ? 'تحديث البيانات' : 'حفظ البيانات'}</span>
                </button>
                {editingId && (
                  <button type="button" onClick={cancelEdit} className="w-full sm:w-32 h-12 min-h-[48px] bg-slate-200 border-b-4 border-slate-300 rounded-xl shadow-md flex items-center justify-center text-slate-700 font-bold hover:bg-slate-300 active:scale-[0.99] transition-all duration-300">
                    إلغاء
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
        
        {activeTab === 'list' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-200">
              <div className="bg-[#091526] border-b-4 border-[#eab308] rounded-xl h-12 mb-6 flex items-center justify-center gap-3 shadow-md w-full max-w-3xl mx-auto px-4 print:hidden">
                <div className="p-1.5 bg-white/10 rounded-lg">
                    <Database className="w-5 h-5 text-[#eab308]" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#eab308] text-center truncate">
                    قاعدة البيانات ({filteredRecords.length} سجل)
                </h2>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 gap-3 print:hidden">
                <div className="flex-1">
                     {importStatus.status !== 'idle' && (
                        <div className={`p-2.5 rounded-lg border text-xs sm:text-sm flex items-center gap-2 w-fit ${
                            importStatus.status === 'importing' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            importStatus.status === 'success' ? 'bg-green-100 text-green-800 border-green-200' :
                            'bg-red-100 text-red-800 border-red-200'
                        }`}>
                            {importStatus.status === 'importing' && <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>}
                            {importStatus.status === 'success' && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
                            {importStatus.status === 'error' && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                            <span>{importStatus.message}</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 sm:flex gap-2">
                    <button type="button" onClick={() => window.print()} className="min-h-[40px] px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm bg-[#334155] text-white flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-[#1e293b] active:bg-slate-800 transition-colors shadow-sm"><Printer className="w-4 h-4" /> <span>طباعة</span></button>
                    <button type="button" onClick={handleExportExcel} disabled={!xlsxLoaded || filteredRecords.length === 0} className="min-h-[40px] px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm bg-[#334155] text-white disabled:opacity-50 flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-[#1e293b] active:bg-slate-800 transition-colors shadow-sm"><Download className="w-4 h-4" /> <span>تصدير</span></button>
                </div>
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2.5 sm:gap-3 items-center print:hidden bg-white/70 p-3 sm:p-4 rounded-xl border border-slate-200">
                <div className="lg:col-span-2">
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="بحث بالاسم أو الهاتف..." className={`${filterInputClasses} w-full`} />
                </div>
                <div>
                  <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className={`${filterInputClasses} w-full`} aria-label="السنة">
                    <option value="">كل السنوات</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className={`${filterInputClasses} w-full`} aria-label="الشهر">
                    <option value="">كل الشهور</option>
                    {MONTHS.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
                  </select>
                </div>
                <div>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} title="من تاريخ" className={`${filterInputClasses} w-full text-xs sm:text-sm`} dir="ltr" />
                </div>
                <div>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} title="إلى تاريخ" className={`${filterInputClasses} w-full text-xs sm:text-sm`} dir="ltr" />
                </div>
                <div className="flex gap-2 lg:col-span-1">
                  <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className={`${filterInputClasses} flex-1 min-w-0`} aria-label="المقر">
                    <option value="">كل المقرات</option>
                    {allLocations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <button type="button" onClick={clearFilters} className={`${filterInputClasses} bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-1 px-3 flex-shrink-0`} title="مسح الفلاتر">
                    <FilterX className="w-4 h-4 text-slate-500" />
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

        {activeTab === 'dashboard' && (
            <DashboardView records={records} />
        )}
      </main>

      <footer className="bg-[#091526] text-slate-400 py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] mt-auto border-t-4 border-[#eab308] print:hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
            
            <div>
              <h3 className="inline-block text-base font-semibold text-slate-300 tracking-wider uppercase pb-1 border-b-2 border-yellow-400">عن SAHER</h3>
              <p className="text-sm leading-relaxed mt-3">
                شركة رائدة في تقديم الحلول والأنظمة الذكية، ملتزمون بالابتكار والجودة لتحقيق أعلى مستويات الكفاءة والخدمات الذكية.
              </p>
            </div>

            <div>
              <h3 className="inline-block text-base font-semibold text-slate-300 tracking-wider uppercase pb-1 border-b-2 border-yellow-400">روابط سريعة</h3>
              <ul className="space-y-1.5 text-sm mt-3">
                <li><a href="#" className="hover:text-white transition-colors py-1 inline-block">الرئيسية</a></li>
                <li><a href="#" className="hover:text-white transition-colors py-1 inline-block">خدماتنا</a></li>
                <li><a href="#" className="hover:text-white transition-colors py-1 inline-block">تواصل معنا</a></li>
              </ul>
            </div>

            <div>
              <h3 className="inline-block text-base font-semibold text-slate-300 tracking-wider uppercase pb-1 border-b-2 border-yellow-400">تواصل معنا</h3>
              <ul className="space-y-2.5 text-sm mt-3">
                <li className="flex items-start justify-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-500 mt-1 flex-shrink-0" />
                  <p className="text-sm" dir="ltr">Level 3, Baynona Building, Khalif City A</p>
                </li>
                <li className="flex items-center justify-start gap-3">
                  <Phone className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  <a href="tel:+97141234567" className="hover:text-white transition-colors py-0.5" dir="ltr">+971 4 123 4567</a>
                </li>
                <li className="flex items-center justify-start gap-3">
                  <Mail className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  <a href="mailto:Logistic@saher.ae" className="hover:text-white transition-colors py-0.5">Logistic@saher.ae</a>
                </li>
              </ul>
            </div>

          </div>
          
          <div className="border-t border-slate-700 mt-6 pt-4 text-center">
            <p className="text-sm mb-2 text-white">اعداد وتصميم / خالد الجفري</p>
            <p className="text-xs text-slate-400">جميع الحقوق محفوظة لـ © 2026 SAHER FOR SMART SERVICES</p>
          </div>
        </div>
      </footer>


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