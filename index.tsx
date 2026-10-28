import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global startup diagnostics to distinguish asset/script load errors from runtime exceptions
if (typeof window !== 'undefined') {
  window.addEventListener(
    'error',
    (event: ErrorEvent | Event) => {
      const target = (event as Event).target as HTMLElement | null;
      if (target && (target.tagName === 'SCRIPT' || target.tagName === 'LINK')) {
        const url =
          (target as HTMLScriptElement).src ||
          (target as HTMLLinkElement).href ||
          'unknown-resource';
        console.error(
          `[Startup Asset Load Error] Failed to load required application resource (${target.tagName}): ${url}`
        );
        return;
      }
      if ('error' in event && event.error) {
        console.error('[Startup Unhandled Runtime Error]', event.error);
      }
    },
    true
  );

  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    console.error('[Startup Unhandled Promise Rejection]', event.reason);
  });
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  declare props: Readonly<{ children: React.ReactNode }>;
  state: ErrorBoundaryState = { hasError: false };

  constructor(props: { children: React.ReactNode }) {
    super(props);
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('[React Component Render Error]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          dir="rtl"
          className="min-h-screen flex items-center justify-center bg-[#041533] text-white p-6 font-sans"
        >
          <div className="max-w-md w-full bg-white text-[#0a2958] rounded-2xl shadow-2xl p-6 text-center space-y-4 border border-slate-200">
            <h1 className="text-xl font-extrabold text-[#0a316d]">
              تعذر عرض واجهة النظام
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              حدث خطأ غير متوقع أثناء تشغيل الواجهة. تم تسجيل تفاصيل الخطأ في وحدة التحكم (Console) لتسهيل التشخيص.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-xl bg-[#004799] hover:bg-[#003575] text-white font-bold text-sm transition-colors cursor-pointer"
            >
              إعادة تحميل الصفحة | Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('[Startup Fatal Error] Root DOM element (#root) was not found in index.html.');
  throw new Error('Could not find root element (#root) to mount application');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </React.StrictMode>
);