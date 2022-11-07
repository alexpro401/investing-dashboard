import { FC } from "react"

import { Flex, Text } from "theme"
import Icon from "components/Icon"
import TokenIcon from "components/TokenIcon"
import { usePoolContract } from "hooks/usePool"
import { useERC20Data } from "state/erc20/hooks"
import { InsuranceAccident } from "interfaces/insurance"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"

interface Props {
  payload: InsuranceAccident
}

const VotingCardInsuranceHead: FC<Props> = ({ payload }) => {
  const [, poolInfo] = usePoolContract(payload?.accidentInfo?.pool)
  const [{ poolMetadata }] = usePoolMetadata(
    payload?.accidentInfo?.pool,
    poolInfo?.parameters.descriptionURL
  )
  const [baseToken] = useERC20Data(poolInfo?.parameters.baseToken)

  return (
    <>
      <Flex full ai="center" jc="space-between">
        <Flex gap="4" ai="center">
          <Icon
            m="0"
            size={24}
            source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
            address={payload?.accidentInfo?.pool ?? ""}
          />
          <Text fz={16} fw={600} lh="19px" color="#E4F2FF">
            {poolInfo?.ticker ?? ""}
          </Text>
          <Text fz={16} fw={500} lh="19px" color="#B1C7FC">
            {poolInfo?.name ?? ""}
          </Text>
        </Flex>
        <Flex gap="4" ai="center">
          <Text fz={16} fw={600} lh="19px" color="#E4F2FF">
            {baseToken?.symbol}
          </Text>
          <TokenIcon address={baseToken?.address ?? ""} m="0" size={20} />
        </Flex>
      </Flex>
    </>
  )
}

export default VotingCardInsuranceHead
