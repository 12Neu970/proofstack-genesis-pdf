
import React from 'react';

const Logo = ({ className = "h-8 w-8" }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="20" cy="20" r="20" fill="url(#gradient)" />
      
      {/* Stack of documents */}
      <rect x="10" y="12" width="14" height="16" rx="1" fill="white" fillOpacity="0.9" />
      <rect x="12" y="10" width="14" height="16" rx="1" fill="white" fillOpacity="0.7" />
      <rect x="14" y="8" width="14" height="16" rx="1" fill="white" />
      
      {/* Checkmark */}
      <path
        d="M18 18L20 20L24 16"
        stroke="#2563eb"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Document lines */}
      <line x1="17" y1="13" x2="25" y2="13" stroke="#e5e7eb" strokeWidth="1" />
      <line x1="17" y1="15" x2="23" y2="15" stroke="#e5e7eb" strokeWidth="1" />
      <line x1="17" y1="21" x2="25" y2="21" stroke="#e5e7eb" strokeWidth="1" />
      <line x1="17" y1="23" x2="23" y2="23" stroke="#e5e7eb" strokeWidth="1" />
      
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;
