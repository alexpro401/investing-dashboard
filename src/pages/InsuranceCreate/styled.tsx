import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0 auto;
  height: calc(100% - 50px);
  overflow: hidden;

  @media all and (display-mode: standalone) {
    height: calc(100% - 65px);
  }
`
