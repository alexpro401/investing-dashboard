import styled from "styled-components/macro"
import { respondTo } from "theme"
import { motion } from "framer-motion"

export const StyledTopMembers = styled(motion.div)`
  padding: 0;
  height: fit-content;
  width: 100%;
`

export const MembersList = styled.div`
  width: 100%;
  padding: 0 16px 30px;

  ${respondTo("sm")} {
    padding: 10px 32px 30px;
  }
`

export const LoadingText = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  letter-spacing: 0.1px;
  color: #fff;
  margin-top: 30px;
`

export const ListContainer = styled(motion.div)`
  /* overflow-y: hidden;
  touch-action: none;
  overscroll-behavior: none; */

  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
`

export const CardIconWrp = styled.div`
  flex: 1 0 7px;
  svg {
    width: 7px;
    height: 12px;
  }
`
