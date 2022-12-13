import { createContext, useEffect, useState } from "react"

import { EDaoProfileTab, IGovPoolDescription } from "types/dao.types"
import {
  useAboutDao,
  useValidators,
  useDelegations,
  useMyBalance,
} from "./hooks"

interface IGovPoolProfileTabsContext {
  currentTab: { get: EDaoProfileTab; set: (value: EDaoProfileTab) => void }

  //about
  daoDescription: IGovPoolDescription | null
  aboutDaoLoading: boolean

  //validators
  validatorsCount: number | null
  validatorsLoading: boolean

  //myBalance
  myProposalsCount: number | null
  receivedRewardsUSD: string | null
  unclaimedProposalsCount: number | null
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
    validatorsLoading: false,

    //my-balance
    myProposalsCount: null,
    receivedRewardsUSD: null,
    unclaimedProposalsCount: null,
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
    if (validatorsCount) {
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
    loading: myBalanceLoading,
  } = useMyBalance({
    startLoading: _currentTab === EDaoProfileTab.my_balance,
  })

  useEffect(() => {
    if (proposalsCount) {
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
        validatorsLoading,

        //myBalance
        myProposalsCount: _myProposalsCount,
        receivedRewardsUSD: _receivedRewardsUSD,
        unclaimedProposalsCount: _unclaimedProposalsCount,
        myBalanceLoading,
      }}
    >
      {children}
    </GovPoolProfileTabsContext.Provider>
  )
}

export default GovPoolProfileTabsContextProvider
