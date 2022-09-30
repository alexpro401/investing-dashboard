const FileDockIcon = ({ ...rest }) => {
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
        d="M12.5879 4H8.71429C6.96335 4 6.08789 4 5.54394 4.48816C5 4.97631 5 5.76198 5 7.33333V15.6667C5 17.238 5 18.0237 5.54394 18.5118C6.08789 19 6.96335 19 8.71429 19H14.2857C16.0366 19 16.9121 19 17.4561 18.5118C18 18.0237 18 17.238 18 15.6667V8.85702C18 8.5164 18 8.34608 17.9293 8.19294C17.8586 8.0398 17.7244 7.91937 17.4561 7.67851L13.9011 4.48816C13.6327 4.2473 13.4985 4.12687 13.3279 4.06343C13.1572 4 12.9674 4 12.5879 4Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8 12L14 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8 15L12 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M13 4V6.66667C13 7.29521 13 7.60948 13.2441 7.80474C13.4882 8 13.881 8 14.6667 8H18"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export default FileDockIcon
