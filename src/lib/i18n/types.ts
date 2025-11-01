export type Messages = {
  nav: {
    programs: string;
    events: string;
    community: string;
    contact: string;
    joinNow: string;
    menu: string;
  };
  hero: {
    eyebrow: string;
    headingLine1: string;
    headingLine2: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  about: {
    visionTitle: string;
    visionText: string;
    missionTitle: string;
    missionIntro: string;
    missionItems: {
      network: string;
      knowledge: string;
      collaboration: string;
    };
    stats: {
      projects: string;
      workshops: string; // may contain newlines
      meetups: string;
      teamMembers: string; // may contain newlines
      sandboxParticipants: string; // may contain newlines
      sandboxNetwork: string;
    };
  };
  programs: {
    heading: string;
    subheading: string;
    upcomingBadge: string;
    registerCta: string;
    pastHeading: string;
    viewAll: string;
  };
  community: {
    heading: string;
    becomePartner: string;
    communityPartners: string;
    corporatePartners: string;
  };
  cta: {
    heading: string;
    description: string;
    primary: string;
  };
  footer: {
    logoAlt: string;
    copyrightSuffix: string; // appended after year
  };
  slideshow: {
    prev: string;
    next: string;
    gotoPrefix: string; // e.g., "Go to slide"
  };
  register: {
    title: string;
    subtitle: string;
    steps: { s1: string; s2: string; s3: string };
    section1Title: string;
    labels: {
      fullname: string;
      nickname: string;
      year: string;
      faculty: string;
      major: string;
      phone: string;
      email: string;
      otherContact: string;
    };
    placeholders: {
      fullname: string;
      nickname: string;
      phone: string;
      email: string;
      otherContact: string;
      enterFaculty: string;
      enterMajor: string;
      qWhy: string;
      qHowHelp: string;
      qPortfolio: string;
      qExpect: string;
    };
    selectFaculty: string;
    selectMajor: string;
    selectMajorHint: string;
  selectYear: string;
    other: string;
    section2Title: string;
    section2Intro: string;
    section2Legend: string;
    teams: {
      outreach: string;
      knowledge: string;
      marketing: string;
      operation: string;
      event: string;
    };
    roleCards: {
      outreach_sponsor: { title: string; description: string };
      knowledge_knowledge: { title: string; description: string };
      knowledge_learning_design: { title: string; description: string };
      marketing_video_editor: { title: string; description: string };
      marketing_graphic_designer: { title: string; description: string };
      marketing_photographer: { title: string; description: string };
      marketing_content_writer: { title: string; description: string };
      operation_sustainability: { title: string; description: string };
      operation_finance: { title: string; description: string };
      operation_hr: { title: string; description: string };
      operation_document: { title: string; description: string };
      event_organizer: { title: string; description: string };
    };
    section3Title: string;
    interview: {
      heading: string;
      description: string;
      timeHint: string;
      addSlot: string;
      removeSlot: string;
      dateLabel: string;
      startLabel: string;
      endLabel: string;
      modeLabel: string;
      modeOptions: { online: string; onsite: string };
      modeHint: string;
      summaryLabel: string;
      summaryEmpty: string;
    };
    qWhyLabel: string;
    qHowHelpLabel: string;
    qPortfolioLabel: string;
    qExpectLabel: string;
    errors: {
      year: string;
      fullname: string;
      nickname: string;
      faculty: string;
      major: string;
      phone: string;
      email: string;
      emailInvalid: string;
      roles: string;
      qWhy: string;
      qHowHelp: string;
      interviewSlotsRequired: string;
      interviewSlotRange: string;
      submitFailed: string;
      redirectFailed: string;
    };
    buttons: {
      back: string;
      backToHome: string;
      next: string;
      submit: string;
      submitting: string;
    };
  };
  registerSuccess: {
    title: string;
    message: string;
    emphasize: string;
    backHome: string;
  };
  startupPlayground: {
    title: string;
    subtitle: string;
    backToHome: string;
    section1Title: string;
    section2Title: string;
    labels: {
      fullname: string;
      nickname: string;
      faculty: string;
      major: string;
      year: string;
      email: string;
      phone: string;
      lineId: string;
      interests: string;
      customInterest: string;
      reason: string;
      hasStartupExperience: string;
    };
    placeholders: {
      fullname: string;
      nickname: string;
      faculty: string;
      major: string;
      selectFacultyFirst: string;
      year: string;
      email: string;
      phone: string;
      lineId: string;
      customInterest: string;
      reason: string;
    };
    interestOptions: {
      business: string;
      finance: string;
      technology: string;
      ai: string;
      marketing: string;
      design: string;
      productDevelopment: string;
      sustainability: string;
      socialImpact: string;
    };
    experienceOptions: {
      yes: string;
      no: string;
    };
    selectFaculty: string;
    selectMajor: string;
    selectYear: string;
    other: string;
    submitButton: string;
    submitting: string;
    footerNote: string;
    errors: {
      required: string;
      emailInvalid: string;
      phoneInvalid: string;
      interestsRequired: string;
      submitFailed: string;
    };
  };
  startupPlaygroundSuccess: {
    title: string;
    message: string;
    emphasize: string;
    backHome: string;
  };
  entrepreneurForum: {
    title: string;
    subtitle: string;
    backToHome: string;
    section1Title: string;
    labels: {
      fullname: string;
      contact: string;
      phone: string;
      email: string;
      affiliation: string;
      affiliationDetail: string;
    };
    placeholders: {
      fullname: string;
      phone: string;
      email: string;
      affiliationDetail: string;
    };
    posterSection: {
      title: string;
      description: string;
      confirmation: string;
    };
    submitButton: string;
    submitting: string;
    footerNote: string;
    errors: {
      required: string;
      emailInvalid: string;
      phoneInvalid: string;
      submitFailed: string;
    };
  };
  entrepreneurForumSuccess: {
    title: string;
    message: string;
    emphasize: string;
    backHome: string;
  };
};


