import { AppButton } from "common"
import styled from "styled-components"
import { Flex } from "theme"

// TOKEN ITEM

export const TokenInfo = styled(Flex)`
  flex-direction: column;
  flex: 1;
  align-items: flex-start;
`

export const Symbol = styled.div`
  overflow: hidden;
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  font-feature-settings: "tnum" on, "lnum" on;
  color: ${({ theme }) => theme.textColors.primary};
  text-align: left;
`

export const Name = styled.div`
  overflow: hidden;
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  letter-spacing: 0.03em;
  font-feature-settings: "tnum" on, "lnum" on;
  color: ${({ theme }) => theme.textColors.secondary};
  text-align: left;
`

export const BalanceInfo = styled(Flex)`
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`

export const TokenBalance = styled.div`
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  text-align: right;
  color: ${({ theme }) => theme.textColors.primary};
`

export const TokenPrice = styled.div`
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 15px;
  text-align: right;
  color: ${({ theme }) => theme.statusColors.success};
`

export const Blacklist = styled.div`
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 700;
  font-size: 13px;
  line-height: 16px;
  letter-spacing: 0.03em;
  font-feature-settings: "tnum" on, "lnum" on;
  color: ${({ theme }) => theme.statusColors.error};
`

export const TokenContainer = styled(Flex)<{ disabled?: boolean }>`
  width: fill-available;
  box-sizing: border-box;
  height: 50px;
  justify-content: flex-start;
  padding: 0 16px;
  transition: background 0.2s ease-in-out;
  &:hover {
    background: linear-gradient(
      264.39deg,
      rgba(255, 255, 255, 0) -58.22%,
      rgba(255, 255, 255, 0.04) 116.91%
    );
  }

  ${Symbol} {
    color: ${({ theme, disabled }) => disabled && theme.textColors.secondary};
    opacity: ${({ disabled }) => disabled && 0.5};
  }
  ${Name} {
    opacity: ${({ disabled }) => disabled && 0.5};
  }
  ${TokenBalance} {
    opacity: ${({ disabled }) => disabled && 0.5};
  }
  img {
    opacity: ${({ disabled }) => disabled && 0.5};
  }
  cursor: ${({ disabled }) => disabled && "not-allowed"};
`

export const RemoveButton = styled(AppButton)`
  padding: 0;
  border-radius: 0;
`
