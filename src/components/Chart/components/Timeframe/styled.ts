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
    cursor: pointer;
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

    @media only screen and (${device.xxs}) {
      font-size: 10px;
    }

    @media screen and (min-width: 768px) {
      font-weight: 600;
      font-size: 13px;
      line-height: 16px;
      color: ${({ active, theme }) =>
        active ? theme.brandColors.secondary : "rgba(177, 199, 252, 0.5)"};
      background: transparent;
      padding: 4px 12px 2px;
    }
  `,
}

export default Styled
