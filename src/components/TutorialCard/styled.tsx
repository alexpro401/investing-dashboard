import styled from "styled-components"
import { motion } from "framer-motion"

export const TutorialCardBlock = styled(motion.div)`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: #141926;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 20px;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 64px;
    height: 30px;
    background: #405d85;
    filter: blur(30px);
    transform: matrix(-0.96, 0.62, 0.22, -0.87, 0, 0);
  }

  &:after {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    width: 64px;
    height: 30px;
    background: #405d85;
    filter: blur(30px);
    transform: matrix(0.94, -0.5, -0.3, 0.89, 0, 0);
  }
`

export const HighlightDecor = styled.div`
  position: absolute;
  top: 0;
  left: -50px;
  width: 75px;
  height: 35px;
  background: #85ffd9;
  filter: blur(30px);
  transform: matrix(0.48, -0.9, 0.85, 0.5, 0, 0);
`

export const TutorialCardBlockTitle = styled.h3`
  font-size: 13px;
  line-height: 1.5;
  font-weight: 500;
  color: #e4f2ff;
  margin-bottom: 8px;
  margin-top: 0px;
`

export const TutorialCardBlockLink = styled.a`
  font-size: 13px;
  line-height: 1.5;
  color: #2669eb;
  text-decoration: none;
`

export const TutorialCardImg = styled.img`
  position: absolute;
  top: 50%;
  right: 30px;
  transform: translate(0, -50%);
  max-width: 120px;
  width: 100%;
  border-radius: 24px;
  mix-blend-mode: lighten;
  grid-row: 1 / 3;
  grid-column: 2 / 3;
`

export const TutorialCardCloseBtn = styled.button`
  position: absolute;
  top: 8px;
  right: 4px;
  background: none;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #788ab4;
`
