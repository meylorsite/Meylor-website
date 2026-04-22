'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, Package, FileText, User, GraduationCap, ClipboardCheck, Loader2, CheckCircle, Star } from 'lucide-react';
import { publicApi } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { getLocalizedField, getLocalizedArray } from '@/lib/utils';
import toast from 'react-hot-toast';

// ─── Types ───────────────────────────────────────────────
interface ParentInfo {
  parentName: string;
  email: string;
  phone: string;
  relationship: string;
  nationality: string;
  nationalId: string;
}

interface StudentInfo {
  studentNameEn: string;
  studentNameAr: string;
  dateOfBirth: string;
  gender: string;
  currentGrade: string;
  previousSchool: string;
  medicalConditions: string;
}

interface WizardErrors {
  [key: string]: string;
}

const TOTAL_STEPS = 5;

const wizardSteps = {
  en: [
    { label: 'Choose Package', icon: Package },
    { label: 'Terms & Conditions', icon: FileText },
    { label: 'Parent Info', icon: User },
    { label: 'Student Info', icon: GraduationCap },
    { label: 'Review & Submit', icon: ClipboardCheck },
  ],
  ar: [
    { label: 'اختر الباقة', icon: Package },
    { label: 'الشروط والأحكام', icon: FileText },
    { label: 'بيانات ولي الأمر', icon: User },
    { label: 'بيانات الطالب', icon: GraduationCap },
    { label: 'المراجعة والإرسال', icon: ClipboardCheck },
  ],
};

const termsContent = {
  en: [
    'By submitting this application, you confirm that all information provided is accurate and complete.',
    'MEYLOR International School reserves the right to verify any information submitted as part of this application.',
    'An application does not guarantee admission. All applicants are subject to the school\'s assessment and interview process.',
    'Application fees are non-refundable once the application has been submitted.',
    'Parents/guardians agree to comply with the school\'s policies, code of conduct, and academic requirements upon admission.',
    'MEYLOR International School reserves the right to revoke an offer of admission if any information provided is found to be false or misleading.',
    'Personal information collected through this application will be handled in accordance with our privacy policy.',
    'By accepting these terms, you authorize the school to contact you via the provided email and phone number regarding the application status.',
  ],
  ar: [
    'بتقديم هذا الطلب، تؤكد أن جميع المعلومات المقدمة دقيقة وكاملة.',
    'تحتفظ مدرسة ميلور العالمية بحق التحقق من أي معلومات مقدمة كجزء من هذا الطلب.',
    'تقديم الطلب لا يضمن القبول. يخضع جميع المتقدمين لعملية التقييم والمقابلة في المدرسة.',
    'رسوم التقديم غير قابلة للاسترداد بعد تقديم الطلب.',
    'يوافق أولياء الأمور على الامتثال لسياسات المدرسة وقواعد السلوك والمتطلبات الأكاديمية عند القبول.',
    'تحتفظ مدرسة ميلور العالمية بحق سحب عرض القبول إذا تبين أن أي معلومات مقدمة كاذبة أو مضللة.',
    'سيتم التعامل مع المعلومات الشخصية المجمعة من خلال هذا الطلب وفقاً لسياسة الخصوصية لدينا.',
    'بقبول هذه الشروط، تفوض المدرسة بالتواصل معك عبر البريد الإلكتروني ورقم الهاتف المقدمين بخصوص حالة الطلب.',
  ],
};

// ─── Progress Bar ────────────────────────────────────────
function StepIndicator({ currentStep, isRTL, locale }: { currentStep: number; isRTL: boolean; locale: string }) {
  const steps = wizardSteps[locale as 'en' | 'ar'] || wizardSteps.en;

  return (
    <div className="mb-8 md:mb-10">
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;
          const Icon = step.icon;
          return (
            <div key={i} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'border-green-500 bg-green-500 text-white'
                      : isActive
                      ? 'border-accent bg-accent text-white shadow-lg shadow-accent/30'
                      : 'border-gray-300 bg-white text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span
                  className={`mt-2 text-xs font-medium transition-colors ${
                    isActive ? 'text-accent' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="mx-2 h-0.5 flex-1 rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all duration-500"
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-primary">
            {isRTL ? `الخطوة ${currentStep} من ${TOTAL_STEPS}` : `Step ${currentStep} of ${TOTAL_STEPS}`}
          </span>
          <span className="text-sm font-medium text-accent">
            {steps[currentStep - 1]?.label}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: Choose Package ──────────────────────────────
function StepChoosePackage({
  pricing,
  selectedPackage,
  onSelect,
  locale,
  isRTL,
}: {
  pricing: any[];
  selectedPackage: string | null;
  onSelect: (id: string) => void;
  locale: string;
  isRTL: boolean;
}) {
  return (
    <div>
      <h3 className="mb-2 text-xl font-bold text-gray-900">
        {isRTL ? 'اختر الباقة المناسبة' : 'Choose Your Package'}
      </h3>
      <p className="mb-6 text-sm text-gray-500">
        {isRTL ? 'اختر الباقة التعليمية المناسبة لطفلك' : 'Select the educational package that best suits your child'}
      </p>
      {pricing.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center text-gray-400">
          {isRTL ? 'لا توجد باقات متاحة حالياً' : 'No packages available at the moment'}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {pricing.map((pkg: any) => {
          const isSelected = selectedPackage === pkg._id;
          return (
            <button
              key={pkg._id}
              type="button"
              onClick={() => onSelect(pkg._id)}
              className={`relative rounded-2xl border-2 p-5 text-left transition-all ${
                isSelected
                  ? 'border-accent bg-accent/5 shadow-lg shadow-accent/10'
                  : 'border-gray-200 bg-white hover:border-accent/40 hover:shadow-md'
              }`}
            >
              {pkg.isPopular && (
                <div className="absolute right-0 top-0 flex items-center gap-1 rounded-bl-xl bg-accent px-2.5 py-1 text-xs font-bold text-white">
                  <Star className="h-3 w-3" />
                </div>
              )}
              {isSelected && (
                <div className="absolute top-3 left-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                </div>
              )}
              <h4 className="text-lg font-bold text-gray-900">{getLocalizedField(pkg, 'title', locale)}</h4>
              <p className="mt-1 text-sm text-gray-500">{getLocalizedField(pkg, 'description', locale)}</p>
              <div className="mt-3">
                <span className="text-2xl font-bold text-primary">{pkg.price}</span>
                <span className="text-sm text-gray-400"> {pkg.currency}/{isRTL ? 'سنة' : 'year'}</span>
              </div>
              <ul className="mt-3 space-y-1">
                {getLocalizedArray(pkg, 'features', locale).slice(0, 3).map((f: string, j: number) => (
                  <li key={j} className="flex items-start gap-1.5 text-xs text-gray-600">
                    <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 2: Terms ───────────────────────────────────────
function StepTerms({
  accepted,
  onToggle,
  isRTL,
  locale,
}: {
  accepted: boolean;
  onToggle: () => void;
  isRTL: boolean;
  locale: string;
}) {
  const terms = termsContent[locale as 'en' | 'ar'] || termsContent.en;

  return (
    <div>
      <h3 className="mb-2 text-xl font-bold text-gray-900">
        {isRTL ? 'الشروط والأحكام' : 'Terms & Conditions'}
      </h3>
      <p className="mb-6 text-sm text-gray-500">
        {isRTL ? 'يرجى قراءة الشروط والأحكام بعناية قبل المتابعة' : 'Please read the terms and conditions carefully before proceeding'}
      </p>
      <div className="mb-6 max-h-72 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-5">
        <ol className="list-decimal space-y-3 ps-5">
          {terms.map((term, i) => (
            <li key={i} className="text-sm leading-relaxed text-gray-700">{term}</li>
          ))}
        </ol>
      </div>
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-gray-200 p-4 transition-colors hover:border-accent/40">
        <input
          type="checkbox"
          checked={accepted}
          onChange={onToggle}
          className="mt-0.5 h-5 w-5 rounded border-gray-300 text-accent accent-accent"
        />
        <span className="text-sm font-medium text-gray-700">
          {isRTL
            ? 'أقر بأنني قرأت وأوافق على الشروط والأحكام'
            : 'I have read and agree to the Terms & Conditions'}
        </span>
      </label>
    </div>
  );
}

// ─── Step 3: Parent Info ─────────────────────────────────
function StepParentInfo({
  data,
  onChange,
  errors,
  isRTL,
  isLoggedIn,
}: {
  data: ParentInfo;
  onChange: (field: keyof ParentInfo, value: string) => void;
  errors: WizardErrors;
  isRTL: boolean;
  isLoggedIn: boolean;
}) {
  const relationships = isRTL
    ? ['أب', 'أم', 'وصي/ولي أمر']
    : ['Father', 'Mother', 'Guardian'];

  return (
    <div>
      <h3 className="mb-2 text-xl font-bold text-gray-900">
        {isRTL ? 'بيانات ولي الأمر' : 'Parent / Guardian Information'}
      </h3>
      <p className="mb-6 text-sm text-gray-500">
        {isRTL ? 'يرجى تعبئة بيانات ولي الأمر بدقة' : 'Please fill in the parent/guardian details accurately'}
      </p>
      {isLoggedIn && (
        <div className="mb-4 rounded-lg border border-accent/30 bg-accent/5 px-4 py-2.5 text-xs font-medium text-accent">
          {isRTL ? 'تم التعبئة من ملفك الشخصي' : 'Prefilled from your profile'}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldInput label={isRTL ? 'اسم ولي الأمر' : 'Full Name'} value={data.parentName} onChange={(v) => onChange('parentName', v)} error={errors.parentName} required />
        <FieldInput label={isRTL ? 'البريد الإلكتروني' : 'Email Address'} type="email" value={data.email} onChange={(v) => onChange('email', v)} error={errors.email} required dir="ltr" />
        <FieldInput label={isRTL ? 'رقم الهاتف' : 'Phone Number'} type="tel" value={data.phone} onChange={(v) => onChange('phone', v)} error={errors.phone} required dir="ltr" />
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {isRTL ? 'صلة القرابة' : 'Relationship to Student'} <span className="text-red-500">*</span>
          </label>
          <select
            value={data.relationship}
            onChange={(e) => onChange('relationship', e.target.value)}
            className={`input-field ${errors.relationship ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
          >
            <option value="">{isRTL ? 'اختر' : 'Select'}</option>
            {relationships.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {errors.relationship && <p className="mt-1 text-xs text-red-500">{errors.relationship}</p>}
        </div>
        <FieldInput label={isRTL ? 'الجنسية' : 'Nationality'} value={data.nationality} onChange={(v) => onChange('nationality', v)} error={errors.nationality} required />
        <FieldInput
          label={isRTL ? 'رقم الهوية / الإقامة' : 'National ID / Iqama Number'}
          value={data.nationalId}
          onChange={(v) => onChange('nationalId', v)}
          error={errors.nationalId}
          dir="ltr"
          hint={isRTL ? '(اختياري)' : '(optional)'}
          placeholder={isRTL ? 'الهوية / الإقامة (اختياري)' : 'National ID / Iqama (optional)'}
        />
      </div>
    </div>
  );
}

// ─── Step 4: Student Info ────────────────────────────────
function StepStudentInfo({
  data,
  onChange,
  errors,
  isRTL,
  children,
  selectedChildIndex,
  onSelectChild,
}: {
  data: StudentInfo;
  onChange: (field: keyof StudentInfo, value: string) => void;
  errors: WizardErrors;
  isRTL: boolean;
  children: any[];
  selectedChildIndex: number | null;
  onSelectChild: (idx: number | null) => void;
}) {
  const genders = isRTL ? ['ذكر', 'أنثى'] : ['Male', 'Female'];
  const grades = [
    'KG1', 'KG2', 'KG3',
    ...Array.from({ length: 12 }, (_, i) => (isRTL ? `الصف ${i + 1}` : `Grade ${i + 1}`)),
  ];

  const hasChildren = children && children.length > 0;

  return (
    <div>
      <h3 className="mb-2 text-xl font-bold text-gray-900">
        {isRTL ? 'بيانات الطالب' : 'Student Information'}
      </h3>
      <p className="mb-6 text-sm text-gray-500">
        {isRTL ? 'يرجى تعبئة بيانات الطالب بدقة' : 'Please fill in the student details accurately'}
      </p>
      {hasChildren && (
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {isRTL ? 'التقديم لأي طفل؟' : 'Apply for which child?'}
          </label>
          <select
            value={selectedChildIndex === null ? '' : String(selectedChildIndex)}
            onChange={(e) => {
              const v = e.target.value;
              onSelectChild(v === '' ? null : Number(v));
            }}
            className="input-field"
          >
            <option value="">
              {isRTL ? 'طفل جديد (إدخال يدوي)' : 'New child (fill manually)'}
            </option>
            {children.map((child: any, idx: number) => {
              const name = isRTL ? (child.nameAr || child.nameEn) : (child.nameEn || child.nameAr);
              return (
                <option key={idx} value={idx}>
                  {name}{child.grade ? ` — ${child.grade}` : ''}
                </option>
              );
            })}
          </select>
          {selectedChildIndex !== null && (
            <p className="mt-1 text-xs font-medium text-green-600">
              {isRTL
                ? 'تم التعبئة من ملفك الشخصي — عدّل إذا لزم الأمر'
                : 'Prefilled from your profile — edit if needed'}
            </p>
          )}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldInput label={isRTL ? 'اسم الطالب (بالإنجليزية)' : 'Student Name (English)'} value={data.studentNameEn} onChange={(v) => onChange('studentNameEn', v)} error={errors.studentNameEn} required dir="ltr" />
        <FieldInput label={isRTL ? 'اسم الطالب (بالعربية)' : 'Student Name (Arabic)'} value={data.studentNameAr} onChange={(v) => onChange('studentNameAr', v)} error={errors.studentNameAr} required dir="rtl" />
        <FieldInput label={isRTL ? 'تاريخ الميلاد' : 'Date of Birth'} type="date" value={data.dateOfBirth} onChange={(v) => onChange('dateOfBirth', v)} error={errors.dateOfBirth} required dir="ltr" />
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {isRTL ? 'الجنس' : 'Gender'} <span className="text-red-500">*</span>
          </label>
          <select
            value={data.gender}
            onChange={(e) => onChange('gender', e.target.value)}
            className={`input-field ${errors.gender ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
          >
            <option value="">{isRTL ? 'اختر' : 'Select'}</option>
            {genders.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {isRTL ? 'الصف الحالي / المتقدم له' : 'Current / Applying Grade'} <span className="text-red-500">*</span>
          </label>
          <select
            value={data.currentGrade}
            onChange={(e) => onChange('currentGrade', e.target.value)}
            className={`input-field ${errors.currentGrade ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
          >
            <option value="">{isRTL ? 'اختر الصف' : 'Select Grade'}</option>
            {grades.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          {errors.currentGrade && <p className="mt-1 text-xs text-red-500">{errors.currentGrade}</p>}
        </div>
        <FieldInput label={isRTL ? 'المدرسة السابقة' : 'Previous School Name'} value={data.previousSchool} onChange={(v) => onChange('previousSchool', v)} error={errors.previousSchool} required />
      </div>
      <div className="mt-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {isRTL ? 'حالات طبية (اختياري)' : 'Medical Conditions (optional)'}
        </label>
        <textarea
          rows={3}
          value={data.medicalConditions}
          onChange={(e) => onChange('medicalConditions', e.target.value)}
          className="input-field"
          placeholder={isRTL ? 'اذكر أي حالات طبية أو حساسية ...' : 'Mention any medical conditions or allergies ...'}
        />
      </div>
    </div>
  );
}

// ─── Step 5: Review ──────────────────────────────────────
function formatDate(val: string, locale: string) {
  if (!val) return '—';
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  return d.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function StepReview({
  selectedPackage,
  pricing,
  parentInfo,
  studentInfo,
  locale,
  isRTL,
}: {
  selectedPackage: string | null;
  pricing: any[];
  parentInfo: ParentInfo;
  studentInfo: StudentInfo;
  locale: string;
  isRTL: boolean;
}) {
  const pkg = pricing.find((p) => p._id === selectedPackage);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">{title}</h4>
      <div className="grid gap-2 sm:grid-cols-2">{children}</div>
    </div>
  );

  const Field = ({ label, value }: { label: string; value: string }) => (
    <div>
      <span className="text-xs text-gray-400">{label}</span>
      <p className="text-sm font-medium text-gray-800">{value || '—'}</p>
    </div>
  );

  return (
    <div>
      <h3 className="mb-2 text-xl font-bold text-gray-900">
        {isRTL ? 'مراجعة الطلب' : 'Review Your Application'}
      </h3>
      <p className="mb-6 text-sm text-gray-500">
        {isRTL ? 'تأكد من صحة جميع البيانات قبل الإرسال' : 'Please verify all information before submitting'}
      </p>
      <div className="space-y-4">
        <Section title={isRTL ? 'الباقة المختارة' : 'Selected Package'}>
          {pkg && (
            <div className="sm:col-span-2">
              <p className="text-sm font-semibold text-gray-800">{getLocalizedField(pkg, 'title', locale)}</p>
              <p className="text-sm text-accent font-bold">{pkg.price} {pkg.currency}/{isRTL ? 'سنة' : 'year'}</p>
            </div>
          )}
        </Section>

        <Section title={isRTL ? 'بيانات ولي الأمر' : 'Parent Information'}>
          <Field label={isRTL ? 'الاسم' : 'Name'} value={parentInfo.parentName} />
          <Field label={isRTL ? 'البريد الإلكتروني' : 'Email'} value={parentInfo.email} />
          <Field label={isRTL ? 'الهاتف' : 'Phone'} value={parentInfo.phone} />
          <Field label={isRTL ? 'صلة القرابة' : 'Relationship'} value={parentInfo.relationship} />
          <Field label={isRTL ? 'الجنسية' : 'Nationality'} value={parentInfo.nationality} />
          <Field label={isRTL ? 'رقم الهوية / الإقامة' : 'ID / Iqama'} value={parentInfo.nationalId?.trim() ? parentInfo.nationalId : '—'} />
        </Section>

        <Section title={isRTL ? 'بيانات الطالب' : 'Student Information'}>
          <Field label={isRTL ? 'الاسم (إنجليزي)' : 'Name (English)'} value={studentInfo.studentNameEn} />
          <Field label={isRTL ? 'الاسم (عربي)' : 'Name (Arabic)'} value={studentInfo.studentNameAr} />
          <Field label={isRTL ? 'تاريخ الميلاد' : 'Date of Birth'} value={formatDate(studentInfo.dateOfBirth, locale)} />
          <Field label={isRTL ? 'الجنس' : 'Gender'} value={studentInfo.gender} />
          <Field label={isRTL ? 'الصف' : 'Grade'} value={studentInfo.currentGrade} />
          <Field label={isRTL ? 'المدرسة السابقة' : 'Previous School'} value={studentInfo.previousSchool} />
          {studentInfo.medicalConditions && (
            <div className="sm:col-span-2">
              <Field label={isRTL ? 'حالات طبية' : 'Medical Conditions'} value={studentInfo.medicalConditions} />
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}

// ─── Reusable Input Field ────────────────────────────────
function FieldInput({
  label,
  value,
  onChange,
  error,
  type = 'text',
  required = false,
  dir,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  required?: boolean;
  dir?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
        {hint && <span className="ms-1 text-xs font-normal text-gray-400">{hint}</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`input-field ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
        dir={dir}
        placeholder={placeholder}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Success Screen ──────────────────────────────────────
function SuccessScreen({ isRTL, onReset }: { isRTL: boolean; onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="py-12 text-center"
    >
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900">
        {isRTL ? 'تم تقديم طلبك بنجاح!' : 'Application Submitted Successfully!'}
      </h3>
      <p className="mx-auto mt-3 max-w-md text-gray-500">
        {isRTL
          ? 'شكراً لتقديم طلبكم. سيقوم فريق القبول بمراجعة طلبكم والتواصل معكم قريباً.'
          : 'Thank you for your application. Our admissions team will review your application and contact you soon.'}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        {isRTL ? 'تقديم طلب جديد' : 'Submit Another Application'}
      </button>
    </motion.div>
  );
}

// ─── Main Wizard Component ───────────────────────────────
export default function AdmissionWizard({ pricing, locale }: { pricing: any[]; locale: string }) {
  const isRTL = locale === 'ar';
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);

  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  // Step 2
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Step 3
  const [parentInfo, setParentInfo] = useState<ParentInfo>({
    parentName: user?.nameEn || user?.nameAr || '',
    email: user?.email || '',
    phone: (user as any)?.phone || '',
    relationship: '',
    nationality: (user as any)?.nationality || '',
    nationalId: (user as any)?.nationalId || '',
  });

  useEffect(() => {
    if (user) {
      setParentInfo((prev) => ({
        ...prev,
        parentName: prev.parentName || user.nameEn || user.nameAr || '',
        email: prev.email || user.email || '',
        phone: prev.phone || (user as any).phone || '',
        nationality: prev.nationality || (user as any).nationality || '',
        nationalId: prev.nationalId || (user as any).nationalId || '',
      }));
    }
  }, [user]);

  // Step 4
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    studentNameEn: '',
    studentNameAr: '',
    dateOfBirth: '',
    gender: '',
    currentGrade: '',
    previousSchool: '',
    medicalConditions: '',
  });

  const userChildren: any[] = (user as any)?.children || [];
  const [selectedChildIndex, setSelectedChildIndex] = useState<number | null>(null);

  const handleSelectChild = useCallback((idx: number | null) => {
    setSelectedChildIndex(idx);
    if (idx === null) {
      setStudentInfo((prev) => ({
        ...prev,
        studentNameEn: '',
        studentNameAr: '',
        dateOfBirth: '',
        gender: '',
        currentGrade: '',
        medicalConditions: '',
      }));
    } else {
      const child = userChildren[idx];
      if (child) {
        const dob = child.dateOfBirth ? new Date(child.dateOfBirth) : null;
        const dobStr =
          dob && !isNaN(dob.getTime()) ? dob.toISOString().slice(0, 10) : (child.dateOfBirth || '');
        setStudentInfo((prev) => ({
          ...prev,
          studentNameEn: child.nameEn || '',
          studentNameAr: child.nameAr || '',
          dateOfBirth: dobStr,
          gender: child.gender || '',
          currentGrade: child.grade || '',
          medicalConditions: child.medicalConditions || '',
        }));
      }
    }
    setErrors({});
  }, [userChildren]);

  const [errors, setErrors] = useState<WizardErrors>({});

  const handleParentChange = useCallback((field: keyof ParentInfo, value: string) => {
    setParentInfo((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleStudentChange = useCallback((field: keyof StudentInfo, value: string) => {
    setStudentInfo((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const validateStep = (step: number): boolean => {
    const newErrors: WizardErrors = {};

    if (step === 1) {
      if (!selectedPackage) {
        toast.error(isRTL ? 'يرجى اختيار باقة' : 'Please select a package');
        return false;
      }
    }

    if (step === 2) {
      if (!termsAccepted) {
        toast.error(isRTL ? 'يجب الموافقة على الشروط والأحكام للمتابعة' : 'You must accept the terms and conditions to continue');
        return false;
      }
    }

    if (step === 3) {
      if (!parentInfo.parentName.trim()) newErrors.parentName = isRTL ? 'مطلوب' : 'Required';
      if (!parentInfo.email.trim()) {
        newErrors.email = isRTL ? 'مطلوب' : 'Required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentInfo.email)) {
        newErrors.email = isRTL ? 'بريد إلكتروني غير صالح' : 'Invalid email address';
      }
      if (!parentInfo.phone.trim()) newErrors.phone = isRTL ? 'مطلوب' : 'Required';
      if (!parentInfo.relationship) newErrors.relationship = isRTL ? 'مطلوب' : 'Required';
      if (!parentInfo.nationality.trim()) newErrors.nationality = isRTL ? 'مطلوب' : 'Required';
      // nationalId is optional
    }

    if (step === 4) {
      if (!studentInfo.studentNameEn.trim()) newErrors.studentNameEn = isRTL ? 'مطلوب' : 'Required';
      if (!studentInfo.studentNameAr.trim()) newErrors.studentNameAr = isRTL ? 'مطلوب' : 'Required';
      if (!studentInfo.dateOfBirth) newErrors.dateOfBirth = isRTL ? 'مطلوب' : 'Required';
      if (!studentInfo.gender) newErrors.gender = isRTL ? 'مطلوب' : 'Required';
      if (!studentInfo.currentGrade) newErrors.currentGrade = isRTL ? 'مطلوب' : 'Required';
      if (!studentInfo.previousSchool.trim()) newErrors.previousSchool = isRTL ? 'مطلوب' : 'Required';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error(isRTL ? 'يرجى تعبئة جميع الحقول المطلوبة' : 'Please fill in all required fields');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    }
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const pkg = pricing.find((p) => p._id === selectedPackage);
      await publicApi.submitAdmission(
        {
          packageId: selectedPackage,
          packageName: pkg ? getLocalizedField(pkg, 'title', 'en') : '',
          parentInfo,
          studentInfo,
          locale,
        },
        accessToken || undefined
      );
      setSubmitted(true);
      toast.success(isRTL ? 'تم تقديم الطلب بنجاح!' : 'Application submitted successfully!');
    } catch (err: any) {
      toast.error(err.message || (isRTL ? 'حدث خطأ، يرجى المحاولة مرة أخرى' : 'An error occurred. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSubmitted(false);
    setSelectedPackage(null);
    setTermsAccepted(false);
    setParentInfo({ parentName: '', email: '', phone: '', relationship: '', nationality: '', nationalId: '' });
    setStudentInfo({ studentNameEn: '', studentNameAr: '', dateOfBirth: '', gender: '', currentGrade: '', previousSchool: '', medicalConditions: '' });
    setSelectedChildIndex(null);
    setErrors({});
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? (isRTL ? -80 : 80) : (isRTL ? 80 : -80),
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction > 0 ? (isRTL ? 80 : -80) : (isRTL ? -80 : 80),
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState(1);

  const goNext = () => {
    setDirection(1);
    handleNext();
  };

  const goBack = () => {
    setDirection(-1);
    handleBack();
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
        <SuccessScreen isRTL={isRTL} onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-8 lg:p-10">
      <StepIndicator currentStep={currentStep} isRTL={isRTL} locale={locale} />

      <div className="min-h-[400px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {currentStep === 1 && (
              <StepChoosePackage
                pricing={pricing}
                selectedPackage={selectedPackage}
                onSelect={setSelectedPackage}
                locale={locale}
                isRTL={isRTL}
              />
            )}
            {currentStep === 2 && (
              <StepTerms
                accepted={termsAccepted}
                onToggle={() => setTermsAccepted(!termsAccepted)}
                isRTL={isRTL}
                locale={locale}
              />
            )}
            {currentStep === 3 && (
              <StepParentInfo
                data={parentInfo}
                onChange={handleParentChange}
                errors={errors}
                isRTL={isRTL}
                isLoggedIn={!!user}
              />
            )}
            {currentStep === 4 && (
              <StepStudentInfo
                data={studentInfo}
                onChange={handleStudentChange}
                errors={errors}
                isRTL={isRTL}
                children={userChildren}
                selectedChildIndex={selectedChildIndex}
                onSelectChild={handleSelectChild}
              />
            )}
            {currentStep === 5 && (
              <StepReview
                selectedPackage={selectedPackage}
                pricing={pricing}
                parentInfo={parentInfo}
                studentInfo={studentInfo}
                locale={locale}
                isRTL={isRTL}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {isRTL ? 'السابق' : 'Back'}
          </button>
        ) : (
          <div />
        )}

        {currentStep < TOTAL_STEPS ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90 shadow-lg shadow-accent/20"
          >
            {isRTL ? 'التالي' : 'Next'}
            {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark shadow-lg shadow-primary/20 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isRTL ? 'جاري الإرسال...' : 'Submitting...'}
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                {isRTL ? 'تقديم الطلب' : 'Submit Application'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
