import { useCallback, useEffect, useState } from "react"

import { useGovPoolContract } from "contracts"
import { IpfsEntity } from "utils/ipfsEntity"
import { IGovPoolDescription } from "types/dao.types"
import { parseIpfsString } from "utils/ipfs"

const useGovPoolDescriptionUrl = (govPoolAddress: string) => {
  const govPoolContract = useGovPoolContract(govPoolAddress)

  const [descriptionUrl, setDescriptionUrl] = useState<string | null>(null)
  const [desciptionObject, setDescriptionObject] =
    useState<IGovPoolDescription | null>(null)

  const setupDescriptionUrl = useCallback(async () => {
    if (!govPoolContract) return

    try {
      const _descriptionUrl = await govPoolContract.descriptionURL()
      setDescriptionUrl(_descriptionUrl)
    } catch (error) {
      console.log(error)
    }
  }, [govPoolContract])

  useEffect(() => {
    setupDescriptionUrl()
  }, [setupDescriptionUrl])

  const getIpfsDataFromDescriptionUrl = useCallback(async () => {
    if (!descriptionUrl || descriptionUrl === "") return

    try {
      const ipfsEntity = new IpfsEntity<IGovPoolDescription>({
        path: parseIpfsString(descriptionUrl),
      })

      const _govPoolDescription = await ipfsEntity.load()
      setDescriptionObject(_govPoolDescription)
    } catch (error) {
      console.log(error)
    }
  }, [descriptionUrl])

  useEffect(() => {
    getIpfsDataFromDescriptionUrl()
  }, [getIpfsDataFromDescriptionUrl])

  return { descriptionUrl, desciptionObject }
}

export default useGovPoolDescriptionUrl
