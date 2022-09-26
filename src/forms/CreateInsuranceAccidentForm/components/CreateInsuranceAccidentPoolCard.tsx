import React, { FC, useMemo } from "react"
import { format } from "date-fns"
import { BigNumber } from "@ethersproject/bignumber"

import { Flex, Text } from "theme"
import Icon from "components/Icon"
import Skeleton from "components/Skeleton"
import TokenIcon from "components/TokenIcon"
import { CreateInsuranceAccidentPoolsStyled as CIAPools } from "forms/CreateInsuranceAccidentForm/styled"

import { DATE_FORMAT } from "constants/time"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { expandTimestamp, normalizeBigNumber } from "utils"

type Pool = any

interface Props {
  pool: Pool | null
  onToggle: () => void
  active: boolean
}

const CreateInsuranceAccidentPoolCard: FC<Props> = ({
  pool,
  onToggle,
  active,
}) => {
  const [{ poolMetadata }] = usePoolMetadata(pool?.id, pool?.descriptionURL)

  const image = useMemo(() => {
    if (pool === null) {
      return <Skeleton variant="circle" h="40px" w="40px" />
    }

    return (
      <CIAPools.CardIcons>
        <Icon
          size={40}
          source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
          address={pool.id}
        />
        <CIAPools.CardTokenIconWrp>
          <TokenIcon address={pool?.baseToken} size={20} />
        </CIAPools.CardTokenIconWrp>
      </CIAPools.CardIcons>
    )
  }, [pool])

  const ticker = useMemo(() => {
    if (pool === null) {
      return <Skeleton h="20px" w="85px" />
    }

    return pool.ticker
  }, [pool])

  const nameLong = useMemo(() => {
    if (pool === null) {
      return <Skeleton h="16px" w="75px" />
    }

    return pool.name
  }, [pool])

  const tvl = useMemo(() => {
    if (pool === null) {
      return <Skeleton h="20px" w="85px" />
    }

    if (pool.priceHistory.length === 0) {
      return `$0`
    }

    const result = normalizeBigNumber(
      BigNumber.from(pool.priceHistory[0].usdTVL),
      18,
      2
    )

    return `$${result}`
  }, [pool])

  const creationDate = useMemo(() => {
    if (pool === null) {
      return <Skeleton h="16px" w="120px" />
    }

    return format(expandTimestamp(pool.creationTime), DATE_FORMAT)
  }, [pool])

  return (
    <CIAPools.Card onClick={onToggle} active={active}>
      <CIAPools.CardContent>
        <Flex ai="center" jc="space-between" gap="12" full>
          <Flex ai="center" jc="flex-start" gap="8" full>
            {image}
            <div>
              <Text block fw={600} fz={16} color="#E4F2FF">
                {ticker}
              </Text>
              <Text block p="4px 0 0" fz={13} color="#B1C7FC">
                {nameLong}
              </Text>
            </div>
          </Flex>
          <div style={{ flex: "0 0 auto" }}>
            <Text block align="right" fw={600} fz={16} color="#E4F2FF">
              {tvl}
            </Text>
            <Text block align="right" p="4px 0 0" fz={13} color="#B1C7FC">
              {creationDate}
            </Text>
          </div>
        </Flex>
      </CIAPools.CardContent>
    </CIAPools.Card>
  )
}

export default CreateInsuranceAccidentPoolCard
