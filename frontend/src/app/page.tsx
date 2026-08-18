'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin,
  Route,
  Wallet,
  BookOpen,
  ArrowRight,
  Compass,
  Sparkles,
  Clock,
  TrendingUp,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import styles from './page.module.css';

const FEATURES = [
  {
    icon: <MapPin size={24} />,
    title: 'Smart POI Discovery',
    description: 'AI discovers the best places to visit near your destination, filtered by budget and open hours.',
    color: 'var(--color-brand-primary)',
  },
  {
    icon: <Route size={24} />,
    title: 'Optimized Sequencing',
    description: 'OR-Tools powered visit ordering respects time windows, travel time, and opening hours.',
    color: 'var(--color-brand-secondary)',
  },
  {
    icon: <Wallet size={24} />,
    title: 'Live Budget Tracking',
    description: 'Track every rupee in real-time. Get alerts before you overspend on your trip.',
    color: 'var(--color-brand-accent)',
  },
  {
    icon: <BookOpen size={24} />,
    title: 'Virtual Guide',
    description: 'AI-generated cultural guides with history, cuisine tips, and insider knowledge.',
    color: 'var(--color-success)',
  },
];

const STEPS = [
  { icon: <Compass size={20} />, title: 'Enter', description: 'Source, destination, budget & days' },
  { icon: <Sparkles size={20} />, title: 'Discover', description: 'AI finds the best places for you' },
  { icon: <Clock size={20} />, title: 'Sequence', description: 'Smart ordering with time windows' },
  { icon: <TrendingUp size={20} />, title: 'Track', description: 'Monitor budget in real-time' },
];

const DESTINATIONS = [
  { name: 'Jaipur', tagline: 'The Pink City', rating: 4.7, emoji: '🏰' },
  { name: 'Varanasi', tagline: 'City of Light', rating: 4.6, emoji: '🕉️' },
  { name: 'Goa', tagline: 'Beach Paradise', rating: 4.5, emoji: '🏖️' },
  { name: 'Manali', tagline: 'Mountain Escape', rating: 4.7, emoji: '🏔️' },
  { name: 'Kerala', tagline: 'God\'s Own Country', rating: 4.8, emoji: '🌴' },
  { name: 'Udaipur', tagline: 'City of Lakes', rating: 4.6, emoji: '🏛️' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function LandingPage() {
  return (
    <>
      {/* ====== HERO ====== */}
      <section className={styles.hero}>
        {/* Animated background elements */}
        <div className={styles.heroGlow} />
        <div className={styles.heroGrid} />
        <div className={styles.particles}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={styles.particle}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
              }}
            />
          ))}
        </div>

        <motion.div
          className={`container ${styles.heroContent}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className={styles.heroBadge}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles size={14} />
            <span>AI-Powered Travel Planning</span>
          </motion.div>

          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Your Smart Travel
            <br />
            Companion for{' '}
            <span className="text-gradient">India</span>
          </motion.h1>

          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            Plan smarter trips with AI-powered itineraries, budget-aware POI discovery,
            optimized visit sequencing, and cultural guides — all in one place.
          </motion.p>

          <motion.div
            className={styles.heroCTA}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link href="/plan">
              <Button variant="primary" size="lg" icon={<ArrowRight size={18} />}>
                Plan My Trip
              </Button>
            </Link>
            <Link href="/guide/Jaipur">
              <Button variant="secondary" size="lg">
                Explore Guides
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className={styles.heroStats}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className={styles.stat}>
              <span className={styles.statValue}>50+</span>
              <span className={styles.statLabel}>Destinations</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>1000+</span>
              <span className={styles.statLabel}>POIs Indexed</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>₹0</span>
              <span className={styles.statLabel}>Free to Use</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ====== FEATURES ====== */}
      <section className={`section ${styles.features}`}>
        <div className="container">
          <motion.div
            className="section-header"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.h2 variants={itemVariants}>
              Everything You Need to{' '}
              <span className="text-gradient">Travel Smart</span>
            </motion.h2>
            <motion.p variants={itemVariants}>
              Powered by AI and real-time data, GhumoAI handles the complexity so you can focus on the experience.
            </motion.p>
          </motion.div>

          <motion.div
            className={styles.featureGrid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {FEATURES.map((feature) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <Card padding="lg">
                  <div
                    className={styles.featureIcon}
                    style={{ background: `${feature.color}15`, color: feature.color }}
                  >
                    {feature.icon}
                  </div>
                  <h4 className={styles.featureTitle}>{feature.title}</h4>
                  <p className={styles.featureDesc}>{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section className={`section ${styles.howItWorks}`}>
        <div className="container">
          <motion.div
            className="section-header"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.h2 variants={itemVariants}>
              How It <span className="text-gradient">Works</span>
            </motion.h2>
            <motion.p variants={itemVariants}>
              From idea to itinerary in four simple steps.
            </motion.p>
          </motion.div>

          <motion.div
            className={styles.stepsGrid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {STEPS.map((step, i) => (
              <motion.div key={step.title} variants={itemVariants} className={styles.stepItem}>
                <div className={styles.stepNumber}>{i + 1}</div>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h5 className={styles.stepTitle}>{step.title}</h5>
                <p className={styles.stepDesc}>{step.description}</p>
                {i < STEPS.length - 1 && <div className={styles.stepConnector} />}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====== DEMO DESTINATIONS ====== */}
      <section className={`section ${styles.destinations}`}>
        <div className="container">
          <motion.div
            className="section-header"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.h2 variants={itemVariants}>
              Popular <span className="text-gradient">Destinations</span>
            </motion.h2>
            <motion.p variants={itemVariants}>
              Explore the most loved destinations across India.
            </motion.p>
          </motion.div>

          <motion.div
            className={styles.destScroll}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {DESTINATIONS.map((dest) => (
              <motion.div key={dest.name} variants={itemVariants}>
                <Link href={`/guide/${dest.name}`}>
                  <motion.div
                    className={styles.destCard}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.destEmoji}>{dest.emoji}</div>
                    <h4 className={styles.destName}>{dest.name}</h4>
                    <p className={styles.destTagline}>{dest.tagline}</p>
                    <div className={styles.destRating}>
                      <Star size={14} fill="var(--color-warning)" color="var(--color-warning)" />
                      <span>{dest.rating}</span>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className={`section ${styles.cta}`}>
        <div className="container">
          <motion.div
            className={styles.ctaBox}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.ctaTitle}>
              Ready to explore India?
            </h2>
            <p className={styles.ctaDesc}>
              Start planning your dream trip with AI-powered insights, budget tracking, and cultural guides.
            </p>
            <Link href="/plan">
              <Button variant="primary" size="lg" icon={<ArrowRight size={18} />}>
                Start Planning — It&apos;s Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
