import styled from "styled-components"
import NoDataMessage from "common/NoDataMessage"

export const Root = styled.div`
  overflow: hidden auto;
  flex: 1;
  @media all and (display-mode: standalone) {
    height: calc(100vh - 115px);
  }
`

export const DaoProposalsListBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
`

export const EmptyMessage = styled(NoDataMessage)`
  height: 70%;
`
