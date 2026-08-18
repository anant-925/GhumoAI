'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock, MapPin, ArrowLeft, Save, IndianRupee } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import type { POI, CreateTripRequest } from '@/lib/types';
import styles from './ItineraryTimeline.module.css';

interface ItineraryTimelineProps {
  pois: POI[];
  tripData: Partial<CreateTripRequest>;
  onBack: () => void;
}

export function ItineraryTimeline({ pois, tripData, onBack }: ItineraryTimelineProps) {
  const router = useRouter();

  const totalCost = pois.reduce((sum, p) => sum + p.estimated_cost, 0);

  const handleSave = () => {
    // In real mode, this would call createTrip API
    // For now, navigate to the trip dashboard with mock ID
    router.push('/trip/trip-delhi-jaipur-001');
  };

  if (pois.length === 0) {
    return (
      <EmptyState
        title="No places selected"
        description="Go back and select some places to visit."
        action={
          <Button variant="secondary" onClick={onBack} icon={<ArrowLeft size={16} />}>
            Go Back
          </Button>
        }
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Your <span className="text-gradient">Itinerary</span>
        </h2>
        <p className={styles.subtitle}>
          {tripData.source} → {tripData.destination} · {tripData.days} {(tripData.days || 0) === 1 ? 'day' : 'days'}
        </p>
      </div>

      {/* Summary */}
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <MapPin size={16} />
          <span>{pois.length} places</span>
        </div>
        <div className={styles.summaryItem}>
          <IndianRupee size={16} />
          <span>₹{totalCost.toLocaleString('en-IN')} entry fees</span>
        </div>
        <div className={styles.summaryItem}>
          <Clock size={16} />
          <span>~{pois.length * 1.5} hours</span>
        </div>
      </div>

      {/* Timeline */}
      <div className={styles.timeline}>
        {pois.map((poi, index) => (
          <motion.div
            key={poi.id}
            className={styles.timelineItem}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={styles.timelineLine}>
              <div className={styles.timelineDot} />
              {index < pois.length - 1 && <div className={styles.timelineConnector} />}
            </div>

            <div className={styles.timelineContent}>
              <div className={styles.timelineHeader}>
                <div className={styles.timelineTime}>
                  {poi.estimated_arrival || `${9 + Math.floor(index * 1.5)}:${index % 2 === 0 ? '00' : '30'}`}
                </div>
                <Badge variant="primary">Stop {index + 1}</Badge>
              </div>
              <h4 className={styles.timelineName}>{poi.name}</h4>
              <div className={styles.timelineDetails}>
                <span>{poi.open_time} — {poi.close_time}</span>
                <span>·</span>
                <span>{poi.estimated_cost === 0 ? 'Free entry' : `₹${poi.estimated_cost}`}</span>
              </div>
              {index < pois.length - 1 && (
                <div className={styles.travelTime}>
                  ~20 min travel to next stop
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <Button variant="ghost" onClick={onBack} icon={<ArrowLeft size={16} />}>
          Back
        </Button>
        <Button
          variant="primary"
          size="lg"
          icon={<Save size={18} />}
          onClick={handleSave}
        >
          Save & Start Trip
        </Button>
      </div>
    </div>
  );
}
