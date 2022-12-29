import styled from "styled-components/macro"
import { Flex } from "theme"
import { Icon } from "common"
import TransactionHistory from "components/TransactionHistory"
import ExternalLink from "components/ExternalLink"

import cardBG from "assets/background/wallet-card.svg"

const sidePadding = "16px"

export const Container = styled(Flex)`
  overflow: hidden auto;
  padding: 16px 16px;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
`

export const ContainerInner = styled.div`
  background: #141926;
  border-radius: 20px;
  width: 100%;
`

export const Title = styled.h2`
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #e7efff;
  padding: 0 ${sidePadding};
`

export const AccountBadgeWrp = styled.div`
  display: flex;
  justify-content: space-between;
  background: linear-gradient(91.68deg, #122b5a 1.93%, #1864c1 97.66%);
  border-radius: 20px;
  padding: 30px 20px;
  margin: 16px ${sidePadding};
`

export const Header = styled(Flex)`
  justify-content: space-between;
  padding: 20px 0;
  width: 100%;
`

export const Info = styled(Flex)``

export const Name = styled.input`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: 0.5px;
  color: #c5d1dc;
  appearance: none;
  background: none;
  outline: none;
  border: none;
  border-bottom: 1px solid transparent;
  border-radius: 0;
  max-width: 154px;
  padding: 0;

  &:not(:disabled) {
    border-bottom: 1px solid #5a60717f;
  }

  &::placeholder {
    color: #c5d1dc;
  }

  &:disabled {
    color: #c5d1dc;
  }
`

export const Card = styled.div`
  position: relative;
  background: url(${cardBG});
  background-repeat: no-repeat;
  border: 1px solid #2f3c3a;
  padding: 16px 16px 14px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  width: 100%;
`

export const AddressWrp = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 16px 2px 6px;
  background: rgba(13, 40, 78, 0.2);
  border-radius: 12px;
`

export const Address = styled(ExternalLink)`
  font-size: 14px;
  line-height: 28px;
  letter-spacing: 1px;
  color: #d0d0d0;
`

export const NetworkIcon = styled.img`
  height: 20px;
  margin-left: 5px;
`

export const TextButton = styled.div<{ color?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  color: #e4f2ff;
  background: rgba(13, 40, 78, 0.2);
  border-radius: 12px;
  min-width: 32px;
  padding: 12px;
`

export const TextIcon = styled(Icon)`
  width: 1.2em;
  height: 1.2em;
`

export const TransactionHistoryWrp = styled(TransactionHistory)``
