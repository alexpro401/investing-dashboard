import * as React from "react"
import { isNil } from "lodash"
import { useWeb3React } from "@web3-react/core"
import { isAddress } from "@ethersproject/address"

import {
  useInvestorRiskyPositionListData,
  useTraderPoolInfoMulticall,
} from "hooks"
import { WrappedInvestorRiskyPositionView } from "interfaces/thegraphs/investors"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"

type Response = [WrappedInvestorRiskyPositionView[], boolean, () => void]

const useInvestorRiskyPositionList = (closed: boolean): Response => {
  const { account } = useWeb3React()

  const userAcc = React.useMemo(
    () => (isNil(account) || !isAddress(account) ? "" : account.toLowerCase()),
    [account]
  )

  const positionListFilter = React.useMemo(
    () => ({
      account: userAcc,
      closed,
      type: "RISKY_PROPOSAL",
    }),
    [userAcc, closed]
  )

  const [riskyPositions, riskyPositionsLoading, fetchMore] =
    useInvestorRiskyPositionListData(positionListFilter)

  const _poolsWithRiskyProposalPositions = React.useMemo(
    () => [
      ...new Set(
        riskyPositions?.map(
          (position) => position.proposalContract.traderPool.id
        )
      ),
    ],
    [riskyPositions]
  )

  const [poolInfos, poolInfoLoading] = useTraderPoolInfoMulticall<IPoolInfo>(
    _poolsWithRiskyProposalPositions,
    "getPoolInfo"
  )

  const anyLoading = React.useMemo(
    () => riskyPositionsLoading || poolInfoLoading,
    [riskyPositionsLoading, poolInfoLoading]
  )

  const payload = React.useMemo<WrappedInvestorRiskyPositionView[]>(() => {
    return riskyPositions.map((position) => {
      const { vests, ...restPosition } = position

      return {
        id: position.id,
        position: restPosition,
        poolInfo: poolInfos[restPosition.proposalContract.traderPool.id],
        vests: vests,
        utilityIds: {
          proposalId: Number(position.proposalId) - 1,
          proposalContractAddress: restPosition.proposalContract.id,
          poolAddress: restPosition.proposalContract.traderPool.id,
          poolBaseTokenAddress: restPosition.proposalContract.traderPool.token,
        },
      }
    })
  }, [riskyPositions, poolInfos])

  return [payload, anyLoading, fetchMore]
}

export default useInvestorRiskyPositionList
