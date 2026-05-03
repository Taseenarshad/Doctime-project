import { useEffect, useState } from 'react';
import {
  CalendarDays,
  Clock3,
  LogOut,
  LayoutDashboard,
  Users,
  Stethoscope,
  MapPin,
  CheckCircle2,
  FileText,
  MessageSquare,
  Settings,
  Plus,
  Trash2,
} from 'lucide-react';

interface DoctorDashboardProps {
  user: any;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export function DoctorDashboard({
  user,
  onLogout,
  onNavigate,
}: DoctorDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'patients'>('dashboard');
  const [doctorProfile, setDoctorProfile] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [addingSlot, setAddingSlot] = useState(false);
  const [deletingSlotId, setDeletingSlotId] = useState<number | null>(null);
  const [completingAppointmentId, setCompletingAppointmentId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const fetchDoctorDashboardData = async () => {
    setErrorMessage('');

    try {
      const [appointmentsResponse, availabilityResponse, patientsResponse] =
        await Promise.all([
          fetch(`/api/doctor/${user.id}/appointments`, {
            method: 'GET',
            credentials: 'include',
          }),
          fetch(`/api/doctor/${user.id}/availability`, {
            method: 'GET',
            credentials: 'include',
          }),
          fetch(`/api/doctor/${user.id}/patients`, {
            method: 'GET',
            credentials: 'include',
          }),
        ]);

      const appointmentsData = await appointmentsResponse.json();
      const availabilityData = await availabilityResponse.json();
      const patientsData = await patientsResponse.json();

      if (!appointmentsResponse.ok) {
        setErrorMessage(
          appointmentsData.message || 'Failed to load doctor appointments'
        );
        setLoadingData(false);
        return;
      }

      if (!availabilityResponse.ok) {
        setErrorMessage(
          availabilityData.message || 'Failed to load doctor availability'
        );
        setLoadingData(false);
        return;
      }

      if (!patientsResponse.ok) {
        setErrorMessage(
          patientsData.message || 'Failed to load patient history'
        );
        setLoadingData(false);
        return;
      }

      setDoctorProfile(appointmentsData.doctor || availabilityData.doctor || null);
      setAppointments(appointmentsData.appointments || []);
      setAvailability(availabilityData.availability || []);
      setPatients(patientsData.patients || []);
    } catch (error) {
      setErrorMessage('Could not load doctor dashboard');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchDoctorDashboardData();
  }, [user.id]);

  const formatTimeTo12Hour = (timeInput: string) => {
    if (!timeInput) return '';

    const trimmed = timeInput.trim().toUpperCase();

    if (trimmed.includes('AM') || trimmed.includes('PM')) {
      return trimmed;
    }

    if (trimmed.includes(':')) {
      const [hoursStr, minutes] = trimmed.split(':');
      let hours = parseInt(hoursStr, 10);

      if (isNaN(hours) || !minutes) return trimmed;

      const suffix = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      if (hours === 0) hours = 12;

      return `${hours.toString().padStart(2, '0')}:${minutes} ${suffix}`;
    }

    return trimmed;
  };

  const handleAddAvailability = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!newDate.trim() || !newTime.trim()) {
      setErrorMessage('Please enter both a date and time');
      return;
    }

    setAddingSlot(true);

    try {
      const formattedTime = formatTimeTo12Hour(newTime);

      const response = await fetch(`/api/doctor/${user.id}/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          available_date: newDate,
          available_time: formattedTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Failed to add availability slot');
        setAddingSlot(false);
        return;
      }

      setSuccessMessage('Availability slot added successfully');
      setNewDate('');
      setNewTime('');
      await fetchDoctorDashboardData();
    } catch (error) {
      setErrorMessage('Could not connect to backend');
    } finally {
      setAddingSlot(false);
    }
  };

  const handleDeleteSlot = async (slotId: number) => {
    setErrorMessage('');
    setSuccessMessage('');
    setDeletingSlotId(slotId);

    try {
      const response = await fetch(
        `/api/doctor/${user.id}/availability/${slotId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Failed to delete slot');
        setDeletingSlotId(null);
        return;
      }

      setSuccessMessage('Availability slot deleted successfully');
      await fetchDoctorDashboardData();
    } catch (error) {
      setErrorMessage('Could not connect to backend');
    } finally {
      setDeletingSlotId(null);
    }
  };

  const handleMarkComplete = async (appointmentId: number) => {
    setErrorMessage('');
    setSuccessMessage('');
    setCompletingAppointmentId(appointmentId);

    try {
      const response = await fetch(
        `/api/appointments/${appointmentId}/complete`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Failed to mark appointment complete');
        setCompletingAppointmentId(null);
        return;
      }

      setSuccessMessage('Appointment marked as completed');
      await fetchDoctorDashboardData();
    } catch (error) {
      setErrorMessage('Could not connect to backend');
    } finally {
      setCompletingAppointmentId(null);
    }
  };

  const bookedAppointments = appointments.filter(
    (appointment) => appointment.status === 'Booked'
  );

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === 'Completed'
  );

  const cancelledAppointments = appointments.filter(
    (appointment) => appointment.status === 'Cancelled'
  );

  const bookedSlots = availability.filter((slot) => slot.is_booked);
  const openSlots = availability.filter((slot) => !slot.is_booked);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-72 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-blue-600">DocTime</h1>
          <p className="text-gray-500 mt-2">Doctor Portal</p>
        </div>

        <nav className="space-y-3 flex-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
              activeTab === 'dashboard'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <CalendarDays className="w-5 h-5" />
            Appointments
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Clock3 className="w-5 h-5" />
            Availability
          </button>

          <button
            onClick={() => setActiveTab('patients')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
              activeTab === 'patients'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            Patients
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors">
            <FileText className="w-5 h-5" />
            Medical Notes
          </button>

          <button
            onClick={() => onNavigate('messages')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            Messages
          </button>

          <button
          onClick={() => onNavigate('doctor-profile-settings')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors">
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
            <p className="text-gray-500 mt-2">
              {doctorProfile
                ? `${doctorProfile.specialty} · ${doctorProfile.clinic || 'Doctor Account'}`
                : 'Doctor Account'}
            </p>
          </div>

          <div className="text-right">
            {doctorProfile && (
              <>
                <p className="font-semibold text-gray-900">{doctorProfile.name}</p>
                {doctorProfile.location && (
                  <p className="text-sm text-gray-500">{doctorProfile.location}</p>
                )}
              </>
            )}
          </div>
        </div>

        {loadingData && (
          <div className="mb-6 bg-white rounded-2xl border border-gray-200 p-5 text-gray-600">
            Loading doctor dashboard...
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-5 text-red-700">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-5 text-green-700">
            {successMessage}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                  <CalendarDays className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-gray-500 text-sm mb-1">Upcoming Appointments</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {bookedAppointments.length}
                </h3>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-gray-500 text-sm mb-1">Completed Visits</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {completedAppointments.length}
                </h3>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                  <Clock3 className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-gray-500 text-sm mb-1">Open Slots</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {openSlots.length}
                </h3>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <p className="text-gray-500 text-sm mb-1">Cancelled</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {cancelledAppointments.length}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <section className="col-span-2 space-y-8">
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Upcoming Patient Appointments
                  </h3>

                  {!loadingData && bookedAppointments.length === 0 && (
                    <div className="border border-dashed border-gray-300 rounded-2xl p-10 text-center">
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">
                        No upcoming appointments yet
                      </h4>
                      <p className="text-gray-500">
                        Once patients book with you, they will appear here.
                      </p>
                    </div>
                  )}

                  {bookedAppointments.length > 0 && (
                    <div className="space-y-4">
                      {bookedAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="border border-gray-200 rounded-2xl p-5"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="text-xl font-semibold text-gray-900">
                                {appointment.patient_name}
                              </h4>
                              <p className="text-blue-600 font-medium">
                                Scheduled Consultation
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
                          </div>

                          {appointment.notes && (
                            <div className="mb-4 text-sm text-gray-500 bg-gray-50 rounded-xl p-3">
                              <span className="font-medium">Patient Notes:</span>{' '}
                              {appointment.notes}
                            </div>
                          )}

                          <button
                            onClick={() => handleMarkComplete(appointment.id)}
                            disabled={completingAppointmentId === appointment.id}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                          >
                            {completingAppointmentId === appointment.id
                              ? 'Completing...'
                              : 'Mark Complete'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Manage Availability
                  </h3>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg"
                    />

                    <input
                      type="text"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      placeholder="e.g. 2:30 PM or 14:30"
                      className="px-4 py-3 border border-gray-300 rounded-lg"
                    />

                    <button
                      onClick={handleAddAvailability}
                      disabled={addingSlot}
                      className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                      {addingSlot ? 'Adding...' : 'Add Slot'}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {availability.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between border border-gray-200 rounded-xl p-4"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {slot.available_date}
                          </p>
                          <p className="text-sm text-gray-500">
                            {slot.available_time}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              slot.is_booked
                                ? 'bg-red-50 text-red-700'
                                : 'bg-green-50 text-green-700'
                            }`}
                          >
                            {slot.is_booked ? 'Booked' : 'Open'}
                          </span>

                          {!slot.is_booked && (
                            <button
                              onClick={() => handleDeleteSlot(slot.id)}
                              disabled={deletingSlotId === slot.id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Doctor Profile
                  </h3>

                  {doctorProfile ? (
                    <div className="space-y-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-blue-600" />
                        <span>{doctorProfile.specialty}</span>
                      </div>

                      {doctorProfile.clinic && (
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-blue-600" />
                          <span>{doctorProfile.clinic}</span>
                        </div>
                      )}

                      {doctorProfile.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span>{doctorProfile.location}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Doctor profile unavailable.
                    </p>
                  )}
                </div>
              </section>
            </div>
          </>
        )}

        {activeTab === 'patients' && (
          <section className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Patient History
              </h3>
              <p className="text-gray-500 mt-1">
                View patients who have booked with you and their appointment records.
              </p>
            </div>

            {patients.length === 0 ? (
              <div className="border border-dashed border-gray-300 rounded-2xl p-10 text-center">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  No patient history yet
                </h4>
                <p className="text-gray-500">
                  Patients will appear here after they book appointments with you.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {patients.map((patient) => (
                  <div
                    key={patient.id}
                    className="border border-gray-200 rounded-2xl p-5"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">
                          {patient.name}
                        </h4>
                        <p className="text-gray-500 text-sm">
                          {patient.email}
                        </p>
                      </div>

                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        {patient.appointments?.length || 0} visits
                      </span>
                    </div>

                    <div className="space-y-3">
                      {patient.appointments?.map((appointment: any, index: number) => (
                        <div
                          key={index}
                          className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                        >
                          <div className="grid grid-cols-4 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-gray-500">Date</p>
                              <p className="font-medium">{appointment.date}</p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-500">Time</p>
                              <p className="font-medium">{appointment.time}</p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-500">Status</p>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                  appointment.status === 'Completed'
                                    ? 'bg-green-50 text-green-700'
                                    : appointment.status === 'Cancelled'
                                    ? 'bg-red-50 text-red-700'
                                    : 'bg-blue-50 text-blue-700'
                                }`}
                              >
                                {appointment.status}
                              </span>
                            </div>

                            <div>
                              <p className="text-xs text-gray-500">Record Type</p>
                              <p className="font-medium">Appointment</p>
                            </div>
                          </div>

                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">
                              Medical Notes / Visit Notes
                            </p>
                            <p className="text-sm text-gray-700">
                              {appointment.notes || 'No medical notes recorded.'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}