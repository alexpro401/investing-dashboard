import { FC, useMemo } from "react"
import { BigNumber } from "@ethersproject/bignumber"
import { v4 as uuidv4 } from "uuid"

import { Flex } from "theme"
import { Card, Icon } from "common"
import { TextLabel, TextValue } from "../styled"

import Button from "components/Button"
import TokenIcon from "components/TokenIcon"
import ProgressLine from "components/ProgressLine"

import { normalizeBigNumber } from "utils"
import { ICON_NAMES } from "constants/icon-names"
import { percentageOfBignumbers } from "utils/formulas"

interface Props {
  total: BigNumber
  available: BigNumber
}

const DaoProfileBuyTokenCard: FC<Props> = ({ total, available }) => {
  const buyFullness = useMemo(() => {
    if (total.isZero() || available.isZero()) {
      return "0.0"
    }

    const resBN = percentageOfBignumbers(available, total)

    return normalizeBigNumber(resBN, 18, 3)
  }, [total, available])

  return (
    <Card>
      <Flex full ai="center" jc="space-between">
        <Flex
          full
          ai="center"
          jc="flex-start"
          gap={"8"}
          onClick={() => alert("Redirect to BscScan")}
        >
          <TokenIcon key={uuidv4()} address={""} size={38} m="0" />
          <Flex dir="column" ai="flex-start" gap="4">
            <Flex ai="center" jc="flex-start" gap="4">
              <TextValue fw={600}>111PG</TextValue>
              <Icon name={ICON_NAMES.externalLink} color={"#788AB4"} />
            </Flex>
            <TextLabel fw={500}>DAO token</TextLabel>
          </Flex>
        </Flex>
        <Flex dir="column" ai="flex-end" gap="4">
          <TextValue fw={600}>DEXE/CAKE/ETH</TextValue>
          <TextLabel fw={500}>buy with</TextLabel>
        </Flex>
      </Flex>
      <ProgressLine w={Number(buyFullness)} />
      <Flex full ai="center" jc="space-between">
        <Flex dir="column" ai="flex-start" gap="4">
          <TextValue fw={700}>50,000 111PG</TextValue>
          <TextLabel fw={400}>Total amount</TextLabel>
        </Flex>
        <Flex dir="column" ai="flex-end" gap="4">
          <TextValue fw={700}>10,000 111PG</TextValue>
          <TextLabel fw={400}>Available to buy</TextLabel>
        </Flex>
      </Flex>
      <Button
        full
        fz={13}
        onClick={() => alert("Redirect to 'Buy DAO token' terminal 🤑")}
      >
        Buy 111PG token
      </Button>
    </Card>
  )
}

export default DaoProfileBuyTokenCard
