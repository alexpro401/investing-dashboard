import styled from "styled-components/macro"
import { Card } from "common"
import { respondTo, Flex, Text } from "theme"

export const DataCard = styled(Card)`
  ${respondTo("sm")} {
    padding: 0 16px;
  }
`

export const DataBlock = styled(Flex)`
  width: 100%;
  justify-content: space-between;

  padding: 12px 0;

  &:nth-child(2n) {
    border-top: 1px solid rgba(32, 41, 58, 0.5);
  }

  ${respondTo("sm")} {
    border-top: 1px solid rgba(32, 41, 58, 0.5);
  }
`

export const DataLabel = styled(Text)`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.textColors.secondary};

  ${respondTo("sm")} {
    font-size: 14px;
    letter-spacing: 0.01em;
  }
`

export const DataValue = styled(Text)`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.textColors.primary};

  ${respondTo("sm")} {
    font-size: 14px;
    letter-spacing: 0.01em;
  }

  span {
    display: inline-block;
    margin-left: 4px;
    color: #6781bd;
  }
`
