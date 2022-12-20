import styled from "styled-components"

import { device, Flex } from "theme"

const Styled = {
  Container: styled(Flex)`
    justify-content: space-around;
    width: 100%;
  `,

  Item: styled.div<{ active?: boolean }>`
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
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

    color: ${({ active, theme }) =>
      active ? theme.textColors.primaryNegative : "#788AB4"};
    font-weight: ${(props) => (props.active ? 600 : 400)};
    background: ${({ active, theme }) =>
      active ? theme.statusColors.success : "translate"};
    border-radius: 14px;
  `,
}

export default Styled
