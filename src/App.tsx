import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { CoursesPage } from './pages/CoursesPage';
import { PartnersPage } from './pages/PartnersPage';
import { AboutPage } from './pages/AboutPage';
import { NewsPage } from './pages/NewsPage';
import { LibraryPage } from './pages/LibraryPage';
import { WishlistPage } from './pages/WishlistPage';
import { CartPage } from './pages/CartPage';
import { MessagesPage } from './pages/MessagesPage';
import { BookingsPage } from './pages/BookingsPage';
import { BookedCoursesPage } from './pages/BookedCoursesPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpCenterPage } from './pages/HelpCenterPage';
import { PAGE_PATHS } from './lib/routes';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to={PAGE_PATHS.home} replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="partners" element={<PartnersPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="booked-courses" element={<BookedCoursesPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="help" element={<HelpCenterPage />} />
        <Route path="*" element={<Navigate to={PAGE_PATHS.home} replace />} />
      </Route>
    </Routes>
  );
}
