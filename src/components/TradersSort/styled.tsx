import styled, { css } from "styled-components/macro"
import { Flex } from "theme"
import { motion } from "framer-motion"
import { AppButton } from "common"

export const Container = styled(motion.div)`
  flex-direction: column;
  justify-content: flex-start;
  z-index: 100;
  max-width: 345px;
  width: 100%;
  height: fit-content;
  background: #181e2c;
  border-radius: 20px;
`

export const Header = styled(Flex)`
  width: 100%;
  padding: 10px 16px;
  box-sizing: border-box;
  position: relative;
  border-bottom: 1px solid #293c54;
`

export const Title = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 100%;
  color: #e4f2ff;
`

export const Cancel = styled(AppButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #788ab4;
  padding: 6px;
  border-radius: 9px !important;
`

export const Item = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: ${(props) => props.theme.appFontFamily};
  width: 100%;
  font-weight: 700;
  font-size: 14px;
  line-height: 1.2;
  letter-spacing: 0.01em;
  padding: 16px;
  color: #6781bd;
  background: transparent;

  ${(props) =>
    props.active
      ? css`
          background: linear-gradient(
            266.2deg,
            rgba(169, 221, 251, 0) 2.35%,
            rgba(193, 218, 255, 0.04) 96.05%
          );
          color: ${props.theme.textColors.primary};
        `
      : css``}
`

export const Label = styled.div<{ active?: boolean }>`
  font: inherit;
  color: inherit;
`

export const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
`

export const FooterBtn = styled(AppButton)`
  width: 50%;
`
