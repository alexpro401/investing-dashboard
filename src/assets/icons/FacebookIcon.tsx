import { FC } from "react"

const FacebookIcon: FC = ({ ...rest }) => {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <g id="Icons/Social/Facebook">
        <path
          id="Vector"
          d="M22.5195 12.7857C22.5195 7.22912 18.0424 2.72461 12.5195 2.72461C6.99668 2.72461 2.51953 7.22912 2.51953 12.7857C2.51953 17.8074 6.17637 21.9698 10.957 22.7246V15.694H8.41797V12.7857H10.957V10.5691C10.957 8.04757 12.45 6.65473 14.7342 6.65473C15.8279 6.65473 16.9727 6.85124 16.9727 6.85124V9.32722H15.7117C14.4695 9.32722 14.082 10.1028 14.082 10.8993V12.7857H16.8555L16.4121 15.694H14.082V22.7246C18.8627 21.9698 22.5195 17.8074 22.5195 12.7857Z"
          fill="currentColor"
        />
      </g>
    </svg>
  )
}

export default FacebookIcon