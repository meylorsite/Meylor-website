import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getLocalizedField(item: any, field: string, locale: string): string {
  const key = locale === 'ar' ? `${field}Ar` : `${field}En`;
  return item?.[key]
  return new Date(date).toLoSA' : 'en-US', {
    year: 'numeric',

    day: 'numeric',
  });
}
