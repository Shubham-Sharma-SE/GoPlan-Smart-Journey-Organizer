import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', iconOnly = false, size = 'md' }) => {
  let iconSize = 'w-8 h-8';
  let textSize = 'text-xl';
  let subtitleSize = 'text-xs';

  if (size === 'sm') {
    iconSize = 'w-6 h-6';
    textSize = 'text-lg';
    subtitleSize = 'text-[9px]';
  } else if (size === 'lg') {
    iconSize = 'w-16 h-16';
    textSize = 'text-3xl';
    subtitleSize = 'text-sm';
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Travel-themed Logo Concept: Pin + Mountain + Curved Road */}
      <div className={`${iconSize} relative flex-shrink-0 text-sky-500 bg-sky-50 p-1.5 rounded-xl border border-sky-100 shadow-sm`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full fill-none stroke-current"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Location Pin Outer */}
          <path
            d="M50 90C75 60 85 45 85 32C85 13 69 5 50 5C31 5 15 13 15 32C15 45 25 60 50 90Z"
            className="text-sky-600"
            strokeWidth="5"
          />
          {/* Mountains */}
          <path
            d="M32 50L45 33L55 45L68 28L78 42"
            className="text-amber-500"
            strokeWidth="5"
          />
          {/* Curved Road / Journey Line */}
          <path
            d="M50 85C42 75 35 63 50 55C65 47 55 35 50 35"
            className="text-indigo-600"
            strokeWidth="6"
            strokeDasharray="2,2"
          />
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex flex-col select-none">
          <div className="flex items-center font-bold tracking-tight">
            <span className="text-slate-900 font-extrabold tracking-wide">Go</span>
            <span className="text-sky-600 font-extrabold tracking-wide">Plan</span>
          </div>
          <span className={`text-slate-400 font-semibold tracking-wider uppercase ${subtitleSize}`}>
            Journey Organizer
          </span>
        </div>
      )}
    </div>
  );
};
