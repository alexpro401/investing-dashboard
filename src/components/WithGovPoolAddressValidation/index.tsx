import React, { useState, useEffect, useCallback, useMemo } from "react"
import { createClient, useQuery } from "urql"

import { GovPoolQuery } from "queries"
import { usePoolRegistryContract } from "contracts"
import { IGovPoolQuery } from "interfaces/thegraphs/gov-pools"
import Page404 from "components/Page404"

import image404Src from "assets/others/create-fund-docs.png"

const govPoolsClient = createClient({
  url: process.env.REACT_APP_DAO_POOLS_API_URL || "",
})

interface IProps {
  daoPoolAddress: string
  children: React.ReactNode
}

const WithGovPoolAddressValidation: React.FC<IProps> = ({
  daoPoolAddress,
  children,
}) => {
  const poolRegistryContract = usePoolRegistryContract()
  const [loading, setLoading] = useState<boolean>(true)
  const [isValid, setIsValid] = useState<boolean>(true)

  const [{ data: govPoolFromRedux }] = useQuery<{ daoPool: IGovPoolQuery }>({
    query: GovPoolQuery,
    variables: useMemo(() => ({ address: daoPoolAddress }), [daoPoolAddress]),
    context: govPoolsClient,
  })

  const checkGovAddressValidation = useCallback(async () => {
    if (!poolRegistryContract) return

    setLoading(true)

    try {
      if (govPoolFromRedux?.daoPool) {
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
    return <></>
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
