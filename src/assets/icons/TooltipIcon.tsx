import React from "react"

function TooltipIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.5 6C11.5 9.03757 9.03757 11.5 6 11.5C2.96243 11.5 0.5 9.03757 0.5 6C0.5 2.96243 2.96243 0.5 6 0.5C9.03757 0.5 11.5 2.96243 11.5 6Z"
        stroke="#B1C7FC"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.89453 8.22786V5.89453"
        stroke="#B1C7FC"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse
        cx="5.89505"
        cy="3.68411"
        rx="0.736842"
        ry="0.736842"
        fill="#B1C7FC"
      />
    </svg>
  )
}

const MemoTooltipIcon = React.memo(TooltipIcon)
export default MemoTooltipIcon
