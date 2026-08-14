'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'orange' | 'violet' | 'cyan' | 'none';
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function Card({
  children,
  className = '',
  hover = true,
  glow = 'none',
  padding = 'md',
  onClick,
}: CardProps) {
  const paddingMap = { sm: 'var(--space-4)', md: 'var(--space-6)', lg: 'var(--space-8)' };
  const glowMap = {
    none: 'none',
    orange: 'var(--shadow-glow)',
    violet: 'var(--shadow-glow-violet)',
    cyan: 'var(--shadow-glow-cyan)',
  };

  return (
    <motion.div
      className={`glass-card ${className}`}
      style={{
        padding: paddingMap[padding],
        cursor: onClick ? 'pointer' : 'default',
      }}
      whileHover={
        hover
          ? {
              y: -4,
              boxShadow: `var(--shadow-card), ${glowMap[glow] !== 'none' ? glowMap[glow] : 'var(--shadow-glow)'}`,
            }
          : undefined
      }
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
