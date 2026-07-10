import { useToast } from '../../contexts/ToastContext';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle, FiRotateCcw } from 'react-icons/fi';

const icons = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  info: FiInfo,
  warning: FiAlertTriangle,
};

const styles = {
  success: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300',
  error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300',
  info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
  warning: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300',
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || FiInfo;
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-in ${styles[toast.type] || styles.info}`}
          >
            <Icon size={18} className="mt-0.5 shrink-0" />
            <p className="text-sm flex-1">{toast.message}</p>
            <div className="flex items-center gap-1 shrink-0">
              {toast.action && (
                <button
                  onClick={() => { toast.action.onClick(); removeToast(toast.id); }}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  <FiRotateCcw size={12} />
                  Undo
                </button>
              )}
              <button onClick={() => removeToast(toast.id)} className="p-0.5 rounded opacity-60 hover:opacity-100 transition-opacity">
                <FiX size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
