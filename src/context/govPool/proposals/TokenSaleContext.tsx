import React, { createContext, useState, useCallback, useMemo } from "react"
import { formatUnits, parseUnits } from "@ethersproject/units"
import { BigNumber } from "@ethersproject/bignumber"

import { ITreasuryToken } from "api/token/types"
import { useFormValidation } from "hooks"
import {
  required,
  isBnLte,
  isBnGt,
  minLength,
  maxLength,
  isAddressValidator,
} from "utils/validators"
import { cutStringZeroes, isAddress } from "utils"

interface ISellPair {
  tokenAddress: string
  amount: string
}

interface IFormValidation {
  isFieldsValid: boolean
  touchForm: () => void
  getFieldErrorMessage: (fieldPath: string) => string
  touchField: (fieldPath: string) => void
  isFieldValid: (fieldPath: string) => boolean
}

interface ITokenSaleProposal {
  selectedTreasuryToken: ITreasuryToken | null
  tokenAmount: string
  minAllocation: string
  maxAllocation: string
  sellStartDate: number
  sellEndDate: number
  proposalName: string
  proposalDescription: string
  sellPairs: ISellPair[]
  lockedPercent: string
  lockedDuration: number
  cliffDuration: number
  unlockStepDuration: number
  isWhitelist: boolean
  whitelistAddresses: string[]
}

const TOKEN_SALE_PROPOSAL_BASE: ITokenSaleProposal = {
  selectedTreasuryToken: null,
  tokenAmount: "",
  minAllocation: "",
  maxAllocation: "",
  sellStartDate: 0,
  sellEndDate: 0,
  proposalName: "",
  proposalDescription: "",
  sellPairs: [{ tokenAddress: "", amount: "" }],
  lockedPercent: "",
  lockedDuration: 0,
  cliffDuration: 0,
  unlockStepDuration: 0,
  isWhitelist: false,
  whitelistAddresses: [],
}

interface ITokenSaleCreatingContext {
  tokenSaleProposals: ITokenSaleProposal[]
  handleUpdateTokenSaleProposal: <T extends keyof ITokenSaleProposal>(
    index: number,
    field: T,
    value: ITokenSaleProposal[T]
  ) => void
  handleAddTokenSaleProposal: () => void
  handleDeleteTokenSellProposal: (index: number) => void
  currentProposalIndex: number
  setCurrentProposalIndex: (v: number) => void
  settingsValidation: IFormValidation
  vestingValidation: IFormValidation
  whitelistValidation: IFormValidation
}

interface ITokenSaleContextProviderProps {
  children: React.ReactNode
}

export const TokenSaleCreatingContext =
  createContext<ITokenSaleCreatingContext>({
    tokenSaleProposals: [],
    currentProposalIndex: 0,
    setCurrentProposalIndex: () => {},
    handleUpdateTokenSaleProposal: () => {},
    handleAddTokenSaleProposal: () => {},
    handleDeleteTokenSellProposal: () => {},
    settingsValidation: {} as IFormValidation,
    vestingValidation: {} as IFormValidation,
    whitelistValidation: {} as IFormValidation,
  })

const TokenSaleCreatingContextProvider: React.FC<
  ITokenSaleContextProviderProps
> = ({ children }) => {
  const [_tokenSaleProposals, _setTokenSaleProposals] = useState<
    ITokenSaleProposal[]
  >([TOKEN_SALE_PROPOSAL_BASE])
  const [_currentProposalIndex, _setCurrentProposalIndex] = useState<number>(0)

  const handleUpdateTokenSaleProposal = useCallback(function <
    T extends keyof ITokenSaleProposal
  >(index: number, field: T, value: ITokenSaleProposal[T]) {
    _setTokenSaleProposals((arr) => {
      const newArr = [...arr]
      newArr[index] = { ...newArr[index], [field]: value }

      return newArr
    })
  },
  [])

  const handleAddTokenSaleProposal = useCallback(() => {
    _setTokenSaleProposals((arr) => {
      const newArr = [...arr].concat([TOKEN_SALE_PROPOSAL_BASE])

      return newArr
    })
  }, [])

  const handleDeleteTokenSellProposal = useCallback((idx: number) => {
    _setTokenSaleProposals((arr) => {
      const newArr = [...arr].filter((_, index) => index !== idx)

      return newArr
    })
  }, [])

  const {
    selectedTreasuryToken,
    tokenAmount,
    minAllocation,
    maxAllocation,
    sellStartDate,
    sellEndDate,
    proposalDescription,
    proposalName,
    sellPairs,
    lockedPercent,
    lockedDuration,
    cliffDuration,
    unlockStepDuration,
    isWhitelist,
    whitelistAddresses,
  } = useMemo(
    () => _tokenSaleProposals[_currentProposalIndex],
    [_tokenSaleProposals, _currentProposalIndex]
  )

  const settingsValidation = useFormValidation(
    {
      selectedTreasuryToken: selectedTreasuryToken,
      tokenAmount: tokenAmount,
      proposalName: proposalName,
      proposalDescription: proposalDescription,
      sellStartDate: sellStartDate.toString(),
      sellEndDate: sellEndDate.toString(),
      minAllocation: minAllocation === "" ? "0" : minAllocation,
      maxAllocation: maxAllocation === "" ? "0" : maxAllocation,
      haveAtLeastOneTokenPair: sellPairs.length !== 0 ? "true" : "",
      sellPairsTokens: sellPairs.map((el) => el.tokenAddress),
      sellPairsAmounts: sellPairs.map((el) =>
        el.amount === "" ? "0" : el.amount
      ),
    },
    {
      selectedTreasuryToken: { required },
      proposalName: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(40),
      },
      proposalDescription: {
        maxLength: maxLength(1000),
      },
      sellStartDate: {
        required,
        isBnGt: isBnGt(
          formatUnits(BigNumber.from("0"), 18),
          18,
          "Please enter valid date"
        ),
      },
      sellEndDate: {
        required,
        isBnGt: isBnGt(
          sellStartDate.toString(),
          18,
          "End date must be greater than start date"
        ),
      },
      ...(selectedTreasuryToken
        ? {
            tokenAmount: {
              required,
              ...(tokenAmount
                ? {
                    isBnLte: isBnLte(
                      formatUnits(
                        selectedTreasuryToken.balance,
                        selectedTreasuryToken.contract_decimals
                      ).toString(),
                      selectedTreasuryToken.contract_decimals,
                      `Дао пул максимум має ${cutStringZeroes(
                        formatUnits(
                          selectedTreasuryToken.balance,
                          selectedTreasuryToken.contract_decimals
                        ).toString()
                      )} ${
                        selectedTreasuryToken.contract_ticker_symbol
                      } токенів. Оберіть валідне число`
                    ),
                    isBnGt: isBnGt(
                      formatUnits(
                        BigNumber.from("0"),
                        selectedTreasuryToken.contract_decimals
                      ),
                      selectedTreasuryToken.contract_decimals
                    ),
                  }
                : {}),
            },
            minAllocation: {
              required,
              ...(tokenAmount
                ? {
                    isBnGt: isBnGt(
                      formatUnits(
                        BigNumber.from("0"),
                        selectedTreasuryToken.contract_decimals
                      ),
                      selectedTreasuryToken.contract_decimals,
                      "Min allocation must be greater than 0"
                    ),
                  }
                : {}),
            },
            maxAllocation: {
              required,
              ...(tokenAmount
                ? {
                    isBnLte: isBnLte(
                      tokenAmount === "" ? "0" : tokenAmount,
                      selectedTreasuryToken.contract_decimals,
                      "Max allocation must be less than selected total token amount"
                    ),
                    isBnGt: isBnGt(
                      minAllocation === "" ? "0" : minAllocation,
                      selectedTreasuryToken.contract_decimals,
                      "Max allocation must be greater than min allocation"
                    ),
                  }
                : {}),
            },
          }
        : {}),
      haveAtLeastOneTokenPair: {
        required,
      },
      sellPairsTokens: {
        $every: {
          required,
          isAddressValidator,
        },
      },
      sellPairsAmounts: {
        $every: {
          required,
          isBnGt: isBnGt("0", 18, "Enter valid pair price"),
        },
      },
    }
  )

  const vestingValidation = useFormValidation(
    {
      lockedPercent: lockedPercent === "" ? "0" : lockedPercent,
      lockedDuration: lockedDuration === 0 ? "" : lockedDuration,
      cliffDuration: cliffDuration === 0 ? "" : cliffDuration,
      unlockStepDuration: unlockStepDuration === 0 ? "" : unlockStepDuration,
    },
    {
      lockedPercent: {
        required,
        isBnGt: isBnGt(
          formatUnits(BigNumber.from("0"), 18),
          18,
          "locked percent must be greater than zero"
        ),
        isBnLte: isBnLte(
          formatUnits(parseUnits("100", 18), 18),
          18,
          "locked percent must be less than 100"
        ),
      },
      lockedDuration: { required },
      cliffDuration: { required },
      unlockStepDuration: { required },
    }
  )

  const whitelistValidation = useFormValidation(
    {
      whitelistAddressesValid: isWhitelist
        ? whitelistAddresses.filter((el) => isAddress(el)).length ===
            whitelistAddresses.length && whitelistAddresses.length !== 0
          ? "valid"
          : ""
        : "valid",
    },
    {
      ...(isWhitelist
        ? {
            whitelistAddressesValid: {
              required,
            },
          }
        : {}),
    }
  )

  return (
    <TokenSaleCreatingContext.Provider
      value={{
        tokenSaleProposals: _tokenSaleProposals,
        handleUpdateTokenSaleProposal,
        handleAddTokenSaleProposal,
        handleDeleteTokenSellProposal,
        currentProposalIndex: _currentProposalIndex,
        setCurrentProposalIndex: _setCurrentProposalIndex,
        settingsValidation,
        vestingValidation,
        whitelistValidation,
      }}
    >
      {children}
    </TokenSaleCreatingContext.Provider>
  )
}

export default TokenSaleCreatingContextProvider
