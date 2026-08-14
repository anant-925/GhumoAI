'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Car } from 'lucide-react';
import { useTrip } from '@/hooks/useTrip';
import { useExpenses } from '@/hooks/useExpenses';
import { usePOIs } from '@/hooks/usePOIs';
import { ItineraryTimeline } from '@/components/trip/ItineraryTimeline';
import { BudgetMeter } from '@/components/expense/BudgetMeter';
import { ExpenseTracker } from '@/components/expense/ExpenseTracker';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import styles from './trip.module.css';

export default function TripDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: trip, isLoading: tripLoading, error: tripError } = useTrip(id);
  const { data: expenses, isLoading: expLoading } = useExpenses(id);
  const { data: pois } = usePOIs(id);

  if (tripLoading) return <Spinner />;
  if (tripError) return <ErrorState />;

  return (
    <div className={styles.dashboard}>
      <div className="container">
        {/* Trip Header */}
        <motion.div
          className={styles.tripHeader}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={styles.tripTitle}>
            {trip?.source} → {trip?.destination}
          </h1>
          <div className={styles.tripMeta}>
            <span className={styles.metaItem}>
              <Calendar size={16} />
              {trip?.days} {(trip?.days || 0) === 1 ? 'day' : 'days'}
            </span>
            <span className={styles.metaItem}>
              <Car size={16} />
              {trip?.transport_mode?.replace('_', ' ')}
            </span>
            <span className={styles.metaItem}>
              <MapPin size={16} />
              {pois?.length || 0} places
            </span>
          </div>
        </motion.div>

        {/* Main Layout */}
        <div className={styles.layout}>
          {/* Left — Itinerary */}
          <motion.div
            className={styles.leftColumn}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className={styles.sectionTitle}>Itinerary</h3>
            {pois && pois.length > 0 ? (
              <ItineraryTimeline
                pois={pois}
                tripData={{ source: trip?.source, destination: trip?.destination, days: trip?.days }}
                onBack={() => {}}
              />
            ) : (
              <p className={styles.noData}>No itinerary items yet.</p>
            )}
          </motion.div>

          {/* Right — Budget + Expenses */}
          <motion.div
            className={styles.rightColumn}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Budget Meter */}
            <div className={styles.budgetSection}>
              <h3 className={styles.sectionTitle}>Budget</h3>
              {expLoading ? (
                <Spinner size={24} />
              ) : expenses ? (
                <BudgetMeter
                  totalSpent={expenses.total_spent}
                  totalBudget={expenses.total_budget}
                  remaining={expenses.remaining}
                />
              ) : null}
            </div>

            {/* Expense Tracker */}
            <div className={styles.expenseSection}>
              <h3 className={styles.sectionTitle}>Expenses</h3>
              <ExpenseTracker tripId={id} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
