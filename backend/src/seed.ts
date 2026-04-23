import * as dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "./config/db";
import User from "./models/User";
import SiteSettings from "./models/SiteSettings";
import Section from "./models/Section";
import Program from "./models/Program";
import Facility from "./models/Facility";
import Testimonial from "./models/Testimonial";
import NewsPost from "./models/NewsPost";
import GalleryActivity from "./models/GalleryActivity";
import JourneyItem from "./models/JourneyItem";
import PricingPackage from "./models/PricingPackage";
import JobPost from "./models/JobPost";
import StatCounter from "./models/StatCounter";
import FAQ from "./models/FAQ";
import TeamMember from "./models/TeamMember";

const seed = async () => {
  await connectDB();
  console.log("Seeding database...");

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    SiteSettings.deleteMany({}),
    Section.deleteMany({}),
    Program.deleteMany({}),
    Facility.deleteMany({}),
    Testimonial.deleteMany({}),
    NewsPost.deleteMany({}),
    GalleryActivity.deleteMany({}),
    JourneyItem.deleteMany({}),
    PricingPackage.deleteMany({}),
    JobPost.deleteMany({}),
    StatCounter.deleteMany({}),
    FAQ.deleteMany({}),
    TeamMember.deleteMany({}),
  ]);

  // ─── Users (Admin + Parent + Student for testing) ─────────────
  await User.create({
    email: process.env.ADMIN_EMAIL || "admin@meylor.sa",
    password: process.env.ADMIN_PASSWORD || "Admin@123",
    nameEn: "Super Admin",
    nameAr: "المدير العام",
    role: "SUPER_ADMIN",
  });

  await User.create({
    email: "parent@meylor.sa",
    password: "Parent@2026!",
    nameEn: "Ahmad Al-Rashid",
    nameAr: "أحمد الراشد",
    role: "PARENT",
    phone: "+966501234567",
    nationality: "Saudi",
    nationalId: "1234567890",
    children: [
      {
        nameEn: "Sara Ahmad",
        nameAr: "سارة أحمد",
        dateOfBirth: new Date("2015-05-10"),
        gender: "female",
        grade: "Grade 3",
        medicalConditions: "",
      },
      {
        nameEn: "Omar Ahmad",
        nameAr: "عمر أحمد",
        dateOfBirth: new Date("2018-09-22"),
        gender: "male",
        grade: "KG2",
        medicalConditions: "",
      },
    ],
  });

  await User.create({
    email: "student@meylor.sa",
    password: "Student@2026!",
    nameEn: "Sara Ahmad",
    nameAr: "سارة أحمد",
    role: "STUDENT",
  });

  console.log("✓ Users created (Admin + Parent + Student)");

  // ─── Site Settings ────────────────────────────────────────────
  await SiteSettings.create({
    logoUrl: "https://placehold.co/200x80/003A83/FFFFFF?text=MEYLOR",
    faviconUrl: "https://placehold.co/32x32/003A83/FFFFFF?text=M",
    schoolNameEn: "MEYLOR School",
    schoolNameAr: "مدرسة ميلور",
    taglineEn: "Shaping Future Leaders",
    taglineAr: "نصنع قادة المستقبل",
    phone: "+966 12 000 0000",
    email: "info@meylor.sa",
    addressEn: "Al-Naeem District, Jeddah, Saudi Arabia",
    addressAr: "حي النعيم، جدة، المملكة العربية السعودية",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.178!2d39.1884!3d21.5433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDMyJzM2LjAiTiAzOcKwMTEnMTguMCJF!5e0!3m2!1sen!2ssa!4v1600000000000",
    socialLinks: {
      twitter: "https://twitter.com/meylor",
      instagram: "https://instagram.com/meylor",
    },
    seoTitleEn: "MEYLOR School | Premium Education in Jeddah",
    seoTitleAr: "مدرسة ميلور | تعليم متميّز في جدة",
    seoDescriptionEn:
      "MEYLOR School offers world-class education from KG to Grade 12 in Al-Naeem, Jeddah.",
    seoDescriptionAr:
      "مدرسة ميلور تقدم تعليمًا عالمي المستوى من الروضة حتى الصف الثاني عشر في حي النعيم، جدة.",
  });
  console.log("✓ Site settings created");

  // ─── Sections ─────────────────────────────────────────────────
  await Section.insertMany([
    {
      key: "hero",
      titleEn: "Where Excellence Meets Education",
      titleAr: "حيث يلتقي التميّز بالتعليم",
      subtitleEn:
        "Empowering students from KG to Grade 12 with a world-class learning experience in Jeddah.",
      subtitleAr:
        "نُمكّن الطلاب من الروضة حتى الصف الثاني عشر بتجربة تعليمية عالمية في جدة.",
      ctaTextEn: "Apply Now",
      ctaTextAr: "سجّل الآن",
      ctaLink: "/admissions",
      imageUrl:
        "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80",
      order: 0,
      isVisible: true,
      page: "home",
    },
    {
      key: "about-preview",
      titleEn: "About MEYLOR",
      titleAr: "عن مدرسة ميلور",
      subtitleEn: "A new standard of education",
      subtitleAr: "معيار جديد في التعليم",
      contentEn:
        "MEYLOR School is a premium educational institution located in Al-Naeem District, Jeddah. We provide a comprehensive curriculum that nurtures critical thinking, creativity, and leadership from Kindergarten through Grade 12.",
      contentAr:
        "مدرسة ميلور مؤسسة تعليمية متميزة تقع في حي النعيم بجدة. نقدم منهجًا شاملاً يعزز التفكير النقدي والإبداع والقيادة من مرحلة الروضة حتى الصف الثاني عشر.",
      imageUrl:
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
      order: 1,
      isVisible: true,
      page: "home",
    },
    {
      key: "why-meylor",
      titleEn: "Why MEYLOR?",
      titleAr: "لماذا ميلور؟",
      subtitleEn: "What sets us apart",
      subtitleAr: "ما يميزنا عن غيرنا",
      contentEn:
        "At MEYLOR, we combine international standards with Saudi values. Our state-of-the-art facilities, dedicated faculty, and innovative teaching methods ensure every student reaches their full potential.",
      contentAr:
        "في ميلور، نجمع بين المعايير الدولية والقيم السعودية. مرافقنا المتطورة وكادرنا التعليمي المتفاني وأساليبنا التعليمية المبتكرة تضمن وصول كل طالب إلى أقصى إمكاناته.",
      imageUrl:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
      order: 2,
      isVisible: true,
      page: "home",
    },
    {
      key: "vision",
      titleEn: "Our Vision",
      titleAr: "رؤيتنا",
      contentEn:
        "To be a leading educational institution that inspires lifelong learning and develops responsible global citizens.",
      contentAr:
        "أن نكون مؤسسة تعليمية رائدة تُلهم التعلم مدى الحياة وتُنشئ مواطنين عالميين مسؤولين.",
      order: 0,
      isVisible: true,
      page: "about",
    },
    {
      key: "mission",
      titleEn: "Our Mission",
      titleAr: "رسالتنا",
      contentEn:
        "To provide a nurturing, innovative, and inclusive learning environment that empowers students to achieve academic excellence, develop strong character, and contribute positively to society.",
      contentAr:
        "توفير بيئة تعليمية حاضنة ومبتكرة وشاملة تُمكّن الطلاب من تحقيق التميز الأكاديمي وبناء شخصية قوية والمساهمة الإيجابية في المجتمع.",
      order: 1,
      isVisible: true,
      page: "about",
    },
    {
      key: "values",
      titleEn: "Our Values",
      titleAr: "قيمنا",
      contentEn:
        "Excellence, Integrity, Innovation, Respect, Community, Leadership",
      contentAr: "التميّز، النزاهة، الابتكار، الاحترام، المجتمع، القيادة",
      order: 2,
      isVisible: true,
      page: "about",
    },
    // ─── About Core Values ────────────────────────────
    { key: 'value-excellence', page: 'about-values', titleEn: 'Excellence', titleAr: 'التميّز', contentEn: 'Striving for the highest standards in everything we do.', contentAr: 'السعي لأعلى المعايير في كل ما نقوم به.', order: 0, isVisible: true },
    { key: 'value-innovation', page: 'about-values', titleEn: 'Innovation', titleAr: 'الابتكار', contentEn: 'Embracing creativity and modern approaches to education.', contentAr: 'تبنّي الإبداع والمناهج الحديثة في التعليم.', order: 1, isVisible: true },
    { key: 'value-integrity', page: 'about-values', titleEn: 'Integrity', titleAr: 'النزاهة', contentEn: 'Building trust through honesty, transparency and accountability.', contentAr: 'بناء الثقة من خلال الصدق والشفافية والمسؤولية.', order: 2, isVisible: true },
    { key: 'value-community', page: 'about-values', titleEn: 'Community', titleAr: 'المجتمع', contentEn: 'Fostering a caring and inclusive school community.', contentAr: 'تعزيز مجتمع مدرسي رعاية وشامل.', order: 3, isVisible: true },
    { key: 'value-growth', page: 'about-values', titleEn: 'Growth', titleAr: 'النمو', contentEn: 'Nurturing lifelong learners who thrive beyond the classroom.', contentAr: 'رعاية متعلمين مدى الحياة يتفوقون خارج الفصل الدراسي.', order: 4, isVisible: true },
    { key: 'value-respect', page: 'about-values', titleEn: 'Respect', titleAr: 'الاحترام', contentEn: 'Valuing diversity, dignity, and mutual respect.', contentAr: 'تقدير التنوع والكرامة والاحترام المتبادل.', order: 5, isVisible: true },
    // ─── About Milestones ─────────────────────────────
    { key: 'milestone-2014', page: 'about-milestones', subtitleEn: '2014', subtitleAr: '2014', titleEn: 'Founded', titleAr: 'التأسيس', contentEn: 'MEYLOR International School was established in Jeddah.', contentAr: 'تأسست مدرسة ميلور العالمية في جدة.', order: 0, isVisible: true },
    { key: 'milestone-2016', page: 'about-milestones', subtitleEn: '2016', subtitleAr: '2016', titleEn: 'First Graduation', titleAr: 'أول تخريج', contentEn: 'Our first cohort of students graduated with distinction.', contentAr: 'تخرّج أول فوج من طلابنا بتفوّق.', order: 1, isVisible: true },
    { key: 'milestone-2019', page: 'about-milestones', subtitleEn: '2019', subtitleAr: '2019', titleEn: 'Expansion', titleAr: 'التوسّع', contentEn: 'New state-of-the-art campus wing opened with innovation hub.', contentAr: 'افتتاح جناح جديد بأحدث التقنيات ومركز الابتكار.', order: 2, isVisible: true },
    { key: 'milestone-2022', page: 'about-milestones', subtitleEn: '2022', subtitleAr: '2022', titleEn: 'Accreditation', titleAr: 'الاعتماد', contentEn: 'Received international accreditation for academic excellence.', contentAr: 'حصلنا على الاعتماد الدولي للتميّز الأكاديمي.', order: 3, isVisible: true },
    { key: 'milestone-2025', page: 'about-milestones', subtitleEn: '2025', subtitleAr: '2025', titleEn: '1200+ Students', titleAr: '١٢٠٠+ طالب', contentEn: 'Growing strong with over 1,200 students and 150+ faculty.', contentAr: 'نمو قوي مع أكثر من ١٢٠٠ طالب و١٥٠+ من أعضاء الهيئة التعليمية.', order: 4, isVisible: true },
    // ─── About Why Choose Features ────────────────────
    { key: 'feature-curriculum', page: 'about-features', titleEn: 'Bilingual Curriculum', titleAr: 'منهج ثنائي اللغة', contentEn: 'Combining the best of Arabic and international curricula.', contentAr: 'الجمع بين أفضل المناهج العربية والدولية.', order: 0, isVisible: true },
    { key: 'feature-faculty', page: 'about-features', titleEn: 'Qualified Faculty', titleAr: 'هيئة تعليمية مؤهلة', contentEn: '150+ internationally certified teachers and specialists.', contentAr: '١٥٠+ معلّم ومتخصص معتمد دولياً.', order: 1, isVisible: true },
    { key: 'feature-innovation', page: 'about-features', titleEn: 'Innovation Hub', titleAr: 'مركز الابتكار', contentEn: 'State-of-the-art robotics, coding, and STEM facilities.', contentAr: 'أحدث مرافق الروبوتات والبرمجة وعلوم STEM.', order: 2, isVisible: true },
    { key: 'feature-safe', page: 'about-features', titleEn: 'Safe Environment', titleAr: 'بيئة آمنة', contentEn: 'A nurturing, secure campus designed for student wellbeing.', contentAr: 'حرم مدرسي آمن ومصمّم لرفاهية الطلاب.', order: 3, isVisible: true },
  ]);
  console.log("✓ Sections created");

  // ─── Programs ─────────────────────────────────────────────────
  await Program.insertMany([
    {
      titleEn: "Kindergarten",
      titleAr: "مرحلة الروضة",
      slug: "kindergarten",
      descriptionEn:
        "Our kindergarten program provides a nurturing environment where young learners develop foundational skills through play-based learning, creative activities, and social interaction.",
      descriptionAr:
        "يوفر برنامج الروضة لدينا بيئة حاضنة يطوّر فيها المتعلمون الصغار مهاراتهم الأساسية من خلال التعلم القائم على اللعب والأنشطة الإبداعية والتفاعل الاجتماعي.",
      highlightsEn: [
        "Play-based learning",
        "Arabic & English foundation",
        "Social skills development",
        "Creative arts & music",
        "Safe & nurturing environment",
      ],
      highlightsAr: [
        "التعلم القائم على اللعب",
        "أساسيات العربية والإنجليزية",
        "تنمية المهارات الاجتماعية",
        "الفنون الإبداعية والموسيقى",
        "بيئة آمنة وحاضنة",
      ],
      imageUrl:
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
      gradeRange: "KG1 - KG3",
      ageRange: "3 - 6 years",
      classSize: "20 students max",
      curriculumEn: "Our kindergarten follows an integrated play-based approach combining the Saudi Ministry of Education framework with international early childhood standards. Children learn through hands-on activities, stories, songs, and guided play.",
      curriculumAr: "تتبع الروضة نهجًا تكامليًا قائمًا على اللعب يجمع بين إطار وزارة التعليم السعودية والمعايير الدولية للطفولة المبكرة. يتعلم الأطفال من خلال الأنشطة العملية والقصص والأغاني واللعب الموجه.",
      scheduleEn: "Sunday - Thursday, 7:00 AM - 1:30 PM",
      scheduleAr: "الأحد - الخميس، ٧:٠٠ ص - ١:٣٠ م",
      extracurricularsEn: ["Arts & Crafts", "Music & Movement", "Swimming", "Nature Exploration", "Storytelling"],
      extracurricularsAr: ["الفنون والأشغال اليدوية", "الموسيقى والحركة", "السباحة", "استكشاف الطبيعة", "رواية القصص"],
      order: 0,
    },
    {
      titleEn: "Primary School",
      titleAr: "المرحلة الابتدائية",
      slug: "primary",
      descriptionEn:
        "Building strong academic foundations with an engaging curriculum that fosters curiosity, critical thinking, and a love for learning in grades 1 through 6.",
      descriptionAr:
        "بناء أسس أكاديمية قوية بمنهج تفاعلي يعزز الفضول والتفكير النقدي وحب التعلم من الصف الأول إلى السادس.",
      highlightsEn: [
        "Comprehensive curriculum",
        "STEM education",
        "Language proficiency",
        "Character education",
        "Extracurricular activities",
      ],
      highlightsAr: [
        "منهج شامل",
        "تعليم العلوم والتكنولوجيا",
        "إتقان اللغات",
        "تربية الشخصية",
        "أنشطة لا صفية",
      ],
      imageUrl:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
      gradeRange: "Grade 1 - Grade 6",
      ageRange: "6 - 12 years",
      classSize: "25 students max",
      curriculumEn: "A comprehensive bilingual curriculum combining the Saudi national framework with Cambridge Primary standards. Strong emphasis on literacy, numeracy, science, and Islamic studies alongside English language development.",
      curriculumAr: "منهج ثنائي اللغة شامل يجمع بين الإطار الوطني السعودي ومعايير كامبريدج للمرحلة الابتدائية. تركيز قوي على القراءة والحساب والعلوم والدراسات الإسلامية إلى جانب تطوير اللغة الإنجليزية.",
      scheduleEn: "Sunday - Thursday, 7:00 AM - 2:30 PM",
      scheduleAr: "الأحد - الخميس، ٧:٠٠ ص - ٢:٣٠ م",
      extracurricularsEn: ["Robotics Club", "Football", "Art Studio", "Quran Circle", "Science Experiments"],
      extracurricularsAr: ["نادي الروبوتات", "كرة القدم", "استوديو الفنون", "حلقة القرآن", "التجارب العلمية"],
      order: 1,
    },
    {
      titleEn: "Middle School",
      titleAr: "المرحلة المتوسطة",
      slug: "middle",
      descriptionEn:
        "Preparing students for the challenges ahead with a rigorous academic program combined with character development and leadership opportunities.",
      descriptionAr:
        "إعداد الطلاب لتحديات المستقبل ببرنامج أكاديمي متقدم يجمع بين بناء الشخصية وفرص القيادة.",
      highlightsEn: [
        "Advanced academics",
        "Research skills",
        "Leadership programs",
        "Sports & athletics",
        "Technology integration",
      ],
      highlightsAr: [
        "أكاديميات متقدمة",
        "مهارات البحث",
        "برامج القيادة",
        "الرياضة والألعاب",
        "دمج التكنولوجيا",
      ],
      imageUrl:
        "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80",
      gradeRange: "Grade 7 - Grade 9",
      ageRange: "12 - 15 years",
      classSize: "28 students max",
      curriculumEn: "An advanced bilingual program with a focus on STEM, critical thinking, and research skills. Students are prepared for the rigors of high school through project-based learning and collaborative inquiry.",
      curriculumAr: "برنامج متقدم ثنائي اللغة يركز على العلوم والتكنولوجيا والتفكير النقدي ومهارات البحث. يُعدّ الطلاب لتحديات المرحلة الثانوية من خلال التعلم القائم على المشاريع والاستقصاء التعاوني.",
      scheduleEn: "Sunday - Thursday, 7:00 AM - 3:00 PM",
      scheduleAr: "الأحد - الخميس، ٧:٠٠ ص - ٣:٠٠ م",
      extracurricularsEn: ["Debate Club", "Basketball", "Coding Lab", "Community Service", "Student Council"],
      extracurricularsAr: ["نادي المناظرات", "كرة السلة", "مختبر البرمجة", "خدمة المجتمع", "مجلس الطلاب"],
      order: 2,
    },
    {
      titleEn: "High School",
      titleAr: "المرحلة الثانوية",
      slug: "high-school",
      descriptionEn:
        "Our high school program offers college-preparatory education with diverse electives, AP courses, and career guidance to shape future leaders and innovators.",
      descriptionAr:
        "يقدم برنامج المرحلة الثانوية تعليمًا تحضيريًا للجامعة مع مقررات اختيارية متنوعة ومواد متقدمة وتوجيه مهني لتشكيل قادة ومبتكري المستقبل.",
      highlightsEn: [
        "College preparation",
        "AP courses",
        "Career counseling",
        "Community service",
        "University partnerships",
      ],
      highlightsAr: [
        "التحضير الجامعي",
        "مقررات متقدمة",
        "الإرشاد المهني",
        "خدمة المجتمع",
        "شراكات جامعية",
      ],
      imageUrl:
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80",
      gradeRange: "Grade 10 - Grade 12",
      ageRange: "15 - 18 years",
      classSize: "30 students max",
      curriculumEn: "A college-preparatory program offering AP courses, SAT preparation, and career guidance. Students choose from science and humanities tracks with extensive research projects and university partnerships.",
      curriculumAr: "برنامج تحضيري للجامعة يقدم مقررات متقدمة وتحضير اختبار القدرات وإرشاد مهني. يختار الطلاب من مسارات العلوم والإنسانيات مع مشاريع بحثية مكثفة وشراكات جامعية.",
      scheduleEn: "Sunday - Thursday, 7:00 AM - 3:00 PM",
      scheduleAr: "الأحد - الخميس، ٧:٠٠ ص - ٣:٠٠ م",
      extracurricularsEn: ["Model United Nations", "Entrepreneurship Club", "Advanced Robotics", "Volunteering Program", "SAT Prep Sessions"],
      extracurricularsAr: ["نموذج الأمم المتحدة", "نادي ريادة الأعمال", "الروبوتات المتقدمة", "برنامج التطوع", "جلسات تحضير القدرات"],
      order: 3,
    },
  ]);
  console.log("✓ Programs created");

  // ─── Facilities ───────────────────────────────────────────────
  await Facility.insertMany([
    {
      titleEn: "Smart Classrooms",
      titleAr: "فصول ذكية",
      descriptionEn:
        "Technology-enhanced classrooms with interactive displays, modern furniture, and optimal learning environments.",
      descriptionAr:
        "فصول مُعزّزة بالتكنولوجيا مع شاشات تفاعلية وأثاث حديث وبيئات تعلم مثالية.",
      imageUrl:
        "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80",
      order: 0,
    },
    {
      titleEn: "Science Laboratories",
      titleAr: "المختبرات العلمية",
      descriptionEn:
        "Fully equipped physics, chemistry, and biology labs for hands-on scientific exploration.",
      descriptionAr:
        "مختبرات فيزياء وكيمياء وأحياء مجهزة بالكامل للاستكشاف العلمي العملي.",
      imageUrl:
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80",
      order: 1,
    },
    {
      titleEn: "Sports Complex",
      titleAr: "المجمع الرياضي",
      descriptionEn:
        "Indoor and outdoor sports facilities including a swimming pool, basketball courts, and football field.",
      descriptionAr:
        "مرافق رياضية داخلية وخارجية تشمل مسبحًا وملاعب كرة سلة وملعب كرة قدم.",
      imageUrl:
        "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80",
      order: 2,
    },
    {
      titleEn: "Library & Media Center",
      titleAr: "المكتبة ومركز الوسائط",
      descriptionEn:
        "A modern library with thousands of books, digital resources, and quiet study areas.",
      descriptionAr:
        "مكتبة حديثة تضم آلاف الكتب والموارد الرقمية ومناطق دراسة هادئة.",
      imageUrl:
        "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&q=80",
      order: 3,
    },
    {
      titleEn: "Innovation Hub",
      titleAr: "مركز الابتكار",
      descriptionEn:
        "A dedicated space for robotics, coding, and creative technology projects.",
      descriptionAr:
        "مساحة مخصصة للروبوتات والبرمجة ومشاريع التكنولوجيا الإبداعية.",
      imageUrl:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80",
      order: 4,
    },
    {
      titleEn: "Performing Arts Theater",
      titleAr: "مسرح الفنون",
      descriptionEn:
        "A professional-grade theater for performances, assemblies, and cultural events.",
      descriptionAr: "مسرح احترافي للعروض والتجمعات والفعاليات الثقافية.",
      imageUrl:
        "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&q=80",
      order: 5,
    },
  ]);
  console.log("✓ Facilities created");

  // ─── Testimonials ─────────────────────────────────────────────
  await Testimonial.insertMany([
    {
      nameEn: "Ahmad Al-Rashid",
      nameAr: "أحمد الراشد",
      roleEn: "Parent",
      roleAr: "ولي أمر",
      contentEn:
        "MEYLOR has exceeded our expectations. The teachers are dedicated, the facilities are world-class, and our children are thriving academically and socially.",
      contentAr:
        "فاقت مدرسة ميلور توقعاتنا. المعلمون متفانون والمرافق عالمية المستوى وأطفالنا يزدهرون أكاديميًا واجتماعيًا.",
      rating: 5,
      order: 0,
      isApproved: true,
    },
    {
      nameEn: "Sara Al-Harbi",
      nameAr: "سارة الحربي",
      roleEn: "Parent",
      roleAr: "ولية أمر",
      contentEn:
        "The bilingual program is exceptional. My daughter is now fluent in both Arabic and English, and her confidence has grown tremendously.",
      contentAr:
        "البرنامج ثنائي اللغة استثنائي. ابنتي الآن تتحدث العربية والإنجليزية بطلاقة، وثقتها بنفسها نمت بشكل كبير.",
      rating: 5,
      order: 1,
      isApproved: true,
    },
    {
      nameEn: "Mohammed Al-Zahrani",
      nameAr: "محمد الزهراني",
      roleEn: "Alumni",
      roleAr: "خريج",
      contentEn:
        "MEYLOR prepared me for university better than I could have imagined. The critical thinking skills and leadership opportunities shaped who I am today.",
      contentAr:
        "أعدتني ميلور للجامعة بشكل أفضل مما كنت أتخيل. مهارات التفكير النقدي وفرص القيادة شكّلت شخصيتي اليوم.",
      rating: 5,
      order: 2,
      isApproved: true,
    },
    {
      nameEn: "Fatima Al-Qahtani",
      nameAr: "فاطمة القحطاني",
      roleEn: "Parent",
      roleAr: "ولية أمر",
      contentEn:
        "The care and attention each student receives at MEYLOR is remarkable. It truly feels like a second family for our children.",
      contentAr:
        "الرعاية والاهتمام الذي يحظى به كل طالب في ميلور رائع. إنها حقًا بمثابة عائلة ثانية لأطفالنا.",
      rating: 5,
      order: 3,
      isApproved: true,
    },
    {
      nameEn: "Khalid Al-Otaibi",
      nameAr: "خالد العتيبي",
      roleEn: "Parent",
      roleAr: "ولي أمر",
      contentEn:
        "Outstanding school with a perfect balance of academics and extracurricular activities. The STEM program is particularly impressive.",
      contentAr:
        "مدرسة متميزة بتوازن مثالي بين الأكاديميات والأنشطة اللاصفية. برنامج العلوم والتكنولوجيا مثير للإعجاب بشكل خاص.",
      rating: 5,
      order: 4,
      isApproved: true,
    },
    {
      nameEn: "Noura Al-Shehri",
      nameAr: "نورة الشهري",
      roleEn: "Teacher",
      roleAr: "معلمة",
      contentEn:
        "As an educator, working at MEYLOR is a privilege. The school supports innovation in teaching and provides resources that make a real difference.",
      contentAr:
        "كمعلمة، العمل في ميلور شرف كبير. المدرسة تدعم الابتكار في التعليم وتوفر موارد تُحدث فرقًا حقيقيًا.",
      rating: 5,
      order: 5,
      isApproved: true,
    },
  ]);
  console.log("✓ Testimonials created");

  // ─── News Posts ───────────────────────────────────────────────
  const newsDates = [
    new Date("2026-02-28"),
    new Date("2026-02-20"),
    new Date("2026-02-15"),
    new Date("2026-02-10"),
    new Date("2026-01-30"),
    new Date("2026-01-20"),
    new Date("2026-01-10"),
    new Date("2025-12-20"),
  ];

  await NewsPost.insertMany([
    {
      titleEn: "MEYLOR Students Win National Science Competition",
      titleAr: "طلاب ميلور يفوزون بمسابقة العلوم الوطنية",
      slug: "national-science-competition-win",
      excerptEn:
        "Our students achieved first place in the national science olympiad, showcasing exceptional talent and dedication.",
      excerptAr:
        "حقق طلابنا المركز الأول في أولمبياد العلوم الوطني، مظهرين موهبة استثنائية وتفانيًا.",
      contentEn:
        "We are proud to announce that MEYLOR School students have won first place in the National Science Olympiad...",
      contentAr:
        "نفخر بالإعلان عن فوز طلاب مدرسة ميلور بالمركز الأول في أولمبياد العلوم الوطني...",
      imageUrl:
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
      categoryEn: "Achievement",
      categoryAr: "إنجاز",
      publishedAt: newsDates[0],
    },
    {
      titleEn: "New Innovation Hub Opening Ceremony",
      titleAr: "حفل افتتاح مركز الابتكار الجديد",
      slug: "innovation-hub-opening",
      excerptEn:
        "MEYLOR unveils its new state-of-the-art Innovation Hub equipped with the latest technology.",
      excerptAr: "ميلور تكشف عن مركز الابتكار الجديد المجهز بأحدث التقنيات.",
      contentEn:
        "MEYLOR School is thrilled to open its brand new Innovation Hub, a cutting-edge facility designed to inspire creativity...",
      contentAr:
        "يسعد مدرسة ميلور افتتاح مركز الابتكار الجديد، وهو مرفق متطور مصمم لإلهام الإبداع...",
      imageUrl:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
      categoryEn: "Campus",
      categoryAr: "الحرم المدرسي",
      publishedAt: newsDates[1],
    },
    {
      titleEn: "Annual Sports Day Celebrations",
      titleAr: "احتفالات يوم الرياضة السنوي",
      slug: "annual-sports-day",
      excerptEn:
        "Students showcase their athletic abilities in our annual sports day event.",
      excerptAr: "يستعرض الطلاب قدراتهم الرياضية في فعالية يوم الرياضة السنوي.",
      contentEn:
        "The annual MEYLOR Sports Day was a spectacular event filled with friendly competition and school spirit...",
      contentAr:
        "كان يوم ميلور الرياضي السنوي فعالية رائعة مليئة بالمنافسة الودية والروح المدرسية...",
      imageUrl:
        "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80",
      categoryEn: "Events",
      categoryAr: "فعاليات",
      publishedAt: newsDates[2],
    },
    {
      titleEn: "Partnership with King Abdullah University",
      titleAr: "شراكة مع جامعة الملك عبدالله",
      slug: "kaust-partnership",
      excerptEn:
        "MEYLOR announces a strategic partnership to enhance STEM education.",
      excerptAr:
        "ميلور تعلن عن شراكة استراتيجية لتعزيز تعليم العلوم والتكنولوجيا.",
      contentEn:
        "We are pleased to announce our new partnership with KAUST to bring advanced STEM resources to our students...",
      contentAr:
        "يسرنا الإعلان عن شراكتنا الجديدة مع كاوست لجلب موارد متقدمة في العلوم والتكنولوجيا لطلابنا...",
      imageUrl:
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
      categoryEn: "Partnerships",
      categoryAr: "شراكات",
      publishedAt: newsDates[3],
    },
    {
      titleEn: "Cultural Festival Highlights",
      titleAr: "أبرز فعاليات المهرجان الثقافي",
      slug: "cultural-festival",
      excerptEn:
        "Students celebrate diversity through music, art, and traditional performances.",
      excerptAr:
        "يحتفل الطلاب بالتنوع من خلال الموسيقى والفن والعروض التقليدية.",
      contentEn:
        "Our annual cultural festival brought together students, parents, and community members for a vibrant celebration...",
      contentAr:
        "جمع مهرجاننا الثقافي السنوي الطلاب وأولياء الأمور وأفراد المجتمع في احتفال نابض بالحياة...",
      imageUrl:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
      categoryEn: "Events",
      categoryAr: "فعاليات",
      publishedAt: newsDates[4],
    },
    {
      titleEn: "MEYLOR Achieves International Accreditation",
      titleAr: "ميلور تحصل على الاعتماد الدولي",
      slug: "international-accreditation",
      excerptEn:
        "MEYLOR School receives prestigious international accreditation for educational excellence.",
      excerptAr: "حصلت مدرسة ميلور على اعتماد دولي مرموق للتميز التعليمي.",
      contentEn:
        "We are honored to announce that MEYLOR School has been awarded international accreditation...",
      contentAr: "يشرفنا الإعلان عن حصول مدرسة ميلور على الاعتماد الدولي...",
      imageUrl:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
      categoryEn: "Achievement",
      categoryAr: "إنجاز",
      publishedAt: newsDates[5],
    },
    {
      titleEn: "Robotics Team Advances to Regionals",
      titleAr: "فريق الروبوتات يتأهل للبطولة الإقليمية",
      slug: "robotics-regionals",
      excerptEn:
        "Our robotics team qualifies for the regional competition after an outstanding performance.",
      excerptAr:
        "يتأهل فريق الروبوتات لدينا للمسابقة الإقليمية بعد أداء متميز.",
      contentEn:
        "The MEYLOR Robotics Team has qualified for the Saudi Regional Robotics Competition...",
      contentAr:
        "تأهل فريق ميلور للروبوتات لمسابقة الروبوتات الإقليمية السعودية...",
      imageUrl:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
      categoryEn: "Achievement",
      categoryAr: "إنجاز",
      publishedAt: newsDates[6],
    },
    {
      titleEn: "Semester 2 Registration Now Open",
      titleAr: "التسجيل للفصل الثاني مفتوح الآن",
      slug: "semester-2-registration",
      excerptEn:
        "Secure your child's spot for the upcoming semester. Limited seats available.",
      excerptAr: "احجز مقعد طفلك للفصل القادم. المقاعد محدودة.",
      contentEn:
        "Registration for Semester 2 is now open. We encourage parents to register early as seats are limited...",
      contentAr:
        "التسجيل للفصل الدراسي الثاني مفتوح الآن. ننصح أولياء الأمور بالتسجيل مبكرًا حيث المقاعد محدودة...",
      imageUrl:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
      categoryEn: "Admissions",
      categoryAr: "القبول",
      publishedAt: newsDates[7],
    },
  ]);
  console.log("✓ News posts created");

  // ─── Gallery Activities ───────────────────────────────────────
  const galleryPhotos: Record<string, string[]> = {
    nd: [
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80",
      "https://images.unsplash.com/photo-1540479859555-17af45c78602?w=800&q=80",
      "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&q=80",
      "https://images.unsplash.com/photo-1560785496-3c9d27877182?w=800&q=80",
      "https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?w=800&q=80",
      "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=800&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80",
    ],
    sf: [
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
      "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80",
      "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800&q=80",
      "https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800&q=80",
      "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&q=80",
      "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&q=80",
      "https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=800&q=80",
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
    ],
    jwf: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
      "https://images.unsplash.com/photo-1504681869696-d977211a5f4c?w=800&q=80",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    ],
    art: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
      "https://images.unsplash.com/photo-1456086272160-b28b0645b729?w=800&q=80",
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80",
      "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&q=80",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
      "https://images.unsplash.com/photo-1602052577122-f73b9710adba?w=800&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    ],
    grad: [
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80",
      "https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?w=800&q=80",
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
      "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80",
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80",
    ],
  };

  const sampleMedia = (prefix: string) =>
    (galleryPhotos[prefix] || galleryPhotos.nd).map((url, i) => ({
      url,
      type: "image" as const,
      captionEn: `Photo ${i + 1}`,
      captionAr: `صورة ${i + 1}`,
      order: i,
    }));

  await GalleryActivity.insertMany([
    {
      titleEn: "National Day Celebration 2026",
      titleAr: "احتفال اليوم الوطني 2026",
      slug: "national-day-2026",
      descriptionEn:
        "Students and staff celebrate Saudi National Day with patriotic activities and performances.",
      descriptionAr:
        "يحتفل الطلاب والموظفون باليوم الوطني السعودي بأنشطة وعروض وطنية.",
      date: new Date("2025-09-23"),
      locationEn: "MEYLOR School",
      locationAr: "مدرسة ميلور",
      isInsideSchool: true,
      coverImageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80",
      media: sampleMedia("nd"),
      order: 0,
    },
    {
      titleEn: "Science Fair 2026",
      titleAr: "معرض العلوم 2026",
      slug: "science-fair-2026",
      descriptionEn:
        "Annual science fair showcasing innovative student projects across all grade levels.",
      descriptionAr:
        "معرض العلوم السنوي يعرض مشاريع الطلاب المبتكرة في جميع المراحل.",
      date: new Date("2026-01-15"),
      locationEn: "MEYLOR School",
      locationAr: "مدرسة ميلور",
      isInsideSchool: true,
      coverImageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
      media: sampleMedia("sf"),
      order: 1,
    },
    {
      titleEn: "Field Trip to Jeddah Waterfront",
      titleAr: "رحلة ميدانية إلى واجهة جدة البحرية",
      slug: "jeddah-waterfront-trip",
      descriptionEn:
        "Students explore the beautiful Jeddah Waterfront during an educational field trip.",
      descriptionAr:
        "يستكشف الطلاب واجهة جدة البحرية الجميلة خلال رحلة ميدانية تعليمية.",
      date: new Date("2026-02-10"),
      locationEn: "Jeddah Waterfront",
      locationAr: "واجهة جدة البحرية",
      isInsideSchool: false,
      coverImageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      media: sampleMedia("jwf"),
      order: 2,
    },
    {
      titleEn: "Art Exhibition",
      titleAr: "معرض الفنون",
      slug: "art-exhibition-2026",
      descriptionEn:
        "A stunning display of student artwork from all departments.",
      descriptionAr: "عرض مذهل لأعمال الطلاب الفنية من جميع الأقسام.",
      date: new Date("2026-02-20"),
      locationEn: "MEYLOR School",
      locationAr: "مدرسة ميلور",
      isInsideSchool: true,
      coverImageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
      media: sampleMedia("art"),
      order: 3,
    },
    {
      titleEn: "Graduation Ceremony 2025",
      titleAr: "حفل التخرج 2025",
      slug: "graduation-2025",
      descriptionEn:
        "Celebrating the achievements of our graduating class of 2025.",
      descriptionAr: "الاحتفاء بإنجازات دفعة التخرج لعام 2025.",
      date: new Date("2025-06-15"),
      locationEn: "MEYLOR School",
      locationAr: "مدرسة ميلور",
      isInsideSchool: true,
      coverImageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80",
      media: sampleMedia("grad"),
      order: 4,
    },
  ]);
  console.log("✓ Gallery activities created");

  // ─── Journey Items ────────────────────────────────────────────
  await JourneyItem.insertMany([
    {
      titleEn: "Land Acquisition",
      titleAr: "الحصول على الأرض",
      descriptionEn:
        "Secured the perfect location in Al-Naeem District, Jeddah for our new campus.",
      descriptionAr:
        "تأمين الموقع المثالي في حي النعيم بجدة لحرمنا المدرسي الجديد.",
      date: "2023",
      beforeImageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
      afterImageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
      order: 0,
    },
    {
      titleEn: "Foundation & Structure",
      titleAr: "الأساسات والهيكل",
      descriptionEn:
        "Construction began with a strong foundation designed to support world-class facilities.",
      descriptionAr: "بدأ البناء بأساسات قوية مصممة لدعم مرافق عالمية المستوى.",
      date: "2023",
      beforeImageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
      afterImageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80",
      order: 1,
    },
    {
      titleEn: "Building Takes Shape",
      titleAr: "المبنى يأخذ شكله",
      descriptionEn:
        "The main building structure rises, showcasing our modern architectural vision.",
      descriptionAr:
        "يرتفع هيكل المبنى الرئيسي، ليُظهر رؤيتنا المعمارية الحديثة.",
      date: "2024",
      beforeImageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
      afterImageUrl: "https://images.unsplash.com/photo-1562516155-e0c1ee44059b?w=800&q=80",
      order: 2,
    },
    {
      titleEn: "Interior Design & Finishing",
      titleAr: "التصميم الداخلي والتشطيبات",
      descriptionEn:
        "Premium interior finishing with smart classroom technology and modern aesthetics.",
      descriptionAr:
        "تشطيبات داخلية فاخرة مع تكنولوجيا الفصول الذكية وجماليات حديثة.",
      date: "2024",
      beforeImageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      afterImageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
      order: 3,
    },
    {
      titleEn: "Landscape & Outdoor Areas",
      titleAr: "المناظر الطبيعية والمناطق الخارجية",
      descriptionEn:
        "Beautiful landscaping, sports fields, and outdoor learning spaces completed.",
      descriptionAr:
        "تم الانتهاء من المناظر الطبيعية الجميلة والملاعب الرياضية ومساحات التعلم الخارجية.",
      date: "2025",
      beforeImageUrl: "https://images.unsplash.com/photo-1497375638960-ca368c7231e4?w=800&q=80",
      afterImageUrl: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
      order: 4,
    },
    {
      titleEn: "Grand Opening",
      titleAr: "الافتتاح الكبير",
      descriptionEn:
        "MEYLOR School opens its doors, ready to shape the future of education in Jeddah.",
      descriptionAr:
        "تفتح مدرسة ميلور أبوابها، مستعدة لتشكيل مستقبل التعليم في جدة.",
      date: "2025",
      beforeImageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
      afterImageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
      order: 5,
    },
  ]);
  console.log("✓ Journey items created");

  // ─── Pricing Packages ─────────────────────────────────────────
  await PricingPackage.insertMany([
    {
      titleEn: "Kindergarten",
      titleAr: "الروضة",
      descriptionEn:
        "Complete kindergarten program with all-inclusive activities.",
      descriptionAr: "برنامج الروضة الكامل مع جميع الأنشطة.",
      price: "25,000",
      currency: "SAR",
      period: "year",
      featuresEn: [
        "Full-day program",
        "Meals included",
        "Transportation available",
        "Extracurricular activities",
        "Parent portal access",
      ],
      featuresAr: [
        "برنامج يوم كامل",
        "الوجبات مشمولة",
        "النقل متاح",
        "أنشطة لا صفية",
        "بوابة أولياء الأمور",
      ],
      highlightedFeatures: [0, 1],
      order: 0,
    },
    {
      titleEn: "Primary",
      titleAr: "الابتدائية",
      descriptionEn:
        "Comprehensive primary education with enhanced curriculum.",
      descriptionAr: "تعليم ابتدائي شامل بمنهج معزّز.",
      price: "30,000",
      currency: "SAR",
      period: "year",
      featuresEn: [
        "Bilingual curriculum",
        "STEM focus",
        "Sports program",
        "Arts & music",
        "After-school care",
      ],
      featuresAr: [
        "منهج ثنائي اللغة",
        "تركيز على العلوم والتكنولوجيا",
        "برنامج رياضي",
        "فنون وموسيقى",
        "رعاية بعد المدرسة",
      ],
      highlightedFeatures: [0, 1],
      order: 1,
    },
    {
      titleEn: "Middle School",
      titleAr: "المتوسطة",
      descriptionEn:
        "Advanced middle school program preparing for academic excellence.",
      descriptionAr: "برنامج متوسط متقدم يحضّر للتميز الأكاديمي.",
      price: "35,000",
      currency: "SAR",
      period: "year",
      featuresEn: [
        "Advanced curriculum",
        "Lab access",
        "Leadership program",
        "Career guidance",
        "Club activities",
      ],
      featuresAr: [
        "منهج متقدم",
        "استخدام المختبرات",
        "برنامج القيادة",
        "إرشاد مهني",
        "أنشطة الأندية",
      ],
      highlightedFeatures: [0, 2],
      isPopular: true,
      order: 2,
    },
    {
      titleEn: "High School",
      titleAr: "الثانوية",
      descriptionEn:
        "College-preparatory program with AP courses and university counseling.",
      descriptionAr: "برنامج تحضيري للجامعة مع مقررات متقدمة وإرشاد جامعي.",
      price: "40,000",
      currency: "SAR",
      period: "year",
      featuresEn: [
        "AP courses",
        "University counseling",
        "Research projects",
        "Internship opportunities",
        "SAT preparation",
      ],
      featuresAr: [
        "مقررات متقدمة",
        "إرشاد جامعي",
        "مشاريع بحثية",
        "فرص تدريب",
        "تحضير اختبار القدرات",
      ],
      highlightedFeatures: [0, 1, 4],
      order: 3,
    },
  ]);
  console.log("✓ Pricing packages created");

  // ─── Job Posts ────────────────────────────────────────────────
  await JobPost.insertMany([
    {
      titleEn: "Mathematics Teacher",
      titleAr: "معلم رياضيات",
      slug: "mathematics-teacher",
      descriptionEn:
        "We are looking for an experienced Mathematics teacher to join our middle and high school department.",
      descriptionAr:
        "نبحث عن معلم رياضيات ذي خبرة للانضمام إلى قسم المرحلة المتوسطة والثانوية.",
      requirementsEn: [
        "Bachelor's in Mathematics or Education",
        "3+ years teaching experience",
        "Fluent in English",
        "Experience with modern teaching methods",
      ],
      requirementsAr: [
        "بكالوريوس في الرياضيات أو التربية",
        "خبرة تدريس 3 سنوات أو أكثر",
        "إتقان اللغة الإنجليزية",
        "خبرة بأساليب التدريس الحديثة",
      ],
      departmentEn: "Academics",
      departmentAr: "الأكاديميات",
      typeEn: "Full-time",
      typeAr: "دوام كامل",
      locationEn: "Jeddah, Saudi Arabia",
      locationAr: "جدة، المملكة العربية السعودية",
      qualificationsEn: ["Bachelor's or Master's in Mathematics", "Valid teaching license", "Proficiency in educational technology"],
      qualificationsAr: ["بكالوريوس أو ماجستير في الرياضيات", "رخصة تدريس سارية", "إتقان تقنيات التعليم"],
      benefitsEn: ["Competitive salary", "Health insurance", "Annual flight allowance", "Professional development", "Housing assistance"],
      benefitsAr: ["راتب تنافسي", "تأمين صحي", "بدل سفر سنوي", "تطوير مهني", "مساعدة في السكن"],
      salaryRange: "12,000 - 18,000 SAR/month",
      experienceRequired: "3+ years",
    },
    {
      titleEn: "English Language Teacher",
      titleAr: "معلم لغة إنجليزية",
      slug: "english-teacher",
      descriptionEn:
        "Seeking a qualified English Language teacher with experience in bilingual education.",
      descriptionAr:
        "نبحث عن معلم لغة إنجليزية مؤهل لديه خبرة في التعليم ثنائي اللغة.",
      requirementsEn: [
        "Bachelor's in English or TESOL",
        "2+ years experience",
        "Native or near-native fluency",
        "Creative teaching approach",
      ],
      requirementsAr: [
        "بكالوريوس في اللغة الإنجليزية أو تعليم اللغة",
        "خبرة سنتين أو أكثر",
        "إتقان شبه أصلي للغة",
        "نهج تدريس إبداعي",
      ],
      departmentEn: "Academics",
      departmentAr: "الأكاديميات",
    },
    {
      titleEn: "IT & Innovation Coordinator",
      titleAr: "منسق تقنية المعلومات والابتكار",
      slug: "it-coordinator",
      descriptionEn:
        "Join our team to lead technology integration and innovation programs across the school.",
      descriptionAr:
        "انضم إلى فريقنا لقيادة برامج دمج التكنولوجيا والابتكار في المدرسة.",
      requirementsEn: [
        "Bachelor's in IT or Computer Science",
        "Experience in educational technology",
        "Strong communication skills",
        "Project management experience",
      ],
      requirementsAr: [
        "بكالوريوس في تقنية المعلومات أو علوم الحاسب",
        "خبرة في تكنولوجيا التعليم",
        "مهارات تواصل قوية",
        "خبرة في إدارة المشاريع",
      ],
      departmentEn: "Technology",
      departmentAr: "التكنولوجيا",
    },
    {
      titleEn: "School Counselor",
      titleAr: "مرشد مدرسي",
      slug: "school-counselor",
      descriptionEn:
        "We need a compassionate school counselor to support student wellbeing and academic guidance.",
      descriptionAr:
        "نحتاج إلى مرشد مدرسي يدعم رفاهية الطلاب والتوجيه الأكاديمي.",
      requirementsEn: [
        "Master's in Counseling or Psychology",
        "3+ years in school counseling",
        "Bilingual preferred",
        "Licensed counselor",
      ],
      requirementsAr: [
        "ماجستير في الإرشاد أو علم النفس",
        "خبرة 3 سنوات في الإرشاد المدرسي",
        "يفضل ثنائي اللغة",
        "مرشد مرخص",
      ],
      departmentEn: "Student Services",
      departmentAr: "خدمات الطلاب",
    },
  ]);
  console.log("✓ Job posts created");

  // ─── FAQs ────────────────────────────────────────────────────
  await FAQ.insertMany([
    {
      questionEn: "What age groups does MEYLOR serve?",
      questionAr: "ما الفئات العمرية التي تخدمها ميلور؟",
      answerEn:
        "MEYLOR International School serves students from KG1 (age 3+) through Grade 12 (age 18). Our programs cover Kindergarten, Primary, Middle, and High School.",
      answerAr:
        "تخدم مدرسة ميلور العالمية الطلاب من الروضة الأولى (عمر ٣+) حتى الصف الثاني عشر (عمر ١٨). تشمل برامجنا الروضة والابتدائية والمتوسطة والثانوية.",
      category: "admissions",
      order: 0,
    },
    {
      questionEn: "What curriculum does MEYLOR follow?",
      questionAr: "ما المنهج الذي تتبعه ميلور؟",
      answerEn:
        "We follow a bilingual curriculum combining the Saudi national curriculum with international best practices, incorporating STEM, arts, and character education.",
      answerAr:
        "نتبع منهجاً ثنائي اللغة يجمع بين المنهج الوطني السعودي وأفضل الممارسات الدولية، مع دمج علوم STEM والفنون وتربية الشخصية.",
      category: "admissions",
      order: 1,
    },
    {
      questionEn: "What are the school hours?",
      questionAr: "ما أوقات الدوام المدرسي؟",
      answerEn:
        "School hours are from 7:00 AM to 2:30 PM, Sunday to Thursday. Extended care and after-school activities are available until 4:00 PM.",
      answerAr:
        "أوقات الدوام من ٧:٠٠ صباحاً حتى ٢:٣٠ مساءً، من الأحد إلى الخميس. تتوفر الرعاية الممتدة والأنشطة بعد المدرسة حتى ٤:٠٠ مساءً.",
      category: "admissions",
      order: 2,
    },
    {
      questionEn: "Is transportation provided?",
      questionAr: "هل تتوفر خدمة النقل؟",
      answerEn:
        "Yes, we offer safe and supervised school bus transportation covering major areas in Jeddah. Routes and schedules are arranged based on demand.",
      answerAr:
        "نعم، نوفر خدمة نقل مدرسي آمنة ومُراقَبة تغطي المناطق الرئيسية في جدة. يتم ترتيب المسارات والجداول حسب الطلب.",
      category: "admissions",
      order: 3,
    },
    {
      questionEn: "Can I visit the school before applying?",
      questionAr: "هل يمكنني زيارة المدرسة قبل التقديم؟",
      answerEn:
        "Absolutely! We welcome campus tours. You can schedule a visit through our contact page or by calling our admissions office.",
      answerAr:
        "بالتأكيد! نرحب بالجولات في الحرم المدرسي. يمكنك جدولة زيارة من خلال صفحة التواصل أو الاتصال بمكتب القبول.",
      category: "admissions",
      order: 4,
    },
    {
      questionEn: "What documents are required for enrollment?",
      questionAr: "ما المستندات المطلوبة للتسجيل؟",
      answerEn:
        "Required documents include: birth certificate, previous school records, immunization records, passport/ID copies, and recent photos. Detailed requirements are provided upon inquiry.",
      answerAr:
        "المستندات المطلوبة تشمل: شهادة الميلاد، السجلات المدرسية السابقة، سجل التطعيمات، نسخ الهوية/الجواز، وصور حديثة. يتم تقديم المتطلبات التفصيلية عند الاستفسار.",
      category: "admissions",
      order: 5,
    },
  ]);
  console.log("✓ FAQs created");

  // ─── Stat Counters ────────────────────────────────────────────
  await StatCounter.insertMany([
    {
      labelEn: "Students",
      labelAr: "طالب وطالبة",
      value: 1200,
      suffix: "+",
      order: 0,
    },
    {
      labelEn: "Teachers",
      labelAr: "معلم ومعلمة",
      value: 150,
      suffix: "+",
      order: 1,
    },
    {
      labelEn: "Years of Excellence",
      labelAr: "سنوات من التميز",
      value: 10,
      suffix: "+",
      order: 2,
    },
    {
      labelEn: "Graduation Rate",
      labelAr: "نسبة التخرج",
      value: 98,
      suffix: "%",
      order: 3,
    },
  ]);
  console.log("✓ Stat counters created");

  // ─── Team Members ───────────────────────────────────────────
  await TeamMember.insertMany([
    // Board of Directors
    { nameEn: 'Dr. Ahmad Al-Rashidi', nameAr: 'د. أحمد الرشيدي', roleEn: 'Chairman of the Board', roleAr: 'رئيس مجلس الإدارة', bioEn: 'Over 25 years of experience in education leadership and strategic management.', bioAr: 'أكثر من ٢٥ عامًا من الخبرة في القيادة التعليمية والإدارة الاستراتيجية.', imageUrl: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'board', order: 0 },
    { nameEn: 'Mrs. Fatima Hassan', nameAr: 'أ. فاطمة حسن', roleEn: 'Vice Chairwoman', roleAr: 'نائبة الرئيس', bioEn: 'Passionate advocate for bilingual education and women empowerment in Saudi Arabia.', bioAr: 'مناصرة شغوفة للتعليم ثنائي اللغة وتمكين المرأة في المملكة العربية السعودية.', imageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'board', order: 1 },
    { nameEn: 'Mr. Khalid Al-Otaibi', nameAr: 'أ. خالد العتيبي', roleEn: 'Board Member', roleAr: 'عضو مجلس الإدارة', bioEn: 'Entrepreneur and philanthropist dedicated to improving education quality.', bioAr: 'رجل أعمال ومحسن مكرّس لتحسين جودة التعليم.', imageUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'board', order: 2 },
    { nameEn: 'Dr. Sarah Al-Zahrani', nameAr: 'د. سارة الزهراني', roleEn: 'Board Member', roleAr: 'عضوة مجلس الإدارة', bioEn: 'PhD in Educational Psychology with a focus on child development.', bioAr: 'دكتوراه في علم النفس التربوي مع تركيز على نمو الطفل.', imageUrl: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'board', order: 3 },
    // Leadership Team
    { nameEn: 'Mr. Omar Badr', nameAr: 'أ. عمر بدر', roleEn: 'School Principal', roleAr: 'مدير المدرسة', bioEn: 'Leading MEYLOR with 15+ years of international school management experience.', bioAr: 'يقود ميلور بخبرة تزيد عن ١٥ عامًا في إدارة المدارس الدولية.', imageUrl: 'https://images.pexels.com/photos/2182975/pexels-photo-2182975.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'leadership', order: 0 },
    { nameEn: 'Mrs. Layla Mansour', nameAr: 'أ. ليلى منصور', roleEn: 'Vice Principal - Academics', roleAr: 'نائبة المدير - الشؤون الأكاديمية', bioEn: 'Expert in curriculum design and teacher development programs.', bioAr: 'خبيرة في تصميم المناهج وبرامج تطوير المعلمين.', imageUrl: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'leadership', order: 1 },
    { nameEn: 'Mr. Faisal Al-Harbi', nameAr: 'أ. فيصل الحربي', roleEn: 'Vice Principal - Operations', roleAr: 'نائب المدير - العمليات', bioEn: 'Ensuring smooth daily operations and maintaining the highest facility standards.', bioAr: 'ضمان سير العمليات اليومية بسلاسة والحفاظ على أعلى معايير المرافق.', imageUrl: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'leadership', order: 2 },
    { nameEn: 'Mrs. Nora Al-Qahtani', nameAr: 'أ. نورة القحطاني', roleEn: 'Head of Student Affairs', roleAr: 'رئيسة شؤون الطلاب', bioEn: 'Dedicated to student wellbeing and creating a positive school culture.', bioAr: 'مكرّسة لرفاهية الطلاب وخلق ثقافة مدرسية إيجابية.', imageUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'leadership', order: 3 },
    { nameEn: 'Dr. Rami Tawfiq', nameAr: 'د. رامي توفيق', roleEn: 'Head of Curriculum', roleAr: 'رئيس المناهج', bioEn: 'PhD holder with extensive experience in bilingual curriculum development.', bioAr: 'حامل دكتوراه مع خبرة واسعة في تطوير المناهج ثنائية اللغة.', imageUrl: 'https://images.pexels.com/photos/936229/pexels-photo-936229.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'leadership', order: 4 },
    { nameEn: 'Mrs. Hana Al-Shehri', nameAr: 'أ. هناء الشهري', roleEn: 'Head of Admissions', roleAr: 'رئيسة القبول والتسجيل', bioEn: 'Guiding families through the enrollment process with care and professionalism.', bioAr: 'توجيه الأسر خلال عملية التسجيل بعناية واحترافية.', imageUrl: 'https://images.pexels.com/photos/1181391/pexels-photo-1181391.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'leadership', order: 5 },
  ]);
  console.log("✓ Team members created");

  console.log("\n✅ Database seeded successfully!");
  console.log(
    `\nAdmin Login:\n  Email: ${process.env.ADMIN_EMAIL || "admin@meylor.sa"}\n  Password: ${process.env.ADMIN_PASSWORD || "ChangeMe123!"}\n`,
  );

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
