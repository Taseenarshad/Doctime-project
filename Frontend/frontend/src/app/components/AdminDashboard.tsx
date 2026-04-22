import { useEffect, useState } from 'react';
import {
  Shield,
  Users,
  UserRound,
  CalendarDays,
  CheckCircle2,
  XCircle,
  LogOut,
} from 'lucide-react';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

export function AdminDashboard({
  user,
  onLogout,
}: AdminDashboardProps) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
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

    fetchDashboard();
  }, [user.id]);

  const summary = dashboardData?.summary || {};
  const users = dashboardData?.users || [];
  const doctors = dashboardData?.doctors || [];
  const recentAppointments =
    dashboardData?.recent_appointments || [];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
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

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500">
            <Users className="w-5 h-5" />
            Users
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500">
            <UserRound className="w-5 h-5" />
            Doctors
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500">
            <CalendarDays className="w-5 h-5" />
            Appointments
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

      {/* Main */}
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
          <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-red-700">
            {errorMessage}
          </div>
        )}

        {!loading && !errorMessage && (
          <>
            {/* Stats */}
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
              {/* Users */}
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
                      <span className="inline-block mt-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs">
                        {item.role}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Doctors */}
              <section className="bg-white rounded-2xl border p-6">
                <h3 className="text-xl font-bold mb-4">
                  Doctors
                </h3>

                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {doctors.slice(0, 8).map((doctor: any) => (
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
                    </div>
                  ))}
                </div>
              </section>

              {/* Appointments */}
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