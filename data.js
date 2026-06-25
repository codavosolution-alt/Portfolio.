/* ===========================================================
   PORTFOLIO — Codavo Solutions
   data.js — Central editable content store
   Shared between the public site (main.js) and the admin panel (admin.html)
   =========================================================== */

(function (global) {
  'use strict';

  const STORAGE_KEY = 'portfolio-site-data';

  /* -----------------------------------------------------
     DEFAULT DATA — used the first time the site loads,
     or whenever no saved data exists in localStorage.
     ----------------------------------------------------- */
  const defaultData = {
    siteBrand: {
      logoText: "Codavo Solutions",
      logoBracketColor: true,
      logoImageUrl: "",
      logoSize: 32,
      siteTitle: { en: "Codavo Solutions — Web & Desktop Development", ar: "Codavo Solutions — تطوير مواقع وبرامج سطح مكتب" }
    },

    siteUI: {
      nav: {
        home: { en: "Home", ar: "الرئيسية" },
        about: { en: "About", ar: "نبذة عنا" },
        skills: { en: "Skills", ar: "المهارات" },
        services: { en: "Services", ar: "الخدمات" },
        projects: { en: "Projects", ar: "المشاريع" },
        experience: { en: "Experience", ar: "الخبرة" },
        contact: { en: "Contact", ar: "تواصل معنا" }
      },
      hero: {
        eyebrow: { en: "Available for new projects", ar: "متاح لاستقبال مشاريع جديدة" },
        greeting: { en: "Hi, We", ar: "أهلاً، نحن" },
        btnWork: { en: "View Our Work", ar: "شاهد أعمالنا" },
        btnContact: { en: "Contact Us", ar: "تواصل معنا" },
        btnCv: { en: "Download Profile", ar: "تحميل الملف التعريفي" },
        statProjectsLabel: { en: "Projects Delivered", ar: "مشروع منفّذ" },
        statYearsLabel: { en: "Years Experience", ar: "سنوات خبرة" },
        statSatisfactionLabel: { en: "Client Satisfaction", ar: "رضا العملاء" }
      },
      sectionTitles: {
        aboutEyebrow: { en: "Who We Are", ar: "من نحن" },
        aboutTitle: { en: "About Us", ar: "نبذة عنا" },
        skillsEyebrow: { en: "What We Work With", ar: "أدواتنا ومجالات عملنا" },
        skillsTitle: { en: "Skills & Technologies", ar: "المهارات والتقنيات" },
        servicesEyebrow: { en: "What We Offer", ar: "ما نقدمه" },
        servicesTitle: { en: "Services", ar: "الخدمات" },
        projectsEyebrow: { en: "Selected Work", ar: "أعمال مختارة" },
        projectsTitle: { en: "Projects", ar: "المشاريع" },
        experienceEyebrow: { en: "Our Expertise", ar: "خبراتنا" },
        experienceTitle: { en: "What We Do", ar: "ماذا نقدم" },
        contactEyebrow: { en: "Get In Touch", ar: "تواصل معنا" },
        contactTitle: { en: "Contact", ar: "تواصل" }
      },
      about: {
        card1Title: { en: "Clean Code", ar: "كود نظيف" },
        card1Desc: { en: "Structured, readable, and maintainable code that's easy to extend.", ar: "كود منظم وسهل القراءة وقابل للتوسعة بسهولة." },
        card2Title: { en: "Responsive Design", ar: "تصميم متجاوب" },
        card2Desc: { en: "Interfaces that look and work great on every screen size.", ar: "واجهات تبدو وتعمل بشكل رائع على جميع أحجام الشاشات." },
        card3Title: { en: "Database Design", ar: "تصميم قواعد البيانات" },
        card3Desc: { en: "Well-structured MySQL schemas built for performance and growth.", ar: "مخططات MySQL منظمة جيدًا، مبنية للأداء والتوسع المستقبلي." },
        card4Title: { en: "Problem Solving", ar: "حل المشكلات" },
        card4Desc: { en: "Practical solutions to real business and workflow challenges.", ar: "حلول عملية لتحديات الأعمال وسير العمل الحقيقية." },
        signatureRole: { en: "Web & Desktop Development Studio", ar: "استوديو تطوير مواقع وبرامج سطح مكتب" }
      },
      skillsLabels: {
        frontend: { en: "Frontend", ar: "الواجهة الأمامية" },
        backend: { en: "Backend", ar: "الواجهة الخلفية" },
        desktop: { en: "Desktop Applications", ar: "تطبيقات سطح المكتب" },
        tools: { en: "Tools", ar: "الأدوات" },
        terminalLine1: { en: "whoami", ar: "whoami" },
        terminalLine2: { en: "codavo_solutions_team", ar: "فريق_Codavo_Solutions" },
        terminalLine3: { en: "status --check", ar: "status --check" },
        terminalLine4: { en: "✓ Open to new projects", ar: "✓ متاح لمشاريع جديدة" }
      },
      projectsLabels: {
        liveDemo: { en: "Live Demo", ar: "عرض مباشر" },
        sourceCode: { en: "Source Code", ar: "الكود المصدري" },
        viewMore: { en: "View More Projects", ar: "عرض المزيد من المشاريع" }
      },
      contactForm: {
        lead: { en: "Have a project in mind? Let's talk about how we can help bring it to life.", ar: "لديك مشروع في بالك؟ لنتحدث عن كيف يمكننا مساعدتك في تنفيذه." },
        emailLabel: { en: "Email", ar: "البريد الإلكتروني" },
        phoneLabel: { en: "Phone", ar: "الهاتف" },
        whatsappLabel: { en: "WhatsApp", ar: "واتساب" },
        nameField: { en: "Name", ar: "الاسم" },
        emailField: { en: "Email", ar: "البريد الإلكتروني" },
        subjectField: { en: "Subject", ar: "الموضوع" },
        messageField: { en: "Message", ar: "الرسالة" },
        sendBtn: { en: "Send Message", ar: "إرسال الرسالة" },
        successMsg: { en: "Your message has been sent successfully!", ar: "تم إرسال رسالتك بنجاح!" },
        errNameRequired: { en: "Please enter your name.", ar: "من فضلك أدخل اسمك." },
        errEmailRequired: { en: "Please enter your email.", ar: "من فضلك أدخل بريدك الإلكتروني." },
        errEmailInvalid: { en: "Please enter a valid email address.", ar: "من فضلك أدخل بريدًا إلكترونيًا صحيحًا." },
        errSubjectRequired: { en: "Please enter a subject.", ar: "من فضلك أدخل الموضوع." },
        errMessageRequired: { en: "Please write a message.", ar: "من فضلك اكتب رسالتك." }
      },
      footer: {
        rights: { en: "All rights reserved.", ar: "جميع الحقوق محفوظة." }
      }
    },

    profile: {
      name: { en: "Codavo Solutions", ar: "Codavo Solutions" },
      role: { en: "Web & Desktop Application Development Company", ar: "شركة تطوير مواقع ويب وتطبيقات سطح مكتب" },
      heroDesc: {
        en: "We help individuals and businesses build professional websites, management systems, admin dashboards, and desktop applications — with clean code, solid databases, and real business results.",
        ar: "نساعد الأفراد والشركات في بناء مواقع احترافية، أنظمة إدارة، لوحات تحكم، وبرامج سطح مكتب — بكود نظيف، وقواعد بيانات متينة، ونتائج أعمال حقيقية."
      },
      aboutP1: {
        en: "Codavo Solutions specializes in building responsive websites, web-based management systems, and desktop applications. Our work spans from pixel-perfect front-end interfaces to fully functional admin dashboards backed by well-structured MySQL databases.",
        ar: "تتخصص Codavo Solutions في بناء مواقع متجاوبة، أنظمة إدارة مبنية على الويب، وتطبيقات سطح مكتب. يمتد عملنا من واجهات أمامية دقيقة التفاصيل إلى لوحات تحكم كاملة الوظائف ترتكز على قواعد بيانات MySQL منظمة جيدًا."
      },
      aboutP2: {
        en: "We care about writing clean, maintainable code and creating interfaces that feel effortless to use. Whether it's a clinic booking platform, an educational system, or a desktop tool for managing local records, we focus on solving real problems with reliable, well-tested solutions.",
        ar: "نهتم بكتابة كود نظيف وقابل للصيانة، وبتصميم واجهات يسهل استخدامها دون عناء. سواء كان نظام حجز عيادة، منصة تعليمية، أو أداة سطح مكتب لإدارة السجلات المحلية، نركّز على حل المشكلات الحقيقية بحلول موثوقة ومجرّبة جيدًا."
      },
      statProjects: 16,
      statYears: 3,
      statSatisfaction: 100,
      cvUrl: ""
    },

    contact: {
      email: "hello@codavosolutions.com",
      phone: "+20 100 000 0000",
      whatsapp: "201000000000",
      github: "",
      linkedin: "",
      facebook: "",
      behance: "",
      web3formsAccessKey: ""
    },

    services: [
      {
        icon: "fa-solid fa-globe",
        title: { en: "Website Design", ar: "تصميم المواقع" },
        desc: { en: "Modern, responsive websites built from scratch and tailored to your brand.", ar: "مواقع عصرية ومتجاوبة، مبنية من الصفر ومصممة خصيصًا لهويتك." }
      },
      {
        icon: "fa-solid fa-bolt",
        title: { en: "Landing Pages", ar: "صفحات الهبوط" },
        desc: { en: "High-converting landing pages focused on speed, clarity, and design.", ar: "صفحات هبوط عالية التحويل تركّز على السرعة والوضوح والتصميم." }
      },
      {
        icon: "fa-solid fa-graduation-cap",
        title: { en: "Educational Platforms", ar: "منصات تعليمية" },
        desc: { en: "Full e-learning systems with courses, exams, and certificates.", ar: "أنظمة تعليم إلكتروني كاملة تشمل الكورسات والاختبارات والشهادات." }
      },
      {
        icon: "fa-solid fa-chart-line",
        title: { en: "Admin Dashboards", ar: "لوحات تحكم" },
        desc: { en: "Clean, data-driven dashboards for managing users, reports and stats.", ar: "لوحات تحكم نظيفة تعتمد على البيانات لإدارة المستخدمين والتقارير والإحصائيات." }
      },
      {
        icon: "fa-solid fa-desktop",
        title: { en: "Desktop Applications", ar: "تطبيقات سطح المكتب" },
        desc: { en: "Reliable desktop tools with local database integration.", ar: "برامج سطح مكتب موثوقة مع ربط قواعد بيانات محلية." }
      },
      {
        icon: "fa-solid fa-database",
        title: { en: "Database Design", ar: "تصميم قواعد البيانات" },
        desc: { en: "Efficient, scalable MySQL schemas designed around your data.", ar: "مخططات MySQL فعّالة وقابلة للتوسع مصممة حول بياناتك." }
      },
      {
        icon: "fa-solid fa-screwdriver-wrench",
        title: { en: "Website Fixing & Responsive Improvements", ar: "إصلاح المواقع وتحسين التجاوب" },
        desc: { en: "Fixing bugs and improving responsiveness on existing websites.", ar: "إصلاح الأخطاء وتحسين تجاوب المواقع الموجودة مسبقًا." }
      }
    ],

    skills: {
      frontend: [
        { name: "HTML5", percent: 95 },
        { name: "CSS3", percent: 90 },
        { name: "JavaScript", percent: 85 },
        { name: { en: "Responsive Design", ar: "تصميم متجاوب" }, percent: 90 },
        { name: { en: "UI/UX Basics", ar: "أساسيات UI/UX" }, percent: 80 }
      ],
      backend: [
        { name: "PHP", percent: 85 },
        { name: "MySQL", percent: 85 },
        { name: { en: "Database Design", ar: "تصميم قواعد البيانات" }, percent: 80 }
      ],
      desktop: [
        { name: "C#", percent: 75 },
        { name: { en: "Windows Forms / Desktop Apps", ar: "Windows Forms / تطبيقات سطح المكتب" }, percent: 75 },
        { name: { en: "Local Database Integration", ar: "ربط قواعد البيانات المحلية" }, percent: 70 }
      ],
      tools: ["VS Code", "XAMPP", "GitHub", "Figma", "Git", "Photoshop"]
    },

    projects: [
      {
        icon: "fa-solid fa-stethoscope",
        thumbClass: "project-thumb--1",
        image: "",
        title: { en: "Smart Care Clinic", ar: "Smart Care Clinic" },
        desc: {
          en: "Medical appointment booking system with admin dashboard, doctors, patients, appointments, and prescriptions.",
          ar: "نظام حجز مواعيد طبية مع لوحة تحكم، أطباء، مرضى، مواعيد، ووصفات طبية."
        },
        tags: ["PHP", "MySQL", "JavaScript", "Bootstrap"],
        liveUrl: "#",
        codeUrl: "#"
      },
      {
        icon: "fa-solid fa-graduation-cap",
        thumbClass: "project-thumb--2",
        image: "",
        title: { en: "CodeLearn Platform", ar: "CodeLearn Platform" },
        desc: {
          en: "Educational platform with students, teachers, courses, exams, certificates, and admin dashboard.",
          ar: "منصة تعليمية تضم طلابًا، معلمين، كورسات، اختبارات، شهادات، ولوحة تحكم."
        },
        tags: ["PHP", "MySQL", "HTML/CSS", "JavaScript"],
        liveUrl: "#",
        codeUrl: "#"
      },
      {
        icon: "fa-solid fa-chart-pie",
        thumbClass: "project-thumb--3",
        image: "",
        title: { en: "Admin Dashboard UI", ar: "Admin Dashboard UI" },
        desc: {
          en: "Responsive dashboard interface for managing users, reports, and statistics.",
          ar: "واجهة لوحة تحكم متجاوبة لإدارة المستخدمين والتقارير والإحصائيات."
        },
        tags: ["HTML5", "CSS3", "JavaScript", "Chart.js"],
        liveUrl: "#",
        codeUrl: "#"
      },
      {
        icon: "fa-solid fa-folder-tree",
        thumbClass: "project-thumb--4",
        image: "",
        title: { en: "Desktop Management System", ar: "Desktop Management System" },
        desc: {
          en: "Desktop application for managing records and local database operations.",
          ar: "تطبيق سطح مكتب لإدارة السجلات والتعامل مع قاعدة بيانات محلية."
        },
        tags: ["C#", "Windows Forms", "SQL Server"],
        liveUrl: "#",
        codeUrl: "#"
      }
    ],

    experience: [
      {
        icon: "fa-solid fa-laptop-code",
        title: { en: "Web Development Studio", ar: "استوديو تطوير مواقع" },
        desc: { en: "Building websites, dashboards, and management systems for clients and businesses of all sizes.", ar: "بناء مواقع، لوحات تحكم، وأنظمة إدارة لعملاء وشركات بمختلف الأحجام." }
      },
      {
        icon: "fa-solid fa-stethoscope",
        title: { en: "Graduation Project — Smart Care Clinic", ar: "مشروع التخرج — Smart Care Clinic" },
        desc: { en: "Designed and developed a full clinic management system as a graduation project.", ar: "تصميم وتطوير نظام إدارة عيادة كامل كمشروع تخرج." }
      },
      {
        icon: "fa-solid fa-graduation-cap",
        title: { en: "Educational Platform Development", ar: "تطوير منصة تعليمية" },
        desc: { en: "Built an e-learning platform with course management, exams, and certification.", ar: "بناء منصة تعليم إلكتروني مع إدارة كورسات واختبارات وشهادات." }
      },
      {
        icon: "fa-solid fa-desktop",
        title: { en: "Desktop Applications Development", ar: "تطوير تطبيقات سطح المكتب" },
        desc: { en: "Developed desktop tools using C# with local database integration.", ar: "تطوير أدوات سطح مكتب باستخدام C# مع ربط قواعد بيانات محلية." }
      },
      {
        icon: "fa-solid fa-network-wired",
        title: { en: "IT & Networking Background", ar: "خلفية في تقنية المعلومات والشبكات" },
        desc: { en: "Solid foundation in IT support and networking fundamentals.", ar: "أساس متين في الدعم التقني وأساسيات الشبكات." }
      }
    ]
  };

  /* -----------------------------------------------------
     LOAD / SAVE
     ----------------------------------------------------- */
  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return deepClone(defaultData);
      const parsed = JSON.parse(raw);
      // Merge with defaults so newly-added fields never break old saved data
      return deepMerge(deepClone(defaultData), parsed);
    } catch (e) {
      console.warn('Could not load saved site data, using defaults.', e);
      return deepClone(defaultData);
    }
  }

  function saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Could not save site data.', e);
      return false;
    }
  }

  function resetData() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function deepMerge(base, override) {
    if (Array.isArray(override)) return override;
    if (typeof override !== 'object' || override === null) return override;
    const result = Object.assign({}, base);
    Object.keys(override).forEach(function (key) {
      if (
        typeof override[key] === 'object' && override[key] !== null &&
        typeof base[key] === 'object' && base[key] !== null &&
        !Array.isArray(override[key])
      ) {
        result[key] = deepMerge(base[key], override[key]);
      } else {
        result[key] = override[key];
      }
    });
    return result;
  }

  /* Expose a small shared API on window so both main.js and admin.html can use it */
  global.PortfolioStore = {
    STORAGE_KEY: STORAGE_KEY,
    defaultData: defaultData,
    load: loadData,
    save: saveData,
    reset: resetData,
    clone: deepClone
  };

})(window);
