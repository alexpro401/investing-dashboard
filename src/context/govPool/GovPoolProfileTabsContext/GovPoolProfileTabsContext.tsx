import { createContext, useEffect, useState } from "react"
import { BigNumber } from "@ethersproject/bignumber"

import { EDaoProfileTab, IGovPoolDescription } from "types"
import {
  useAboutDao,
  useValidators,
  useDelegations,
  useMyBalance,
} from "./hooks"

type UintArrayStructOutput = [BigNumber[], BigNumber] & {
  values: BigNumber[]
  length: BigNumber
}

interface IValidator {
  id: string
  balance: string
}

interface IGovPoolProfileTabsContext {
  currentTab: { get: EDaoProfileTab; set: (value: EDaoProfileTab) => void }

  //about
  daoDescription: IGovPoolDescription | null
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
}

export const GovPoolProfileTabsContext =
  createContext<IGovPoolProfileTabsContext>({
    currentTab: { get: EDaoProfileTab.about, set: () => {} },

    //about
    daoDescription: null,
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
  const [_daoDescription, _setDaoDescription] =
    useState<IGovPoolDescription | null>(null)

  const [_validatorsCount, _setValidatorsCount] = useState<number | null>(null)
  const [_validators, _setValidators] = useState<undefined | IValidator[]>(
    undefined
  )

  const [_myProposalsCount, _setMyProposalsCount] = useState<number | null>(
    null
  )
  const [_receivedRewardsUSD, _setReceivedRewardsUSD] = useState<string | null>(
    null
  )
  const [_unclaimedProposalsCount, _setUnclaimedProposalsCount] = useState<
    number | null
  >(null)

  const { descriptionObject, loading: aboutDaoLoading } = useAboutDao({
    startLoading: _currentTab === EDaoProfileTab.about && !_daoDescription,
  })

  useEffect(() => {
    if (descriptionObject) {
      _setDaoDescription(descriptionObject)
    }
  }, [descriptionObject])

  const { validatorsCount, loading: validatorsLoading } = useValidators({
    startLoading:
      _currentTab === EDaoProfileTab.validators && _validatorsCount === null,
  })

  useEffect(() => {
    if (validatorsCount !== null) {
      _setValidatorsCount(validatorsCount)
    }
  }, [validatorsCount])

  const some = useDelegations({
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

  useEffect(() => {
    if (proposalsCount !== null) {
      _setMyProposalsCount(proposalsCount)
    }
  }, [proposalsCount])

  useEffect(() => {
    if (receivedRewardsUSD) {
      _setReceivedRewardsUSD(receivedRewardsUSD)
    }
  }, [receivedRewardsUSD])

  useEffect(() => {
    if (unclaimedProposalsCount) {
      _setUnclaimedProposalsCount(unclaimedProposalsCount)
    }
  }, [unclaimedProposalsCount])

  return (
    <GovPoolProfileTabsContext.Provider
      value={{
        currentTab: { get: _currentTab, set: _setCurrentTab },

        //about
        daoDescription: _daoDescription,
        aboutDaoLoading,

        //validators
        validatorsCount: _validatorsCount,
        validators: _validators,
        setValidators: _setValidators,
        validatorsLoading,

        //myBalance
        myProposalsCount: _myProposalsCount,
        receivedRewardsUSD: _receivedRewardsUSD,
        unclaimedProposalsCount: _unclaimedProposalsCount,
        withdrawableAssets,
        erc20Balances,
        erc721Balances,
        myBalanceLoading,
      }}
    >
      {children}
    </GovPoolProfileTabsContext.Provider>
  )
}

export default GovPoolProfileTabsContextProvider
