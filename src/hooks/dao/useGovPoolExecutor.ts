import { useCallback, useEffect, useMemo, useState } from "react"
import { createClient, useQuery } from "urql"

import { GovPoolExecutorQuery } from "queries/gov-pools"
import { isAddress } from "utils"
import { IExecutor, IExecutorType } from "types/dao.types"
import { parseIpfsString } from "utils/ipfs"
import { IpfsEntity } from "utils/ipfsEntity"
import useGovPoolExecutorType from "./useGovPoolExecutorType"

interface IResultExecutor extends IExecutor {
  type: IExecutorType
  proposalDescription: string
  proposalName: string
}

interface IExecutorQueryData {
  daoPools: { executors: IExecutor[] }[]
}

const daoGraphClient = createClient({
  url: process.env.REACT_APP_DAO_POOLS_API_URL || "",
  requestPolicy: "network-only",
})

const useGovPoolExecutor = (
  govPoolAddress: string | undefined,
  executorAddress: string
): [IResultExecutor | undefined, boolean] => {
  const [{ data, fetching }] = useQuery<IExecutorQueryData>({
    query: GovPoolExecutorQuery,
    pause: !isAddress(govPoolAddress),
    variables: {
      address: govPoolAddress,
      executorAddress,
    },
    context: daoGraphClient,
  })

  const searchedExecutor = useMemo(() => {
    if (!data || !govPoolAddress) return undefined

    const daoPools = data.daoPools

    if (daoPools.length === 0) return undefined

    if (!daoPools[0].executors || daoPools[0].executors.length === 0)
      return undefined

    return daoPools[0].executors[0]
  }, [data, govPoolAddress])

  const { type: executorType } = useGovPoolExecutorType(
    govPoolAddress ?? "",
    executorAddress
  )

  const [loading, setLoading] = useState<boolean>(false)
  const [executor, setExecutor] = useState<IResultExecutor | undefined>(
    undefined
  )

  const handleParseExecutor = useCallback(async () => {
    if (!searchedExecutor) return

    setLoading(true)
    try {
      const ipfsExecutorDescription = new IpfsEntity<{
        proposalName: string
        proposalDescription: string
      }>({
        path: parseIpfsString(searchedExecutor.settings.executorDescription),
      })
      const { proposalDescription, proposalName } =
        await ipfsExecutorDescription.load()

      setExecutor({
        ...searchedExecutor,
        type: executorType,
        proposalDescription,
        proposalName,
      })
    } catch (error) {
      console.log(error)
      setExecutor({
        ...searchedExecutor,
        type: executorType,
        proposalDescription: "",
        proposalName: "",
      })
    } finally {
      setLoading(false)
    }
  }, [searchedExecutor, executorType])

  useEffect(() => {
    handleParseExecutor()
  }, [handleParseExecutor])

  return [executor, fetching || loading || false]
}

export default useGovPoolExecutor
