'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextRevealProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export default function TextReveal({
  children,
  as: Tag = 'h2',
  className,
  delay = 0,
  staggerDelay = 0.04,
}: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const words = children.split(' ');

  return (
    <Tag ref={ref} className={cn('flex flex-wrap', className)}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.15em]">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={isInView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.4, 0.25, 1],
              delay: delay + i * staggerDelay,
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}
