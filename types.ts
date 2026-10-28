import React from 'react';
import { LucideProps } from 'lucide-react';

export type RecordType = 'visitor' | 'supplier' | 'employee';

export type IdType = 'الهوية الوطنية' | 'رخصة قيادة' | 'جواز سفر' | 'بطاقة عمل' | 'أخرى';

export interface FormDataState {
  type: RecordType;
  year: number;
  location: string;
  name: string;
  phone: string;
  department: string;
  purpose: string;
  receivedBy?: string;
  date: string;
  timeIn: string;
  timeOut: string;
  idType: IdType | string; 
  notes: string;
}

export interface Record extends FormDataState {
  id: string;
  createdAt?: Date | string; // Adjusted for JSON serialization
  lastModified?: Date | string;
}

export type SubmitStatus = 'success' | 'success_offline' | 'updated' | 'error' | null;

export type SortOrder = 'asc' | 'desc';

export interface ImportStatusState {
  status: 'idle' | 'importing' | 'success' | 'error';
  message?: string;
  targetType?: RecordType;
}

export interface TableSectionProps {
  title: string;
  recordType: RecordType;
  data: Record[];
  icon: React.ComponentType<LucideProps>;
  colorTheme: 'navy' | 'teal' | 'maroon' | 'brown' | 'purple' | 'orange' | 'grey';
  onEdit: (record: Record) => void;
  onDelete: (id: string) => void;
  sortOrder: SortOrder;
  onSortChange: () => void;
  isVisitorTable?: boolean;
  onImportExcel?: (file: File, type: RecordType) => void;
  xlsxLoaded?: boolean;
  importStatus?: ImportStatusState;
}