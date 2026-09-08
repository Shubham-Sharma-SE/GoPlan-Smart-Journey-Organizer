import React, { useRef } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Logo } from '../components/Logo';
import { 
  ArrowRight, 
  MapPin, 
  CalendarDays, 
  Wallet, 
  Receipt, 
  Briefcase, 
  FileText,
  CheckCircle2
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigateTo, currentUser } = useAppContext();
  const featuresRef = useRef<HTMLDivElement>(null);

  const handleStartPlanning = () => {
    if (currentUser) {
      navigateTo('dashboard', 'home');
    } else {
      navigateTo('login');
    }
  };

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: MapPin,
      title: 'Trip Planning & Destinations',
      desc: 'Organize multi-city routes, set dates, estimated budgets, and travel modes, visualising your trip as modern cards.'
    },
    {
      icon: CalendarDays,
      title: 'Smart Itinerary Planner',
      desc: 'Build day-by-day itineraries with chronological activity cards (activities, times, costs) on a beautiful timeline.'
    },
    {
      icon: Wallet,
      title: 'Budget Manager',
      desc: 'Define limits and compare estimated vs. actual expenses with live progress bars and warning notifications.'
    },
    {
      icon: Receipt,
      title: 'Expense Tracker',
      desc: 'Log every transaction under categories (accommodation, food, transit), which dynamically sync and update your trip budget.'
    },
    {
      icon: Briefcase,
      title: 'Packing Checklist',
      desc: 'Manage your packing needs with automated defaults for documents, electronics, clothing, and custom items.'
    },
    {
      icon: FileText,
      title: 'Notes & Travel Tips',
      desc: 'Save emergency contacts, local guidelines, and sightseeing reviews in organized, attractive note cards.'
    }
  ];

  const steps = [
    { num: '1', title: 'Create your trip', desc: 'Add dates, budget targets, and select your preferred travel modes.' },
    { num: '2', title: 'Plan your journey', desc: 'Add multiple destinations and sequence activities day-by-day.' },
    { num: '3', title: 'Manage your budget', desc: 'Estimate expenses and track daily spending dynamically.' },
    { num: '4', title: 'Pack your essentials', desc: 'Check off items from your auto-generated categorized packing lists.' },
    { num: '5', title: 'Enjoy your journey', desc: 'Access your trip summaries, print itineraries, and explore stress-free!' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50 px-6 py-4 flex items-center justify-between">
        <Logo size="md" />
        <div className="flex items-center gap-4">
          {currentUser ? (
            <button
              onClick={() => navigateTo('dashboard', 'home')}
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-sky-600/10 transition-all"
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigateTo('login')}
                className="text-slate-600 hover:text-slate-900 font-semibold text-sm transition-all px-3 py-2"
              >
                Sign In
              </button>
              <button
                onClick={() => navigateTo('signup')}
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-sky-600/10 transition-all"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-12 md:py-20 lg:py-28 max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col text-left space-y-6">
          <div className="inline-flex items-center gap-2 bg-sky-50 text-sky-700 px-3 py-1.5 rounded-full text-xs font-bold border border-sky-100 uppercase tracking-wider w-fit">
            🌍 GoPlan is Live
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight">
            Plan Smarter,<br />
            <span className="text-sky-600">Travel Better!</span>
          </h2>
          <p className="text-slate-500 text-base md:text-lg max-w-lg leading-relaxed">
            The ultimate smart journey organizer designed for students, solo adventurers, and travel groups. Plan itineraries, coordinate budgets, track actual spending, and manage packing lists all in one place.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={handleStartPlanning}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-7 py-4 rounded-xl flex items-center gap-2 shadow-lg shadow-sky-600/20 group hover:translate-x-0.5 transition-all text-base"
            >
              Start Planning
              <ArrowRight className="w-5 h-5 text-sky-100 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={scrollToFeatures}
              className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-950 hover:bg-slate-50 font-bold px-7 py-4 rounded-xl transition-all text-base shadow-sm"
            >
              Explore Features
            </button>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="relative w-full aspect-square flex items-center justify-center p-4">
          {/* Main SVG Graphic */}
          <div className="w-full h-full max-w-md bg-white border border-slate-100 rounded-3xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#e0f2fe_1px,transparent_1px)] [background-size:16px_16px] opacity-60"></div>
            
            <div className="flex justify-between items-center z-10">
              <Logo iconOnly size="lg" />
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimated Cost</span>
                <p className="text-lg font-black text-emerald-600">₹20,000</p>
              </div>
            </div>

            {/* Travel Illustration inside card */}
            <svg viewBox="0 0 400 240" className="w-full h-52 z-10">
              {/* Sky and clouds */}
              <circle cx="200" cy="180" r="140" className="fill-sky-50/50" />
              {/* Sun */}
              <circle cx="280" cy="80" r="24" className="fill-amber-400/80" />
              {/* Mountains */}
              <path d="M60 200 L160 80 L230 160 L310 70 L380 200 Z" className="fill-slate-100 stroke-slate-200" strokeWidth="2" />
              <path d="M120 200 L210 100 L270 160 L340 90 L380 200 Z" className="fill-slate-200/60" />
              
              {/* Hot air balloon */}
              <g transform="translate(100, 50) scale(0.6)">
                <ellipse cx="50" cy="40" rx="30" ry="40" className="fill-sky-500" />
                <rect x="42" y="90" width="16" height="12" rx="2" className="fill-amber-600" />
                <line x1="28" y1="75" x2="42" y2="90" className="stroke-slate-400" strokeWidth="2" />
                <line x1="72" y1="75" x2="58" y2="90" className="stroke-slate-400" strokeWidth="2" />
                <path d="M22 30 Q50 10 78 30" className="stroke-white" strokeWidth="3" fill="none" />
                <path d="M22 50 Q50 30 78 50" className="stroke-white" strokeWidth="3" fill="none" />
              </g>

              {/* Road */}
              <path d="M200 160 Q170 200 200 240" className="stroke-indigo-500" strokeWidth="8" strokeLinecap="round" strokeDasharray="3,3" fill="none" />
              
              {/* Location Pin */}
              <g transform="translate(185, 125) scale(0.35)">
                <path d="M50 90C75 60 85 45 85 32C85 13 69 5 50 5C31 5 15 13 15 32C15 45 25 60 50 90Z" className="fill-rose-500" />
                <circle cx="50" cy="32" r="12" className="fill-white" />
              </g>
            </svg>

            {/* Simulated UI Cards stacked */}
            <div className="grid grid-cols-2 gap-4 mt-2 z-10">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration</span>
                <span className="text-sm font-extrabold text-slate-700">5 Days (Pune ➔ Goa)</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Checklist</span>
                <span className="text-sm font-extrabold text-slate-700">8 / 12 Items Packed</span>
              </div>
            </div>
          </div>

          {/* Accent decoration rings */}
          <div className="absolute top-0 right-4 w-72 h-72 bg-sky-200/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
          <div className="absolute -bottom-4 left-4 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl -z-10"></div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section ref={featuresRef} className="bg-white border-y border-slate-200 py-16 px-6 md:py-24">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center space-y-4 max-w-xl mx-auto mb-16">
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Everything you need for a perfect trip
            </h3>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              Explore key modules built specifically for managing your journey checklist, timelines, itineraries, budgets, and files.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={i} 
                  className="bg-slate-50 border border-slate-100 hover:border-slate-200 p-6 rounded-2xl text-left hover:shadow-xl hover:shadow-slate-100/50 hover:-translate-y-0.5 transition-all group duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-5 border border-sky-100 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg text-slate-900 mb-2">{feature.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* "How GoPlan Works" Section */}
      <section className="py-16 px-6 md:py-24 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-4 max-w-xl mx-auto mb-16">
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            How GoPlan Works
          </h3>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            Create your itinerary and organize checklists in 5 simple steps.
          </p>
        </div>

        {/* Stepper Timeline */}
        <div className="grid md:grid-cols-5 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[28px] left-[5%] right-[5%] h-0.5 bg-slate-200 -z-10"></div>
          
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-3 px-4 relative">
              {/* Circle Index */}
              <div className="w-14 h-14 rounded-full bg-white border-2 border-slate-200 text-slate-700 font-extrabold text-lg flex items-center justify-center shadow-md relative z-10 group-hover:border-sky-500">
                <span className="text-sky-600">{step.num}</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">{step.title}</h4>
              <p className="text-slate-500 text-xs leading-relaxed max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Banner call to action */}
        <div className="mt-20 bg-gradient-to-r from-sky-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
          <div className="max-w-xl mx-auto space-y-6 relative z-10 flex flex-col items-center">
            <h3 className="text-3xl font-black tracking-tight leading-tight">
              Ready to start your next adventure?
            </h3>
            <p className="text-sky-100 text-sm md:text-base max-w-md">
              Create your account, configure your budget estimate, and share detailed print itineraries instantly with friends.
            </p>
            <button
              onClick={handleStartPlanning}
              className="bg-white hover:bg-slate-50 text-sky-700 font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-sky-950/20 transition-all text-sm w-fit"
            >
              Sign Up For Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="md" className="brightness-0 invert opacity-90" />
          <p className="text-xs font-medium">
            &copy; {new Date().getFullYear()} GoPlan. Built with React + TypeScript + Java OOP. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs font-semibold">
            <a href="#" className="hover:text-white transition-all">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-all">Terms of Service</a>
            <a href="#" className="hover:text-white transition-all">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
