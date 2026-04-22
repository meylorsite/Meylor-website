import { unstable_setRequestLocale } from 'next-intl/server';
import { publicApi } from '@/lib/api';
import HeroSection from '@/components/home/HeroSection';
import AboutPreview from '@/components/home/AboutPreview';
import ProgramsPreview from '@/components/home/ProgramsPreview';
import StatsSection from '@/components/home/StatsSection';
import WhyMeylorSection from '@/components/home/WhyMeylorSection';
import FacilitiesPreview from '@/components/home/FacilitiesPreview';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import NewsPreview from '@/components/home/NewsPreview';
import GalleryPreview from '@/components/home/GalleryPreview';
import CTASection from '@/components/home/CTASection';
import NewsletterSection from '@/components/home/NewsletterSection';

async function getHomeData() {
  try {
    const [sections, programs, facilities, testimonials, news, gallery, stats] = await Promise.all([
      publicApi.getSections('home').catch(() => ({ data: [] })),
      publicApi.getPrograms().catch(() => ({ data: [] })),
      publicApi.getFacilities().catch(() => ({ data: [] })),
      publicApi.getTestimonials().catch(() => ({ data: [] })),
      publicApi.getNews(1, 6).catch(() => ({ data: [] })),
      publicApi.getGallery().catch(() => ({ data: [] })),
      publicApi.getStats().catch(() => ({ data: [] })),
    ]);
    return {
      sections: sections.data || [],
      programs: programs.data || [],
      facilities: facilities.data || [],
      testimonials: testimonials.data || [],
      news: news.data || [],
      gallery: gallery.data || [],
      stats: stats.data || [],
    };
  } catch {
    return { sections: [], programs: [], facilities: [], testimonials: [], news: [], gallery: [], stats: [] };
  }
}

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const data = await getHomeData();

  const heroSection = data.sections.find((s: any) => s.key === 'hero');
  const aboutSection = data.sections.find((s: any) => s.key === 'about-preview');
  const whySection = data.sections.find((s: any) => s.key === 'why-meylor');

  return (
    <>
      <HeroSection section={heroSection} locale={locale} />
      <AboutPreview section={aboutSection} locale={locale} />
      <ProgramsPreview programs={data.programs} locale={locale} />
      <StatsSection stats={data.stats} locale={locale} />
      <WhyMeylorSection section={whySection} locale={locale} />
      <FacilitiesPreview facilities={data.facilities} locale={locale} />
      <TestimonialsSection testimonials={data.testimonials} locale={locale} />
      <NewsPreview news={data.news} locale={locale} />
      <GalleryPreview gallery={data.gallery} locale={locale} />
      <CTASection locale={locale} />
      <NewsletterSection locale={locale} />
    </>
  );
}
