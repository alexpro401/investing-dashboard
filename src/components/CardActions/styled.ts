import { motion } from "framer-motion"
import styled from "styled-components/macro"
import { GradientBorder } from "theme"

export const Root = styled(motion.div)``

export const CardActionsWrp = styled.div`
  display: flex;
  justify-content: space-between;

  width: 100%;
  margin: 8px 0 0;
`
export const CardAction = styled(GradientBorder)<{ active?: boolean }>`
  font-weight: 500;
  font-size: 13px;
  line-height: 15px;
  padding: 8px 12px;
  border-radius: 23px;
  color: ${(props) =>
    props.active ? props.theme.textColors.primary : "#788AB4"};
  cursor: pointer;

  &:after {
    background: #08121a;
  }
`
