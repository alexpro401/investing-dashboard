import * as React from "react"
import * as S from "../styled"
import theme, { Flex, Text } from "theme"
import Icon from "components/Icon"
import TokenIcon from "components/TokenIcon"
import { usePoolContract } from "hooks/usePool"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { useERC20Data } from "state/erc20/hooks"

interface Props {
  name: string
  pool?: string
}

const GovProposalCardHeadInsurance: React.FC<Props> = ({ pool }) => {
  const [, poolInfo] = usePoolContract(pool)
  const [{ poolMetadata }] = usePoolMetadata(
    pool,
    poolInfo?.parameters.descriptionURL
  )
  const [baseToken] = useERC20Data(poolInfo?.parameters.baseToken)

  return (
    <S.Content>
      <Flex gap="4" ai="center">
        <Icon
          m="0"
          size={19}
          source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
          address={pool ?? ""}
        />
        <Text fz={16} fw={600} lh="19px" color={theme.textColors.primary}>
          {poolInfo?.ticker ?? ""}
        </Text>
        <Text fz={16} fw={500} lh="19px" color={theme.textColors.secondary}>
          {poolInfo?.name ?? ""}
        </Text>
      </Flex>
      <Flex gap="4" ai="center">
        <Text fz={16} fw={600} lh="19px" color={theme.textColors.primary}>
          {baseToken?.symbol}
        </Text>
        <TokenIcon address={baseToken?.address ?? ""} m="0" size={19} />
      </Flex>
    </S.Content>
  )
}

export default GovProposalCardHeadInsurance
