import { SVGProps, FC, memo } from "react"

interface IProps extends SVGProps<SVGSVGElement> {
  color?: string
}
const AngleUpIcon: FC<IProps> = ({ color, ...rest }) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...rest}>
      <path
        d="M8 7.66498L5.17732 10.4877C4.90799 10.757 4.47132 10.757 4.202 10.4877C3.93267 10.2183 3.93267 9.78167 4.202 9.51234L7.51234 6.202C7.78167 5.93267 8.21833 5.93267 8.48766 6.202L11.798 9.51234C12.0673 9.78167 12.0673 10.2183 11.798 10.4877C11.5287 10.757 11.092 10.757 10.8227 10.4877L8 7.66498Z"
        fill={color ?? "currentColor"}
      />
    </svg>
  )
}

const MemoAngleUpIcon = memo(AngleUpIcon)
export default MemoAngleUpIcon
