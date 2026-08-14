'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Star, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getStopovers } from '@/lib/api/stopovers';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Stopover } from '@/lib/types';
import styles from './stopovers.module.css';

export default function StopoversPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: stopovers, isLoading, error, refetch } = useQuery({
    queryKey: ['stopovers', id],
    queryFn: () => getStopovers(id),
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <Link href={`/trip/${id}`}>
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={16} />}>
              Back to Trip
            </Button>
          </Link>
          <h1 className={styles.title}>
            Stopovers <span className="text-gradient">Along the Way</span>
          </h1>
          <p className={styles.subtitle}>
            Interesting places near your route where you can stop and rest.
          </p>
        </div>

        {!stopovers || stopovers.length === 0 ? (
          <EmptyState
            title="No stopovers found"
            description="No interesting places found along this route."
          />
        ) : (
          <div className={styles.grid}>
            {stopovers.map((stopover: Stopover, index: number) => (
              <motion.div
                key={stopover.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card padding="lg">
                  <div className={styles.cardHeader}>
                    <div>
                      <h3 className={styles.cardTitle}>{stopover.name}</h3>
                      <div className={styles.distance}>
                        <Navigation size={14} />
                        <span>{stopover.distance_from_route_km} km from route</span>
                      </div>
                    </div>
                    <Badge variant="accent">
                      <MapPin size={12} />
                      Stopover
                    </Badge>
                  </div>

                  {stopover.nearby_stays.length > 0 && (
                    <div className={styles.stays}>
                      <h5 className={styles.staysTitle}>Nearby Stays</h5>
                      {stopover.nearby_stays.map((stay, i) => (
                        <div key={i} className={styles.stayItem}>
                          <div className={styles.stayInfo}>
                            <span className={styles.stayName}>{stay.name}</span>
                            <div className={styles.stayMeta}>
                              <span className={styles.stayRating}>
                                <Star size={12} fill="var(--color-warning)" color="var(--color-warning)" />
                                {stay.rating}
                              </span>
                              <span className={styles.stayPrice}>
                                ₹{stay.price_per_night.toLocaleString('en-IN')}/night
                              </span>
                            </div>
                          </div>
                          {stay.booking_url && (
                            <a href={stay.booking_url} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="sm" icon={<ExternalLink size={14} />}>
                                Book
                              </Button>
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
