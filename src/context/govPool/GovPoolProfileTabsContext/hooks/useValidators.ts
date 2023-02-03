import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

import { useGovPoolValidatorsCount } from "hooks/dao"

interface IUseAboutDaoProps {
  startLoading: boolean
}

const useValidators = ({ startLoading }: IUseAboutDaoProps) => {
  const [loaded, setLoaded] = useState<boolean>(false)
  const { daoAddress } = useParams<"daoAddress">()

  const [validatorsCount, validatorsCountLoading] = useGovPoolValidatorsCount(
    startLoading && !loaded ? daoAddress : undefined
  )

  useEffect(() => {
    if (validatorsCount !== null && !validatorsCountLoading) {
      setLoaded(true)
    }
  }, [validatorsCount, validatorsCountLoading])

  return {
    validatorsCount,
    loading: loaded ? false : validatorsCountLoading || false,
  }
}

export default useValidators
