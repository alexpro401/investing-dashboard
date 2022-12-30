import { FC } from "react"

const LogoutIcon: FC = ({ ...rest }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M6.66667 12H4.88889C4.65314 12 4.42705 11.9063 4.26035 11.7397C4.09365 11.573 4 11.3469 4 11.1111V4.88889C4 4.65314 4.09365 4.42705 4.26035 4.26035C4.42705 4.09365 4.65314 4 4.88889 4H6.66667"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.77783 10.2218L12.0001 7.99957L9.77783 5.77734"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 8H6.66663"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default LogoutIcon
