'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { getLocalizedField } from '@/lib/utils';
import PageHero from '@/components/ui/PageHero';
import { Eye, Target, Heart, Award, BookOpen, Users, GraduationCap, Star, Shield, Lightbulb } from 'lucide-react';

const icons: Record<string, any> = { vision: Eye, mission: Target, values: Heart };

const fallbackBoard = [
  { nameEn: 'Dr. Ahmad Al-Rashidi', nameAr: 'د. أحمد الرشيدي', roleEn: 'Chairman of the Board', roleAr: 'رئيس مجلس الإدارة', imageUrl: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { nameEn: 'Mrs. Fatima Hassan', nameAr: 'أ. فاطمة حسن', roleEn: 'Vice Chairwoman', roleAr: 'نائبة الرئيس', imageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { nameEn: 'Mr. Khalid Al-Otaibi', nameAr: 'أ. خالد العتيبي', roleEn: 'Board Member', roleAr: 'عضو مجلس الإدارة', imageUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { nameEn: 'Dr. Sarah Al-Zahrani', nameAr: 'د. سارة الزهراني', roleEn: 'Board Member', roleAr: 'عضوة مجلس الإدارة', imageUrl: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

const fallbackTeam = [
  { nameEn: 'Mr. Omar Badr', nameAr: 'أ. عمر بدر', roleEn: 'School Principal', roleAr: 'مدير المدرسة', imageUrl: 'https://images.pexels.com/photos/2182975/pexels-photo-2182975.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { nameEn: 'Mrs. Layla Mansour', nameAr: 'أ. ليلى منصور', roleEn: 'Vice Principal - Academics', roleAr: 'نائبة المدير - الشؤون الأكاديمية', imageUrl: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { nameEn: 'Mr. Faisal Al-Harbi', nameAr: 'أ. فيصل الحربي', roleEn: 'Vice Principal - Operations', roleAr: 'نائب المدير - العمليات', imageUrl: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { nameEn: 'Mrs. Nora Al-Qahtani', nameAr: 'أ. نورة القحطاني', roleEn: 'Head of Student Affairs', roleAr: 'رئيسة شؤون الطلاب', imageUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { nameEn: 'Dr. Rami Tawfiq', nameAr: 'د. رامي توفيق', roleEn: 'Head of Curriculum', roleAr: 'رئيس المناهج', imageUrl: 'https://images.pexels.com/photos/936229/pexels-photo-936229.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { nameEn: 'Mrs. Hana Al-Shehri', nameAr: 'أ. هناء الشهري', roleEn: 'Head of Admissions', roleAr: 'رئيسة القبول والتسجيل', imageUrl: 'https://images.pexels.com/photos/1181391/pexels-photo-1181391.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

const coreValues = [
  { icon: Star, titleEn: 'Excellence', titleAr: 'التميّز', descEn: 'Striving for the highest standards in everything we do.', descAr: 'السعي لأعلى المعايير في كل ما نقوم به.' },
  { icon: Lightbulb, titleEn: 'Innovation', titleAr: 'الابتكار', descEn: 'Embracing creativity and modern approaches to education.', descAr: 'تبنّي الإبداع والمناهج الحديثة في التعليم.' },
  { icon: Shield, titleEn: 'Integrity', titleAr: 'النزاهة', descEn: 'Building trust through honesty, transparency and accountability.', descAr: 'بناء الثقة من خلال الصدق والشفافية والمسؤولية.' },
  { icon: Users, titleEn: 'Community', titleAr: 'المجتمع', descEn: 'Fostering a caring and inclusive school community.', descAr: 'تعزيز مجتمع مدرسي رعاية وشامل.' },
  { icon: GraduationCap, titleEn: 'Growth', titleAr: 'النمو', descEn: 'Nurturing lifelong learners who thrive beyond the classroom.', descAr: 'رعاية متعلمين مدى الحياة يتفوقون خارج الفصل الدراسي.' },
  { icon: Heart, titleEn: 'Respect', titleAr: 'الاحترام', descEn: 'Valuing diversity, dignity, and mutual respect.', descAr: 'تقدير التنوع والكرامة والاحترام المتبادل.' },
];

const milestones = [
  { year: '2014', titleEn: 'Founded', titleAr: 'التأسيس', descEn: 'MEYLOR International School was established in Jeddah.', descAr: 'تأسست مدرسة ميلور العالمية في جدة.' },
  { year: '2016', titleEn: 'First Graduation', titleAr: 'أول تخريج', descEn: 'Our first cohort of students graduated with distinction.', descAr: 'تخرّج أول فوج من طلابنا بتفوّق.' },
  { year: '2019', titleEn: 'Expansion', titleAr: 'التوسّع', descEn: 'New state-of-the-art campus wing opened with innovation hub.', descAr: 'افتتاح جناح جديد بأحدث التقنيات ومركز الابتكار.' },
  { year: '2022', titleEn: 'Accreditation', titleAr: 'الاعتماد', descEn: 'Received international accreditation for academic excellence.', descAr: 'حصلنا على الاعتماد الدولي للتميّز الأكاديمي.' },
  { year: '2025', titleEn: '1200+ Students', titleAr: '١٢٠٠+ طالب', descEn: 'Growing strong with over 1,200 students and 150+ faculty.', descAr: 'نمو قوي مع أكثر من ١٢٠٠ طالب و١٥٠+ من أعضاء الهيئة التعليمية.' },
];

interface AboutPageClientProps {
  sections: any[];
  boardMembers?: any[];
  teamMembers?: any[];
  locale: string;
}

export default function AboutPageClient({ sections, boardMembers = [], teamMembers = [], locale }: AboutPageClientProps) {
  const t = useTranslations('about');
  const isRTL = locale === 'ar';

  const board = boardMembers.length > 0 ? boardMembers : fallbackBoard;
  const team = teamMembers.length > 0 ? teamMembers : fallbackTeam;

  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      {/* Vision, Mission, Values from CMS */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-8 md:grid-cols-3">
            {sections.map((section: any, i: number) => {
              const Icon = icons[section.key] || Eye;
              return (
                <motion.div
                  key={section._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="group rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary">
                    <Icon className="h-7 w-7 text-primary transition-colors group-hover:text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {getLocalizedField(section, 'title', locale)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {getLocalizedField(section, 'content', locale)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-gray-50 section-padding">
        <div className="container-custom">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="mb-3 inline-block rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
                {isRTL ? 'قصّتنا' : 'Our Story'}
              </span>
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                {isRTL ? 'بناء مستقبل أفضل من خلال التعليم' : 'Building a Better Future Through Education'}
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-gray-600">
                {isRTL
                  ? 'تأسست مدرسة ميلور العالمية في حي النعيم بجدة برؤية واضحة: تقديم تعليم عالمي المستوى يجمع بين المنهج العربي والمعايير الدولية. منذ تأسيسنا، نسعى لتمكين الطلاب من الروضة حتى الصف الثاني عشر بالمعرفة والمهارات والقيم التي يحتاجونها للتفوّق في عالم متغيّر.'
                  : 'MEYLOR International School was founded in Jeddah\'s Al-Naeem District with a clear vision: to deliver world-class education that blends the Arabic curriculum with international standards. Since our founding, we have been committed to empowering students from KG to Grade 12 with the knowledge, skills, and values they need to excel in a changing world.'}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {isRTL
                  ? 'نؤمن بأن كل طالب فريد ويستحق بيئة تعليمية تُلهمه وتدعمه. فريقنا المتميّز من المعلمين المؤهلين دولياً يقدّم تجربة تعليمية استثنائية تجمع بين الأكاديميات والأنشطة اللاصفية.'
                  : 'We believe every student is unique and deserves a learning environment that inspires and supports them. Our outstanding team of internationally qualified educators delivers an exceptional educational experience that combines rigorous academics with enriching extracurricular activities.'}
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { value: '1200+', labelEn: 'Students', labelAr: 'طالب' },
                  { value: '150+', labelEn: 'Teachers', labelAr: 'معلّم' },
                  { value: '10+', labelEn: 'Years', labelAr: 'سنوات' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="rounded-xl bg-white p-3 text-center shadow-sm"
                  >
                    <div className="text-xl font-bold text-primary">{stat.value}</div>
                    <div className="mt-1 text-xs text-gray-500">{isRTL ? stat.labelAr : stat.labelEn}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src="https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="MEYLOR School"
                  width={700}
                  height={500}
                  className="h-[380px] w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 rounded-xl bg-accent p-5 text-white shadow-xl md:-bottom-6 md:-right-6">
                <Award className="mb-1 h-6 w-6" />
                <div className="text-xs font-bold">{isRTL ? 'معتمدة دولياً' : 'Internationally Accredited'}</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center">
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              {isRTL ? 'ما يميّزنا' : 'What Defines Us'}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {isRTL ? 'قيمنا الأساسية' : 'Our Core Values'}
            </h2>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:shadow-md hover:border-primary/20"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary">
                  <val.icon className="h-5 w-5 text-primary transition-colors group-hover:text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{isRTL ? val.titleAr : val.titleEn}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">{isRTL ? val.descAr : val.descEn}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-primary section-padding">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              {isRTL ? 'رحلتنا عبر السنين' : 'Our Journey Over the Years'}
            </h2>
          </motion.div>
          <div className="relative mx-auto max-w-3xl">
            <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-white/20" />
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative mb-8 flex items-center ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className={`w-5/12 ${i % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                    <div className="text-sm font-bold text-accent">{m.year}</div>
                    <h3 className="mt-1 text-sm font-bold text-white">{isRTL ? m.titleAr : m.titleEn}</h3>
                    <p className="mt-1 text-xs text-white/60">{isRTL ? m.descAr : m.descEn}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-4 border-primary bg-accent text-xs font-bold text-white">
                  {m.year.slice(-2)}
                </div>
                <div className="w-5/12" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Board of Directors - Dynamic from API */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center">
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              {isRTL ? 'القيادة' : 'Leadership'}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {isRTL ? 'مجلس الإدارة' : 'Board of Directors'}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-500">
              {isRTL ? 'يقود مجلس إدارتنا المتميّز رؤية المدرسة واستراتيجيتها لضمان أعلى معايير التعليم.' : 'Our distinguished board oversees the school\'s vision and strategy to ensure the highest standards of education.'}
            </p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {board.map((member: any, i: number) => (
              <motion.div
                key={member._id || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group text-center"
              >
                <div className="relative mx-auto mb-4 h-44 w-44 overflow-hidden rounded-2xl">
                  <Image
                    src={member.imageUrl || member.image || 'https://placehold.co/300x300/003A83/FFFFFF?text=M'}
                    alt={isRTL ? member.nameAr : member.nameEn}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">{isRTL ? member.nameAr : member.nameEn}</h3>
                <p className="mt-1 text-xs text-primary">{isRTL ? member.roleAr : member.roleEn}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team - Dynamic from API */}
      <section className="bg-gray-50 section-padding">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center">
            <span className="mb-3 inline-block rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
              {isRTL ? 'فريقنا' : 'Our Team'}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {isRTL ? 'فريق القيادة' : 'Leadership Team'}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-500">
              {isRTL ? 'معلّمون وإداريون متميّزون يعملون معاً لتوفير أفضل تجربة تعليمية لطلابنا.' : 'Outstanding educators and administrators working together to provide the best learning experience for our students.'}
            </p>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member: any, i: number) => (
              <motion.div
                key={member._id || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={member.imageUrl || member.image || 'https://placehold.co/300x300/003A83/FFFFFF?text=M'}
                    alt={isRTL ? member.nameAr : member.nameEn}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{isRTL ? member.nameAr : member.nameEn}</h3>
                  <p className="mt-1 text-xs text-gray-500">{isRTL ? member.roleAr : member.roleEn}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose MEYLOR */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {isRTL ? 'لماذا مدرسة ميلور؟' : 'Why Choose MEYLOR?'}
            </h2>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BookOpen, titleEn: 'Bilingual Curriculum', titleAr: 'منهج ثنائي اللغة', descEn: 'Combining the best of Arabic and international curricula.', descAr: 'الجمع بين أفضل المناهج العربية والدولية.' },
              { icon: Award, titleEn: 'Qualified Faculty', titleAr: 'هيئة تعليمية مؤهلة', descEn: '150+ internationally certified teachers and specialists.', descAr: '١٥٠+ معلّم ومتخصص معتمد دولياً.' },
              { icon: Lightbulb, titleEn: 'Innovation Hub', titleAr: 'مركز الابتكار', descEn: 'State-of-the-art robotics, coding, and STEM facilities.', descAr: 'أحدث مرافق الروبوتات والبرمجة وعلوم STEM.' },
              { icon: Shield, titleEn: 'Safe Environment', titleAr: 'بيئة آمنة', descEn: 'A nurturing, secure campus designed for student wellbeing.', descAr: 'حرم مدرسي آمن ومصمّم لرفاهية الطلاب.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-primary/5 p-5 text-center"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">{isRTL ? item.titleAr : item.titleEn}</h3>
                <p className="mt-2 text-xs text-gray-500">{isRTL ? item.descAr : item.descEn}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
