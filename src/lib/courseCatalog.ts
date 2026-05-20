import type { Course } from '../data/courses';
import { COURSES } from '../data/courses';

export function getCourseById(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}

export function getCourseDescription(course: Course): string {
  if (course.description) return course.description;
  return `MARINA-accredited ${course.category} training delivered by ${course.provider}. This course covers essential competencies for seafarers and maritime professionals, with schedules at ${course.location}. Duration: ${course.duration}. Ideal for ratings and officers preparing for deployment or certificate renewal.`;
}
