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

export const Placeholder = styled(Flex)`
  justify-content: center;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  min-width: 0px;
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: #b1c7fc;
  text-align: center;
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

// TOKENS CARD

export const Card = styled(Flex)`
  width: 100%;
  flex-direction: column;
`

export const CardHeader = styled(Flex)`
  flex-direction: column;
  width: fill-available;
  padding: 0 16px 16px;
  justify-content: flex-start;

  &:empty {
    padding: 0 16px;
  }
`

export const CardList = styled.div`
  position: relative;
  width: 100%;
  height: fit-content;
  max-height: 448px;
  overflow-y: auto;
  padding-top: 16px;

  &:before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    margin: auto;
    width: 100%;
    content: "";
    height: 1px;
    background: radial-gradient(
          54.8% 53% at 50% 50%,
          #587eb7 0%,
          rgba(88, 126, 183, 0) 100%
        )
        /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
      radial-gradient(
          60% 51.57% at 50% 50%,
          #6d99db 0%,
          rgba(109, 153, 219, 0) 100%
        )
        /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
      radial-gradient(
          69.43% 69.43% at 50% 50%,
          rgba(5, 5, 5, 0.5) 0%,
          rgba(82, 82, 82, 0) 100%
        )
        /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
    opacity: 0.1;
  }
`

export const Footer = styled(Flex)`
  box-sizing: border-box;
  width: 100%;
  padding: 16px;
  position: relative;
  &:before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    margin: auto;
    width: 100%;
    content: "";
    height: 1px;
    background: radial-gradient(
          54.8% 53% at 50% 50%,
          #587eb7 0%,
          rgba(88, 126, 183, 0) 100%
        )
        /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
      radial-gradient(
          60% 51.57% at 50% 50%,
          #6d99db 0%,
          rgba(109, 153, 219, 0) 100%
        )
        /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
      radial-gradient(
          69.43% 69.43% at 50% 50%,
          rgba(5, 5, 5, 0.5) 0%,
          rgba(82, 82, 82, 0) 100%
        )
        /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
    opacity: 0.1;
  }
`

export const ImportButton = styled(AppButton)`
  flex: 1 0 auto;
`

export const RemoveButton = styled(AppButton)`
  padding: 0;
  border-radius: 0;
`
