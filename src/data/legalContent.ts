import type { LegalDoc } from '../types';

export interface LegalSection {
  title: string;
  paragraphs: string[];
}

export interface LegalDocument {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

export const LEGAL_DOCUMENTS: Record<LegalDoc, LegalDocument> = {
  terms: {
    title: 'Terms of Use',
    updated: 'May 19, 2026',
    intro:
      'These Terms of Use govern your access to and use of The Online Booking Center (TOBC) website and services. By creating an account or using TOBC, you agree to these terms.',
    sections: [
      {
        title: '1. Eligibility',
        paragraphs: [
          'You must be at least 18 years old, or the age of majority in your jurisdiction, to register. Seafarers and training providers are responsible for ensuring their use of TOBC complies with MARINA and other applicable regulations.',
        ],
      },
      {
        title: '2. Accounts',
        paragraphs: [
          'You are responsible for keeping your login credentials confidential and for all activity under your account. Notify us promptly if you suspect unauthorized access.',
          'We may suspend or terminate accounts that violate these terms, provide false information, or misuse the platform.',
        ],
      },
      {
        title: '3. Bookings & payments',
        paragraphs: [
          'Course listings are provided by third-party training partners. TOBC facilitates discovery and booking but does not guarantee seat availability, schedules, or accreditation status beyond what partners publish.',
          'Payment terms, refunds, and cancellations follow the policy of the training provider and any instructions shown at checkout. Upload payment proofs only for bookings you have initiated.',
        ],
      },
      {
        title: '4. Acceptable use',
        paragraphs: [
          'You may not scrape, reverse engineer, or disrupt TOBC; post unlawful content; impersonate others; or use the service for fraudulent bookings.',
        ],
      },
      {
        title: '5. Intellectual property',
        paragraphs: [
          'TOBC branding, software, and site content are owned by TOBC or its licensors. Course materials remain the property of respective providers.',
        ],
      },
      {
        title: '6. Disclaimers & liability',
        paragraphs: [
          'TOBC is provided “as is” without warranties of uninterrupted access. To the fullest extent permitted by law, TOBC is not liable for indirect damages arising from partner courses, travel, or certification outcomes.',
        ],
      },
      {
        title: '7. Changes & contact',
        paragraphs: [
          'We may update these terms by posting a revised version on this site. Continued use after changes constitutes acceptance. Questions: legal@tobc.example (demo contact).',
        ],
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    updated: 'May 19, 2026',
    intro:
      'This Privacy Policy explains how TOBC collects, uses, and protects personal information when you browse, register, or book maritime training courses.',
    sections: [
      {
        title: '1. Information we collect',
        paragraphs: [
          'Account data: name, email, and password (stored hashed on our servers).',
          'Booking data: course selections, schedule preferences, contact details, and payment proof images you upload during checkout.',
          'Technical data: browser type, device information, and usage logs used to secure and improve the service.',
        ],
      },
      {
        title: '2. How we use information',
        paragraphs: [
          'We use your data to authenticate you, process bookings, communicate confirmations, prevent fraud, and improve TOBC features.',
          'We do not sell your personal information to third parties.',
        ],
      },
      {
        title: '3. Sharing',
        paragraphs: [
          'Booking details are shared with the training provider you select so they can confirm your seat. We may disclose information when required by law or to protect the rights and safety of users.',
        ],
      },
      {
        title: '4. Cookies & local storage',
        paragraphs: [
          'We use session cookies for login and may store preferences (such as wishlist and cart) in your browser until you clear them or sign in to a synced account.',
        ],
      },
      {
        title: '5. Retention & security',
        paragraphs: [
          'We retain account and booking records as needed to operate the service and meet legal obligations. Passwords are hashed; payment proofs are stored only for demo booking flows in this project environment.',
        ],
      },
      {
        title: '6. Your choices',
        paragraphs: [
          'You may request access, correction, or deletion of your account data by contacting support. You can sign out at any time; clearing browser storage removes local wishlist and cart data.',
        ],
      },
      {
        title: '7. Updates',
        paragraphs: [
          'We may revise this policy and will update the “last updated” date above. Material changes may be highlighted on the site or at sign-in.',
        ],
      },
    ],
  },
  cookie: {
    title: 'Cookie Policy',
    updated: 'May 19, 2026',
    intro: 'This Cookie Policy explains how TOBC uses cookies and similar storage on your device.',
    sections: [
      {
        title: '1. What are cookies?',
        paragraphs: [
          'Cookies are small text files stored on your device when you visit a website. They help the site remember your session, preferences, and how you use the service.',
        ],
      },
      {
        title: '2. Cookies we use',
        paragraphs: [
          'Session cookies keep you signed in after login. We may also store wishlist and cart identifiers in your browser until you sign in (then lists sync to your account) or clear site data.',
        ],
      },
      {
        title: '3. Your choices',
        paragraphs: [
          'You can clear cookies and local storage in your browser settings. Signing out ends the active session cookie. Blocking cookies may prevent login and saved lists from working.',
        ],
      },
    ],
  },
  disclaimer: {
    title: 'Disclaimer',
    updated: 'May 19, 2026',
    intro: 'Please read this disclaimer before relying on course listings or booking confirmations on TOBC.',
    sections: [
      {
        title: '1. Informational use',
        paragraphs: [
          'TOBC provides a booking platform connecting seafarers with training and assessment partners. Course listings, schedules, and prices are supplied by partners and may change without notice.',
        ],
      },
      {
        title: '2. No professional advice',
        paragraphs: [
          'Content on this site does not replace official MARINA guidance, employer policies, or legal advice. Always verify accreditation and requirements with your manning agency or training center.',
        ],
      },
      {
        title: '3. Limitation of liability',
        paragraphs: [
          'To the fullest extent permitted by law, The Online Booking Corp. is not liable for indirect or consequential damages arising from use of the platform, partner cancellations, or third-party payment issues in demo environments.',
        ],
      },
    ],
  },
  refund: {
    title: 'Refund Policy',
    updated: 'May 19, 2026',
    intro: 'Refunds for maritime training are handled primarily by accredited partners. This policy describes how TOBC supports that process.',
    sections: [
      {
        title: '1. Partner-led refunds',
        paragraphs: [
          'Training and assessment fees are collected by accredited partners. Refund eligibility, processing time, and documentation requirements follow each partner’s published policy and MARINA rules.',
        ],
      },
      {
        title: '2. Cancellations',
        paragraphs: [
          'If you cancel before the training date, contact the provider listed on your booking confirmation. TOBC may assist with routing your request but does not hold training fees on your behalf in this demo environment.',
        ],
      },
      {
        title: '3. Disputes',
        paragraphs: [
          'For booking issues, email admin@theonlinebookingcorp.com with your confirmation reference. We will help coordinate with the partner within reasonable business days.',
        ],
      },
    ],
  },
  careers: {
    title: 'Careers at TOBC',
    updated: 'May 19, 2026',
    intro: 'Interested in helping Filipino seafarers access accredited training? Learn how to join The Online Booking Corp.',
    sections: [
      {
        title: 'Join our team',
        paragraphs: [
          'We are building maritime training infrastructure for Filipino seafarers. Open roles in product, partnerships, and customer success are posted periodically.',
        ],
      },
      {
        title: 'How to apply',
        paragraphs: [
          'Send your CV and area of interest to admin@theonlinebookingcorp.com with the subject line “Careers — [Role]”. We respond when a matching role is available.',
        ],
      },
    ],
  },
  contact: {
    title: 'Contact Us',
    updated: 'May 19, 2026',
    intro: 'Reach our Makati office or support team for bookings, partnerships, and general inquiries.',
    sections: [
      {
        title: 'Office',
        paragraphs: [
          'Unit 502, 5th Floor, Rufino Building, 6784 Ayala Ave., Makati City, Philippines',
        ],
      },
      {
        title: 'Reach us',
        paragraphs: [
          'Email: admin@theonlinebookingcorp.com',
          'Phone: +63 917 878 0320 / +63 2 53104815',
          'For live help, use Help Center (Messages) when signed in.',
        ],
      },
    ],
  },
};
