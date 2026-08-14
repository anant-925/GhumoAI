'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, IndianRupee, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { CreateTripRequest } from '@/lib/types';
import styles from './TripForm.module.css';

interface TripFormProps {
  initialData: Partial<CreateTripRequest>;
  onSubmit: (data: Partial<CreateTripRequest>) => void;
}

export function TripForm({ initialData, onSubmit }: TripFormProps) {
  const [source, setSource] = useState(initialData.source || '');
  const [destination, setDestination] = useState(initialData.destination || '');
  const [budget, setBudget] = useState(initialData.budget || 5000);
  const [days, setDays] = useState(initialData.days || 2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ source, destination, budget, days });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.formContainer}
    >
      <div className={styles.formHeader}>
        <h2 className={styles.title}>
          Where do you want to <span className="text-gradient">explore?</span>
        </h2>
        <p className={styles.subtitle}>
          Tell us about your trip and we&apos;ll find the best places for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Source */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <MapPin size={16} />
            Starting from
          </label>
          <input
            id="trip-source"
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g. Delhi"
            className={styles.input}
            required
          />
        </div>

        {/* Destination */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <MapPin size={16} />
            Going to
          </label>
          <input
            id="trip-destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Jaipur"
            className={styles.input}
            required
          />
        </div>

        {/* Budget Slider */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <IndianRupee size={16} />
            Budget
          </label>
          <div className={styles.sliderRow}>
            <input
              id="trip-budget"
              type="range"
              min={500}
              max={50000}
              step={500}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className={styles.slider}
            />
            <span className={styles.sliderValue}>₹{budget.toLocaleString('en-IN')}</span>
          </div>
          <div className={styles.sliderMarks}>
            <span>₹500</span>
            <span>₹50,000</span>
          </div>
        </div>

        {/* Day Counter */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <Calendar size={16} />
            Duration
          </label>
          <div className={styles.counter}>
            <button
              type="button"
              className={styles.counterBtn}
              onClick={() => setDays(Math.max(1, days - 1))}
            >
              −
            </button>
            <span className={styles.counterValue}>
              {days} {days === 1 ? 'day' : 'days'}
            </span>
            <button
              type="button"
              className={styles.counterBtn}
              onClick={() => setDays(Math.min(14, days + 1))}
            >
              +
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          icon={<ArrowRight size={18} />}
          className={styles.submitBtn}
        >
          Choose Transport
        </Button>
      </form>
    </motion.div>
  );
}
