import React from 'react';
import { motion } from 'framer-motion';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  pulse?: boolean;
}

const variantClasses = {
  primary: 'badge-primary',
  secondary: 'badge-secondary',
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
};

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  className = '',
  pulse = false,
}) => {
  const baseClasses = 'badge';
  const variantClass = variantClasses[variant];
  const sizeClass = sizeClasses[size];
  const pulseClass = pulse ? 'animate-pulse' : '';

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`${baseClasses} ${variantClass} ${sizeClass} ${pulseClass} ${className}`}
    >
      {children}
    </motion.span>
  );
};

export default Badge;