import { useEffect, useState } from 'react';
import { ArrowLeft, Save, Settings, LogOut } from 'lucide-react';

interface PatientProfileSettingsProps {
  user: any;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  onProfileUpdated: (user: any) => void;
}

export function PatientProfileSettings({
  user,
  onLogout,
  onNavigate,
  onProfileUpdated,
}: PatientProfileSettingsProps) {
  const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    date_of_birth: '',
    gender: '',
    phone: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    insurance_provider: '',
    insurance_policy_number: '',
    email_reminders: true,
    sms_reminders: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile/${user.id}`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          setErrorMessage(data.message || 'Failed to load profile');
          return;
        }

        setFormData(data.profile);
      } catch (error) {
        setErrorMessage('Could not connect to backend');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user.id]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setErrorMessage('');

    try {
      const response = await fetch(`/api/profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Failed to update profile');
        return;
      }

      setMessage('Profile updated successfully');
      onProfileUpdated(data.profile);
    } catch (error) {
      setErrorMessage('Could not connect to backend');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-72 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-blue-600">DocTime</h1>
          <p className="text-gray-500 mt-2">Patient Portal</p>
        </div>

        <nav className="space-y-3 flex-1">
          <button
            onClick={() => onNavigate('patient-dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 font-medium">
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
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Profile Settings</h2>
          <p className="text-gray-500 mt-2">
            Update your account and patient profile information.
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

        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.date_of_birth || ''}
                onChange={(e) => handleChange('date_of_birth', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.gender || ''}
                onChange={(e) => handleChange('gender', e.target.value)}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
              <input
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.emergency_contact_name || ''}
                onChange={(e) => handleChange('emergency_contact_name', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone</label>
              <input
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.emergency_contact_phone || ''}
                onChange={(e) => handleChange('emergency_contact_phone', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Provider</label>
              <input
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.insurance_provider || ''}
                onChange={(e) => handleChange('insurance_provider', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Policy Number</label>
              <input
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.insurance_policy_number || ''}
                onChange={(e) => handleChange('insurance_policy_number', e.target.value)}
              />
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Reminder Preferences</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-gray-700">
                <input
                  type="checkbox"
                  checked={!!formData.email_reminders}
                  onChange={(e) => handleChange('email_reminders', e.target.checked)}
                />
                Email reminders
              </label>

              <label className="flex items-center gap-3 text-gray-700">
                <input
                  type="checkbox"
                  checked={!!formData.sms_reminders}
                  onChange={(e) => handleChange('sms_reminders', e.target.checked)}
                />
                SMS reminders
              </label>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </main>
    </div>
  );
}
