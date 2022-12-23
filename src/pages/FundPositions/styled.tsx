import { FC } from "react"
import styled, { css } from "styled-components/macro"

import { AppButton } from "common"
import { Flex, GradientBorder } from "theme"

const ContainerBase = css`
  width: 100%;
`

const Styled = {
  Container: styled.div`
    box-sizing: border-box;

    ${ContainerBase}
  `,
  List: styled.div`
    padding: 16px;
    position: relative;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    ${ContainerBase}
  `,
  Content: styled(Flex)`
    align-items: center;
    justify-content: center;
    position: relative;
    ${ContainerBase}
  `,
  WithoutData: styled.div`
    font-family: ${(props) => props.theme.appFontFamily};
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
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 20px;
    text-align: center;
    color: #e4f2ff;
  `,
  Text: styled.p`
    margin: 16px 0;
    font-family: ${(props) => props.theme.appFontFamily};
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
      <AppButton
        size="medium"
        color="primary"
        full
        onClick={action}
        text={`Buy ${symbol}`}
      />
    </ActionStyled.Container>
  </ActionStyled.Backdrop>
)
