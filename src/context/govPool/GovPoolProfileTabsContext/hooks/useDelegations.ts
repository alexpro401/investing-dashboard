import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "urql"
import { BigNumber } from "@ethersproject/bignumber"
import { isNumber } from "lodash"

import { useActiveWeb3React } from "hooks"
import {
  useGovPoolNftVotingPower,
  useGovPoolDelegations,
  useGovPoolHelperContracts,
  useGovPoolVotingPowerMulticall,
} from "hooks/dao"
import { DaoPoolDaoProfileTotalDelegationsQuery } from "queries"
import { isAddress } from "utils"
import { graphClientDaoPools } from "utils/graphClient"

interface IUseDelegationsProps {
  startLoading: boolean
}

interface ITotalDelegationsQuery {
  daoPool: {
    totalCurrentTokenDelegated: string
    totalCurrentNFTDelegated: string[]
  }
}

const useDelegations = ({ startLoading }: IUseDelegationsProps) => {
  const { daoAddress } = useParams<"daoAddress">()
  const { account } = useActiveWeb3React()

  const [loaded, setLoaded] = useState<boolean>(false)
  const [totalDelegatedTokensVotingPower, setTotalDelegatedTokensVotingPower] =
    useState<BigNumber | undefined>(undefined)
  const [totalNftsListDelegated, setTotalNftsListDelegated] = useState<
    string[]
  >([])
  const { govUserKeeperAddress } = useGovPoolHelperContracts(daoAddress)
  const [totalDelegatedNftVotingPower, , totalDelegatedNftVotingPowerLoading] =
    useGovPoolNftVotingPower(
      startLoading && !loaded ? daoAddress : undefined,
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
      context: graphClientDaoPools,
      pause: useMemo(
        () =>
          !startLoading ||
          loaded ||
          !isAddress(daoAddress) ||
          !isAddress(account),
        [daoAddress, account, startLoading, loaded]
      ),
    })

  useEffect(() => {
    if (
      !totalDelegationsFetching &&
      totalDelegationsData?.daoPool &&
      startLoading &&
      !loaded
    ) {
      setTotalDelegatedTokensVotingPower(
        BigNumber.from(totalDelegationsData.daoPool.totalCurrentTokenDelegated)
      )
      setTotalNftsListDelegated(
        totalDelegationsData.daoPool.totalCurrentNFTDelegated
      )
    }
  }, [totalDelegationsData, totalDelegationsFetching, startLoading, loaded])

  useEffect(() => {
    if (
      !totalDelegationsFetching &&
      !totalDelegatedNftVotingPowerLoading &&
      !votingPowerDataLoading &&
      totalDelegatedTokensVotingPower &&
      totalDelegatedNftVotingPower &&
      isNumber(totalTokensDelegatee) &&
      isNumber(totalNftDelegatee) &&
      myDelegations &&
      votingPowerData
    ) {
      setLoaded(true)
    }
  }, [
    totalDelegationsFetching,
    totalDelegatedNftVotingPowerLoading,
    votingPowerDataLoading,
    totalDelegatedTokensVotingPower,
    totalDelegatedNftVotingPower,
    totalTokensDelegatee,
    totalNftDelegatee,
    myDelegations,
    votingPowerData,
  ])

  return {
    loading: loaded
      ? false
      : totalDelegationsFetching ||
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
