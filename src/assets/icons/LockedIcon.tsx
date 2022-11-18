import { FC } from "react"

const LockedIcon: FC = ({ ...rest }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M10.8125 6.2V5C10.8125 3.32 9.575 2 8 2C6.425 2 5.1875 3.32 5.1875 5V6.2C4.23125 6.2 3.5 6.98 3.5 8V12.2C3.5 13.22 4.23125 14 5.1875 14H10.8125C11.7688 14 12.5 13.22 12.5 12.2V8C12.5 6.98 11.7688 6.2 10.8125 6.2ZM6.3125 5C6.3125 3.98 7.04375 3.2 8 3.2C8.95625 3.2 9.6875 3.98 9.6875 5V6.2H6.3125V5Z"
        fill="#B1C7FC"
      />
    </svg>
  )
}

export default LockedIcon
