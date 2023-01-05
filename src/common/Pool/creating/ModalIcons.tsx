import { ReactNode, FC } from "react"
import styled from "styled-components/macro"

import { Flex } from "theme"

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
        {"/"}
      </IconsContainer>
      <TickersContainer>
        <FundTicker>{fund}</FundTicker>
        <BaseTicker>{base}</BaseTicker>
      </TickersContainer>
    </ModalIconsContainer>
  )
}
