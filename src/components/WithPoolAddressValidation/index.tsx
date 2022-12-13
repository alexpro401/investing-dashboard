import React, { useState, useEffect, useCallback } from "react"
import { createClient } from "urql"

import Page404 from "components/Page404"

import image404Src from "assets/others/create-fund-docs.png"
import { AppState } from "state"
import { useSelector } from "react-redux"
import { usePoolQuery } from "hooks/usePool"
import { selectPoolByAddress } from "state/pools/selectors"
import { isNil } from "lodash"

const allPoolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
})

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

  const poolDataStore = useSelector((s: AppState) =>
    selectPoolByAddress(s, poolAddress)
  )
  const [poolDataQuery] = usePoolQuery(poolAddress, allPoolsClient)

  const checkPoolAddressValidation = useCallback(async () => {
    setLoading(true)

    try {
      if (!isNil(poolDataStore) || !isNil(poolDataQuery)) {
        setIsValid(true)
      }
    } catch (error) {
      setIsValid(false)
    } finally {
      setLoading(false)
    }
  }, [poolAddress, poolDataStore, poolDataQuery])

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
