'use client';

import { motion } from 'framer-motion';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function PageHero({ title, subtitle, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-primary py-14 md:py-20">
      {/* Geometric background pattern */}
      <div className="absolute inset-0">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-[#001a3d]" />

        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />

        {/* Large decorative circles */}
        <div className="absolute -right-32 -top-32 hidden h-96 w-96 rounded-full border border-white/[0.06] md:block" />
        <div className="absolute -right-20 -top-20 hidden h-72 w-72 rounded-full border border-white/[0.04] md:block" />
        <div className="absolute -bottom-40 -left-40 hidden h-[500px] w-[500px] rounded-full border border-white/[0.05] md:block" />
        <div className="absolute -bottom-28 -left-28 hidden h-80 w-80 rounded-full border border-white/[0.03] md:block" />

        {/* Accent glow spots */}
        <div className="absolute right-1/4 top-1/3 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-amber/10 blur-3xl" />

        {/* Diagonal lines */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-lines" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="40" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-lines)" />
        </svg>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" className="w-full text-white" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,40 C480,70 960,10 1440,40 L1440,60 L0,60 Z" />
        </svg>
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white md:text-4xl lg:text-5xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mx-auto mt-4 max-w-2xl text-base text-white/70 md:text-lg"
          >
            {subtitle}
          </motion.p>
        )}
        {children}
      </div>
    </section>
  );
}
