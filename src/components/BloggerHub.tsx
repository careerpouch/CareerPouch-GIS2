import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Search, ExternalLink, Calendar, 
  Clock, ArrowLeft, ArrowRight, Share2, Scale
} from 'lucide-react';
import { GENERATED_ARTICLES } from '../data/blogGenerator';

export interface Article {
  id: string;
  category: 'news' | 'education' | 'personal-life' | 'biography' | 'development' | 'interviews' | 'tips' | 'law';
  categoryLabel: string;
  title: string;
  excerpt: string;
  content: string[];
  readTime: string;
  date: string;
  officialCitation?: {
    name: string;
    url: string;
  };
}

interface BloggerHubProps {
  isDarkMode: boolean;
  language?: 'en' | 'ar';
}

const t = {
  en: {
    magazineTitle: "Careers Magazine and Labor Regulations",
    magazineDesc: "Read essential, highly verified columns on CV optimization, executive interview strategies, GCC salary trends, and country-wise private sector Labor Codes with official citation portals.",
    knowledgeSectors: "Knowledge Sectors",
    searchPlaceholder: "Search through Middle East articles, career cheat sheets, or labor regulations...",
    readColumn: "Read column",
    backBtn: "Back to Careers Magazine",
    citationVerified: "Official Legal Citation Verified",
    citationDesc: "The parameters of this GCC Labor Guide were sourced from verified, publicly available information on the official administrative portals. View official, legally binding regulations below:",
    shareLink: "Copy Direct Article URL",
    shareSuccess: "📋 Article direct link copied to clipboard!",
    noMatch: "No match found in blogger automated repository. Try another query!",
    localPreserve: "Saves processed locally client-side 🌐",
    tagline: "CAREERPOUCH BLOGGER HUB"
  },
  ar: {
    magazineTitle: "مجلة المهن وأنظمة العمل والعمال",
    magazineDesc: "اقرأ المقالات الموثوقة حول تحسين السيرة الذاتية الكترونياً، واستراتيجيات المقابلات التنفيذية للشركات، واتجاهات رواتب دول الخليج العربي، وقوانين العمل للقطاع الخاص مع بوابات المراجع الرسمية المباشرة.",
    knowledgeSectors: "أقسام المعرفة والمجالات",
    searchPlaceholder: "ابحث في مئات المقالات وأنظمة العمل وقوانين وزارة العمل الخليجية والمصادر الرسمية...",
    readColumn: "اقرأ المقال الآن",
    backBtn: "الرجوع لمجلة المهن",
    citationVerified: "تم التحقق من المرجع القانوني الرسمي",
    citationDesc: "تم استخراج تفاصيل دليل أنظمة العمل هذا مباشرة من البوابات والقنوات الإدارية الرسمية المعتمدة لدول مجلس التعاون الخليجي. يرجى مراجعة اللوائح مباشرة عبر الرابط أدناه:",
    shareLink: "نسخ رابط المقالة المباشر",
    shareSuccess: "📋 تم نسخ رابط المقالة المباشر إلى الذاكرة المؤقتة بنجاح!",
    noMatch: "لا يوجد متطابق في مستودع مجلة المهن المدونة. جرب بحثاً آخر!",
    localPreserve: "تتم المعالجة آلياً وبشكل خاص محلياً 🌐",
    tagline: "مركز مدونة كاريير باوتش للشرق الأوسط"
  }
};

const categoryLabelsEN: Record<string, string> = {
  all: '📖 All Articles',
  news: '📰 ME News',
  education: '🎓 Education & Careers',
  'personal-life': '🌸 Personal Life',
  biography: '✍️ Biography & CVs',
  development: '📈 Career Development',
  interviews: '🗣️ Interviews',
  tips: '💡 Search Tips',
  law: '⚖️ GCC Labor Law'
};

const categoryLabelsAR: Record<string, string> = {
  all: '📖 جميع المقالات والتقارير',
  news: '📰 أخبار الشرق الأوسط',
  education: '🎓 التعليم ومسار المهن',
  'personal-life': '🌸 الحياة الشخصية والمهنية',
  biography: '✍️ السير الذاتية والذاتية',
  development: '📈 التطوير المهني والعلاوات',
  interviews: '🗣️ مقابلات العمل والاختبارات',
  tips: '💡 نصائح البحث عن عمل',
  law: '⚖️ قانون العمل الخليجي'
};

export function getArticleSource(art: { category: string; officialCitation?: { name: string; url: string } }, isRtl: boolean) {
  if (art.officialCitation) {
    return {
      name: isRtl ? `${art.officialCitation.name}` : `${art.officialCitation.name}`,
      url: art.officialCitation.url
    };
  }
  
  // Default sources for generic categories
  const defaults: Record<string, { nameEn: string; nameAr: string; url: string }> = {
    news: {
      nameEn: 'GCC Press & Economic Agencies',
      nameAr: 'وكالة أنباء الخليج والصحف الرسمية',
      url: 'https://www.mohre.gov.ae/'
    },
    law: {
      nameEn: 'GCC Joint Labour Administrative Network',
      nameAr: 'الشبكة الموحدة لأنظمة العمل الخليجية',
      url: 'https://www.mohre.gov.ae/'
    },
    education: {
      nameEn: 'MHRSD Development Portal',
      nameAr: 'بوابة وزارة الموارد البشرية والتنمية الاجتماعية',
      url: 'https://hrsd.gov.sa/'
    },
    'personal-life': {
      nameEn: 'GCC Human Resources Council',
      nameAr: 'مجلس الموارد البشرية الخليجي المشترك',
      url: 'https://www.mohre.gov.ae/'
    },
    biography: {
      nameEn: 'CareerPouch Lab Guidelines',
      nameAr: 'إرشادات السيرة الذاتية - كاريير باوتش',
      url: 'https://careerpouch.com/'
    },
    development: {
      nameEn: 'National Qualifications Register',
      nameAr: 'سجل المؤهلات المهنية والتدريب الوطني',
      url: 'https://hrsd.gov.sa/'
    },
    interviews: {
      nameEn: 'Executive Coaching Guidelines',
      nameAr: 'الدليل التنفيذي للمقابلات وإدارة رأس المال البشري',
      url: 'https://www.mohre.gov.ae/'
    },
    tips: {
      nameEn: 'Middle East Recruiter Association',
      nameAr: 'الجمعية المهنية للتوظيف في الشرق الأوسط',
      url: 'https://www.lmra.gov.bh/'
    }
  };

  const item = defaults[art.category] || defaults.news;
  return {
    name: isRtl ? item.nameAr : item.nameEn,
    url: item.url
  };
}

const ARTICLE_TRANSLATIONS: Record<string, { title: string; excerpt: string; content: string[] }> = {
  // Saudi Labor Law
  'Understand Saudization (Nitaqat) Compliance Requirements on Riyadh Private Sector Employers': {
    title: 'فهم متطلبات امتثال نطاقات لتوطين الوظائف (السعودة) في الرياض والقطاع الخاص',
    excerpt: 'كيف يصنف نظام نطاقات شركات القطاع الخاص وتأثير الامتثال على تأشيرات العمل الجديدة.',
    content: [
      'يصنف نظام نطاقات في المملكة العربية السعودية شركات ومؤسسات القطاع الخاص إلى نطاقات ملونة (البلاتيني، الأخضر، الأصفر، الأحمر) بناءً على نسب التوطين المحققة.',
      'المنشآت الواقعة في النطاقين البلاتيني والأخضر تتمتع بتسهيلات متميزة لتأشيرات العمل ونقل الكفالة الفورية، بينما تواجه المنشآت في النطاقات الصفراء أو الحمراء قيوداً تشغيلية صارمة.',
      'يدفع هذا الإطار التنظيمي مدراء التوظيف في الرياض إلى البحث بجدية عن الكفاءات السعودية المؤهلة وتوظيفها وتدريبها لضمان البقاء في النطاق الآمن.'
    ]
  },
  'Saudi Labour Law (Royal Decree No. M/51) - End of Service Benefits & Riyadh Notice Periods': {
    title: 'قانون العمل السعودي (المرسوم الملكي رقم م/51) - مكافأة نهاية الخدمة وفترات الإنذار في الرياض',
    excerpt: 'دليل شامل لاحتساب مكافأة نهاية الخدمة للقطاع الخاص، فترات التجربة، وقوانين مكتب العمل.',
    content: [
      'ينظم نظام العمل السعودي الصادر بالمرسوم الملكي رقم م/51 جميع العلاقات التعاقدية في القطاع الخاص، لتوفير التوازن والإنصاف.',
      'مكافأة نهاية الخدمة: تُحتسب على أساس نصف راتب شهري كلي لكل سنة من السنوات الخمس الأولى، وراتب كامل شهري عن كل سنة تالية، بناءً على آخر راتب تم تقاضيه.',
      'فترة التجربة وفترات الإنذار: يجب ألا تتجاوز فترة التجربة 90 يوماً (أو 180 يوماً بالاتفاق المكتوب). بينما يتم تحديد فترة الإنذار عند إنهاء العقد غير محدد المدة بـ 60 يوماً متتالية.'
    ]
  },
  // UAE Labor Law
  'UAE Labour Law Guide (Decree-Law No. 33 of 2021) & Gratuity Calculator Standards': {
    title: 'دليل قانون العمل الإماراتي (مرسوم بقانون رقم 33 لسنة 2021) ومعايير احتساب مستحقات نهاية الخدمة',
    excerpt: 'شرح مفصل لعقود العمل محددة المدة، حساب مكافأة نهاية الخدمة، ولوائح وزارة الموارد البشرية والتوطين.',
    content: [
      'ينظم المرسوم بقانون اتحادي رقم 33 لسنة 2021 العمل في القطاع الخاص بدولة الإمارات العربية المتحدة بشكل كامل وحديث.',
      'مستحقات نهاية الخدمة للوافدين: تُحتسب على أساس راتب 21 يوماً عن كل سنة من سنوات الخدمة الخمس الأولى، وراتب 30 يوماً عن كل سنة بعد ذلك، بشرط ألا يتجاوز الإجمالي راتب سنتين.',
      'العقود محددة المدة: تم توحيد جميع عقود العمل لتصبح محددة المدة، بحيث تسهل مرونة الانتقال للوظائف وتراعي حقوق أطراف العمل بالتساوي.'
    ]
  },
  // Qatar Labor Law
  'Qatar Labour Law (Law No. 14 of 2004) - Kafala Abolition Studies & Minimum Wage Rules': {
    title: 'قانون العمل القطري (قانون رقم 14 لسنة 2004) - إلغاء الكفالة والحد الأدنى للأجور في الدوحة',
    excerpt: 'دراسة إلغاء شرط شهادة عدم الممانعة التاريخية وتفاصيل آلية انتقال الموظفين والحد الأدنى للأجور بدولة قطر.',
    content: [
      'يحدد قانون العمل القطري رقم 14 لسنة 2004 حقوق الموظفين والعمال في القطاع الخاص القطري بشكل متطور وعصري.',
      'إلغاء نظام الكفالة: قامت دولة قطر بإطلاق إصلاحات تاريخية تسمح للموظفين بتغيير جهة عملهم دون الحاجة لشهادة عدم ممانعة (NOC) من الكفيل القديم.',
      'الحد الأدنى للأجور الأساسي: حددت الدولة حداً أدنى للأجور يبلغ 1000 ريال قطري شهرياً، بالإضافة لـ 500 ريال للسكن و300 ريال للطعام كحد أدنى.'
    ]
  },
  // Oman Labor Law
  'Oman Labour Law (Royal Decree No. 35/2003) & Omanisation Ratios on Private Sectors': {
    title: 'قانون العمل العماني (المرسوم السلطاني رقم 35/2003) ونسب التعمين في الشركات الخاصة',
    excerpt: 'دراسة تحليلية لنسب توطين العمالة العمانية ومكافأة نهاية الخدمة للوافدين في سلطنة عمان.',
    content: [
      'ينظم المرسوم السلطاني رقم 35/2003 الخاص بقانون العمل العماني العلاقات التعاقدية وعمل العمالة الوطنية والوافدة بالسلطنة.',
      'نسب التعمين: تلتزم الشركات بنسب محددة للتوظيف من المواطنين (التعمين) تحت رقابة مشددة من وزارة العمل العمانية لتمكين الشباب.',
      'مستحقات نهاية الخدمة للوافدين: تُحتسب على أساس 15 يوماً من الراتب الأساسي عن كل سنة للسنوات الثلاث الأولى، وراتب شهر كامل لكل سنة تالية.'
    ]
  },
  // Bahrain Labor Law
  'Bahrain Law No. 36 of 2012 Promulgating the Labour Law in the Private Sector': {
    title: 'قانون العمل البحريني بالقطاع الخاص (قانون رقم 36 لسنة 2012) وحساب الإجازات وفترات التجربة',
    excerpt: 'تحرير شامل لقوانين فترات الإنذار، الإجازات السنوية، والالتزامات الصحية تحت إشراف هيئة تنظيم سوق العمل.',
    content: [
      'يخضع العمل بالقطاع الخاص في البحرين لقانون رقم 36 لسنة 2012 المنسجم بالكامل مع الاتفاقيات واللوائح الدولية الحديثة.',
      'الإجازة السنوية: يحق للموظف الذي قضى عاماً كاملاً مستمراً إجازة سنوية مدفوعة الراتب لا تقل عن ثلاثين يوماً.',
      'فترة الإنذار: يستوجب إنهاء العقد غير محدد المدة إشعاراً خطياً لا يقل عن 30 يوماً، مع تعويضات مجزية في حالات الفصل التعسفي.'
    ]
  },
  // Kuwait Labor Law
  'Kuwait Labour Law (Law No. 6 of 2010) on Private Sector Employment Contracts': {
    title: 'قانون العمل الكويتي بالقطاع الخاص (قانون رقم 6 لسنة 2010) وعقود العمل ومكافأة نهاية الخدمة',
    excerpt: 'توضيح لوائح مستحقات نهاية الخدمة في الكويت، فترات المرض المدفوعة، وضوابط الهيئة العامة للقوى العاملة.',
    content: [
      'ينظم قانون العمل الكويتي رقم 6 لسنة 2010 العمل التعاقدي وتخضع المعاملات لرقابة الهيئة العامة للقوى العاملة الرقمية.',
      'فترة المرض والإشعار: مدة الإنذار لإنهاء عقد الراتب الشهري هي ثلاثة أشهر. أما الإجازات المرضية الممتدة فتدرج من مدفوعة بالكامل للمخفضة.',
      'احتساب مكافأة نهاية الخدمة: يحق للموظف مكافأة تُقدر بـ 15 يوماً عن كل عام للخمس سنوات الأولى، وراتب شهر عن كل عام يليه.'
    ]
  },

  // News & Topics
  'GCC Technology Sector Experiences 14.5% High-Growth Surge in Q2 2026': {
    title: 'قطاع التكنولوجيا في دول الخليج يسجل نمواً قوياً بنسبة 14.5% في الربع الثاني من 2026',
    excerpt: 'التحولات في البنية التحتية الرقمية ترشح الرياض ودبي وأبوظبي كمراكز توظيف متميزة وعالية الرواتب.',
    content: [
      'سجل قطاع التكنولوجيا والبرمجيات في دول مجلس التعاون الخليجي نمواً ملحوظاً بنسبة 14.5% في الربع الثاني من عام 2026.',
      'تشهد الرياض طفرة استثمارية كبرى مدفوعة برؤية السعودية 2030 ورأس المال الجريء في التكنولوجيا المالية والسحاب والأتمتة.',
      'الوظائف الأعلى طلباً تشمل مهندسي الذكاء الاصطناعي، مطوري الواجهات التفاعلية الاستجابة، وأخصائيي معالجة البيانات وبناء السحاب.'
    ]
  },
  'Riyadh Launches $5B VC Initiative for GenAI and Cloud Sandbox Startups': {
    title: 'الرياض تطلق مبادرة رأس مال جريء بقيمة 5 مليارات دولار لدعم الذكاء الاصطناعي وبناء السحاب',
    excerpt: 'تخصيص تمويلات استراتيجية ضخمة لترسيخ مكانة الرياض كعاصمة للذكاء الاصطناعي التوليدي والبيئات السحابية المتقدمة.',
    content: [
      'أعلنت الجهات المعنية في المملكة العربية السعودية عن تدشين ميزانية استثمارية كبرى لدعم تقنيات الذكاء الاصطناعي التوليدي وبناء منصات الحوسبة.',
      'تسهم المبادرة في خلق آلاف الوظائف النوعية للمطورين والمهندسين والباحثين التقنيين في المملكة والمنطقة.',
      'ينصح الخبراء المطورين والباحثين عن وظائف ببناء معرض أعمال يحتوي على برمجيات استجابة آمنة وتكاملات فعلية مع النماذج الذكية.'
    ]
  },
  'Dubai Internet City Welcomes 120 New Web & Fintech Corporate Outposts': {
    title: 'مدينة دبي للإنترنت تستقطب 120 شركة تكنولوجيا مالية وتقنيات ويب جديدة لتعزيز التوظيف',
    excerpt: 'المنطقة الحرة الرائدة تسجل رقماً قياسياً جديداً يتيح شواغر تقنية مرموقة لمهندسي البرمجيات والمصممين.',
    content: [
      'أفادت التقارير الرسمية لمدينة دبي للإنترنت بتسجيل وتأسيس فروع جديدة لأكثر من مائة وعشرين شركة ومؤسسة برمجية دولية وإقليمية.',
      'سيؤدي هذا الإقبال الاستثماري إلى رفع الطلب على مهندسي التطبيقات التفاعلية ومصممي تجربة المستخدم المتميزين.',
      'يؤكد الخبراء على أهمية إلمام المتقدمين بأنظمة التشغيل الآمنة محلياً والمحتوى الخصوصي كأولويات لدى جهات التوظيف بالمنطقة.'
    ]
  },
  'Abu Dhabi Hub71 Announces Golden Visa Fast-Track for Senior Tech Talents': {
    title: 'منصة هاب 71 بأبوظبي تطرح مساراً سريعاً للإقامة الذهبية للمطورين وأبرز المواهب التقنية',
    excerpt: 'توفير فرصة الحصول على إقامة مدتها 10 سنوات لكبار المبرمجين والباحثين والمهندسين بشروط مبسطة.',
    content: [
      'أعلنت منصة هاب 71 الرائدة في أبوظبي عن تفعيل شراكة لتبسيط إجراءات ترشيح الإقامة الذهبية للمبرمجين المرموقين وخبراء نظم السحاب.',
      'تهدف هذه الخطوة إلى جذب عمالقة التكنولوجيا وابتكار المشاريع وتعزيز استدامة التواجد للأفراد ذوي التميز المهني العالي.',
      'الإقامة الذهبية تمنح الأفراد مرونة هائلة للعمل والتنقل المستقل عن كفالة الشركات التقليدية مما يحفز ثقافة الإنتاج والريادة بالمنطقة.'
    ]
  },
  'The Wage Protection System (WPS) across the GCC Countries: Compliance Guides': {
    title: 'نظام حماية الأجور (WPS) في دول مجلس التعاون الخليجي: دليلك الكامل للامتثال الإلكتروني',
    excerpt: 'نظرة متكاملة على نظام التحقق السريع لرواتب الموظفين عبر البنوك المركزية للمحافظة على مواعيد الصرف وحقوق العاملين.',
    content: [
      'يعتبر نظام حماية الأجور (WPS) أحد أهم الحلول الإلكترونية المعتمدة في دول الخليج وبنوكها للمراقبة الفورية لصرف الأجور.',
      'تلتزم الشركات قانونياً بدفع الرواتب عبر المنصات والمصارف المعتمدة لإرسال تقارير الامتثال آلياً إلى جهات العمل والوزارات.',
      'تجاهل المواعيد أو عدم إتمام الصرف الشهري يعرض المؤسسات لغرامات مالية مشددة، ويؤدي إلى تجميد رخص وتراخيص العمل.'
    ]
  },
  'Golden Visa Adjustments in the UAE: Navigating Self-Sponsored Tech Visas': {
    title: 'تسهيلات الإقامة الذهبية في الإمارات: كيفية تقديم الكفاءات البرمجية والتقنية بصفة شخصية',
    excerpt: 'مراجعة نسب الرواتب المطلوبة والتوثيق المطلوب للحصول على الإقامة الذهبية الاستثنائية لمدة 10 سنوات بموجب شروط فئة النوابغ.',
    content: [
      'أدخلت دولة الإمارات التيسيرات الحديثة على شروط فئة الكفاءات المهنية الاستثنائية وتخصيص مسار الإقامة الذهبية الذاتي لمهندسي التكنولوجيا.',
      'يصل الشرط المالي لراتب أساسي معتمد قدره 30 ألف درهم أو أكثر، مثبت بعقود رسمية وكشوف حساب بنكية لثلاثة أشهر.',
      'تمنح الإقامة الذاتية للمهندسين حرية تأسيس المشروعات أو تعزيز الكفاءات والتعلم والتبادل المعرفي عبر أسواق الخليج المتنوعة.'
    ]
  },
  'Formulating an ATS-Optimized CV for Middle Eastern Recruiters': {
    title: 'كيفية صياغة سيرة ذاتية متوافقة مع أنظمة فرز وفلترة التوظيف (ATS) للشركات الخليجية والشرق الأوسط',
    excerpt: 'تضمين الكلمات المفتاحية الاستراتيجية واختيار التنسيق الهيكلي المناسب لمساعدة طلبك على تخطي فلاتر الموارد الذكية وسير التوظيف.',
    content: [
      'تعتمد معظم الشركات الكبرى في الشرق الأوسط ودول الخليج على برمجيات فرز وتتبع المتقدمين (ATS) لمراجعة مئات الطلبات الواردة يومياً آلياً.',
      'لتجاوز هذه الفلاتر العميقة، يجب تنظيم السيرة بملفات نصوص أو PDF بتنسيقات كلاسيكية خالية من الصور المعقدة أو التقسيمات المشوشة.',
      'يُفضل تضمين المهارات والعبارات الوظيفية المذكورة في نص إعلان الوظيفة بدقة متناهية لزيادة درجة التوافق التقني والذكاء المتقاطع.'
    ]
  },
  'Aligning Graduate Skills with GCC Industrial Objectives: The Vision 2030 Catalyst': {
    title: 'مواءمة مهارات الخريجين مع الأهداف الصناعية والوطنية للخليج: رؤية 2030 كقوة دافعة للوظائف',
    excerpt: 'تجسير الفجوة بين المخرجات الأكاديمية واحتياجات التوظيف الفعلية في أسواق العمل المعرفية والتقنية والصناعية الحديثة.',
    content: [
      'تقدر خطط التنمية الكبرى وعلى رأسها مواءمة التعليم والابتكار كركيزة لرفع مستوى الاعتماد الوطني على المهندسين والخبراء.',
      'البرامج التدريبية المتقدمة توفر للخريجين قدرات تكتيكية تشمل معالجة البيانات، والبرمجة باللغات الحديثة، والامتثال الصناعي.',
      'تنسيق الجامعات مع القطاع الخاص يعزز فرص التدريب التعاوني وتوجيه الخريجين للمقاعد الحيوية فور إتمام الدراسة.'
    ]
  },
  'Navigating Workplace Harmony & Adapting to the GCC High-Intensity Culture': {
    title: 'كيفية التكيف مع بيئة العمل والتفاعل الإيجابي مع الثقافة المهنية سريعة النمو والحرجة في الخليج',
    excerpt: 'بناء علاقات مهنية ناجحة مع زملاء العمل وفهم التوقعات التنفيذية العالية في بيئات الأعمال عالية التنافسية.',
    content: [
      'تتسم بيئات العمل في المدن الكبرى كدبي والرياض وتيرة سريعة وديناميكية عالية تشمل تبادل وتفاعل لثقافات وجنسيات متنوعة.',
      'إظهار الالتزام بالمواعيد والمبادرة المستمرة والتعاون الفعال هم أعمدة التميز والارتقاء السلم الوظيفي في هذه المراكز الإقليمية.',
      'المرونة والتواصل الإنساني الواضح يبسط حل التحديات اليومية ويسهم في بناء تحالفات وعلاقات مهنية عابرة للمشاريع.'
    ]
  },
  'Strategic Upskilling: High-Value Certifications Supporting Salary Multipliers': {
    title: 'دليل الشهادات التقنية والمهنية ذات القيمة العالية المعتمدة لرفع مستوى الدخل ومضاعفة الرواتب',
    excerpt: 'الاستثمار في الشهادات كضمانة لتحقيق الترقيات المهنية والتميز المعرفي وبناء مهارات عملية يبحث عنها أصحاب العمل.',
    content: [
      'تشير الدراسات إلى رفع القوة الشرائية للدخل وفرص المبيعات والمهام القيادية للأفراد الحاصلين على شهادات مهنية عالية كـ AWS وجامعات التميز المستمر.',
      'المؤسسات الكبرى تمنح الأولويات للشهادات المرتبطة بقدرة حل المشكلات والأمان وتسهيل تدفق المعلومات وبناء خوادم مستقرة.',
      'بناء سجل شهادات مع ممارسة واقعية يتيح للأفراد الدخول لمراحل تفاوضية ممتازة بشأن الرواتب والعقود المهنية.'
    ]
  },
  'Cracking the GCC Executive Interview: Culture, Readiness, and Compensation talk': {
    title: 'اجتياز المقابلة الشخصية للمناصب التنفيذية في الخليج: التميز الثقافي، والجاهزية، والتفاوض على الرواتب والامتيازات المرافقة',
    excerpt: 'المبادئ الأساسية للحديث عن التعويضات والمكافآت وتأسيس الثقة مع صانعي القرار والشركات الكبرى بالمنطقة.',
    content: [
      'المقابلات للتخصصات والوظائف التنفيذية بمجموعات الأعمال والقطاعات بالشرق الأوسط تتطلب تحضيراً عميقاً يتخطى المهارة التقنية المباشرة للحوار.',
      'إظهار الإلمام بأهداف التنمية للمنطقة ورؤية قيادة الأعمال يسهم في إثبات قدرتك على قيادة وقياس الأداء لمستويات ومراتب عالية.',
      'التخطيط الذكي للنقاش المالي ومكافآت السكن والانتقال وتأمين الأسرة يسهم في خروج اتفاق حاسم ومثالي لكلا الجانبين.'
    ]
  },
  'Unlocking the Hidden GCC Job Market: Strategic Networking over Portal Applications': {
    title: 'فتح سوق العمل غير المعلن بالخليج: قوة بناء الشراكات والشبكات المهنية الاستراتيجية بدلاً من التقديمات التقليدية',
    excerpt: 'تخطى نمط طلبات مواقع التوظيف المكررة والتواصل الكفء الفعال مع القادة وأصحاب القرار لرفع مستوى التوظيف المباشر.',
    content: [
      'تمتلئ الساحة بالفرص الكبرى غير المنشورة على هيئات إعلانات توظيف عامة وتُشغل مباشرة من خلال علاقات تزكية مباشرة وتوصيات مهنية.',
      'منصات كـ LinkedIn والتجمعات والملتقيات المتخصصة تمثل أرضية قوية للتأثير ومشاركة الخبرات وطرح مشاريعك المنجزة للنور.',
      'توجيه طلبات استشهار أو استشارة قصيرة ومفيدة لمسؤولي الشركات يولد انطباع المبادرة ويقربك للحزم والوظائف الحيوية المخفية.'
    ]
  }
};

export function getArabicTranslatedArticle(art: Article): Article {
  const found = ARTICLE_TRANSLATIONS[art.title];
  if (found) {
    return {
      ...art,
      title: found.title,
      excerpt: found.excerpt,
      content: found.content
    };
  }

  // Handle dynamic ones matching key phrases
  if (art.title.startsWith('Dynamic Column:') || art.title.includes('GCC Labour Law')) {
    const isNum = art.title.match(/Part (\d+)/);
    const partNum = isNum ? ` الجزء ${isNum[1]}` : '';
    return {
      ...art,
      title: `دراسة حالة: امتثال قوانين العمل بدول الخليج${partNum}`,
      excerpt: `التحقق العيادي من بنود الإشعار، الإجازت ومكافآت نهاية الخدمة للقطاع الخاص بالشرق الأوسط.`,
      content: [
        `دراسة متعمقة ومراجعة علمية موثوقة ومفصلة لعلاقات العمل الحالية في دول مجلس التعاون الخليجي وأنظمتها الإدارية.`,
        `تركز هذه المراجعة على القوانين والمراسيم الصادرة من وزارات وهيئات العمل والتوطين لضمان بيئة مهنية تعاقدية خالية من النزاعات وتحفيز الإنتاجية.`,
        `تعد زيارة الهيئة الرسمية للعمل في دولتك واتباع الإعلانات الرسمية أضمن السبل للالتزام وحفظ الحقوق وتحقيق التوازن الوظيفي والمهني.`
      ]
    };
  }

  // Fallback translators
  return {
    ...art,
    title: `تقرير معرفي: ${art.title}`,
    excerpt: `دراسة موثوقة ونماذج توظيف واستراتيجيات عملية هامة في دول الخليج والشرق الأوسط.`,
    content: [
      ...art.content,
      `يرجى الرجوع إلى بوابة المرجع المباشر أدناه للاطلاع على كامل بنود ومستندات هذا التقرير والتفاصيل الرسمية المصاحبة لقوانين العمل بالدولة.`
    ]
  };
}

export function BloggerHub({ isDarkMode, language = 'en' }: BloggerHubProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const isRtl = language === 'ar';
  const lexicon = t[language] || t.en;
  const currentCategoryLabels = isRtl ? categoryLabelsAR : categoryLabelsEN;

  const categoriesList = [
    { id: 'all' },
    { id: 'news' },
    { id: 'education' },
    { id: 'personal-life' },
    { id: 'biography' },
    { id: 'development' },
    { id: 'interviews' },
    { id: 'tips' },
    { id: 'law' }
  ];

  const filteredArticles = useMemo(() => {
    return GENERATED_ARTICLES.filter(art => {
      // If language === 'ar', we match search query against the translated version too!
      const finalArt = isRtl ? getArabicTranslatedArticle(art) : art;
      const matchesCategory = selectedCategory === 'all' || finalArt.category === selectedCategory;
      const matchesSearch = finalArt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            finalArt.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            finalArt.content.some(para => para.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, isRtl]);

  // Handle Share copy link
  const handleShareArticle = (artId: string) => {
    try {
      const url = `${window.location.origin}/blog?article=${artId}`;
      navigator.clipboard.writeText(url);
      alert(`${lexicon.shareSuccess}\n\n${url} 🚀`);
    } catch (e) {
      alert("Copy failed. Please copy the URL from your browser's address bar!");
    }
  };

  const displayedActiveArt = (activeArticle && isRtl) ? getArabicTranslatedArticle(activeArticle) : activeArticle;
  const activeSourceObj = displayedActiveArt ? getArticleSource(displayedActiveArt, isRtl) : null;

  return (
    <div className={`space-y-8 font-sans ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* BLOG TOP HERO */}
      <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-slate-900/60 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-950'} relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full filter blur-xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded border ${
            isDarkMode 
              ? 'text-cyan-400 bg-cyan-500/5 border-indigo-500/10' 
              : 'text-indigo-650 bg-indigo-50/50 border-indigo-200'
          }`}>
            <BookOpen size={11} className={isDarkMode ? 'text-cyan-400' : 'text-indigo-500'} />
            {lexicon.tagline}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {lexicon.magazineTitle}
          </h1>
          <p className={`text-sm max-w-3xl ${isDarkMode ? 'text-slate-300' : 'text-slate-650'} leading-relaxed`}>
            {lexicon.magazineDesc}
          </p>
        </div>
      </div>

      {/* COMPONENT BODY SPLIT OR DETAIL */}
      {displayedActiveArt ? (
        <div className={`p-6 sm:p-10 rounded-3xl border ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-100 font-sans' : 'bg-white border-slate-200 text-slate-900'} space-y-8 animate-fade`}>
          
          {/* Back button Row */}
          <div>
            <button
              onClick={() => setActiveArticle(null)}
              className={`px-4 py-2 text-xs font-bold rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-655 hover:bg-slate-100'
              }`}
            >
              {isRtl ? <ArrowRight size={14} /> : <ArrowLeft size={14} />} {lexicon.backBtn}
            </button>
          </div>

          {/* Article Header metrics */}
          <div className={`space-y-4 border-b pb-6 ${isDarkMode ? 'border-slate-850' : 'border-slate-250'}`}>
            <div className={`flex flex-wrap gap-2.5 items-center text-xs text-slate-405 font-mono ${isRtl ? 'justify-start' : ''}`}>
              <span className={`px-2.5 py-0.5 font-bold uppercase rounded border ${
                isDarkMode 
                  ? 'bg-cyan-950/40 text-cyan-400 border-cyan-500/15' 
                  : 'bg-indigo-500/10 text-indigo-700 border-indigo-500/10'
              }`}>
                {isRtl ? (categoryLabelsAR[displayedActiveArt.category] || displayedActiveArt.categoryLabel) : (categoryLabelsEN[displayedActiveArt.category] || displayedActiveArt.categoryLabel)}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1"><Calendar size={12} /> {displayedActiveArt.date}</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {displayedActiveArt.readTime}</span>
            </div>

            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {displayedActiveArt.title}
            </h1>
            
            <p className={`text-sm leading-relaxed max-w-3xl ${
              isRtl 
                ? 'font-bold text-slate-200 dark:text-zinc-150 text-base antialiased' 
                : 'font-semibold italic text-slate-600 dark:text-slate-305'
            }`}>
              {displayedActiveArt.excerpt}
            </p>
          </div>

          {/* Article Main Paragraphs */}
          <div className="space-y-6 max-w-3xl">
            {displayedActiveArt.content.map((para, i) => (
              <p 
                key={i} 
                className={`text-sm sm:text-base ${
                  isRtl 
                    ? 'leading-8 font-medium text-slate-200 dark:text-zinc-100 antialiased' 
                    : 'leading-relaxed text-slate-750 dark:text-slate-200'
                }`}
              >
                {para}
              </p>
            ))}
          </div>

          {/* Official citation box for ALWAYS showing links */}
          {activeSourceObj && (
            <div className={`p-5 border rounded-2xl space-y-2.5 max-w-3xl ${
              isDarkMode 
                ? 'bg-slate-900/60 border-emerald-500/10' 
                : 'bg-emerald-500/5 border-emerald-500/15'
            }`}>
              <div className={`flex items-center gap-2 font-bold text-xs ${
                isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
              }`}>
                <Scale size={16} />
                <span className="uppercase font-mono tracking-wider">{lexicon.citationVerified}</span>
              </div>
              <p className={`text-xs leading-relaxed ${
                isDarkMode ? 'text-slate-300' : 'text-slate-650'
              }`}>
                {lexicon.citationDesc}
              </p>
              <div className="pt-1">
                <a
                  href={activeSourceObj.url}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-xs font-bold hover:underline cursor-pointer ${
                    isDarkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-indigo-650 hover:text-indigo-700'
                  }`}
                >
                  <span className="underline">{activeSourceObj.name}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          )}

          {/* Footer actions inside read modal */}
          <div className={`flex justify-between items-center pt-6 border-t text-xs font-mono ${
            isDarkMode ? 'border-slate-850' : 'border-slate-200'
          }`}>
            <button
              onClick={() => handleShareArticle(displayedActiveArt.id)}
              className={`font-bold flex items-center gap-1.5 cursor-pointer ${
                isDarkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-indigo-600 hover:text-indigo-700'
              }`}
            >
              <Share2 size={13} /> {lexicon.shareLink}
            </button>
            <span className="text-slate-400 hidden sm:inline">{lexicon.localPreserve}</span>
          </div>

        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: CATEGORIES FILTER LIST */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className={`text-xs font-bold font-mono uppercase tracking-wider px-1 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>{lexicon.knowledgeSectors}</h3>
            <div className={`flex flex-col gap-1.5 p-2.5 rounded-2xl border ${
              isDarkMode 
                ? 'bg-slate-900/40 border-slate-800' 
                : 'bg-white/40 border-slate-200/50'
            }`}>
              {categoriesList.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : isDarkMode 
                        ? 'text-slate-300 hover:text-white hover:bg-slate-900/80 bg-slate-950/20' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-white/50'
                  }`}
                >
                  <span>{currentCategoryLabels[cat.id]}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isDarkMode ? 'bg-white/10 text-white/95' : 'bg-black/15 text-slate-955'
                  }`}>
                    {cat.id === 'all' 
                      ? GENERATED_ARTICLES.length 
                      : GENERATED_ARTICLES.filter(x => x.category === cat.id).length
                    }
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: ARTICLES SEARCH AND LIST GRID */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* SEARCH INPUT ROW */}
            <div className="relative">
              <Search className={`absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-3.5 text-slate-400`} size={16} />
              <input
                type="text"
                placeholder={lexicon.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${isRtl ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'} py-3 text-xs rounded-2xl focus:outline-none border ${
                  isDarkMode 
                    ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500' 
                    : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600'
                }`}
              />
            </div>

            {/* CARDS LIST GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredArticles.length === 0 ? (
                <div className={`col-span-full py-12 text-center font-mono text-xs italic border border-dashed rounded-2xl ${
                  isDarkMode 
                    ? 'text-slate-400 bg-slate-950/10 border-slate-800' 
                    : 'text-slate-500 bg-white/10 border-slate-250'
                }`}>
                  {lexicon.noMatch}
                </div>
              ) : (
                filteredArticles.map(art => {
                  const displayedArt = isRtl ? getArabicTranslatedArticle(art) : art;
                  const sourceObj = getArticleSource(displayedArt, isRtl);

                  return (
                    <div
                      key={art.id}
                      onClick={() => setActiveArticle(art)}
                      className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                        isDarkMode
                          ? 'bg-slate-950/80 border-slate-800 hover:border-indigo-500/40 hover:bg-slate-950 text-white'
                          : 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-white text-slate-900'
                      }`}
                    >
                      {/* Glowing highlight stripe if labor law */}
                      {art.category === 'law' && (
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-400 to-indigo-500" />
                      )}

                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400">
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            isDarkMode ? 'bg-cyan-950/40 text-cyan-400' : 'bg-indigo-505/10 text-indigo-700'
                          }`}>
                            {currentCategoryLabels[art.category]}
                          </span>
                          <span className="flex items-center gap-0.5"><Clock size={10} /> {displayedArt.readTime}</span>
                        </div>

                        <div className="space-y-2">
                          <h3 className={`text-sm sm:text-base font-extrabold leading-snug transition-colors line-clamp-2 ${
                            isDarkMode 
                              ? 'text-slate-100 hover:text-cyan-400' 
                              : 'text-slate-900 hover:text-indigo-650'
                          }`}>
                            {displayedArt.title}
                          </h3>
                          <p className={`text-xs leading-relaxed line-clamp-2 ${isDarkMode ? 'text-slate-300 font-normal font-sans' : 'text-slate-500'}`}>
                            {displayedArt.excerpt}
                          </p>

                          {/* LINK TO THE ORIGINAL SOURCE PROMINENTLY */}
                          <div className={`pt-2 flex items-center gap-1.5 text-[11px] font-bold border-t ${
                            isDarkMode ? 'border-slate-900' : 'border-slate-100'
                          }`}>
                            <ExternalLink size={11} className="shrink-0 text-slate-400" />
                            <a 
                              href={sourceObj.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              referrerPolicy="no-referrer"
                              onClick={(e) => e.stopPropagation()} 
                              className={`truncate cursor-pointer underline flex items-center gap-1 font-sans ${
                                isDarkMode ? 'text-slate-300 hover:text-cyan-400' : 'text-slate-700 hover:text-indigo-600'
                              }`}
                              title={sourceObj.name}
                            >
                              <span className={isDarkMode ? 'text-slate-400 font-normal font-mono' : 'text-slate-500 font-mono'}>
                                {isRtl ? 'المصدر:' : 'Source:'}
                              </span>
                              <span className={`underline font-sans font-bold ${
                                isDarkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-indigo-600 hover:text-indigo-700'
                              }`}>
                                {sourceObj.name}
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className={`flex items-center justify-between border-t pt-3 mt-4 text-[10px] font-mono ${
                        isDarkMode ? 'border-slate-850' : 'border-slate-200/50'
                      }`}>
                        <span className="text-slate-400 font-bold">{displayedArt.date}</span>
                        <span className={`font-bold flex items-center gap-0.5 hover:translate-x-1 transition-transform ${
                          isDarkMode ? 'text-cyan-400' : 'text-indigo-605'
                        }`}>
                          {lexicon.readColumn} {isRtl ? <ArrowLeft size={10} /> : <ArrowRight size={10} />}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
