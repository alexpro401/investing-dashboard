import React, { createContext } from "react"
import { useParams } from "react-router-dom"
import { BigNumber } from "@ethersproject/bignumber"

import {
  useGovValidatorsValidatorsToken,
  useGovValidatorsTokenTotalSupply,
} from "hooks/dao"
import { Token } from "interfaces"

interface IGovPoolProfileCommonContext {
  validatorsTokenAddress: string
  validatorsToken: Token | null
  validatorsTotalVotes: BigNumber | null
}

export const GovPoolProfileCommonContext =
  createContext<IGovPoolProfileCommonContext>({
    validatorsTokenAddress: "",
    validatorsToken: null,
    validatorsTotalVotes: null,
  })

interface IGovPoolProfileCommonContextProviderProps {
  children: React.ReactNode
}

const GovPoolProfileCommonContextProvider: React.FC<
  IGovPoolProfileCommonContextProviderProps
> = ({ children }) => {
  const { daoAddress } = useParams<"daoAddress">()

  const [validatorsTokenAddress, validatorsToken] =
    useGovValidatorsValidatorsToken(daoAddress ?? "")

  const [validatorsTotalVotes] = useGovValidatorsTokenTotalSupply(daoAddress)

  return (
    <GovPoolProfileCommonContext.Provider
      value={{ validatorsToken, validatorsTokenAddress, validatorsTotalVotes }}
    >
      {children}
    </GovPoolProfileCommonContext.Provider>
  )
}

export default GovPoolProfileCommonContextProvider
