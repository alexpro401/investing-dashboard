import styled from "styled-components"
import { motion } from "framer-motion"

export const Container = styled(motion.div)`
  margin: 0 auto;
  background-color: #0e121b;
  width: fill-available;
  height: calc(100vh - 94px);
  overflow-y: auto;

  @media all and (display-mode: standalone) {
    height: calc(100vh - 115px);
  }
`

export const FundTypeCards = styled.div`
  padding: 0 16px;
`

export const FundTypeCardsTitle = styled.h3`
  font-size: 16px;
  line-height: 1.2;
  color: #e4f2ff;
  font-weight: 700;
`

export const CreateFundDocsBlock = styled.div`
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: 2fr 1fr;
  align-content: start;
  background: #141926;
  border-radius: 20px;
  padding: 20px;
  margin: 16px 16px 24px;

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

export const CreateFundDocsBlockTitle = styled.h3`
  font-size: 13px;
  line-height: 1.5;
  font-weight: 500;
  color: #e4f2ff;
  margin-bottom: 8px;
`

export const CreateFundDocsBlockLink = styled.a`
  font-size: 13px;
  line-height: 1.5;
  color: #2669eb;
`

export const CreateFundDocsImg = styled.img`
  max-width: 120px;
  width: 100%;
  transform: rotate(-10deg);
  border-radius: 24px;
  mix-blend-mode: lighten;
  grid-row: 1 / 3;
  grid-column: 2 / 3;
`

export const CreateFundDocsBlockCloseBtn = styled.button`
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
