import { useContext } from "react"
import { v4 as uuidv4 } from "uuid"
import { Web3ReactContextInterface } from "@web3-react/core/dist/types"

import { Icon } from "common"
import { Flex, Text } from "theme"
import Tooltip from "components/Tooltip"
import { ICON_NAMES } from "constants/icon-names"
import { DaoPoolCard } from "common"
import { IGovPoolQuery } from "interfaces/thegraphs/gov-pools"
import { GovPoolProfileCommonContext } from "context/govPool/GovPoolProfileCommonContext/GovPoolProfileCommonContext"
import { formatTokenNumber } from "utils"

import * as S from "../styled"

interface Props extends Pick<Web3ReactContextInterface, "account"> {
  isValidator: boolean
  handleOpenCreateProposalModal: () => void
  govPoolQuery: IGovPoolQuery
  isMobile: boolean
}

const DaoProfileStatisticCard: React.FC<Props> = ({
  isValidator,
  handleOpenCreateProposalModal,
  account,
  govPoolQuery,
  isMobile,
}) => {
  const { validatorsToken, validatorsTotalVotes } = useContext(
    GovPoolProfileCommonContext
  )

  return (
    <DaoPoolCard account={account} data={govPoolQuery} isMobile={isMobile}>
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
  )
}

export default DaoProfileStatisticCard
