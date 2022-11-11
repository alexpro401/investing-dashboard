import { BigNumber } from "@ethersproject/bignumber"
import { ZERO } from "constants/index"
import { useGovUserKeeperContract } from "contracts"
import { useActiveWeb3React } from "hooks"
import { useCallback, useEffect, useState } from "react"

interface Props {
  daoPoolAddress?: string
  isMicroPool?: boolean
  useDelegated?: boolean
}

const useGovUserKeeperVotingPower = ({
  daoPoolAddress,
  isMicroPool,
  useDelegated,
}: Props) => {
  const userKeeper = useGovUserKeeperContract(daoPoolAddress)
  const { account } = useActiveWeb3React()

  const [power, setPower] = useState<{
    power: BigNumber
    nftPower: BigNumber[]
  }>({ power: ZERO, nftPower: [] })

  const fetchPower = useCallback(async () => {
    try {
      const { power, nftPower } = await userKeeper!.votingPower(
        account!,
        isMicroPool || false,
        useDelegated || false
      )
      setPower({ power, nftPower })
    } catch {}
  }, [account, isMicroPool, useDelegated, userKeeper])

  useEffect(() => {
    if (!userKeeper || !account) return

    fetchPower()
  }, [account, fetchPower, userKeeper])

  return power
}

export default useGovUserKeeperVotingPower
