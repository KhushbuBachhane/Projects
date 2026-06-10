import { X, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';

const icons = {
  new: AlertTriangle,
  verified: CheckCircle,
  severity: AlertCircle,
};

const colors = {
  new: 'border-red-500 bg-red-50 dark:bg-red-950/50',
  verified: 'border-green-500 bg-green-50 dark:bg-green-950/50',
  severity: 'border-orange-500 bg-orange-50 dark:bg-orange-950/50',
};

export default function AlertToast() {
  const { alerts, dismissAlert } = useSocket();

  if (!alerts.length) return null;

  return (
    <div className="fixed right-4 top-20 z-50 flex w-80 flex-col gap-2">
      {alerts.map((alert) => {
        const Icon = icons[alert.type] || AlertTriangle;
        return (
          <div
            key={alert.id}
            className={`flex items-start gap-3 rounded-lg border-l-4 p-4 shadow-lg backdrop-blur-sm ${colors[alert.type]}`}
          >
            <Icon className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{alert.title}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{alert.message}</p>
            </div>
            <button onClick={() => dismissAlert(alert.id)} className="shrink-0 rounded p-0.5 hover:bg-black/5">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
