import { FC } from "react"

const ClearIcon: FC = ({ ...rest }) => {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M0.233946 0.233946C-0.0779824 0.545968 -0.0779823 1.05176 0.233946 1.36378L2.86516 3.99499L0.233946 6.62621C-0.0688653 6.93974 -0.0645348 7.4381 0.243679 7.74631C0.551893 8.05453 1.05026 8.05886 1.36378 7.75604L3.995 5.12483L6.62621 7.75604C6.82683 7.96376 7.12391 8.04706 7.40328 7.97394C7.68264 7.90081 7.90081 7.68264 7.97394 7.40328C8.04706 7.12391 7.96376 6.82683 7.75604 6.62621L5.12483 3.99499L7.75604 1.36378C8.05886 1.05025 8.05453 0.551893 7.74631 0.243679C7.4381 -0.0645355 6.93974 -0.0688661 6.62621 0.233946L3.995 2.86516L1.36378 0.233946C1.05176 -0.077982 0.545968 -0.077982 0.233946 0.233946Z"
        fill="#B1C7FC"
      />
    </svg>
  )
}

export default ClearIcon
