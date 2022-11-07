import { useMemo } from "react"
import { createClient, useQuery } from "urql"

import { DaoPoolValidatorsQuery } from "queries/validators"
import { isAddress } from "utils"

const daoValidatorsGraphClient = createClient({
  url: process.env.REACT_APP_DAO_VALIDATORS_API_URL || "",
  requestPolicy: "network-only",
})

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
    context: daoValidatorsGraphClient,
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
