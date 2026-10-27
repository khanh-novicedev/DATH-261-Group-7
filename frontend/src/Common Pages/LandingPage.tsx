import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, Users } from 'lucide-react';
import { CommonHeader } from './components/LandingPageHeader';
import heroImage from './assets/landing-hero.png';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: 'Structured Curriculum',
      description: 'Comprehensive courses designed by industry experts with hands-on practice projects and quizzes.',
    },
    {
      icon: Users,
      title: 'Interactive Community',
      description: 'Engage in course forums, join live practice rooms, and collaborate directly with instructors.',
    },
    {
      icon: GraduationCap,
      title: 'Verified Certificates',
      description: 'Earn recognized credentials to validate your skills and boost your academic and career portfolio.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation Bar */}
      <CommonHeader activeTab="none" />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col gap-12 sm:gap-16">
        {/* Hero Section */}
        <section className="relative w-full rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-md min-h-125 md:min-h-145 lg:min-h-157.5 flex items-center">
          {/* Background Hero Image */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={heroImage}
              alt="Online learning environment"
              className="w-full h-full object-cover object-left md:object-center"
            />
          </div>

          {/* Figma Linear Gradient Overlay (linear-gradient(270deg, #FFFFFF 77%, rgba(255,255,255,0) 100%)) */}
          <div className="absolute inset-0 bg-linear-to-r from-white/95 via-white/80 to-transparent md:bg-linear-to-l md:from-white md:via-white/90 md:to-transparent" />

          {/* Right/Center Content Call-To-Action (Matching Figma: SIGN UP NOW! + To start your Journey!) */}
          <div className="relative z-10 w-full flex justify-end px-3 sm:px-6 md:px-8 lg:px-10 py-12">
            <div className="max-w-md w-full flex flex-col items-start gap-6 bg-white/70 md:bg-transparent backdrop-blur-xs md:backdrop-blur-none p-6 md:p-0 rounded-2xl md:rounded-none">

              {/* Title & Subtitle */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  To start your <span className="text-blue-600">Journey!</span>
                </h1>
              </div>

              {/* Call-to-action Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full pt-2">
                <Link
                  to="/auth?mode=signup"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-sm font-semibold tracking-wider rounded-lg shadow-sm hover:shadow transition-all text-center cursor-pointer uppercase"
                >
                  <span>SIGN UP NOW !</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Designed for interactive learning
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              A streamlined ecosystem uniting students, teachers, and administrators seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white border border-slate-200/80 rounded-xl p-6 sm:p-7 shadow-2xs hover:shadow-md transition-shadow flex flex-col gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick CTA Banner */}
        <section className="rounded-2xl bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Ready to take your skills to the next level?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl">
              Create your account in seconds or sign in to continue where you left off.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/auth?mode=login')}
              className="px-5 py-2.5 bg-slate-700/80 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => navigate('/auth?mode=signup')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Get started
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
