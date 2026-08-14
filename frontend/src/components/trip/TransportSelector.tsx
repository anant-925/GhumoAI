'use client';

import { motion } from 'framer-motion';
import { Car, Train, Bus, Plane, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAllTransportCosts } from '@/hooks/useTrip';
import { Button } from '@/components/ui/Button';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import type { TransportMode } from '@/lib/types';
import styles from './TransportSelector.module.css';

const MODES: { key: TransportMode; label: string; icon: React.ReactNode; emoji: string }[] = [
  { key: 'personal_vehicle', label: 'Personal Vehicle', icon: <Car size={28} />, emoji: '🚗' },
  { key: 'train', label: 'Train', icon: <Train size={28} />, emoji: '🚂' },
  { key: 'bus', label: 'Bus', icon: <Bus size={28} />, emoji: '🚌' },
  { key: 'flight', label: 'Flight', icon: <Plane size={28} />, emoji: '✈️' },
];

interface TransportSelectorProps {
  tripId: string;
  onSelect: (mode: TransportMode) => void;
  onBack: () => void;
}

export function TransportSelector({ tripId, onSelect, onBack }: TransportSelectorProps) {
  const { data: costs, isLoading, error, refetch } = useAllTransportCosts(tripId);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          How are you <span className="text-gradient">traveling?</span>
        </h2>
        <p className={styles.subtitle}>
          Select your preferred mode of transport. Estimated costs are shown below.
        </p>
      </div>

      {isLoading ? (
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <motion.div
          className={styles.grid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {MODES.map((mode, i) => {
            const cost = costs?.[mode.key];
            return (
              <motion.button
                key={mode.key}
                className={styles.modeCard}
                onClick={() => onSelect(mode.key)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, boxShadow: 'var(--shadow-card), var(--shadow-glow)' }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={styles.modeEmoji}>{mode.emoji}</div>
                <div className={styles.modeIcon}>{mode.icon}</div>
                <h4 className={styles.modeLabel}>{mode.label}</h4>
                {cost && (
                  <div className={styles.modeCost}>
                    <span className={styles.costValue}>₹{cost.total_estimate.toLocaleString('en-IN')}</span>
                    <span className={styles.costLabel}>estimated</span>
                  </div>
                )}
                <div className={styles.modeArrow}>
                  <ArrowRight size={16} />
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      )}

      <div className={styles.actions}>
        <Button variant="ghost" onClick={onBack} icon={<ArrowLeft size={16} />}>
          Back
        </Button>
      </div>
    </div>
  );
}
