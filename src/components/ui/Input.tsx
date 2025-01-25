// Update Input component to remove required styling
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  helperText,
  fullWidth,
  required, // This prop will be ignored
  className = '',
  ...props
}: InputProps) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        className={`
          block rounded-lg border border-gray-300 bg-white px-3 py-2
          text-gray-900 placeholder-gray-500 focus:border-[#0099ff]
          focus:outline-none focus:ring-1 focus:ring-[#0099ff]
          dark:border-gray-600 dark:bg-gray-700/80 dark:text-white
          dark:placeholder-gray-400 dark:focus:border-[#2afbc6]
          dark:focus:ring-[#2afbc6] transition-all duration-200
          backdrop-blur-sm shadow-sm hover:shadow-md
          ${fullWidth ? 'w-full' : ''} ${className}
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
}