'use client';

interface SectionDividerProps {
  variant: 'wave' | 'angle' | 'curve';
  fromColor?: string;
  toColor?: string;
  flip?: boolean;
  className?: string;
}

const paths = {
  wave: 'M0,40 C360,80 720,0 1080,50 C1260,70 1380,20 1440,40 L1440,80 L0,80 Z',
  angle: 'M0,0 L1440,60 L1440,80 L0,80 Z',
  curve: 'M0,0 Q720,100 1440,0 L1440,80 L0,80 Z',
};

export default function SectionDivider({
  variant,
  fromColor = 'transparent',
  toColor = 'white',
  flip,
  className,
}: SectionDividerProps) {
  return (
    <div
      className={className}
      style={{
        backgroundColor: fromColor,
        lineHeight: 0,
        transform: flip ? 'scaleY(-1)' : undefined,
        marginTop: '-1px',
        marginBottom: '-1px',
      }}
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="block h-[40px] w-full md:h-[60px] lg:h-[80px]"
      >
        <path d={paths[variant]} fill={toColor} />
      </svg>
    </div>
  );
}
