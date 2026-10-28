import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const isResizeObserverLoopError = (messageOrError: unknown): boolean => {
  const text =
    typeof messageOrError === 'string'
      ? messageOrError
      : messageOrError instanceof Error
      ? messageOrError.message
      : '';
  return (
    text.includes('ResizeObserver loop completed with undelivered notifications') ||
    text.includes('ResizeObserver loop limit exceeded')
  );
};

// Stabilize ResizeObserver callbacks using requestAnimationFrame to prevent synchronous layout loops,
// and filter out benign browser ResizeObserver loop notifications from global error handlers.
if (typeof window !== 'undefined') {
  if (typeof window.ResizeObserver !== 'undefined') {
    const NativeResizeObserver = window.ResizeObserver;
    window.ResizeObserver = class PatchedResizeObserver extends NativeResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        let frameId: number | null = null;
        super((entries, observer) => {
          if (frameId !== null) {
            window.cancelAnimationFrame(frameId);
          }
          frameId = window.requestAnimationFrame(() => {
            frameId = null;
            callback(entries, observer);
          });
        });
      }
    };
  }

  window.addEventListener(
    'error',
    (event: ErrorEvent | Event) => {
      const errorEvent = event as ErrorEvent;
      if (
        isResizeObserverLoopError(errorEvent.message) ||
        isResizeObserverLoopError(errorEvent.error)
      ) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return;
      }

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
      if ('error' in event && errorEvent.error) {
        console.error('[Startup Unhandled Runtime Error]', errorEvent.error);
      }
    },
    true
  );

  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    if (isResizeObserverLoopError(event.reason)) {
      event.preventDefault();
      return;
    }
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