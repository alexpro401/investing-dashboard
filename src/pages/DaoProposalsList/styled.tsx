import styled from "styled-components"

export const DaoProposalsListBody = styled.div`
  overflow: hidden auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  flex: 1;
  height: calc(100vh - 94px);
  @media all and (display-mode: standalone) {
    height: calc(100vh - 115px);
  }
`
