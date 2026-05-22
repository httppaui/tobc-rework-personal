export type PartnerDetailTabId = 'about' | 'contact' | 'address' | 'cancellation' | 'gallery';

export const PARTNER_DETAIL_TABS: { id: PartnerDetailTabId; label: string }[] = [
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
  { id: 'address', label: 'Address' },
  { id: 'cancellation', label: 'Cancellation policy' },
  { id: 'gallery', label: 'Gallery' },
];

export type PartnerGalleryItem = {
  id: string;
  caption: string;
  gradient: string;
};

export type BusinessPartnerProfile = {
  about: string;
  email: string;
  phone: string;
  hours?: string;
  address: string;
  cancellationPolicy: string;
  websiteUrl: string;
  gallery: PartnerGalleryItem[];
};

function defaultGallery(name: string): PartnerGalleryItem[] {
  return [
    {
      id: '1',
      caption: `${name} — training facilities`,
      gradient: 'linear-gradient(135deg,#002e2d,#005754)',
    },
    {
      id: '2',
      caption: 'Simulation and practical areas',
      gradient: 'linear-gradient(135deg,#0c4a6e,#0369a1)',
    },
    {
      id: '3',
      caption: 'Classrooms and briefing rooms',
      gradient: 'linear-gradient(135deg,#134e4a,#0f766e)',
    },
    {
      id: '4',
      caption: 'Student support and admin offices',
      gradient: 'linear-gradient(135deg,#1e3a5f,#334155)',
    },
  ];
}

function defaultCancellation(name: string): string {
  return `${name} cancellation and rescheduling terms apply to all courses booked through TOBC.\n\n• Cancellations made at least 7 calendar days before the course start date may receive a full refund of training fees paid via TOBC, minus any non-refundable assessment or MARINA fees disclosed at booking.\n\n• Cancellations within 7 days of the start date may incur up to 50% of the course fee as a late-cancellation charge.\n\n• No-shows are non-refundable; rebooking is subject to seat availability and any price difference.\n\n• Reschedules are allowed once per booking when requested at least 48 hours before the original start date.\n\n• Force majeure or MARINA-mandated suspensions will be handled with credit notes or rescheduled dates at the partner's discretion.`;
}

const PROFILES: Record<string, BusinessPartnerProfile> = {
  'far-east': {
    about:
      'Far East Maritime Foundation Inc. is a MARINA-accredited training organization serving officers and ratings in the National Capital Region and Cavite corridor. Programs cover STCW mandatory modules, refresher training, and company-specific safety curricula delivered by licensed instructors with operational sea experience.\n\nThe center maintains modern classrooms, fire-fighting grounds, and survival craft training arrangements with partner facilities where required by module standards.',
    email: 'training@fareastmaritime.ph',
    phone: '+63 2 8524 9100',
    hours: 'Mon–Sat, 8:00 AM – 5:00 PM',
    address: 'Far East Maritime Foundation Inc., Manila & Cavite campuses — Metro Manila, Philippines',
    cancellationPolicy: defaultCancellation('Far East Maritime Foundation Inc.'),
    websiteUrl: 'https://example.com/far-east-maritime',
    gallery: defaultGallery('Far East Maritime'),
  },
  nautilus: {
    about:
      'Nautilus Pacific Maritime Training Center Inc. delivers STCW and maritime upskilling programs across Manila and Cebu. The organization partners with manning agencies and direct applicants for scheduled intakes, simulator-based modules, and assessment preparation.\n\nCourse calendars are updated monthly; group bookings for fleet operators are coordinated through dedicated training coordinators.',
    email: 'info@nautiluspacific.ph',
    phone: '+63 2 8776 2200',
    hours: 'Mon–Fri, 8:00 AM – 6:00 PM',
    address: 'Nautilus Pacific Maritime Training Center — Manila & Cebu branches, Philippines',
    cancellationPolicy: defaultCancellation('Nautilus Pacific Maritime Training Center Inc.'),
    websiteUrl: 'https://example.com/nautilus-pacific',
    gallery: defaultGallery('Nautilus Pacific'),
  },
  compass: {
    about:
      'Compass Training Center, Inc. specializes in maritime safety and proficiency training for officers and ratings, with emphasis on fire prevention, survival craft, and crowd management modules required for passenger and cargo fleets.\n\nFacilities in Central Luzon support both walk-in seafarers and corporate block bookings with documentation support for MARINA and agency reporting.',
    email: 'registrar@compasstraining.ph',
    phone: '+63 45 499 3300',
    address: 'Compass Training Center, Inc. — Central Luzon / Metro Manila service area, Philippines',
    cancellationPolicy: defaultCancellation('Compass Training Center, Inc.'),
    websiteUrl: 'https://example.com/compass-training',
    gallery: defaultGallery('Compass Training'),
  },
  msat: {
    about:
      'MSAT Philippines Inc. operates a Maritime Simulator and Training Centre with advanced full-mission bridge and engine-room simulation, plus supporting classroom instruction for navigation, engine watchkeeping, and resource management modules.\n\nPrograms align with STCW competence tables and may be bundled with assessment center referrals where applicable.',
    email: 'bookings@msat.ph',
    phone: '+63 2 8837 4500',
    hours: 'Mon–Sat, 7:30 AM – 6:00 PM',
    address: 'MSAT Philippines Inc. — Metro Manila, Philippines',
    cancellationPolicy: defaultCancellation('MSAT Philippines Inc.'),
    websiteUrl: 'https://example.com/msat-philippines',
    gallery: defaultGallery('MSAT Philippines'),
  },
  mariana: {
    about:
      'Mariana Academy of Maritime Studies, Inc. offers specialized maritime training including polar waters familiarization, advanced tanker operations, and officer development pathways beyond standard STCW refreshers.\n\nThe academy serves experienced officers upgrading certificates and fleet personnel requiring niche endorsements.',
    email: 'admissions@marianaacademy.ph',
    phone: '+63 32 234 8800',
    address: 'Mariana Academy of Maritime Studies, Inc. — Metro Cebu, Philippines',
    cancellationPolicy: defaultCancellation('Mariana Academy of Maritime Studies, Inc.'),
    websiteUrl: 'https://example.com/mariana-academy',
    gallery: defaultGallery('Mariana Academy'),
  },
  'davao-maritime': {
    about:
      'Davao Maritime Skills Academy is a regional STCW and safety training hub for Mindanao-based seafarers, reducing travel to Luzon for mandatory modules and assessments.\n\nThe academy coordinates lodging referrals for out-of-town trainees and publishes intake schedules aligned with POEA and agency deployment windows.',
    email: 'hello@davaomaritime.ph',
    phone: '+63 82 295 6600',
    address: 'Davao Maritime Skills Academy — Metro Davao, Philippines',
    cancellationPolicy: defaultCancellation('Davao Maritime Skills Academy'),
    websiteUrl: 'https://example.com/davao-maritime',
    gallery: defaultGallery('Davao Maritime'),
  },
  'united-marine': {
    about:
      'United Marine Training Center, Inc. is a TESDA-accredited assessment center delivering maritime competency assessment programs for ratings and officers seeking MARINA certification pathways.\n\nAssessment slots are released in batches; candidates must complete documentary requirements before confirmation of assessment dates.',
    email: 'assessment@unitedmarine.ph',
    phone: '+63 2 8812 7700',
    hours: 'Mon–Fri, 8:00 AM – 5:00 PM',
    address: 'United Marine Training Center, Inc. — Metro Manila, Philippines',
    cancellationPolicy: defaultCancellation('United Marine Training Center, Inc.'),
    websiteUrl: 'https://example.com/united-marine',
    gallery: defaultGallery('United Marine'),
  },
  'cebu-pdos': {
    about:
      'Cebu PDOS Review Center provides pre-departure orientation seminars (PDOS), documentation coaching, and outbound crew briefings for agencies and independent applicants in the Visayas.\n\nSessions cover OFW rights, destination country expectations, and contract literacy in coordination with POEA guidelines.',
    email: 'pdos@cebureview.ph',
    phone: '+63 32 255 9900',
    hours: 'Mon–Sat, 8:00 AM – 4:00 PM',
    address: 'Cebu PDOS Review Center — Metro Cebu, Philippines',
    cancellationPolicy: defaultCancellation('Cebu PDOS Review Center'),
    websiteUrl: 'https://example.com/cebu-pdos',
    gallery: defaultGallery('Cebu PDOS'),
  },
  eastgate: {
    about:
      'Eastgate Maritime Training Center Inc. focuses on ratings and officer training programs accredited by MARINA, with structured pathways from entry-level safety courses through advanced operational modules.\n\nThe center supports school-to-sea partnerships and walk-in enrollment with payment plans for select programs.',
    email: 'info@eastgatemaritime.ph',
    phone: '+63 2 8701 3300',
    address: 'Eastgate Maritime Training Center Inc. — Metro Manila, Philippines',
    cancellationPolicy: defaultCancellation('Eastgate Maritime Training Center Inc.'),
    websiteUrl: 'https://example.com/eastgate-maritime',
    gallery: defaultGallery('Eastgate Maritime'),
  },
};

export function getBusinessPartnerProfile(partnerId: string): BusinessPartnerProfile | null {
  return PROFILES[partnerId] ?? null;
}
