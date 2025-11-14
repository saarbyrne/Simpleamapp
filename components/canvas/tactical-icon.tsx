import React from 'react'

interface TacticalIconProps {
  className?: string
  size?: number
}

export function TacticalIcon({ className = '', size = 48 }: TacticalIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Grid lines */}
      <line x1="16" y1="0" x2="16" y2="48" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
      <line x1="32" y1="0" x2="32" y2="48" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
      <line x1="0" y1="16" x2="48" y2="16" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
      <line x1="0" y1="32" x2="48" y2="32" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
      
      {/* X marks (top-left, bottom-right) */}
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {/* Top-left X */}
        <line x1="6" y1="6" x2="10" y2="10" />
        <line x1="10" y1="6" x2="6" y2="10" />
        
        {/* Bottom-right X */}
        <line x1="38" y1="38" x2="42" y2="42" />
        <line x1="42" y1="38" x2="38" y2="42" />
      </g>
      
      {/* O marks (circles) */}
      <g stroke="currentColor" strokeWidth="2" fill="none">
        {/* Top-right O */}
        <circle cx="38" cy="10" r="3" />
        
        {/* Bottom-left O */}
        <circle cx="10" cy="38" r="3" />
        
        {/* Center O */}
        <circle cx="24" cy="24" r="3" />
      </g>
    </svg>
  )
}

