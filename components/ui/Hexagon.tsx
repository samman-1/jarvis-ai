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
      {/* 
        Refined Circuit J Logo Reconstruction
        Colors: #FF4500 (Orange), #888 (Silver/Gray)
        This version more accurately reflects the "J" shape from the provided image.
      */}
      
      {/* 1. Primary Orange Hexagons */}
      {/* Top Left-ish of the J curve */}
      <path d="M45 15 L53 11 L61 15 L61 24 L53 28 L45 24 Z" fill="#FF4500" />
      {/* Top Right - Start of J spine */}
      <path d="M72 13 L80 9 L88 13 L88 22 L80 26 L72 22 Z" fill="#FF4500" />
      {/* Bottom Hook Start */}
      <path d="M22 62 L30 58 L38 62 L38 71 L30 75 L22 71 Z" fill="#FF4500" />
      {/* Bottom Hook Turn */}
      <path d="M72 63 L80 59 L88 63 L88 72 L80 76 L72 72 Z" fill="#FF4500" />

      {/* 2. Main J Frame Orange Lines */}
      {/* Vertical Spine */}
      <path d="M80 26 L80 59" stroke="#FF4500" strokeWidth="3" />
      
      {/* Top Horizontal Circuit Connection */}
      <path d="M61 19.5 L72 17.5" stroke="#FF4500" strokeWidth="2.5" />
      
      {/* Bottom Hook Structure */}
      <path 
        d="M30 75 L38 85 L72 85 L80 76" 
        stroke="#FF4500" 
        strokeWidth="3.5" 
        fill="none" 
        strokeLinecap="round"
      />
      
      {/* 3. Outer Circuitry & Decorative Nodes (Orange) */}
      {/* Small terminal line at very top right */}
      <path d="M65 14 L62 14" stroke="#FF4500" strokeWidth="1.5" />
      <circle cx="62" cy="14" r="2.5" stroke="#FF4500" strokeWidth="1.5" />
      
      {/* Secondary bottom hook outline */}
      <path 
        d="M30 83 L38 91 L72 91 L85 75" 
        stroke="#FF4500" 
        strokeWidth="1.5" 
        fill="none" 
        opacity="0.6"
      />

      {/* 4. Internal Silver Circuitry Nodes */}
      {/* Silver vertical nested line */}
      <path d="M68 35 L68 62 L50 72" stroke="#888" strokeWidth="2" fill="none" />
      <circle cx="68" cy="33" r="2.5" fill="#888" />
      <circle cx="73" cy="50" r="2.5" fill="#888" />
      
      {/* Offset Orange Circuit Path */}
      <path d="M63 26 L63 32 L73 42" stroke="#FF4500" strokeWidth="1.5" fill="none" />
      <circle cx="63" cy="26" r="2.5" stroke="#FF4500" strokeWidth="1.5" />
      
      {/* Far Right Accent Line */}
      <circle cx="85" cy="30" r="2.5" stroke="#FF4500" strokeWidth="1.5" />
      <path d="M85 30 L85 59" stroke="#FF4500" strokeWidth="1" opacity="0.4" />
      
      {/* Left Hook Terminal Node */}
      <path d="M38 71 L46 78 L58 78" stroke="#FF4500" strokeWidth="1.5" fill="none" />
      <circle cx="58" cy="78" r="2.5" stroke="#FF4500" strokeWidth="1.5" />
    </svg>
  );
};