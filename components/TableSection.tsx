import React, { useState, useEffect, useRef } from 'react';
import { 
  Pencil, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  LayoutGrid, 
  Table as TableIcon, 
  Clock, 
  Phone, 
  MapPin, 
  Building2, 
  CreditCard, 
  UserCheck, 
  FileText,
  User,
  Calendar,
  Upload,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { TableSectionProps, Record } from '../types.ts';

const TableSection: React.FC<TableSectionProps> = ({ 
  title, 
  recordType,
  data, 
  icon: Icon, 
  colorTheme, 
  onEdit, 
  onDelete, 
  sortOrder, 
  onSortChange, 
  isVisitorTable,
  onImportExcel,
  xlsxLoaded = true,
  importStatus
}) => {
    // Default to cards on small screens, table on larger screens
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
    const sectionFileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth < 768) {
          setViewMode('cards');
        } else {
          setViewMode('table');
        }
      };
      
      // Set initial state based on window width
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setViewMode('cards');
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSectionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && onImportExcel) {
        onImportExcel(file, recordType);
      }
      if (e.target) {
        e.target.value = '';
      }
    };

    const isSectionImportActive =
      importStatus && importStatus.status !== 'idle' && importStatus.targetType === recordType;

    const themeClasses = {
      navy: "bg-[#091526] border-b-4 border-[#eab308] text-white",   // Project Navy
      teal: "bg-[#134e4a] border-b-4 border-[#eab308] text-white",   // Deep Teal
      maroon: "bg-[#881337] border-b-4 border-[#eab308] text-white", // Deep Maroon
      brown: "bg-[#ab9c88] border-b-4 border-[#eab308] text-white",   // Custom Brown
      purple: "bg-[#413c4a] border-b-4 border-[#eab308] text-white",   // Custom Purple
      orange: "bg-[#532703] border-b-4 border-[#eab308] text-white",    // Custom Orange
      grey: "bg-[#7c7c7b] border-b-4 border-[#eab308] text-white"      // Custom Grey
    };

    const iconBgClasses = {
      navy: "bg-white/10 text-[#eab308]",
      teal: "bg-white/10 text-[#eab308]",
      maroon: "bg-white/10 text-[#eab308]",
      brown: "bg-white/20 text-[#eab308]",
      purple: "bg-white/10 text-[#eab308]",
      orange: "bg-white/10 text-[#eab308]",
      grey: "bg-white/10 text-[#eab308]"
    };

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 mb-8 animate-fadeIn transition-all">
        {/* Header with Title, Per-Record Excel Import Button, and View Switcher */}
        <div className={`px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${themeClasses[colorTheme] || "bg-slate-100"}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg shadow-sm ${iconBgClasses[colorTheme] || "bg-white/20"}`}>
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base sm:text-lg">
              {title} 
              <span className="text-xs sm:text-sm opacity-80 font-normal mx-1">({data.length} سجل)</span>
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto print:hidden">
            {/* Dedicated Excel Import Button for this Record Section */}
            {onImportExcel && (
              <>
                <input
                  type="file"
                  ref={sectionFileInputRef}
                  onChange={handleSectionFileChange}
                  accept=".xlsx, .xls"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => sectionFileInputRef.current?.click()}
                  disabled={!xlsxLoaded || (isSectionImportActive && importStatus?.status === 'importing')}
                  className="min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-bold bg-[#eab308] text-[#091526] hover:bg-yellow-400 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  title={`استيراد بيانات من ملف إكسل إلى ${title}`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>استيراد من إكسل</span>
                </button>
              </>
            )}

            {/* View switcher buttons */}
            <div className="bg-black/20 p-1 rounded-lg flex items-center gap-1 border border-white/10 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                  viewMode === 'cards' 
                    ? 'bg-[#eab308] text-[#091526] shadow-sm' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                title="عرض البطاقات (مناسب للهواتف)"
                aria-label="عرض البطاقات"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>بطاقات</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                  viewMode === 'table' 
                    ? 'bg-[#eab308] text-[#091526] shadow-sm' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                title="عرض الجدول الكامل"
                aria-label="عرض الجدول"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>جدول</span>
              </button>
            </div>
          </div>
        </div>

        {/* Per-Section Import Status Banner */}
        {isSectionImportActive && (
          <div
            className={`px-4 py-2.5 border-b text-xs sm:text-sm font-medium flex items-center gap-2 print:hidden ${
              importStatus.status === 'importing'
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : importStatus.status === 'success'
                ? 'bg-green-50 text-green-800 border-green-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            {importStatus.status === 'importing' && (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
            )}
            {importStatus.status === 'success' && <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />}
            {importStatus.status === 'error' && <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
            <span>{importStatus.message}</span>
          </div>
        )}

        {/* Empty state */}
        {data.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-500">
            لا توجد سجلات تطابق البحث
          </div>
        ) : (
          <>
            {/* 1. CARDS VIEW (Mobile-First / Card Mode) */}
            {viewMode === 'cards' && (
              <div className="p-3 sm:p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 bg-slate-50/70">
                {data.map((record: Record, idx: number) => {
                  const dayName = new Date(record.date).toLocaleDateString('ar-AE', { weekday: 'long' });
                  return (
                    <div 
                      key={record.id} 
                      className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
                    >
                      {/* Card Top Row: Index, Date, Day, Actions */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-slate-800 text-yellow-400 font-bold text-xs flex items-center justify-center font-mono">
                            #{idx + 1}
                          </span>
                          <div className="text-xs text-slate-600 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-semibold text-slate-800" dir="ltr">{record.date}</span>
                            <span className="text-slate-400">({dayName})</span>
                          </div>
                        </div>

                        {/* Action buttons with 40px touch targets */}
                        <div className="flex items-center gap-1">
                          <button 
                            type="button"
                            onClick={() => onEdit(record)} 
                            className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded-lg transition-colors" 
                            title="تعديل السجل"
                            aria-label="تعديل السجل"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => onDelete(record.id)} 
                            className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-red-600 hover:bg-red-50 active:bg-red-100 rounded-lg transition-colors" 
                            title="حذف السجل"
                            aria-label="حذف السجل"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Main Entity: Name & Location */}
                      <div className="mb-3">
                        <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                          <User className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                          <span className="break-words">{record.name}</span>
                        </h4>
                        {record.location && (
                          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span>{record.location}</span>
                          </p>
                        )}
                      </div>

                      {/* Detail Fields in a clean grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-3">
                        {record.phone && (
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <a href={`tel:${record.phone}`} className="hover:text-blue-600 font-mono" dir="ltr">{record.phone}</a>
                          </div>
                        )}
                        {record.department && (
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span className="truncate" title={record.department}>{record.department}</span>
                          </div>
                        )}
                        {record.purpose && (
                          <div className="flex items-center gap-1.5 text-slate-700 sm:col-span-2">
                            <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span>{record.purpose}</span>
                          </div>
                        )}
                        {isVisitorTable && record.receivedBy && (
                          <div className="flex items-center gap-1.5 text-slate-700 sm:col-span-2 bg-yellow-50/60 p-1.5 rounded border border-yellow-100/80">
                            <UserCheck className="w-3.5 h-3.5 text-yellow-700 flex-shrink-0" />
                            <span className="text-slate-700">المستقبل: <strong className="text-slate-900">{record.receivedBy}</strong></span>
                          </div>
                        )}
                        {record.idType && (
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <CreditCard className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span>{record.idType}</span>
                          </div>
                        )}
                      </div>

                      {/* Timing Bar */}
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200" dir="ltr">
                            {record.timeIn || '--:--'}
                          </span>
                          {record.timeOut ? (
                            <>
                              <span className="text-slate-400">➜</span>
                              <span className="font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200" dir="ltr">
                                {record.timeOut}
                              </span>
                            </>
                          ) : (
                            <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              متواجد حالياً
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Notes if present */}
                      {record.notes && (
                        <p className="mt-2 text-xs text-slate-500 bg-slate-100/70 p-2 rounded border border-slate-200/60 break-words">
                          <strong className="text-slate-700">ملاحظات:</strong> {record.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 2. TABLE VIEW (Desktop / Scrollable Responsive Table) */}
            {viewMode === 'table' && (
              <div className="overflow-x-auto smooth-scroll">
                <table className="w-full border-collapse text-right min-w-[900px]">
                  <thead className="bg-[#334155] border-b border-slate-700">
                    <tr>
                      <th className="px-3 sm:px-4 py-3 text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap w-24 text-center">إجراءات</th>
                      <th className="px-3 sm:px-4 py-3 text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap w-12 text-center">م</th>
                      <th className="px-3 sm:px-4 py-3 text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap text-center">
                        <button 
                          type="button"
                          onClick={onSortChange} 
                          className="flex items-center justify-center mx-auto gap-1 group hover:text-[#eab308] transition-colors p-1"
                        >
                          <span>التاريخ</span>
                          {sortOrder === 'desc' ? (
                            <ArrowDown className="w-4 h-4 text-slate-300 group-hover:text-[#eab308]" />
                          ) : (
                            <ArrowUp className="w-4 h-4 text-slate-300 group-hover:text-[#eab308]" />
                          )}
                        </button>
                      </th>
                      <th className="px-3 sm:px-4 py-3 text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap text-center">اليوم</th>
                      <th className="px-3 sm:px-4 py-3 text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap text-center">المقر</th>
                      <th className="px-3 sm:px-4 py-3 text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap text-center">الاسم</th>
                      <th className="px-3 sm:px-4 py-3 text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap text-center">الهاتف</th>
                      <th className="px-3 sm:px-4 py-3 text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap text-center">الإدارة</th>
                      <th className="px-3 sm:px-4 py-3 text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap text-center">الغرض</th>
                      {isVisitorTable && <th className="px-3 sm:px-4 py-3 text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap text-center">الموظف المستقبل</th>}
                      <th className="px-3 sm:px-4 py-3 text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap text-center">إثبات الهوية</th>
                      <th className="px-3 sm:px-4 py-3 text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap text-center">التوقيت</th>
                      <th className="px-3 sm:px-4 py-3 text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap text-center">الملاحظات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {data.map((record: Record, idx: number) => {
                      const dayName = new Date(record.date).toLocaleDateString('ar-AE', { weekday: 'long' });
                      return (
                        <tr key={record.id} className="hover:bg-slate-50 transition-colors duration-150 text-xs sm:text-sm group">
                          <td className="px-3 sm:px-4 py-3.5 whitespace-nowrap align-middle text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button 
                                type="button"
                                onClick={() => onEdit(record)} 
                                className="text-slate-500 hover:text-blue-600 hover:bg-blue-100 p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg transition-all" 
                                title="تعديل السجل"
                                aria-label="تعديل السجل"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button 
                                type="button"
                                onClick={() => onDelete(record.id)} 
                                className="text-slate-500 hover:text-red-600 hover:bg-red-100 p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg transition-all" 
                                title="حذف السجل"
                                aria-label="حذف السجل"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 py-3.5 whitespace-nowrap text-[#334155] font-bold align-middle text-center font-mono" dir="ltr">{idx + 1}</td>
                          <td className="px-3 sm:px-4 py-3.5 whitespace-nowrap text-black align-middle text-center font-mono" dir="ltr">{record.date}</td>
                          <td className="px-3 sm:px-4 py-3.5 whitespace-nowrap text-black align-middle text-center">{dayName}</td>
                          <td className="px-3 sm:px-4 py-3.5 whitespace-nowrap text-black align-middle text-center">{typeof record.location === 'string' ? record.location : ''}</td>
                          <td className="px-3 sm:px-4 py-3.5 whitespace-nowrap font-medium text-black align-middle text-center">{record.name}</td>
                          <td className="px-3 sm:px-4 py-3.5 whitespace-nowrap text-black align-middle text-center font-mono" dir="ltr">
                            {record.phone ? (
                              <a href={`tel:${record.phone}`} className="hover:text-blue-600 hover:underline">{record.phone}</a>
                            ) : '-'}
                          </td>
                          <td className="px-3 sm:px-4 py-3.5 whitespace-nowrap text-black align-middle text-center">{record.department || '-'}</td>
                          <td className="px-3 sm:px-4 py-3.5 whitespace-nowrap text-black align-middle text-center">{record.purpose || '-'}</td>
                          {isVisitorTable && <td className="px-3 sm:px-4 py-3.5 whitespace-nowrap text-black align-middle text-center">{record.receivedBy || '-'}</td>}
                          <td className="px-3 sm:px-4 py-3.5 whitespace-nowrap text-black align-middle text-center">{record.idType}</td>
                          <td className="px-3 sm:px-4 py-3.5 whitespace-nowrap align-middle text-center font-mono" dir="ltr">
                            <span className="text-green-600 font-medium">{record.timeIn}</span> 
                            {record.timeOut && <span className="text-slate-400 mx-1">➜</span>}
                            {record.timeOut && <span className="text-red-600 font-medium">{record.timeOut}</span>}
                          </td>
                          <td className="px-3 sm:px-4 py-3.5 text-black max-w-xs whitespace-normal break-words align-middle text-center">{record.notes || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    );
};

export default TableSection;