import React from 'react';

interface HexagonProps {
  className?: string;
}

export const HexagonLogo: React.FC<HexagonProps> = ({ className }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Abstract Circuit J Shape */}
      <path d="M70 10 L85 20 L85 40 L70 50 L55 40 L55 20 Z" fill="#FF4500" opacity="0.9" />
      <path d="M30 60 L45 70 L45 90 L30 100 L15 90 L15 70 Z" fill="#FF4500" opacity="0.9" />
      <path d="M70 70 L85 80 L85 100 L70 110 L55 100 L55 80 Z" transform="translate(0, -15)" fill="#FF4500" opacity="0.9" />
      
      {/* Circuit Lines */}
      <path d="M55 30 L45 30 L45 80 L30 80" stroke="#FF4500" strokeWidth="2" fill="none" />
      <path d="M85 30 L95 30 L95 85 L70 85" stroke="#FF4500" strokeWidth="2" fill="none" />
      <path d="M45 80 L55 90" stroke="#666" strokeWidth="2" fill="none" />
      
      {/* Connection Points */}
      <circle cx="45" cy="30" r="3" fill="#050505" stroke="#FF4500" strokeWidth="2" />
      <circle cx="95" cy="85" r="3" fill="#050505" stroke="#FF4500" strokeWidth="2" />
      <circle cx="30" cy="80" r="3" fill="#050505" stroke="#FF4500" strokeWidth="2" />
    </svg>
  );
};