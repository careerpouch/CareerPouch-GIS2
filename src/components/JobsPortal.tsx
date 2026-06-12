import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, Briefcase, MapPin, Mail, Phone, Calendar, Clock, Sparkles, 
  CheckCircle, PlusCircle, User, FileText, Award, Star, List, ArrowRight,
  Share2, Shield, AlertCircle, Upload, LogIn, LogOut, Check, ChevronRight
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  mode: 'Remote' | 'Hybrid' | 'On-site';
  salary: string;
  description: string;
  requirements: string[];
  contactEmail: string;
  contactWhatsApp?: string;
  datePosted: string;
  isUserPosted?: boolean;
}

interface SeekerProfile {
  name: string;
  title: string;
  email: string;
  whatsapp: string;
  bio: string;
  experience: string;
  certificates: string;
  skills: string;
  profilePicture?: string; // Base64 image
}

interface JobsPortalProps {
  isDarkMode: boolean;
  language?: 'en' | 'ar';
}

const DEFAULT_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer (React / Tailwind)',
    company: 'TechOasis Web Solutions',
    location: 'Dubai, UAE',
    mode: 'Hybrid',
    salary: 'AED 16,000 - 22,050 / month',
    description: 'TechOasis is seeking an experienced React Developer to build premium web applications. You will deploy pixel-perfect user interfaces, wire interactive workflows, and audit client-side schemas. Familiarity with modern animation is a high identifier.',
    requirements: [
      '3+ years professional experience with React & Tailwind CSS',
      'Strong grasp of state optimization and React hooks',
      'Located or willing to relocate to Dubai (Hybrid mode)',
      'Experience with responsive media and high-contrast styling'
    ],
    contactEmail: 'careers@techoasis.ae',
    contactWhatsApp: '+971501234567',
    datePosted: '2026-06-11'
  },
  {
    id: 'job-2',
    title: 'HR Coordinator & Visa Sponsor Officer',
    company: 'Khobar Logistics Group',
    location: 'Riyadh, Saudi Arabia',
    mode: 'On-site',
    salary: 'SAR 12,000 - 15,000 / month',
    description: 'We are recruiting an on-site HR Coordinator to administer recruitment pipeline, manage GCC employment contracts, facilitate local Iqama visa sponsorships, and coordinate employee onboarding files.',
    requirements: [
      'Fluent in Arabic and Professional English written communication',
      'Deep understanding of Saudi Labor Law regulations and Qiwa platform',
      'Skilled in dossier organization and employer rights coordination',
      'Strong presentation and administrative workflow capacities'
    ],
    contactEmail: 'hr@khobarlogistics.com.sa',
    contactWhatsApp: '+966509876543',
    datePosted: '2026-06-10'
  },
  {
    id: 'job-3',
    title: 'Financial & Ledger Audit Officer',
    company: 'Doha FinTech Incubator',
    location: 'Doha, Qatar',
    mode: 'Remote',
    salary: 'QAR 18,000 - 24,000 / month',
    description: 'Join our decentralized fintech network team. You will handle internal transaction validation models, manage Double-Entry system structures, analyze mathematical arrays, and verify security protocols.',
    requirements: [
      'Certified Public Accountant (CPA) or equivalent qualifications',
      'Demonstrated expertise in ledger simulation and financial audits',
      'Comfortable communicating via Telegram, WhatsApp, and email',
      'Ability to parse complex asset lines and schedule depreciation calendars'
    ],
    contactEmail: 'careers@dohafintech.qa',
    datePosted: '2026-06-08'
  },
  {
    id: 'job-4',
    title: 'Premium Creative UI/UX Designer',
    company: 'Muscat Architectural Studios',
    location: 'Muscat, Oman',
    mode: 'Hybrid',
    salary: 'OMR 1,500 - 2,100 / month',
    description: 'A premium design consultancy targeting high-end real estate and commerce brands. We need a creative UI/UX designer capable of drawing elegant glassmorphic components, choosing premium font pairings, and optimizing interactive spacing layouts.',
    requirements: [
      'Stellar portfolio containing real-world dark/light theme web outputs',
      'Expert level styling with Tailwind CSS fluid layout parameters',
      'Highly sensitive to typography, negative space, and visual pacing',
      'Ability to export responsive mobile and desktop components'
    ],
    contactEmail: 'studios@muscatarch.om',
    contactWhatsApp: '+96894567812',
    datePosted: '2026-06-07'
  }
];

interface CountryGeography {
  countryEn: string;
  countryAr: string;
  flag: string;
  cities: Array<{ cityEn: string; cityAr: string }>;
}

const GCC_GEOGRAPHY: CountryGeography[] = [
  {
    countryEn: 'UAE',
    countryAr: 'الإمارات',
    flag: '🇦🇪',
    cities: [
      { cityEn: 'Dubai', cityAr: 'دبي' },
      { cityEn: 'Abu Dhabi', cityAr: 'أبوظبي' },
      { cityEn: 'Sharjah', cityAr: 'الشارقة' },
      { cityEn: 'Ajman', cityAr: 'عجمان' }
    ]
  },
  {
    countryEn: 'Saudi Arabia',
    countryAr: 'السعودية',
    flag: '🇸🇦',
    cities: [
      { cityEn: 'Riyadh', cityAr: 'الرياض' },
      { cityEn: 'Jeddah', cityAr: 'جدة' },
      { cityEn: 'Dammam', cityAr: 'الدمام' },
      { cityEn: 'Al Khobar', cityAr: 'الخبر' },
      { cityEn: 'NEOM', cityAr: 'نيوم' }
    ]
  },
  {
    countryEn: 'Qatar',
    countryAr: 'قطر',
    flag: '🇶🇦',
    cities: [
      { cityEn: 'Doha', cityAr: 'الدوحة' },
      { cityEn: 'Al Wakrah', cityAr: 'الوكرة' },
      { cityEn: 'Al Khor', cityAr: 'الخور' }
    ]
  },
  {
    countryEn: 'Oman',
    countryAr: 'عمان',
    flag: '🇴🇲',
    cities: [
      { cityEn: 'Muscat', cityAr: 'مسقط' },
      { cityEn: 'Salalah', cityAr: 'صلالة' },
      { cityEn: 'Sohar', cityAr: 'صحار' }
    ]
  },
  {
    countryEn: 'Bahrain',
    countryAr: 'البحرين',
    flag: '🇧🇭',
    cities: [
      { cityEn: 'Manama', cityAr: 'المنامة' },
      { cityEn: 'Riffa', cityAr: 'الرفاع' },
      { cityEn: 'Muharraq', cityAr: 'المحرق' }
    ]
  },
  {
    countryEn: 'Kuwait',
    countryAr: 'الكويت',
    flag: '🇰🇼',
    cities: [
      { cityEn: 'Kuwait City', cityAr: 'مدينة الكويت' },
      { cityEn: 'Jahra', cityAr: 'الجهراء' },
      { cityEn: 'Salmiya', cityAr: 'السالمية' }
    ]
  }
];

const t = {
  en: {
    portalTitle: "GCC Jobs Portal",
    portalDesc: "Explore premier on-site, hybrid, and remote career opportunities across the Gulf. Align your seeker credentials, upload profile pictures, or broadcast vacancies for free.",
    tabBrowse: "🔎 Browse GCC Vacancies",
    tabProfile: "👤 My Candidate Profile & ID",
    tabPost: "💼 Post a GCC Vacancy",
    searchPlaceholder: "Search by title, keywords or company...",
    allLocations: "All Locations",
    appliedSuccess: "Success! Your application has been registered.",
    oneClickBtn: "⚡ 1-Click Fast Apply",
    logBackIn: "Registered Seeker Login",
    emailPlaceholder: "Type your registered email...",
    loadProfile: "Log Back In",
    profilePic: "Profile Picture (Optional, JPEG/PNG)",
    fullName: "Full Seeker Name *",
    headline: "Professional Headline *",
    contactEmail: "Contact Email Address *",
    whatsappNum: "WhatsApp Number *",
    summaryBio: "Candidate Summary Bio",
    experience: "Professional Experience (Companies, Dates, Roles)",
    certificates: "Certifications / Awards / Degrees",
    skills: "Primary Core Skills (Comma-separated lists)",
    saveProfileBtn: "Register & Save Profile Dataset",
    loginFirst: "Complete your candidate profile to enable 1-Click Apply!",
    compensation: "Schedules & Compensation",
    easyApplyChannels: "Easy Apply Channels",
    whatsAppUnlisted: "WhatsApp Unlisted",
    submitDossier: "Submit Seeker Dossier",
    orTypeDossier: "Or submit immediate candidate summary",
    previewVacancy: "Preview GCC Vacancy Files",
    prepopulateBanner: "Secure Candidate Profile Linked",
    prepopulateDesc: "You can apply instantly with 1-click using your registered parameters.",
    successOneClick: "Instant Application Submitted! You have applied with 1-click.",
    emailNotificationSimul: "📬 Email Confirmation Sent! Check your simulated inbound email below:",
    welcomeUser: "Welcome, logged in seeker!",
    currentRegisteredSeekers: "Registered Database Profiles",
    logoutBtn: "Log Out Sequence",
    noProfileYet: "No profile registered yet under this email. Create one below to save it!",
    uploadSuccessMsg: "Picture uploaded and encoded locally!",
    jobModeLabel: "Working Mode *",
    salaryLabel: "Salary Range / Month (Optional)",
    corpEmailLabel: "Corporate Contact Email *",
    descLabel: "Detailed Role Description",
    reqBuilderLabel: "Add Position Credentials & Requirements",
    addReqBtn: "Add Requirement",
    broadcastJobBtn: "Broadcast Free GCC Job Listing",
    roleProfile: "Role Profile",
    posCoords: "Position Coordinates",
    placeholderBrowseNoJobs: "No vacancies match your active criteria in local memory.",
    seekerIdText: "Candidate Verified & Registered",
    skillsIndexHeader: "Skills Index:",
    emailFrom: "From",
    emailTo: "To",
    emailSubject: "Subject",
    emailBodyHeader: "Official Inbound Simulation Message",
    jobTitleLabel: "Job Title *",
    compNameLabel: "Company Name *",
    locationSelect: "Location Select *"
  },
  ar: {
    portalTitle: "بوابة وظائف دول مجلس التعاون الخليجي",
    portalDesc: "استكشف الفرص الوظيفية للعمل الحضوري والهجين وعن بعد في الخليج ومزامنة ملف الترشيح الخاص بك مجاناً.",
    tabBrowse: "🔎 تصفح الشواغر المتاحة",
    tabProfile: "👤 ملف الترشيح والصورة الشخصية",
    tabPost: "💼 أعلن عن شاغر وظيفي",
    searchPlaceholder: "ابحث بالمسؤوليات، مسمى الوظيفة أو الشركة...",
    allLocations: "كل المدن والمواقع",
    appliedSuccess: "تم الإرسال بنجاح! تم تسجيل طلب التوظيف بنجاح.",
    oneClickBtn: "⚡ تقديم سريع بضغطة زر واحدة",
    logBackIn: "دخول باحث مسجل سابقاً",
    emailPlaceholder: "أدخل بريدك الإلكتروني المسجل...",
    loadProfile: "تسجيل الدخول",
    profilePic: "الصورة الشخصية (اختيارية، مظهر احترافي)",
    fullName: "اسم الباحث بالكامل *",
    headline: "المسمى المهني الوظيفي الرئيسي *",
    contactEmail: "البريد الإلكتروني المهني للاتصال *",
    whatsappNum: "رقم الوتساب / الجوال الشخصي *",
    summaryBio: "الملخص المهني والنبذة الشخصية المختصرة",
    experience: "الخبرات والمسؤوليات السابقة (الشركات، التواريخ، المهام)",
    certificates: "الشهادات المهنية المعتمدة والدورات",
    skills: "المهارات المهنية الأساسية (كمثال: React, NodeJS, Excel)",
    saveProfileBtn: "تسجيل وحفظ البيانات في المنصة",
    loginFirst: "أكمل ملف الترشيح الخاص بك لتفعيل زر التقديم بضغطة واحدة!",
    compensation: "نطاقات الفائدة والرواتب الشهرية المتوقعة",
    easyApplyChannels: "قنوات التقديم المتاحة",
    whatsAppUnlisted: "الوتساب غير متوفر",
    submitDossier: "تقديم طلب مرشح فوري",
    orTypeDossier: "أو اكتب مسودة طلب مخصصة يدويًا أدناه",
    previewVacancy: "معاينة تفاصيل الملف الوظيفي",
    prepopulateBanner: "ملف الترشيح الشخصي موثق ومربوط",
    prepopulateDesc: "يمكنك الآن إرسال طلب التوظيف فوراً بضغطة واحدة دون تعبئة حقول مكررة.",
    successOneClick: "تم التقديم بضغطة واحدة بنجاح! تم إرسال ملفك المسجل.",
    emailNotificationSimul: "📬 تم إرسال رسالة تأكيد رسمية! تفقد صندوق بريدك التجريبي أدناه:",
    welcomeUser: "مرحباً، تم تسجيل الدخول كمستخدم مسجل!",
    currentRegisteredSeekers: "ملفات التعريف المسجلة إدارياً",
    logoutBtn: "خروج من الجلسة",
    noProfileYet: "لا يوجد سيرة مسجلة بهذا البريد بعد. أنشئ سفيراً أدناه وسيتم حفظ بياناتك!",
    uploadSuccessMsg: "تم رفع وتشفير الصورة بنجاح وربطها بالهوية!",
    jobModeLabel: "نمط العمل للموظف *",
    salaryLabel: "الراتب الشهري المتوقع (اختياري)",
    corpEmailLabel: "البريد الخاص بتلقي الطلبات للشركة *",
    descLabel: "شرح تفصيلي للمسؤوليات والمهام شاغرة",
    reqBuilderLabel: "إضافة متطلبات ومؤهلات الوظيفة الخاصة",
    addReqBtn: "أضف المتطلب",
    broadcastJobBtn: "نشر الشاغر المكتشف مجاناً في النظام",
    roleProfile: "المسؤوليات الرئيسية والمهام",
    posCoords: "تفاصيل وحجم المؤهلات الوظيفية",
    placeholderBrowseNoJobs: "لا توجد وظائف معلنة تطابق استعلامك في الوقت الراهن.",
    seekerIdText: "تم توثيق بيانات مرشح دول الخليج",
    skillsIndexHeader: "فهرس الكفاءات والمهارات الشخصية:",
    emailFrom: "من",
    emailTo: "إلى",
    emailSubject: "الموضوع",
    emailBodyHeader: "الرسالة الرسمية الواردة للتأكيد عبر البريد الالكتروني",
    jobTitleLabel: "المسمى الوظيفي المطلوب *",
    compNameLabel: "اسم الجهة أو الشركة *",
    locationSelect: "اختيار المدينة والدولة *"
  }
};

export function JobsPortal({ isDarkMode, language = 'en' }: JobsPortalProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'profile' | 'post'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  const isRtl = language === 'ar';
  const lexicon = t[language] || t.en;
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom jobs list state
  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const savedUserJobs = localStorage.getItem('careerpouch_user_jobs');
      const userJobs = savedUserJobs ? JSON.parse(savedUserJobs) : [];
      return [...DEFAULT_JOBS, ...userJobs];
    } catch (e) {
      return DEFAULT_JOBS;
    }
  });

  // Master seekers map (email -> SeekerProfile) for Log Back In
  const [seekersDatabase, setSeekersDatabase] = useState<Record<string, SeekerProfile>>(() => {
    try {
      const saved = localStorage.getItem('careerpouch_seekers_database');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Current Logged-in / Active Seeker Profile
  const [profile, setProfile] = useState<SeekerProfile>(() => {
    try {
      // First try to load the last active logged-in profile email
      const activeEmail = localStorage.getItem('careerpouch_active_seeker_email');
      const savedDb = localStorage.getItem('careerpouch_seekers_database');
      const db = savedDb ? JSON.parse(savedDb) : {};
      
      if (activeEmail && db[activeEmail]) {
        return db[activeEmail];
      }
      
      // Fallback to legacy single-user storage if available
      const savedSingle = localStorage.getItem('careerpouch_seeker_profile');
      if (savedSingle) return JSON.parse(savedSingle);
    } catch (e) {}
    
    return {
      name: '',
      title: '',
      email: '',
      whatsapp: '',
      bio: '',
      experience: '',
      certificates: '',
      skills: '',
      profilePicture: ''
    };
  });

  // Input for log back in
  const [loginEmailInput, setLoginEmailInput] = useState('');
  const [loginFeedback, setLoginFeedback] = useState('');

  // Post Job forms
  const [postTitle, setPostTitle] = useState('');
  const [postCompany, setPostCompany] = useState('');
  const [postCountry, setPostCountry] = useState('UAE');
  const [postCity, setPostCity] = useState('Dubai');
  const [postMode, setPostMode] = useState<'Remote' | 'Hybrid' | 'On-site'>('On-site');

  const handlePostCountryChange = (country: string) => {
    setPostCountry(country);
    if (country === 'Remote / GCC Wide') {
      setPostCity('Remote');
    } else {
      const found = GCC_GEOGRAPHY.find(g => g.countryEn === country);
      if (found && found.cities.length > 0) {
        setPostCity(found.cities[0].cityEn);
      }
    }
  };
  const [postSalary, setPostSalary] = useState('');
  const [postEmail, setPostEmail] = useState('');
  const [postWhatsApp, setPostWhatsApp] = useState('');
  const [postDesc, setPostDesc] = useState('');
  const [postReqInputValue, setPostReqInputValue] = useState('');
  const [postReqs, setPostReqs] = useState<string[]>([]);
  
  // Apply quick forms
  const [applyName, setApplyName] = useState('');
  const [applyEmail, setApplyEmail] = useState('');
  const [applyPhone, setApplyPhone] = useState('');
  const [applyMessage, setApplyMessage] = useState('');
  const [applySuccessMessage, setApplySuccessMessage] = useState(false);

  // Interactive Incoming Email Alert Status (Receiver)
  interface SimulatedEmail {
    from: string;
    to: string;
    subject: string;
    body: string;
    date: string;
    visible: boolean;
  }
  const [inboundEmail, setInboundEmail] = useState<SimulatedEmail | null>(null);

  // Profile completeness calculations
  const profileCompletionScore = useMemo(() => {
    let score = 0;
    if (profile.name.trim()) score += 20;
    if (profile.title.trim()) score += 15;
    if (profile.email.trim()) score += 15;
    if (profile.whatsapp.trim()) score += 15;
    if (profile.bio.trim()) score += 10;
    if (profile.experience.trim()) score += 10;
    if (profile.certificates.trim()) score += 10;
    if (profile.skills.trim()) score += 5;
    return score;
  }, [profile]);

  // Is candidate logged in and has an active registered profile?
  const isRegisteredUser = useMemo(() => {
    return profile.name.trim() !== '' && profile.email.trim() !== '';
  }, [profile]);

  // Handle saving/registering profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name.trim() || !profile.email.trim() || !profile.whatsapp.trim()) {
      alert(isRtl ? '⚠️ يرجى إدخال الحقول المطلوبة الأساسية.' : '⚠️ Please enter the required fields.');
      return;
    }

    const lowerEmail = profile.email.trim().toLowerCase();
    const updatedDb = {
      ...seekersDatabase,
      [lowerEmail]: { ...profile, email: lowerEmail }
    };

    setSeekersDatabase(updatedDb);
    localStorage.setItem('careerpouch_seekers_database', JSON.stringify(updatedDb));
    localStorage.setItem('careerpouch_active_seeker_email', lowerEmail);
    // Legacy support too
    localStorage.setItem('careerpouch_seeker_profile', JSON.stringify(profile));

    alert(isRtl 
      ? '🎉 تم تحديث وتسجيل ملف الترشيح بنجاح في قاعدة البيانات المحلية ومزامنة هويتك!' 
      : '🎉 Candidate profile saved and registered in the database! Active session synced.'
    );
  };

  // Seeker image decoder (base64)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024 * 1.5) {
      alert(isRtl ? 'صورة ملف التعريف المحملة كبيرة جداً. يرجى اختيار ملف بحجم أقل من 1.5 ميغابايت.' : 'Selected image is too large. Please use an image file under 1.5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setProfile(prev => ({
          ...prev,
          profilePicture: event.target!.result as string
        }));
        setLoginFeedback(lexicon.uploadSuccessMsg);
        setTimeout(() => setLoginFeedback(''), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  // Seeker Log Back In Action
  const handleLogBackIn = (e: React.FormEvent) => {
    e.preventDefault();
    const emailToFind = loginEmailInput.trim().toLowerCase();
    if (!emailToFind) return;

    if (seekersDatabase[emailToFind]) {
      const matchProfile = seekersDatabase[emailToFind];
      setProfile(matchProfile);
      localStorage.setItem('careerpouch_active_seeker_email', emailToFind);
      setLoginFeedback(isRtl ? `👋 أهلاً بك مجدداً، ${matchProfile.name}!` : `👋 Welcome back, ${matchProfile.name}!`);
      setLoginEmailInput('');
      setTimeout(() => setLoginFeedback(''), 4000);
    } else {
      // Create new setup state initialized with this email
      setProfile({
        name: '',
        title: '',
        email: emailToFind,
        whatsapp: '',
        bio: '',
        experience: '',
        certificates: '',
        skills: '',
        profilePicture: ''
      });
      setLoginFeedback(lexicon.noProfileYet);
      setTimeout(() => setLoginFeedback(''), 5000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('careerpouch_active_seeker_email');
    setProfile({
      name: '',
      title: '',
      email: '',
      whatsapp: '',
      bio: '',
      experience: '',
      certificates: '',
      skills: '',
      profilePicture: ''
    });
    setLoginFeedback(isRtl ? 'تم تسجيل خروج الجلسة.' : 'Session logged out.');
    setTimeout(() => setLoginFeedback(''), 3000);
  };

  // Requirement handlers for Job posting
  const handleAddPostReq = () => {
    if (postReqInputValue.trim()) {
      setPostReqs([...postReqs, postReqInputValue.trim()]);
      setPostReqInputValue('');
    }
  };

  const handleRemovePostReq = (index: number) => {
    setPostReqs(postReqs.filter((_, i) => i !== index));
  };

  // Submit Job
  const handlePostJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postCompany.trim() || !postEmail.trim()) {
      alert(isRtl ? '⚠️ يرجى ملء الحقول الأساسية المطلوبة لنشر الشاغر.' : '⚠️ Please fill out Job Title, Company, and Contact Email.');
      return;
    }

    const finalRequirements = [...postReqs];
    if (postReqInputValue.trim()) {
      finalRequirements.push(postReqInputValue.trim());
    }

    const finalLocation = postCountry === 'Remote / GCC Wide'
      ? 'Remote / GCC Wide'
      : `${postCity}, ${postCountry}`;

    const newJob: Job = {
      id: `job-user-${Date.now()}`,
      title: postTitle.trim(),
      company: postCompany.trim(),
      location: finalLocation,
      mode: postMode,
      salary: postSalary.trim() || 'Undisclosed / Competitive',
      description: postDesc.trim() || 'No detailed description provided.',
      requirements: finalRequirements.length > 0 ? finalRequirements : ['Interest and professional experience'],
      contactEmail: postEmail.trim(),
      contactWhatsApp: postWhatsApp.trim() || undefined,
      datePosted: new Date().toISOString().split('T')[0],
      isUserPosted: true
    };

    try {
      const savedUserJobs = localStorage.getItem('careerpouch_user_jobs');
      const currentVal = savedUserJobs ? JSON.parse(savedUserJobs) : [];
      const updatedList = [newJob, ...currentVal];
      localStorage.setItem('careerpouch_user_jobs', JSON.stringify(updatedList));
      
      setJobs([newJob, ...jobs]);
      
      // Reset State
      setPostTitle('');
      setPostCompany('');
      setPostCountry('UAE');
      setPostCity('Dubai');
      setPostSalary('');
      setPostEmail('');
      setPostWhatsApp('');
      setPostDesc('');
      setPostReqs([]);
      setPostReqInputValue('');

      alert(isRtl ? '🚀 تم نشر الشاغر بنجاح في المنصة المحلية!' : '🚀 Success! Your job listing is live in the sandbox catalog.');
      setActiveTab('browse');
    } catch (err) {
      alert('Error saving job listing.');
    }
  };

  // Simulate receiving email regarding applied job
  const triggerEmailSimulation = (job: Job, candidateName: string, candidateEmail: string, isOneClick: boolean) => {
    const randomToken = Math.random().toString(36).substring(2, 10).toUpperCase();
    const mailPayload: SimulatedEmail = {
      from: "CareerPouch Automations <noreply@careerpouch.com>",
      to: `${candidateName} <${candidateEmail}>`,
      subject: isRtl 
        ? `تأكيد استلام طلبك: وظيفة ${job.title} لدى ${job.company}`
        : `Application Received: ${job.title} at ${job.company}`,
      body: isRtl
        ? `مرحباً ${candidateName}،\n\nنشكرك على استخدام بوابة كاريير باوتش للتقديم بضغطة واحدة!\n\nلقد تم تسجيل وإرسال طلب توظيفك بنجاح للجهة المعنية. التفاصيل:\n• المسمى المطلوب: ${job.title}\n• الشركة المستهدفة: ${job.company}\n• عنوان بريد الشركة: ${job.contactEmail}\n• الرمز الخاص بالتتبع: CPN-REG-${randomToken}\n\nسيتواصل معك فريق الموارد البشرية مباشرة إذا تطابقت كفاءتك مع الوثيقة المطلوبة.\n\nتمنياتنا لك بالتوفيق والنجاح!\nـ فريق إدارة بوابة CareerPouch.`
        : `Dear ${candidateName},\n\nThank you for using the CareerPouch 1-Click Apply engine.\n\nWe have successfully received and routed your application payload for the following opportunity:\n\n• Job Applied: ${job.title}\n• Company Creator: ${job.company}\n• Direct Agency Email: ${job.contactEmail}\n• Secure Verification Token: CPN-REG-${randomToken}\n\nOur system has transmitted your seeker credentials, profile parameters, and linked index variables securely.\n\nBest of luck with your professional application!\n- The CareerPouch Automated System.`,
      date: new Date().toLocaleTimeString() + " (UTC+3)",
      visible: true
    };
    setInboundEmail(mailPayload);
  };

  // 1-Click Fast Apply Logic (Core requirement)
  const handleOneClickApply = (job: Job) => {
    if (!isRegisteredUser) {
      alert(isRtl ? 'يرجى تسجيل وتعبئة ملفك أولاً!' : 'Please complete your seeker profile first!');
      return;
    }

    setApplySuccessMessage(true);
    setTimeout(() => {
      setApplySuccessMessage(false);
      triggerEmailSimulation(job, profile.name, profile.email, true);
      alert(isRtl 
        ? `⚡ تم الإرسال بضغطة زر واحدة! لقد استلمت رسالة تأكيد رسمية بالبريد الإلكتروني على بريدك الإلكتروني: ${profile.email}` 
        : `⚡ Success! Applied instantly in 1-Click. A confirmation email has been dispatched to: ${profile.email}`
      );
    }, 1200);
  };

  const handleWhatsAppApply = (job: Job) => {
    if (!job.contactWhatsApp) return;
    let txt = `Hello, I'm interested in applying for the "${job.title}" position at "${job.company}" listed on CareerPouch.`;
    if (profileCompletionScore > 30) {
      txt += `\n\n__Candidate Profile__\nName: ${profile.name}\nTitle: ${profile.title}\nEmail: ${profile.email}\nExperience: ${profile.experience.substring(0, 100)}...`;
    }
    const encoded = encodeURIComponent(txt);
    window.open(`https://wa.me/${job.contactWhatsApp.replace(/[^0-9]/g, '')}?text=${encoded}`, '_blank');
  };

  const handleEmailApply = (job: Job) => {
    let subject = encodeURIComponent(`Application for ${job.title} - CareerPouch Seeker`);
    let body = encodeURIComponent(`Dear Recruitment Specialist,\n\nI wish to express active interest in applying for the ${job.title} position at ${job.company}.\n\n` + 
      (profileCompletionScore > 30 ? `About Me:\n- Name: ${profile.name}\n- Title: ${profile.title}\n- Experience Highlights: ${profile.experience}\n- Certificates: ${profile.certificates}\n\n` : `Please find my attached resume info.\n\n`) + 
      `Best regards,\n${profile.name || 'Candidate'}`);
    
    // Simulate email receipt before redirecting
    if (profile.email) {
      triggerEmailSimulation(job, profile.name || "Candidate Seeker", profile.email, false);
    }
    window.location.href = `mailto:${job.contactEmail}?subject=${subject}&body=${body}`;
  };

  // Apply quick dossier form submit
  const handleQuickApplyForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyName.trim() || !applyEmail.trim()) {
      alert('Please fill out Name and Email.');
      return;
    }
    if (!selectedJob) return;

    setApplySuccessMessage(true);
    setTimeout(() => {
      setApplySuccessMessage(false);
      triggerEmailSimulation(selectedJob, applyName.trim(), applyEmail.trim(), false);
      
      setApplyName('');
      setApplyEmail('');
      setApplyPhone('');
      setApplyMessage('');
      
      alert(isRtl 
        ? '📬 نجاح! تم إرسال ملف طلب التوظيف، وتلقيت رسالة تأكيد بالبريد الإلكتروني بنجاح.' 
        : '📬 Success! Application dataset transmitted. A confirmation email simulation has been delivered.'
      );
    }, 1300);
  };

  // Filter lists
  const filteredJobs = useMemo(() => {
    return jobs.filter(j => {
      const matchSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          j.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchLocation = false;
      if (selectedCountry === 'All') {
        matchLocation = true;
      } else if (selectedCountry === 'Remote') {
        matchLocation = j.mode === 'Remote' || j.location.toLowerCase().includes('remote');
      } else {
        if (selectedCity !== 'All') {
          matchLocation = j.location.toLowerCase().includes(selectedCity.toLowerCase());
        } else {
          const countryLower = selectedCountry.toLowerCase();
          if (countryLower === 'uae') {
            matchLocation = j.location.toLowerCase().includes('uae') || j.location.toLowerCase().includes('emirates');
          } else if (countryLower === 'saudi arabia') {
            matchLocation = j.location.toLowerCase().includes('saudi') || j.location.toLowerCase().includes('ksa') || j.location.toLowerCase().includes('riyadh');
          } else {
            matchLocation = j.location.toLowerCase().includes(countryLower);
          }
        }
      }

      return matchSearch && matchLocation;
    });
  }, [jobs, searchQuery, selectedCountry, selectedCity]);

  return (
    <div className={`space-y-8 font-sans ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* HEADER HERO AREA */}
      <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-slate-900/60 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-950'} relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full filter blur-xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-650 dark:text-cyan-405 bg-indigo-50/50 dark:bg-cyan-950/20 px-2.5 py-1 rounded">
              <PlusCircle size={11} className="text-indigo-550" />
              {isRtl ? 'بوابة التوظيف المفتوحة للخليج' : 'PORTAL PLATFORM ACTIVE'}
            </span>
            <h1 className="text-2xl sm:text-3.5xl font-extrabold tracking-tight">
              {lexicon.portalTitle}
            </h1>
            <p className={`text-sm max-w-2xl ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {lexicon.portalDesc}
            </p>
          </div>

          {/* Quick Active session indicator */}
          <div className={`p-4 rounded-2xl border text-xs ${isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'} min-w-[200px] space-y-2`}>
            <div className="flex items-center gap-2">
              {profile.profilePicture ? (
                <img 
                  src={profile.profilePicture} 
                  alt="Avatar" 
                  className="w-7 h-7 rounded-full object-cover border border-indigo-600" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  {profile.name ? profile.name[0].toUpperCase() : 'C'}
                </div>
              )}
              <div className="text-left">
                <span className="block text-[10px] uppercase font-mono text-slate-400 leading-none">{isRtl ? 'الجلسة الحالية' : 'ACTIVE SESSION'}</span>
                <span className="block font-bold text-slate-800 dark:text-white leading-tight truncate max-w-[140px]">
                  {profile.name || (isRtl ? 'مرشح مجهول' : 'Anonymous Seeker')}
                </span>
              </div>
            </div>

            {isRegisteredUser ? (
              <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-200/50 dark:border-slate-850">
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5"><CheckCircle size={10} /> {isRtl ? 'مسجل وموثق' : 'Verified'}</span>
                <button 
                  onClick={handleLogout}
                  className="text-[9px] text-rose-600 dark:text-rose-452 font-bold hover:underline cursor-pointer"
                >
                  {isRtl ? 'خروج' : 'Log Out'}
                </button>
              </div>
            ) : (
              <div className="pt-1 border-t border-slate-200/50 dark:border-slate-850">
                <span className="text-[9.5px] text-amber-600 block leading-tight">{isRtl ? 'غير متصل (إنشاء ملف أدناه)' : 'Not Logged In (Create Profile)'}</span>
              </div>
            )}
          </div>
        </div>

        {/* INTERACTIVE NAVIGATION FOR TABS */}
        <div className="flex flex-wrap gap-2 mt-8 border-t border-slate-250/40 dark:border-slate-800/60 pt-6 relative z-10 font-mono text-xs">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              activeTab === 'browse'
                ? 'bg-indigo-600 text-white shadow-md border-indigo-600'
                : isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-705 hover:bg-slate-100'
            }`}
          >
            {lexicon.tabBrowse}
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-md border-indigo-600'
                : isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-705 hover:bg-slate-100'
            }`}
          >
            {lexicon.tabProfile}
            {profile.profilePicture && (
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping inline-block" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('post')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              activeTab === 'post'
                ? 'bg-indigo-600 text-white shadow-md border-indigo-600'
                : isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-705 hover:bg-slate-100'
            }`}
          >
            {lexicon.tabPost}
          </button>
        </div>
      </div>

      {/* FEEDBACK LABELS */}
      {loginFeedback && (
        <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-cyan-400 text-xs font-mono rounded-xl text-center animate-pulse">
          {loginFeedback}
        </div>
      )}

      {/* REAL-TIME INBOUND EMAIL RECEIVER SIMULATOR */}
      {inboundEmail && inboundEmail.visible && (
        <div className="p-5 rounded-2xl border border-teal-500/20 bg-teal-500/5 max-w-4xl mx-auto space-y-4 animate-fade relative">
          <button 
            onClick={() => setInboundEmail(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-extrabold text-xs cursor-pointer"
          >
            {isRtl ? 'إغلاق ✕' : 'Dismiss ✕'}
          </button>
          
          <div className="flex items-start gap-3">
            <span className="text-xl">📬</span>
            <div className="text-left font-sans flex-1">
              <h4 className="text-xs font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-widest leading-none">
                {lexicon.emailNotificationSimul}
              </h4>
              <p className="text-[10.5px] text-slate-500 mt-1">
                {isRtl 
                  ? 'بريد الوارد الافتراضي: تم إرسال هذه النسخة إلى بريدك الإلكتروني كإشعار فوري بعد إتمام عملية التقديم بنجاح.'
                  : 'Sandbox SMTP Log: This is a verified transcript sent directly to your registered mailbox for reference.'}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 font-mono text-xs space-y-2 text-left">
            <div className="grid grid-cols-12 gap-1 border-b border-slate-100 dark:border-slate-900 pb-2">
              <span className="col-span-3 font-bold text-slate-400">{lexicon.emailFrom}:</span>
              <span className="col-span-9 text-indigo-600 dark:text-cyan-405 font-bold">{inboundEmail.from}</span>
              
              <span className="col-span-3 font-bold text-slate-400">{lexicon.emailTo}:</span>
              <span className="col-span-9 text-indigo-600 dark:text-cyan-453 font-bold">{inboundEmail.to}</span>
              
              <span className="col-span-3 font-bold text-slate-404">{lexicon.emailSubject}:</span>
              <span className="col-span-9 text-slate-800 dark:text-white font-extrabold">{inboundEmail.subject}</span>
              
              <span className="col-span-3 font-bold text-slate-400">Date:</span>
              <span className="col-span-9 text-slate-500">{inboundEmail.date}</span>
            </div>
            
            <div className="pt-2">
              <span className="block text-[10px] text-teal-600 font-black mb-1.5 uppercase font-mono tracking-wider">{lexicon.emailBodyHeader}</span>
              <pre className="whitespace-pre-wrap text-slate-650 dark:text-slate-300 font-mono leading-relaxed text-[11px] bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-200/40 dark:border-slate-850">
                {inboundEmail.body}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH AND BROWSE JOBS MAIN VIEW */}
      {activeTab === 'browse' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: FILTERS & LISTS */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* SEARCH & FILTERS INLINE GROUP */}
            <div className="space-y-4">
              {/* SEARCH CONTROLS */}
              <div className="relative">
                <Search className={`absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-3 text-slate-400`} size={16} />
                <input
                  type="text"
                  placeholder={lexicon.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 text-xs rounded-2xl focus:outline-none border ${
                    isDarkMode 
                      ? 'bg-slate-950 border-slate-850 text-white placeholder:text-slate-550 focus:border-indigo-505' 
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-440 focus:border-indigo-600'
                  }`}
                />
              </div>

              {/* COUNTRY FILTER BUTTONS */}
              <div className="space-y-1.5">
                <span className="block text-[10px] uppercase font-mono font-bold text-slate-400">
                  {isRtl ? '📍 تصفية حسب الدولة' : '📍 Filter by Country'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCountry('All');
                      setSelectedCity('All');
                    }}
                    className={`px-3 py-1.5 text-xs font-bold font-mono rounded-xl transition-all cursor-pointer ${
                      selectedCountry === 'All'
                        ? 'bg-indigo-650 text-white shadow-md'
                        : isDarkMode 
                          ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white' 
                          : 'bg-slate-50 border border-slate-201 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    💼 {isRtl ? 'كل الشواغر' : 'All'}
                  </button>

                  {GCC_GEOGRAPHY.map((geo) => {
                    const isActive = selectedCountry === geo.countryEn;
                    return (
                      <button
                        key={geo.countryEn}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(geo.countryEn);
                          setSelectedCity('All');
                        }}
                        className={`px-3 py-1.5 text-xs font-bold font-mono rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                          isActive
                            ? 'bg-indigo-650 text-white shadow-md'
                            : isDarkMode 
                              ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white' 
                              : 'bg-slate-50 border border-slate-201 text-slate-705 hover:bg-slate-100'
                        }`}
                      >
                        <span>{geo.flag}</span>
                        <span>{isRtl ? geo.countryAr : geo.countryEn}</span>
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCountry('Remote');
                      setSelectedCity('All');
                    }}
                    className={`px-3 py-1.5 text-xs font-bold font-mono rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                      selectedCountry === 'Remote'
                        ? 'bg-indigo-650 text-white shadow-md'
                        : isDarkMode 
                          ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white' 
                          : 'bg-slate-50 border border-slate-201 text-slate-705 hover:bg-slate-100'
                    }`}
                  >
                    🌐 {isRtl ? 'عن بعد' : 'Remote'}
                  </button>
                </div>
              </div>

              {/* CITY FILTER BUTTONS (DYNAMIC) */}
              {(() => {
                const currentGeo = GCC_GEOGRAPHY.find(g => g.countryEn === selectedCountry);
                if (!currentGeo) return null;

                return (
                  <div className="space-y-1.5 p-3 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 dark:border-indigo-400/10 animate-fade text-left">
                    <span className="block text-[10px] uppercase font-mono font-bold text-slate-400">
                      {isRtl ? `🏙️ تصفية مدن ${currentGeo.countryAr}` : `🏙️ Filter Cities in ${currentGeo.countryEn}`}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedCity('All')}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                          selectedCity === 'All'
                            ? 'bg-indigo-550 text-white'
                            : isDarkMode 
                              ? 'bg-slate-950 border border-slate-850 text-slate-405 hover:text-white' 
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {isRtl ? `الكل` : `All ${currentGeo.countryEn}`}
                      </button>

                      {currentGeo.cities.map((city) => {
                        const isCityActive = selectedCity === city.cityEn;
                        return (
                          <button
                            key={city.cityEn}
                            type="button"
                            onClick={() => setSelectedCity(city.cityEn)}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                              isCityActive
                                ? 'bg-indigo-550 text-white'
                                : isDarkMode 
                                  ? 'bg-slate-950 border border-slate-850 text-slate-405 hover:text-white' 
                                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {isRtl ? city.cityAr : city.cityEn}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* VACANCY CARDS LIST */}
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
              {filteredJobs.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-mono text-xs italic border border-dashed border-slate-250 dark:border-slate-800 rounded-3xl bg-white/40 dark:bg-slate-950/20">
                  {lexicon.placeholderBrowseNoJobs}
                </div>
              ) : (
                filteredJobs.map(job => (
                  <div
                    key={job.id}
                    onClick={() => {
                      setSelectedJob(job);
                      // Prepopulate dossier inputs if profile exists
                      if (isRegisteredUser) {
                        setApplyName(profile.name);
                        setApplyEmail(profile.email);
                        setApplyPhone(profile.whatsapp);
                      }
                    }}
                    className={`p-5 rounded-3xl border transition-all duration-300 hover:shadow-md cursor-pointer relative overflow-hidden text-left ${
                      selectedJob?.id === job.id
                        ? isDarkMode ? 'bg-indigo-950/40 border-indigo-501 shadow' : 'bg-indigo-50/45 border-indigo-200 shadow'
                        : isDarkMode ? 'bg-slate-950/40 border-slate-850 hover:bg-slate-950' : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {job.isUserPosted && (
                      <div className="absolute top-0 right-0 p-1 px-3 bg-indigo-500/10 text-indigo-705 dark:text-cyan-404 text-[8px] font-mono font-bold tracking-widest uppercase rounded-bl">
                        User Posted
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-400">
                        <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-700 dark:text-cyan-404 rounded font-medium">
                          {job.mode}
                        </span>
                        <span className="flex items-center gap-0.5"><Clock size={10} /> {job.datePosted}</span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                          {job.title}
                        </h3>
                        <p className="text-xs text-indigo-650 dark:text-cyan-405 font-bold">
                          {job.company} &bull; {job.location}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-900/60 pt-3 text-[10px] font-mono">
                        <span className="text-slate-500 font-bold">{job.salary}</span>
                        <span className="text-indigo-600 dark:text-cyan-405 font-bold flex items-center gap-0.5">
                          {isRtl ? 'استعراض الشاغر' : 'Review details'} {isRtl ? <ChevronRight size={10} /> : <ArrowRight size={10} />}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: DETAIL VIEW & FAST APPLICATION HUB */}
          <div className="lg:col-span-5 space-y-6">
            {selectedJob ? (
              <div className={`p-6 rounded-3xl border sticky top-4 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'} space-y-6 shadow-xl animate-fade`}>
                
                {/* Header detail */}
                <div className="space-y-2 border-b border-slate-200/50 dark:border-slate-850 pb-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-slate-404 flex items-center gap-1">
                      <Calendar size={11} /> {isRtl ? 'تاريخ النشر:' : 'Posted:'} {selectedJob.datePosted}
                    </span>
                    <button 
                      onClick={() => setSelectedJob(null)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                      title="Close details"
                    >
                      ✕
                    </button>
                  </div>

                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                    {selectedJob.title}
                  </h2>
                  <p className="text-xs text-indigo-600 dark:text-cyan-404 font-extrabold flex items-center gap-1 font-mono">
                    {selectedJob.company} &bull; <MapPin size={11} /> {selectedJob.location}
                  </p>
                </div>

                {/* Description paragraphs */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold">{lexicon.roleProfile}</h4>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {selectedJob.description}
                  </p>
                </div>

                {/* Requirements Bullet points */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold">{lexicon.posCoords}</h4>
                  <ul className="space-y-2 text-xs">
                    {selectedJob.requirements.map((req, i) => (
                      <li key={i} className={`flex gap-2 items-start text-slate-600 dark:text-slate-350 leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
                        <CheckCircle size={13} className="text-indigo-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Core Compensation Info Box */}
                <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 dark:border-indigo-400/10 rounded-xl space-y-1 text-xs text-left">
                  <span className="text-[9px] font-mono uppercase text-slate-400 block">{lexicon.compensation}</span>
                  <p className="font-extrabold text-indigo-650 dark:text-cyan-300">{selectedJob.salary}</p>
                </div>

                {/* INTERACTIVE APPLICATIONS FLOW OPTIONS */}
                <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-855 text-left">
                  <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold">{lexicon.easyApplyChannels}</h4>
                  
                  {/* If user profile is registered, enable 1-Click Fast Apply */}
                  {isRegisteredUser ? (
                    <div className="space-y-3">
                      <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-1.5">
                        <div className="flex items-center gap-2">
                          {profile.profilePicture ? (
                            <img 
                              src={profile.profilePicture} 
                              alt="Logged" 
                              className="w-8 h-8 rounded-full object-cover border border-emerald-500" 
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                              {profile.name[0].toUpperCase()}
                            </div>
                          )}
                          <div className="text-left font-sans flex-1">
                            <span className="block text-[10.5px] font-bold text-slate-800 dark:text-white leading-tight">
                              {profile.name} ({profile.title})
                            </span>
                            <span className="block text-[8.5px] text-emerald-600 dark:text-emerald-400 leading-none">
                              {lexicon.prepopulateBanner} &bull; {profileCompletionScore}% Done
                            </span>
                          </div>
                        </div>
                        <p className="text-[9px] text-slate-405 leading-snug pt-0.5">
                          {lexicon.prepopulateDesc}
                        </p>
                      </div>

                      {/* 1-Click Apply button */}
                      <button
                        onClick={() => handleOneClickApply(selectedJob)}
                        disabled={applySuccessMessage}
                        className="w-full py-3 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white hover:opacity-90 transition-all font-bold text-xs rounded-xl cursor-pointer shadow-md flex items-center justify-center gap-2"
                      >
                        {applySuccessMessage ? '⚡ Processing 1-Click Apply...' : lexicon.oneClickBtn}
                      </button>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-amber-500/5 border border-amber-500/15 rounded-2xl space-y-2">
                      <div className="flex gap-2 items-start">
                        <AlertCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                        <div className="text-left font-sans">
                          <span className="block text-[10.5px] font-extrabold text-amber-600 dark:text-amber-400 leading-tight">
                            {isRtl ? 'التقديم بضغطة زر مغلق' : '1-Click Apply Locked'}
                          </span>
                          <p className="text-[9px] text-slate-405 leading-relaxed mt-0.5">
                            {lexicon.loginFirst}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveTab('profile')}
                        className="w-full py-1.5 bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 text-[9.5px] font-bold rounded-lg font-mono transition-all text-center uppercase"
                      >
                        {isRtl ? 'تعبئة السيرة وتسجيل الدخول 👤' : 'Configure Profile & Log In 👤'}
                      </button>
                    </div>
                  )}

                  {/* Standard redirect channels */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      onClick={() => handleEmailApply(selectedJob)}
                      className="px-4 py-2 text-xs font-bold transition-all bg-indigo-605 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/10 flex items-center justify-center gap-1.5 cursor-pointer rounded-xl"
                    >
                      <Mail size={12} /> Email Redirect
                    </button>
                    {selectedJob.contactWhatsApp ? (
                      <button
                        onClick={() => handleWhatsAppApply(selectedJob)}
                        className="px-4 py-2 text-xs font-bold transition-all bg-emerald-605 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 flex items-center justify-center gap-1.5 cursor-pointer rounded-xl"
                      >
                        <Phone size={11} /> WhatsApp Redirect
                      </button>
                    ) : (
                      <div className="p-1 px-3 bg-slate-100 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-slate-405 flex items-center justify-center rounded-xl text-[10px] text-center font-mono leading-tight">
                        {lexicon.whatsAppUnlisted}
                      </div>
                    )}
                  </div>

                  {/* QUICK ALTERNATIVE SUBMIT FORM */}
                  <form onSubmit={handleQuickApplyForm} className="space-y-3 pt-4 border-t border-slate-200/40 dark:border-slate-850">
                    <span className="block text-[10px] uppercase font-mono text-slate-404">{lexicon.orTypeDossier}</span>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Your Name"
                        required
                        value={applyName}
                        onChange={(e) => setApplyName(e.target.value)}
                        className={`px-3 py-1.5 text-xs rounded-lg focus:outline-none border ${
                          isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                      />
                      <input
                        type="email"
                        placeholder="Your Email"
                        required
                        value={applyEmail}
                        onChange={(e) => setApplyEmail(e.target.value)}
                        className={`px-3 py-1.5 text-xs rounded-lg focus:outline-none border ${
                          isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>
                    
                    <input
                      type="text"
                      placeholder="WhatsApp (optional)"
                      value={applyPhone}
                      onChange={(e) => setApplyPhone(e.target.value)}
                      className={`w-full px-3 py-1.5 text-xs rounded-lg focus:outline-none border ${
                        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />

                    <textarea
                      placeholder="Brief text overview of experience..."
                      rows={2}
                      value={applyMessage}
                      onChange={(e) => setApplyMessage(e.target.value)}
                      className={`w-full p-2.5 text-xs rounded-xl focus:outline-none border ${
                        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />

                    <button
                      type="submit"
                      disabled={applySuccessMessage}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-705 text-xs font-bold rounded-xl transition-all cursor-pointer shadow"
                    >
                      {applySuccessMessage ? '⚡ Transmitting data...' : lexicon.submitDossier}
                    </button>
                  </form>
                </div>

              </div>
            ) : (
              <div className={`p-8 text-center rounded-3xl border border-dashed ${isDarkMode ? 'border-slate-800 text-slate-500 bg-slate-950/20' : 'border-slate-200 text-slate-400 bg-white/50'} flex flex-col items-center justify-center p-12 min-h-[350px]`}>
                <Sparkles size={40} className="text-indigo-400 dark:text-cyan-400 mb-3 opacity-60 animate-bounce" />
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-350">{lexicon.previewVacancy}</h3>
                <p className="text-xs max-w-xs mt-1 leading-relaxed text-slate-500">
                  Select any active role inside the browse panel to inspect salary indices, dossier requirements, and easy apply channels in secure local sandbox.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* MY CANDIDATE PROFILE CREATOR VIEW */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: THE INTERACTIVE PROFILES FORM */}
          <div className="lg:col-span-8 space-y-6">

            {/* REGISTERED SEEKER LOGIN BLOCK (Critical for logging back in) */}
            <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-slate-950 border-slate-850' : 'bg-white border-slate-200'} shadow-md`}>
              <form onSubmit={handleLogBackIn} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-900 pb-3">
                  <LogIn size={15} className="text-indigo-650" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{lexicon.logBackIn}</span>
                </div>
                <p className="text-[10.5px] text-slate-404">
                  {isRtl 
                    ? 'هل سجلت ملف ترشيح سابق تحت بريد إلكتروني معين؟ أدخله أدناه وسيقوم النظام فوراً بترحيل وتحميل كامل سيرتك الذاتية وصورتك الشخصية لمتابعة التقديم السريع!'
                    : 'Do you have an offline-saved profile with us? Simply enter its associated email to instantly load back your verified parameters and picture!'}
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder={lexicon.emailPlaceholder}
                    value={loginEmailInput}
                    onChange={(e) => setLoginEmailInput(e.target.value)}
                    className={`flex-1 px-4 py-2 text-xs rounded-xl focus:outline-none border ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    {lexicon.loadProfile}
                  </button>
                </div>
              </form>
            </div>

            {/* PRIMARY PROFILE CREATOR FORM */}
            <form onSubmit={handleSaveProfile} className={`p-6 sm:p-8 rounded-3xl border ${isDarkMode ? 'bg-slate-950 border-slate-850' : 'bg-white border-slate-200'} space-y-6 shadow-lg`}>
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-850 pb-4">
                <div className="p-1.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-cyan-400">
                  <User size={18} />
                </div>
                <div className="text-left font-sans flex-1">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {isRtl ? 'بيانات ملف الترشيح والسيرة للباحث كود:' : 'GCC Seeker Registry Dossier & CV Profile'}
                  </h3>
                  <p className="text-[10px] text-slate-405 mt-0.5">Your parameters reside privately inside local sandbox database state.</p>
                </div>
              </div>

              {/* PROFILE IMAGE LOADER (Optional upload) */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850">
                <label className="text-[10.5px] uppercase font-mono font-bold text-slate-405 block">{lexicon.profilePic}</label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {profile.profilePicture ? (
                    <div className="relative">
                      <img 
                        src={profile.profilePicture} 
                        alt="Profile uploaded" 
                        className="w-16 h-16 rounded-full object-cover border-2 border-indigo-600 shadow" 
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={() => setProfile(prev => ({ ...prev, profilePicture: '' }))}
                        className="absolute -top-1 -right-1 bg-rose-600 text-white w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold"
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-dashed border-slate-350 dark:border-slate-700">
                      <User size={24} />
                    </div>
                  )}
                  
                  <div className="text-left space-y-1.5 flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-indigo-500/10 text-indigo-705 dark:text-indigo-351 hover:bg-indigo-500/20 text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <Upload size={12} /> {isRtl ? 'اختيار صورة للرفع مظهر مهني' : 'Upload Picture'}
                    </button>
                    <span className="text-[9px] text-slate-405 block">JPG, PNG or SVG. Max 1.5MB format. Non-mandatory parameter.</span>
                  </div>
                </div>
              </div>

              {/* INPUT FIELDS AREA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono font-bold text-slate-405">{lexicon.fullName}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Liam Sterling"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className={`w-full px-4 py-2 text-xs rounded-xl focus:outline-none border ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-505' : 'bg-slate-50 border-slate-202 text-slate-905 focus:border-indigo-600'
                    }`}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono font-bold text-slate-405">{lexicon.headline}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Frontend Engineer"
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    className={`w-full px-4 py-2 text-xs rounded-xl focus:outline-none border ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-505' : 'bg-slate-50 border-slate-202 text-slate-905 focus:border-indigo-600'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono font-bold text-slate-405">{lexicon.contactEmail}</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. seeker@mail.ae"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className={`w-full px-4 py-2 text-xs rounded-xl focus:outline-none border ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-505' : 'bg-slate-50 border-slate-202 text-slate-905 focus:border-indigo-600'
                    }`}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono font-bold text-slate-405">{lexicon.whatsappNum}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +971500000000"
                    value={profile.whatsapp}
                    onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                    className={`w-full px-4 py-2 text-xs rounded-xl focus:outline-none border ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-505' : 'bg-slate-50 border-slate-202 text-slate-950 focus:border-indigo-600'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono font-bold text-slate-405">{lexicon.summaryBio}</label>
                <textarea
                  placeholder="Focus on years of experience, primary framework metrics, and soft skills align..."
                  rows={2}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className={`w-full p-3.5 text-xs rounded-xl focus:outline-none border ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-505' : 'bg-slate-50 border-slate-202 text-slate-950 focus:border-indigo-600'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono font-bold text-slate-405">{lexicon.experience}</label>
                <textarea
                  placeholder="e.g. 2024 - Present: TechOasis (Optimized React models rendering interfaces 40% faster)"
                  rows={3}
                  value={profile.experience}
                  onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                  className={`w-full p-3.5 text-xs rounded-xl focus:outline-none border ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-505' : 'bg-slate-50 border-slate-202 text-slate-950 focus:border-indigo-600'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono font-bold text-slate-405">{lexicon.certificates}</label>
                  <textarea
                    placeholder="e.g. Google Cloud Developer (2025), AWS Certified Solution Architect"
                    rows={2}
                    value={profile.certificates}
                    onChange={(e) => setProfile({ ...profile, certificates: e.target.value })}
                    className={`w-full p-3.5 text-xs rounded-xl focus:outline-none border ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-505' : 'bg-slate-50 border-slate-202 text-slate-950 focus:border-indigo-600'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono font-bold text-slate-405">{lexicon.skills}</label>
                  <textarea
                    placeholder="e.g. React, Tailwind, JWT security, Unit conversion metrics, Excel"
                    rows={2}
                    value={profile.skills}
                    onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                    className={`w-full p-3.5 text-xs rounded-xl focus:outline-none border ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-505' : 'bg-slate-50 border-slate-202 text-slate-950 focus:border-indigo-600'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold font-sans transition-all cursor-pointer shadow-md"
              >
                {lexicon.saveProfileBtn}
              </button>
            </form>
          </div>

          {/* RIGHT COLUMN: VALUE GAUGES & CV PREVIEW CARD WITH PROFILE PIC */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* CURRENT DATABASE METADATA LIST (To see registered emails for testing) */}
            <div className={`p-4 rounded-2xl border text-left ${isDarkMode ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'} space-y-2`}>
              <span className="text-[9.5px] font-mono uppercase text-slate-400 block font-bold">{lexicon.currentRegisteredSeekers} ({Object.keys(seekersDatabase).length})</span>
              <div className="max-h-24 overflow-y-auto space-y-1 font-mono text-[10px]">
                {Object.keys(seekersDatabase).length === 0 ? (
                  <span className="text-slate-405 block italic">None registered yet in database</span>
                ) : (
                  Object.entries(seekersDatabase).map(([email, storedData]) => {
                    const user = storedData as SeekerProfile;
                    return (
                      <button
                        key={email}
                        type="button"
                        onClick={() => {
                          setProfile(user);
                          localStorage.setItem('careerpouch_active_seeker_email', email);
                          setLoginFeedback(`Loaded: ${user.name}`);
                          setTimeout(() => setLoginFeedback(''), 3000);
                        }}
                        className="w-full flex items-center justify-between p-1 px-2 border border-slate-100 dark:border-slate-850 rounded hover:bg-slate-100 dark:hover:bg-slate-900 group transition-all text-left"
                      >
                        <span className="truncate flex-1 font-black">{email}</span>
                        <span className="text-indigo-600 text-[8.5px] group-hover:underline">({user.name})</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* RADIAL COMPLETION INDEX PANEL */}
            <div className={`p-6 rounded-2xl border text-center ${isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'} space-y-6 relative overflow-hidden`}>
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-400 to-indigo-500" />
              <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold">{isRtl ? 'مؤشر اكتمال ملف السيرة' : 'Profile completeness validation'}</h4>
              
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke={isDarkMode ? '#1e293b' : '#f1f5f9'}
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="url(#completionGradJobs)"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 52}
                    strokeDashoffset={2 * Math.PI * 52 * (1 - profileCompletionScore / 100)}
                    className="transition-all duration-700"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="completionGradJobs" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2dd4bf" />
                      <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-850 dark:text-white font-mono leading-none">{profileCompletionScore}%</span>
                  <span className="text-[8px] uppercase tracking-widest font-mono text-slate-405 leading-normal mt-0.5">{isRtl ? 'اكتمال الملف' : 'Progress'}</span>
                </div>
              </div>

              <div className="space-y-4 font-sans text-left text-xs">
                <span className="block text-[10px] uppercase font-mono text-slate-400 font-bold">Parameters Audited</span>
                <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                  <span className={`flex items-center gap-1.5 ${profile.name ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                    <CheckCircle size={10} /> Name (+20)
                  </span>
                  <span className={`flex items-center gap-1.5 ${profile.title ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                    <CheckCircle size={10} /> Title (+15)
                  </span>
                  <span className={`flex items-center gap-1.5 ${profile.email ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                    <CheckCircle size={10} /> Email (+15)
                  </span>
                  <span className={`flex items-center gap-1.5 ${profile.whatsapp ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                    <CheckCircle size={10} /> WhatsApp (+15)
                  </span>
                  <span className={`flex items-center gap-1.5 ${profile.bio ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                    <CheckCircle size={10} /> Summary (+10)
                  </span>
                  <span className={`flex items-center gap-1.5 ${profile.experience ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                    <CheckCircle size={10} /> Experience (+10)
                  </span>
                  <span className={`flex items-center gap-1.5 ${profile.certificates ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                    <CheckCircle size={10} /> Certs (+10)
                  </span>
                  <span className={`flex items-center gap-1.5 ${profile.skills ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                    <CheckCircle size={10} /> Skills (+5)
                  </span>
                </div>
              </div>
            </div>

            {/* DYNAMIC VERIFIED ID CARD VIEW */}
            <div className={`p-5 rounded-3xl border bg-gradient-to-b ${isDarkMode ? 'from-slate-950 to-slate-900 border-slate-800' : 'from-white to-slate-50 border-slate-205'} space-y-4 shadow relative overflow-hidden`}>
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-4 translate-x-4">
                <Briefcase size={120} className="text-slate-400" />
              </div>
              
              <div className="space-y-3.5 text-left font-sans">
                <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono font-bold tracking-wider">
                  <span className="flex items-center gap-1"><Shield size={10} className="text-emerald-500" /> {lexicon.seekerIdText}</span>
                  <span>ID: CP-2026-{profile.email ? profile.email.length : 'Z'}</span>
                </div>

                {/* Card header with avatar */}
                <div className="flex items-center gap-3">
                  {profile.profilePicture ? (
                    <img
                      src={profile.profilePicture}
                      alt="ID avatar"
                      className="w-12 h-12 rounded-full object-cover border border-indigo-600 shadow"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-indigo-650 text-white flex items-center justify-center font-bold text-lg border border-indigo-500/20">
                      {profile.name ? profile.name[0].toUpperCase() : 'C'}
                    </div>
                  )}
                  
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-black text-slate-950 dark:text-white leading-tight">
                      {profile.name || (isRtl ? 'مرشح مجهول' : 'Liam Sterling')}
                    </h3>
                    <p className="text-[10.5px] text-indigo-650 dark:text-cyan-404 font-bold leading-none">
                      {profile.title || (isRtl ? 'مطور واجهات ومصمم' : 'Senior Lead Engineer')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-[10px] text-slate-455 pt-1.5 border-t border-slate-100 dark:border-slate-900/60 font-mono">
                  <span className="flex items-center gap-1.5 text-slate-500"><Mail size={10} /> {profile.email || "seeker@careerpouch.ae"}</span>
                  <span className="flex items-center gap-1.5 text-slate-500"><Phone size={10} /> {profile.whatsapp || "+971500000000"}</span>
                </div>

                {profile.skills && (
                  <div className="space-y-1 text-xs text-left pt-1">
                    <span className="block text-[8px] uppercase font-mono font-bold tracking-widest text-slate-400">{lexicon.skillsIndexHeader}</span>
                    <div className="flex flex-wrap gap-1">
                      {profile.skills.split(',').map((skill, idx) => (
                        <span key={idx} className="bg-indigo-500/10 dark:bg-slate-900 text-indigo-705 dark:text-slate-300 text-[9px] px-2 py-0.5 rounded border border-indigo-500/5 dark:border-slate-800 font-medium">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* POST A JOB FREE VIEW */}
      {activeTab === 'post' && (
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handlePostJobSubmit} className={`p-6 sm:p-8 rounded-3xl border ${isDarkMode ? 'bg-slate-950 border-slate-850' : 'bg-white border-slate-201'} space-y-6 shadow-xl text-left`}>
            
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-855 pb-4">
              <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-453">
                <PlusCircle size={18} />
              </div>
              <div className="text-left font-sans flex-1">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{isRtl ? 'إعلان وظيفة جديدة مجاناً' : 'Post GCC Vacancy Listing'}</h3>
                <p className="text-[10px] text-slate-405 leading-none mt-0.5">No agency fees. The details instantly synchronize in sandbox listings memory.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 col-span-1">
                <label className="text-[10px] uppercase font-mono font-bold text-slate-405">{lexicon.jobTitleLabel}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Backend Node Developer"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className={`w-full px-4 py-2 text-xs rounded-xl focus:outline-none border ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-505' : 'bg-slate-50 border-slate-205 text-slate-900 focus:border-indigo-600'
                  }`}
                />
              </div>

              <div className="space-y-1 col-span-1">
                <label className="text-[10px] uppercase font-mono font-bold text-slate-405">{lexicon.compNameLabel}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arab Emirates Software Ltd"
                  value={postCompany}
                  onChange={(e) => setPostCompany(e.target.value)}
                  className={`w-full px-4 py-2 text-xs rounded-xl focus:outline-none border ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-505' : 'bg-slate-50 border-slate-205 text-slate-900 focus:border-indigo-600'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono font-bold text-slate-405">{isRtl ? 'الدولة *' : 'Country *'}</label>
                <select
                  value={postCountry}
                  onChange={(e) => handlePostCountryChange(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl focus:outline-none border ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-201 text-slate-900'
                  }`}
                >
                  {GCC_GEOGRAPHY.map(geo => (
                    <option key={geo.countryEn} value={geo.countryEn}>
                      {geo.flag} {isRtl ? geo.countryAr : geo.countryEn}
                    </option>
                  ))}
                  <option value="Remote / GCC Wide">
                    🌐 {isRtl ? 'عن بعد / دول الخليج' : 'Remote / GCC Wide'}
                  </option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono font-bold text-slate-405">{isRtl ? 'المدينة *' : 'City *'}</label>
                <select
                  value={postCity}
                  onChange={(e) => setPostCity(e.target.value)}
                  disabled={postCountry === 'Remote / GCC Wide'}
                  className={`w-full px-3 py-2 text-xs rounded-xl focus:outline-none border ${
                    isDarkMode 
                      ? 'bg-slate-900 border-slate-800 text-white disabled:opacity-40' 
                      : 'bg-slate-50 border-slate-201 text-slate-900 disabled:opacity-40'
                  }`}
                >
                  {postCountry === 'Remote / GCC Wide' ? (
                    <option value="Remote">{isRtl ? 'عن بعد' : 'Remote'}</option>
                  ) : (
                    (() => {
                      const found = GCC_GEOGRAPHY.find(g => g.countryEn === postCountry);
                      if (!found) return <option value="All">{isRtl ? 'كل المدن' : 'All'}</option>;
                      return found.cities.map(c => (
                        <option key={c.cityEn} value={c.cityEn}>
                          {isRtl ? c.cityAr : c.cityEn}
                        </option>
                      ));
                    })()
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono font-bold text-slate-405">{lexicon.jobModeLabel}</label>
                <select
                  value={postMode}
                  onChange={(e) => setPostMode(e.target.value as any)}
                  className={`w-full px-3 py-2 text-xs rounded-xl focus:outline-none border ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-201 text-slate-900'
                  }`}
                >
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono font-bold text-slate-405">{lexicon.salaryLabel}</label>
                <input
                  type="text"
                  placeholder="e.g. AED 14,000 - 18,000"
                  value={postSalary}
                  onChange={(e) => setPostSalary(e.target.value)}
                  className={`w-full px-4 py-2 text-xs rounded-xl focus:outline-none border ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-505' : 'bg-slate-50 border-slate-201 text-slate-900 focus:border-indigo-600'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono font-bold text-slate-405">{lexicon.corpEmailLabel}</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. recruitment@firm.com"
                  value={postEmail}
                  onChange={(e) => setPostEmail(e.target.value)}
                  className={`w-full px-4 py-2 text-xs rounded-xl focus:outline-none border ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-505' : 'bg-slate-50 border-slate-205 text-slate-900 focus:border-indigo-600'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono font-bold text-slate-405">Contact WhatsApp Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. +971501111111"
                  value={postWhatsApp}
                  onChange={(e) => setPostWhatsApp(e.target.value)}
                  className={`w-full px-4 py-2 text-xs rounded-xl focus:outline-none border ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-505' : 'bg-slate-50 border-slate-205 text-slate-900 focus:border-indigo-600'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono font-bold text-slate-405">{lexicon.descLabel}</label>
              <textarea
                placeholder="Responsibilities, daily workflow targets, specific client-side validations, tech requirements, expected deliverables..."
                rows={4}
                required
                value={postDesc}
                onChange={(e) => setPostDesc(e.target.value)}
                className={`w-full p-3.5 text-xs rounded-xl focus:outline-none border ${
                  isDarkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-505' : 'bg-slate-50 border-slate-205 text-slate-900 focus:border-indigo-600'
                }`}
              />
            </div>

            {/* Interactive Requirements Builder */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono font-bold text-slate-405">{lexicon.reqBuilderLabel}</label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a required credential (e.g. 3 years React exp) and hit Add"
                  value={postReqInputValue}
                  onChange={(e) => setPostReqInputValue(e.target.value)}
                  className={`flex-1 px-4 py-2 text-xs rounded-xl focus:outline-none border ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-205 text-slate-905'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleAddPostReq}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  {lexicon.addReqBtn}
                </button>
              </div>

              {postReqs.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2.5">
                  {postReqs.map((req, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-505/20 rounded-full text-xs text-indigo-700 dark:text-indigo-400 font-medium">
                      <span>{req}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemovePostReq(i)}
                        className="text-indigo-900 dark:text-indigo-200 hover:text-rose-600 dark:hover:text-rose-452 font-black text-xs"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-sans transition-all cursor-pointer shadow-md"
            >
              {lexicon.broadcastJobBtn}
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
