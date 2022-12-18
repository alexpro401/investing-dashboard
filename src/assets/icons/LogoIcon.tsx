import { FC } from "react"

const LogoIcon: FC = ({ ...rest }) => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <circle cx="18" cy="18" r="18" fill="#081219" />
      <path
        d="M8.3787 16.7791C7.69159 22.0952 11.4526 26.9411 16.7687 27.6282C17.6366 27.7367 18.5045 27.7367 19.3363 27.5921L25.9181 34.1377C16.9857 38.5135 6.20888 34.861 1.83307 25.9286C-0.192098 21.7697 -0.553735 16.9961 0.820486 12.6203L8.3787 16.7791Z"
        fill="url(#paint0_radial_2_12752)"
      />
      <path
        d="M8.81271 17.0323L0.856689 12.6203C1.25449 11.4269 1.76078 10.3058 2.3394 9.18475C4.69004 4.98976 8.63189 1.87968 13.297 0.65011C22.8442 -1.98984 32.7169 3.6517 35.3569 13.1989C36.6226 17.7917 36.0078 22.71 33.621 26.8688C33.0424 27.8814 32.3553 28.8578 31.5959 29.7619L8.81271 17.0323ZM11.6335 10.6675L27.5455 19.7084C28.4858 14.4285 25.0141 9.40173 19.7342 8.42531C16.8411 7.91902 13.8756 8.75078 11.6335 10.6675Z"
        fill="url(#paint1_linear_2_12752)"
      />
      <defs>
        <radialGradient
          id="paint0_radial_2_12752"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(10.6168 26.4262) rotate(29.4366) scale(16.1414 7.12209)"
        >
          <stop stopColor="#979797" />
          <stop offset="1" stopColor="#777777" />
        </radialGradient>
        <linearGradient
          id="paint1_linear_2_12752"
          x1="0.85669"
          y1="29.7619"
          x2="32.9127"
          y2="-12.4867"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2680EB" />
          <stop offset="1" stopColor="#7FFFD4" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default LogoIcon
