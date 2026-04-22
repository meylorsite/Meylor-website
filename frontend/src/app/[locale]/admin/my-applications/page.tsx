'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { ClipboardList, Clock, CheckCircle2, XCircle, ArrowRight, ArrowLeft, Plus } from 'lucide-react';

export default function MyApplicationsPage() {
  const { locale } = useParams() as { locale: string };
  const { user } = useAuthStore();
  const isAr = locale === 'ar';
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  // TODO: Fetch actual parent applications from API when endpoint is ready
  const applications: any[] = [];

  const statusConfig: Record<string, { icon: any; label: string; labelAr: string; color: string }> = {
    pending: { icon: Clock, label: 'Pending Review', labelAr: 'قيد المراجعة', color: 'bg-amber/10 text-amber' },
    reviewed: { icon: CheckCircle2, label: 'Under Review', labelAr: 'تحت المراجعة', color: 'bg-accent/10 text-accent' },
    accepted: { icon: CheckCircle2, label: 'Accepted', labelAr: 'مقبول', color: 'bg-success/10 text-success' },
    rejected: { icon: XCircle, label: 'Rejected', labelAr: 'مرفوض', color: 'bg-danger/10 text-danger' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{isAr ? 'طلبات التسجيل' : 'My Applications'}</h1>
          <p className="mt-1 text-sm text-gray-500">{isAr ? 'تتبع حالة طلبات تسجيل أبنائك' : 'Track your children\'s enrollment applications'}</p>
        </div>
        <Link
          href={`/${locale}/admissions`}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-dark"
        >
          <Plus className="h-4 w-4" />
          {isAr ? 'تقديم طلب جديد' : 'New Application'}
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
          <ClipboardList className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-bold text-gray-900">{isAr ? 'لا توجد طلبات بعد' : 'No Applications Yet'}</h3>
          <p className="mt-2 text-sm text-gray-400">
            {isAr ? 'قم بتقديم طلب تسجيل لأبنائك في مدرسة ميلور' : 'Submit an enrollment application for your children at MEYLOR School'}
          </p>
          <Link
            href={`/${locale}/admissions`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-dark"
          >
            {isAr ? 'ابدأ التسجيل' : 'Start Application'}
            <Arrow className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app: any, i: number) => {
            const status = statusConfig[app.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            return (
              <div key={i} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${status.color}`}>
                  <StatusIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900">{app.studentName}</p>
                  <p className="text-xs text-gray-400">{app.program} · {app.grade}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>
                  {isAr ? status.labelAr : status.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
