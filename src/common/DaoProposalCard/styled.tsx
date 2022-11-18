import styled from "styled-components"
import ExternalLink from "components/ExternalLink"
import { AppButton } from "common"

export const Root = styled.div`
  background: ${(props) => props.theme.backgroundColors.secondary};
  border-radius: 20px;
  color: ${(props) => props.theme.textColors.primary};
`

export const DaoProposalCardBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 16px;
  grid-gap: 16px;
`

export const DaoProposalCardBlockInfoAddress = styled(ExternalLink)`
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  color: ${(props) => props.theme.textColors.primary};
`

export const DaoVotingStatusCounterTotal = styled.span`
  font: inherit;
  color: #b1c7fc;
`

export const DaoVotingProgressBar = styled.div`
  position: relative;
  grid-column: 1 / -1;
`

export const DaoCenteredButton = styled(AppButton)`
  grid-column: 1 / -1;
  width: 100%;
`
