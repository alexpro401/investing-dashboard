import { createContext, useEffect, useState } from "react"

import { EDaoProfileTab, IGovPoolDescription } from "types/dao.types"
import { useAboutDao, useValidators } from "./hooks"

interface IGovPoolProfileTabsContext {
  currentTab: { get: EDaoProfileTab; set: (value: EDaoProfileTab) => void }

  //about
  daoDescription: IGovPoolDescription | null
  aboutDaoLoading: boolean

  //validators
  validatorsCount: number | null
  validatorsLoading: boolean
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
      }}
    >
      {children}
    </GovPoolProfileTabsContext.Provider>
  )
}

export default GovPoolProfileTabsContextProvider
