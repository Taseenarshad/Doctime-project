import { useEffect, useState } from 'react';
import {
  Calendar,
  Heart,
  Brain,
  Baby,
  Bone,
  Pill,
  Eye,
  Ear,
  User,
  Stethoscope,
  Activity,
  Users,
  MapPin,
  Phone,
  Mail,
  Star,
  X,
} from 'lucide-react';
import { LoginModal } from './LoginModal';

const SPECIALTIES = [
  {
    name: 'Cardiology',
    icon: Heart,
    description: 'Heart and cardiovascular care',
    color: 'bg-red-100 text-red-600',
  },
  {
    name: 'Dermatology',
    icon: User,
    description: 'Skin, hair, and nail treatment',
    color: 'bg-pink-100 text-pink-600',
  },
  {
    name: 'Neurology',
    icon: Brain,
    description: 'Brain and nervous system',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    name: 'Pediatrics',
    icon: Baby,
    description: 'Healthcare for children',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    name: 'Orthopedics',
    icon: Bone,
    description: 'Bones, joints, and muscles',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    name: 'Psychiatry',
    icon: Activity,
    description: 'Mental health care',
    color: 'bg-teal-100 text-teal-600',
  },
  {
    name: 'General Practice',
    icon: Stethoscope,
    description: 'Primary care physicians',
    color: 'bg-green-100 text-green-600',
  },
  {
    name: 'Ophthalmology',
    icon: Eye,
    description: 'Eye care and vision',
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    name: 'ENT',
    icon: Ear,
    description: 'Ear, nose, and throat',
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    name: 'Gynecology',
    icon: Users,
    description: "Women's health",
    color: 'bg-rose-100 text-rose-600',
  },
  {
    name: 'Oncology',
    icon: Pill,
    description: 'Cancer treatment',
    color: 'bg-gray-100 text-gray-600',
  },
  {
    name: 'Endocrinology',
    icon: Activity,
    description: 'Hormones and metabolism',
    color: 'bg-cyan-100 text-cyan-600',
  },
];

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  clinic: string;
  location: string;
  phone: string;
  email: string;
  bio: string;
  rating: number;
}

interface AvailabilitySlot {
  id: number;
  available_date: string;
  available_time: string;
  is_booked: boolean;
}

interface DoctorDiscoveryProps {
  onNavigate: (page: string) => void;
  onLoginSuccess: (role: string, user: any) => void;
  loggedInUser: any;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  loggedInUser: any;
}

function BookingModal({
  isOpen,
  onClose,
  doctor,
  loggedInUser,
}: BookingModalProps) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!isOpen || !doctor) return;

    const fetchAvailability = async () => {
      setLoadingSlots(true);
      setErrorMessage('');
      setSuccessMessage('');
      setSelectedSlotId(null);

      try {
        const response = await fetch(`/api/doctors/${doctor.id}/availability`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          setErrorMessage(data.message || 'Failed to load availability');
          setSlots([]);
          return;
        }

        const availableSlots = (data.availability || []).filter(
          (slot: AvailabilitySlot) => !slot.is_booked
        );
        setSlots(availableSlots);
      } catch (error) {
        setErrorMessage('Could not load availability');
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailability();
  }, [isOpen, doctor]);

  if (!isOpen || !doctor) return null;

  const handleBookAppointment = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!loggedInUser) {
      setErrorMessage('Please sign in as a patient first');
      return;
    }

    if (loggedInUser.role !== 'patient') {
      setErrorMessage('Only patients can book appointments');
      return;
    }

    if (!selectedSlotId) {
      setErrorMessage('Please select an available time slot');
      return;
    }

    setBookingLoading(true);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          doctor_id: doctor.id,
          patient_id: loggedInUser.id,
          availability_id: selectedSlotId,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Failed to book appointment');
        setBookingLoading(false);
        return;
      }

      setSuccessMessage('Appointment booked successfully');
      setSlots((prevSlots) =>
        prevSlots.filter((slot) => slot.id !== selectedSlotId)
      );
      setSelectedSlotId(null);
      setNotes('');
    } catch (error) {
      setErrorMessage('Could not connect to backend');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Book Appointment
          </h2>
          <p className="text-gray-600">
            {doctor.name} · {doctor.specialty}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            {doctor.clinic} · {doctor.location}
          </p>
        </div>

        {!loggedInUser && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4">
            Please sign in as a patient to book an appointment.
          </div>
        )}

        {loggedInUser && loggedInUser.role !== 'patient' && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4">
            Only patient accounts can book appointments.
          </div>
        )}

        {loadingSlots && (
          <div className="text-gray-600 mb-6">Loading available slots...</div>
        )}

        {!loadingSlots && (
          <>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Available Time Slots
            </h3>

            {slots.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-gray-500 mb-6">
                No available slots for this doctor right now.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {slots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`text-left border rounded-xl p-4 transition-all ${
                      selectedSlotId === slot.id
                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">
                      {slot.available_date}
                    </div>
                    <div className="text-blue-600 font-medium mt-1">
                      {slot.available_time}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Reason for visit or additional notes"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
              />
            </div>

            {errorMessage && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4">
                {successMessage}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>

              <button
                onClick={handleBookAppointment}
                disabled={
                  bookingLoading ||
                  !loggedInUser ||
                  loggedInUser.role !== 'patient' ||
                  slots.length === 0
                }
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function DoctorDiscovery({
  onNavigate,
  onLoginSuccess,
  loggedInUser,
}: DoctorDiscoveryProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/doctors', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          setErrorMessage(data.message || 'Failed to load doctors');
          setLoading(false);
          return;
        }

        setAllDoctors(data.doctors || []);
      } catch (error) {
        setErrorMessage('Could not load doctors from backend');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    if (!selectedSpecialty) {
      setFilteredDoctors([]);
      return;
    }

    const filtered = allDoctors.filter(
      (doctor) => doctor.specialty === selectedSpecialty
    );
    setFilteredDoctors(filtered);
  }, [selectedSpecialty, allDoctors]);

  const handleSpecialtyClick = (specialtyName: string) => {
    setSelectedSpecialty(specialtyName);
  };

  const clearFilter = () => {
    setSelectedSpecialty('');
    setFilteredDoctors([]);
  };

  const handleBookClick = (doctor: Doctor) => {
    if (!loggedInUser) {
      setIsLoginOpen(true);
      return;
    }

    setBookingDoctor(doctor);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Calendar className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-semibold text-gray-900">DocTime</span>
          </button>

          <nav className="flex items-center gap-8">
            <button className="text-gray-700 hover:text-blue-600 transition-colors">
              Features
            </button>
            <button
              onClick={() => onNavigate('discovery')}
              className="text-blue-600 font-medium"
            >
              Specialties
            </button>
            <button className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Doctors by Specialty
          </h1>
          <p className="text-xl text-gray-600">
            Choose a medical specialty to find the right doctor for your needs
          </p>
        </div>

        {loggedInUser && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-800">
            Logged in as <span className="font-semibold">{loggedInUser.name}</span> ({loggedInUser.role})
          </div>
        )}

        {loading && (
          <div className="text-center mb-10 text-gray-600">
            Loading doctors...
          </div>
        )}

        {errorMessage && (
          <div className="mb-10 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-center">
            {errorMessage}
          </div>
        )}

        {/* Specialty Grid */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {SPECIALTIES.map((specialty) => {
            const Icon = specialty.icon;
            const isSelected = selectedSpecialty === specialty.name;

            return (
              <button
                key={specialty.name}
                onClick={() => handleSpecialtyClick(specialty.name)}
                className={`bg-white p-6 rounded-xl shadow-sm transition-all border group ${
                  isSelected
                    ? 'border-blue-500 shadow-md ring-2 ring-blue-100'
                    : 'border-gray-100 hover:shadow-md hover:border-blue-200'
                }`}
              >
                <div
                  className={`w-16 h-16 ${specialty.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {specialty.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {specialty.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Results Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedSpecialty
                  ? `${selectedSpecialty} Doctors`
                  : 'Select a Specialty'}
              </h2>
              <p className="text-gray-600 mt-1">
                {selectedSpecialty
                  ? `Showing ${filteredDoctors.length} doctor(s)`
                  : 'Click a specialty above to view available doctors'}
              </p>
            </div>

            {selectedSpecialty && (
              <button
                onClick={clearFilter}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors"
              >
                Clear Filter
              </button>
            )}
          </div>

          {!selectedSpecialty && (
            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-500">
              Choose a specialty above to view doctor profiles.
            </div>
          )}

          {selectedSpecialty && filteredDoctors.length === 0 && !loading && (
            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-500">
              No doctors found for this specialty yet.
            </div>
          )}

          {selectedSpecialty && filteredDoctors.length > 0 && (
            <div className="grid grid-cols-2 gap-6">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {doctor.name}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {doctor.specialty}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold text-gray-800">
                        {doctor.rating}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-blue-600" />
                      <span>{doctor.clinic}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>{doctor.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span>{doctor.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span>{doctor.email}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6">
                    {doctor.bio}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleBookClick(doctor)}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Book Appointment
                    </button>

                    <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-6 h-6 text-blue-400" />
                <span className="text-xl font-semibold">DocTime</span>
              </div>
              <p className="text-gray-400">
                Quality healthcare appointments at your fingertips
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={() => onNavigate('home')}
                    className="hover:text-white transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('discovery')}
                    className="hover:text-white transition-colors"
                  >
                    Find Doctors
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">
                    About Us
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button className="hover:text-white transition-colors">
                    Help Center
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">
                    Contact Us
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">
                    FAQ
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@doctime.com</li>
                <li>1-800-DOCTIME</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 DocTime. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={onLoginSuccess}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={!!bookingDoctor}
        onClose={() => setBookingDoctor(null)}
        doctor={bookingDoctor}
        loggedInUser={loggedInUser}
      />
    </div>
  );
}