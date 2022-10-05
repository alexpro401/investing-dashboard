import styled from "styled-components"
import { AppButton } from "common"

export const Container = styled.div`
  margin: 0 auto;
  width: fill-available;
  height: calc(100vh - 94px);
  overflow-y: auto;
  background-color: #0e121b;

  @media all and (display-mode: standalone) {
    height: calc(100vh - 115px);
  }
`

export const Content = styled.div`
  padding: 16px;
  width: inherit;
`

export const InsuranceCreateButton = styled(AppButton)`
  width: 100%;
`
