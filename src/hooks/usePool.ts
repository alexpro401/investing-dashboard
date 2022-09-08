import { useCallback, useEffect, useState } from "react"
import { Contract } from "@ethersproject/contracts"
import { IPosition } from "interfaces/thegraphs/all-pools"
import { IPoolQuery } from "interfaces/thegraphs/all-pools"
import { ILeverageInfo } from "interfaces/contracts/ITraderPool"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"
import useContract from "hooks/useContract"
import { useQuery } from "urql"
import { isAddress } from "utils"
import { TraderPool } from "abi"
import { PoolPositionLast, PoolQuery } from "queries"

export function useTraderPool(address: string | undefined): Contract | null {
  const traderPool = useContract(address, TraderPool)

  return traderPool
}

/**
 * Returns TheGraph info about the pool
 */
export function usePoolQuery(
  address: string | undefined
): [IPoolQuery | undefined, () => void] {
  const [pool, executeQuery] = useQuery<{
    traderPool: IPoolQuery
  }>({
    pause: !isAddress(address),
    query: PoolQuery,
    variables: { address },
  })

  return [pool.data?.traderPool, executeQuery]
}

/**
 * Returns TheGraph info about specified position
 */
export function usePoolPosition(poolId, tokenId) {
  const [position, setPosition] = useState<IPosition | undefined>()

  const [pool, executeQuery] = useQuery<{
    positions: IPosition[]
  }>({
    query: PoolPositionLast,
    variables: { poolId, tokenId },
  })

  useEffect(() => {
    if (!pool || !pool.data || !pool.data.positions) return

    setPosition(pool.data.positions[0])
  }, [pool])

  return position
}

/**
 * Returns Contract info about the pool
 */
export function usePoolContract(
  address: string | undefined
): [ILeverageInfo | null, IPoolInfo | null, () => void] {
  const traderPool = useTraderPool(address)
  const [update, setUpdate] = useState(false)
  const [leverageInfo, setLeverageInfo] = useState<ILeverageInfo | null>(null)
  const [poolInfo, setPoolInfo] = useState<IPoolInfo | null>(null)

  const fetchUpdate = useCallback(() => {
    setUpdate(!update)
  }, [update])

  useEffect(() => {
    if (!traderPool) return
    ;(async () => {
      try {
        const leverage = await traderPool?.getLeverageInfo()
        const poolInfo = await traderPool?.getPoolInfo()

        setPoolInfo(poolInfo)
        setLeverageInfo(leverage)
      } catch (e) {
        // console.log(e)
      }
    })()
  }, [traderPool, update])

  return [leverageInfo, poolInfo, fetchUpdate]
}
