import { SVGProps, FC, memo } from "react"

interface IProps extends SVGProps<SVGSVGElement> {
  color?: string
}
const CalendarIcon: FC<IProps> = ({ color, ...rest }) => {
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
        d="M4 8H20"
        stroke={color ?? "#616D8B"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 4H5C4.44772 4 4 4.44772 4 5V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V5C20 4.44772 19.5523 4 19 4Z"
        stroke="#616D8B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5303 12.5303C15.8232 12.2374 15.8232 11.7626 15.5303 11.4697C15.2374 11.1768 14.7626 11.1768 14.4697 11.4697L15.5303 12.5303ZM11 16L10.4697 16.5303C10.7626 16.8232 11.2374 16.8232 11.5303 16.5303L11 16ZM9.53033 13.4697C9.23744 13.1768 8.76256 13.1768 8.46967 13.4697C8.17678 13.7626 8.17678 14.2374 8.46967 14.5303L9.53033 13.4697ZM14.4697 11.4697L10.4697 15.4697L11.5303 16.5303L15.5303 12.5303L14.4697 11.4697ZM11.5303 15.4697L9.53033 13.4697L8.46967 14.5303L10.4697 16.5303L11.5303 15.4697Z"
        fill={color ?? "#616D8B"}
      />
      <path
        d="M16 2V4"
        stroke={color ?? "#616D8B"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 2V4"
        stroke={color ?? "#616D8B"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const MemoCalendarIcon = memo(CalendarIcon)
export default MemoCalendarIcon
