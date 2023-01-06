import styled from "styled-components/macro"
import NoDataMessage from "common/NoDataMessage"

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden auto;
  flex: 1;
  gap: var(--app-gap);
`

export const DaoProposalsListBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap);
`

export const EmptyMessage = styled(NoDataMessage)`
  height: 70%;
  padding: 0;
`
