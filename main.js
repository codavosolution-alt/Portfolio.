/* ===========================================================
   PORTFOLIO — Codavo Solutions
   main.js — i18n, theme, animations, validation
   =========================================================== */

(function () {
  'use strict';

  /* ===================================================
     1. SITE DATA — loaded from data.js (PortfolioStore)
     All editable UI text now lives in siteData.siteUI,
     populated by the Admin Panel. No more static dictionary here.
     =================================================== */


  /* Code snippets for the hero "code window" — typed live per language */
  const codeSnippets = {
    en: {
      title: "dashboard.php",
      code: `<?php
// Smart Care Clinic — Admin API
function getTodayAppointments($pdo) {
    $sql = "SELECT a.*, p.name AS patient
            FROM appointments a
            JOIN patients p ON p.id = a.patient_id
            WHERE a.date = CURDATE()
            ORDER BY a.time ASC";

    $stmt = $pdo->query($sql);
    return $stmt->fetchAll();
}

// Clean, readable, production-ready.
echo "System online. Ready to deploy.";`
    },
    ar: {
      title: "dashboard.php",
      code: `<?php
// عيادة Smart Care — واجهة الإدارة
function getTodayAppointments($pdo) {
    $sql = "SELECT a.*, p.name AS patient
            FROM appointments a
            JOIN patients p ON p.id = a.patient_id
            WHERE a.date = CURDATE()
            ORDER BY a.time ASC";

    $stmt = $pdo->query($sql);
    return $stmt->fetchAll();
}

// كود نظيف وجاهز للإنتاج.
echo "النظام جاهز. جاهز للنشر.";`
    }
  };

  /* ===================================================
     2. STATE
     =================================================== */
  let currentLang = localStorage.getItem('portfolio-lang') || 'en';
  let currentTheme = localStorage.getItem('portfolio-theme') || 'light';
  const siteData = (window.PortfolioStore ? window.PortfolioStore.load() : null);

  const root = document.documentElement;
  const langToggle = document.getElementById('langToggle');
  const langToggleLabel = document.getElementById('langToggleLabel');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  /* ===================================================
     3. THEME (Light / Dark)
     =================================================== */
  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      themeIcon.className = 'fa-solid fa-sun';
    } else {
      root.removeAttribute('data-theme');
      themeIcon.className = 'fa-solid fa-moon';
    }
    currentTheme = theme;
    localStorage.setItem('portfolio-theme', theme);
  }

  themeToggle.addEventListener('click', function () {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  /* ===================================================
     4. LANGUAGE (EN / AR) + RTL
     =================================================== */
  function applyLanguage(lang) {
    if (lang === 'ar') {
      root.setAttribute('lang', 'ar');
      root.setAttribute('dir', 'rtl');
      langToggleLabel.textContent = 'EN';
    } else {
      root.setAttribute('lang', 'en');
      root.setAttribute('dir', 'ltr');
      langToggleLabel.textContent = 'AR';
    }

    currentLang = lang;
    localStorage.setItem('portfolio-lang', lang);

    // Re-render every data-driven piece of text in the new language
    applyBrandAndNav(lang);
    applyStaticUITexts(lang);
    applyProfileAndContactText(lang);
    renderDynamicSections(lang);

    // Restart the code-window typing animation in the new language
    startCodeTyper(lang);
  }

  langToggle.addEventListener('click', function () {
    applyLanguage(currentLang === 'en' ? 'ar' : 'en');
  });

  /* ===================================================
     4b. DYNAMIC CONTENT — rendered from siteData (data.js)
     Falls back gracefully if data.js failed to load.
     =================================================== */

  // Pick the right-language string out of a {en, ar} field, or return plain strings as-is.
  function pick(field, lang) {
    if (field == null) return '';
    if (typeof field === 'string') return field;
    return field[lang] || field.en || '';
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }

  function applyBrandAndNav(lang) {
    if (!siteData) return;
    const brand = siteData.siteBrand || {};
    const nav = (siteData.siteUI && siteData.siteUI.nav) || {};

    // Logo: when an image is set, show ONLY the image (no text, no brackets).
    // When there's no image, fall back to the text logo with <bracket>name</bracket>.
    const logoTextEl = document.getElementById('siteLogoText');
    const logoEl = document.getElementById('siteLogo');
    if (logoTextEl && brand.logoText) logoTextEl.textContent = brand.logoText;
    if (logoEl) {
      const existingImg = logoEl.querySelector('img.logo-image');
      if (brand.logoImageUrl) {
        const img = existingImg || document.createElement('img');
        img.src = brand.logoImageUrl;
        img.alt = brand.logoText || 'Logo';
        img.className = 'logo-image';
        const size = brand.logoSize != null ? brand.logoSize : 32;
        img.style.height = size + 'px';
        img.style.width = 'auto';
        if (!existingImg) logoEl.insertBefore(img, logoEl.firstChild);
        logoEl.classList.add('has-logo-image');
      } else if (existingImg) {
        existingImg.remove();
        logoEl.classList.remove('has-logo-image');
      }
    }

    // Keep the navbar's reserved height in sync with the logo size so a
    // large logo image is never clipped or overflowing the bar.
    requestAnimationFrame(function () {
      const navbarEl = document.getElementById('navbar');
      if (navbarEl) {
        const actualHeight = navbarEl.offsetHeight;
        document.documentElement.style.setProperty('--nav-h', actualHeight + 'px');
      }
    });

    // Page title
    if (siteData.siteBrand && siteData.siteBrand.siteTitle) {
      document.title = pick(siteData.siteBrand.siteTitle, lang);
    }

    // Nav links (desktop + mobile), built dynamically so order/labels are fully editable.
    // On secondary pages (e.g. projects.html) there is no #home/#about section on the
    // current page, so links must point back to index.html's sections instead of "#key".
    const navOrder = ['home', 'about', 'skills', 'services', 'projects', 'experience', 'contact'];
    const isHomePage = !!document.getElementById('home');
    const hrefFor = function (key) {
      return isHomePage ? ('#' + key) : ('index.html#' + key);
    };
    const navLinksEl = document.getElementById('navLinks');
    const mobileNavEl = document.getElementById('mobileNav');
    if (navLinksEl) {
      navLinksEl.innerHTML = navOrder.map(function (key, i) {
        const label = nav[key] ? pick(nav[key], lang) : key;
        return '<a href="' + hrefFor(key) + '" class="nav-link' + (i === 0 && isHomePage ? ' active' : '') + '">' + escapeHtml(label) + '</a>';
      }).join('');
    }
    if (mobileNavEl) {
      mobileNavEl.innerHTML = navOrder.map(function (key) {
        const label = nav[key] ? pick(nav[key], lang) : key;
        return '<a href="' + hrefFor(key) + '" class="mobile-link">' + escapeHtml(label) + '</a>';
      }).join('');
      // Re-attach close-on-click for mobile links since we just rebuilt them
      mobileNavEl.querySelectorAll('.mobile-link').forEach(function (link) {
        link.addEventListener('click', closeMobileNav);
      });
    }
  }

  function applyStaticUITexts(lang) {
    if (!siteData || !siteData.siteUI) return;
    const ui = siteData.siteUI;
    const hero = ui.hero || {};
    const st = ui.sectionTitles || {};
    const about = ui.about || {};
    const cf = ui.contactForm || {};
    const footer = ui.footer || {};

    function setText(id, field) {
      const el = document.getElementById(id);
      if (el && field != null) el.textContent = pick(field, lang);
    }

    // Hero
    setText('heroEyebrowLabel', hero.eyebrow);
    setText('heroGreetingText', hero.greeting);
    setText('heroBtnWorkText', hero.btnWork);
    setText('heroBtnContactText', hero.btnContact);
    setText('heroBtnCvText', hero.btnCv);
    setText('statProjectsLabelText', hero.statProjectsLabel);
    setText('statYearsLabelText', hero.statYearsLabel);
    setText('statSatisfactionLabelText', hero.statSatisfactionLabel);

    // Section titles / eyebrows
    setText('aboutEyebrowText', st.aboutEyebrow);
    setText('aboutTitleText', st.aboutTitle);
    setText('skillsEyebrowText', st.skillsEyebrow);
    setText('skillsTitleText', st.skillsTitle);
    setText('servicesEyebrowText', st.servicesEyebrow);
    setText('servicesTitleText', st.servicesTitle);
    setText('projectsEyebrowText', st.projectsEyebrow);
    setText('projectsTitleText', st.projectsTitle);
    setText('experienceEyebrowText', st.experienceEyebrow);
    setText('experienceTitleText', st.experienceTitle);
    setText('contactEyebrowText', st.contactEyebrow);
    setText('contactTitleText', st.contactTitle);

    // About signature role
    setText('aboutSignatureRoleText', about.signatureRole);

    // About cards (rendered dynamically since they're a repeatable-looking grid)
    const aboutCardsGrid = document.getElementById('aboutCardsGrid');
    if (aboutCardsGrid) {
      const cardIcons = ['fa-solid fa-code', 'fa-solid fa-mobile-screen-button', 'fa-solid fa-database', 'fa-solid fa-puzzle-piece'];
      const cards = [1, 2, 3, 4].map(function (n) {
        return {
          icon: cardIcons[n - 1],
          title: about['card' + n + 'Title'],
          desc: about['card' + n + 'Desc']
        };
      });
      aboutCardsGrid.innerHTML = cards.map(function (card) {
        return (
          '<div class="about-card">' +
            '<div class="about-card-icon"><i class="' + card.icon + '"></i></div>' +
            '<h3>' + escapeHtml(pick(card.title, lang)) + '</h3>' +
            '<p>' + escapeHtml(pick(card.desc, lang)) + '</p>' +
          '</div>'
        );
      }).join('');
    }

    // Contact form + labels
    setText('contactLeadText', cf.lead);
    setText('contactEmailLabelText', cf.emailLabel);
    setText('contactPhoneLabelText', cf.phoneLabel);
    setText('contactWhatsappLabelText', cf.whatsappLabel);
    setText('formNameLabelText', cf.nameField);
    setText('formEmailLabelText', cf.emailField);
    setText('formSubjectLabelText', cf.subjectField);
    setText('formMessageLabelText', cf.messageField);
    setText('formSendBtnText', cf.sendBtn);
    setText('formSuccessMsgText', cf.successMsg);

    // Footer
    setText('footerRightsText', footer.rights);
    const footerBrandEl = document.getElementById('footerBrandNameText');
    if (footerBrandEl && siteData.profile && siteData.profile.name) {
      footerBrandEl.textContent = pick(siteData.profile.name, lang);
    }
  }

  function applyProfileAndContactText(lang) {
    if (!siteData) return;
    const p = siteData.profile || {};
    const c = siteData.contact || {};

    const heroNameEl = document.getElementById('heroNameText') || document.querySelector('.hero-name');
    if (heroNameEl && p.name) heroNameEl.textContent = pick(p.name, lang);

    const heroSubtitleEl = document.getElementById('heroSubtitleText') || document.querySelector('.hero-subtitle');
    if (heroSubtitleEl && p.role) heroSubtitleEl.textContent = pick(p.role, lang);

    const heroDescEl = document.getElementById('heroDescText') || document.querySelector('.hero-desc');
    if (heroDescEl && p.heroDesc) heroDescEl.textContent = pick(p.heroDesc, lang);

    const aboutPs = [document.getElementById('aboutP1Text'), document.getElementById('aboutP2Text')];
    if (aboutPs[0] && p.aboutP1) aboutPs[0].textContent = pick(p.aboutP1, lang);
    if (aboutPs[1] && p.aboutP2) aboutPs[1].textContent = pick(p.aboutP2, lang);

    const sigText = document.getElementById('aboutSignatureText') || document.querySelector('.signature-text');
    if (sigText && p.name) sigText.textContent = pick(p.name, lang);

    const statProjectsEl = document.querySelector('.stat-num[data-count]');
    const statNumEls = document.querySelectorAll('.stat-num');
    if (statNumEls[0] && p.statProjects != null) statNumEls[0].setAttribute('data-count', p.statProjects);
    if (statNumEls[1] && p.statYears != null) statNumEls[1].setAttribute('data-count', p.statYears);
    if (statNumEls[2] && p.statSatisfaction != null) statNumEls[2].setAttribute('data-count', p.statSatisfaction);

    // Contact links
    const emailLink = document.getElementById('contactEmailLink');
    if (emailLink && c.email) {
      emailLink.href = 'mailto:' + c.email;
      emailLink.textContent = c.email;
    }
    const phoneLink = document.getElementById('contactPhoneLink');
    if (phoneLink && c.phone) {
      phoneLink.href = 'tel:' + c.phone.replace(/\s+/g, '');
      phoneLink.textContent = c.phone;
    }
    const whatsappLink = document.getElementById('contactWhatsappLink');
    if (whatsappLink && c.whatsapp) {
      whatsappLink.href = 'https://wa.me/' + c.whatsapp.replace(/\D/g, '');
      whatsappLink.textContent = '+' + c.whatsapp.replace(/\D/g, '');
    }

    // Social links (footer + contact section) — hide any platform left empty
    const socialPlatforms = [
      { key: 'github', icon: 'fa-brands fa-github', label: 'GitHub' },
      { key: 'linkedin', icon: 'fa-brands fa-linkedin-in', label: 'LinkedIn' },
      { key: 'facebook', icon: 'fa-brands fa-facebook-f', label: 'Facebook' },
      { key: 'behance', icon: 'fa-brands fa-behance', label: 'Behance' }
    ];
    function buildSocialLinksHtml() {
      return socialPlatforms
        .filter(function (s) { return c[s.key]; })
        .map(function (s) {
          return '<a href="' + escapeHtml(c[s.key]) + '" class="social-link" target="_blank" rel="noopener" aria-label="' + s.label + '"><i class="' + s.icon + '"></i></a>';
        })
        .join('');
    }
    const contactSocialEl = document.getElementById('contactSocialLinks');
    const footerSocialEl = document.getElementById('footerSocialLinks');
    const socialHtml = buildSocialLinksHtml();
    if (contactSocialEl) contactSocialEl.innerHTML = socialHtml;
    if (footerSocialEl) footerSocialEl.innerHTML = socialHtml;

    // CV download link
    const downloadCvBtn = document.getElementById('downloadCv');
    if (downloadCvBtn) {
      downloadCvBtn.dataset.cvUrl = p.cvUrl || '';
      if (p.cvUrl) {
        downloadCvBtn.setAttribute('href', p.cvUrl);
        downloadCvBtn.setAttribute('target', '_blank');
        downloadCvBtn.setAttribute('rel', 'noopener');
      } else {
        downloadCvBtn.setAttribute('href', '#');
        downloadCvBtn.removeAttribute('target');
      }
    }
  }

  function renderSkills(lang) {
    const grid = document.getElementById('skillsGrid');
    if (!grid || !siteData) return;
    const s = siteData.skills || {};
    const labels = (siteData.siteUI && siteData.siteUI.skillsLabels) || {};

    function skillItemsHtml(items) {
      return (items || []).map(function (item) {
        const name = pick(item.name, lang);
        return (
          '<div class="skill-item">' +
            '<div class="skill-item-head"><span>' + escapeHtml(name) + '</span><span class="skill-percent">' + item.percent + '%</span></div>' +
            '<div class="skill-bar"><div class="skill-bar-fill" data-width="' + item.percent + '"></div></div>' +
          '</div>'
        );
      }).join('');
    }

    const toolsHtml = (s.tools || []).map(function (tool) {
      return '<span class="tool-badge"><i class="fa-solid fa-circle-check"></i> ' + escapeHtml(tool) + '</span>';
    }).join('');

    grid.innerHTML =
      '<div class="skill-group">' +
        '<h3 class="skill-group-title"><i class="fa-solid fa-display"></i> <span>' + escapeHtml(pick(labels.frontend, lang)) + '</span></h3>' +
        skillItemsHtml(s.frontend) +
      '</div>' +
      '<div class="skill-group">' +
        '<h3 class="skill-group-title"><i class="fa-solid fa-server"></i> <span>' + escapeHtml(pick(labels.backend, lang)) + '</span></h3>' +
        skillItemsHtml(s.backend) +
        '<h3 class="skill-group-title skill-group-title--spaced"><i class="fa-solid fa-desktop"></i> <span>' + escapeHtml(pick(labels.desktop, lang)) + '</span></h3>' +
        skillItemsHtml(s.desktop) +
      '</div>' +
      '<div class="skill-group">' +
        '<h3 class="skill-group-title"><i class="fa-solid fa-wrench"></i> <span>' + escapeHtml(pick(labels.tools, lang)) + '</span></h3>' +
        '<div class="tools-badges">' + toolsHtml + '</div>' +
        '<div class="terminal-card">' +
          '<div class="terminal-head"><span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span></div>' +
          '<div class="terminal-body">' +
            '<p><span class="terminal-prompt">$</span> ' + escapeHtml(pick(labels.terminalLine1, lang)) + '</p>' +
            '<p class="terminal-out">' + escapeHtml(pick(labels.terminalLine2, lang)) + '</p>' +
            '<p><span class="terminal-prompt">$</span> ' + escapeHtml(pick(labels.terminalLine3, lang)) + '</p>' +
            '<p class="terminal-out terminal-out--accent">' + escapeHtml(pick(labels.terminalLine4, lang)) + '</p>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function renderServices(lang) {
    const grid = document.getElementById('servicesGrid');
    if (!grid || !siteData) return;
    grid.innerHTML = (siteData.services || []).map(function (svc) {
      return (
        '<div class="service-card fade-in-section is-visible">' +
          '<div class="service-icon"><i class="' + escapeHtml(svc.icon) + '"></i></div>' +
          '<h3>' + escapeHtml(pick(svc.title, lang)) + '</h3>' +
          '<p>' + escapeHtml(pick(svc.desc, lang)) + '</p>' +
        '</div>'
      );
    }).join('');
  }

  function renderProjects(lang) {
    const grid = document.getElementById('projectsGrid');
    if (!grid || !siteData) return;
    const labels = (siteData.siteUI && siteData.siteUI.projectsLabels) || {};
    const allProjects = siteData.projects || [];
    const HOME_LIMIT = 4;
    const visibleProjects = allProjects.slice(0, HOME_LIMIT);

    grid.innerHTML = visibleProjects.map(function (proj) {
      const tagsHtml = (proj.tags || []).map(function (tag) {
        return '<span>' + escapeHtml(tag) + '</span>';
      }).join('');
      const hasLive = proj.liveUrl && proj.liveUrl !== '#';
      const thumbInner = proj.image
        ? '<img src="' + escapeHtml(proj.image) + '" alt="' + escapeHtml(pick(proj.title, lang)) + '" class="project-thumb-img">'
        : '<i class="' + escapeHtml(proj.icon) + '"></i>';
      return (
        '<article class="project-card fade-in-section is-visible">' +
          '<div class="project-thumb ' + escapeHtml(proj.thumbClass || '') + (proj.image ? ' has-image' : '') + '">' + thumbInner + '</div>' +
          '<div class="project-body">' +
            '<h3>' + escapeHtml(pick(proj.title, lang)) + '</h3>' +
            '<p>' + escapeHtml(pick(proj.desc, lang)) + '</p>' +
            '<div class="project-tags">' + tagsHtml + '</div>' +
            '<div class="project-links">' +
              '<a href="' + escapeHtml(proj.liveUrl || '#') + '" class="project-link" target="' + (hasLive ? '_blank' : '_self') + '" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> <span>' + escapeHtml(pick(labels.liveDemo, lang)) + '</span></a>' +
            '</div>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    // "View more projects" button — only shown when there are more than HOME_LIMIT
    const viewMoreWrap = document.getElementById('projectsViewMoreWrap');
    if (viewMoreWrap) {
      if (allProjects.length > HOME_LIMIT) {
        const btnLabel = pick(labels.viewMore, lang) || (lang === 'ar' ? 'عرض المزيد من المشاريع' : 'View More Projects');
        viewMoreWrap.innerHTML =
          '<a href="projects.html" class="btn btn-outline">' +
            '<span>' + escapeHtml(btnLabel) + '</span>' +
            '<i class="fa-solid fa-arrow-right btn-arrow"></i>' +
          '</a>';
        viewMoreWrap.style.display = '';
      } else {
        viewMoreWrap.innerHTML = '';
        viewMoreWrap.style.display = 'none';
      }
    }
  }

  function renderExperience(lang) {
    const list = document.getElementById('timelineList');
    if (!list || !siteData) return;
    list.innerHTML = (siteData.experience || []).map(function (exp) {
      return (
        '<div class="timeline-item fade-in-section is-visible">' +
          '<div class="timeline-dot"><i class="' + escapeHtml(exp.icon) + '"></i></div>' +
          '<div class="timeline-content">' +
            '<h3>' + escapeHtml(pick(exp.title, lang)) + '</h3>' +
            '<p>' + escapeHtml(pick(exp.desc, lang)) + '</p>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  function renderAllProjectsPage(lang) {
    const grid = document.getElementById('allProjectsGrid');
    if (!grid || !siteData) return;
    const labels = (siteData.siteUI && siteData.siteUI.projectsLabels) || {};
    const st = (siteData.siteUI && siteData.siteUI.sectionTitles) || {};

    // Page texts (eyebrow/title reuse the same "Projects" section labels, plus a back link)
    const eyebrowEl = document.getElementById('allProjectsEyebrowText');
    const titleEl = document.getElementById('allProjectsTitleText');
    if (eyebrowEl) eyebrowEl.textContent = pick(st.projectsEyebrow, lang);
    if (titleEl) titleEl.textContent = lang === 'ar' ? 'كل المشاريع' : 'All Projects';

    const backLinkText = document.getElementById('backHomeLinkText');
    if (backLinkText) backLinkText.textContent = lang === 'ar' ? 'الرجوع للرئيسية' : 'Back to Home';
    const backLinkIcon = document.querySelector('#backHomeLink i');
    if (backLinkIcon) backLinkIcon.className = lang === 'ar' ? 'fa-solid fa-arrow-right' : 'fa-solid fa-arrow-left';

    grid.innerHTML = (siteData.projects || []).map(function (proj) {
      const tagsHtml = (proj.tags || []).map(function (tag) {
        return '<span>' + escapeHtml(tag) + '</span>';
      }).join('');
      const hasLive = proj.liveUrl && proj.liveUrl !== '#';
      const thumbInner = proj.image
        ? '<img src="' + escapeHtml(proj.image) + '" alt="' + escapeHtml(pick(proj.title, lang)) + '" class="project-thumb-img">'
        : '<i class="' + escapeHtml(proj.icon) + '"></i>';
      return (
        '<article class="project-card fade-in-section is-visible">' +
          '<div class="project-thumb ' + escapeHtml(proj.thumbClass || '') + (proj.image ? ' has-image' : '') + '">' + thumbInner + '</div>' +
          '<div class="project-body">' +
            '<h3>' + escapeHtml(pick(proj.title, lang)) + '</h3>' +
            '<p>' + escapeHtml(pick(proj.desc, lang)) + '</p>' +
            '<div class="project-tags">' + tagsHtml + '</div>' +
            '<div class="project-links">' +
              '<a href="' + escapeHtml(proj.liveUrl || '#') + '" class="project-link" target="' + (hasLive ? '_blank' : '_self') + '" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> <span>' + escapeHtml(pick(labels.liveDemo, lang)) + '</span></a>' +
            '</div>' +
          '</div>' +
        '</article>'
      );
    }).join('');
  }

  function renderDynamicSections(lang) {
    renderSkills(lang);
    renderServices(lang);
    renderProjects(lang);
    renderExperience(lang);
    renderAllProjectsPage(lang);
    // Re-apply the skill bar widths shortly after render (skills section may already be visible)
    requestAnimationFrame(function () {
      const skillsSectionEl = document.getElementById('skills');
      if (skillsSectionEl && skillsSectionEl.getBoundingClientRect().top < window.innerHeight) {
        document.querySelectorAll('.skill-bar-fill').forEach(function (bar) {
          bar.style.width = bar.getAttribute('data-width') + '%';
        });
      }
      if (typeof refreshScrollReveal === 'function') refreshScrollReveal();
    });
  }

  /* ===================================================
     5. NAVBAR: scroll state, active link, mobile menu
     =================================================== */
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const sections = document.querySelectorAll('main section[id]');

  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 12);
    updateActiveLink();
  }, { passive: true });

  function updateActiveLink() {
    if (!sections.length) return; // secondary pages (e.g. projects.html) have no in-page sections to track
    let currentId = sections[0] ? sections[0].id : '';
    const offset = 120;
    sections.forEach(function (section) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= offset) currentId = section.id;
    });
    // Re-query every time: applyBrandAndNav rebuilds #navLinks via innerHTML,
    // so a cached NodeList captured at load time would point to stale, detached nodes.
    document.querySelectorAll('.nav-link').forEach(function (link) {
      const href = link.getAttribute('href') || '';
      link.classList.toggle('active', href === '#' + currentId || href.endsWith('#' + currentId));
    });
  }

  function closeMobileNav() {
    menuToggle.classList.remove('open');
    mobileNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', function () {
    const isOpen = mobileNav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* ===================================================
     6. CODE WINDOW TYPING ANIMATION (signature element)
     =================================================== */
  const codeTyperEl = document.getElementById('codeTyper');
  const codeWindowTitleEl = document.getElementById('codeWindowTitle');
  let typerTimeoutId = null;

  function startCodeTyper(lang) {
    if (!codeTyperEl || !codeWindowTitleEl) return; // not present on secondary pages (e.g. projects.html)
    if (typerTimeoutId) clearTimeout(typerTimeoutId);
    const snippet = codeSnippets[lang] || codeSnippets.en;
    codeWindowTitleEl.textContent = snippet.title;
    codeTyperEl.textContent = '';

    const fullText = snippet.code;
    let i = 0;

    function typeChar() {
      if (i <= fullText.length) {
        codeTyperEl.textContent = fullText.slice(0, i);
        i++;
        const delay = 10 + Math.random() * 18;
        typerTimeoutId = setTimeout(typeChar, delay);
      } else {
        // brief pause, then restart loop
        typerTimeoutId = setTimeout(function () {
          startCodeTyper(currentLang);
        }, 3200);
      }
    }
    typeChar();
  }

  /* ===================================================
     7. ANIMATED STAT COUNTERS (on scroll into view)
     =================================================== */
  const statNums = document.querySelectorAll('.stat-num');
  let statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;
    statNums.forEach(function (el) {
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const duration = 1200;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  /* ===================================================
     8. SCROLL REVEAL (sections, cards) + SKILL BARS
     Uses a single shared IntersectionObserver. Re-scanned
     after every dynamic render (renderDynamicSections),
     so it keeps working after content is added/edited
     from the admin panel.
     =================================================== */
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  function refreshScrollReveal() {
    const targets = document.querySelectorAll(
      '.about-card, .service-card, .project-card, .timeline-item, .skill-group, .terminal-card'
    );
    targets.forEach(function (el) {
      if (!el.classList.contains('fade-in-section')) {
        el.classList.add('fade-in-section');
      }
      // Cards injected via innerHTML already carry is-visible (see renderX functions),
      // so only freshly-added, not-yet-visible elements get observed.
      if (!el.classList.contains('is-visible')) {
        revealObserver.observe(el);
      }
    });
  }
  refreshScrollReveal();

  const heroStatsEl = document.querySelector('.hero-stats');
  if (heroStatsEl) {
    const statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateStats();
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(heroStatsEl);
  }

  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          document.querySelectorAll('.skill-bar-fill').forEach(function (bar) {
            bar.style.width = bar.getAttribute('data-width') + '%';
          });
          skillsObserver.disconnect();
        }
      });
    }, { threshold: 0.2 });
    skillsObserver.observe(skillsSection);
  }

  /* ===================================================
     9. CURSOR GLOW (desktop, decorative)
     =================================================== */
  const cursorGlow = document.getElementById('cursorGlow');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', function (e) {
      cursorGlow.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px) translate(-50%, -50%)';
      cursorGlow.classList.add('active');
    });
    document.addEventListener('mouseleave', function () {
      cursorGlow.classList.remove('active');
    });
  }

  /* ===================================================
     10. CONTACT FORM — VALIDATION + FAKE SUBMIT
     =================================================== */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const formErrorBox = document.getElementById('formErrorBox');

  function setFieldError(inputId, errId, message) {
    const input = document.getElementById(inputId);
    const errEl = document.getElementById(errId);
    if (message) {
      input.classList.add('invalid');
      errEl.textContent = message;
    } else {
      input.classList.remove('invalid');
      errEl.textContent = '';
    }
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const cf = (siteData && siteData.siteUI && siteData.siteUI.contactForm) || {};

      const name = document.getElementById('cf-name').value.trim();
      const email = document.getElementById('cf-email').value.trim();
      const subject = document.getElementById('cf-subject').value.trim();
      const message = document.getElementById('cf-message').value.trim();

      let valid = true;

      if (!name) {
        setFieldError('cf-name', 'err-name', pick(cf.errNameRequired, currentLang));
        valid = false;
      } else {
        setFieldError('cf-name', 'err-name', '');
      }

      if (!email) {
        setFieldError('cf-email', 'err-email', pick(cf.errEmailRequired, currentLang));
        valid = false;
      } else if (!isValidEmail(email)) {
        setFieldError('cf-email', 'err-email', pick(cf.errEmailInvalid, currentLang));
        valid = false;
      } else {
        setFieldError('cf-email', 'err-email', '');
      }

      if (!subject) {
        setFieldError('cf-subject', 'err-subject', pick(cf.errSubjectRequired, currentLang));
        valid = false;
      } else {
        setFieldError('cf-subject', 'err-subject', '');
      }

      if (!message) {
        setFieldError('cf-message', 'err-message', pick(cf.errMessageRequired, currentLang));
        valid = false;
      } else {
        setFieldError('cf-message', 'err-message', '');
      }

      if (!valid) {
        formSuccess.classList.remove('show');
        return;
      }

      const accessKey = siteData && siteData.contact && siteData.contact.web3formsAccessKey;
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const submitBtnLabel = submitBtn ? submitBtn.querySelector('span') : null;
      const originalBtnText = submitBtnLabel ? submitBtnLabel.textContent : '';

      if (formErrorBox) { formErrorBox.classList.remove('show'); formErrorBox.textContent = ''; }

      if (!accessKey) {
        // No Web3Forms key configured yet — tell the visitor honestly instead of pretending it worked.
        if (formErrorBox) {
          formErrorBox.textContent = currentLang === 'ar'
            ? 'نموذج التواصل غير مفعّل بعد. من فضلك تواصل عبر البريد الإلكتروني أو واتساب المذكورين أعلى.'
            : 'The contact form isn\'t connected yet. Please reach out via the email or WhatsApp above instead.';
          formErrorBox.classList.add('show');
        }
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (submitBtnLabel) {
        submitBtnLabel.textContent = currentLang === 'ar' ? 'جارٍ الإرسال...' : 'Sending...';
      }

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          subject: 'New message from website: ' + subject,
          from_name: name,
          name: name,
          email: email,
          message: message
        })
      })
        .then(function (response) { return response.json(); })
        .then(function (result) {
          if (result && result.success) {
            formSuccess.classList.add('show');
            contactForm.reset();
            setTimeout(function () { formSuccess.classList.remove('show'); }, 6000);
          } else {
            throw new Error((result && result.message) || 'Unknown error');
          }
        })
        .catch(function () {
          if (formErrorBox) {
            formErrorBox.textContent = currentLang === 'ar'
              ? 'حدث خطأ أثناء إرسال الرسالة. من فضلك حاول مرة أخرى أو تواصل عبر البريد الإلكتروني مباشرة.'
              : 'Something went wrong while sending your message. Please try again or email us directly.';
            formErrorBox.classList.add('show');
          }
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
          if (submitBtnLabel) submitBtnLabel.textContent = originalBtnText;
        });
    });
  }

  /* ===================================================
     11. BACK TO TOP
     =================================================== */
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===================================================
     12. DOWNLOAD CV (uses siteData.profile.cvUrl if provided)
     =================================================== */
  const downloadCvEl = document.getElementById('downloadCv');
  if (downloadCvEl) {
    downloadCvEl.addEventListener('click', function (e) {
      const cvUrl = this.dataset.cvUrl;
      if (cvUrl) return; // let the browser follow the real link normally
      e.preventDefault();
      alert(currentLang === 'ar'
        ? 'أضف رابط ملف سيرتك الذاتية (PDF) من لوحة التحكم لتفعيل التحميل.'
        : 'Add your CV (PDF) link from the admin panel to enable the download.');
    });
  }

  /* ===================================================
     13. FOOTER YEAR
     =================================================== */
  document.getElementById('footerYear').textContent = new Date().getFullYear();

  /* ===================================================
     14. INIT
     =================================================== */
  applyTheme(currentTheme);
  applyLanguage(currentLang); // also triggers renderDynamicSections, applyBrandAndNav, applyStaticUITexts
  updateActiveLink();

  // Live-refresh the public site if the admin panel saved changes
  // while this tab was open (e.g. admin opened in another tab).
  window.addEventListener('storage', function (e) {
    if (e.key === (window.PortfolioStore && window.PortfolioStore.STORAGE_KEY)) {
      window.location.reload();
    }
  });

})();
