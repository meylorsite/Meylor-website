'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import toast from 'react-hot-toast';
import { Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const { locale } = useParams() as { locale: string };
  const router = useRouter();
  const { login, user, isLoading, initAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(`/${locale}/admin`);
    }
  }, [isLoading, user, router, locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      router.push(`/${locale}/admin`);
      toast.success('Welcome back!');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
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
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to manage your school</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
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
              placeholder="Password"
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
