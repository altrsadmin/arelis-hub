// Update Select component to remove required styling
export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export function Select({
  label,
  options,
  error,
  helperText,
  fullWidth,
  required, // This prop will be ignored
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <select
        className={`
          block rounded-lg border border-gray-300 bg-white px-3 py-2
          text-gray-900 focus:border-[#0099ff] focus:outline-none backdrop-blur-sm
          focus:ring-1 focus:ring-[#0099ff] dark:border-gray-600
          dark:bg-gray-700/80 dark:text-white dark:focus:border-[#2afbc6]
          dark:focus:ring-[#2afbc6] ${fullWidth ? 'w-full' : ''} ${className}
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          shadow-sm hover:shadow-md transition-all duration-200
          appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1em_1em]
          bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")]
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
}