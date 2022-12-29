import * as S from "./styled"
import * as React from "react"
import { useGovPool } from "hooks/dao"
import { ProposalState, ProposalStatuses } from "types"
import DaoProposalsList from "common/dao/DaoProposalsList"
import usePayload from "hooks/usePayload"
import { SubmitState } from "consts/types"

interface Props {
  daoAddress?: string
  status: ProposalStatuses
}

const ClaimList: React.FC<Props> = ({ daoAddress, status }) => {
  const [, setPayload] = usePayload()
  const { claimRewards } = useGovPool(daoAddress)
  const [executingClaim, setExecutingClaim] = React.useState(false)

  const onClaimRewards = React.useCallback(
    async (proposals, callback) => {
      if (proposals.length > 0) {
        setExecutingClaim(true)
        setPayload(SubmitState.SIGN)
        const proposalsId = proposals
          .filter((p) => String(p.proposalState) === ProposalState.Executed)
          .map((p) => String(p.proposalId))
        await claimRewards(proposalsId)
        setPayload(SubmitState.WAIT_CONFIRM)
        await callback()
        setExecutingClaim(false)
        setPayload(SubmitState.SUCCESS)
      }
    },
    [claimRewards]
  )

  return (
    <>
      <S.List>
        <DaoProposalsList govPoolAddress={daoAddress} status={status}>
          {({ proposalsViewsToShow, loadProposals }) =>
            proposalsViewsToShow.length > 0 ? (
              <S.ActionContainer>
                <S.AppButtonFull
                  onClick={() =>
                    onClaimRewards(proposalsViewsToShow, loadProposals)
                  }
                  disabled={executingClaim}
                  text={"Claim rewards"}
                />
              </S.ActionContainer>
            ) : (
              <></>
            )
          }
        </DaoProposalsList>
      </S.List>
    </>
  )
}

export default ClaimList
