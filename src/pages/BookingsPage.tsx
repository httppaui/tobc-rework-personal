import { Navigate } from 'react-router-dom';
import { PAGE_PATHS } from '../lib/routes';

/** Legacy route — redirects to Booked Courses */
export function BookingsPage() {
  return <Navigate to={PAGE_PATHS['booked-courses']} replace />;
}
