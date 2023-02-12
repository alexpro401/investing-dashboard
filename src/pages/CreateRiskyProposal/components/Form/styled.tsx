import { Card } from "common"
import styled from "styled-components"
import theme, { Flex, respondTo } from "theme"

export const Container = styled(Flex)`
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  max-width: 420px;
  width: 100%;
  height: fill-available;

  background: none;
  border-radius: 20px;

  ${respondTo("sm")} {
    height: 560px;
    background: ${theme.backgroundColors.secondary};
  }
`

export const Description = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 170%;
  letter-spacing: 0.01em;
  color: #b1c7fc;
`

export const MobileCard = styled(Card)`
  width: 100%;
  padding: 16px 0 0;
  background: none;
`

export const NodeText = styled.div`
  display: flex;
  gap: 4px;
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #788ab4;
`
