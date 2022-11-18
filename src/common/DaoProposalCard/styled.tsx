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
  align-items: ${(props) => (props.alignRight ? "flex-end" : "flex-start")};
  gap: 4px;
`

export const DaoProposalCardBlockInfoLabel = styled.span`
  color: ${(props) => props.theme.textColors.secondary};
  font-weight: 400;
  font-size: 13px;
  line-height: 15px;
`

export const DaoProposalCardBlockInfoValue = styled.span`
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  color: ${(props) => props.theme.textColors.primary};
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

export const DaoVotingProgressBar = styled.div<{
  progress: number
}>`
  position: relative;
  grid-column: 1 / -1;
  background: #293c54;
  height: 3px;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${(props) => `${props.progress}%`};
    background: linear-gradient(65.03deg, #a4ebd4 12.07%, #63b49b 78.73%);
    box-shadow: 0px 1px 4px rgba(164, 235, 212, 0.29),
      0px 2px 5px rgba(164, 235, 212, 0.14);
  }
`

export const DaoCenteredButton = styled(AppButton)`
  grid-column: 1 / -1;
  width: 100%;
`
