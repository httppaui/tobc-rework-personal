export type HelpFaqItem = {
  id: string;
  question: string;
  answer: string;
  keywords?: string[];
};

export type HelpCategory = {
  id: string;
  title: string;
  description: string;
  icon: string;
  keywords?: string[];
  questions: HelpFaqItem[];
};

export const HELP_CENTER_EMAIL = 'admin@theonlinebookingcorp.com';
export const HELP_CENTER_PHONE = '+63 917 878 0320';
export const HELP_CENTER_PHONE_ALT = '+63 2 5310 4815';
export const HELP_CENTER_HOURS = 'Monday–Saturday, 8:00 AM – 8:00 PM (PHT)';

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: 'general',
    title: 'General Inquiries',
    description: 'About TOBC, how the platform works, and getting started.',
    icon: 'bi-info-circle',
    keywords: ['platform', 'marina', 'stcw', 'getting started'],
    questions: [
      {
        id: 'general-1',
        question: 'What is The Online Booking Corp (TOBC)?',
        answer:
          'TOBC is a maritime training marketplace where seafarers, agencies, and training centers can discover MARINA-accredited courses, compare schedules, and book online.',
        keywords: ['what is tobc', 'marketplace'],
      },
      {
        id: 'general-2',
        question: 'Are courses on TOBC MARINA-accredited?',
        answer:
          'We list partners who advertise accredited programs. Always confirm accreditation status and course codes with the training center before you travel.',
        keywords: ['marina', 'accredited', 'accreditation'],
      },
      {
        id: 'general-3',
        question: 'Do I need an account to browse courses?',
        answer:
          'No. You can search and view course details as a guest. An account is required to save wishlists, complete bookings, and access My Bookings.',
        keywords: ['account', 'guest', 'browse'],
      },
    ],
  },
  {
    id: 'bookings',
    title: 'Bookings and Enrollments',
    description: 'Searching, reserving seats, payments, and confirmations.',
    icon: 'bi-calendar2-check',
    keywords: ['book', 'schedule', 'payment', 'enroll'],
    questions: [
      {
        id: 'bookings-1',
        question: 'How do I book a course?',
        answer:
          'Find a course on the Courses page, open the listing, choose Book now, sign in or register, then complete the four steps: schedule, your details, payment proof upload, and confirmation.',
        keywords: ['how to book', 'steps'],
      },
      {
        id: 'bookings-2',
        question: 'What documents do I need to book?',
        answer:
          'Typically a valid Seaman\'s Book (SRB), government-issued ID, and any prerequisite certificates required by the training center. The provider may request more at check-in.',
        keywords: ['documents', 'srb', 'requirements'],
      },
      {
        id: 'bookings-3',
        question: 'How do I upload payment proof?',
        answer:
          'During checkout (step 3), upload a screenshot or photo of your bank transfer or payment receipt. Accepted formats are images (JPG, PNG). Your booking is submitted after you confirm.',
        keywords: ['payment', 'screenshot', 'upload'],
      },
      {
        id: 'bookings-4',
        question: 'Where can I see my bookings?',
        answer:
          'Sign in and open Booked Courses from the profile menu (after Profile). You can also use My Bookings in the footer — both show confirmation references and schedules for courses you booked while logged in.',
        keywords: ['my bookings', 'confirmation', 'booked courses'],
      },
    ],
  },
  {
    id: 'account',
    title: 'Account Management',
    description: 'Profiles, passwords, wishlist, cart, and settings.',
    icon: 'bi-person-vcard',
    keywords: ['login', 'password', 'profile', 'settings'],
    questions: [
      {
        id: 'account-1',
        question: 'How do I create an account?',
        answer:
          'Click Log In or Create account in the header, enter your name and email, choose a password that meets the requirements, accept the Terms and Privacy checkbox, then submit.',
        keywords: ['register', 'sign up', 'create'],
      },
      {
        id: 'account-2',
        question: 'I forgot my password. What should I do?',
        answer:
          'Go to Settings & privacy (profile menu), use Change password if you are still signed in, or contact support with your registered email so we can verify your identity.',
        keywords: ['forgot', 'reset', 'password'],
      },
      {
        id: 'account-3',
        question: 'Will my wishlist sync across devices?',
        answer:
          'When you are signed in, wishlist and cart are saved to your account. Guest lists in your browser merge into your account when you log in or register.',
        keywords: ['wishlist', 'cart', 'sync'],
      },
    ],
  },
  {
    id: 'partners',
    title: 'Business Partners',
    description: 'Training centers, manning agencies, and listing on TOBC.',
    icon: 'bi-building',
    keywords: ['partner', 'training center', 'agency', 'list courses'],
    questions: [
      {
        id: 'partners-1',
        question: 'How can my training center join TOBC?',
        answer:
          'Use Apply as Partner on the Partners page or email us with your MARINA accreditation, course catalog, and contact person. Our team will guide you through onboarding.',
        keywords: ['join', 'training center', 'apply'],
      },
      {
        id: 'partners-2',
        question: 'Can manning agencies bulk-book for crew?',
        answer:
          'Agency features are expanding. Contact us to discuss crew lists, compliance tracking, and invoicing for your organization.',
        keywords: ['agency', 'bulk', 'crew'],
      },
      {
        id: 'partners-3',
        question: 'How are partner listings verified?',
        answer:
          'We review partner type, location, and accreditation claims before highlighting listings. Seafarers should still confirm schedules and seat availability on each booking.',
        keywords: ['verified', 'listing'],
      },
    ],
  },
  {
    id: 'support',
    title: 'Support and Assistance',
    description: 'Live chat, response times, and escalation.',
    icon: 'bi-headset',
    keywords: ['chat', 'support', 'help', 'contact'],
    questions: [
      {
        id: 'support-1',
        question: 'How do I reach live chat?',
        answer:
          'Open Messages from the header or the help button when signed in. You can send a message and use quick replies for common topics.',
        keywords: ['live chat', 'messages'],
      },
      {
        id: 'support-2',
        question: 'What are your support hours?',
        answer: `Our team is available ${HELP_CENTER_HOURS}. Messages received outside hours are answered on the next business day.`,
        keywords: ['hours', 'time'],
      },
      {
        id: 'support-3',
        question: 'How fast will I get a reply?',
        answer:
          'Chat responses are typically within a few minutes during support hours. Email inquiries with a booking reference are usually addressed within 1–2 business days.',
        keywords: ['response', 'reply', 'wait'],
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy and Security',
    description: 'Data, cookies, payments, and your rights.',
    icon: 'bi-shield-lock',
    keywords: ['privacy', 'security', 'data', 'cookies'],
    questions: [
      {
        id: 'privacy-1',
        question: 'How is my payment information handled?',
        answer:
          'In this demo flow you upload a payment screenshot; we do not store card numbers on TOBC. Production deployments use PCI-compliant payment partners where applicable.',
        keywords: ['payment', 'pci', 'secure'],
      },
      {
        id: 'privacy-2',
        question: 'What data do you collect?',
        answer:
          'Account details, booking information, uploaded payment proof, and usage preferences (such as wishlist). See our Privacy Policy in the footer or Settings for full details.',
        keywords: ['data', 'collect', 'personal'],
      },
      {
        id: 'privacy-3',
        question: 'Can I delete my account data?',
        answer:
          'Contact support to request access, correction, or deletion of account data. Signing out and clearing site data removes local guest wishlist and cart entries.',
        keywords: ['delete', 'gdpr', 'remove'],
      },
    ],
  },
];

/** FAQs shown on the home page and Help Center */
export const HELP_LANDING_FAQS: HelpFaqItem[] = [
  {
    id: 'landing-1',
    question: 'What documents do I need to book?',
    answer:
      'Typically a valid Seaman\'s Book (SRB), government-issued ID, and any prerequisite certificates required for the course you are taking.',
  },
  {
    id: 'landing-2',
    question: 'How do I get a refund if I cancel?',
    answer:
      'Cancellations 7+ days before the course date: full refund. 3–6 days before: 50% refund. Within 48 hours of the start: no refund unless the provider agrees otherwise.',
  },
  {
    id: 'landing-3',
    question: 'Can I reschedule after booking?',
    answer:
      'Contact the training provider listed on your confirmation. TOBC can help route your request, but schedule changes depend on seat availability and partner policy.',
  },
  {
    id: 'landing-4',
    question: 'Is online payment secure?',
    answer:
      'We use secure sessions for your account and only request payment proof uploads for bank transfers in this flow. Never share passwords or OTP codes in chat or email.',
  },
];

export function matchesHelpQuery(text: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return text.toLowerCase().includes(q);
}

export function categoryMatchesQuery(category: HelpCategory, query: string): boolean {
  if (!query.trim()) return true;
  if (matchesHelpQuery(category.title, query)) return true;
  if (category.keywords?.some((k) => matchesHelpQuery(k, query))) return true;
  if (category.description && matchesHelpQuery(category.description, query)) return true;
  return category.questions.some(
    (item) =>
      matchesHelpQuery(item.question, query) ||
      matchesHelpQuery(item.answer, query) ||
      item.keywords?.some((k) => matchesHelpQuery(k, query)),
  );
}

export function filterCategoryQuestions(category: HelpCategory, query: string): HelpFaqItem[] {
  if (!query.trim()) return category.questions;
  return category.questions.filter(
    (item) =>
      matchesHelpQuery(item.question, query) ||
      matchesHelpQuery(item.answer, query) ||
      item.keywords?.some((k) => matchesHelpQuery(k, query)),
  );
}
