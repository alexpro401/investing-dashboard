import styled, { css } from "styled-components/macro"
import { Flex, respondTo } from "theme"
import { Icon } from "common"
import { isNil } from "lodash"

export const Container = styled.a`
  display: block;
  width: 100%;
  text-decoration: none;
  color: initial;

  &:not(:first-child) {
    border-top: 1px solid #1d2635;
  }
`
export const Content = styled.div<{ itemMaxWidthLg?: string }>`
  display: grid;
  grid-template-columns: 0.5fr 0.25fr 0.25fr;
  gap: var(--app-gap);
  width: 100%;
  padding: 12px 15px;

  ${respondTo("lg")} {
    justify-items: flex-start;
    ${({ itemMaxWidthLg }) =>
      !isNil(itemMaxWidthLg)
        ? css`
            grid-template-columns: repeat(4, minmax(0, ${itemMaxWidthLg})) 1fr;
          `
        : css`
            grid-template-columns: repeat(4, minmax(0, 145px)) 1fr;
          `}
  }
`
export const Item = styled(Flex)`
  width: 100%;
  flex: 0 1 auto;
  flex-direction: column;
  align-items: flex-start;

  &:last-child {
    text-align: right;
  }

  ${respondTo("lg")} {
    align-self: stretch;
    justify-content: center;

    &:last-child {
      text-align: left;
    }
  }
`
export const Label = styled.div`
  width: 100%;
  margin-bottom: 4px;
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  line-height: 13px;
  color: #788ab4;

  ${respondTo("lg")} {
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    letter-spacing: 0.01em;
  }
`
export const Value = styled.div`
  width: 100%;
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  letter-spacing: 0.03em;
  color: #e4f2ff;

  ${respondTo("lg")} {
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: 0.01em;
  }
`
export const DirectionIconWrp = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #222b42;
  border-radius: 20px;
`
export const DirectionIcon = styled(Icon)`
  width: 32px;
  height: 32px;
  color: #6781bd;
`
export const Direction = styled.span<{ isBuy?: boolean }>`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  letter-spacing: 0.03em;
  color: ${(props) => (props.isBuy ? "#9AE2CB" : "#DB6D6D")};

  ${respondTo("lg")} {
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: 0.01em;
  }
`
export const ExternalLinkIcon = styled(Icon)`
  width: 12px;
  height: 12px;
  margin-left: 3px;
  transform: translateY(2px);

  ${respondTo("lg")} {
    width: 1em;
    height: 1em;
    margin-left: 4px;
    color: ${(props) => props.theme.textColors.primary};
  }
`
