import styled, { css } from "styled-components/macro"
import { Flex } from "theme"
import { AnimatePresence, motion } from "framer-motion"
import { FC, useMemo } from "react"

const LineBase = css`
  height: 2px;
  border-radius: 7px;
`

const LPSizeStyled = {
  Container: styled(Flex)`
    width: 100%;
    height: 2px;
    position: relative;
    background: #293c54;
    border-radius: 7px;
  `,
  LineWrapper: styled.div`
    width: 33.33%;
    &:nth-child(2) {
      margin: 0 1px;
    }
  `,
  First: styled(motion.div)`
    background: linear-gradient(90deg, #77ffd4 0%, #ffa51f 100%);

    ${LineBase}
  `,
  Second: styled(motion.div)`
    background: linear-gradient(90deg, #fda723 0%, #f14b4b 100%, #ff9052 100%);

    ${LineBase}
  `,
  Third: styled(motion.div)`
    background: linear-gradient(90deg, #ff514f 0%, #fe0404 100%);

    ${LineBase}
  `,
}

function calcPercentage(f, v) {
  return (v * 100) / f
}

const TraderLPSize: FC<{ size: number }> = ({ size }) => {
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
    <LPSizeStyled.Container>
      <LPSizeStyled.LineWrapper>
        <AnimatePresence>
          {size > 0 && (
            <LPSizeStyled.First
              initial={{ width: 0 }}
              animate={
                size > 0 ? { width: firstSize.toString() + "%" } : { width: 0 }
              }
              transition={{ delay: size > 0 ? 0 : 0.3, duration: 0.15 }}
            />
          )}
        </AnimatePresence>
      </LPSizeStyled.LineWrapper>
      <LPSizeStyled.LineWrapper>
        <AnimatePresence>
          {size > 33 && (
            <LPSizeStyled.Second
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
      </LPSizeStyled.LineWrapper>
      <LPSizeStyled.LineWrapper>
        <AnimatePresence>
          {size > 66 && (
            <LPSizeStyled.Third
              initial={{ width: 0 }}
              animate={
                size > 66 ? { width: thirdSize.toString() + "%" } : { width: 0 }
              }
              transition={{ delay: size > 33 ? 0.3 : 0, duration: 0.15 }}
            />
          )}
        </AnimatePresence>
      </LPSizeStyled.LineWrapper>
    </LPSizeStyled.Container>
  )
}

export default TraderLPSize
