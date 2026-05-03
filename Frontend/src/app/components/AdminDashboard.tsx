import { useEffect, useState } from 'react';
import {
  Shield,
  LogOut,
  MessageSquare,
  Trash2,
} from 'lucide-react';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export function AdminDashboard({
  user,
  onLogout,
  onNavigate,
}: AdminDashboardProps) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [deletingId, setDeletingId] = useState<string>('');

  const fetchDashboard = async () => {
    try {
      const response = await fetch(
        `/api/admin/${user.id}/dashboard`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Failed to load admin dashboard');
        setLoading(false);
        return;
      }

      setDashboardData(data);
    } catch (error) {
      setErrorMessage('Could not connect to backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user.id]);

  const handleDeleteUser = async (userId: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this user?'
    );

    if (!confirmDelete) return;

    setErrorMessage('');
    setSuccessMessage('');
    setDeletingId(`user-${userId}`);

    try {
      const response = await fetch(
        `/api/admin/${user.id}/users/${userId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Failed to delete user');
        setDeletingId('');
        return;
      }

      setSuccessMessage('User deleted successfully');
      await fetchDashboard();
    } catch (error) {
      setErrorMessage('Could not connect to backend');
    } finally {
      setDeletingId('');
    }
  };

  const handleDeleteDoctor = async (doctorId: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this doctor?'
    );

    if (!confirmDelete) return;

    setErrorMessage('');
    setSuccessMessage('');
    setDeletingId(`doctor-${doctorId}`);

    try {
      const response = await fetch(
        `/api/admin/${user.id}/doctors/${doctorId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Failed to delete doctor');
        setDeletingId('');
        return;
      }

      setSuccessMessage('Doctor deleted successfully');
      await fetchDashboard();
    } catch (error) {
      setErrorMessage('Could not connect to backend');
    } finally {
      setDeletingId('');
    }
  };

  const summary = dashboardData?.summary || {};
  const users = (dashboardData?.users || []).filter(
    (item: any) => item.role !== 'doctor'
  );
  const doctors = dashboardData?.doctors || [];
  const recentAppointments =
    dashboardData?.recent_appointments || [];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-72 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-blue-600">
            DocTime
          </h1>
          <p className="text-gray-500 mt-2">Admin Portal</p>
        </div>

        <nav className="space-y-3 flex-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 font-medium">
            <Shield className="w-5 h-5" />
            Dashboard
          </button>

          <button
            onClick={() => onNavigate('messages')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            Messages
          </button>
        </nav>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}
          </h2>
          <p className="text-gray-500 mt-2">
            Manage users, doctors, and appointments
          </p>
        </div>

        {loading && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            Loading admin dashboard...
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 p-6 rounded-2xl text-red-700">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 p-6 rounded-2xl text-green-700">
            {successMessage}
          </div>
        )}

        {!loading && !errorMessage && (
          <>
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl border p-6">
                <p className="text-gray-500 text-sm mb-2">
                  Total Patients
                </p>
                <h3 className="text-3xl font-bold">
                  {summary.total_patients}
                </h3>
              </div>

              <div className="bg-white rounded-2xl border p-6">
                <p className="text-gray-500 text-sm mb-2">
                  Total Doctors
                </p>
                <h3 className="text-3xl font-bold">
                  {summary.total_doctors}
                </h3>
              </div>

              <div className="bg-white rounded-2xl border p-6">
                <p className="text-gray-500 text-sm mb-2">
                  Appointments
                </p>
                <h3 className="text-3xl font-bold">
                  {summary.total_appointments}
                </h3>
              </div>

              <div className="bg-white rounded-2xl border p-6">
                <p className="text-gray-500 text-sm mb-2">
                  Completed
                </p>
                <h3 className="text-3xl font-bold">
                  {summary.completed_appointments}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <section className="bg-white rounded-2xl border p-6">
                <h3 className="text-xl font-bold mb-4">
                  Users
                </h3>

                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {users.map((item: any) => (
                    <div
                      key={item.id}
                      className="border rounded-xl p-4"
                    >
                      <p className="font-semibold">
                        {item.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {item.email}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs">
                          {item.role}
                        </span>

                        {item.id !== user.id && (
                          <button
                            onClick={() =>
                              handleDeleteUser(item.id)
                            }
                            disabled={
                              deletingId === `user-${item.id}`
                            }
                            className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 disabled:opacity-50"
                          >
                            <Trash2 className="w-3 h-3" />
                            {deletingId === `user-${item.id}`
                              ? 'Deleting...'
                              : 'Delete'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white rounded-2xl border p-6">
                <h3 className="text-xl font-bold mb-4">
                  Doctors
                </h3>

                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {doctors.map((doctor: any) => (
                    <div
                      key={doctor.id}
                      className="border rounded-xl p-4"
                    >
                      <p className="font-semibold">
                        {doctor.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {doctor.specialty}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {doctor.location}
                      </p>

                      <div className="mt-3 text-right">
                        <button
                          onClick={() =>
                            handleDeleteDoctor(doctor.id)
                          }
                          disabled={
                            deletingId === `doctor-${doctor.id}`
                          }
                          className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 disabled:opacity-50 ml-auto"
                        >
                          <Trash2 className="w-3 h-3" />
                          {deletingId === `doctor-${doctor.id}`
                            ? 'Deleting...'
                            : 'Delete'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white rounded-2xl border p-6">
                <h3 className="text-xl font-bold mb-4">
                  Recent Appointments
                </h3>

                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {recentAppointments.map((appt: any) => (
                    <div
                      key={appt.id}
                      className="border rounded-xl p-4"
                    >
                      <p className="font-semibold">
                        {appt.patient_name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {appt.doctor_name}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {appt.appointment_date}
                        </span>

                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            appt.status === 'Completed'
                              ? 'bg-green-50 text-green-700'
                              : appt.status === 'Cancelled'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {appt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
}