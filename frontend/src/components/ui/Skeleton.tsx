import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} />;
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <Skeleton className="mb-4 h-48 w-full" />
      <Skeleton className="mb-2 h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-2/3" />
    </div>
  );
}
