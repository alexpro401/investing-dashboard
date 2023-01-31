import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { useGovPoolDescription } from "hooks/dao"

interface IUseAboutDaoProps {
  startLoading: boolean
}

const useAboutDao = ({ startLoading }: IUseAboutDaoProps) => {
  const { daoAddress } = useParams<"daoAddress">()
  const [loaded, setLoaded] = useState<boolean>(false)

  const { descriptionObject, loading } = useGovPoolDescription(
    startLoading && !loaded ? daoAddress : undefined
  )

  useEffect(() => {
    if (!loading && descriptionObject !== undefined) {
      setLoaded(true)
    }
  }, [descriptionObject, loading])

  return {
    descriptionObject: descriptionObject || null,
    loading: loaded ? false : loading,
  }
}

export default useAboutDao
