import React, { useState, useEffect, useCallback } from "react"
import { useSelector } from "react-redux"

import { usePoolRegistryContract } from "contracts"
import Page404 from "components/Page404"
import { selectGovPoolByAddress } from "state/govPools/selectors"

import image404Src from "assets/others/create-fund-docs.png"

interface IProps {
  daoPoolAddress: string
  children: React.ReactNode
  loader?: React.ReactNode
}

const WithGovPoolAddressValidation: React.FC<IProps> = ({
  daoPoolAddress,
  children,
  loader,
}) => {
  const poolRegistryContract = usePoolRegistryContract()
  const [loading, setLoading] = useState<boolean>(true)
  const [isValid, setIsValid] = useState<boolean>(true)
  const govPoolFromRedux = useSelector((s) =>
    selectGovPoolByAddress(s, daoPoolAddress)
  )

  const checkGovAddressValidation = useCallback(async () => {
    if (!poolRegistryContract) return

    setLoading(true)

    try {
      if (govPoolFromRedux) {
        setIsValid(true)
      } else {
        const _isValid = await poolRegistryContract.isGovPool(daoPoolAddress)

        setIsValid(_isValid)
      }
    } catch (error) {
      setIsValid(false)
    } finally {
      setLoading(false)
    }
  }, [daoPoolAddress, poolRegistryContract, govPoolFromRedux])

  useEffect(() => {
    checkGovAddressValidation()
  }, [checkGovAddressValidation])

  if (loading) {
    return <>{loader ?? ""}</>
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

  return <>{children}</>
}

export default WithGovPoolAddressValidation
