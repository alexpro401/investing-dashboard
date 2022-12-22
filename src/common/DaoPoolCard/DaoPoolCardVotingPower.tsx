import * as S from "./styled"
import * as React from "react"

import { normalizeBigNumber } from "utils"
import { useGovPoolHelperContracts } from "hooks/dao"
import useGovPoolUserVotingPower from "hooks/dao/useGovPoolUserVotingPower"
import Skeleton from "components/Skeleton"
import { isNil } from "lodash"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  account?: string | null
  pool?: string
  isMobile?: boolean
}

const DaoPoolCardVotingPower: React.FC<Props> = ({
  account,
  pool,
  isMobile,
}) => {
  const { govUserKeeperAddress } = useGovPoolHelperContracts(pool ?? "")
  const [userVotingPower, loading] = useGovPoolUserVotingPower({
    userKeeperAddress: govUserKeeperAddress,
    address: account,
  })

  const _isMobile = React.useMemo(() => {
    if (isNil(isMobile)) return false
    return isMobile
  }, [isMobile])

  return loading ? (
    <Skeleton variant={"rect"} h={_isMobile ? "16px" : "25px"} w={"80px"} />
  ) : (
    <S.DaoPoolCardVotingPower>
      {normalizeBigNumber(userVotingPower.power, 18, 2)}
    </S.DaoPoolCardVotingPower>
  )
}

export default React.memo(DaoPoolCardVotingPower)
