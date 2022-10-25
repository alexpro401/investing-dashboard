import { FC } from "react"

const UserIcon: FC = ({ ...rest }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M6.28516 18.856C6.28516 16.4891 8.58769 14.5703 11.428 14.5703C14.2683 14.5703 16.5709 16.4891 16.5709 18.856"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.4286 11.9997C13.3221 11.9997 14.8571 10.4647 14.8571 8.57115C14.8571 6.6776 13.3221 5.14258 11.4286 5.14258C9.53502 5.14258 8 6.6776 8 8.57115C8 10.4647 9.53502 11.9997 11.4286 11.9997Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default UserIcon
