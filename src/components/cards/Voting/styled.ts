import { AppButton, Card } from "common"
import { Text } from "theme"
import styled from "styled-components"

export const Container = styled(Card)`
  padding: 0;
  gap: 0;
`

export const Head = styled.div`
  padding: 16px;
  border-bottom: 1px solid #20283a;
`

export const Body = styled.div`
  padding: 16px;
`

export const Title = styled(Text).attrs(() => ({
  fz: 13,
  lh: "15px",
  color: "#B1C7FC",
}))``

export const Value = styled(Text).attrs(() => ({
  fz: 16,
  lh: "19px",
  fw: 600,
  color: "#E4F2FF",
}))`
  & > span {
    color: #b1c7fc;
  }
`

export const VoteButton = styled(AppButton)`
  flex: 1 0 auto;
`
