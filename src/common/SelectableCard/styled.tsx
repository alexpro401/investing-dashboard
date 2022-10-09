import styled, { css } from "styled-components"
import { Card, CardDescription, CardHead } from "common"

export const Root = styled(Card)<{
  isActive: boolean
  isNodeLeftExist: boolean
}>`
  ${(props) => {
    return props.isNodeLeftExist
      ? css`
          display: grid;
          align-items: center;
          grid-template-columns: max-content 1fr;
        `
      : css`
          display: flex;
          flex-direction: column;
        `
  }}
  position: relative;
  border: 1px solid
    ${(props) =>
      props.isActive ? props.theme.statusColors.success : "transparent"};
`

export const SelectableCardHead = styled.div``

export const NodeLeft = styled.div``

export const SelectableCardTitles = styled(CardHead)`
  grid-column: 2 / 3;
`

export const SelectableCardDescription = styled(CardDescription)`
  grid-column: 2 / 3;
`

export const SelectableCardBody = styled.div`
  grid-column: 2 / 3;
`

export const SelectableCardButton = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
`
