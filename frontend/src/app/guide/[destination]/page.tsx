'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getGuide } from '@/lib/api/guide';
import { GuideArticle } from '@/components/guide/GuideArticle';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import styles from './guide.module.css';

export default function GuidePage({ params }: { params: Promise<{ destination: string }> }) {
  const { destination } = use(params);
  const decodedDest = decodeURIComponent(destination);
  const { data: guide, isLoading, error, refetch } = useQuery({
    queryKey: ['guide', decodedDest],
    queryFn: () => getGuide(decodedDest),
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={styles.heroTitle}>{decodedDest}</h1>
          <p className={styles.heroSubtitle}>Virtual Tourism Guide</p>
          {guide?.generated_at && (
            <div className={styles.heroMeta}>
              <Clock size={14} />
              <span>Generated {new Date(guide.generated_at).toLocaleDateString()}</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Content */}
      <div className="container">
        <div className={styles.layout}>
          <motion.div
            className={styles.articleColumn}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {guide?.content_markdown && (
              <GuideArticle markdown={guide.content_markdown} />
            )}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          className={styles.cta}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className={styles.ctaTitle}>
            Ready to explore {decodedDest}?
          </h3>
          <Link href="/plan">
            <Button variant="primary" size="lg" icon={<ArrowRight size={18} />}>
              Plan a Trip to {decodedDest}
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
