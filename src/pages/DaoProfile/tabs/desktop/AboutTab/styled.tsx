import styled from "styled-components/macro"
import { respondTo } from "theme"

export const ChartTreasuryWrp = styled.div`
  display: grid;
  gap: 24px;
  grid-template-rows: max-content 1fr;
  grid-template-columns: minmax(0, 1fr) 350px;
  width: 100%;

  ${respondTo("lg")} {
    grid-template-columns: minmax(0, 1fr) 450px;
  }
`

export const ChartSection = styled.div`
  width: 100%;
`

export const TreasurySection = styled.div``
