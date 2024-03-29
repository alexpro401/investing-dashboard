import { useCallback, useEffect, useMemo, useState } from "react"
import { useQuery } from "urql"

import { GovPoolExecutorQuery } from "queries"
import { isAddress } from "utils"
import { IExecutor, IExecutorType } from "types"
import { parseIpfsString } from "utils/ipfs"
import { IpfsEntity } from "utils/ipfsEntity"
import useGovPoolExecutorType from "./useGovPoolExecutorType"
import { graphClientDaoPools } from "utils/graphClient"

interface IResultExecutor extends IExecutor {
  type: IExecutorType
  proposalDescription: string
  proposalName: string
}

interface IExecutorQueryData {
  daoPool: { executors: IExecutor[] }
}

const useGovPoolExecutor = (
  govPoolAddress: string | undefined,
  executorAddress: string
): [IResultExecutor | undefined, boolean] => {
  const [{ data, fetching }] = useQuery<IExecutorQueryData>({
    query: GovPoolExecutorQuery,
    pause: !isAddress(govPoolAddress),
    variables: useMemo(
      () => ({ address: govPoolAddress, executorAddress }),
      [govPoolAddress, executorAddress]
    ),
    context: graphClientDaoPools,
  })
  const [lastExecutorAddressSnapshot, setLastExecutorAddressSnapshot] =
    useState<IExecutor | undefined>(undefined)

  const searchedExecutor = useMemo(() => {
    if (!data || !govPoolAddress) return undefined

    const daoPool = data.daoPool

    if (!daoPool) return undefined

    if (!daoPool.executors || daoPool.executors.length === 0) return undefined

    return daoPool.executors[0]
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
    if (loading) return

    setLastExecutorAddressSnapshot(searchedExecutor)

    if (executorType !== "custom") {
      setExecutor({
        ...searchedExecutor,
        type: executorType,
        proposalDescription: "",
        proposalName: "",
      })
      return
    }

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
  }, [searchedExecutor, executorType, loading])

  useEffect(() => {
    if (
      JSON.stringify(lastExecutorAddressSnapshot) !==
      JSON.stringify(searchedExecutor)
    ) {
      handleParseExecutor()
    }
  }, [handleParseExecutor, lastExecutorAddressSnapshot, searchedExecutor])

  return [executor, fetching || loading || false]
}

export default useGovPoolExecutor
