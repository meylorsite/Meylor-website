'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Send, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { publicApi } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';

interface ReviewFormModalProps {
  open: boolean;
  onClose: () => void;
  locale: string;
}

export default function ReviewFormModal({ open, onClose, locale }: ReviewFormModalProps) {
  const isAr = locale === 'ar';
  const { user } = useAuthStore();

  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [role, setRole] = useState('Parent');
  const [contentEn, setContentEn] = useState('');
  const [contentAr, setContentAr] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const roleOptions = [
    { value: 'Parent', en: 'Parent', ar: 'ولي أمر' },
    { value: 'Student', en: 'Student', ar: 'طالب' },
    { value: 'Alumni', en: 'Alumni', ar: 'خريج' },
    { value: 'Teacher', en: 'Teacher', ar: 'معلم' },
    { value: 'Visitor', en: 'Visitor', ar: 'زائر' },
  ];

  const reset = () => {
    setNameEn('');
    setNameAr('');
    setRole('Parent');
    setContentEn('');
    setContentAr('');
    setRating(5);
    setEmail('');
    setSuccess(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const primaryName = (isAr ? nameAr : nameEn).trim() || nameEn.trim() || nameAr.trim();
    const primaryContent = (isAr ? contentAr : contentEn).trim() || contentEn.trim() || contentAr.trim();

    if (!primaryName) {
      toast.error(isAr ? 'الاسم مطلوب' : 'Name is required');
      return;
    }
    if (primaryContent.length < 10) {
      toast.error(isAr ? 'يجب أن تكون المراجعة 10 أحرف على الأقل' : 'Review must be at least 10 characters');
      return;
    }

    const roleOpt = roleOptions.find((r) => r.value === role);

    setLoading(true);
    try {
      await publicApi.submitTestimonial({
        nameEn: nameEn.trim() || primaryName,
        nameAr: nameAr.trim(),
        roleEn: roleOpt?.en || role,
        roleAr: roleOpt?.ar || role,
        contentEn: contentEn.trim() || primaryContent,
        contentAr: contentAr.trim(),
        rating,
        email: email.trim() || user?.email || '',
      });
      setSuccess(true);
    } catch (err: any) {
      toast.error(err.message || (isAr ? 'فشل الإرسال' : 'Submission failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
              dir={isAr ? 'rtl' : 'ltr'}
            >
              <button
                type="button"
                onClick={handleClose}
                className={`absolute top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 ${isAr ? 'left-4' : 'right-4'}`}
                title={isAr ? 'إغلاق' : 'Close'}
              >
                <X className="h-5 w-5" />
              </button>

              {success ? (
                <div className="p-8 text-center">
                  <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
                  <h3 className="mt-4 text-xl font-bold text-gray-900">
                    {isAr ? 'شكراً لك!' : 'Thank You!'}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {isAr
                      ? 'تم استلام مراجعتك بنجاح. ستظهر على الموقع بعد مراجعتها من الفريق الإداري.'
                      : 'Your review has been received. It will appear on the site after admin approval.'}
                  </p>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
                  >
                    {isAr ? 'تم' : 'Done'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="max-h-[85vh] overflow-y-auto p-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {isAr ? 'شارك تجربتك' : 'Share Your Experience'}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {isAr
                      ? 'سيتم نشر مراجعتك بعد مراجعتها من الإدارة'
                      : 'Your review will be published after admin approval'}
                  </p>

                  <div className="mt-5 space-y-4">
                    {/* Rating */}
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {isAr ? 'التقييم' : 'Rating'}
                      </label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setRating(n)}
                            onMouseEnter={() => setHoverRating(n)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1"
                            title={`${n} / 5`}
                          >
                            <Star
                              className={`h-7 w-7 transition-colors ${
                                n <= (hoverRating || rating) ? 'fill-amber text-amber' : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ms-2 text-sm text-gray-500">{rating}/5</span>
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label htmlFor="rev-name-en" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {isAr ? 'الاسم' : 'Your Name'} <span className="text-danger">*</span>
                      </label>
                      <input
                        id="rev-name-en"
                        type="text"
                        required
                        value={isAr ? nameAr : nameEn}
                        onChange={(e) => (isAr ? setNameAr(e.target.value) : setNameEn(e.target.value))}
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
                        placeholder={isAr ? 'مثال: أحمد الراشد' : 'e.g. Ahmad Al-Rashid'}
                        maxLength={80}
                      />
                    </div>

                    {/* Role */}
                    <div>
                      <label htmlFor="rev-role" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {isAr ? 'أنت' : 'You are a'}
                      </label>
                      <select
                        id="rev-role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
                      >
                        {roleOptions.map((r) => (
                          <option key={r.value} value={r.value}>
                            {isAr ? r.ar : r.en}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Review content */}
                    <div>
                      <label htmlFor="rev-content" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {isAr ? 'المراجعة' : 'Your Review'} <span className="text-danger">*</span>
                      </label>
                      <textarea
                        id="rev-content"
                        required
                        rows={4}
                        value={isAr ? contentAr : contentEn}
                        onChange={(e) => (isAr ? setContentAr(e.target.value) : setContentEn(e.target.value))}
                        className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
                        placeholder={
                          isAr ? 'شاركنا تجربتك مع مدرسة ميلور...' : 'Tell us about your experience with MEYLOR...'
                        }
                        maxLength={500}
                      />
                      <p className="mt-1 text-xs text-gray-400">
                        {(isAr ? contentAr : contentEn).length}/500
                      </p>
                    </div>

                    {/* Email (optional) */}
                    <div>
                      <label htmlFor="rev-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {isAr ? 'البريد الإلكتروني (اختياري)' : 'Email (optional)'}
                      </label>
                      <input
                        id="rev-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
                        placeholder={isAr ? 'لن يظهر للعامة' : "We won't display this publicly"}
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                      {loading
                        ? isAr ? 'جارِ الإرسال...' : 'Submitting...'
                        : isAr ? 'إرسال المراجعة' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
