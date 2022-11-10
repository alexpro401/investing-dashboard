import { useCallback, useEffect, useState } from "react"

import { IpfsEntity } from "utils/ipfsEntity"
import { useGovPoolContract } from "contracts"

const useGovPoolIpfsData = (daoAddress): [data: any, loading: boolean] => {
  const govPoolContract = useGovPoolContract(daoAddress)

  const [loading, setLoading] = useState(true)
  const [ipfsData, setIpfsData] = useState()

  const getDescriptionURL = useCallback(async () => {
    if (!govPoolContract) return

    try {
      setLoading(true)
      const _descriptionURL = await govPoolContract.descriptionURL()
      const GovPoolIpfsEntity = new IpfsEntity(
        undefined,
        String(_descriptionURL).split("ipfs://").pop()
      )
      const govPoolIpfsData = await GovPoolIpfsEntity.load()

      setIpfsData(govPoolIpfsData)
    } catch (error: any) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [govPoolContract])

  useEffect(() => {
    if (!govPoolContract) return
    ;(async () => await getDescriptionURL())()
  }, [govPoolContract])

  return [ipfsData, loading]
}

export default useGovPoolIpfsData
