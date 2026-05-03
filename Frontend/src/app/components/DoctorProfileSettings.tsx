import { useEffect, useState } from 'react';

interface DoctorProfileSettingsProps {
  user: any;
  onNavigate: (page: string) => void;
}

export function DoctorProfileSettings({
  user,
  onNavigate,
}: DoctorProfileSettingsProps) {
  const [doctorProfile, setDoctorProfile] = useState<any>({});
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/profile/${user.id}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Failed to load profile');
        setLoading(false);
        return;
      }

      setDoctorProfile(data.doctor_profile || {});
    } catch (error) {
      setErrorMessage('Could not connect to backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user.id]);

  const handleSaveProfile = async () => {
    setMessage('');
    setErrorMessage('');

    try {
      const response = await fetch(`/api/profile/${user.id}/doctor`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(doctorProfile),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Failed to update doctor profile');
        return;
      }

      setMessage('Doctor profile updated successfully');
      setDoctorProfile(data.doctor_profile || doctorProfile);
    } catch (error) {
      setErrorMessage('Could not connect to backend');
    }
  };

  const handlePasswordChange = async () => {
    setMessage('');
    setErrorMessage('');

    try {
      const response = await fetch(`/api/profile/${user.id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Failed to update password');
        return;
      }

      setMessage('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      setErrorMessage('Could not connect to backend');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        Loading doctor profile settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Doctor Profile Settings
          </h1>
          <p className="text-gray-500 mt-2">
            Manage your public doctor profile and account security.
          </p>
        </div>

        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-5 text-green-700">
            {message}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-5 text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-2 gap-8">
          <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Personal Info
            </h2>

            <input
              type="text"
              value={doctorProfile.name || ''}
              onChange={(e) =>
                setDoctorProfile({ ...doctorProfile, name: e.target.value })
              }
              placeholder="Full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />

            <input
              type="email"
              value={doctorProfile.email || ''}
              onChange={(e) =>
                setDoctorProfile({ ...doctorProfile, email: e.target.value })
              }
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />

            <input
              type="text"
              value={doctorProfile.phone || ''}
              onChange={(e) =>
                setDoctorProfile({ ...doctorProfile, phone: e.target.value })
              }
              placeholder="Phone"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Specialty & Credentials
            </h2>

            <input
              type="text"
              value={doctorProfile.specialty || ''}
              onChange={(e) =>
                setDoctorProfile({
                  ...doctorProfile,
                  specialty: e.target.value,
                })
              }
              placeholder="Specialty"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />

            <input
              type="text"
              value={doctorProfile.license_number || ''}
              onChange={(e) =>
                setDoctorProfile({
                  ...doctorProfile,
                  license_number: e.target.value,
                })
              }
              placeholder="License number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />

            <input
              type="text"
              value={doctorProfile.certifications || ''}
              onChange={(e) =>
                setDoctorProfile({
                  ...doctorProfile,
                  certifications: e.target.value,
                })
              }
              placeholder="Certifications"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Clinic / Hospital Affiliation
            </h2>

            <input
              type="text"
              value={doctorProfile.clinic || ''}
              onChange={(e) =>
                setDoctorProfile({ ...doctorProfile, clinic: e.target.value })
              }
              placeholder="Clinic name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />

            <input
              type="text"
              value={doctorProfile.affiliation || ''}
              onChange={(e) =>
                setDoctorProfile({
                  ...doctorProfile,
                  affiliation: e.target.value,
                })
              }
              placeholder="Hospital affiliation"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />

            <input
              type="text"
              value={doctorProfile.location || ''}
              onChange={(e) =>
                setDoctorProfile({
                  ...doctorProfile,
                  location: e.target.value,
                })
              }
              placeholder="Location"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Change Password
            </h2>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />

            <button
              onClick={handlePasswordChange}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Update Password
            </button>
          </section>
        </div>

        <section className="bg-white rounded-2xl border border-gray-200 p-6 mt-8 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Public Bio
          </h2>

          <textarea
            value={doctorProfile.bio || ''}
            onChange={(e) =>
              setDoctorProfile({ ...doctorProfile, bio: e.target.value })
            }
            placeholder="Short description patients might see"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg min-h-[140px]"
          />

          <div className="flex gap-4">
            <button
              onClick={handleSaveProfile}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save Doctor Profile
            </button>

            <button
              onClick={() => onNavigate('doctor-dashboard')}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}