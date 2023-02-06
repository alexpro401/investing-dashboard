import { AnimatePresence } from "framer-motion"
import { FC, useMemo } from "react"
import * as S from "./styled"

function calcPercentage(f, v) {
  return (v * 100) / f
}

const ProgressColorized: FC<{ size: number }> = ({ size }) => {
  const MAX = {
    first: 33,
    second: 66,
    third: 100,
  }
  const firstSize = useMemo(() => {
    if (size >= MAX.first) {
      return 100
    }

    return calcPercentage(33, size)
  }, [MAX.first, size])

  const secondSize = useMemo(() => {
    if (size >= MAX.second) {
      return 100
    } else if (size >= MAX.first) {
      const val = size - MAX.first
      return calcPercentage(33, val)
    }

    return 0
  }, [MAX.first, MAX.second, size])

  const thirdSize = useMemo(() => {
    if (size >= MAX.third) {
      return 100
    } else if (size >= MAX.second) {
      const val = size - MAX.second
      return calcPercentage(34, val)
    }

    return 0
  }, [MAX.second, MAX.third, size])

  return (
    <S.Container>
      <S.LineWrapper>
        <AnimatePresence>
          {size > 0 && (
            <S.First
              initial={{ width: 0 }}
              animate={
                size > 0 ? { width: firstSize.toString() + "%" } : { width: 0 }
              }
              transition={{ delay: size > 0 ? 0 : 0.3, duration: 0.15 }}
            />
          )}
        </AnimatePresence>
      </S.LineWrapper>
      <S.LineWrapper>
        <AnimatePresence>
          {size > 33 && (
            <S.Second
              initial={{ width: 0 }}
              animate={
                size > 33
                  ? { width: secondSize.toString() + "%" }
                  : { width: 0 }
              }
              transition={{ delay: size > 33 ? 0.15 : 0.15, duration: 0.15 }}
            />
          )}
        </AnimatePresence>
      </S.LineWrapper>
      <S.LineWrapper>
        <AnimatePresence>
          {size > 66 && (
            <S.Third
              initial={{ width: 0 }}
              animate={
                size > 66 ? { width: thirdSize.toString() + "%" } : { width: 0 }
              }
              transition={{ delay: size > 33 ? 0.3 : 0, duration: 0.15 }}
            />
          )}
        </AnimatePresence>
      </S.LineWrapper>
    </S.Container>
  )
}

export default ProgressColorized
