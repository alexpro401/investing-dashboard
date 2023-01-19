import styled, { css } from "styled-components/macro"
import { respondTo } from "theme"
import { motion } from "framer-motion"

export const StyledDropdown = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  cursor: pointer;
  position: relative;
`

export const Text = styled.div`
  display: none;

  ${respondTo("sm")} {
    display: block;
  }
`

export const Label = styled(Text)`
  font-size: 16px;
  color: #707070;
`

export const Value = styled(Text)`
  font-size: 16px;
  font-family: ${(props) => props.theme.appFontFamily};
  font-weight: 700;
  color: #f5f5f5;
  margin-left: 15px;
  width: 126px;
  white-space: nowrap;
`

export const Body = styled(motion.div)<{ position?: "right" | "left" }>`
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  border-radius: 7px;
  z-index: 20;
  min-width: 176px;
  max-width: 100vh;
  width: fit-content;
  height: fit-content;

  margin: auto;
  position: absolute;
  top: 110%;

  ${(props) =>
    props.position === "right"
      ? css`
          right: 0;
        `
      : css`
          left: 0;
        `}

  ${respondTo("md")} {
    position: absolute;
    top: 50px;
    right: ${(props) => (props?.position === "left" ? "30%" : "0")};
    left: ${(props) => (props?.position === "right" ? "30%" : "0")};
  }
`

export const Item = styled(motion.div)<{ active?: boolean }>`
  height: 31px;
  color: #f7f7f7;
  padding-left: 16px;
  display: flex;
  align-items: center;
  border-radius: 7px;
  background: ${(props) => (props.active ? "#000000" : "transparent")};
`
