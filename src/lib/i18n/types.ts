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
    qWhyLabel: string;
    qHowHelpLabel: string;
    qPortfolioLabel: string;
    qExpectLabel: string;
    errors: {
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
};


