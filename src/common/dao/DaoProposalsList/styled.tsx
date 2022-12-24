import styled from "styled-components/macro"
import NoDataMessage from "common/NoDataMessage"

export const Root = styled.div`
  overflow: hidden auto;
  flex: 1;
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
