import { useNavigate } from "react-router-dom"
import { MouseEvent, useMemo, useState, useCallback, useEffect } from "react"

import { useActiveWeb3React } from "hooks"
import { usePoolRegistryContract } from "contracts"

interface IPayload {
  openExtra: boolean
  showPositions: boolean
}
interface IActions {
  togglePositions: () => void
  toggleExtraContent: () => void
  onTerminalNavigate: (e: MouseEvent<HTMLElement>, invest: boolean) => void
}

function usePoolPositionCard(
  trader: string,
  poolId: string,
  baseToken: string,
  positionToken: string,
  closed: boolean
): [IPayload, IActions] {
  const navigate = useNavigate()
  const { account } = useActiveWeb3React()
  const traderPoolRegistry = usePoolRegistryContract()

  // STATE DATA
  const [openExtra, setOpenExtra] = useState<boolean>(false)
  const [showPositions, setShowPositions] = useState<boolean>(false)
  const [poolType, setPoolType] = useState<string | undefined>(undefined)

  // MEMOIZED DATA
  const isTrader = useMemo<boolean>(() => {
    if (!account || !trader || closed === undefined) return false
    return String(account).toLowerCase() === trader
  }, [account, closed, trader])

  // ACTIONS
  const togglePositions = useCallback(() => {
    setShowPositions(!showPositions)
  }, [showPositions])

  const toggleExtraContent = useCallback(() => {
    if (isTrader && !closed) {
      if (openExtra) {
        setShowPositions(false)
      }
      setOpenExtra(!openExtra)
    } else {
      togglePositions()
    }
  }, [isTrader, openExtra, closed, togglePositions])

  /**
   * Navigate to terminal
   * @param e - click event
   * @param invest - terminal type (true = invest, false = divest)
   */
  const onTerminalNavigate = useCallback(
    (e: MouseEvent<HTMLElement>, invest = true) => {
      e.stopPropagation()

      if (!poolId || !poolType || !positionToken || !baseToken) return

      let url = `/pool/swap/${poolType}/${poolId}`

      if (invest) {
        url += `/${baseToken}/${positionToken}`
      } else {
        url += `/${positionToken}/${baseToken}`
      }

      navigate(url, {
        state: {
          pathname: `/fund-positions/${poolId}/${closed ? "closed" : "open"}`,
        },
      })
    },
    [baseToken, closed, navigate, poolId, poolType, positionToken]
  )

  // SIDE EFFECTS
  // check pool type
  useEffect(() => {
    if (!traderPoolRegistry || !poolId) return
    ;(async () => {
      try {
        const isBasePool = await traderPoolRegistry.isBasicPool(poolId)
        if (isBasePool) {
          setPoolType("BASIC_POOL")
        } else {
          setPoolType("INVEST_POOL")
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [poolId, traderPoolRegistry])

  return [
    {
      openExtra,
      showPositions,
    },
    {
      togglePositions,
      toggleExtraContent,
      onTerminalNavigate,
    },
  ]
}

export default usePoolPositionCard
