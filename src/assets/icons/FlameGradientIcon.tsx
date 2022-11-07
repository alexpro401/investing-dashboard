import * as React from "react"

const FlameGradientIcon: React.FC = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M9.50655 6.50637C9.50655 6.50637 10.1593 2.66688 7.4958 1C7.41555 2.33425 6.77084 3.57117 5.72306 4.40112C4.58556 5.40125 2.44618 7.65 2.46893 10.0475C2.45226 12.1381 3.62246 14.0574 5.48856 15C5.55458 14.0652 5.99422 13.1963 6.7083 12.5894C7.31337 12.124 7.70619 11.4352 7.79855 10.6775C9.39153 11.5243 10.4218 13.1465 10.5111 14.9484V14.9598C12.2717 14.1533 13.4307 12.4269 13.5106 10.492C13.6996 8.23975 12.4658 5.17725 11.3712 4.17625C10.9579 5.09889 10.3161 5.90088 9.50655 6.50637Z"
        fill="url(#paint0_linear_10996_191981)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_10996_191981"
          x1="2.46875"
          y1="1"
          x2="12.1477"
          y2="-2.65761"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2680EB" />
          <stop offset="1" stopColor="#7FFFD4" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const MemoFlameGradientIcon = React.memo(FlameGradientIcon)
export default MemoFlameGradientIcon
