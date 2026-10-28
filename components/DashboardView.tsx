import React, { useMemo, useState } from 'react';
import {
  Users,
  Truck,
  MapPin,
  PieChart,
  BarChart3,
  Building2,
  Filter,
  ArrowUpRight,
  Trophy,
  Activity,
  Briefcase
} from 'lucide-react';
import { Record } from '../types.ts';
import { YEARS, CURRENT_YEAR, MONTHS } from '../constants.ts';
import MonthlyLocationReportSection, { parseRecordYearAndMonth } from './MonthlyLocationReportSection.tsx';

interface DashboardViewProps {
  records: Record[];
}

const UNSPECIFIED_LOCATION_LABEL = 'غير محدد (بدون مقر مسجل)';

const DashboardView: React.FC<DashboardViewProps> = ({ records }) => {
  const [selectedYear, setSelectedYear] = useState<number>(CURRENT_YEAR);

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

  // حساب الإحصائيات العامة للوحة المعلومات العلوية بناءً على السنة المحددة
  const stats = useMemo(() => {
    const yearRecords = uniqueRecords.filter(r => {
      const ym = parseRecordYearAndMonth(r);
      const recYear = ym ? ym.year : Number(r.year);
      return recYear === Number(selectedYear);
    });

    const total = yearRecords.length;
    const visitors = yearRecords.filter(r => r.type === 'visitor').length;
    const suppliers = yearRecords.filter(r => r.type === 'supplier').length;
    const employees = yearRecords.filter(r => r.type === 'employee').length;

    const monthlyData = MONTHS.map(month => {
      const count = yearRecords.filter(r => {
        const ym = parseRecordYearAndMonth(r);
        return ym ? ym.month === month.value : r.date.substring(5, 7) === month.value;
      }).length;
      return {
        name: month.name,
        value: count,
        heightPercentage: total > 0 ? (count / (total * 0.4 || 1)) * 100 : 0
      };
    });

    const locationCounts: { [key: string]: number } = {};
    yearRecords.forEach(r => {
      const loc = r.location && r.location.trim() ? r.location.trim() : UNSPECIFIED_LOCATION_LABEL;
      locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    });

    const locationData = Object.entries(locationCounts)
      .map(([name, value]) => ({ name, value, percentage: total > 0 ? (value / total) * 100 : 0 }))
      .sort((a, b) => b.value - a.value);

    return { total, visitors, suppliers, employees, monthlyData, locationData };
  }, [uniqueRecords, selectedYear]);

  const StatCard = ({ title, count, icon: Icon, percentage, delay, theme }: any) => {
    const themes: any = {
      navy: {
        wrapper: 'from-[#091526] to-[#1e293b] border-[#eab308]',
        iconBox: 'bg-white/10 text-[#eab308] group-hover:bg-[#eab308] group-hover:text-[#091526]',
        badge: 'bg-[#0f2036] text-[#eab308]',
        bar: 'bg-[#eab308]',
        shadow: 'hover:shadow-[#eab308]/20'
      },
      blue: {
        wrapper: 'from-blue-600 to-blue-800 border-blue-300',
        iconBox: 'bg-white/20 text-white group-hover:bg-white group-hover:text-blue-600',
        badge: 'bg-blue-900/50 text-blue-100',
        bar: 'bg-blue-200',
        shadow: 'hover:shadow-blue-500/30'
      },
      emerald: {
        wrapper: 'from-emerald-600 to-emerald-800 border-emerald-300',
        iconBox: 'bg-white/20 text-white group-hover:bg-white group-hover:text-emerald-600',
        badge: 'bg-emerald-900/50 text-emerald-100',
        bar: 'bg-emerald-200',
        shadow: 'hover:shadow-emerald-500/30'
      },
      purple: {
        wrapper: 'from-purple-600 to-purple-800 border-purple-300',
        iconBox: 'bg-white/20 text-white group-hover:bg-white group-hover:text-purple-600',
        badge: 'bg-purple-900/50 text-purple-100',
        bar: 'bg-purple-200',
        shadow: 'hover:shadow-purple-500/30'
      }
    };

    const currentTheme = themes[theme] || themes.navy;

    return (
      <div
        className={`bg-gradient-to-br ${currentTheme.wrapper} rounded-2xl p-6 shadow-lg border-t-4 hover:shadow-2xl ${currentTheme.shadow} hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group animate-fadeIn`}
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Icon className="w-32 h-32 text-white transform translate-x-10 -translate-y-10 rotate-12" />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl border border-white/10 transition-colors duration-300 shadow-inner ${currentTheme.iconBox}`}>
              <Icon className="w-6 h-6" />
            </div>

            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/10 shadow-sm ${currentTheme.badge}`}>
              <ArrowUpRight className="w-3 h-3" />
              <span className="text-xs font-bold">{stats.total > 0 ? Math.round(percentage) : 0}%</span>
            </div>
          </div>

          <div className="mt-2">
            <h3 className="text-4xl font-bold text-white tracking-tight mb-1 font-sans">{count}</h3>
            <p className="text-slate-200/80 text-sm font-medium tracking-wide">{title}</p>
          </div>

          <div className="w-full h-1.5 bg-black/20 rounded-full mt-4 overflow-hidden backdrop-blur-sm">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] ${currentTheme.bar}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header & Filter Section */}
      <div className="bg-[#091526] rounded-2xl shadow-lg border-b-4 border-[#eab308] p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden group print:hidden">
        <div className="absolute -left-10 -bottom-10 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
          <PieChart className="w-48 h-48 text-white" />
        </div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#eab308]/10 to-transparent pointer-events-none"></div>

        <div className="flex items-center gap-3 sm:gap-5 z-10">
          <div className="p-2.5 sm:p-3 bg-white/10 rounded-xl text-white shadow-inner backdrop-blur-sm border border-white/10 group-hover:bg-[#eab308] group-hover:text-[#091526] transition-all duration-300">
            <PieChart className="w-6 h-6 sm:w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">لوحة المعلومات</h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5 sm:mt-1">نظرة تحليلية شاملة لحركة الزوار والموردين</p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3 bg-white/5 p-2 rounded-xl border border-white/10 shadow-sm z-10 backdrop-blur-md">
          <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white/10 rounded-lg border border-white/5">
            <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#eab308]" />
            <span className="text-xs text-slate-200 font-bold whitespace-nowrap">السنة</span>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-slate-800 sm:bg-transparent text-white text-sm font-bold focus:ring-0 border-0 cursor-pointer outline-none py-1.5 pr-2 pl-4 rounded-lg [&>option]:text-slate-900 hover:text-[#eab308] transition-colors"
            aria-label="تصفية حسب السنة"
          >
            {availableYears.map(y => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 print:hidden">
        <StatCard
          title="إجمالي السجلات"
          count={stats.total}
          icon={Activity}
          percentage={100}
          theme="navy"
          delay={0}
        />
        <StatCard
          title="الزوار"
          count={stats.visitors}
          icon={Users}
          percentage={stats.total > 0 ? (stats.visitors / stats.total) * 100 : 0}
          theme="blue"
          delay={100}
        />
        <StatCard
          title="الموردين"
          count={stats.suppliers}
          icon={Truck}
          percentage={stats.total > 0 ? (stats.suppliers / stats.total) * 100 : 0}
          theme="emerald"
          delay={200}
        />
        <StatCard
          title="الموظفين"
          count={stats.employees}
          icon={Briefcase}
          percentage={stats.total > 0 ? (stats.employees / stats.total) * 100 : 0}
          theme="purple"
          delay={300}
        />
      </div>

      {/* الإحصائية الشهرية لعدد الزوار حسب المقر */}
      <MonthlyLocationReportSection records={records} externalYear={selectedYear} />

      {/* Charts Row: الإحصائية الشهرية & توزيع المقرات */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 print:hidden">
        {/* Monthly Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 p-4 sm:p-8 relative overflow-hidden group hover:border-[#eab308]/50 transition-colors duration-500">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#091526] via-[#2563eb] to-[#091526]"></div>

          <div className="flex items-center justify-between mb-6 sm:mb-10">
            <h3 className="text-base sm:text-lg font-bold text-[#091526] flex items-center gap-2.5 sm:gap-3">
              <div className="p-2 sm:p-2.5 bg-blue-50 text-blue-600 rounded-xl shadow-sm">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span>الإحصائية الشهرية لعام {selectedYear}</span>
            </h3>
          </div>

          <div className="overflow-x-auto smooth-scroll pb-2">
            <div className="min-w-[480px] sm:min-w-0 h-64 sm:h-72 flex items-end justify-between gap-2 sm:gap-4 px-2 relative">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="border-t border-dashed border-slate-300 w-full h-px"></div>
                ))}
              </div>

              {stats.monthlyData.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 sm:gap-3 flex-1 group/bar z-10 h-full justify-end">
                  <div className="w-full relative flex items-end h-full rounded-t-lg">
                    <div
                      className="w-full bg-gradient-to-t from-[#091526] to-[#334155] group-hover/bar:from-[#eab308] group-hover/bar:to-yellow-400 transition-all duration-500 rounded-t-lg relative min-h-[6px] shadow-md flex justify-center group-hover/bar:shadow-lg group-hover/bar:shadow-yellow-200/50"
                      style={{ height: `${Math.min(item.heightPercentage, 100)}%` }}
                    >
                      {item.value > 0 && (
                        <span className="absolute -top-7 sm:-top-8 text-[10px] sm:text-xs font-bold text-[#091526] bg-slate-100 border border-slate-200 px-1.5 sm:px-2 py-0.5 rounded-md shadow-sm opacity-100 transition-all duration-300 group-hover/bar:scale-110 group-hover/bar:bg-[#091526] group-hover/bar:text-white group-hover/bar:border-[#091526]">
                          {item.value}
                        </span>
                      )}

                      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-[#091526] text-white text-xs font-bold py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all duration-300 whitespace-nowrap shadow-xl pointer-events-none -translate-y-2 group-hover/bar:translate-y-0 z-20 border-b-2 border-[#eab308]">
                        {item.name}: {item.value}
                        <div className="absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#091526] rotate-45"></div>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 group-hover/bar:text-[#091526] transition-colors whitespace-nowrap">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Location Stats Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col h-full relative overflow-hidden group hover:border-[#eab308]/50 transition-colors duration-500">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#eab308] to-[#f59e0b]"></div>

          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-[#091526] flex items-center gap-3">
              <div className="p-2.5 bg-yellow-50 text-yellow-600 rounded-xl shadow-sm">
                <Building2 className="w-5 h-5" />
              </div>
              <span>توزيع المقرات</span>
            </h3>
          </div>

          <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-grow">
            {stats.locationData.length > 0 ? (
              stats.locationData.map((loc, idx) => {
                let barColor = 'bg-slate-700';
                let rankBadge = 'bg-slate-100 text-slate-500';

                if (idx === 0) {
                  barColor = 'bg-gradient-to-r from-yellow-400 to-yellow-600';
                  rankBadge = 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200';
                } else if (idx === 1) {
                  barColor = 'bg-gradient-to-r from-slate-400 to-slate-500';
                  rankBadge = 'bg-slate-200 text-slate-700 ring-1 ring-slate-300';
                } else if (idx === 2) {
                  barColor = 'bg-gradient-to-r from-orange-400 to-orange-600';
                  rankBadge = 'bg-orange-100 text-orange-800 ring-1 ring-orange-200';
                }

                return (
                  <div key={idx} className="group/item">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3 max-w-[80%]">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-transform group-hover/item:scale-110 ${rankBadge}`}>
                          {idx + 1}
                        </div>
                        <span className="text-slate-700 font-bold text-sm truncate group-hover/item:text-[#091526] transition-colors" title={loc.name}>
                          {loc.name}
                        </span>
                      </div>
                      <span className="font-bold text-[#091526] text-sm bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 group-hover/item:border-[#eab308] transition-colors">
                        {loc.value}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner">
                      <div
                        className={`h-full rounded-full relative transition-all duration-1000 ease-out group-hover/item:shadow-lg ${barColor}`}
                        style={{ width: `${loc.percentage}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20"></div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                <MapPin className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-sm">لا توجد بيانات للعرض</p>
              </div>
            )}
          </div>

          {stats.total > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-4 bg-gradient-to-r from-[#091526] to-[#1e293b] rounded-xl p-4 text-white shadow-lg relative overflow-hidden group hover:shadow-xl hover:shadow-blue-900/20 transition-all duration-300">
                <div className="absolute right-0 top-0 w-1.5 h-full bg-[#eab308]"></div>
                <div className="p-2.5 bg-white/10 rounded-lg text-[#eab308] border border-white/5">
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-300 mb-0.5">المقر الأكثر نشاطاً</p>
                  <p className="text-sm font-bold text-white truncate">{stats.locationData[0]?.name}</p>
                </div>
                <div className="text-right pl-2">
                  <span className="text-xl font-black text-[#eab308]">
                    {Math.round(stats.locationData[0]?.percentage || 0)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;