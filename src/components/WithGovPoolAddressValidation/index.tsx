import { useState, useEffect, useCallback } from "react"

import { usePoolRegistryContract } from "contracts"
import Page404 from "components/Page404"

import image404Src from "assets/others/create-fund-docs.png"

interface IProps {
  daoPoolAddress: string
  children: JSX.Element
}

const WithGovPoolAddressValidation = ({ daoPoolAddress, children }: IProps) => {
  const poolRegistryContract = usePoolRegistryContract()
  const [loading, setLoading] = useState<boolean>(true)
  const [isValid, setIsValid] = useState<boolean>(false)

  const checkGovAddressValidation = useCallback(async () => {
    if (!poolRegistryContract) return

    setLoading(true)

    try {
      const _isValid = await poolRegistryContract.isGovPool(daoPoolAddress)

      setIsValid(_isValid)
    } catch (error) {
      setIsValid(false)
    } finally {
      setLoading(false)
    }
  }, [daoPoolAddress, poolRegistryContract])

  useEffect(() => {
    checkGovAddressValidation()
  }, [daoPoolAddress, checkGovAddressValidation, poolRegistryContract])

  if (loading) {
    return null
  }

  if (!isValid) {
    return (
      <Page404
        title={"Not found"}
        text={`DAO pool with address: ${daoPoolAddress} not found`}
        renderImage={<img src={image404Src} alt="" />}
      />
    )
  }

  return children
}

export default WithGovPoolAddressValidation
