import { useCallback, useEffect, useState } from "react"

import { parseIpfsString } from "utils/ipfs"
import { IpfsEntity } from "utils/ipfsEntity"
import { useGovPoolContract } from "contracts"

interface GovPoolIpfsData {
  avatarUrl: string
  daoName: string
  websiteUrl: string
  description: string
  socialLinks: string[]
  documents: any[]
}

const useGovPoolIpfsData = (
  daoAddress
): [data: GovPoolIpfsData | undefined, loading: boolean] => {
  const govPoolContract = useGovPoolContract(daoAddress)

  const [loading, setLoading] = useState(true)
  const [ipfsData, setIpfsData] = useState<GovPoolIpfsData | undefined>()

  const getDescriptionURL = useCallback(async () => {
    if (!govPoolContract) return

    try {
      setLoading(true)
      const _descriptionURL = await govPoolContract.descriptionURL()
      const GovPoolIpfsEntity = new IpfsEntity<GovPoolIpfsData>({
        path: parseIpfsString(_descriptionURL),
      })
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
