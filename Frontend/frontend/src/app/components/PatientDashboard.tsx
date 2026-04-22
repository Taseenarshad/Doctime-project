import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Search,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Clock3,
  HeartPulse,
  Bookmark,
  Bell,
  MapPin,
  Stethoscope,
} from 'lucide-react';

interface PatientDashboardProps {
  user: any;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export function PatientDashboard({
  user,
  onLogout,
  onNavigate,
}: PatientDashboardProps) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`/api/patient/${user.id}/appointments`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Failed to load appointments');
        setLoadingAppointments(false);
        return;
      }

      setAppointments(data.appointments || []);
    } catch (error) {
      setErrorMessage('Could not load appointments');
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user.id]);

  const handleCancelAppointment = async (appointmentId: number) => {
    setErrorMessage('');
    setActionMessage('');
    setCancellingId(appointmentId);

    try {
      const response = await fetch(`/api/appointments/${appointmentId}/cancel`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Failed to cancel appointment');
        setCancellingId(null);
        return;
      }

      setActionMessage('Appointment cancelled successfully');
      await fetchAppointments();
    } catch (error) {
      setErrorMessage('Could not connect to backend');
    } finally {
      setCancellingId(null);
    }
  };

  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.status === 'Booked'
  );

  const pastVisits = appointments.filter(
    (appointment) => appointment.status === 'Completed'
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-72 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-blue-600">DocTime</h1>
          <p className="text-gray-500 mt-2">Patient Portal</p>
        </div>

        <nav className="space-y-3 flex-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors">
            <CalendarDays className="w-5 h-5" />
            My Appointments
          </button>

          <button
            onClick={() => onNavigate('discovery')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Search className="w-5 h-5" />
            Find a Doctor
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors">
            <FileText className="w-5 h-5" />
            Medical Records
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors">
            <MessageSquare className="w-5 h-5" />
            Messages
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors">
            <Settings className="w-5 h-5" />
            Profile Settings
          </button>
        </nav>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.name}
            </h2>
            <p className="text-gray-500 mt-2">Patient Account</p>
          </div>

          <div>
            <button
              onClick={() => onNavigate('discovery')}
              className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Book New Appointment
            </button>
          </div>
        </div>

        {loadingAppointments && (
          <div className="mb-6 bg-white rounded-2xl border border-gray-200 p-5 text-gray-600">
            Loading dashboard data...
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-5 text-red-700">
            {errorMessage}
          </div>
        )}

        {actionMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-5 text-green-700">
            {actionMessage}
          </div>
        )}

        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
              <Clock3 className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-gray-500 text-sm mb-1">Upcoming Appointments</p>
            <h3 className="text-3xl font-bold text-gray-900">
              {upcomingAppointments.length}
            </h3>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
              <HeartPulse className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-gray-500 text-sm mb-1">Past Visits</p>
            <h3 className="text-3xl font-bold text-gray-900">
              {pastVisits.length}
            </h3>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
              <Bookmark className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-gray-500 text-sm mb-1">Saved Doctors</p>
            <h3 className="text-3xl font-bold text-gray-900">0</h3>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-gray-500 text-sm mb-1">Messages</p>
            <h3 className="text-3xl font-bold text-gray-900">0</h3>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <section className="col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Upcoming Appointments
                </h3>
                <p className="text-gray-500 mt-1">
                  Your scheduled healthcare visits
                </p>
              </div>

              <button
                onClick={() => onNavigate('discovery')}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Find Doctor
              </button>
            </div>

            {!loadingAppointments && upcomingAppointments.length === 0 && (
              <div className="border border-dashed border-gray-300 rounded-2xl p-10 text-center">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  No upcoming appointments yet
                </h4>
                <p className="text-gray-500 mb-5">
                  Book your first appointment to see it here.
                </p>
                <button
                  onClick={() => onNavigate('discovery')}
                  className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Find a Doctor
                </button>
              </div>
            )}

            {upcomingAppointments.length > 0 && (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border border-gray-200 rounded-2xl p-5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">
                          {appointment.doctor_name}
                        </h4>
                        <p className="text-blue-600 font-medium">
                          {appointment.doctor_specialty}
                        </p>
                      </div>

                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        {appointment.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-blue-600" />
                        <span>{appointment.appointment_date}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock3 className="w-4 h-4 text-blue-600" />
                        <span>{appointment.appointment_time}</span>
                      </div>

                      <div className="flex items-center gap-2 col-span-2">
                        <Stethoscope className="w-4 h-4 text-blue-600" />
                        <span>{appointment.clinic_name}</span>
                      </div>

                      <div className="flex items-center gap-2 col-span-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>{appointment.doctor_location}</span>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="mb-4 text-sm text-gray-500 bg-gray-50 rounded-xl p-3">
                        <span className="font-medium">Notes:</span>{' '}
                        {appointment.notes}
                      </div>
                    )}

                    <button
                      onClick={() => handleCancelAppointment(appointment.id)}
                      disabled={cancellingId === appointment.id}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {cancellingId === appointment.id ? 'Cancelling...' : 'Cancel Appointment'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Saved Doctors
              </h3>
              <p className="text-gray-500 text-sm">
                No saved doctors yet.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Recent Activity
              </h3>

              {appointments.length === 0 ? (
                <p className="text-gray-500 text-sm">No activity yet.</p>
              ) : (
                <div className="space-y-3">
                  {appointments.slice(0, 3).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border-l-4 border-blue-500 pl-4"
                    >
                      <p className="text-sm font-medium text-gray-800">
                        Appointment with {appointment.doctor_name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {appointment.appointment_date} at{' '}
                        {appointment.appointment_time}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}