import { useState } from 'react';
import { Homepage } from './components/Homepage';
import { DoctorDiscovery } from './components/DoctorDiscovery';

function PatientDashboard({ user, onLogout }: any) {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Patient Dashboard</h1>
      <p className="mb-4">Welcome, {user.name}</p>
      <button
        onClick={onLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}

function DoctorDashboard({ user, onLogout }: any) {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Doctor Dashboard</h1>
      <p className="mb-4">Welcome, Dr. {user.name}</p>
      <button
        onClick={onLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}

function AdminDashboard({ user, onLogout }: any) {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-4">Welcome, {user.name}</p>
      <button
        onClick={onLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}

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
        />
      )}

      {currentPage === 'patient-dashboard' && loggedInUser && (
        <PatientDashboard user={loggedInUser} onLogout={handleLogout} />
      )}

      {currentPage === 'doctor-dashboard' && loggedInUser && (
        <DoctorDashboard user={loggedInUser} onLogout={handleLogout} />
      )}

      {currentPage === 'admin-dashboard' && loggedInUser && (
        <AdminDashboard user={loggedInUser} onLogout={handleLogout} />
      )}
    </div>
  );
}