import { FC } from "react"
import styled, { css } from "styled-components"

import Button from "components/Button"
import { Flex, GradientBorder } from "theme"

const ContainerBase = css`
  width: 100%;
  height: calc(100vh - 128px);

  @media all and (display-mode: standalone) {
    height: calc(100vh - 149px);
  }
`

const Styled = {
  Container: styled.div`
    ${ContainerBase}
    box-sizing: border-box;
  `,
  List: styled.div`
    ${ContainerBase}
    padding: 16px;
    position: relative;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  `,
  Content: styled(Flex)`
    ${ContainerBase}
    align-items: center;
    justify-content: center;
    position: relative;
  `,
  WithoutData: styled.div`
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 16px;
    color: #e4f2ff;
  `,
}

export default Styled

const ActionStyled = {
  Backdrop: styled(Flex)`
    position: absolute;
    z-index: 10;
    height: inherit;
    width: 100%;
    background: rgba(13, 18, 28, 0.7);
    backdrop-filter: blur(20px);
  `,
  Container: styled(GradientBorder)`
    width: calc(100% - 32px);
    max-width: 400px;
    padding: 24px 42px 22px;
    flex-direction: column;
    border-radius: 16px;

    &::after {
      background: linear-gradient(64.44deg, #191e2b 32.35%, #272e3e 100%);
    }
  `,
  Title: styled.p`
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 20px;
    text-align: center;
    color: #e4f2ff;
  `,
  Text: styled.p`
    margin: 16px 0;
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 150%;
    text-align: center;
    color: #e4f2ff;
  `,
}

interface IBecomeInvestor {
  symbol: string
  action: () => void
  positionCount: number
}

export const BecomeInvestor: FC<IBecomeInvestor> = ({
  symbol,
  action,
  positionCount,
}) => (
  <ActionStyled.Backdrop ai="center" jc="center">
    <ActionStyled.Container>
      <ActionStyled.Title>Become investor</ActionStyled.Title>
      <ActionStyled.Text>
        The trader has {positionCount} open positions, but you need to be a fund
        investor to see them
      </ActionStyled.Text>
      <Button size="big" full onClick={action}>
        Buy {symbol}
      </Button>
    </ActionStyled.Container>
  </ActionStyled.Backdrop>
)
