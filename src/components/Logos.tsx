import React from "react";

// 1. MAIN EMBLEM / LOGO OF THE AGROHACKATHON
export function MainLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background soft fill */}
      <circle cx="50" cy="50" r="48" fill="#344E41" fillOpacity="0.15" />
      
      {/* Outer circular green border with a gap at the bottom for stability */}
      <path
        d="M 12 60 A 42 42 0 1 1 88 60"
        stroke="#A3B18A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 16 68 A 42 42 0 0 0 84 68"
        stroke="#A3B18A"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="4 4"
      />

      {/* House (Left side) */}
      <g transform="translate(18, 28) scale(0.9)" stroke="#E8E6D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 12 L0 22 L16 22 L16 12 Z" />
        <path d="M-3 12 L8 2 L19 12" />
        <rect x="5" y="14" width="6" height="8" fill="#344E41" />
        <circle cx="8" cy="7" r="1.5" fill="#A3B18A" stroke="none" />
      </g>

      {/* Cow Head (Right side) */}
      <g transform="translate(56, 26) scale(0.95)" stroke="#E8E6D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Cow head outline */}
        <path d="M 6 4 C 6 4, 12 2, 14 8 C 16 14, 14 20, 8 22 C 2 20, 0 14, 2 8 C 4 2, 10 4, 10 4" fill="#0F1108" fillOpacity="0.5" />
        {/* Horns */}
        <path d="M 3 5 C 1 1, -2 4, 1 7" fill="none" />
        <path d="M 13 5 C 15 1, 18 4, 15 7" fill="none" />
        {/* Ears */}
        <path d="M 1 9 C -4 9, -3 13, 2 11" fill="none" />
        <path d="M 15 9 C 20 9, 19 13, 14 11" fill="none" />
        {/* Eyes */}
        <circle cx="5" cy="11" r="1" fill="#E8E6D9" />
        <circle cx="11" cy="11" r="1" fill="#E8E6D9" />
        {/* Snout */}
        <ellipse cx="8" cy="18" rx="4.5" ry="3" fill="#344E41" />
        <circle cx="6.5" cy="18" r="0.75" fill="#E8E6D9" />
        <circle cx="9.5" cy="18" r="0.75" fill="#E8E6D9" />
      </g>

      {/* Cheese Wheel with Cut Wedge (Center) */}
      <g transform="translate(34, 38) scale(0.9)">
        {/* 3D Cylinder Cheese Wheel body */}
        <path
          d="M 2 8 C 2 3, 26 3, 26 8 L 26 18 C 26 23, 2 23, 2 18 Z"
          fill="#D4DE72"
          stroke="#0F1108"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Top of the cheese */}
        <ellipse cx="14" cy="8" rx="12" ry="5" fill="#E9C46A" stroke="#0F1108" strokeWidth="1.5" />
        {/* Cut wedge face */}
        <path
          d="M 14 8 L 22 10.5 L 22 18 L 14 15.5 Z"
          fill="#E8E6D9"
          stroke="#0F1108"
          strokeWidth="1.2"
        />
        <path
          d="M 14 8 L 11 11 L 11 18.5 L 14 15.5 Z"
          fill="#F4F1DE"
          stroke="#0F1108"
          strokeWidth="1.2"
        />
        {/* Cheese holes */}
        <circle cx="16" cy="12" r="1" fill="#E9C46A" />
        <circle cx="19" cy="14" r="0.8" fill="#E9C46A" />
        <circle cx="7" cy="16" r="1.2" fill="#E9C46A" />
        <circle cx="11" cy="17" r="1" fill="#E9C46A" />
      </g>

      {/* Wheat Ear (Right border) */}
      <g transform="translate(74, 34) scale(0.8)" stroke="#D4DE72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="2" y1="22" x2="12" y2="2" />
        {/* Grains */}
        <path d="M 2 14 C 0 11, 2 9, 5 11 Z" fill="#D4DE72" />
        <path d="M 11 12 C 13 9, 11 7, 8 9 Z" fill="#D4DE72" />
        <path d="M 5 8 C 3 5, 5 3, 8 5 Z" fill="#D4DE72" />
        <path d="M 14 6 C 16 3, 14 1, 11 3 Z" fill="#D4DE72" />
      </g>

      {/* Circuit Traces (Top center growing upwards) */}
      <g stroke="#A3B18A" strokeWidth="1.5" strokeLinecap="round">
        <path d="M 40 34 L 40 18 A 3 3 0 1 1 43 15" />
        <path d="M 50 32 L 50 10 A 3 3 0 1 1 53 7" fill="none" />
        <path d="M 60 34 L 60 22 L 66 16 A 3 3 0 1 0 68 13" fill="none" />
        {/* Node dots */}
        <circle cx="43" cy="15" r="2" fill="#D4DE72" />
        <circle cx="53" cy="7" r="2" fill="#D4DE72" />
        <circle cx="68" cy="13" r="2" fill="#D4DE72" />
      </g>

      {/* Robodog / Walking Robot (Bottom) */}
      <g transform="translate(38, 62) scale(0.85)">
        {/* Robot Body */}
        <rect x="4" y="4" width="16" height="8" rx="3" fill="#A3B18A" stroke="#0F1108" strokeWidth="1.5" />
        {/* Eye/Camera lens */}
        <rect x="15" y="6" width="3" height="3" rx="1" fill="#D4DE72" />
        {/* Antenna */}
        <line x1="12" y1="4" x2="14" y2="0" stroke="#0F1108" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="14" cy="0" r="1" fill="#D4DE72" />
        
        {/* Front Left Leg */}
        <path d="M 16 11 L 18 16 L 16 22" fill="none" stroke="#0F1108" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Front Right Leg */}
        <path d="M 14 11 L 12 15 L 14 20" fill="none" stroke="#0F1108" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Back Left Leg */}
        <path d="M 6 11 L 4 16 L 6 22" fill="none" stroke="#0F1108" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Back Right Leg */}
        <path d="M 8 11 L 10 15 L 8 20" fill="none" stroke="#0F1108" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

// 2. ROSAGROLEASING LOGO (АО «Росагролизинг»)
export function RosagroleasingLogo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="46" fill="#1B4D3E" />
      {/* 3 yellow/gold leaves/sprouts */}
      <path
        d="M 50 18 C 50 18, 30 35, 50 72 C 70 35, 50 18, 50 18 Z"
        fill="#F4A261"
      />
      <path
        d="M 50 40 C 50 40, 22 50, 32 78 C 55 70, 50 40, 50 40 Z"
        fill="#E9C46A"
      />
      <path
        d="M 50 40 C 50 40, 78 50, 68 78 C 45 70, 50 40, 50 40 Z"
        fill="#E9C46A"
      />
      {/* Dynamic details */}
      <circle cx="50" cy="81" r="3" fill="#E8E6D9" />
    </svg>
  );
}

// 3. MINSELKHOZ LOGO (Минсельхоз РФ)
export function MinselkhozLogo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="46" fill="#E9C46A" />
      
      {/* Wheat ear in Russian Flag Colors */}
      <g transform="translate(50, 50) scale(1.1)">
        <line x1="0" y1="25" x2="0" y2="-25" stroke="#264653" strokeWidth="3" strokeLinecap="round" />
        
        {/* Top/Left grains: White */}
        <path d="M -2 -14 C -10 -12, -8 -5, 0 -8 Z" fill="#FFFFFF" stroke="#264653" strokeWidth="1" />
        <path d="M -2 -4 C -10 -2, -8 5, 0 2 Z" fill="#FFFFFF" stroke="#264653" strokeWidth="1" />
        
        {/* Middle grains: Blue */}
        <path d="M 2 -9 C 10 -7, 8 0, 0 -3 Z" fill="#1D3557" stroke="#264653" strokeWidth="1" />
        <path d="M -2 6 C -10 8, -8 15, 0 12 Z" fill="#1D3557" stroke="#264653" strokeWidth="1" />
        
        {/* Bottom grains: Red */}
        <path d="M 2 1 C 10 3, 8 10, 0 7 Z" fill="#E63946" stroke="#264653" strokeWidth="1" />
        <path d="M 2 11 C 10 13, 8 20, 0 17 Z" fill="#E63946" stroke="#264653" strokeWidth="1" />
      </g>
    </svg>
  );
}

// 4. NARODNY FERMER LOGO (Ассоциация «Народный фермер»)
export function NarodnyFermerLogo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Curved ploughed fields (green stripes) */}
      <path d="M 10 75 Q 60 50 110 75" stroke="#344E41" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M 15 85 Q 60 62 105 85" stroke="#A3B18A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M 20 93 Q 60 74 100 93" stroke="#344E41" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* Wheat spikes (Left side) */}
      <g transform="translate(32, 10)">
        <path d="M 5 45 C 5 45, -5 25, 5 10 C 15 25, 5 45, 5 45 Z" fill="#E9C46A" />
        <path d="M 15 35 C 15 35, 8 15, 15 5 C 22 15, 15 35, 15 35 Z" fill="#F4A261" />
      </g>

      {/* Tractor (Right side) */}
      <g transform="translate(68, 20) scale(0.95)" stroke="#4A3B32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Cab */}
        <rect x="12" y="4" width="12" height="10" rx="1" fill="#E8E6D9" />
        {/* Hood */}
        <rect x="0" y="9" width="12" height="6" fill="#D4DE72" />
        {/* Chimney */}
        <line x1="6" y1="9" x2="6" y2="2" />
        {/* Big back wheel */}
        <circle cx="18" cy="20" r="6" fill="#0F1108" />
        <circle cx="18" cy="20" r="2.5" fill="#E8E6D9" />
        {/* Small front wheel */}
        <circle cx="4" cy="21" r="4.5" fill="#0F1108" />
        <circle cx="4" cy="21" r="1.5" fill="#E8E6D9" />
      </g>
    </svg>
  );
}

// 5. ISTRINSKAYA SYROVARNYA OLEGA SIROTY (Истринская сыроварня Олега Сироты)
export function SirotaSyrovarnyaLogo({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Decorative calligraphic flourishes */}
      <path
        d="M 60 10 C 20 10, 15 45, 60 30 C 105 15, 100 50, 60 50"
        stroke="#E63946"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 15 70 Q 60 90 105 70"
        stroke="#E63946"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Stylized Russian letters representation */}
      <g transform="translate(18, 38)" fill="#E63946">
        {/* "Олег" */}
        <path d="M 12 5 A 8 8 0 1 1 12 21 A 8 8 0 1 1 12 5 M 12 8 A 5 5 0 1 0 12 18 A 5 5 0 1 0 12 8" />
        <path d="M 26 5 L 26 20 L 34 20 L 34 5 L 31 5 L 31 17 L 29 17 L 29 5 Z" />
        <path d="M 38 5 L 46 5 L 46 8 L 41 8 L 41 11 L 45 11 L 45 14 L 41 14 L 41 20 L 38 20 Z" />
        <path d="M 50 12 Q 56 12 56 5 L 49 5 L 49 20 L 52 20 Z" />
        
        {/* "Сирота" */}
        <g transform="translate(4, 18)" fill="#E63946">
          <path d="M 5 5 C 10 5, 12 9, 8 13 C 5 16, 12 20, 5 20 L 2 20 L 2 5 Z" />
          <path d="M 16 5 L 16 20 L 19 20 L 19 5 Z" />
          <path d="M 24 5 L 24 20 L 27 20 L 27 12 L 32 12 L 32 20 L 35 20 L 35 5 Z" />
          <path d="M 40 5 L 48 5 L 48 8 L 44 8 L 44 20 L 41 20 Z" />
          <path d="M 52 5 L 59 15 L 61 5 L 64 5 L 60 20 L 56 20 L 49 5 Z" />
        </g>
      </g>

      {/* Traditional Dots */}
      <circle cx="60" cy="20" r="3" fill="#E63946" />
      <circle cx="35" cy="85" r="2" fill="#E63946" />
      <circle cx="85" cy="85" r="2" fill="#E63946" />
    </svg>
  );
}
