import { Calendar, Heart, Brain, Baby, Bone, Pill, Eye, Ear, User, Stethoscope, Activity, Users } from 'lucide-react';
import { LoginModal } from './LoginModal';
import { useState } from 'react';

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
    description: 'Women\'s health',
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

export function DoctorDiscovery({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleSpecialtyClick = (specialtyName: string) => {
    console.log('Selected specialty:', specialtyName);
    // Will navigate to doctor list filtered by specialty
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Calendar className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-semibold text-gray-900">DocTime</span>
          </button>

          {/* Navigation */}
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

          {/* Auth Buttons */}
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

        {/* Specialty Grid */}
        <div className="grid grid-cols-4 gap-6">
          {SPECIALTIES.map((specialty) => {
            const Icon = specialty.icon;
            return (
              <button
                key={specialty.name}
                onClick={() => handleSpecialtyClick(specialty.name)}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-blue-200 group"
              >
                <div className={`w-16 h-16 ${specialty.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
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
                <li><button className="hover:text-white transition-colors">Help Center</button></li>
                <li><button className="hover:text-white transition-colors">Contact Us</button></li>
                <li><button className="hover:text-white transition-colors">FAQ</button></li>
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
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
