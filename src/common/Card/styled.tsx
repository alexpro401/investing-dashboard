import styled from "styled-components/macro"

import { respondTo } from "theme"

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.backgroundColors.secondary};
  border-radius: 20px;
  padding: 16px;
  gap: 12px;

  ${respondTo("sm")} {
    padding: 24px;
  }
`

export const CardHead = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.textColors.primary};
`

export const CardHeadTitle = styled.span`
  font-size: 16px;
  line-height: 1.2;
  font-weight: 700;
  margin: 0;
  vertical-align: middle;
`

export const NodeLeft = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const NodeRight = styled.div`
  margin-left: auto;
`

export const CardDescription = styled.div`
  font-size: 12px;
  line-height: 1.5;
  font-weight: 400;
  color: ${(props) => props.theme.textColors.secondary};
`

export const CardFormControl = styled.div`
  display: grid;
  grid-gap: 24px;
  padding: 16px 0;
`
