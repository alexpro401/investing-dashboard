import styled from "styled-components"
import { Flex } from "theme"

export const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
`

export const List = styled.div<{ withExtraTabs?: boolean }>`
  width: 100%;
  height: fill-content;
  height: ${(props) =>
    props.withExtraTabs ? "calc(100vh - 174px)" : "calc(100vh - 128px)"};
  padding: 16px;
  position: relative;
  overflow-y: auto;

  @media all and (display-mode: standalone) {
    height: ${(props) =>
      props.withExtraTabs ? "calc(100vh - 197px)" : "calc(100vh - 149px)"};
  }
`

export const LoaderContainer = styled(Flex)`
  width: 100%;
  height: inherit;
  align-items: center;
  justify-content: center;
`
