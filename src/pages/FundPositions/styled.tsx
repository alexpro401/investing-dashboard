import styled, { css } from "styled-components/macro"

import { Flex, respondTo } from "theme"
import HeaderTabs from "components/Header/Tabs"
import { isNil } from "lodash"

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap);
  padding: var(--app-padding);
  flex: 1;
  position: relative;
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
