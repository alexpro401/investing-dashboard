import * as React from "react"
import * as S from "../styled"
import { isEmpty, isNil, map } from "lodash"
import { useWeb3React } from "@web3-react/core"
import { PulseSpinner } from "react-spinners-kit"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

import theme, { Center, Flex, Text } from "theme"
import GovDelegateeCard from "components/cards/GovDelegatee"
import {
  GovPoolDelegationHistoryByUserQuery,
  GovVoterInPoolQuery,
} from "queries"
import useQueryPagination from "hooks/useQueryPagination"
import LoadMore from "components/LoadMore"
import useGovPoolUserVotingPower from "hooks/dao/useGovPoolUserVotingPower"
import { normalizeBigNumber } from "utils"
import {
  IGovPoolDelegationHistoryQuery,
  IGovPoolVoterQuery,
} from "interfaces/thegraphs/gov-pools"
import { Token } from "interfaces"
import { useGovPoolHelperContracts } from "hooks/dao"
import { NoDataMessage } from "common"
import { useMemo } from "react"
import { addBignumbers } from "utils/formulas"
import { createClient, useQuery } from "urql"

const govPoolsClient = createClient({
  url: process.env.REACT_APP_DAO_POOLS_API_URL || "",
})

interface DaoDelegationInProps {
  token: Token | null
  govPoolAddress?: string
}

const DaoDelegationIn: React.FC<DaoDelegationInProps> = ({
  govPoolAddress,
  token,
}) => {
  const { chainId, account } = useWeb3React()

  const { govUserKeeperAddress } = useGovPoolHelperContracts(
    govPoolAddress ?? ""
  )

  const [{ power, nftPower }, loadingPower] = useGovPoolUserVotingPower({
    userKeeperAddress: govUserKeeperAddress ?? "",
    address: account ?? "",
    isMicroPool: true,
    useDelegated: false,
  })

  const totalPower = useMemo(() => {
    if (loadingPower) {
      return "0.0"
    }

    const BN = addBignumbers([power, 18], [nftPower, 18])

    return normalizeBigNumber(BN, 18, 2)
  }, [power, nftPower, loadingPower])

  const [{ data, loading }, fetchMore] =
    useQueryPagination<IGovPoolDelegationHistoryQuery>({
      query: GovPoolDelegationHistoryByUserQuery(false),
      variables: React.useMemo(
        () => ({
          address: govPoolAddress,
          account,
        }),
        [account, govPoolAddress]
      ),
      pause: isNil(account) || isNil(govPoolAddress),
      formatter: (d) => d.delegationHistories,
    })

  const [votersInPool] = useQuery<{
    voterInPools: IGovPoolVoterQuery[]
  }>({
    query: GovVoterInPoolQuery,
    variables: React.useMemo(
      () => ({
        pool: govPoolAddress,
        voter: account,
      }),
      [govPoolAddress, account]
    ),
    pause: isNil(account) || isNil(govPoolAddress),
    context: govPoolsClient,
  })

  const totalAddresses = React.useMemo(() => {
    if (
      votersInPool.fetching ||
      votersInPool.error ||
      votersInPool.data === undefined
    ) {
      return "0"
    }
    return votersInPool.data?.voterInPools[0]?.currentDelegatorsCount ?? "0"
  }, [votersInPool])

  const loader = React.useRef<any>()

  React.useEffect(() => {
    if (!loader.current) return
    disableBodyScroll(loader.current)

    return () => clearAllBodyScrollLocks()
  }, [loader, loading])

  if (loading && (isEmpty(data) || isNil(data))) {
    return (
      <S.List>
        <Center>
          <PulseSpinner color={theme.statusColors.success} />
        </Center>
      </S.List>
    )
  }

  if (!loading && isEmpty(data)) {
    return (
      <S.List>
        <Center>
          <NoDataMessage />
        </Center>
      </S.List>
    )
  }

  return (
    <S.List ref={loader}>
      <S.Indents top>
        <Flex full ai={"center"} jc={"space-between"} m={"0 0 16px"}>
          <Text color={theme.textColors.primary}>
            Total addresses: {totalAddresses}
          </Text>
          <Text color={theme.textColors.primary}>
            Total delegate: {totalPower}
          </Text>
        </Flex>
        <Flex full dir={"column"} gap={"8"}>
          {map(data, (dh) => (
            <GovDelegateeCard
              data={dh}
              chainId={chainId}
              key={dh.id}
              token={token}
            />
          ))}
          <LoadMore
            isLoading={loading && !!data.length}
            handleMore={fetchMore}
            r={loader}
          />
        </Flex>
      </S.Indents>
    </S.List>
  )
}

export default DaoDelegationIn
