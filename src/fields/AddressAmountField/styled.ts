import styled from "styled-components"

export const Root = styled.div`
  position: relative;
`

export const InternalInput = styled.div`
  position: absolute;
  top: ${56 / 2}px;
  right: 0;
  transform: translateY(-50%);

  input {
    background: transparent;
    border: none;
  }
`
