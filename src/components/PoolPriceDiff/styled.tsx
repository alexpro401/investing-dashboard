import styled from "styled-components"

export const Root = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  position: relative;

  &::before {
    content: "";
    height: 0px;
    border: 1px dashed #788ab4;

    position: absolute;
    left: 0;
    right: 0;
    top: calc(50% - 1px);
    transform: translateY(-50%);
    z-index: -1;
  }
`
