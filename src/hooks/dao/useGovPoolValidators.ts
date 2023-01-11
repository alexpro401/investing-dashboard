import { useMemo } from "react"
import { useQuery } from "urql"

import { DaoPoolValidatorsQuery } from "queries"
import { isAddress } from "utils"
import { graphClientDaoValidators } from "utils/graphClient"

interface IValidator {
  id: string
  balance: string
}

interface IQueryData {
  daoPools: { validators: IValidator[] }[]
}

const useGovPoolValidators = (daoAddress: string): [IValidator[], boolean] => {
  const [{ data, fetching }] = useQuery<IQueryData>({
    query: DaoPoolValidatorsQuery,
    pause: !isAddress(daoAddress),
    variables: {
      address: daoAddress,
    },
    context: graphClientDaoValidators,
  })

  const validators = useMemo<IValidator[]>(() => {
    if (!data) return []

    const daoPools = data.daoPools

    if (daoPools.length === 0) return []

    const searchedDaoPool = daoPools[0]

    return searchedDaoPool.validators
  }, [data])

  return [validators, fetching]
}

export default useGovPoolValidators
