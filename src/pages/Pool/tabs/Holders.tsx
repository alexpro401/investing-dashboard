import { FC, useCallback, useMemo, useState } from "react"
import { isEmpty, isNil } from "lodash"
import { v4 as uuidv4 } from "uuid"

import { IPoolQuery } from "interfaces/thegraphs/all-pools"
import { Indents, Value, Divider, Link, AppNavigation } from "../styled"
import { Card, Icon } from "common"
import { Center, Flex } from "theme"
import { shortenAddress } from "utils"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { Token } from "interfaces"
import { ICON_NAMES } from "constants/icon-names"

interface Props {
  poolData: IPoolQuery
  baseToken: Token | null
  chainId?: number
}

const TabPoolHolders: FC<Props> = ({ poolData, baseToken, chainId }) => {
  const total = Number(poolData?.investorsCount) || 0

  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(10)

  const onPrev = useCallback(() => {
    if (offset === 0 || offset - limit <= 0) {
      setOffset(0)
    } else {
      setOffset(offset - limit)
    }
  }, [offset, limit])

  const onNext = useCallback(() => {
    if (offset + limit <= total - limit) {
      setOffset(offset + limit)
    }
  }, [offset, limit, total])

  const investorsInView = useMemo(() => {
    if (isNil(poolData)) return null

    return poolData.investors.slice(offset, offset + limit)
  }, [poolData, offset, limit])

  const Pagination = useMemo(() => {
    if (total <= limit) return null

    return (
      <Flex full ai="center" jc="center" gap="7">
        <Value.MediumThin color="#E4F2FF">
          {offset + 1} - {offset + limit} of {total}
        </Value.MediumThin>
        <Flex ai="center" jc="center" gap="16">
          <AppNavigation
            iconLeft={ICON_NAMES.angleLeft}
            onClick={onPrev}
            disabled={offset === 0}
          />
          <AppNavigation
            iconRight={ICON_NAMES.angleRight}
            onClick={onNext}
            disabled={offset + limit >= total}
          />
        </Flex>
      </Flex>
    )
  }, [total, limit, offset])

  const getInvestorExplorerLink = useCallback(
    (id) => {
      if (isNil(chainId)) return ""
      return getExplorerLink(chainId, id, ExplorerDataType.ADDRESS)
    },
    [chainId]
  )

  return (
    <>
      <Indents side={false}>
        <Card>
          <Flex full ai="center" jc="space-between">
            <Value.Medium color="#E4F2FF">Addresses: {total}</Value.Medium>
            <Value.Medium color="#E4F2FF">Amount</Value.Medium>
          </Flex>
          <Divider />
          <div>
            {isNil(investorsInView) || isEmpty(investorsInView) ? (
              <Center>
                <Value.MediumThin color="#B1C7FC">
                  No investors
                </Value.MediumThin>
              </Center>
            ) : (
              investorsInView.map(({ id }, i) => (
                <Link
                  key={uuidv4()}
                  href={getInvestorExplorerLink(id)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Flex
                    full
                    ai="center"
                    jc="space-between"
                    p={i > 0 ? "12px 0" : "0 0 12px"}
                  >
                    <Value.MediumThin color="#E4F2FF" block>
                      <Flex ai="center" jc="flex-start" gap="4">
                        {shortenAddress(id, 4)}
                        <Icon name={ICON_NAMES.externalLink} />
                      </Flex>
                    </Value.MediumThin>

                    <Flex ai="center" jc="flex-end" gap="4">
                      <Value.Medium color="#E4F2FF">100,500</Value.Medium>
                      <Value.Medium color="#B1C7FC">
                        {baseToken?.symbol ?? ""}
                      </Value.Medium>
                    </Flex>
                  </Flex>
                  <Divider />
                </Link>
              ))
            )}
          </div>
          {Pagination}
        </Card>
      </Indents>
    </>
  )
}

export default TabPoolHolders
