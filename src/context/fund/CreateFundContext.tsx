import React, { createContext, useState, Dispatch, SetStateAction } from "react"

import { Token } from "lib/entities"

interface ICreateFundContext {
  avatarUrl: { get: string; set: Dispatch<SetStateAction<string>> }
  fundName: { get: string; set: Dispatch<SetStateAction<string>> }
  tickerSymbol: { get: string; set: Dispatch<SetStateAction<string>> }
  description: { get: string; set: Dispatch<SetStateAction<string>> }
  strategy: { get: string; set: Dispatch<SetStateAction<string>> }
  baseToken: {
    get: undefined | Token
    set: Dispatch<SetStateAction<undefined | Token>>
  }
}

export const CreateFundContext = createContext<ICreateFundContext>({
  avatarUrl: { get: "", set: () => {} },
  fundName: { get: "", set: () => {} },
  tickerSymbol: { get: "", set: () => {} },
  description: { get: "", set: () => {} },
  strategy: { get: "", set: () => {} },
  baseToken: { get: undefined, set: () => {} },
})

interface ICreateFundContextProviderProp {
  children: React.ReactNode
}

const CreateFundContextProvider: React.FC<ICreateFundContextProviderProp> = ({
  children,
}) => {
  const [_avatarUrl, _setAvatarUrl] = useState<string>("")
  const [_fundName, _setFundName] = useState<string>("")
  const [_tickerSymbol, _setTickerSymbol] = useState<string>("")
  const [_baseToken, _setBaseToken] = useState<undefined | Token>(undefined)

  const [_description, _setDescription] = useState<string>("")
  const [_strategy, _setStrategy] = useState<string>("")

  return (
    <CreateFundContext.Provider
      value={{
        avatarUrl: { get: _avatarUrl, set: _setAvatarUrl },
        fundName: { get: _fundName, set: _setFundName },
        tickerSymbol: { get: _tickerSymbol, set: _setTickerSymbol },
        description: { get: _description, set: _setDescription },
        strategy: { get: _strategy, set: _setStrategy },
        baseToken: { get: _baseToken, set: _setBaseToken },
      }}
    >
      {children}
    </CreateFundContext.Provider>
  )
}

export default CreateFundContextProvider
