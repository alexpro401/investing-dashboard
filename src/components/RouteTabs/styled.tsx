import { NavLink } from "react-router-dom"
import styled, { css } from "styled-components/macro"

import theme, { Flex } from "theme"

type ThemeType = "gray" | "blue"

const activeColor = (themeType: ThemeType) =>
  themeType === "gray" ? "#E4F2FF" : theme.statusColors.info

const defaultColor = (themeType: ThemeType) =>
  themeType === "gray" ? "#788ab4" : "#6781BD"

const activeBG = (themeType: ThemeType) =>
  themeType === "gray" ? "#20283a" : "#20283A"

const activeFontWeight = (themeType: ThemeType) =>
  themeType === "gray" ? 500 : 700

const Styled = {
  Tabs: styled(Flex)<{ full?: boolean }>`
    ${(props) =>
      props.full
        ? css`
            justify-content: space-between;
            width: fill-available;
          `
        : css``}
    padding: 0;
    background: #141926;
    border-radius: 24px;
    border: 2px solid #141926;
  `,
  Tab: styled(NavLink)<{ active?: boolean; themeType: ThemeType }>`
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1 0 auto;
    padding: 6.5px 18px;
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: ${(props) =>
      props.active ? activeFontWeight(props.themeType) : 500};
    font-size: 13px;
    line-height: 15px;
    text-decoration: none;
    color: ${(props) =>
      props.active
        ? activeColor(props.themeType)
        : defaultColor(props.themeType)};
    transition: all ease-in-out 0.15s;
    cursor: pointer;
    position: relative;

    background: ${(props) =>
      props.active ? activeBG(props.themeType) : "transparent"};
    box-shadow: ${(props) =>
      props.active
        ? " 0px 3px 8px rgba(0, 0, 0, 0.12), 0px 3px 1px rgba(0, 0, 0, 0.04)"
        : "none"};
    border-radius: 24px;
  `,
  TabAmount: styled(Flex)`
    min-width: 12px;
    height: 12px;
    margin-left: 4px;
    padding: 3px 4px 2px 3.5px;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    background: linear-gradient(267.88deg, #d75e65 -0.85%, #e77171 98.22%);
    font-weight: 700;
    font-size: 9px;
    line-height: 8px;
    color: #ffffff;
  `,
}

export default Styled
