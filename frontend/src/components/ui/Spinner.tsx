'use client';

import { motion } from 'framer-motion';

interface SpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

export function Spinner({ size = 32, color = 'var(--color-brand-primary)', className = '' }: SpinnerProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-8)',
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{
          width: size,
          height: size,
          border: `3px solid var(--color-border)`,
          borderTopColor: color,
          borderRadius: '50%',
        }}
      />
    </div>
  );
}
