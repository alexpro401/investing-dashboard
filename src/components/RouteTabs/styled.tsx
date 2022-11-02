import { Link } from "react-router-dom"
import styled from "styled-components"

import { Flex } from "theme"

const Styled = {
  Tabs: styled(Flex)`
    justify-content: space-between;
    width: fill-available;
    padding: 0;
    background: #141926;
    border-radius: 24px;
    border: 2px solid #141926;
  `,
  Tab: styled(Link)<{ active?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1 0 auto;
    padding: 6.5px 18px;
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 15px;
    text-decoration: none;
    border-radius: 12px;
    color: ${(props) => (props.active ? "#E4F2FF" : "#788ab4")};
    background: ${(props) => (props.active ? " #181e2c" : "transparent")};
    transition: all ease-in-out 0.15s;
    cursor: pointer;
    position: relative;

    background: ${(props) => (props.active ? " #20283a" : "transparent")};
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
