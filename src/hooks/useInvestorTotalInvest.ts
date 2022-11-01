import { useEffect, useState } from "react"
import { createClient, useQuery } from "urql"
import { isEmpty, isNil, forEach } from "lodash"
import { BigNumber } from "@ethersproject/bignumber"

import { ZERO } from "constants/index"
import { addBignumbers } from "utils/formulas"
import { InvestorPoolsPositionsQuery } from "queries"

const investorGraphClient = createClient({
  url: process.env.REACT_APP_INVESTORS_API_URL || "",
  requestPolicy: "network-only",
})

function useInvestorTotalInvest(address?: string | null) {
  const [loading, setLoading] = useState(true)
  const [offset, setOffset] = useState(0)
  const [limit] = useState(1000)

  const [usd, setUsd] = useState(ZERO)

  const [{ data, fetching }] = useQuery({
    query: InvestorPoolsPositionsQuery,
    variables: {
      offset,
      limit,
      address,
    },
    context: investorGraphClient,
  })

  useEffect(() => {
    if (fetching || isNil(data.investorPoolPositions)) {
      return
    }

    if (isEmpty(data.investorPoolPositions) && !fetching) {
      setLoading(false)
      return
    }

    const { investorPoolPositions } = data

    forEach(investorPoolPositions, function (position) {
      const { totalUSDInvestVolume } = position
      setUsd((prev) =>
        addBignumbers([prev, 18], [BigNumber.from(totalUSDInvestVolume), 18])
      )
    })

    if (investorPoolPositions.length === limit) {
      setOffset((prev) => prev + investorPoolPositions.length)
    } else {
      setLoading(false)
    }
  }, [data, fetching])

  // Clear state when address changed
  useEffect(() => {
    setLoading(true)
    setOffset(0)
    setUsd(ZERO)
  }, [address])

  return [{ usd }, { loading }]
}

export default useInvestorTotalInvest
