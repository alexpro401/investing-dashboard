import styled, { css } from "styled-components"
import { motion } from "framer-motion"

const Animation = css`
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.1);
  background: linear-gradient(
    90deg,
    #141926 0%,
    rgba(44, 59, 84, 0.5) 25%,
    #181e2c 50%,
    rgba(44, 59, 84, 0.5) 75%,
    #141926 100%
  );
  background-size: 200%;
  background-position: 0 0;
  animation-duration: 5s;
  animation-fill-mode: backwards;
  animation-iteration-count: infinite;
  animation-name: ripple;
  animation-timing-function: linear;

  @keyframes ripple {
    0% {
      background-position: 0 0;
    }
    50% {
      background-position: 100% 0;
    }
    100% {
      background-position: 0 0;
    }
  }
`

interface IProps {
  w?: string
  h?: string
  m?: string
  radius?: string
}

export const TextSkeleton = styled(motion.div)<IProps>`
  ${Animation};
  width: ${(props) => props.w ?? "100%"};
  height: ${(props) => props.h ?? "13px"};
  margin: ${(props) => props.m ?? "0"};
  border-radius: ${(props) => props.radius ?? "4px"};
  flex-shrink: 0;
`

export const RectSkeleton = styled(motion.div)<IProps>`
  ${Animation};
  width: ${(props) => props.w ?? "100%"};
  height: ${(props) => props.h ?? "26px"};
  margin: ${(props) => props.m ?? "0"};
  border-radius: ${(props) => props.radius ?? "4px"};
  flex-shrink: 0;
`

export const CircleSkeleton = styled(motion.div)<IProps>`
  ${Animation};
  width: ${(props) => props.w ?? "24px"};
  height: ${(props) => props.h ?? "24px"};
  margin: ${(props) => props.m ?? "0"};
  border-radius: ${(props) => props.radius ?? "50%"};
  flex-shrink: 0;
`
