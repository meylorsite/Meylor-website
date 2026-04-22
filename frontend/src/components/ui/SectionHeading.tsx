'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import TextReveal from './TextReveal';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  label?: string;
  light?: boolean;
  align?: 'center' | 'left';
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  label,
  light,
  align = 'center',
  className,
}: SectionHeadingProps) {
  const isCenter = align === 'center';

  return (
    <div className={cn('mb-10', isCenter ? 'text-center' : 'text-start', className)}>
      {label && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className={cn('mb-3 flex items-center gap-3', isCenter && 'justify-center')}
        >
          <span className={cn('h-px w-8', light ? 'bg-accent' : 'bg-accent')} />
          <span
            className={cn(
              'text-xs font-semibold uppercase tracking-[0.2em]',
              light ? 'text-accent-light' : 'text-accent'
            )}
          >
            {label}
          </span>
        </motion.div>
      )}

      <TextReveal
        as="h2"
        className={cn(
          'text-2xl font-bold tracking-tight md:text-3xl lg:text-[2.25rem]',
          light ? 'text-white' : 'text-gray-900',
          isCenter && 'justify-center'
        )}
        delay={0.1}
      >
        {title}
      </TextReveal>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={cn('mt-3 text-base', light ? 'text-white/60' : 'text-gray-500')}
        >
          {subtitle}
        </motion.p>
      )}

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
        className={cn('mt-4 flex items-center gap-1', isCenter ? 'justify-center' : 'justify-start')}
        style={{ transformOrigin: isCenter ? 'center' : 'left' }}
      >
        <span className="h-[2px] w-8 rounded-full bg-accent" />
        <span className="h-[2px] w-4 rounded-full bg-amber" />
      </motion.div>
    </div>
  );
}
