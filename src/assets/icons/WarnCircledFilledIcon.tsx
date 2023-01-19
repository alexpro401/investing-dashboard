import { FC } from "react"

const WarnCircledFilledIcon: FC = ({ ...rest }) => {
  return (
    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" {...rest}>
      <circle cx="8" cy="8.5" r="8" fill="#DB6D6D" />
      <path
        d="M7.39092 10.2796L7.06692 7.09961V4.69961H8.92692V7.09961L8.61492 10.2796H7.39092ZM8.72292 12.9556C8.52292 13.1556 8.28292 13.2556 8.00292 13.2556C7.72292 13.2556 7.48292 13.1556 7.28292 12.9556C7.08292 12.7556 6.98292 12.5156 6.98292 12.2356C6.98292 11.9556 7.08292 11.7156 7.28292 11.5156C7.48292 11.3156 7.72292 11.2156 8.00292 11.2156C8.28292 11.2156 8.52292 11.3156 8.72292 11.5156C8.92292 11.7156 9.02292 11.9556 9.02292 12.2356C9.02292 12.5156 8.92292 12.7556 8.72292 12.9556Z"
        fill="white"
      />
    </svg>
  )
}

export default WarnCircledFilledIcon
