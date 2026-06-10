import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AlertToast from '../alerts/AlertToast';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <AlertToast />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
