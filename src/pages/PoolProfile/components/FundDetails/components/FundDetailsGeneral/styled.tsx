import { ReactNode, FC } from "react"
import styled from "styled-components/macro"

import { Flex, GradientBorder, respondTo } from "theme"
import { AppButton, Icon } from "common"

export const Container = styled.div<{ loading?: boolean }>`
  position: relative;
  padding-top: 93px;
  margin-top: 103px;
  width: fill-available;
  background: #08121a;
  box-shadow: 0 -3px 102px 2px rgba(149, 185, 255, 0.26);
  border-radius: 26px 26px 0 0;

  height: ${({ loading = false }) =>
    loading ? "calc(100vh - 128px)" : "initial"};

  @media all and (display-mode: standalone) {
    height: ${({ loading = false }) =>
      loading ? "calc(100vh - 149px)" : "initial"};
  }
`

export const FundAvatarWrp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--app-gap);
`

export const FundAvatarChangeBtn = styled.button`
  background: transparent;
  border: none;
  text-align: center;
  font-size: 14px;
  line-height: 1.2;
  font-weight: 600;
  color: ${(props) => props.theme.brandColors.secondary};
`

export const CardAddBtn = styled(AppButton)`
  margin: 0 auto;
`

export const FieldValidIcon = styled(Icon)`
  color: ${(props) => props.theme.statusColors.success};
`

export const SkeletonsWrp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--app-gap);
`

// Stepper modal

const ModalIconsContainer = styled(Flex)`
  flex-direction: column;
  margin-top: 28px;
  width: 100%;
`

const IconsContainer = styled(Flex)`
  width: 52px;
  height: 32px;
  position: relative;
`

const LeftIcon = styled.div`
  height: 32px;
  width: 32px;
  position: absolute;
  left: 0;
  top: 0;
`

const RightIcon = styled.div`
  height: 32px;
  width: 32px;
  position: absolute;
  right: 0;
  top: 0;
`

const TickersContainer = styled(Flex)`
  margin-top: 7px;
  justify-content: center;
`

const Ticker = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 15px;
  letter-spacing: 0.3px;
`

const FundTicker = styled(Ticker)`
  color: #e4f2ff;
  text-align: right;
  padding-right: 4px;
`

const BaseTicker = styled(Ticker)`
  color: #5e6d8e;
  text-align: left;
`

interface ModalIconsProps {
  left: ReactNode
  right: ReactNode
  fund: string
  base: string
}

export const ModalIcons: FC<ModalIconsProps> = ({
  left,
  right,
  fund,
  base,
}) => {
  return (
    <ModalIconsContainer>
      <IconsContainer>
        <LeftIcon>{left}</LeftIcon>
        <RightIcon>{right}</RightIcon>
      </IconsContainer>
      <TickersContainer>
        <FundTicker>{fund}</FundTicker>
        <BaseTicker>{base}</BaseTicker>
      </TickersContainer>
    </ModalIconsContainer>
  )
}

export const FormSubmitBtn = styled(AppButton).attrs(() => ({
  color: "tertiary",
}))`
  border: none;
  margin-top: auto;
  width: 100%;

  ${respondTo("xs")} {
    margin-top: 0;
  }
`
