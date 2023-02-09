import { FC } from "react"
import styled, { css } from "styled-components/macro"

import { AppButton } from "common"
import { Flex, GradientBorder, respondTo } from "theme"
import HeaderTabs from "components/Header/Tabs"
import { isNil } from "lodash"

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap);
  padding: var(--app-padding);
  overflow: hidden auto;
  flex: 1;
`

export const HeadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap);
`

export const PageTitle = styled.h2`
  font-size: 24px;
  line-height: 1.25;
  font-weight: 900;
  color: #e4f2ff;
  margin: 0;
`

export const PageHeadTabs = styled(HeaderTabs)`
  ${respondTo("sm")} {
    justify-content: flex-start;
  }
`

export const PoolPositionsListRoot = styled.div`
  ${respondTo("lg")} {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: rgba(20, 25, 38, 0.5);
    border-radius: 20px;
    padding: 0 8px 8px;
  }
`

export const PoolPositionsListHead = styled.div<{
  childMaxWidth?: string
}>`
  display: none;

  ${respondTo("lg")} {
    display: grid;
    justify-items: stretch;
    gap: calc(var(--app-gap) / 2) var(--app-gap);
    padding: 8px 16px 0;
    grid-template-columns: repeat(5, minmax(0, 142px)) 1fr;
    ${({ childMaxWidth }) =>
      !isNil(childMaxWidth)
        ? css`
            grid-template-columns: repeat(5, minmax(0, ${childMaxWidth})) 1fr;
          `
        : css`
            grid-template-columns: repeat(5, minmax(0, 142px)) 1fr;
          `}
  }
`

export const PoolPositionsListHeadItem = styled.div`
  ${respondTo("lg")} {
    width: fit-content;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 0 4px;
    padding: 8px 0;
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    color: #6781bd;
  }
`

export const PoolPositionsListWrp = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap);

  ${respondTo("lg")} {
    gap: calc(var(--app-gap) / 2);
  }
`

const Styled = {
  Container: styled.div`
    box-sizing: border-box;
    width: 100%;
  `,
  List: styled.div`
    position: relative;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    width: 100%;
  `,
  Content: styled(Flex)`
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
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
