import styled from "styled-components"
import { device } from "theme"
import { motion } from "framer-motion"

export const StyledTopMembers = styled(motion.div)`
  padding: 0;
  height: fit-content;
  width: 100%;
`

export const MembersList = styled.div`
  width: 100%;
  padding: 10px 0 30px;

  @media only screen and (${device.sm}) {
    padding: 0 16px 30px;
  }

  @media (min-width: 768px) {
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

export const MembersGrid = styled.div`
  width: 100%;
  overflow: auto;
`

export const ListContainer = styled(motion.div)`
  /* overflow-y: hidden;
  touch-action: none;
  overscroll-behavior: none; */

  max-width: 1200px;
  margin: 0 auto;

  @media only screen and (${device.sm}) {
    padding: 0;
  }
`

export const CardIconWrp = styled.div`
  flex: 1 0 7px;
  svg {
    width: 7px;
    height: 12px;
  }
`
