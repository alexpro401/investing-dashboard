import styled from "styled-components"

import theme, { Flex } from "theme"
import CircularProgress from "components/CircularProgress"

export const TransactionWaitContainer = styled.div`
  padding: 0;
  margin-top: 0;
`

export const TransactionWaitContent = styled(Flex)`
  display: inline-flex;
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 12px;
  letter-spacing: 0.03em;
  color: ${theme.textColors.primary};
`

export const TransactionWaitProgress = styled(CircularProgress)`
  background: transparent;

  path {
    stroke: #2669eb;
  }
`
