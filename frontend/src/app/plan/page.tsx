'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TripForm } from '@/components/trip/TripForm';
import { TransportSelector } from '@/components/trip/TransportSelector';
import { POIDiscovery } from '@/components/trip/POIDiscovery';
import { ItineraryTimeline } from '@/components/trip/ItineraryTimeline';
import type { CreateTripRequest, TransportMode, POI } from '@/lib/types';
import styles from './plan.module.css';

const STEPS = ['Trip Details', 'Transport', 'Discover POIs', 'Your Itinerary'];

export default function PlanPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [tripData, setTripData] = useState<Partial<CreateTripRequest>>({});
  const [tripId, setTripId] = useState<string>('trip-delhi-jaipur-001'); // mock ID
  const [selectedPOIs, setSelectedPOIs] = useState<POI[]>([]);
  const [orderedPOIs, setOrderedPOIs] = useState<POI[]>([]);

  const handleTripSubmit = (data: Partial<CreateTripRequest>) => {
    setTripData(data);
    setCurrentStep(1);
  };

  const handleTransportSelect = (mode: TransportMode) => {
    setTripData((prev) => ({ ...prev, transport_mode: mode }));
    setCurrentStep(2);
  };

  const handlePOIsSelected = (pois: POI[]) => {
    setSelectedPOIs(pois);
  };

  const handlePOIsOrdered = (pois: POI[]) => {
    setOrderedPOIs(pois);
    setCurrentStep(3);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className={styles.planPage}>
      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <div className="container">
          <div className={styles.steps}>
            {STEPS.map((step, i) => (
              <div
                key={step}
                className={`${styles.step} ${i <= currentStep ? styles.stepActive : ''} ${i < currentStep ? styles.stepCompleted : ''}`}
              >
                <div className={styles.stepDot}>
                  {i < currentStep ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                <span className={styles.stepLabel}>{step}</span>
                {i < STEPS.length - 1 && <div className={styles.stepLine} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="container">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
            className={styles.stepContent}
          >
            {currentStep === 0 && (
              <TripForm
                initialData={tripData}
                onSubmit={handleTripSubmit}
              />
            )}
            {currentStep === 1 && (
              <TransportSelector
                tripId={tripId}
                onSelect={handleTransportSelect}
                onBack={handleBack}
              />
            )}
            {currentStep === 2 && (
              <POIDiscovery
                tripId={tripId}
                selectedPOIs={selectedPOIs}
                onPOIsChange={handlePOIsSelected}
                onGenerateItinerary={handlePOIsOrdered}
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <ItineraryTimeline
                pois={orderedPOIs.length > 0 ? orderedPOIs : selectedPOIs}
                tripData={tripData}
                onBack={handleBack}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
