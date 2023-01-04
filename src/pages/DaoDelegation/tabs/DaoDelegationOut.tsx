import * as React from "react"
import { useWeb3React } from "@web3-react/core"
import { PulseSpinner } from "react-spinners-kit"
import { BigNumber } from "@ethersproject/bignumber"
import { isEmpty, isNil, map, filter } from "lodash"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

import * as S from "../styled"
import theme, { Center } from "theme"

import { Token } from "interfaces"
import LoadMore from "components/LoadMore"
import { GovPoolActiveDelegations } from "queries"
import useQueryPagination from "hooks/useQueryPagination"
import GovTokenDelegationCard from "components/cards/GovTokenDelegation"
import { IGovVoterInPoolPairsQuery } from "interfaces/thegraphs/gov-pools"
import { NoDataMessage } from "common"
import {
  useGovPoolHelperContracts,
  useGovPoolVotingPowerMulticall,
} from "hooks"

interface Props {
  govPoolAddress?: string
  token: Token | null
}

const DaoDelegationOut: React.FC<Props> = ({ govPoolAddress, token }) => {
  const { chainId, account } = useWeb3React()

  const [{ data, loading }, fetchMore] =
    useQueryPagination<IGovVoterInPoolPairsQuery>({
      query: GovPoolActiveDelegations(true),
      variables: React.useMemo(
        () => ({
          account: String(account)
            .toLocaleLowerCase()
            .concat(
              String(govPoolAddress).replace("0x", "").toLocaleLowerCase()
            ),
        }),
        [account, govPoolAddress]
      ),
      pause: isNil(account) || isNil(govPoolAddress),
      formatter: (newDataSlice, loadedData) => {
        const withAmounts = filter(
          newDataSlice.voterInPoolPairs,
          (dh) =>
            BigNumber.from(dh.delegateAmount).gt(0) ||
            dh.delegateNfts.length > 0
        )

        return loadedData.length > 0
          ? filter(withAmounts, (dh) => loadedData.includes(dh))
          : withAmounts
      },
    })

  const { govUserKeeperAddress } = useGovPoolHelperContracts(govPoolAddress)
  const votingPowerParams = React.useMemo(
    () => ({
      userKeeperAddresses: [govUserKeeperAddress],
      params: {
        address: [account],
        isMicroPool: [false],
        useDelegated: [true],
      },
    }),
    [account, govUserKeeperAddress]
  )

  const [votingPowerData, votingPowerDataLoading] =
    useGovPoolVotingPowerMulticall(votingPowerParams)

  const nftIdToVotingPowerMap = React.useMemo<Record<string, BigNumber>>(() => {
    if (
      !govUserKeeperAddress ||
      votingPowerDataLoading ||
      isEmpty(votingPowerData.delegated)
    ) {
      return {}
    }

    return votingPowerData.delegated[govUserKeeperAddress].nftIds.reduce(
      (acc, nftId, index) => {
        acc[nftId.toString()] =
          votingPowerData.delegated[govUserKeeperAddress].perNftPower[index]
        return acc
      },
      {}
    )
  }, [votingPowerData, votingPowerDataLoading, govUserKeeperAddress])

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
      {map(data, (dh) => (
        <S.Indents top key={dh.id}>
          <GovTokenDelegationCard
            data={dh}
            chainId={chainId}
            alwaysShowMore={data.length === 1 ? true : undefined}
            token={token}
            nftsPower={nftIdToVotingPowerMap}
          />
        </S.Indents>
      ))}
      <LoadMore
        isLoading={loading && !!data.length}
        handleMore={fetchMore}
        r={loader}
      />
    </S.List>
  )
}

export default DaoDelegationOut
