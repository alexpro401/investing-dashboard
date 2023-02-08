import React, { createContext, useState, Dispatch, SetStateAction } from "react"

import { Token } from "lib/entities"
import { ICommissionPeriodType, SUPPORTED_SOCIALS } from "consts"

interface ICreateFundContext {
  socialLinks: {
    get: [SUPPORTED_SOCIALS, string][]
    set: Dispatch<SetStateAction<[SUPPORTED_SOCIALS, string][]>>
  }
  avatarUrl: { get: string; set: Dispatch<SetStateAction<string>> }
  fundName: { get: string; set: Dispatch<SetStateAction<string>> }
  tickerSymbol: { get: string; set: Dispatch<SetStateAction<string>> }
  description: { get: string; set: Dispatch<SetStateAction<string>> }
  descriptionURL: { get: string; set: Dispatch<SetStateAction<string>> }
  strategy: { get: string; set: Dispatch<SetStateAction<string>> }
  baseToken: {
    get: undefined | Token
    set: Dispatch<SetStateAction<undefined | Token>>
  }
  isLimitedEmission: { get: boolean; set: Dispatch<SetStateAction<boolean>> }
  limitedEmission: { get: string; set: Dispatch<SetStateAction<string>> }
  isMinInvestmentAmount: {
    get: boolean
    set: Dispatch<SetStateAction<boolean>>
  }
  minInvestmentAmount: {
    get: string
    set: Dispatch<SetStateAction<string>>
  }
  isFundManagers: {
    get: boolean
    set: Dispatch<SetStateAction<boolean>>
  }
  fundManagers: {
    get: string[]
    set: Dispatch<SetStateAction<string[]>>
  }
  isPrivatAddresses: {
    get: boolean
    set: Dispatch<SetStateAction<boolean>>
  }
  privateAddresses: {
    get: string[]
    set: Dispatch<SetStateAction<string[]>>
  }
  feeType: {
    get: ICommissionPeriodType
    set: Dispatch<SetStateAction<ICommissionPeriodType>>
  }
  comission: {
    get: number
    set: Dispatch<SetStateAction<number>>
  }
}

export const CreateFundContext = createContext<ICreateFundContext>({
  socialLinks: { get: [], set: () => {} },
  avatarUrl: { get: "", set: () => {} },
  fundName: { get: "", set: () => {} },
  tickerSymbol: { get: "", set: () => {} },
  description: { get: "", set: () => {} },
  descriptionURL: { get: "", set: () => {} },
  strategy: { get: "", set: () => {} },
  baseToken: { get: undefined, set: () => {} },
  isLimitedEmission: { get: false, set: () => {} },
  limitedEmission: { get: "", set: () => {} },
  isMinInvestmentAmount: {
    get: false,
    set: () => {},
  },
  minInvestmentAmount: {
    get: "",
    set: () => {},
  },
  isFundManagers: {
    get: false,
    set: () => {},
  },
  fundManagers: { get: [], set: () => {} },
  isPrivatAddresses: {
    get: false,
    set: () => {},
  },
  privateAddresses: {
    get: [],
    set: () => {},
  },
  feeType: {
    get: "1 month",
    set: () => {},
  },
  comission: {
    get: 20,
    set: () => {},
  },
})

interface ICreateFundContextProviderProp {
  children: React.ReactNode
}

const CreateFundContextProvider: React.FC<ICreateFundContextProviderProp> = ({
  children,
}) => {
  const [_socialLinks, _setSocialLinks] = useState<
    [SUPPORTED_SOCIALS, string][]
  >([])
  const [_avatarUrl, _setAvatarUrl] = useState<string>("")
  const [_fundName, _setFundName] = useState<string>("")
  const [_tickerSymbol, _setTickerSymbol] = useState<string>("")
  const [_baseToken, _setBaseToken] = useState<undefined | Token>(undefined)

  const [_description, _setDescription] = useState<string>("")
  const [_descriptionURL, _setDescriptionURL] = useState<string>("")
  const [_strategy, _setStrategy] = useState<string>("")

  const [_isLimitedEmission, _setIsLimitedEmmision] = useState<boolean>(false)
  const [_limitedEmission, _setLimitedEmission] = useState<string>("")

  const [_isMinInvestmentAmount, _setIsMinInvestmentAmount] =
    useState<boolean>(false)
  const [_minInvestmentAmount, _setMinInvestmentAmount] = useState<string>("")

  const [_isFundManagers, _setIsFundManagers] = useState<boolean>(false)
  const [_fundManagers, _setFundManagers] = useState<string[]>([])

  const [_isPrivatAddresses, _setIsPrivatAddresses] = useState<boolean>(false)
  const [_privateAddresses, _setPrivateAddresses] = useState<string[]>([])

  const [_feeType, _setFeeType] = useState<ICommissionPeriodType>("1 month")
  const [_comission, _setComission] = useState<number>(20)

  return (
    <CreateFundContext.Provider
      value={{
        socialLinks: { get: _socialLinks, set: _setSocialLinks },
        avatarUrl: { get: _avatarUrl, set: _setAvatarUrl },
        fundName: { get: _fundName, set: _setFundName },
        tickerSymbol: { get: _tickerSymbol, set: _setTickerSymbol },
        description: { get: _description, set: _setDescription },
        descriptionURL: { get: _descriptionURL, set: _setDescriptionURL },
        strategy: { get: _strategy, set: _setStrategy },
        baseToken: { get: _baseToken, set: _setBaseToken },
        isLimitedEmission: {
          get: _isLimitedEmission,
          set: _setIsLimitedEmmision,
        },
        limitedEmission: { get: _limitedEmission, set: _setLimitedEmission },
        isMinInvestmentAmount: {
          get: _isMinInvestmentAmount,
          set: _setIsMinInvestmentAmount,
        },
        minInvestmentAmount: {
          get: _minInvestmentAmount,
          set: _setMinInvestmentAmount,
        },
        isFundManagers: {
          get: _isFundManagers,
          set: _setIsFundManagers,
        },
        fundManagers: {
          get: _fundManagers,
          set: _setFundManagers,
        },
        isPrivatAddresses: {
          get: _isPrivatAddresses,
          set: _setIsPrivatAddresses,
        },
        privateAddresses: {
          get: _privateAddresses,
          set: _setPrivateAddresses,
        },
        feeType: {
          get: _feeType,
          set: _setFeeType,
        },
        comission: {
          get: _comission,
          set: _setComission,
        },
      }}
    >
      {children}
    </CreateFundContext.Provider>
  )
}

export default CreateFundContextProvider
