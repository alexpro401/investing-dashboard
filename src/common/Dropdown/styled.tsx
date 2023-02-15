import styled, { css } from "styled-components/macro"
import { Collapse } from "common"

export const DropdownRoot = styled.div`
  position: relative;
  z-index: 20;
`

export const DropdownHeading = styled.button`
  display: block;
  background: none;
  border: none;
`

export const DropdownBody = styled(Collapse)<{ position: "left" | "right" }>`
  position: absolute;
  top: 110%;
  width: max-content;

  ${(props) =>
    props.position === "left"
      ? css`
          left: 0;
        `
      : ""}

  ${(props) =>
    props.position === "right"
      ? css`
          right: 0;
        `
      : ""}
`
