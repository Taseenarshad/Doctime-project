import { useState } from 'react';
import { X, User, Stethoscope, Shield } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: string, user: any) => void;
}

type UserRole = 'patient' | 'doctor' | 'admin';

export function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: LoginModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      onLoginSuccess(selectedRole, data.user);
      onClose();
    } catch (error) {
      setErrorMessage('Cannot connect to backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to DocTime
          </h2>
          <p className="text-gray-600">Sign in to continue</p>
        </div>

        {/* Roles */}
        <div className="grid grid-cols-3 gap-3 mb-6">

          <button
            onClick={() => setSelectedRole('patient')}
            className={`p-4 rounded-xl border-2 ${
              selectedRole === 'patient'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200'
            }`}
          >
            <User className="w-6 h-6 mx-auto mb-2" />
            Patient
          </button>

          <button
            onClick={() => setSelectedRole('doctor')}
            className={`p-4 rounded-xl border-2 ${
              selectedRole === 'doctor'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200'
            }`}
          >
            <Stethoscope className="w-6 h-6 mx-auto mb-2" />
            Doctor
          </button>

          <button
            onClick={() => setSelectedRole('admin')}
            className={`p-4 rounded-xl border-2 ${
              selectedRole === 'admin'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200'
            }`}
          >
            <Shield className="w-6 h-6 mx-auto mb-2" />
            Admin
          </button>

        </div>

        <form onSubmit={handleLogin}>

          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm mb-3">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            {loading
              ? 'Signing In...'
              : `Sign In as ${selectedRole}`}
          </button>

        </form>
      </div>
    </div>
  );
}