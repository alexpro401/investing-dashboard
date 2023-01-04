import styled from "styled-components/macro"
import NoDataMessage from "common/NoDataMessage"
import { respondTo } from "../../../theme"

export const Root = styled.div`
  overflow: hidden auto;
  flex: 1;
`

export const DaoProposalsListBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  margin: 16px 0 0;

  ${respondTo("sm")} {
    padding: 0;
  }
`

export const EmptyMessage = styled(NoDataMessage)`
  height: 70%;
`
