import { useEffect } from 'react';
import React from 'react';
import './svgcomponent.css'
import { gsap } from 'gsap';



const MySVGComponent = () => (
  <svg
    id="mainSVG"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 800 600"
  >
    <defs>
      <linearGradient
        className="grad"
        id="ringGrad_2"
        data-name="New Gradient Swatch 2"
        x1="128.85"
        y1="300"
        x2="671.15"
        y2="300"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#f7ffd4" />
        <stop offset=".3" stopColor="#00AA69" />
        <stop offset=".83" stopColor="#000" />
      </linearGradient>
      <linearGradient
        className="grad"
        id="ringGrad_2-2"
        data-name="New Gradient Swatch 2"
        x1="135.2"
        x2="664.8"
        xlinkHref="#ringGrad_2"
      />
      {/* Add more gradients here if needed */}
    </defs>
    <g id="ringGroup" strokeWidth="5">
      <circle
        cx="400"
        cy="300"
        r="270.65"
        fill="none"
        stroke="url(#ringGrad_2)"
        strokeMiterlimit="10"
      />
      <circle
        cx="400"
        cy="300"
        r="264.3"
        fill="none"
        stroke="url(#ringGrad_2-2)"
        strokeMiterlimit="10"
      />
      {/* Add more circles here */}
    </g>
  </svg>
);

export default MySVGComponent;

