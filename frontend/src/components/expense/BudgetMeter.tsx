'use client';

import { motion } from 'framer-motion';
import styles from './BudgetMeter.module.css';

interface BudgetMeterProps {
  totalSpent: number;
  totalBudget: number;
  remaining: number;
}

export function BudgetMeter({ totalSpent, totalBudget, remaining }: BudgetMeterProps) {
  const percentage = Math.min((totalSpent / totalBudget) * 100, 100);
  const isWarning = percentage >= 80;
  const isOver = percentage >= 100;

  // SVG circle params
  const size = 180;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const ringColor = isOver
    ? 'var(--color-danger)'
    : isWarning
    ? 'var(--color-warning)'
    : 'var(--color-success)';

  return (
    <div className={`${styles.meter} ${isOver ? styles.meterOver : ''}`}>
      <div className={styles.ring}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-bg-elevated)"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: 'center',
              filter: isOver ? `drop-shadow(0 0 8px var(--color-danger))` : 'none',
            }}
          />
        </svg>

        <div className={styles.ringCenter}>
          <span className={styles.remainingValue} style={{ color: ringColor }}>
            ₹{remaining.toLocaleString('en-IN')}
          </span>
          <span className={styles.remainingLabel}>remaining</span>
        </div>
      </div>

      <div className={styles.breakdown}>
        <div className={styles.breakdownItem}>
          <span className={styles.breakdownLabel}>Spent</span>
          <span className={styles.breakdownValue}>₹{totalSpent.toLocaleString('en-IN')}</span>
        </div>
        <div className={styles.breakdownDivider} />
        <div className={styles.breakdownItem}>
          <span className={styles.breakdownLabel}>Budget</span>
          <span className={styles.breakdownValue}>₹{totalBudget.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {isWarning && !isOver && (
        <div className={styles.alert} style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.2)', color: 'var(--color-warning)' }}>
          ⚠️ You&apos;ve spent {Math.round(percentage)}% of your budget
        </div>
      )}
      {isOver && (
        <motion.div
          className={styles.alert}
          style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--color-danger)' }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          🚨 Over budget!
        </motion.div>
      )}
    </div>
  );
}
