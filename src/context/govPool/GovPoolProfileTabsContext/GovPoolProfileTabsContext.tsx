import { createContext, useState } from "react"
import { BigNumber } from "@ethersproject/bignumber"

import { EDaoProfileTab } from "types/govPoolProfile.types"
import {
  useValidators,
  useDelegations,
  useMyBalance,
  useAboutDao,
} from "./hooks"

type UintArrayStructOutput = [BigNumber[], BigNumber] & {
  values: BigNumber[]
  length: BigNumber
}

interface IValidator {
  id: string
  balance: string
}

interface ITokenDelegatee {
  id: string
  receivedDelegation: string
}

interface INftDelegatee {
  id: string
  receivedNFTDelegation: string[]
  votingPower: string
}

interface IGovPoolProfileTabsContext {
  currentTab: { get: EDaoProfileTab; set: (value: EDaoProfileTab) => void }

  //about
  myVotingPower: BigNumber | undefined
  aboutDaoLoading: boolean

  //validators
  validatorsCount: number | null
  validators: undefined | IValidator[]
  setValidators: (v: undefined | IValidator[]) => void
  validatorsLoading: boolean

  //myBalance
  myProposalsCount: number | null
  receivedRewardsUSD: string | null
  unclaimedProposalsCount: number | null
  erc20Balances: {
    walletBalance: BigNumber
    poolBalance: BigNumber
    delegatedBalance: BigNumber
  }
  erc721Balances: {
    walletBalance: number[]
    poolBalance: number[]
    delegatedBalance: number[]
  }
  withdrawableAssets:
    | ([BigNumber, UintArrayStructOutput] & {
        tokens: BigNumber
        nfts: UintArrayStructOutput
      })
    | undefined
  myBalanceLoading: boolean

  //delegations
  delegationsLoading: boolean
  totalDelegatedNftVotingPower: BigNumber | undefined
  totalDelegatedTokensVotingPower: BigNumber | undefined
  totalTokensDelegatee: number | undefined
  totalNftDelegatee: number | undefined
  topTokenDelegatee: undefined | ITokenDelegatee[]
  setTopTokenDelegatee: (v: undefined | ITokenDelegatee[]) => void
  topNftDelegatee: undefined | INftDelegatee[]
  setTopNftDelegatee: (v: undefined | INftDelegatee[]) => void
  delegatedVotingPowerByMe: BigNumber | undefined
  delegatedVotingPowerToMe: BigNumber | undefined
}

export const GovPoolProfileTabsContext =
  createContext<IGovPoolProfileTabsContext>({
    currentTab: { get: EDaoProfileTab.about, set: () => {} },

    //about
    myVotingPower: undefined,
    aboutDaoLoading: false,

    //validators
    validatorsCount: null,
    validators: undefined,
    setValidators: () => {},
    validatorsLoading: false,

    //my-balance
    myProposalsCount: null,
    receivedRewardsUSD: null,
    unclaimedProposalsCount: null,
    erc20Balances: {
      walletBalance: BigNumber.from("0"),
      poolBalance: BigNumber.from("0"),
      delegatedBalance: BigNumber.from("0"),
    },
    erc721Balances: {
      walletBalance: [],
      poolBalance: [],
      delegatedBalance: [],
    },
    withdrawableAssets: undefined,
    myBalanceLoading: false,

    //delegations
    delegationsLoading: false,
    totalDelegatedNftVotingPower: undefined,
    totalDelegatedTokensVotingPower: undefined,
    totalTokensDelegatee: undefined,
    totalNftDelegatee: undefined,
    topTokenDelegatee: undefined,
    setTopTokenDelegatee: () => {},
    topNftDelegatee: undefined,
    setTopNftDelegatee: () => {},
    delegatedVotingPowerByMe: undefined,
    delegatedVotingPowerToMe: undefined,
  })

interface IGovPoolProfileTabsContextProviderProps {
  children?: React.ReactNode
}

const GovPoolProfileTabsContextProvider: React.FC<
  IGovPoolProfileTabsContextProviderProps
> = ({ children }) => {
  const [_currentTab, _setCurrentTab] = useState<EDaoProfileTab>(
    EDaoProfileTab.about
  )

  const [_validators, _setValidators] = useState<undefined | IValidator[]>(
    undefined
  )

  const [_topTokenDelegatee, _setTopTokenDelegatee] = useState<
    undefined | ITokenDelegatee[]
  >(undefined)
  const [_topNftDelegatee, _setTopNftDelegatee] = useState<
    undefined | INftDelegatee[]
  >(undefined)

  const { loading: aboutDaoLoading, myVotingPower } = useAboutDao({
    startLoading: _currentTab === EDaoProfileTab.about,
  })

  const { validatorsCount, loading: validatorsLoading } = useValidators({
    startLoading: _currentTab === EDaoProfileTab.validators,
  })

  const {
    totalDelegatedNftVotingPower,
    totalDelegatedTokensVotingPower,
    totalTokensDelegatee,
    totalNftDelegatee,
    delegatedVotingPowerByMe,
    delegatedVotingPowerToMe,
    loading: delegationsLoading,
  } = useDelegations({
    startLoading: _currentTab === EDaoProfileTab.delegations,
  })

  const {
    proposalsCount,
    receivedRewardsUSD,
    unclaimedProposalsCount,
    withdrawableAssets,
    erc20Balances,
    erc721Balances,
    loading: myBalanceLoading,
  } = useMyBalance({
    startLoading: _currentTab === EDaoProfileTab.my_balance,
  })

  return (
    <GovPoolProfileTabsContext.Provider
      value={{
        currentTab: { get: _currentTab, set: _setCurrentTab },

        //about
        myVotingPower,
        aboutDaoLoading,

        //validators
        validatorsCount: validatorsCount,
        validators: _validators,
        setValidators: _setValidators,
        validatorsLoading,

        //myBalance
        myProposalsCount: proposalsCount,
        receivedRewardsUSD: receivedRewardsUSD,
        unclaimedProposalsCount: unclaimedProposalsCount,
        withdrawableAssets,
        erc20Balances,
        erc721Balances,
        myBalanceLoading,

        //delegations
        delegationsLoading,
        totalDelegatedNftVotingPower: totalDelegatedNftVotingPower,
        totalDelegatedTokensVotingPower: totalDelegatedTokensVotingPower,
        totalTokensDelegatee: totalTokensDelegatee,
        totalNftDelegatee: totalNftDelegatee,
        topTokenDelegatee: _topTokenDelegatee,
        setTopTokenDelegatee: _setTopTokenDelegatee,
        topNftDelegatee: _topNftDelegatee,
        setTopNftDelegatee: _setTopNftDelegatee,
        delegatedVotingPowerByMe: delegatedVotingPowerByMe,
        delegatedVotingPowerToMe: delegatedVotingPowerToMe,
      }}
    >
      {children}
    </GovPoolProfileTabsContext.Provider>
  )
}

export default GovPoolProfileTabsContextProvider
