const ExternalLinkIcon = ({ ...rest }): JSX.Element => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M6.85714 4H4.57143C4.25584 4 4 4.25584 4 4.57143V11.4286C4 11.7442 4.25584 12 4.57143 12H11.4286C11.7442 12 12 11.7442 12 11.4286V9.14286"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.0667 6.66634C12.0667 6.99771 12.3353 7.26634 12.6667 7.26634C12.9981 7.26634 13.2667 6.99771 13.2667 6.66634L12.0667 6.66634ZM12.6667 3.33301L13.2667 3.33301C13.2667 3.17388 13.2035 3.02127 13.091 2.90874C12.9785 2.79622 12.8258 2.73301 12.6667 2.73301V3.33301ZM9.33337 2.73301C9.002 2.73301 8.73337 3.00164 8.73337 3.33301C8.73337 3.66438 9.002 3.93301 9.33337 3.93301V2.73301ZM13.2667 6.66634L13.2667 3.33301L12.0667 3.33301L12.0667 6.66634L13.2667 6.66634ZM12.6667 2.73301H9.33337V3.93301H12.6667V2.73301Z"
        fill="currentColor"
      />
      <path
        d="M8.24236 6.90907C8.00805 7.14338 8.00805 7.52328 8.24236 7.7576C8.47668 7.99191 8.85658 7.99191 9.09089 7.7576L8.24236 6.90907ZM12.4242 4.42426C12.6585 4.18995 12.6585 3.81005 12.4242 3.57574C12.1899 3.34142 11.81 3.34142 11.5757 3.57574L12.4242 4.42426ZM9.09089 7.7576L12.4242 4.42426L11.5757 3.57574L8.24236 6.90907L9.09089 7.7576Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default ExternalLinkIcon
