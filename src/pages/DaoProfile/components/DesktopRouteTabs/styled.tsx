import { Link } from "react-router-dom"
import styled from "styled-components/macro"

import theme, { Flex } from "theme"

const Styled = {
  Tabs: styled(Flex)`
    justify-content: space-between;
    background: #141926;
    border-radius: 24px;
    margin-left: 20px;
    border: 2px solid #141926;
    margin-bottom: 24px;
  `,
  Tab: styled(Link)<{ active?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1 0 auto;
    padding: 7.5px 18px;
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: ${(props) => (props.active ? 700 : 500)};
    font-size: 13px;
    line-height: 15px;
    text-decoration: none;
    color: ${(props) => (props.active ? theme.statusColors.info : "#6781BD")};
    background: ${(props) => (props.active ? " #20283A" : "transparent")};
    transition: all ease-in-out 0.15s;
    cursor: pointer;
    position: relative;

    box-shadow: ${(props) =>
      props.active
        ? " 0px 3px 8px rgba(0, 0, 0, 0.12), 0px 3px 1px rgba(0, 0, 0, 0.04)"
        : "none"};
    border-radius: 24px;
  `,
}

export default Styled
