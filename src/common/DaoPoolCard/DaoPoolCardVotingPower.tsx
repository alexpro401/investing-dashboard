import * as S from "./styled"
import * as React from "react"

import { Flex } from "theme"
import { normalizeBigNumber } from "utils"
import { useGovPoolHelperContracts } from "hooks/dao"
import useGovPoolUserVotingPower from "hooks/dao/useGovPoolUserVotingPower"
import Skeleton from "components/Skeleton"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  account?: string | null
  pool?: string
  isMobile?: boolean
}

const DaoPoolCardVotingPower: React.FC<Props> = ({ account, pool }) => {
  const { govUserKeeperAddress } = useGovPoolHelperContracts(pool ?? "")
  const [userVotingPower, loading] = useGovPoolUserVotingPower({
    userKeeperAddress: govUserKeeperAddress,
    address: account,
  })

  return (
    <Flex ai="flex-end" jc="flex-start" dir="column" gap="4">
      {loading ? (
        <Skeleton variant={"rect"} h={"16px"} w={"80px"} />
      ) : (
        <S.DaoPoolCardVotingPower>
          {normalizeBigNumber(userVotingPower.power, 18, 2)}
        </S.DaoPoolCardVotingPower>
      )}
      <S.DaoPoolCardDescription>My voting power</S.DaoPoolCardDescription>
    </Flex>
  )
}

export default React.memo(DaoPoolCardVotingPower)
