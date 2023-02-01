import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { BigNumber } from "@ethersproject/bignumber"

import { useActiveWeb3React } from "hooks"
import { useGovPoolUserVotingPower, useGovPoolHelperContracts } from "hooks/dao"
import { addBignumbers } from "utils/formulas"

interface IUseAboutDaoProps {
  startLoading: boolean
}

const useAboutDao = ({ startLoading }: IUseAboutDaoProps) => {
  const { daoAddress } = useParams()
  const { account } = useActiveWeb3React()

  const [loaded, setLoaded] = useState<boolean>(false)
  const [myVotingPower, setMyVotingPower] = useState<BigNumber | undefined>(
    undefined
  )
  const { govUserKeeperAddress } = useGovPoolHelperContracts(
    startLoading && !loaded ? daoAddress ?? undefined : undefined
  )

  const [userVotingPowers, userVotingPowersLoading] = useGovPoolUserVotingPower(
    {
      userKeeperAddress: govUserKeeperAddress,
      address: account,
    }
  )

  useEffect(() => {
    if (userVotingPowers && !userVotingPowersLoading && !loaded) {
      setMyVotingPower(
        addBignumbers(
          [userVotingPowers.power, 18],
          [userVotingPowers.nftPower, 18]
        )
      )
    }
  }, [userVotingPowers, userVotingPowersLoading, loaded])

  useEffect(() => {
    if (myVotingPower && !userVotingPowersLoading) {
      setLoaded(true)
    }
  }, [myVotingPower, userVotingPowersLoading])

  return {
    loading: loaded ? false : userVotingPowersLoading,
    myVotingPower,
  }
}

export default useAboutDao
