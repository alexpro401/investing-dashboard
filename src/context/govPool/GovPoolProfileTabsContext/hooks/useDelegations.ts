import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { createClient, useQuery } from "urql"
import { BigNumber } from "@ethersproject/bignumber"

import { useActiveWeb3React } from "hooks"
import {
  useGovPoolNftVotingPower,
  useGovPoolDelegations,
  useGovPoolHelperContracts,
  useGovPoolVotingPowerMulticall,
} from "hooks/dao"
import { DaoPoolDaoProfileTotalDelegationsQuery } from "queries/gov-pools"
import { isAddress } from "utils"

interface IUseDelegationsProps {
  startLoading: boolean
}

interface ITotalDelegationsQuery {
  daoPool: {
    totalCurrentTokenDelegated: string
    totalCurrentNFTDelegated: string[]
  }
}

const daoGraphClient = createClient({
  url: process.env.REACT_APP_DAO_POOLS_API_URL || "",
  requestPolicy: "network-only",
})

const useDelegations = ({ startLoading }: IUseDelegationsProps) => {
  const { daoAddress } = useParams<"daoAddress">()
  const { account } = useActiveWeb3React()
  const [totalDelegatedTokensVotingPower, setTotalDelegatedTokensVotingPower] =
    useState<BigNumber | undefined>(undefined)
  const [totalNftsListDelegated, setTotalNftsListDelegated] = useState<
    string[]
  >([])
  const { govUserKeeperAddress } = useGovPoolHelperContracts(daoAddress)
  const [totalDelegatedNftVotingPower, , totalDelegatedNftVotingPowerLoading] =
    useGovPoolNftVotingPower(
      startLoading ? daoAddress : undefined,
      totalNftsListDelegated
    )
  const myDelegations = useGovPoolDelegations({
    daoPoolAddress: startLoading ? daoAddress : undefined,
    user: account ?? "",
  })

  const votingPowerParams = useMemo(
    () => ({
      userKeeperAddresses: [govUserKeeperAddress],
      params: {
        address: [account],
        isMicroPool: [true],
        useDelegated: [false],
      },
    }),

    [account, govUserKeeperAddress]
  )

  const [votingPowerData, votingPowerDataLoading] =
    useGovPoolVotingPowerMulticall(votingPowerParams)

  const [totalTokensDelegatee, setTotalTokensDelegatee] = useState<number>(5)
  const [totalNftDelegatee, setTotalNftDelegatee] = useState<number>(5)

  const [{ fetching: totalDelegationsFetching, data: totalDelegationsData }] =
    useQuery<ITotalDelegationsQuery>({
      query: DaoPoolDaoProfileTotalDelegationsQuery,
      variables: useMemo(() => ({ address: daoAddress }), [daoAddress]),
      context: daoGraphClient,
      pause: useMemo(
        () => !startLoading || !isAddress(daoAddress) || !isAddress(account),
        [daoAddress, account, startLoading]
      ),
      requestPolicy: "network-only",
    })

  useEffect(() => {
    if (
      !totalDelegationsFetching &&
      totalDelegationsData?.daoPool &&
      startLoading
    ) {
      setTotalDelegatedTokensVotingPower(
        BigNumber.from(totalDelegationsData.daoPool.totalCurrentTokenDelegated)
      )
      setTotalNftsListDelegated(
        totalDelegationsData.daoPool.totalCurrentNFTDelegated
      )
    }
  }, [totalDelegationsData, totalDelegationsFetching, startLoading])

  return {
    loading:
      totalDelegationsFetching ||
      totalDelegatedNftVotingPowerLoading ||
      votingPowerDataLoading ||
      false,
    totalDelegatedTokensVotingPower,
    totalDelegatedNftVotingPower,
    totalTokensDelegatee,
    totalNftDelegatee,
    delegatedVotingPowerByMe: myDelegations ? myDelegations.power : undefined,
    delegatedVotingPowerToMe: votingPowerData
      ? votingPowerData.micropool[govUserKeeperAddress ?? ""]?.power ??
        undefined
      : undefined,
  }
}

export default useDelegations
