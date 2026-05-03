import { Calendar, ShieldCheck, Clock3, Stethoscope, HeartHandshake } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const values = [
    {
      icon: Calendar,
      title: 'Easy Appointment Booking',
      description:
        'DocTime makes scheduling medical appointments simple, fast, and accessible for patients.',
    },
    {
      icon: Stethoscope,
      title: 'Trusted Doctor Discovery',
      description:
        'We help patients connect with the right doctors by specialty, location, and availability.',
    },
    {
      icon: Clock3,
      title: 'Efficient Schedule Management',
      description:
        'Doctors can manage appointments and availability in one place, reducing scheduling confusion.',
    },
    {
      icon: HeartHandshake,
      title: 'Patient-Centered Care',
      description:
        'We believe healthcare access should feel organized, transparent, and supportive for every user.',
    },
  ];

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
            <button className="text-blue-600 font-medium">
              About
            </button>
          </nav>

          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <section className="text-center mb-16">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-blue-600" />
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About DocTime
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            DocTime is a healthcare appointment platform designed to make booking,
            managing, and organizing medical visits easier for patients, doctors,
            and administrators. Our goal is to create a more efficient and
            user-friendly healthcare scheduling experience.
          </p>
        </section>

        {/* What we stand for */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            What We Stand For
          </h2>
          <p className="text-gray-600 text-center mb-12 text-lg">
            Our platform is built around four key value propositions.
          </p>

          <div className="grid grid-cols-2 gap-8">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm"
                >
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-blue-600" />
                  </div>

                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Mission section */}
        <section className="bg-white rounded-2xl border border-gray-200 p-10 shadow-sm mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            We aim to simplify the healthcare appointment process by bridging the gap
            between patients searching for care and doctors managing their schedules.
            DocTime is built to support accessibility, efficiency, and trust in the
            healthcare experience.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
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

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 DocTime. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}