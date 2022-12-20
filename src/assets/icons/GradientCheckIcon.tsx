import { FC } from "react"

const GradientCheckIcon: FC = ({ ...rest }) => {
  return (
    <svg
      width="10"
      height="8"
      viewBox="0 0 10 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        id="Path"
        d="M1.5 4.23714L3.6679 6.40504L3.6539 6.39104L8.54493 1.5"
        stroke="url(#paint0_linear_2_13536)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2_13536"
          x1="1.5"
          y1="6.40504"
          x2="6.42687"
          y2="-1.49312"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2680EB" />
          <stop offset="1" stopColor="#7FFFD4" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default GradientCheckIcon
