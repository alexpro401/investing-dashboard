import styled from "styled-components/macro"
import { motion } from "framer-motion"

export const OverlayRoot = styled(motion.div)`
  background: rgba(34, 41, 58, 0.6);
  backdrop-filter: blur(3px);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 80;
  height: 100%;
  width: 100%;
`
