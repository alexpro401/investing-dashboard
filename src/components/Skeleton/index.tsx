import { FC } from "react"

import { TextSkeleton, RectSkeleton, CircleSkeleton } from "./styled"

type Variant = "text" | "rect" | "circle"

interface IProps {
  variant?: Variant
  w?: string
  h?: string
  m?: string
  radius?: string
}

const Skeleton: FC<IProps> = ({
  variant = "text",
  w,
  h,
  m,
  radius,
  ...rest
}) => {
  switch (variant) {
    case "circle":
      return <CircleSkeleton w={w} h={h} m={m} radius={radius} {...rest} />
    case "rect":
      return <RectSkeleton w={w} h={h} m={m} radius={radius} {...rest} />
    case "text":
    default:
      return <TextSkeleton w={w} h={h} m={m} radius={radius} {...rest} />
  }
}

export default Skeleton
