import { useCallback, useEffect, useState } from "react"

import { useGovPoolContract } from "contracts"
import { IpfsEntity } from "utils/ipfsEntity"
import { IGovPoolDescription } from "types"
import { parseIpfsString } from "utils/ipfs"

interface UseGovPoolDescriptionUrlResponse {
  descriptionUrl: string | null
  descriptionObject: IGovPoolDescription | null | undefined
  loading: boolean
}
const useGovPoolDescriptionUrl = (
  govPoolAddress?: string
): UseGovPoolDescriptionUrlResponse => {
  const govPoolContract = useGovPoolContract(govPoolAddress)

  const [descriptionUrl, setDescriptionUrl] = useState<string | null>(null)
  const [descriptionObject, setDescriptionObject] = useState<
    IGovPoolDescription | null | undefined
  >(undefined)
  const [loading, setLoading] = useState<boolean>(true)

  const setupDescriptionUrl = useCallback(async () => {
    if (!govPoolContract) return

    setLoading(true)

    try {
      const _descriptionUrl = await govPoolContract.descriptionURL()
      setDescriptionUrl(_descriptionUrl)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [govPoolContract])

  useEffect(() => {
    setupDescriptionUrl()
  }, [setupDescriptionUrl])

  const getIpfsDataFromDescriptionUrl = useCallback(async () => {
    if (!descriptionUrl || descriptionUrl === "") {
      setDescriptionObject(null)
      return
    }

    setLoading(true)

    try {
      const ipfsEntity = new IpfsEntity<IGovPoolDescription>({
        path: parseIpfsString(descriptionUrl),
      })

      const _govPoolDescription = await ipfsEntity.load()
      setDescriptionObject(_govPoolDescription || null)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [descriptionUrl])

  useEffect(() => {
    getIpfsDataFromDescriptionUrl()
  }, [getIpfsDataFromDescriptionUrl])

  return { descriptionUrl, descriptionObject, loading }
}

export default useGovPoolDescriptionUrl
