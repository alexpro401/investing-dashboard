import styled from "styled-components"
import { Flex } from "theme"

export const Card = styled(Flex)`
  cursor: pointer;
  align-items: center;
  padding: 2px;
  height: 36px;
  background: #141926;
  border-radius: 16px;
  flex: none;
  order: 0;
  flex-grow: 0;
`

export const AccountCard = styled(Flex)`
  justify-content: flex-end;
  align-items: center;
  padding: 4px 12px 4px 4px;
  gap: 4px;
  height: 32px;
  background: #20283a;
  border-radius: 16px;
  flex: none;
  order: 1;
  flex-grow: 0;
`

export const AccountAddress = styled.div`
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0.01em;
  color: #e4f2ff;
  flex: none;
  order: 1;
  flex-grow: 0;
  transform: translateY(1px);
`

export const InsuranceInner = styled(Flex)`
  align-items: center;
  padding: 0 12px 0 4px;
`

export const InsuranceAmount = styled.div`
  transform: translateY(1px);
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0.01em;
  color: #e4f2ff;
  flex: none;
  order: 1;
  flex-grow: 0;
`
