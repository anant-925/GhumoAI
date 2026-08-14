'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingDown, TrendingUp, Award, MapPin } from 'lucide-react';
import Link from 'next/link';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useExpenses } from '@/hooks/useExpenses';
import { usePOIs } from '@/hooks/usePOIs';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import styles from './analytics.module.css';

const CATEGORY_COLORS: Record<string, string> = {
  transport: '#06B6D4',
  food: '#F59E0B',
  stay: '#7C3AED',
  entry_fee: '#FF6B35',
  misc: '#8B8BA7',
};

const CATEGORY_LABELS: Record<string, string> = {
  transport: 'Transport',
  food: 'Food',
  stay: 'Stay',
  entry_fee: 'Entry Fee',
  misc: 'Misc',
};

export default function AnalyticsPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = use(params);
  const { data: expenses, isLoading, error, refetch } = useExpenses(tripId);
  const { data: pois } = usePOIs(tripId);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorState onRetry={() => refetch()} />;
  if (!expenses) return null;

  const pieData = Object.entries(expenses.by_category)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({
      name: CATEGORY_LABELS[key] || key,
      value,
      color: CATEGORY_COLORS[key] || '#8B8BA7',
    }));

  const barData = [
    { name: 'Day 1', spent: Math.round(expenses.total_spent * 0.6), budget: Math.round(expenses.total_budget / 2) },
    { name: 'Day 2', spent: Math.round(expenses.total_spent * 0.4), budget: Math.round(expenses.total_budget / 2) },
  ];

  const mostExpensiveCategory = Object.entries(expenses.by_category).reduce((a, b) =>
    a[1] > b[1] ? a : b
  );

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <Link href={`/trip/${tripId}`}>
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={16} />}>
              Back to Trip
            </Button>
          </Link>
          <h1 className={styles.title}>
            Trip <span className="text-gradient">Analytics</span>
          </h1>
        </div>

        {/* Summary Stats */}
        <motion.div
          className={styles.statsGrid}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card padding="md">
            <div className={styles.statIcon} style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--color-success)' }}>
              <TrendingDown size={20} />
            </div>
            <div className={styles.statValue}>₹{expenses.remaining.toLocaleString('en-IN')}</div>
            <div className={styles.statLabel}>Saved</div>
          </Card>
          <Card padding="md">
            <div className={styles.statIcon} style={{ background: 'rgba(255, 107, 53, 0.1)', color: 'var(--color-brand-primary)' }}>
              <TrendingUp size={20} />
            </div>
            <div className={styles.statValue}>₹{expenses.total_spent.toLocaleString('en-IN')}</div>
            <div className={styles.statLabel}>Total Spent</div>
          </Card>
          <Card padding="md">
            <div className={styles.statIcon} style={{ background: 'rgba(124, 58, 237, 0.1)', color: 'var(--color-brand-secondary)' }}>
              <Award size={20} />
            </div>
            <div className={styles.statValue}>{CATEGORY_LABELS[mostExpensiveCategory[0]]}</div>
            <div className={styles.statLabel}>Most Expensive</div>
          </Card>
          <Card padding="md">
            <div className={styles.statIcon} style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--color-brand-accent)' }}>
              <MapPin size={20} />
            </div>
            <div className={styles.statValue}>{pois?.length || 0}</div>
            <div className={styles.statLabel}>Places Visited</div>
          </Card>
        </motion.div>

        {/* Charts */}
        <div className={styles.chartsGrid}>
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card padding="lg">
              <h3 className={styles.chartTitle}>Spend by Category</h3>
              <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'var(--color-bg-elevated)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--color-text-primary)',
                      }}
                      formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className={styles.legend}>
                  {pieData.map((entry) => (
                    <div key={entry.name} className={styles.legendItem}>
                      <div className={styles.legendDot} style={{ background: entry.color }} />
                      <span>{entry.name}</span>
                      <span className={styles.legendValue}>₹{entry.value.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card padding="lg">
              <h3 className={styles.chartTitle}>Daily Spend vs Budget</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData} barGap={8}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                    axisLine={{ stroke: 'var(--color-border)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                    axisLine={{ stroke: 'var(--color-border)' }}
                    tickLine={false}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--color-text-primary)',
                    }}
                    formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                  />
                  <Bar dataKey="spent" fill="#FF6B35" radius={[6, 6, 0, 0]} name="Spent" />
                  <Bar dataKey="budget" fill="#7C3AED" radius={[6, 6, 0, 0]} opacity={0.4} name="Budget" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
