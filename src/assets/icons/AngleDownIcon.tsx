import { SVGProps, FC, memo } from "react"

interface IProps extends SVGProps<SVGSVGElement> {
  color?: string
}

const AngleDownIcon: FC<IProps> = ({ color, ...rest }) => {
  // @ts-ignore
  delete rest.isActive

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...rest}>
      <path
        d="M8 8.33503L10.8227 5.51234C11.092 5.24301 11.5287 5.24301 11.798 5.51234C12.0673 5.78167 12.0673 6.21833 11.798 6.48766L8.48766 9.798C8.21833 10.0673 7.78167 10.0673 7.51234 9.798L4.202 6.48766C3.93267 6.21833 3.93267 5.78167 4.202 5.51234C4.47132 5.24301 4.90799 5.24301 5.17732 5.51234L8 8.33503Z"
        fill={color ?? "currentColor"}
      />
    </svg>
  )
}

const MemoAngleDownIcon = memo(AngleDownIcon)
export default MemoAngleDownIcon
