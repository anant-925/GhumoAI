'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Filter } from 'lucide-react';
import { usePOIs, useVisitOrder } from '@/hooks/usePOIs';
import { POICard } from './POICard';
import { Button } from '@/components/ui/Button';
import { SkeletonList } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import type { POI, POICategory } from '@/lib/types';
import styles from './POIDiscovery.module.css';

const CATEGORIES: { key: POICategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'monument', label: 'Monuments' },
  { key: 'museum', label: 'Museums' },
  { key: 'viewpoint', label: 'Viewpoints' },
  { key: 'religious', label: 'Religious' },
  { key: 'restaurant', label: 'Food' },
  { key: 'park', label: 'Parks' },
];

interface POIDiscoveryProps {
  tripId: string;
  selectedPOIs: POI[];
  onPOIsChange: (pois: POI[]) => void;
  onGenerateItinerary: (pois: POI[]) => void;
  onBack: () => void;
}

export function POIDiscovery({ tripId, selectedPOIs, onPOIsChange, onGenerateItinerary, onBack }: POIDiscoveryProps) {
  const { data: pois, isLoading, error, refetch } = usePOIs(tripId);
  const visitOrderMutation = useVisitOrder(tripId);
  const [activeCategory, setActiveCategory] = useState<POICategory | 'all'>('all');

  const filteredPOIs = pois?.filter(
    (poi) => activeCategory === 'all' || poi.category === activeCategory
  ) || [];

  const isSelected = (poi: POI) => selectedPOIs.some((p) => p.id === poi.id);

  const togglePOI = (poi: POI) => {
    if (isSelected(poi)) {
      onPOIsChange(selectedPOIs.filter((p) => p.id !== poi.id));
    } else {
      onPOIsChange([...selectedPOIs, poi]);
    }
  };

  const handleGenerate = async () => {
    if (selectedPOIs.length === 0) return;
    try {
      const ordered = await visitOrderMutation.mutateAsync({
        poi_ids: selectedPOIs.map((p) => p.id),
        start_time: '09:00',
      });
      onGenerateItinerary(ordered);
    } catch {
      // Error handled by mutation state
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Discover <span className="text-gradient">Places</span>
        </h2>
        <p className={styles.subtitle}>
          Select the places you want to visit. We&apos;ll optimize the visit order.
        </p>
      </div>

      {/* Category Filter */}
      <div className={styles.filters}>
        <Filter size={16} className={styles.filterIcon} />
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            className={`${styles.filterBtn} ${activeCategory === cat.key ? styles.filterBtnActive : ''}`}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* POI List */}
      <div className={styles.content}>
        {isLoading ? (
          <SkeletonList count={4} />
        ) : error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : filteredPOIs.length === 0 ? (
          <EmptyState
            title="No places found"
            description="Try adjusting the category filter or search radius."
          />
        ) : (
          <motion.div className={styles.poiList}>
            {filteredPOIs.map((poi) => (
              <POICard
                key={poi.id}
                poi={poi}
                isSelected={isSelected(poi)}
                onToggle={togglePOI}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <Button variant="ghost" onClick={onBack} icon={<ArrowLeft size={16} />}>
          Back
        </Button>
        <div className={styles.actionsRight}>
          <span className={styles.selectedCount}>
            {selectedPOIs.length} selected
          </span>
          <Button
            variant="primary"
            size="lg"
            icon={<Sparkles size={18} />}
            onClick={handleGenerate}
            loading={visitOrderMutation.isPending}
            disabled={selectedPOIs.length === 0}
          >
            Generate Itinerary
          </Button>
        </div>
      </div>
    </div>
  );
}
