import styled, { css } from "styled-components"

import { AppButton } from "common"
import { Flex } from "theme"

export const Container = styled.div`
  display: grid;
  grid-template-rows: max-content 1fr;
  grid-gap: 40px;
  overflow: hidden;
  padding: 16px 0 0;
  width: 100%;
  height: calc(100vh - 94px);

  @media all and (display-mode: standalone) {
    height: calc(100vh - 115px);
  }
`

export const Indents = styled.div`
  width: 100%;
  padding: 0 16px 0;
`

const centerGridItem = css`
  justify-content: center;
  align-content: center;
`

export const List = {
  Container: styled.div`
    display: grid;
    grid-template-rows: max-content 1fr;
    grid-gap: 16px;
    overflow: hidden;
  `,
  Header: styled(Flex).attrs(() => ({
    full: true,
    ai: "center",
    jc: "space-between",
  }))``,
  Action: styled(AppButton).attrs(() => ({
    color: "default",
    size: "small",
  }))`
    padding: 0;
  `,
  Scroll: styled.div<{ center: boolean }>`
    display: grid;
    grid-template-rows: max-content;
    grid-gap: 16px;
    overflow-y: auto;
    padding: 0 0 16px;

    ${({ center }) => (center ? centerGridItem : "")};
  `,
}
