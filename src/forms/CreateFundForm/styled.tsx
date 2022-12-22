import styled from "styled-components"
import { Flex } from "theme"

import { ReactNode, FC } from "react"

export const Container = styled.div`
  margin: 0 auto;
  width: fill-available;
  overflow-y: auto;
`

export const AvatarWrapper = styled(Flex)`
  position: absolute;
  top: -35px;
  width: fill-available;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  height: 117px;
`

export const LinkButton = styled.button`
  background: none;
  appearance: none;
  border: none;
  outline: none;
  color: #2680eb;
  padding: 0;
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;

  text-align: center;
  margin: 8px auto;
  display: block;
  letter-spacing: 0.03em;
`

export const Body = styled.div`
  position: relative;
  width: fill-available;
  background: #08121a;
  box-shadow: 0 -3px 102px 2px rgba(149, 185, 255, 0.26);
  border-radius: 26px 26px 0 0;

  @media (max-width: 768px) {
    max-width: 650px;
    padding: 117px 0 0;
    margin: 67px auto 0;
  }

  @media (min-width: 768px) {
    max-width: 880px;
    margin: 67px auto 0;
    padding: 117px 0 0 16px;
  }
`

export const Steps = styled.div``

export const Step = styled.div``

export const StepBody = styled.div<{ isLast?: boolean }>`
  padding: ${(props) =>
    props.isLast ? "24px 17px 24px 44px" : "24px 17px 48px 44px"};
`

export const FeeCards = styled.div``

export const ValidationError = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  color: #fc6d6d;
  margin: 12px 0 0 3px;
`

export const InputRow = styled(Flex)`
  width: 100%;
  padding: 12px 0;
  flex-direction: column;
  align-items: flex-start;
`

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
