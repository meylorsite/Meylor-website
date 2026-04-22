'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import toast from 'react-hot-toast';
import { Lock, Mail } from 'lucide-react';

const destinationForRole = (role?: string) => {
  if (role === 'PARENT' || role === 'STUDENT') return '/admin/portal';
  return '/admin';
};

export default function LoginPage() {
  const { locale } = useParams() as { locale: string };
  const router = useRouter();
  const { login, user, isLoading, initAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isAr = locale === 'ar';

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(`/${locale}${destinationForRole(user.role)}`);
    }
  }, [isLoading, user, router, locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      const role = loggedInUser?.role || useAuthStore.getState().user?.role;
      router.push(`/${locale}${destinationForRole(role)}`);
      toast.success(isAr ? 'مرحباً بعودتك!' : 'Welcome back!');
    } catch (err: any) {
      toast.error(err.message || (isAr ? 'فشل تسجيل الدخول' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary to-[#001a3d] p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex justify-center">
            <Image
              src="/images/logo.png"
              alt="MEYLOR International School"
              width={200}
              height={56}
              className="h-14 w-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAr ? 'تسجيل الدخول' : 'Sign In'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isAr
              ? 'مرحباً بك في ميلور — سجّل دخولك للمتابعة'
              : 'Welcome to MEYLOR — sign in to continue'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder={isAr ? 'البريد الإلكتروني' : 'Email'}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-10"
              dir="ltr"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder={isAr ? 'كلمة المرور' : 'Password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-10"
              dir="ltr"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? (isAr ? 'جارِ تسجيل الدخول...' : 'Signing in...') : (isAr ? 'تسجيل الدخول' : 'Sign In')}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          {isAr
            ? 'أولياء الأمور والطلاب والإداريون يدخلون من هنا'
            : 'Parents, students, and administrators sign in here'}
        </p>
      </div>
    </div>
  );
}
