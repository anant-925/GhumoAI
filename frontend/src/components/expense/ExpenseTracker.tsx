'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Car, UtensilsCrossed, Bed, Ticket, Package } from 'lucide-react';
import { useExpenses, useCreateExpense } from '@/hooks/useExpenses';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import type { ExpenseCategory } from '@/lib/types';
import styles from './ExpenseTracker.module.css';

const CATEGORY_CONFIG: Record<ExpenseCategory, { label: string; icon: React.ReactNode; color: string }> = {
  transport: { label: 'Transport', icon: <Car size={14} />, color: 'var(--color-brand-accent)' },
  food: { label: 'Food', icon: <UtensilsCrossed size={14} />, color: 'var(--color-warning)' },
  stay: { label: 'Stay', icon: <Bed size={14} />, color: 'var(--color-brand-secondary)' },
  entry_fee: { label: 'Entry Fee', icon: <Ticket size={14} />, color: 'var(--color-brand-primary)' },
  misc: { label: 'Misc', icon: <Package size={14} />, color: 'var(--color-text-secondary)' },
};

interface ExpenseTrackerProps {
  tripId: string;
}

export function ExpenseTracker({ tripId }: ExpenseTrackerProps) {
  const { data: expenses, isLoading } = useExpenses(tripId);
  const createMutation = useCreateExpense(tripId);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    await createMutation.mutateAsync({
      category,
      amount: Number(amount),
      description,
    });
    setAmount('');
    setDescription('');
    setShowForm(false);
  };

  if (isLoading) return <Spinner size={24} />;

  return (
    <div className={styles.tracker}>
      {/* Add Button */}
      <Button
        variant="secondary"
        size="sm"
        icon={<Plus size={14} />}
        onClick={() => setShowForm(!showForm)}
        className={styles.addBtn}
      >
        Add Expense
      </Button>

      {/* Add Expense Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            className={styles.form}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className={styles.categoryPicker}>
              {(Object.keys(CATEGORY_CONFIG) as ExpenseCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`${styles.categoryBtn} ${category === cat ? styles.categoryBtnActive : ''}`}
                  onClick={() => setCategory(cat)}
                  style={{ '--cat-color': CATEGORY_CONFIG[cat].color } as React.CSSProperties}
                >
                  {CATEGORY_CONFIG[cat].icon}
                  <span>{CATEGORY_CONFIG[cat].label}</span>
                </button>
              ))}
            </div>
            <input
              type="number"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={styles.input}
              required
              min={1}
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.input}
              required
            />
            <Button type="submit" variant="primary" size="sm" loading={createMutation.isPending}>
              Save
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Expense List */}
      <div className={styles.list}>
        {expenses?.expenses.map((expense) => {
          const config = CATEGORY_CONFIG[expense.category];
          return (
            <motion.div
              key={expense.id}
              className={styles.expenseItem}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.expenseIcon} style={{ background: `${config.color}15`, color: config.color }}>
                {config.icon}
              </div>
              <div className={styles.expenseInfo}>
                <span className={styles.expenseDesc}>{expense.description}</span>
                <span className={styles.expenseCat}>{config.label}</span>
              </div>
              <span className={styles.expenseAmount}>₹{expense.amount.toLocaleString('en-IN')}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
