import { Icon } from "common"
import * as S from "../styled"
import { AppButton } from "common"
import { Flex, Text } from "theme"
import Tooltip from "components/Tooltip"
import { v4 as uuidv4 } from "uuid"
import { ICON_NAMES } from "constants/icon-names"
import { DaoPoolCard } from "common"

const DaoProfileStatisticCard = ({
  isValidator,
  handleOpenCreateProposalModal,
  account,
  govPoolQuery,
}) => {
  return (
    <DaoPoolCard account={account} data={govPoolQuery}>
      <Flex full dir={"column"} p={"12px"} gap={"12"}>
        <S.CardButtons>
          <S.NewProposal onClick={handleOpenCreateProposalModal} />
          <S.AllProposals onClick={() => alert("Redirect to all proposals")} />
        </S.CardButtons>
        {isValidator && (
          <>
            <S.Divider />
            <Flex full ai="center" jc="space-between">
              <Flex full ai="center" jc="flex-start" gap="4">
                <Text color="#B1C7FC" fz={13}>
                  Validator voting power
                </Text>
                <Tooltip id={uuidv4()}>Validator voting power</Tooltip>
              </Flex>

              <Flex full ai="center" jc="flex-end" gap="4">
                <Icon name={ICON_NAMES.flameGradient} />
                <S.ValidatorVotingPower>1,000,000 PG</S.ValidatorVotingPower>
              </Flex>
            </Flex>
          </>
        )}
      </Flex>
    </DaoPoolCard>
  )
}

export default DaoProfileStatisticCard
