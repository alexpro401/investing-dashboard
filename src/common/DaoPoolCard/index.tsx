import { v4 as uuidv4 } from "uuid"
import * as React from "react"
import * as S from "./styled"

import { Flex } from "theme"
import Icon from "components/Icon"
import Tooltip from "components/Tooltip"
import { normalizeBigNumber } from "utils"
import { IGovPoolQuery } from "interfaces/thegraphs/gov-pools"
import useGovPoolIpfsData from "hooks/dao/useGovPoolIpfsData"
import useGovPoolStatistic from "hooks/dao/useGovPoolStatistic"
import useGovPoolVotingAssets from "hooks/dao/useGovPoolVotingAssets"
import useGovPoolUserVotingPower from "hooks/dao/useGovPoolUserVotingPower"
import { isNil } from "lodash"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  data: IGovPoolQuery
  account?: string | null
  index?: number
  children?: React.ReactNode
}

const DaoPoolCard: React.FC<Props> = ({
  data,
  account,
  index = 0,
  children,
  ...rest
}) => {
  const id = React.useMemo(() => data?.id ?? "", [data])

  const [ipfs] = useGovPoolIpfsData(id)
  const [assetsExisting, assets] = useGovPoolVotingAssets(id)
  const [{ tvl, mc_tvl, members, lau }] = useGovPoolStatistic(data)
  const [userVotingPower] = useGovPoolUserVotingPower({
    daoAddress: id,
    address: account,
  })

  const poolName = React.useMemo(() => {
    if (isNil(data)) return ""

    return String(data.name).length > 20
      ? String(data.name).slice(0, 18) + "..."
      : data.name ?? ""
  }, [data])

  const poolAssets = React.useMemo(() => {
    let subTitle = " "

    if (assetsExisting.haveToken) {
      subTitle = `${assets.token?.symbol} `
    }
    if (assetsExisting.haveNft) {
      if (subTitle.length === 0) {
        subTitle += "& "
      }
      subTitle += "NFT"
    }

    return subTitle
  }, [assetsExisting, assets])

  return (
    <S.Animation index={index}>
      <S.Root {...rest}>
        <S.DaoPoolCardHead>
          <Flex ai="center" jc="flex-start">
            <Icon
              size={38}
              m="0 8px 0 0"
              address={data?.id}
              source={ipfs?.avatarUrl ?? ""}
            />
            <Flex dir="column" ai="flex-start" gap="4">
              <S.DaoPoolCardTitle>{poolName}</S.DaoPoolCardTitle>
              <S.DaoPoolCardDescription align="left">
                {poolAssets}
              </S.DaoPoolCardDescription>
            </Flex>
          </Flex>
          <Flex ai="flex-end" jc="flex-start" dir="column" gap="4">
            <S.DaoPoolCardVotingPower>
              {normalizeBigNumber(userVotingPower.power, 18, 0)}
            </S.DaoPoolCardVotingPower>
            <S.DaoPoolCardDescription>My voting power</S.DaoPoolCardDescription>
          </Flex>
        </S.DaoPoolCardHead>
        <S.DaoPoolCardDivider />
        <Flex full ai={"center"} jc={"space-between"} p={"12px"} gap={"10"}>
          <Flex full dir={"column"} gap={"4"} ai={"flex-start"}>
            <Flex full ai={"center"} jc={"flex-start"} gap={"4"}>
              <S.DaoPoolCardBlockInfoLabel>TVL</S.DaoPoolCardBlockInfoLabel>
              <Tooltip id={uuidv4()}>Info about TVL</Tooltip>
            </Flex>
            <S.DaoPoolCardBlockInfoValue>
              ${normalizeBigNumber(tvl.value, 18, 2)}
            </S.DaoPoolCardBlockInfoValue>
          </Flex>
          <Flex full dir={"column"} gap={"4"} ai={"flex-start"}>
            <Flex full ai={"center"} jc={"flex-start"} gap={"4"}>
              <S.DaoPoolCardBlockInfoLabel>MC/TVL</S.DaoPoolCardBlockInfoLabel>
              <Tooltip id={uuidv4()}>Info about MC/TVL</Tooltip>
            </Flex>
            <S.DaoPoolCardBlockInfoValue>
              {normalizeBigNumber(mc_tvl.value, 18, 2)}
            </S.DaoPoolCardBlockInfoValue>
          </Flex>
          <Flex full dir={"column"} gap={"4"} ai={"flex-start"}>
            <Flex full ai={"center"} jc={"flex-start"} gap={"4"}>
              <S.DaoPoolCardBlockInfoLabel>Members</S.DaoPoolCardBlockInfoLabel>
              <Tooltip id={uuidv4()}>Info about Members</Tooltip>
            </Flex>
            <S.DaoPoolCardBlockInfoValue>
              {String(members.value)}
            </S.DaoPoolCardBlockInfoValue>
          </Flex>
          <Flex full dir={"column"} gap={"4"} ai={"flex-end"}>
            <Flex full ai={"center"} jc={"flex-end"} gap={"4"}>
              <S.DaoPoolCardBlockInfoLabel>LAU</S.DaoPoolCardBlockInfoLabel>
              <Tooltip id={uuidv4()}>Info about LAU</Tooltip>
            </Flex>
            <S.DaoPoolCardBlockInfoValue>
              {normalizeBigNumber(lau.value, 18, 0)}
            </S.DaoPoolCardBlockInfoValue>
          </Flex>
        </Flex>
        {children}
      </S.Root>
    </S.Animation>
  )
}

export default React.memo(DaoPoolCard)
