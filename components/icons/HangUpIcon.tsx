
import React from 'react';

const HangUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
        fillRule="evenodd"
        d="M12.577 4.883a.75.75 0 00-1.154 0C4.87 11.024 3.003 13.84 3.003 16.5A4.505 4.505 0 007.5 21H12h4.502A4.504 4.504 0 0021 16.5c0-2.66-1.867-5.476-8.423-11.617zM12 12.375a.75.75 0 01.75.75v3.19l2.47-2.47a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0L8.23 15.1a.75.75 0 111.06-1.06l2.47 2.47v-3.19a.75.75 0 01.75-.75z"
        clipRule="evenodd"
        transform="rotate(135 12 12)"
    />
  </svg>
);

export default HangUpIcon;
