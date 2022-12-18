import { useParams } from "react-router-dom"

import { useGovPoolValidatorsCount } from "hooks/dao"

interface IUseAboutDaoProps {
  startLoading: boolean
}

const useValidators = ({ startLoading }: IUseAboutDaoProps) => {
  const { daoAddress } = useParams<"daoAddress">()

  const [validatorsCount, validatorsCountLoading] = useGovPoolValidatorsCount(
    startLoading ? daoAddress : undefined
  )

  return {
    validatorsCount,
    loading: validatorsCountLoading || false,
  }
}

export default useValidators
