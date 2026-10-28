import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Users,
  MapPin,
  Building2,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Table as TableIcon,
  Calendar,
  Download,
  FileText,
  Printer,
  GitCompare,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Loader2
} from 'lucide-react';
import { Record } from '../types.ts';
import { YEARS, CURRENT_YEAR, MONTHS, PREDEFINED_LOCATIONS } from '../constants.ts';

interface MonthlyLocationReportSectionProps {
  records: Record[];
  externalYear?: number;
}

const UNSPECIFIED_LOCATION_LABEL = 'غير محدد (بدون مقر مسجل)';

const loadHtml2Pdf = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if ((window as any).html2pdf) {
      resolve((window as any).html2pdf);
      return;
    }
    const existing = document.querySelector('script[data-html2pdf="true"]');
    if (existing) {
      existing.addEventListener('load', () => resolve((window as any).html2pdf));
      existing.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.setAttribute('data-html2pdf', 'true');
    script.onload = () => resolve((window as any).html2pdf);
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

export const parseRecordYearAndMonth = (rec: Record): { year: number; month: string } | null => {
  if (!rec.date || typeof rec.date !== 'string') return null;
  const trimmed = rec.date.trim();
  const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = String(Number(isoMatch[2])).padStart(2, '0');
    return { year, month };
  }
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    return {
      year: parsed.getFullYear(),
      month: String(parsed.getMonth() + 1).padStart(2, '0')
    };
  }
  if (rec.year) {
    return { year: Number(rec.year), month: '01' };
  }
  return null;
};

const MonthlyLocationReportSection: React.FC<MonthlyLocationReportSectionProps> = ({
  records,
  externalYear
}) => {
  const [matrixYear, setMatrixYear] = useState<number>(externalYear || CURRENT_YEAR);
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'all' | 'visitor' | 'supplier' | 'employee'>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    return String(new Date().getMonth() + 1).padStart(2, '0');
  });

  // Comparison state
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [compareYear, setCompareYear] = useState<number>(CURRENT_YEAR);
  const [compareMonth, setCompareMonth] = useState<string>(() => {
    const prevM = new Date().getMonth();
    return prevM >= 1 ? String(prevM).padStart(2, '0') : '05';
  });

  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [reportTimestamp, setReportTimestamp] = useState<string>(() =>
    new Date().toLocaleString('ar-AE', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  );

  // Sync with parent dashboard year filter when changed
  useEffect(() => {
    if (externalYear && externalYear !== matrixYear) {
      setMatrixYear(externalYear);
    }
  }, [externalYear]);

  // Dedicated ref for the full-width A4 Landscape PDF capture template
  const pdfTemplateRef = useRef<HTMLDivElement>(null);

  // Deduplicate records by ID so every registered visit is counted strictly once
  const uniqueRecords = useMemo(() => {
    const seen = new Set<string>();
    const list: Record[] = [];
    for (const r of records) {
      const key = r.id || `${r.name}_${r.date}_${r.timeIn}_${r.location}`;
      if (!seen.has(key)) {
        seen.add(key);
        list.push(r);
      }
    }
    return list;
  }, [records]);

  const availableYears = useMemo(() => {
    const yearSet = new Set<number>(YEARS);
    uniqueRecords.forEach(r => {
      const ym = parseRecordYearAndMonth(r);
      if (ym && !isNaN(ym.year)) yearSet.add(ym.year);
      if (r.year && !isNaN(Number(r.year))) yearSet.add(Number(r.year));
    });
    return Array.from(yearSet).sort((a, b) => a - b);
  }, [uniqueRecords]);

  const matrixStats = useMemo(() => {
    const categoryRecords =
      selectedCategoryFilter === 'all'
        ? uniqueRecords
        : uniqueRecords.filter(r => r.type === selectedCategoryFilter);

    const customLocs = new Set<string>();
    let hasUnspecifiedInSystem = false;

    categoryRecords.forEach(r => {
      const loc = r.location ? r.location.trim() : '';
      if (!loc) {
        hasUnspecifiedInSystem = true;
      } else if (!PREDEFINED_LOCATIONS.includes(loc)) {
        customLocs.add(loc);
      }
    });

    const allKnownLocations = [...PREDEFINED_LOCATIONS, ...Array.from(customLocs).sort()];

    const yearRecords = categoryRecords.filter(r => {
      const ym = parseRecordYearAndMonth(r);
      return ym ? ym.year === Number(matrixYear) : Number(r.year) === Number(matrixYear);
    });

    const hasUnspecifiedInYear = yearRecords.some(r => !r.location || !r.location.trim());
    const locationsList =
      hasUnspecifiedInYear || hasUnspecifiedInSystem
        ? [...allKnownLocations, UNSPECIFIED_LOCATION_LABEL]
        : allKnownLocations;

    const rowsMap: {
      [loc: string]: {
        location: string;
        isUnspecified: boolean;
        months: { [monthVal: string]: number };
        annualTotal: number;
      };
    } = {};

    locationsList.forEach(loc => {
      const monthsInit: { [m: string]: number } = {};
      MONTHS.forEach(m => {
        monthsInit[m.value] = 0;
      });
      rowsMap[loc] = {
        location: loc,
        isUnspecified: loc === UNSPECIFIED_LOCATION_LABEL,
        months: monthsInit,
        annualTotal: 0
      };
    });

    yearRecords.forEach(rec => {
      const ym = parseRecordYearAndMonth(rec);
      if (!ym) return;
      const cleanLoc =
        rec.location && rec.location.trim() ? rec.location.trim() : UNSPECIFIED_LOCATION_LABEL;
      if (!rowsMap[cleanLoc]) {
        const monthsInit: { [m: string]: number } = {};
        MONTHS.forEach(m => {
          monthsInit[m.value] = 0;
        });
        rowsMap[cleanLoc] = {
          location: cleanLoc,
          isUnspecified: cleanLoc === UNSPECIFIED_LOCATION_LABEL,
          months: monthsInit,
          annualTotal: 0
        };
      }
      if (rowsMap[cleanLoc].months[ym.month] !== undefined) {
        rowsMap[cleanLoc].months[ym.month] += 1;
        rowsMap[cleanLoc].annualTotal += 1;
      }
    });

    const allRows = Object.values(rowsMap).filter(
      row => !row.isUnspecified || row.annualTotal > 0
    );

    const displayedRows =
      selectedLocationFilter === 'ALL'
        ? allRows
        : allRows.filter(r => r.location === selectedLocationFilter);

    const displayedMonthTotals: { [m: string]: number } = {};
    const companyMonthTotals: { [m: string]: number } = {};
    MONTHS.forEach(m => {
      displayedMonthTotals[m.value] = displayedRows.reduce((sum, r) => sum + r.months[m.value], 0);
      companyMonthTotals[m.value] = allRows.reduce((sum, r) => sum + r.months[m.value], 0);
    });

    const displayedAnnualGrandTotal = displayedRows.reduce((sum, r) => sum + r.annualTotal, 0);
    const companyAnnualGrandTotal = allRows.reduce((sum, r) => sum + r.annualTotal, 0);

    const selectedMonthTotalCompany = companyMonthTotals[selectedMonth] || 0;
    const selectedMonthTotalDisplayed = displayedMonthTotals[selectedMonth] || 0;

    const selectedMonthBreakdown = displayedRows
      .map(row => {
        const count = row.months[selectedMonth] || 0;
        const percentage =
          selectedMonthTotalCompany > 0 ? (count / selectedMonthTotalCompany) * 100 : 0;
        const annualPercentage =
          companyAnnualGrandTotal > 0 ? (row.annualTotal / companyAnnualGrandTotal) * 100 : 0;
        return {
          location: row.location,
          isUnspecified: row.isUnspecified,
          count,
          percentage,
          annualTotal: row.annualTotal,
          annualPercentage
        };
      })
      .sort((a, b) => b.count - a.count);

    // Comparison calculation
    const compareYearRecords = categoryRecords.filter(r => {
      const ym = parseRecordYearAndMonth(r);
      return ym ? ym.year === Number(compareYear) : Number(r.year) === Number(compareYear);
    });

    const compareCountsByLocation: { [loc: string]: number } = {};
    locationsList.forEach(loc => {
      compareCountsByLocation[loc] = 0;
    });

    compareYearRecords.forEach(rec => {
      const ym = parseRecordYearAndMonth(rec);
      if (!ym || ym.month !== compareMonth) return;
      const cleanLoc =
        rec.location && rec.location.trim() ? rec.location.trim() : UNSPECIFIED_LOCATION_LABEL;
      compareCountsByLocation[cleanLoc] = (compareCountsByLocation[cleanLoc] || 0) + 1;
    });

    const comparisonRows = displayedRows.map(row => {
      const currentCount = row.months[selectedMonth] || 0;
      const previousCount = compareCountsByLocation[row.location] || 0;
      const diff = currentCount - previousCount;
      const growthPercent =
        previousCount > 0
          ? ((currentCount - previousCount) / previousCount) * 100
          : currentCount > 0
          ? 100
          : 0;
      return {
        location: row.location,
        isUnspecified: row.isUnspecified,
        currentCount,
        previousCount,
        diff,
        growthPercent
      };
    });

    const compareTotalDisplayed = comparisonRows.reduce((sum, r) => sum + r.previousCount, 0);
    const totalDiff = selectedMonthTotalDisplayed - compareTotalDisplayed;

    return {
      allKnownLocations: allRows.map(r => r.location),
      allRows,
      displayedRows,
      displayedMonthTotals,
      companyMonthTotals,
      displayedAnnualGrandTotal,
      companyAnnualGrandTotal,
      selectedMonthTotalCompany,
      selectedMonthTotalDisplayed,
      selectedMonthBreakdown,
      comparisonRows,
      compareTotalDisplayed,
      totalDiff
    };
  }, [
    uniqueRecords,
    matrixYear,
    selectedLocationFilter,
    selectedCategoryFilter,
    selectedMonth,
    compareYear,
    compareMonth
  ]);

  const selectedMonthName = MONTHS.find(m => m.value === selectedMonth)?.name || '';
  const compareMonthName = MONTHS.find(m => m.value === compareMonth)?.name || '';

  const categoryLabelMap: { [key: string]: string } = {
    all: 'جميع السجلات (الزوار والموردين والموظفين)',
    visitor: 'سجل الزوار فقط',
    supplier: 'سجل الموردين فقط',
    employee: 'سجل الموظفين فقط'
  };

  // 1. Export to Excel
  const handleExportMatrixExcel = () => {
    if (!window.XLSX) return;
    const wb = window.XLSX.utils.book_new();
    const fileName = `الإحصائية_الشهرية_للزوار_حسب_المقر_${matrixYear}.xlsx`;

    const matrixHeaders = [
      'اسم المقر',
      ...MONTHS.map(m => m.name),
      'الإجمالي السنوي',
      'النسبة من الإجمالي السنوي (%)'
    ];

    const matrixDataRows = matrixStats.displayedRows.map(row => {
      const annualPct =
        matrixStats.companyAnnualGrandTotal > 0
          ? `${((row.annualTotal / matrixStats.companyAnnualGrandTotal) * 100).toFixed(1)}%`
          : '0.0%';
      return [
        row.location,
        ...MONTHS.map(m => row.months[m.value]),
        row.annualTotal,
        annualPct
      ];
    });

    const matrixTotalRow = [
      selectedLocationFilter === 'ALL' ? 'إجمالي جميع المقرات' : 'إجمالي المقر المحدد',
      ...MONTHS.map(m => matrixStats.displayedMonthTotals[m.value]),
      matrixStats.displayedAnnualGrandTotal,
      selectedLocationFilter === 'ALL'
        ? '100.0%'
        : matrixStats.companyAnnualGrandTotal > 0
        ? `${((matrixStats.displayedAnnualGrandTotal / matrixStats.companyAnnualGrandTotal) * 100).toFixed(1)}%`
        : '0.0%'
    ];

    const wsMatrix = window.XLSX.utils.aoa_to_sheet([
      [`الإحصائية الشهرية لعدد الزوار حسب المقر - سنة ${matrixYear}`],
      [`الفئة: ${categoryLabelMap[selectedCategoryFilter]} | النطاق: ${selectedLocationFilter === 'ALL' ? 'جميع المقرات' : selectedLocationFilter}`],
      [],
      matrixHeaders,
      ...matrixDataRows,
      matrixTotalRow
    ]);
    wsMatrix['!cols'] = [{ wch: 34 }, ...MONTHS.map(() => ({ wch: 11 })), { wch: 16 }, { wch: 24 }];
    wsMatrix['!views'] = [{ rightToLeft: true }];
    window.XLSX.utils.book_append_sheet(wb, wsMatrix, `إحصائية_${matrixYear}`);

    const monthHeaders = [
      'اسم المقر',
      `عدد الزوار (${selectedMonthName} ${matrixYear})`,
      'النسبة من إجمالي زوار الشركة خلال الشهر (%)',
      `الإجمالي السنوي (${matrixYear})`,
      'النسبة السنوية (%)'
    ];
    const monthRows = matrixStats.selectedMonthBreakdown.map(item => [
      item.location,
      item.count,
      `${item.percentage.toFixed(1)}%`,
      item.annualTotal,
      `${item.annualPercentage.toFixed(1)}%`
    ]);
    monthRows.push([
      'الإجمالي',
      matrixStats.selectedMonthTotalDisplayed,
      selectedLocationFilter === 'ALL'
        ? '100.0%'
        : `${(matrixStats.selectedMonthTotalCompany > 0
            ? (matrixStats.selectedMonthTotalDisplayed / matrixStats.selectedMonthTotalCompany) * 100
            : 0
          ).toFixed(1)}%`,
      matrixStats.displayedAnnualGrandTotal,
      selectedLocationFilter === 'ALL'
        ? '100.0%'
        : `${(matrixStats.companyAnnualGrandTotal > 0
            ? (matrixStats.displayedAnnualGrandTotal / matrixStats.companyAnnualGrandTotal) * 100
            : 0
          ).toFixed(1)}%`
    ]);

    const wsMonth = window.XLSX.utils.aoa_to_sheet([
      [`تفصيل زوار شهر ${selectedMonthName} ${matrixYear} حسب المقر`],
      [],
      monthHeaders,
      ...monthRows
    ]);
    wsMonth['!cols'] = [{ wch: 36 }, { wch: 22 }, { wch: 32 }, { wch: 22 }, { wch: 20 }];
    wsMonth['!views'] = [{ rightToLeft: true }];
    window.XLSX.utils.book_append_sheet(wb, wsMonth, `ملخص_${selectedMonthName}`);

    window.XLSX.writeFile(wb, fileName);
  };

  // 2. Official Print Handler (Isolates the Monthly Matrix Report in A4 Landscape)
  const handlePrintMatrix = () => {
    setReportTimestamp(
      new Date().toLocaleString('ar-AE', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    );
    document.body.setAttribute('data-print-mode', 'monthly-matrix');

    const cleanup = () => {
      document.body.removeAttribute('data-print-mode');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);

    setTimeout(() => {
      window.print();
      setTimeout(cleanup, 1500);
    }, 80);
  };

  // 3. High-Precision Official PDF Export Handler (with multi-page numbering & zero clipping)
  const handleExportMatrixPdf = async () => {
    if (!pdfTemplateRef.current) return;
    const nowFormatted = new Date().toLocaleString('ar-AE', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    setReportTimestamp(nowFormatted);
    setIsExportingPdf(true);

    try {
      const html2pdf = await loadHtml2Pdf();
      const element = pdfTemplateRef.current;

      const opt = {
        margin: [8, 8, 12, 8], // top, left, bottom (extra space for page numbers), right in mm
        filename: `الإحصائية_الشهرية_للزوار_حسب_المقر_${matrixYear}_${selectedMonthName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 1120
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
        pagebreak: { mode: ['css', 'legacy'], avoid: ['tr', '.pdf-avoid-break'] }
      };

      const worker = html2pdf().set(opt).from(element).toPdf();
      const pdf = await worker.get('pdf');
      const totalPages = pdf.internal.getNumberOfPages();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setDrawColor(203, 213, 225);
        pdf.setLineWidth(0.3);
        pdf.line(8, pageHeight - 8, pageWidth - 8, pageHeight - 8);
        pdf.setFontSize(8);
        pdf.setTextColor(71, 85, 105);
        pdf.text(
          `SAHER For Smart Services | Visitors & Suppliers Registration System (${matrixYear})`,
          8,
          pageHeight - 4
        );
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 8, pageHeight - 4, {
          align: 'right'
        });
      }

      await worker.save();
    } catch {
      handlePrintMatrix();
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Shared Official Report Sheet JSX (used for both High-Res PDF generation & @media print)
  const renderOfficialReportDocument = (isPdfCapture: boolean) => (
    <div
      dir="rtl"
      style={{
        width: isPdfCapture ? '1060px' : '100%',
        backgroundColor: '#ffffff',
        color: '#0f172a',
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        padding: isPdfCapture ? '16px 20px' : '0px',
        boxSizing: 'border-box'
      }}
    >
      {/* Official Institutional Header */}
      <div
        className="pdf-avoid-break"
        style={{
          backgroundColor: '#091526',
          color: '#ffffff',
          borderBottom: '4px solid #eab308',
          borderRadius: '12px',
          padding: '14px 20px',
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Right: Company & System Title */}
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: '11px',
              color: '#eab308',
              fontWeight: 700,
              marginBottom: '2px'
            }}
          >
            شركة ساهر للخدمات الذكية — إدارة الخدمات العامة / قسم إدارة المرافق
          </div>
          <h1
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#ffffff',
              margin: 0
            }}
          >
            الإحصائية الشهرية لعدد الزوار حسب المقر
          </h1>
          <div
            style={{
              fontSize: '11px',
              color: '#cbd5e1',
              marginTop: '3px'
            }}
          >
            نظام تسجيل الزوار والموردين — Visitors &amp; Suppliers Registration System
          </div>
        </div>

        {/* Center: Active Filter Badges */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: '10px',
            padding: '8px 14px'
          }}
        >
          <div style={{ textAlign: 'center', padding: '0 8px', borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ fontSize: '10px', color: '#cbd5e1' }}>السنة المحددة</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#eab308' }}>{matrixYear}</div>
          </div>
          <div style={{ textAlign: 'center', padding: '0 8px', borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ fontSize: '10px', color: '#cbd5e1' }}>الشهر المحدد</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>{selectedMonthName}</div>
          </div>
          <div style={{ textAlign: 'center', padding: '0 8px', borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ fontSize: '10px', color: '#cbd5e1' }}>نطاق المقرات</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>
              {selectedLocationFilter === 'ALL' ? 'جميع المقرات' : selectedLocationFilter}
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '0 6px' }}>
            <div style={{ fontSize: '10px', color: '#cbd5e1' }}>الإجمالي السنوي</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#eab308' }}>
              {matrixStats.displayedAnnualGrandTotal}
            </div>
          </div>
        </div>

        {/* Left: SAHER Brand Lockup & Preparation Timestamp */}
        <div style={{ textAlign: 'left' }} dir="ltr">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
                SAHER
              </div>
              <div style={{ fontSize: '8px', color: '#eab308', letterSpacing: '1px', textTransform: 'uppercase' }}>
                For Smart Services
              </div>
            </div>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: '#1e3a8a',
                border: '2px solid #eab308',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '16px',
                color: '#ffffff'
              }}
            >
              S
            </div>
          </div>
          <div style={{ fontSize: '9.5px', color: '#cbd5e1', marginTop: '5px' }} dir="rtl">
            تاريخ الإعداد: {reportTimestamp}
          </div>
        </div>
      </div>

      {/* Table 1: Full 12-Month Location Matrix Table */}
      <div style={{ marginBottom: '16px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
            padding: '0 2px'
          }}
        >
          <h2 style={{ fontSize: '13px', fontWeight: 800, color: '#091526', margin: 0 }}>
            أولاً: جدول توزيع أعداد الزوار حسب المقر وأشهر السنة ({matrixYear})
          </h2>
          <span style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>
            الفئة: {categoryLabelMap[selectedCategoryFilter]}
          </span>
        </div>

        <table
          style={{
            width: '100%',
            tableLayout: 'fixed',
            borderCollapse: 'collapse',
            fontSize: '10.5px',
            border: '1px solid #94a3b8'
          }}
        >
          <colgroup>
            <col style={{ width: '21%' }} />
            {MONTHS.map(m => (
              <col key={m.value} style={{ width: '5.1%' }} />
            ))}
            <col style={{ width: '8.8%' }} />
            <col style={{ width: '9%' }} />
          </colgroup>
          <thead>
            <tr style={{ backgroundColor: '#091526', color: '#ffffff' }}>
              <th
                style={{
                  padding: '7px 8px',
                  textAlign: 'right',
                  fontWeight: 800,
                  border: '1px solid #334155',
                  borderBottom: '2px solid #eab308'
                }}
              >
                اسم المقر
              </th>
              {MONTHS.map(m => {
                const isSelected = m.value === selectedMonth;
                return (
                  <th
                    key={m.value}
                    style={{
                      padding: '7px 2px',
                      textAlign: 'center',
                      fontWeight: 800,
                      border: '1px solid #334155',
                      borderBottom: '2px solid #eab308',
                      backgroundColor: isSelected ? '#eab308' : '#091526',
                      color: isSelected ? '#091526' : '#ffffff'
                    }}
                  >
                    {m.name}
                  </th>
                );
              })}
              <th
                style={{
                  padding: '7px 4px',
                  textAlign: 'center',
                  fontWeight: 800,
                  backgroundColor: '#1e293b',
                  color: '#eab308',
                  border: '1px solid #334155',
                  borderBottom: '2px solid #eab308'
                }}
              >
                الإجمالي السنوي
              </th>
              <th
                style={{
                  padding: '7px 4px',
                  textAlign: 'center',
                  fontWeight: 800,
                  backgroundColor: '#1e293b',
                  color: '#ffffff',
                  border: '1px solid #334155',
                  borderBottom: '2px solid #eab308'
                }}
              >
                النسبة السنوية
              </th>
            </tr>
          </thead>
          <tbody>
            {matrixStats.displayedRows.map((row, idx) => {
              const annualPct =
                matrixStats.companyAnnualGrandTotal > 0
                  ? ((row.annualTotal / matrixStats.companyAnnualGrandTotal) * 100).toFixed(1)
                  : '0.0';
              return (
                <tr
                  key={row.location}
                  style={{
                    backgroundColor: row.isUnspecified
                      ? '#fffbeb'
                      : idx % 2 === 0
                      ? '#ffffff'
                      : '#f8fafc',
                    pageBreakInside: 'avoid',
                    breakInside: 'avoid'
                  }}
                >
                  <td
                    style={{
                      padding: '6px 8px',
                      fontWeight: 700,
                      color: '#091526',
                      border: '1px solid #cbd5e1',
                      wordWrap: 'break-word'
                    }}
                  >
                    {row.location}
                  </td>
                  {MONTHS.map(m => {
                    const val = row.months[m.value] || 0;
                    const isSelected = m.value === selectedMonth;
                    return (
                      <td
                        key={m.value}
                        style={{
                          padding: '6px 2px',
                          textAlign: 'center',
                          fontWeight: isSelected || val > 0 ? 700 : 400,
                          color: isSelected ? '#091526' : val > 0 ? '#0f172a' : '#64748b',
                          backgroundColor: isSelected ? '#fef9c3' : 'transparent',
                          border: '1px solid #cbd5e1'
                        }}
                      >
                        {val}
                      </td>
                    );
                  })}
                  <td
                    style={{
                      padding: '6px 4px',
                      textAlign: 'center',
                      fontWeight: 800,
                      color: '#091526',
                      backgroundColor: '#f1f5f9',
                      border: '1px solid #cbd5e1'
                    }}
                  >
                    {row.annualTotal}
                  </td>
                  <td
                    style={{
                      padding: '6px 4px',
                      textAlign: 'center',
                      fontWeight: 700,
                      color: '#1e3a8a',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #cbd5e1'
                    }}
                    dir="ltr"
                  >
                    {annualPct}%
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr
              style={{
                backgroundColor: '#1e293b',
                color: '#ffffff',
                fontWeight: 800,
                borderTop: '2px solid #eab308'
              }}
            >
              <td style={{ padding: '7px 8px', border: '1px solid #475569' }}>
                {selectedLocationFilter === 'ALL' ? 'إجمالي جميع المقرات' : 'إجمالي المقر المحدد'}
              </td>
              {MONTHS.map(m => {
                const totalVal = matrixStats.displayedMonthTotals[m.value] || 0;
                const isSelected = m.value === selectedMonth;
                return (
                  <td
                    key={m.value}
                    style={{
                      padding: '7px 2px',
                      textAlign: 'center',
                      border: '1px solid #475569',
                      backgroundColor: isSelected ? '#eab308' : '#1e293b',
                      color: isSelected ? '#091526' : '#ffffff',
                      fontWeight: 800
                    }}
                  >
                    {totalVal}
                  </td>
                );
              })}
              <td
                style={{
                  padding: '7px 4px',
                  textAlign: 'center',
                  backgroundColor: '#091526',
                  color: '#eab308',
                  border: '1px solid #475569',
                  fontSize: '11.5px'
                }}
              >
                {matrixStats.displayedAnnualGrandTotal}
              </td>
              <td
                style={{
                  padding: '7px 4px',
                  textAlign: 'center',
                  backgroundColor: '#091526',
                  color: '#ffffff',
                  border: '1px solid #475569'
                }}
                dir="ltr"
              >
                {selectedLocationFilter === 'ALL'
                  ? '100.0%'
                  : matrixStats.companyAnnualGrandTotal > 0
                  ? `${((matrixStats.displayedAnnualGrandTotal / matrixStats.companyAnnualGrandTotal) * 100).toFixed(1)}%`
                  : '0.0%'}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Table 2: Selected Month Summary & Percentage Breakdown */}
      <div className="pdf-avoid-break" style={{ marginBottom: '12px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
            padding: '0 2px'
          }}
        >
          <h2 style={{ fontSize: '13px', fontWeight: 800, color: '#091526', margin: 0 }}>
            ثانياً: البطاقة الإجمالية وتفصيل الزوار والنسب المئوية لشهر ({selectedMonthName} {matrixYear})
          </h2>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#091526',
              backgroundColor: '#fef9c3',
              border: '1px solid #eab308',
              borderRadius: '6px',
              padding: '2px 10px'
            }}
          >
            إجمالي زوار شهر {selectedMonthName}: {matrixStats.selectedMonthTotalDisplayed} زائر
          </span>
        </div>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '10.5px',
            border: '1px solid #94a3b8'
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#334155', color: '#ffffff' }}>
              <th style={{ padding: '6px 10px', textAlign: 'center', width: '6%', border: '1px solid #475569' }}>
                م
              </th>
              <th style={{ padding: '6px 10px', textAlign: 'right', width: '36%', border: '1px solid #475569' }}>
                اسم المقر
              </th>
              <th style={{ padding: '6px 10px', textAlign: 'center', width: '18%', border: '1px solid #475569' }}>
                عدد الزوار في {selectedMonthName} {matrixYear}
              </th>
              <th style={{ padding: '6px 10px', textAlign: 'center', width: '22%', border: '1px solid #475569' }}>
                النسبة من إجمالي زوار الشركة خلال الشهر
              </th>
              <th style={{ padding: '6px 10px', textAlign: 'center', width: '18%', border: '1px solid #475569' }}>
                الإجمالي السنوي للمقر ({matrixYear})
              </th>
            </tr>
          </thead>
          <tbody>
            {matrixStats.selectedMonthBreakdown.map((item, index) => (
              <tr
                key={item.location}
                style={{
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                  pageBreakInside: 'avoid',
                  breakInside: 'avoid'
                }}
              >
                <td style={{ padding: '6px 8px', textAlign: 'center', fontWeight: 700, border: '1px solid #cbd5e1' }}>
                  {index + 1}
                </td>
                <td style={{ padding: '6px 10px', fontWeight: 700, color: '#091526', border: '1px solid #cbd5e1' }}>
                  {item.location}
                </td>
                <td style={{ padding: '6px 10px', textAlign: 'center', fontWeight: 800, color: '#091526', border: '1px solid #cbd5e1' }}>
                  {item.count}
                </td>
                <td style={{ padding: '6px 10px', textAlign: 'center', fontWeight: 700, color: '#0369a1', border: '1px solid #cbd5e1' }} dir="ltr">
                  {item.percentage.toFixed(1)}%
                </td>
                <td style={{ padding: '6px 10px', textAlign: 'center', fontWeight: 700, color: '#334155', border: '1px solid #cbd5e1' }}>
                  {item.annualTotal} ({item.annualPercentage.toFixed(1)}%)
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: '#091526', color: '#ffffff', fontWeight: 800 }}>
              <td colSpan={2} style={{ padding: '6px 10px', border: '1px solid #334155' }}>
                الإجمالي لشهر {selectedMonthName} {matrixYear}
              </td>
              <td style={{ padding: '6px 10px', textAlign: 'center', color: '#eab308', border: '1px solid #334155' }}>
                {matrixStats.selectedMonthTotalDisplayed} زائر
              </td>
              <td style={{ padding: '6px 10px', textAlign: 'center', color: '#eab308', border: '1px solid #334155' }} dir="ltr">
                {selectedLocationFilter === 'ALL'
                  ? '100.0%'
                  : matrixStats.selectedMonthTotalCompany > 0
                  ? `${((matrixStats.selectedMonthTotalDisplayed / matrixStats.selectedMonthTotalCompany) * 100).toFixed(1)}%`
                  : '0.0%'}
              </td>
              <td style={{ padding: '6px 10px', textAlign: 'center', border: '1px solid #334155' }}>
                {matrixStats.displayedAnnualGrandTotal} زائر
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Official Document Sign-off Footer (Visible in Print) */}
      {!isPdfCapture && (
        <div
          style={{
            marginTop: '10px',
            paddingTop: '8px',
            borderTop: '1px solid #cbd5e1',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '10px',
            color: '#475569'
          }}
        >
          <span>شركة ساهر للخدمات الذكية — إدارة الخدمات العامة / قسم إدارة المرافق</span>
          <span>تقرير رسمي مستخرج من نظام تسجيل الزوار والموردين — {reportTimestamp}</span>
        </div>
      )}
    </div>
  );

  return (
    <section
      aria-label="الإحصائية الشهرية لعدد الزوار حسب المقر"
      className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-slate-200 overflow-hidden transition-all"
    >
      {/* 1. Interactive Screen View (Hidden during Print so Print uses the Official A4 Landscape Sheet) */}
      <div className="print:hidden">
        {/* Section Institutional Banner */}
        <div className="bg-[#091526] border-b-4 border-[#eab308] px-4 sm:px-8 py-5 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-white/10 rounded-xl text-[#eab308] border border-white/10 shadow-inner shrink-0">
                <TableIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-tight">
                  الإحصائية الشهرية لعدد الزوار حسب المقر
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  تقرير تحليلي مباشر ومحدث تلقائيًا لإجمالي الزوار موزعين على مقرات الشركة وأشهر السنة ({matrixYear})
                </p>
              </div>
            </div>

            {/* Export & Print Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExportMatrixExcel}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                title="تصدير الإحصائية الشهرية إلى ملف Excel"
              >
                <Download className="w-4 h-4" />
                <span>تصدير Excel</span>
              </button>

              <button
                type="button"
                onClick={handleExportMatrixPdf}
                disabled={isExportingPdf}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-[#eab308] hover:bg-yellow-400 text-[#091526] text-xs sm:text-sm font-extrabold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-60"
                title="تصدير الإحصائية الشهرية إلى ملف PDF رسمي بجودة عالية"
              >
                {isExportingPdf ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#091526]" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                <span>{isExportingPdf ? 'جاري إعداد PDF...' : 'تصدير PDF'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrintMatrix}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 border border-slate-500/40 shadow-sm transition-colors cursor-pointer"
                title="طباعة التقرير الرسمي بتنسيق A4 أفقي"
              >
                <Printer className="w-4 h-4 text-[#eab308]" />
                <span>طباعة</span>
              </button>
            </div>
          </div>

          {/* Interactive Filters Bar inside Section Header */}
          <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Year Filter */}
            <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
              <label htmlFor="matrix-year-select" className="text-xs text-slate-300 font-bold flex items-center gap-1.5 whitespace-nowrap">
                <Calendar className="w-4 h-4 text-[#eab308]" />
                <span>السنة:</span>
              </label>
              <select
                id="matrix-year-select"
                value={matrixYear}
                onChange={(e) => setMatrixYear(Number(e.target.value))}
                className="bg-slate-800 text-white text-xs sm:text-sm font-bold px-2.5 py-1.5 rounded-lg border border-slate-600 focus:outline-none focus:border-[#eab308] cursor-pointer"
              >
                {availableYears.map(y => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Location Filter */}
            <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
              <label htmlFor="matrix-location-select" className="text-xs text-slate-300 font-bold flex items-center gap-1.5 whitespace-nowrap">
                <MapPin className="w-4 h-4 text-[#eab308]" />
                <span>المقر:</span>
              </label>
              <select
                id="matrix-location-select"
                value={selectedLocationFilter}
                onChange={(e) => setSelectedLocationFilter(e.target.value)}
                className="bg-slate-800 text-white text-xs sm:text-sm font-bold px-2.5 py-1.5 rounded-lg border border-slate-600 focus:outline-none focus:border-[#eab308] cursor-pointer flex-1 min-w-0 truncate"
              >
                <option value="ALL">جميع المقرات ({matrixStats.allKnownLocations.length})</option>
                {matrixStats.allKnownLocations.map(loc => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Month Selector */}
            <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
              <label htmlFor="matrix-month-select" className="text-xs text-slate-300 font-bold flex items-center gap-1.5 whitespace-nowrap">
                <Filter className="w-4 h-4 text-[#eab308]" />
                <span>الشهر المحدد:</span>
              </label>
              <select
                id="matrix-month-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-slate-800 text-white text-xs sm:text-sm font-bold px-2.5 py-1.5 rounded-lg border border-slate-600 focus:outline-none focus:border-[#eab308] cursor-pointer"
              >
                {MONTHS.map(m => (
                  <option key={m.value} value={m.value}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Category Filter */}
            <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
              <label htmlFor="matrix-cat-select" className="text-xs text-slate-300 font-bold flex items-center gap-1.5 whitespace-nowrap">
                <Layers className="w-4 h-4 text-[#eab308]" />
                <span>الفئة:</span>
              </label>
              <select
                id="matrix-cat-select"
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value as any)}
                className="bg-slate-800 text-white text-xs sm:text-sm font-bold px-2.5 py-1.5 rounded-lg border border-slate-600 focus:outline-none focus:border-[#eab308] cursor-pointer flex-1 min-w-0"
              >
                <option value="all">جميع السجلات</option>
                <option value="visitor">سجل الزوار فقط</option>
                <option value="supplier">سجل الموردين فقط</option>
                <option value="employee">سجل الموظفين فقط</option>
              </select>
            </div>
          </div>
        </div>

        {/* Body Content of Section */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
          {/* 1. Professional Monthly Matrix Table */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>انقر على اسم أي شهر في رأس الجدول لعرض تفصيلاته ونسب المقرات في البطاقة الإجمالية أدناه.</span>
              </div>
              <button
                type="button"
                onClick={() => setShowComparison(prev => !prev)}
                className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  showComparison
                    ? 'bg-[#091526] text-[#eab308] border-[#eab308]'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                }`}
              >
                <GitCompare className="w-4 h-4" />
                <span>{showComparison ? 'إخفاء أداة المقارنة' : 'مقارنة بين الأشهر والسنوات'}</span>
              </button>
            </div>

            <div className="overflow-x-auto smooth-scroll rounded-2xl border border-slate-200 shadow-sm">
              <table className="w-full border-collapse text-right min-w-[1050px]">
                <thead>
                  <tr className="bg-[#091526] text-white border-b-2 border-[#eab308]">
                    <th className="py-3.5 px-4 text-xs sm:text-sm font-extrabold whitespace-nowrap text-right sticky right-0 bg-[#091526] z-10 border-l border-slate-700">
                      اسم المقر
                    </th>
                    {MONTHS.map(month => {
                      const isSelected = month.value === selectedMonth;
                      return (
                        <th
                          key={month.value}
                          onClick={() => setSelectedMonth(month.value)}
                          title={`عرض تفصيل شهر ${month.name}`}
                          className={`py-3.5 px-2.5 text-xs font-bold whitespace-nowrap text-center cursor-pointer transition-colors select-none ${
                            isSelected
                              ? 'bg-[#eab308] text-[#091526] font-extrabold shadow-inner'
                              : 'hover:bg-slate-800 text-slate-100'
                          }`}
                        >
                          {month.name}
                        </th>
                      );
                    })}
                    <th className="py-3.5 px-4 text-xs sm:text-sm font-extrabold whitespace-nowrap text-center bg-[#1e293b] text-[#eab308] border-r border-slate-700">
                      الإجمالي السنوي
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                  {matrixStats.displayedRows.map((row, idx) => (
                    <tr
                      key={row.location}
                      className={`transition-colors ${
                        row.isUnspecified
                          ? 'bg-amber-50/70 hover:bg-amber-100/70'
                          : idx % 2 === 0
                          ? 'bg-white hover:bg-blue-50/40'
                          : 'bg-slate-50/70 hover:bg-blue-50/40'
                      }`}
                    >
                      <td
                        className={`py-3.5 px-4 font-bold whitespace-nowrap sticky right-0 z-10 border-l border-slate-200 ${
                          row.isUnspecified
                            ? 'bg-amber-50 text-amber-900'
                            : idx % 2 === 0
                            ? 'bg-white text-[#091526]'
                            : 'bg-slate-50 text-[#091526]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {row.isUnspecified ? (
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          ) : (
                            <Building2 className="w-4 h-4 text-[#091526]/70 shrink-0" />
                          )}
                          <span>{row.location}</span>
                        </div>
                      </td>

                      {MONTHS.map(month => {
                        const val = row.months[month.value] || 0;
                        const isSelected = month.value === selectedMonth;
                        return (
                          <td
                            key={month.value}
                            onClick={() => setSelectedMonth(month.value)}
                            className={`py-3.5 px-2.5 text-center font-mono cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-yellow-50/90 font-extrabold text-[#091526] ring-1 ring-inset ring-[#eab308]/40'
                                : val > 0
                                ? 'font-bold text-slate-800'
                                : 'text-slate-400'
                            }`}
                          >
                            {val}
                          </td>
                        );
                      })}

                      <td className="py-3.5 px-4 text-center font-mono font-extrabold text-[#091526] bg-slate-100/90 border-r border-slate-200">
                        <span className="inline-flex items-center justify-center min-w-[36px] px-2.5 py-0.5 rounded-full bg-[#091526] text-[#eab308] text-xs sm:text-sm">
                          {row.annualTotal}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#334155] text-white font-extrabold border-t-2 border-[#eab308] text-xs sm:text-sm">
                    <td className="py-3.5 px-4 whitespace-nowrap sticky right-0 bg-[#334155] z-10 border-l border-slate-600">
                      {selectedLocationFilter === 'ALL' ? 'إجمالي جميع المقرات' : 'إجمالي المقر المحدد'}
                    </td>
                    {MONTHS.map(month => {
                      const totalVal = matrixStats.displayedMonthTotals[month.value] || 0;
                      const isSelected = month.value === selectedMonth;
                      return (
                        <td
                          key={month.value}
                          className={`py-3.5 px-2.5 text-center font-mono ${
                            isSelected ? 'bg-[#eab308] text-[#091526] font-black' : 'text-white'
                          }`}
                        >
                          {totalVal}
                        </td>
                      );
                    })}
                    <td className="py-3.5 px-4 text-center font-mono text-base bg-[#091526] text-[#eab308] border-r border-slate-600">
                      {matrixStats.displayedAnnualGrandTotal}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* 2. Monthly Summary Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#091526] text-[#eab308] flex items-center justify-center shadow-md shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#091526]">
                    البطاقة الإجمالية لشهر {selectedMonthName} {matrixYear}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    توزيع عدد الزوار لكل مقر ونسبته المئوية من إجمالي زوار الشركة خلال شهر {selectedMonthName}
                  </p>
                </div>
              </div>

              {/* Quick Month Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {MONTHS.map(m => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setSelectedMonth(m.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedMonth === m.value
                        ? 'bg-[#091526] text-[#eab308] shadow-sm ring-1 ring-[#eab308]'
                        : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-4 bg-gradient-to-br from-[#091526] via-[#13284c] to-[#1e293b] rounded-2xl p-6 text-white flex flex-col justify-between border-b-4 border-[#eab308] shadow-md">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#eab308] text-xs font-bold border border-white/10">
                    <Users className="w-3.5 h-3.5" />
                    <span>شهر {selectedMonthName} {matrixYear}</span>
                  </span>
                  <h4 className="text-slate-300 text-xs sm:text-sm font-medium mt-4">
                    {selectedLocationFilter === 'ALL'
                      ? 'إجمالي زوار الشركة خلال الشهر المحدد'
                      : `إجمالي زوار (${selectedLocationFilter}) خلال الشهر`}
                  </h4>
                  <div className="text-4xl sm:text-5xl font-black text-white mt-2 font-mono">
                    {matrixStats.selectedMonthTotalDisplayed}
                    <span className="text-sm sm:text-base font-normal text-[#eab308] mr-2 font-sans">
                      زائر
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                  <span>نسبة الشهر من الإجمالي السنوي للشركة:</span>
                  <span className="font-mono font-bold text-[#eab308] text-sm">
                    {matrixStats.companyAnnualGrandTotal > 0
                      ? `${((matrixStats.selectedMonthTotalCompany / matrixStats.companyAnnualGrandTotal) * 100).toFixed(1)}%`
                      : '0.0%'}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {matrixStats.selectedMonthBreakdown.map(item => (
                  <div
                    key={item.location}
                    className={`rounded-xl p-4 border transition-all flex flex-col justify-between ${
                      item.isUnspecified
                        ? 'bg-amber-50/80 border-amber-200'
                        : 'bg-white border-slate-200 hover:border-[#eab308]'
                    } shadow-sm`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`p-2 rounded-lg shrink-0 ${
                            item.isUnspecified
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-[#091526]'
                          }`}
                        >
                          {item.isUnspecified ? (
                            <AlertTriangle className="w-4 h-4" />
                          ) : (
                            <Building2 className="w-4 h-4" />
                          )}
                        </div>
                        <h5 className="font-bold text-xs sm:text-sm text-[#091526] leading-snug break-words">
                          {item.location}
                        </h5>
                      </div>

                      <span className="px-2.5 py-1 rounded-lg bg-[#091526] text-[#eab308] font-mono font-extrabold text-xs sm:text-sm shrink-0">
                        {item.count} زائر
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                        <span>النسبة من إجمالي زوار الشركة خلال الشهر:</span>
                        <span className="font-mono font-bold text-[#091526]">
                          {item.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-l from-[#eab308] to-[#091526] rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(item.percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Month & Year Comparison Tool */}
          {showComparison && (
            <div className="bg-white rounded-2xl border-2 border-[#091526]/15 p-4 sm:p-6 shadow-sm animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#091526] text-[#eab308]">
                    <GitCompare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-[#091526]">
                      مقارنة إحصائيات الزوار بين الأشهر والسنوات
                    </h4>
                    <p className="text-xs text-slate-500">
                      مقارنة شهر ({selectedMonthName} {matrixYear}) مع شهر وسنة مرجعية أخرى حسب المقر
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-700 px-2">مقارنة مع:</span>
                  <select
                    value={compareMonth}
                    onChange={(e) => setCompareMonth(e.target.value)}
                    aria-label="شهر المقارنة"
                    className="bg-white text-[#091526] text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 cursor-pointer"
                  >
                    {MONTHS.map(m => (
                      <option key={m.value} value={m.value}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={compareYear}
                    onChange={(e) => setCompareYear(Number(e.target.value))}
                    aria-label="سنة المقارنة"
                    className="bg-white text-[#091526] text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 cursor-pointer"
                  >
                    {availableYears.map(y => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-right text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                      <th className="py-3 px-4 font-bold">اسم المقر</th>
                      <th className="py-3 px-4 font-bold text-center">
                        {selectedMonthName} {matrixYear} (الحالي)
                      </th>
                      <th className="py-3 px-4 font-bold text-center">
                        {compareMonthName} {compareYear} (المقارن)
                      </th>
                      <th className="py-3 px-4 font-bold text-center">الفارق العددي</th>
                      <th className="py-3 px-4 font-bold text-center">نسبة التغير</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {matrixStats.comparisonRows.map(row => (
                      <tr key={row.location} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-[#091526]">{row.location}</td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-[#091526]">
                          {row.currentCount}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-slate-600">
                          {row.previousCount}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold">
                          <span
                            className={
                              row.diff > 0
                                ? 'text-emerald-600'
                                : row.diff < 0
                                ? 'text-red-600'
                                : 'text-slate-500'
                            }
                            dir="ltr"
                          >
                            {row.diff > 0 ? `+${row.diff}` : row.diff}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                              row.diff > 0
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : row.diff < 0
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                            dir="ltr"
                          >
                            {row.diff > 0 && <ArrowUpRight className="w-3.5 h-3.5" />}
                            {row.diff < 0 && <ArrowDownRight className="w-3.5 h-3.5" />}
                            {row.growthPercent.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-800 text-white font-bold">
                      <td className="py-3 px-4">الإجمالي</td>
                      <td className="py-3 px-4 text-center font-mono text-[#eab308]">
                        {matrixStats.selectedMonthTotalDisplayed}
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        {matrixStats.compareTotalDisplayed}
                      </td>
                      <td className="py-3 px-4 text-center font-mono" dir="ltr">
                        {matrixStats.totalDiff > 0
                          ? `+${matrixStats.totalDiff}`
                          : matrixStats.totalDiff}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-[#eab308]" dir="ltr">
                        {matrixStats.compareTotalDisplayed > 0
                          ? `${(((matrixStats.selectedMonthTotalDisplayed - matrixStats.compareTotalDisplayed) / matrixStats.compareTotalDisplayed) * 100).toFixed(1)}%`
                          : matrixStats.selectedMonthTotalDisplayed > 0
                          ? '+100.0%'
                          : '0.0%'}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Dedicated Official Print Sheet (Visible ONLY when printing) */}
      <div className="hidden print:block w-full bg-white">
        {renderOfficialReportDocument(false)}
      </div>

      {/* 3. Off-Screen Full-Width A4 Landscape Template for High-Res PDF Generation (Zero Horizontal Clipping) */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '-10000px',
          left: '-10000px',
          width: '1080px',
          zIndex: -100,
          pointerEvents: 'none'
        }}
      >
        <div ref={pdfTemplateRef}>{renderOfficialReportDocument(true)}</div>
      </div>
    </section>
  );
};

export default MonthlyLocationReportSection;
