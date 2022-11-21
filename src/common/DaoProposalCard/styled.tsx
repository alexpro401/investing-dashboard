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

export const DaoProposalCardBlockInfo = styled.div<{
  alignRight?: boolean
}>`
  display: flex;
  flex-direction: column;
  align-items: ${({ alignRight = false }) =>
    alignRight ? "flex-end" : "flex-start"};
  gap: 4px;
`
export const DaoProposalCardBlockInfoLabel = styled.span`
  color: ${(props) => props.theme.textColors.secondary};
  font-weight: 400;
  font-size: 13px;
  line-height: 15px;
`
export const DaoProposalCardBlockInfoValue = styled.span<{ success?: boolean }>`
  color: ${(props) =>
    props.success
      ? props.theme.brandColors.primary
      : props.theme.textColors.primary};
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
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
