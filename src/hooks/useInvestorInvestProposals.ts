import { useEffect, useMemo, useState } from "react"

import { useActiveWeb3React } from "hooks"
import { getContract } from "utils/getContract"
import { InvestProposal } from "interfaces/thegraphs/invest-pools"
import { TraderPool, TraderPoolInvestProposal } from "abi"

interface IProposalData {
  proposal: InvestProposal
  poolAddress: string
}

function useInvestorInvestProposals(
  activePools: string[],
  invested: boolean
): [IProposalData[], boolean] {
  const { library, account } = useActiveWeb3React()
  const [proposals, setProposals] = useState<any[]>([])
  const [fetched, setFetched] = useState<boolean>(false)
  const [isInvest, setIsInvest] = useState<boolean>(invested)

  const lastPool = useMemo(() => {
    if (!activePools) return ""
    return activePools[activePools.length - 1]
  }, [activePools])

  useEffect(() => {
    setIsInvest(invested)
    return () => {
      setFetched(false)
      setProposals([])
    }
  }, [invested])

  useEffect(() => {
    if (
      fetched ||
      !activePools ||
      activePools.length === 0 ||
      !library ||
      !account
    ) {
      return
    }

    ;(async () => {
      try {
        let payload: any[] = []

        for (const poolAddress of activePools) {
          const traderPool = await getContract(
            poolAddress,
            TraderPool,
            library,
            account
          )
          const proposalAddress = await traderPool.proposalPoolAddress()

          const proposalPool = getContract(
            proposalAddress,
            TraderPoolInvestProposal,
            library,
            account
          )

          const data = await proposalPool.getProposalInfos(0, 100)

          if (data && data.length > 0) {
            const filtered: any[] = []

            for (const [i, p] of data.entries()) {
              const balance = await proposalPool.balanceOf(account, i)

              if (isInvest && balance.gt("0")) {
                filtered.push(p)
              }
              if (!isInvest && !balance.gt("0")) {
                filtered.push(p)
              }
            }

            const dataWithPoolAddress = filtered.map((proposal) => ({
              poolAddress,
              proposal,
            }))
            payload = [...payload, ...dataWithPoolAddress]
          }
          if (poolAddress === lastPool) setFetched(true)
        }
        setProposals(payload)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [account, activePools, fetched, isInvest, lastPool, library, proposals])

  return [proposals, fetched]
}

export default useInvestorInvestProposals
