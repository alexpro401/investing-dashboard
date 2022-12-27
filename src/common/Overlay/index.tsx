import { FC, HTMLAttributes } from "react"
import { MotionProps } from "framer-motion"
import * as S from "./styled"

type Props = {
  onClick?: () => void
} & HTMLAttributes<HTMLDivElement> &
  MotionProps

const Overlay: FC<Props> = (props) => {
  return (
    <>
      <S.OverlayRoot
        initial="hidden"
        transition={{ duration: 0.05 }}
        variants={{
          visible: {
            opacity: 1,
            display: "block",
          },
          hidden: {
            opacity: 0,
            transitionEnd: { display: "none" },
          },
        }}
        {...props}
      />
    </>
  )
}

export default Overlay
