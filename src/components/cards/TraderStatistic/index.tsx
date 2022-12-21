import { FC, useCallback, useMemo } from "react"
import { v4 as uuidv4 } from "uuid"
import { isNil } from "lodash"
import { BigNumber } from "@ethersproject/bignumber"

import { Flex, Text } from "theme"
import AccountInfo from "components/AccountInfo"
import { CardInfo, Icon as CommonIcon } from "common"
import { StatisticValue, PoolsIcons } from "./styled"

import { ICON_NAMES } from "constants/icon-names"
import { copyToClipboard } from "utils/clipboard"
import { useAddToast } from "state/application/hooks"
import { normalizeBigNumber, shortenAddress } from "utils"
import { IPoolQuery } from "interfaces/thegraphs/all-pools"

interface Props {
  account?: string | null
  data: {
    usdTVL: BigNumber | any
    APY: BigNumber | any
    percPNLBase: BigNumber | any
    investorsCount: BigNumber | any
  }
  pools: IPoolQuery[]

  isMobile: boolean
}
const TraderStatisticCard: FC<Props> = ({ account, data, pools, isMobile }) => {
  const addToast = useAddToast()

  const statistic = useMemo(
    () => [
      {
        label: "TVL",
        value: (
          <StatisticValue>
            ${normalizeBigNumber(data.usdTVL, 18, 2)}
          </StatisticValue>
        ),
        info: <>Explain about TVL</>,
      },
      {
        label: "APY",
        value: (
          <StatisticValue>{normalizeBigNumber(data.APY, 4, 2)}%</StatisticValue>
        ),
        info: <>Explain about APY</>,
      },
      {
        label: "P&L",
        value: (
          <StatisticValue>
            {normalizeBigNumber(data.percPNLBase, 4, 2)}%
          </StatisticValue>
        ),
        info: <>Explain about P&L</>,
      },
      {
        label: "Depositors",
        value: <StatisticValue>{data.investorsCount}</StatisticValue>,
        info: <>Explain about Depositors</>,
      },
    ],
    [data]
  )

  const copyAccountToClipboard = useCallback(async () => {
    if (!isNil(account)) {
      await copyToClipboard(account)
      const _toast = {
        type: "success",
        content: "Address copied to clipboard.",
      }
      addToast(_toast, uuidv4(), 3000)
    }
  }, [account, addToast])

  const leftNode = useMemo(
    () => (
      <div onClick={copyAccountToClipboard}>
        <AccountInfo account={account} isMobile={isMobile}>
          <Flex ai="center" jc="flex-start" gap="3" m="2px 0 0">
            <Text color="#B1C7FC" fz={13} lh="15px">
              {shortenAddress(account, 2)}
            </Text>
            <CommonIcon name={ICON_NAMES.copy} color="#B1C7FC" />
          </Flex>
        </AccountInfo>
      </div>
    ),

    [account, isMobile]
  )

  const rightNode = useMemo(() => <PoolsIcons pools={pools} />, [pools])

  return (
    <>
      <CardInfo
        nodeHeadLeft={leftNode}
        nodeHeadRight={rightNode}
        statistic={statistic}
        isMobile={isMobile}
      />
    </>
  )
}

export default TraderStatisticCard
