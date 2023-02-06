import styled, { css } from "styled-components/macro"
import { motion } from "framer-motion"
import { Flex } from "theme"

const LineBase = css`
  height: 2px;
  border-radius: 7px;
`

export const Container = styled(Flex)`
  width: 100%;
  height: 2px;
  position: relative;
  background: #293c54;
  border-radius: 7px;
`
export const LineWrapper = styled.div`
  width: 33.33%;
  &:nth-child(2) {
    margin: 0 1px;
  }
`
export const First = styled(motion.div)`
  background: linear-gradient(90deg, #77ffd4 0%, #ffa51f 100%);

  ${LineBase}
`
export const Second = styled(motion.div)`
  background: linear-gradient(90deg, #fda723 0%, #f14b4b 100%, #ff9052 100%);

  ${LineBase}
`
export const Third = styled(motion.div)`
  background: linear-gradient(90deg, #ff514f 0%, #fe0404 100%);

  ${LineBase}
`
