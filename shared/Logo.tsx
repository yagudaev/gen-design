import * as React from 'react'
import type { SVGProps } from 'react'
const SvgLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 461 461"
    {...props}
  >
    <g clipPath="url(#Logo_svg__a)">
      <rect
        width={425.006}
        height={425.006}
        x={17.997}
        y={17.997}
        fill="url(#Logo_svg__b)"
        rx={34.419}
      />
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32.662}
        d="M99.405 200.737v60.276M164.729 150.505v160.738M230.052 100.274v261.198M295.375 150.505v160.738M360.699 200.737v60.276"
      />
    </g>
    <defs>
      <linearGradient
        id="Logo_svg__b"
        x1={230.5}
        x2={230.5}
        y1={17.997}
        y2={443.003}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#027BFF" />
        <stop offset={1} stopColor="#003E82" />
      </linearGradient>
      <clipPath id="Logo_svg__a">
        <path fill="#fff" d="M0 0h461v461H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgLogo
