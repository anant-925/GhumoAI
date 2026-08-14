'use client';

import { motion } from 'framer-motion';
import { Star, Clock, IndianRupee, Check, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { POI } from '@/lib/types';
import styles from './POICard.module.css';

const CATEGORY_CONFIG: Record<string, { label: string; variant: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' }> = {
  monument: { label: 'Monument', variant: 'primary' },
  museum: { label: 'Museum', variant: 'secondary' },
  viewpoint: { label: 'Viewpoint', variant: 'accent' },
  restaurant: { label: 'Restaurant', variant: 'warning' },
  park: { label: 'Park', variant: 'success' },
  religious: { label: 'Religious', variant: 'primary' },
  other: { label: 'Other', variant: 'primary' },
};

interface POICardProps {
  poi: POI;
  isSelected: boolean;
  onToggle: (poi: POI) => void;
}

export function POICard({ poi, isSelected, onToggle }: POICardProps) {
  const categoryConfig = CATEGORY_CONFIG[poi.category] || CATEGORY_CONFIG.other;

  return (
    <motion.div
      className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <div className={styles.cardHeader}>
        <div className={styles.cardInfo}>
          <h4 className={styles.name}>{poi.name}</h4>
          <Badge variant={categoryConfig.variant}>{categoryConfig.label}</Badge>
        </div>
        <button
          className={`${styles.toggleBtn} ${isSelected ? styles.toggleBtnActive : ''}`}
          onClick={() => onToggle(poi)}
          aria-label={isSelected ? 'Remove from itinerary' : 'Add to itinerary'}
        >
          {isSelected ? <Check size={16} /> : <Plus size={16} />}
        </button>
      </div>

      <div className={styles.details}>
        <div className={styles.detail}>
          <Star size={14} fill="var(--color-warning)" color="var(--color-warning)" />
          <span>{poi.rating}</span>
        </div>
        <div className={styles.detail}>
          <Clock size={14} />
          <span>{poi.open_time} — {poi.close_time}</span>
        </div>
        <div className={styles.detail}>
          <IndianRupee size={14} />
          <span>{poi.estimated_cost === 0 ? 'Free' : `₹${poi.estimated_cost}`}</span>
        </div>
      </div>
    </motion.div>
  );
}
