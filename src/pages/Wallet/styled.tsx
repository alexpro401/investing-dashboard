import styled from "styled-components/macro"
import { Flex } from "theme"
import ExternalLink from "components/ExternalLink"

import cardBG from "assets/background/wallet-card.svg"
import insuranceBG from "assets/background/insurance-card.svg"
import dexePlaceholder from "assets/icons/dexe-placeholder.svg"

export const Container = styled(Flex)`
  overflow: hidden auto;
  padding: 16px 16px;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
`

export const Cards = styled(Flex)`
  width: 100%;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: 57px;
`

export const Header = styled(Flex)`
  justify-content: space-between;
  padding: 20px 0;
  width: 100%;
`
export const AvatarWrapper = styled.div`
  position: relative;
  width: 44px;
  height: 44px;
`

export const User = styled(Flex)`
  width: 100%;
`

export const Info = styled(Flex)``

export const FloatingButtons = styled(Flex)`
  width: 81px;
  justify-content: flex-end;
`

export const TextGray = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: 0.5px;

  color: #636a77;
`

export const UserInfo = styled(Flex)`
  flex-direction: column;
  align-items: flex-start;
  padding-left: 16px;
`

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

export const Address = styled(ExternalLink)`
  font-size: 14px;
  line-height: 28px;
  letter-spacing: 1px;
  color: #d0d0d0;
  margin-top: 4px;
`

export const Network = styled(Flex)`
  position: absolute;
  right: 16px;
  top: 16px;
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  text-align: right;
  letter-spacing: 1px;
  color: #c5d1dc;
`

export const NetworkIcon = styled.img`
  height: 20px;
  margin-left: 5px;
`

export const CardButtons = styled(Flex)`
  width: 100%;
  padding: 28px 0 0;
`

export const TextButton = styled.div<{ color?: string }>`
  display: flex;
  align-items: center;
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  letter-spacing: 1px;
  font-weight: ${(props) => (props.color ? "600" : "400")};
  color: ${(props) => (props.color ? props.color : "#636A77")};

  span {
    margin-top: 3px;
  }
`

export const TextLink = styled(ExternalLink)`
  font-weight: 400;
  color: #636a77;
  gap: 8px;
`

export const TextIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 8px;
`

export const InsuranceCard = styled(Flex)`
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 55px;
  padding: 16px;
  margin: 31px 0 16px;
  background: linear-gradient(
      85.6deg,
      rgba(255, 255, 255, 0.02) 0%,
      rgba(0, 0, 0, 0) 95.8%
    ),
    #111318;
  border-radius: 16px;
  border: 1px solid #2f3c3a;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.08);
  z-index: 5;

  &:before {
    content: "";
    z-index: 4;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url(${insuranceBG});
    background-repeat: no-repeat;
  }
  &:after {
    content: "";
    z-index: 4;
    height: 62px;
    width: 62px;
    position: absolute;
    top: -6px;
    left: -6px;
    background: url(${dexePlaceholder});
    background-repeat: no-repeat;
  }
`

export const InsuranceInfo = styled(Flex)`
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
`

export const InsuranceTitle = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 12px;
  letter-spacing: 0.03em;
  color: #e4f2ff;

  text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
`

export const InsuranceIcon = styled.img`
  transform: translateY(-1px);
`

export const InsuranceButton = styled.button`
  display: flex;
  align-items: center;
  appearance: none;
  background: transparent;
  outline: none;
  border: none;
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;
  text-align: right;
  color: #9ae2cb;
  z-index: 100;
`
