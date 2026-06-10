export default function Card({ children, className = '', padding = true }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 ${padding ? 'p-5' : ''} ${className}`}>
      {children}
    </div>
  );
}
