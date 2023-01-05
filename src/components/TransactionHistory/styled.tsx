import styled, { css } from "styled-components/macro"

import { Flex } from "theme"
import { Icon } from "common"

export const Container = styled.div`
  flex: 1;
`

export const Header = styled(Flex)`
  overflow: hidden;
  width: 100%;
  border-bottom: 1px solid #1d2435;
  padding-bottom: 8px;
`

export const HeaderButton = styled.button<{ isActive: boolean }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  font-family: ${(props) => props.theme.appFontFamily};
  background: none;
  border: none;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  letter-spacing: 0.01em;
  color: #6781bd;
  padding: 8px;
  transition: 0.25s ease-in-out;
  width: 100%;

  ${(props) =>
    props.isActive
      ? css`
          color: #ffffff;
        `
      : ""}

  &:after {
    content: "";
    position: absolute;
    bottom: -8px;
    height: 1px;
    background: #0057ff;
    width: 0;
    transition: 0.25s ease-in-out;

    ${(props) =>
      props.isActive
        ? css`
            width: 100%;
          `
        : ""}
  }
`

export const HeaderButtonIcon = styled(Icon)`
  color: inherit;
  width: 1.5em;
  height: 1.5em;
`

export const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  margin-top: 15px;
  padding: 0 16px;
  min-height: 150px;
`

export const ListPlaceholder = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  letter-spacing: 0.1px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex: 1;
  color: #5a6071;
`
