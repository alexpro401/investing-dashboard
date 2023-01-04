import * as S from "./styled"

import { isNil } from "lodash"
import * as React from "react"
import { v4 as uuidv4 } from "uuid"

import { Flex } from "theme"
import Icon from "components/Icon"
import Tooltip from "components/Tooltip"

import { useERC20Data } from "state/erc20/hooks"
import { useGovPoolHelperContracts } from "hooks"
import { isAddressZero, normalizeBigNumber } from "utils"
import { useDaoPoolMetadata } from "state/ipfsMetadata/hooks"
import { IGovPoolQuery } from "interfaces/thegraphs/gov-pools"
import useGovPoolStatistic from "hooks/dao/useGovPoolStatistic"
import useGovPoolUserVotingPower from "hooks/dao/useGovPoolUserVotingPower"
import { ZERO } from "../../consts"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  data: IGovPoolQuery
  account?: string | null
  children?: React.ReactNode
  isMobile: boolean
}

const DaoPoolCard: React.FC<Props> = ({
  data,
  account,
  children,
  isMobile,
  ...rest
}) => {
  const id = React.useMemo(() => data?.id ?? "", [data])

  const [token] = useERC20Data(
    !isAddressZero(data?.erc20Token) ? data.erc20Token : undefined
  )

  const [{ daoPoolMetadata }] = useDaoPoolMetadata(id)
  const [govPoolStatistic] = useGovPoolStatistic(data)

  const poolName = React.useMemo(() => {
    if (isNil(data)) return ""

    return String(data.name).length > 20
      ? String(data.name).slice(0, 18) + "..."
      : data.name ?? ""
  }, [data])

  const poolAssets = React.useMemo(() => {
    const { erc20Token, erc721Token } = data
    const haveToken = !isAddressZero(erc20Token)
    const haveNft = !isAddressZero(erc721Token)

    let subTitle = ""

    if (!haveToken && !haveNft) return subTitle

    if (haveToken) {
      subTitle = `${token?.symbol ?? ""} `
    }
    if (haveNft) {
      if (subTitle.length > 0) {
        subTitle += "& "
      }
      subTitle += "NFT"
    }

    return subTitle
  }, [data.erc20Token, data.erc721Token, token])

  return (
    <S.DaoPoolCardRoot {...rest}>
      <S.DaoPoolCardHeader>
        <Flex ai="center" jc="flex-start">
          <Icon
            size={isMobile ? 38 : 100}
            m="0 8px 0 0"
            address={data?.id}
            source={daoPoolMetadata?.avatarUrl ?? ""}
          />
          <Flex dir="column" ai="flex-start" gap="4">
            <S.DaoPoolCardTitle>{poolName}</S.DaoPoolCardTitle>
            <S.DaoPoolCardDescription align="left">
              {poolAssets}
            </S.DaoPoolCardDescription>
          </Flex>
        </Flex>
        <Flex ai="flex-end" jc="flex-start" dir="column" gap="4">
          <Flex
            ai="flex-end"
            jc="flex-start"
            dir={isMobile ? "column" : "column-reverse"}
            gap="4"
          >
            <S.DaoPoolCardVotingPower>
              {normalizeBigNumber(ZERO, 18, 2)}
            </S.DaoPoolCardVotingPower>
            <S.DaoPoolCardDescription>
              {isMobile ? "My voting power" : "My power"}
            </S.DaoPoolCardDescription>
          </Flex>
        </Flex>
      </S.DaoPoolCardHeader>
      <S.DaoPoolCardStatisticWrp>
        <S.DaoPoolCardStatisticItem alignItems={"flex-start"}>
          <Flex gap={"4"}>
            <S.DaoPoolCardStatisticLabel>TVL</S.DaoPoolCardStatisticLabel>
            <Tooltip id={uuidv4()}>Info about TVL</Tooltip>
          </Flex>
          <S.DaoPoolCardStatisticValue>
            ${normalizeBigNumber(govPoolStatistic.tvl.value, 18, 2)}
          </S.DaoPoolCardStatisticValue>
        </S.DaoPoolCardStatisticItem>
        <S.DaoPoolCardStatisticItem alignItems={"flex-start"}>
          <Flex gap={"4"}>
            <S.DaoPoolCardStatisticLabel>MC/TVL</S.DaoPoolCardStatisticLabel>
            <Tooltip id={uuidv4()}>Info about MC/TVL</Tooltip>
          </Flex>
          <S.DaoPoolCardStatisticValue>
            ${normalizeBigNumber(govPoolStatistic.mc_tvl.value, 18, 2)}
          </S.DaoPoolCardStatisticValue>
        </S.DaoPoolCardStatisticItem>
        <S.DaoPoolCardStatisticItem alignItems={"flex-start"}>
          <Flex gap={"4"}>
            <S.DaoPoolCardStatisticLabel>Members</S.DaoPoolCardStatisticLabel>
            <Tooltip id={uuidv4()}>Info about Members</Tooltip>
          </Flex>
          <S.DaoPoolCardStatisticValue>
            {String(govPoolStatistic.members.value ?? 0)}
          </S.DaoPoolCardStatisticValue>
        </S.DaoPoolCardStatisticItem>
        <S.DaoPoolCardStatisticItem alignItems={"flex-end"}>
          <Flex gap={"4"}>
            <S.DaoPoolCardStatisticLabel>LAU</S.DaoPoolCardStatisticLabel>
            <Tooltip id={uuidv4()}>Info about LAU</Tooltip>
          </Flex>
          <S.DaoPoolCardStatisticValue>
            {normalizeBigNumber(govPoolStatistic.lau.value, 18, 0)}
          </S.DaoPoolCardStatisticValue>
        </S.DaoPoolCardStatisticItem>
      </S.DaoPoolCardStatisticWrp>
      {children}
    </S.DaoPoolCardRoot>
  )
}

export default DaoPoolCard
