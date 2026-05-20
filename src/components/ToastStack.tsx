import { useApp } from '../context/AppProvider';

const icons: Record<string, string> = {
  info: 'bi-info-circle',
  success: 'bi-check-circle',
  error: 'bi-exclamation-circle',
};

export function ToastStack() {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="toast-container" id="toastContainer">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`} role="status">
          <span className="toast-icon">
            <i className={`bi ${icons[t.type] || icons.info}`} aria-hidden />
          </span>
          {t.message}
          <button type="button" className="toast-close" aria-label="Dismiss" onClick={() => dismissToast(t.id)}>
            <i className="bi bi-x" aria-hidden />
          </button>
        </div>
      ))}
    </div>
  );
}
