import { Icon } from "common"
import * as S from "../styled"
import Button, { SecondaryButton } from "components/Button"
import { Flex, Text } from "theme"
import Tooltip from "components/Tooltip"
import { v4 as uuidv4 } from "uuid"
import { ICON_NAMES } from "constants/icon-names"
import GovPoolStatisticCard from "components/cards/GovPoolStatistic"

const DaoProfileStatisticCard = ({
  isValidator,
  handleOpenCreateProposalModal,
}) => {
  return (
    <GovPoolStatisticCard>
      <>
        <S.CardButtons>
          <SecondaryButton full fz={14} onClick={handleOpenCreateProposalModal}>
            + New Proposal
          </SecondaryButton>
          <Button
            full
            fz={14}
            onClick={() => alert("Redirect to all proposals")}
          >
            All proposals
          </Button>
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
      </>
    </GovPoolStatisticCard>
  )
}

export default DaoProfileStatisticCard
