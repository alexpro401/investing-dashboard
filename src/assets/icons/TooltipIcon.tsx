import React from "react"

function TooltipIcon() {
  return (
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2.5" width="12" height="12" rx="6" fill="#28334A" />
      <path
        d="M8 11.5V8.5"
        stroke="#0D1320"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7.93906" cy="5.80039" r="0.9" fill="#0D1320" />
    </svg>
  )
}

const MemoTooltipIcon = React.memo(TooltipIcon)
export default MemoTooltipIcon
