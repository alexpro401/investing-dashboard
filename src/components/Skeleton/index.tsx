import { FC } from "react"

import { TextSkeleton, RectSkeleton, CircleSkeleton } from "./styled"

type Variant = "text" | "rect" | "circle"

interface IProps {
  variant?: Variant
  w?: string
  h?: string
  m?: string
}

const Skeleton: FC<IProps> = ({ variant = "text", w, h, m }) => {
  switch (variant) {
    case "circle":
      return <CircleSkeleton w={w} h={h} m={m} />
    case "rect":
      return <RectSkeleton w={w} h={h} m={m} />
    case "text":
    default:
      return <TextSkeleton w={w} h={h} m={m} />
  }
}

export default Skeleton
