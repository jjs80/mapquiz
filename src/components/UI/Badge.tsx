import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  className = '',
}) => {
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${variantClasses[variant]} ${className}`}
    >
      {label}
    </span>
  );
};
