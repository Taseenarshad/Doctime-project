import { useState } from 'react';
import { Homepage } from './components/Homepage';
import { DoctorDiscovery } from './components/DoctorDiscovery';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleLoginSuccess = (role: string, user: any) => {
    setLoggedInUser(user);

    if (role === 'patient') {
      setCurrentPage('patient-dashboard');
    } else if (role === 'doctor') {
      setCurrentPage('doctor-dashboard');
    } else if (role === 'admin') {
      setCurrentPage('admin-dashboard');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
    });

    setLoggedInUser(null);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen">
      {currentPage === 'home' && (
        <Homepage
          onNavigate={handleNavigate}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {currentPage === 'discovery' && (
        <DoctorDiscovery
          onNavigate={handleNavigate}
          onLoginSuccess={handleLoginSuccess}
          loggedInUser={loggedInUser}
          onBookingSuccess={() => setCurrentPage('patient-dashboard')}
        />
      )}

      {currentPage === 'patient-dashboard' && loggedInUser && (
        <PatientDashboard
          user={loggedInUser}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}

      {currentPage === 'doctor-dashboard' && loggedInUser && (
        <DoctorDashboard
          user={loggedInUser}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'admin-dashboard' && loggedInUser && (
        <AdminDashboard
          user={loggedInUser}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}