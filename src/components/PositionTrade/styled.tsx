import styled from "styled-components/macro"
import { Flex, respondTo } from "theme"
import { Icon } from "common"

export const Container = styled.a`
  display: block;
  width: 100%;
  text-decoration: none;
  color: initial;

  &:not(:first-child) {
    border-top: 1px solid #1d2635;
  }
`
export const Content = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 0.25fr 0.25fr;
  gap: 18px;
  width: 100%;
  padding: 12px 15px;

  ${respondTo("lg")} {
    display: flex;
    flex-direction: row;

    & > * {
      flex: 1 0 155px;
    }
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
    width: initial;
    flex: 1 0 155px;
    max-width: 160px;
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
export const ExternalLinkIcon = styled.img`
  width: 12px;
  height: 12px;
  margin-left: 3px;
  transform: translateY(2px);
`
