import type { Course } from '../data/courses';
import { COURSES } from '../data/courses';

export type CourseDetailTabId = 'overview' | 'outcomes' | 'entry' | 'cancellation';

export const COURSE_DETAIL_TABS: { id: CourseDetailTabId; label: string }[] = [
  { id: 'overview', label: 'Course Overview' },
  { id: 'outcomes', label: 'Training Outcomes' },
  { id: 'entry', label: 'Entry Standards' },
  { id: 'cancellation', label: 'Cancellation Policy' },
];

const ENTRY_REQUIREMENTS_PDF = '/assets/documents/entry-requirements.pdf';
const CANCELLATION_POLICY_PDF = '/assets/documents/cancellation-policy.pdf';

export function getCourseById(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}

export function getCourseDescription(course: Course): string {
  if (course.description) return course.description;
  return `MARINA-accredited ${course.category} training delivered by ${course.provider}. This course covers essential competencies for seafarers and maritime professionals, with schedules at ${course.location}. Duration: ${course.duration}. Ideal for ratings and officers preparing for deployment or certificate renewal.`;
}

export function getCourseTrainingOutcomes(course: Course): string {
  if (course.trainingOutcomes) return course.trainingOutcomes;
  return [
    `Demonstrate competency aligned with ${course.title} learning objectives and MARINA requirements.`,
    `Apply safe working practices relevant to ${course.category} training in classroom, simulator, or practical settings.`,
    `Complete assessments required by ${course.provider} for certificate issuance or renewal.`,
    `Meet readiness standards for ratings and officers before deployment or endorsement updates.`,
  ].join('\n\n');
}

export function getCourseEntryStandards(course: Course): string {
  if (course.entryStandards) return course.entryStandards;
  const locationNote =
    course.location === 'Online'
      ? 'Stable internet connection and webcam-enabled device for live sessions.'
      : `Valid government-issued ID and attendance at ${course.location}.`;
  return [
    'Requirements for this course / training application:',
    '',
    '• Valid Seafarer\'s Identification and Record Book (SIRB) or equivalent national seafarer ID',
    '• Medical certificate fit for duty (PEME or clinic-issued, as required by the provider)',
    '• Prior certificates or sea service records where prerequisites apply to this course level',
    `• ${locationNote}`,
    `• Course fee confirmation or employer sponsorship letter where applicable (${course.price})`,
    '',
    `Submit complete documents to ${course.provider} before the scheduled start (${course.dates}). Incomplete applications may be deferred to the next available batch.`,
  ].join('\n');
}

export function getCourseCancellationPolicy(course: Course): string {
  if (course.cancellationPolicy) return course.cancellationPolicy;
  return [
    'Cancellation policy for bookings made through TOBC:',
    '',
    '• 7 or more days before the course start date: full refund of fees paid to the provider, subject to their processing timeline.',
    '• 3–6 days before the start date: 50% refund unless the training center offers a reschedule slot.',
    '• Within 48 hours of the start date: no refund unless the provider approves cancellation for documented emergencies.',
    '• No-shows are not eligible for refund; contact the provider listed on your confirmation to request reschedule.',
    '',
    `For ${course.title}, partner-specific terms from ${course.provider} apply where stricter than the standard policy above.`,
  ].join('\n');
}

export function getCourseEntryRequirementsPdf(course: Course): string {
  return course.entryRequirementsPdf ?? ENTRY_REQUIREMENTS_PDF;
}

export function getCourseCancellationPolicyPdf(course: Course): string {
  return course.cancellationPolicyPdf ?? CANCELLATION_POLICY_PDF;
}

export function courseDetailPdfFilename(course: Course, kind: 'entry' | 'cancellation'): string {
  const slug = course.id.replace(/[^a-z0-9]+/gi, '-');
  return kind === 'entry' ? `${slug}-entry-requirements.pdf` : `${slug}-cancellation-policy.pdf`;
}
