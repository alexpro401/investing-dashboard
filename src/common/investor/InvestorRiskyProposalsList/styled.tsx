import styled from "styled-components/macro"
import { respondTo } from "theme"
export const InvestorRiskyProposalsListWrp = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1 0 auto;

  ${respondTo("lg")} {
    gap: 16px;
  }
`
