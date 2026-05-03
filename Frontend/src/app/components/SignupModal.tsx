import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupSuccess: (role: string, user: any) => void;
}

export function SignupModal({
  isOpen,
  onClose,
  onSignupSuccess,
}: SignupModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const registerResponse = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name,
          email,
          password,
          role: 'patient',
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        setErrorMessage(registerData.message || 'Signup failed');
        setLoading(false);
        return;
      }

      const loginResponse = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          role: 'patient',
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        setSuccessMessage('Account created successfully. Please sign in.');
        setLoading(false);
        return;
      }

      setSuccessMessage('Account created successfully');

      setTimeout(() => {
        onSignupSuccess('patient', loginData.user);
        onClose();
      }, 700);
    } catch (error) {
      setErrorMessage('Cannot connect to backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-7 h-7 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create your account
          </h2>
          <p className="text-gray-600">
            Sign up to start booking appointments
          </p>
        </div>

        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Full name"
              className="w-full px-4 py-3 border rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Email address"
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

          {successMessage && (
            <div className="text-green-600 text-sm mb-3">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}