import { useGovPoolUserVotingPower } from "hooks"
import { useMemo } from "react"

interface Props {
  govUserKeeperAddress?: string
  account?: string | null
  withDelegated?: boolean
  allNftsId: string[]
}

export const useNftPowerMap = ({
  govUserKeeperAddress,
  account,
  withDelegated,
  allNftsId,
}: Props) => {
  // get power for all nfts
  const [userOwnedPower] = useGovPoolUserVotingPower({
    userKeeperAddress: govUserKeeperAddress || "",
    address: account,
  })
  const [userDelegatedPower] = useGovPoolUserVotingPower({
    address: account,
    userKeeperAddress: govUserKeeperAddress || "",
    isMicroPool: true,
  })

  // merge all power in one
  const allNftsPower = useMemo(() => {
    if (withDelegated) {
      return [
        ...userOwnedPower.perNftPower,
        ...userDelegatedPower.perNftPower,
      ].map((v) => v.toString())
    }

    return [...userOwnedPower.perNftPower].map((v) => v.toString())
  }, [
    userDelegatedPower.perNftPower,
    userOwnedPower.perNftPower,
    withDelegated,
  ])

  return useMemo(() => {
    return allNftsId.reduce((acc, id, index) => {
      return {
        ...acc,
        [id]: allNftsPower[index],
      }
    }, {})
  }, [allNftsId, allNftsPower])
}
