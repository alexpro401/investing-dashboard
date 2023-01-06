import React, { useState, useEffect, useCallback } from "react"

import Page404 from "components/Page404"

import image404Src from "assets/others/create-fund-docs.png"
import { usePoolRegistryContract } from "contracts"

interface IProps {
  poolAddress: string
  children: React.ReactNode
  loader?: React.ReactNode
}

const WithPoolAddressValidation: React.FC<IProps> = ({
  poolAddress,
  children,
  loader,
}) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [isValid, setIsValid] = useState<boolean>(false)
  const poolRegistry = usePoolRegistryContract()

  const checkPoolAddressValidation = useCallback(async () => {
    setLoading(true)

    if (!poolRegistry) return

    try {
      const isTraderPool = await poolRegistry.isTraderPool(poolAddress)
      setIsValid(isTraderPool)
    } catch (error) {
      setIsValid(false)
    } finally {
      setLoading(false)
    }
  }, [poolAddress, poolRegistry])

  useEffect(() => {
    checkPoolAddressValidation()
  }, [checkPoolAddressValidation])

  if (loading) {
    return <>{loader ?? ""}</>
  }

  if (!isValid) {
    return (
      <Page404
        title={"Not found"}
        text={`Fund with address: ${poolAddress} not found`}
        renderImage={<img src={image404Src} alt="" />}
      />
    )
  }

  return <>{children}</>
}

export default WithPoolAddressValidation
