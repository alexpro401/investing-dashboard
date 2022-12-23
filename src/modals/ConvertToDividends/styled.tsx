import styled from "styled-components/macro"
import { Flex } from "theme"

export const Text = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 150%;

  padding: 16px 0;

  text-align: center;

  /* Text/main */

  color: #e4f2ff;
`

export const BalanceLabel = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  /* identical to box height */

  text-align: center;

  /* Text / green */

  color: #9ae2cb;
`

export const Balance = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  /* identical to box height */

  text-align: center;

  /* Text/main */

  color: #e4f2ff;
`

export const BalanceRow = styled(Flex)`
  padding: 8px 0 24px;
`
