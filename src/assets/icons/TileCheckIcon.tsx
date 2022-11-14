import { FC } from "react"

const TileCheckIcon: FC = ({ ...rest }) => {
  return (
    <svg
      className="tile-check-icon"
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <circle
        cx="12.0681"
        cy="12.9323"
        r="8.97333"
        fill="#141926"
        stroke="#7FFFD4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.52246 13.2699L10.683 15.4305L10.6691 15.4165L15.5436 10.542"
        stroke="#7FFFD4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default TileCheckIcon
