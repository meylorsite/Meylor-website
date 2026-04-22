import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getLocalizedField(item: any, field: string, locale: string): string {
  const key = locale === 'ar' ? `${field}Ar` : `${field}En`;
  return item?.[key] || item?.[`${field}En`] || '';
}

export function getLocalizedArray(item: any, field: string, locale: string): string[] {
  const key = locale === 'ar' ? `${field}Ar` : `${field}En`;
  return item?.[key] || item?.[`${field}En`] || [];
}

export function formatDate(date: string | Date, locale: string): string {
  return new Date(date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
