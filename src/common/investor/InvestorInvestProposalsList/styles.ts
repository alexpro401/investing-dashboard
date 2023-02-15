import styled from "styled-components/macro"
import { respondTo } from "theme"

export const PoolInvestProposalsListWrp = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap);

  ${respondTo("lg")} {
    gap: calc(var(--app-gap) / 2);
  }
`
