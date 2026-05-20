export type PartnerCategory = 'business' | 'industry';

export type PartnerBusinessType =
  | 'training'
  | 'assessment'
  | 'pdos'
  | 'review'
  | 'school'
  | 'others';

export type Partner = {
  id: string;
  name: string;
  description: string;
  category: PartnerCategory;
  categoryLabel: string;
  type: PartnerBusinessType;
  typeLabel: string;
  badgeClass: string;
  profession: 'maritime';
  country: string;
  region: string;
  city: string;
  othersSpecify?: string;
  courses?: number;
  icon: string;
};

const BUSINESS_TYPE_LABELS: Record<PartnerBusinessType, string> = {
  training: 'Training Center',
  assessment: 'Assessment Center',
  pdos: 'PDOS Provider',
  review: 'Review Center',
  school: 'School',
  others: 'Others',
};

function businessPartner(
  partial: Omit<Partner, 'category' | 'categoryLabel' | 'typeLabel' | 'profession'> & {
    type: PartnerBusinessType;
  },
): Partner {
  return {
    ...partial,
    category: 'business',
    categoryLabel: 'Business Partner',
    typeLabel: BUSINESS_TYPE_LABELS[partial.type],
    profession: 'maritime',
  };
}

function industryPartner(
  partial: Omit<
    Partner,
    'category' | 'categoryLabel' | 'type' | 'typeLabel' | 'badgeClass' | 'profession'
  >,
): Partner {
  return {
    ...partial,
    category: 'industry',
    categoryLabel: 'Industry Partner',
    type: 'others',
    typeLabel: 'Industry Partner',
    badgeClass: 'badge-amber',
    profession: 'maritime',
  };
}

export const PARTNERS: Partner[] = [
  businessPartner({
    id: 'far-east',
    name: 'Far East Maritime Foundation Inc.',
    description:
      'MARINA-accredited training center offering STCW and safety courses in Manila and Cavite.',
    type: 'training',
    badgeClass: 'badge-teal',
    country: 'ph',
    region: 'ncr',
    city: 'metro-manila',
    courses: 48,
    icon: 'bi-anchor',
  }),
  businessPartner({
    id: 'nautilus',
    name: 'Nautilus Pacific Maritime Training Center Inc.',
    description: 'STCW and maritime training courses across Manila and Cebu branches.',
    type: 'training',
    badgeClass: 'badge-teal',
    country: 'ph',
    region: 'ncr',
    city: 'metro-manila',
    courses: 28,
    icon: 'bi-mortarboard-fill',
  }),
  businessPartner({
    id: 'compass',
    name: 'Compass Training Center, Inc.',
    description: 'Comprehensive maritime safety and proficiency training for officers and ratings.',
    type: 'training',
    badgeClass: 'badge-teal',
    country: 'ph',
    region: 'region-3',
    city: 'metro-manila',
    courses: 22,
    icon: 'bi-compass-fill',
  }),
  businessPartner({
    id: 'msat',
    name: 'MSAT Philippines Inc.',
    description: 'Maritime Simulator and Training Centre with state-of-the-art simulation technology.',
    type: 'training',
    badgeClass: 'badge-teal',
    country: 'ph',
    region: 'ncr',
    city: 'metro-manila',
    courses: 32,
    icon: 'bi-water',
  }),
  businessPartner({
    id: 'mariana',
    name: 'Mariana Academy of Maritime Studies, Inc.',
    description: 'Specialized maritime training including polar waters and advanced tanker courses.',
    type: 'training',
    badgeClass: 'badge-teal',
    country: 'ph',
    region: 'region-7',
    city: 'metro-cebu',
    courses: 15,
    icon: 'bi-building-fill',
  }),
  businessPartner({
    id: 'davao-maritime',
    name: 'Davao Maritime Skills Academy',
    description: 'Regional STCW and safety training hub serving Mindanao seafarers.',
    type: 'training',
    badgeClass: 'badge-teal',
    country: 'ph',
    region: 'region-11',
    city: 'metro-davao',
    courses: 18,
    icon: 'bi-geo-alt-fill',
  }),
  businessPartner({
    id: 'united-marine',
    name: 'United Marine Training Center, Inc.',
    description: 'TESDA-accredited assessment center for maritime competency assessment programs.',
    type: 'assessment',
    badgeClass: 'badge-purple',
    country: 'ph',
    region: 'region-4a',
    city: 'metro-manila',
    courses: 14,
    icon: 'bi-clipboard2-check',
  }),
  businessPartner({
    id: 'cebu-pdos',
    name: 'Cebu PDOS Review Center',
    description: 'Pre-departure orientation seminars and documentation support for outbound crew.',
    type: 'pdos',
    badgeClass: 'badge-purple',
    country: 'ph',
    region: 'region-7',
    city: 'metro-cebu',
    icon: 'bi-passport-fill',
  }),
  businessPartner({
    id: 'eastgate',
    name: 'Eastgate Maritime Training Center Inc.',
    description: 'Specialized in ratings and officer training programs accredited by MARINA.',
    type: 'school',
    badgeClass: 'badge-teal',
    country: 'ph',
    region: 'ncr',
    city: 'metro-manila',
    courses: 10,
    icon: 'bi-journal-bookmark-fill',
  }),
  industryPartner({
    id: 'amosup',
    name: "(AMOSUP) Associated Marine Officers and Seamen's Union of the Philippines",
    description: 'National seafarers union representing Filipino marine officers and ratings.',
    country: 'ph',
    region: 'ncr',
    city: 'metro-manila',
    icon: 'bi-people-fill',
  }),
  industryPartner({
    id: 'and-crew',
    name: 'AND CrewManagement Solutions Phils. Inc.',
    description: 'Crew management and maritime workforce solutions for Philippine shipping.',
    country: 'ph',
    region: 'ncr',
    city: 'metro-manila',
    icon: 'bi-briefcase-fill',
  }),
  industryPartner({
    id: 'benedict',
    name: 'Benedict Safetywear Manufacturing Corporation',
    description: 'Safetywear manufacturing and supply for maritime and industrial sectors.',
    country: 'ph',
    region: 'ncr',
    city: 'metro-manila',
    icon: 'bi-shield-check',
  }),
  industryPartner({
    id: 'blue-antarctic',
    name: 'Blue Antartic Licensing and Crew Documentation Services Inc.',
    description: 'Licensing and crew documentation services for seafarers and manning agencies.',
    country: 'ph',
    region: 'ncr',
    city: 'metro-manila',
    icon: 'bi-file-earmark-text-fill',
  }),
  industryPartner({
    id: 'bt-solve',
    name: 'BT SOLVE',
    description: 'Maritime industry solutions and support services.',
    country: 'ph',
    region: 'ncr',
    city: 'metro-manila',
    icon: 'bi-gear-wide-connected',
  }),
  industryPartner({
    id: 'hizola-law',
    name: 'Hizola Law',
    description: 'Legal services for seafarers, employers, and maritime organizations.',
    country: 'ph',
    region: 'ncr',
    city: 'metro-manila',
    icon: 'bi-bank',
  }),
  industryPartner({
    id: 'inc-navigation',
    name: 'Inc Navigation Company Philippines Inc.',
    description: 'Navigation and maritime services in the Philippines.',
    country: 'ph',
    region: 'ncr',
    city: 'metro-manila',
    icon: 'bi-compass',
  }),
  industryPartner({
    id: 'lighthouse',
    name: 'Light House Innovations',
    description: 'Innovation and technology solutions for the maritime industry.',
    country: 'ph',
    region: 'ncr',
    city: 'metro-manila',
    icon: 'bi-lightbulb-fill',
  }),
  industryPartner({
    id: 'mjap',
    name: 'Maritime Journalist Association of the Philippines',
    description: 'Professional association of journalists covering the maritime sector.',
    country: 'ph',
    region: 'ncr',
    city: 'metro-manila',
    icon: 'bi-newspaper',
  }),
  industryPartner({
    id: 'seacrest',
    name: 'Seacrest Maritime Management Inc.',
    description: 'Maritime management and operational support services.',
    country: 'ph',
    region: 'ncr',
    city: 'metro-manila',
    icon: 'bi-diagram-3-fill',
  }),
  industryPartner({
    id: 'southfield',
    name: 'Southfield Agencies, Inc.',
    description: '2115 Madre Ignacia Street, Malate, Manila — 30 years of excellence in maritime crewing.',
    country: 'ph',
    region: 'ncr',
    city: 'metro-manila',
    icon: 'bi-briefcase-fill',
  }),
  industryPartner({
    id: 'windsor',
    name: 'Windsor International Maritime Clinic Inc.',
    description: 'Pre-employment medical examination and occupational health services for seafarers.',
    country: 'ph',
    region: 'ncr',
    city: 'metro-manila',
    icon: 'bi-hospital',
  }),
];

export const PARTNERS_TOTAL = PARTNERS.length;
