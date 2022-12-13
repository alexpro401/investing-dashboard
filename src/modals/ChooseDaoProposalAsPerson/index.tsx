import React, { useCallback } from "react"
import { useNavigate } from "react-router-dom"

import Modal from "components/Modal"
import useIsValidator from "hooks/useIsValidator"
import { useActiveWeb3React } from "hooks"
import { ICON_NAMES } from "constants/icon-names"
import Skeleton from "components/Skeleton"

import * as S from "./styled"

interface IChooseProposalAsPersonProps {
  isOpen: boolean
  daoAddress: string
  toggle: () => void
}

const ChooseDaoProposalAsPerson: React.FC<IChooseProposalAsPersonProps> = ({
  isOpen,
  daoAddress,
  toggle,
}) => {
  const navigate = useNavigate()
  const { account } = useActiveWeb3React()
  const [isUserValidator, isUserValidatorLoading] = useIsValidator({
    daoAddress,
    userAddress: account ?? "",
  })

  const handleGoToGeneralProposals = useCallback(() => {
    navigate(`/dao/${daoAddress}/create-proposal`)
  }, [navigate, daoAddress])

  const handleGoToValidatorProposals = useCallback(() => {
    if (!isUserValidator) return

    navigate(`/dao/${daoAddress}/create-validator-proposal`)
  }, [navigate, isUserValidator, daoAddress])

  return (
    <Modal isOpen={isOpen} title="Create proposal as a:" toggle={toggle}>
      <S.PersonProposalList>
        <S.PersonProposal onClick={handleGoToGeneralProposals}>
          <S.ProposalTopbar>
            <S.ProposalIcon name={ICON_NAMES.usersGroup} />
            <S.ProposalTitle>DAO general member</S.ProposalTitle>
          </S.ProposalTopbar>
          <S.ProposalText>
            Any proposal except validator-only ones.
          </S.ProposalText>
        </S.PersonProposal>
        {isUserValidatorLoading && (
          <Skeleton variant={"rect"} w={"100%"} h={"80px"} />
        )}
        {!isUserValidatorLoading && isUserValidator && (
          <S.PersonProposal onClick={handleGoToValidatorProposals}>
            <S.ProposalTopbar>
              <S.ProposalIcon name={ICON_NAMES.user} />
              <S.ProposalTitle>DAO validator</S.ProposalTitle>
            </S.ProposalTopbar>
            <S.ProposalText>
              Proposals for the validators to vote on.
            </S.ProposalText>
          </S.PersonProposal>
        )}
      </S.PersonProposalList>
    </Modal>
  )
}

export default ChooseDaoProposalAsPerson
