import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { PulseSpinner } from "react-spinners-kit"

import { PoolType } from "consts/types"
import { usePoolRegistryContract } from "contracts"

import { Flex } from "theme"
import FundProposalsRisky from "pages/FundProposalsRisky"
import FundProposalsInvest from "pages/FundProposalsInvest"

const FundProposals = () => {
  const { poolAddress } = useParams()

  const [poolType, setPoolType] = useState<PoolType | null>(null)

  const traderPoolRegistry = usePoolRegistryContract()

  useEffect(() => {
    if (!traderPoolRegistry || !poolAddress) return
    ;(async () => {
      try {
        const isBase = await traderPoolRegistry.isBasicPool(poolAddress)
        setPoolType(isBase ? "BASIC_POOL" : "INVEST_POOL")
      } catch (e) {
        console.error(e)
      }
    })()
  }, [traderPoolRegistry, poolAddress])

  if (!poolType) {
    return (
      <Flex full ai="center" jc="center">
        <PulseSpinner />
      </Flex>
    )
  }

  return poolType === "BASIC_POOL" ? (
    <FundProposalsRisky />
  ) : (
    <FundProposalsInvest />
  )
}

export default FundProposals
