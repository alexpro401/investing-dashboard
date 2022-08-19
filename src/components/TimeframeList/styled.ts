import styled from "styled-components"

import { device, Flex } from "theme"

const Styled = {
  Container: styled(Flex)`
    justify-content: space-around;
    width: 100%;
    padding: 15px 0;
  `,

  Item: styled.div<{ active?: boolean }>`
    font-family: Gilroy;
    font-style: normal;
    font-weight: normal;
    padding: 4px 11px 2px;
    font-size: 12px;
    line-height: 130%;

    @media only screen and (${device.xxs}) {
      font-size: 10px;
    }

    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: 1px;

    color: ${(props) => (props.active ? "#0D1320" : "#788AB4")};
    font-weight: ${(props) => (props.active ? 600 : 400)};
    background: ${(props) => (props.active ? "#9AE2CB" : "translate")};
    border-radius: 14px;
  `,
}

export default Styled
