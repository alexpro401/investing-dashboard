import { useParams } from "react-router-dom"

import { useGovPoolDescription } from "hooks/dao"

interface IUseAboutDaoProps {
  startLoading: boolean
}

const useAboutDao = ({ startLoading }: IUseAboutDaoProps) => {
  const { daoAddress } = useParams<"daoAddress">()

  const { descriptionObject, loading } = useGovPoolDescription(
    startLoading ? daoAddress : undefined
  )

  return { descriptionObject, loading }
}

export default useAboutDao
