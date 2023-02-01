import { FC } from "react"

const PlusOutline: FC = ({ ...rest }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19Z"
        stroke="#788AB4"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.7079 9.068V10.52H10.7279V12.5H9.27588V10.52H7.30788V9.068H9.27588V7.1H10.7279V9.068H12.7079Z"
        fill="#788AB4"
      />
    </svg>
  )
}

export default PlusOutline
