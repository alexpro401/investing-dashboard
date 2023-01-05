import styled from "styled-components/macro"
import { Card } from "common"
import { respondTo } from "theme"

export const TableCard = styled(Card)`
  ${respondTo("sm")} {
    padding: 0;
  }
`
