import { useState } from 'react';
import {
  Calendar,
  Search,
  Shield,
  Clock,
  Star,
  ChevronRight,
  Heart,
  Users,
  Award,
} from 'lucide-react';
import { LoginModal } from './LoginModal';

interface HomepageProps {
  onNavigate: (page: string) => void;
  onLoginSuccess: (role: string, user: any) => void;
}

export function Homepage({
  onNavigate,
  onLoginSuccess,
}: HomepageProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const resetSignupForm = () => {
    setSignupName('');
    setSignupEmail('');
    setSignupPassword('');
    setErrorMessage('');
  };

  const handleSignup = async () => {
    setLoading(true);
    setErrorMessage('');

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setErrorMessage('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const registerResponse = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
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
          email: signupEmail,
          password: signupPassword,
          role: 'patient',
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        setErrorMessage(
          loginData.message || 'Account created, but automatic login failed'
        );
        setShowSignupModal(false);
        setShowLoginModal(true);
        resetSignupForm();
        setLoading(false);
        return;
      }

      setShowSignupModal(false);
      resetSignupForm();
      onLoginSuccess('patient', loginData.user);
    } catch (error) {
      setErrorMessage('Could not connect to backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2"
          >
            <Calendar className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">
              DocTime
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => onNavigate('home')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Home
            </button>

            <button
              onClick={() => onNavigate('discovery')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Find Doctors
            </button>

            <button
              onClick={() => onNavigate('about')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              About
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Login
            </button>

            <button
              onClick={() => setShowSignupModal(true)}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full mb-6">
            <Heart className="w-4 h-4" />
            Trusted Healthcare Platform
          </div>

          <h1 className="text-6xl font-bold text-gray-900 leading-tight mb-6">
            Book Your Doctor Appointment in Minutes
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            Discover trusted healthcare professionals, compare specialties,
            and schedule appointments instantly with DocTime.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => onNavigate('discovery')}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              Find Doctors
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('about')}
              className="px-8 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-10 border border-gray-200">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <Users className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Expert Doctors
              </h3>
              <p className="text-gray-500 text-sm">
                Access qualified specialists
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <Clock className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Quick Booking
              </h3>
              <p className="text-gray-500 text-sm">
                Appointments in minutes
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <Shield className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Secure Platform
              </h3>
              <p className="text-gray-500 text-sm">
                Protected user accounts
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <Award className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Top Rated
              </h3>
              <p className="text-gray-500 text-sm">
                Highly reviewed doctors
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-16">
        <div className="max-w-5xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Find the Right Doctor?
          </h2>

          <p className="text-blue-100 text-lg mb-8">
            Browse specialties, ratings, and availability.
          </p>

          <button
            onClick={() => onNavigate('discovery')}
            className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            Start Searching
          </button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-14">
          What Users Say
        </h2>

        <div className="grid grid-cols-3 gap-8">
          {[
            'Booking was fast and stress-free.',
            'Found the perfect specialist instantly.',
            'Great interface and easy to use.',
          ].map((quote, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm"
            >
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              <p className="text-gray-600 mb-4">{quote}</p>
              <p className="font-semibold text-gray-900">
                Verified User
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-6 h-6 text-blue-400" />
                <span className="text-xl font-bold">DocTime</span>
              </div>

              <p className="text-gray-400 leading-relaxed">
                Quality healthcare appointments at your fingertips.
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
                  <button
                    onClick={() => onNavigate('about')}
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>

              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>FAQ</li>
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

          <div className="border-t border-gray-800 mt-10 pt-8 text-center text-gray-400">
            © 2026 DocTime. All rights reserved.
          </div>
        </div>
      </footer>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={onLoginSuccess}
      />

      {showSignupModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Create Account
            </h2>

            {errorMessage && (
              <div className="mb-4 text-red-600 text-sm">
                {errorMessage}
              </div>
            )}

            <input
              type="text"
              placeholder="Full Name"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              className="w-full mb-4 px-4 py-3 border rounded-lg"
            />

            <input
              type="email"
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              className="w-full mb-4 px-4 py-3 border rounded-lg"
            />

            <input
              type="password"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className="w-full mb-6 px-4 py-3 border rounded-lg"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSignupModal(false);
                  resetSignupForm();
                }}
                className="flex-1 px-4 py-3 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSignup}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}