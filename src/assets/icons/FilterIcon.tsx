import * as React from "react"

const FilterIcon = ({ ...rest }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      {...rest}
    >
      <g id="Filter 1">
        <path
          id="Vector 217"
          d="M16.6924 6.5H7.17422C6.31987 6.5 5.85896 7.50212 6.41497 8.15079L9.95926 12.2858C10.1146 12.467 10.2 12.6979 10.2 12.9366V17.1486C10.2 17.5274 10.414 17.8737 10.7528 18.0431L13.6667 19.5V12.9366C13.6667 12.6979 13.7521 12.467 13.9074 12.2858L17.4517 8.15079C18.0077 7.50212 17.5468 6.5 16.6924 6.5Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}

export default FilterIcon
