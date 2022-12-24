import styled from "styled-components/macro"
import { motion } from "framer-motion"

import theme from "theme"

export const ToastsContainer = styled(motion.div)<{ height: string | number }>`
  width: 100%;
  height: ${({ height }) => height};
  position: fixed;
  top: 32px;
  z-index: 105;
`
export const ToastsInner = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  padding-bottom: 1px;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`

export const Container = styled(motion.div)<{ width?: string }>`
  width: calc(100vw - 32px);
  max-width: 460px;
  position: relative;
  margin: 16px 16px 0;
  border-radius: 16px;
  background: ${theme.textColors.secondaryNegative};
`

export const Close = styled.div`
  height: 24px;
  width: 24px;
  margin: -6px -6px 0 0;
`

export const Body = styled.div`
  padding: 12px;
`

export const Icon = styled.img`
  width: 18px;
  height: 18px;
`

export const Content = styled.div`
  width: 100%;
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 15px;
  letter-spacing: 0.03em;
  color: ${theme.textColors.primary};
  margin-top: 8px;
`

export const TransactionBody = styled.span`
  display: inline-block;
  margin-right: 3px;
`

export const TransactionErrorContent = styled.div`
  margin-bottom: 16px;
`
