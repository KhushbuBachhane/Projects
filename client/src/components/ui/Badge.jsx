import { SEVERITY_COLORS } from '../../utils/constants';

export default function Badge({ severity, verified, className = '' }) {
  if (verified !== undefined) {
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          verified
            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
        } ${className}`}
      >
        {verified ? 'Verified' : 'Unverified'}
      </span>
    );
  }

  const colors = SEVERITY_COLORS[severity] || SEVERITY_COLORS.Medium;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text} ${className}`}>
      {severity}
    </span>
  );
}
