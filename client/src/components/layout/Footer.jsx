import { AlertTriangle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <AlertTriangle className="h-4 w-4 text-brand-600" />
          <span>DisasterWatch &copy; {new Date().getFullYear()}</span>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Real-Time Disaster Alert Platform — Stay informed, stay safe.
        </p>
      </div>
    </footer>
  );
}
