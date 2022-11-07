import { FC, useEffect, useMemo } from "react"
import { useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"

import * as S from "./styled"

export const ProgressLine: FC<{ w: number }> = ({ w }) => {
  const controls = useAnimation()
  const [ref, inView] = useInView()

  useEffect(() => {
    if (inView) controls.start("visible")
  }, [controls, inView])

  const variants = useMemo(
    () => ({
      visible: { width: `${w}%` },
      hidden: { width: 0 },
    }),
    [w]
  )
  return (
    <S.Container>
      <S.Progress ref={ref} animate={controls} variants={variants} />
    </S.Container>
  )
}
export default ProgressLine
