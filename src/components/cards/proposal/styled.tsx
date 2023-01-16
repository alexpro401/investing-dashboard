import styled from "styled-components/macro"
import { Flex, respondTo } from "theme"

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
  background: ${({ theme }) => theme.backgroundColors.secondary};
  border-radius: 16px;
  margin-bottom: 18px;
  z-index: initial;

  ${respondTo("lg")} {
    flex-direction: row;
    padding: var(--app-padding);
  }
`
export const Head = styled(Flex)<{ p: string }>`
  width: 100%;
  justify-content: space-between;
  padding: ${(props) => props.p};
  border-bottom: 1px solid #1d2635;
  position: relative;

  ${respondTo("lg")} {
    width: initial;
    min-width: 200px;
    flex-direction: column;
    align-items: flex-start;
    border-bottom: none;
    padding: 0;
  }
`
export const Body = styled.div`
  width: 100%;
  padding: 12px 16px 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: var(--app-gap) 5px;

  ${respondTo("lg")} {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 1fr);
    padding: 0;
  }
`
export const Title = styled.div`
  min-width: 24px;
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 100%;
  color: #e4f2ff;
  margin: 0 4px;
  transform: translateY(2px);

  span {
    color: #788ab4;
  }
`
export const Footer = styled(Flex)`
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px 8px;
  border-top: 1px solid #1d2635;

  ${respondTo("lg")} {
    width: initial;
    min-width: 160px;
    flex-direction: column;
    align-items: flex-end;
    border-top: none;
    padding: 0;
  }
`
export const FundIconContainer = styled.div`
  position: relative;
  width: 24px;
  height: 24px;
`
export const SizeTitle = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 100%;
  color: #e4f2ff;
  margin: 0 0 6px 0;
`

export const LPSizeContainer = styled.div`
  width: 137px;
`
