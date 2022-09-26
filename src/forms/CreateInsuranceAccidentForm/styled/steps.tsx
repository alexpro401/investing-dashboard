import styled from "styled-components"
import { motion } from "framer-motion"
import { Icon } from "common"

export const StepsProgress = styled.div<{
  progress: number
}>`
  position: relative;
  width: 100%;
  height: 1px;
  background: #293c54;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: ${(props) => props.progress}%;
    height: 1px;
    background: #7fffd4;
  }
`

export const StepsControllerButton = styled(motion.button)<{
  isActive?: boolean
}>`
  display: flex;
  align-items: center;
  gap: 10px;
  border: none;
  background: none;
  color: ${(props) => (props.isActive ? "#7fffd4" : "#b1c7fc")};
`

export const RoundedIcon = styled(Icon)<{
  isActive?: boolean
}>`
  padding: 5px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid ${(props) => (props.isActive ? "#7fffd4" : "#b1c7fc")};
  color: ${(props) => (props.isActive ? "#7fffd4" : "#b1c7fc")};
`
