import { useMemo } from "react"
import { useQuery } from "urql"

import { GovPoolTokenSaleQuery } from "queries"
import { isAddress } from "utils"
import { graphClientDaoPools } from "utils/graphClient"

interface ITokenSaleProposalQueryData {
  daoPool: { tokenSales: { id: string }[] }
}

const useGovTokenSaleContractAddress = (
  govPoolAddress?: string | undefined
): string | undefined => {
  const [{ data }] = useQuery<ITokenSaleProposalQueryData>({
    query: GovPoolTokenSaleQuery,
    pause: !isAddress(govPoolAddress),
    variables: useMemo(() => ({ address: govPoolAddress }), [govPoolAddress]),
    context: graphClientDaoPools,
  })

  const tspAddress = useMemo(() => {
    if (!data) return undefined

    const result =
      data.daoPool?.tokenSales.length !== 0
        ? data.daoPool?.tokenSales[0].id
        : undefined

    return result
  }, [data])

  return tspAddress
}

export default useGovTokenSaleContractAddress
