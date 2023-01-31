import * as S from "../styled"
import React, { useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import { Web3ReactContextInterface } from "@web3-react/core/dist/types"

import { Flex, Text } from "theme"
import { Icon, DaoPoolCard } from "common"
import Tooltip from "components/Tooltip"
import ChooseDaoProposalAsPerson from "modals/ChooseDaoProposalAsPerson"
import { ICON_NAMES } from "consts/icon-names"
import { IGovPoolQuery } from "interfaces/thegraphs/gov-pools"
import { GovPoolProfileCommonContext } from "context/govPool/GovPoolProfileCommonContext/GovPoolProfileCommonContext"
import { formatTokenNumber } from "utils"

import {
  useBreakpoints,
  useGovPoolHelperContracts,
  useGovPoolUserVotingPower,
} from "hooks"
import { addBignumbers } from "utils/formulas"
import { ZERO } from "consts"
import { useDaoPoolMetadata } from "state/ipfsMetadata/hooks"

interface Props extends Pick<Web3ReactContextInterface, "account"> {
  isValidator: boolean
  govPoolQuery: IGovPoolQuery
}

const DaoProfileStatisticCard: React.FC<Props> = ({
  isValidator,
  account,
  govPoolQuery,
}) => {
  const { isMobile } = useBreakpoints()
  const { daoAddress } = useParams()

  const { validatorsToken, validatorsTotalVotes } = React.useContext(
    GovPoolProfileCommonContext
  )

  const [createProposalModalOpened, setCreateProposalModalOpened] =
    useState<boolean>(false)

  const handleOpenCreateProposalModal = useCallback(() => {
    setCreateProposalModalOpened(true)
  }, [])

  const handleCloseCreateProposalModal = useCallback(() => {
    setCreateProposalModalOpened(false)
  }, [])

  const [{ daoPoolMetadata }] = useDaoPoolMetadata(govPoolQuery?.id)
  const { govUserKeeperAddress } = useGovPoolHelperContracts(govPoolQuery?.id)
  const [userVotingPowers] = useGovPoolUserVotingPower({
    userKeeperAddress: govUserKeeperAddress,
    address: account,
  })

  const totalUserVotingPower = React.useMemo(() => {
    if (!userVotingPowers) return ZERO

    return addBignumbers(
      [userVotingPowers.power, 18],
      [userVotingPowers.nftPower, 18]
    )
  }, [userVotingPowers])

  return (
    <>
      <DaoPoolCard
        data={govPoolQuery}
        totalVotingPower={totalUserVotingPower}
        metadata={daoPoolMetadata}
      >
        <Flex full dir={"column"} gap={"12"}>
          <S.CardButtons>
            <S.NewProposal onClick={handleOpenCreateProposalModal} />
            <S.AllProposals
              routePath={`/dao/${govPoolQuery?.id}/proposals/opened`}
            />
          </S.CardButtons>
          {isValidator && (
            <>
              {isMobile && <S.Divider />}
              <Flex full ai="center" jc="space-between">
                <Flex full ai="center" jc="flex-start" gap="4">
                  <Text color="#B1C7FC" fz={13}>
                    Validator voting power
                  </Text>
                  <Tooltip id={uuidv4()}>Validator voting power</Tooltip>
                </Flex>

                {validatorsToken && validatorsTotalVotes && (
                  <Flex full ai="center" jc="flex-end" gap="4">
                    <Icon name={ICON_NAMES.flameGradient} />
                    <S.ValidatorVotingPower>
                      {formatTokenNumber(
                        validatorsTotalVotes,
                        validatorsToken.decimals
                      )}{" "}
                      {validatorsToken.symbol}
                    </S.ValidatorVotingPower>
                  </Flex>
                )}
              </Flex>
            </>
          )}
        </Flex>
      </DaoPoolCard>
      <ChooseDaoProposalAsPerson
        isOpen={createProposalModalOpened}
        daoAddress={daoAddress ?? ""}
        toggle={handleCloseCreateProposalModal}
      />
    </>
  )
}

export default DaoProfileStatisticCard
