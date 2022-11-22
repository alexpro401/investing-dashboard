import { ZERO } from "constants/index"
import { BigNumber, BigNumberish } from "@ethersproject/bignumber"
import { useCallback, useMemo, useState } from "react"
import {
  useGovValidatorsValidatorsToken,
  useGovValidatorsVote,
} from "hooks/dao"

export enum ButtonTypes {
  EMPTY_AMOUNT = "EMPTY_AMOUNT",
  SUBMIT = "SUBMIT",
}

// controller for page Validators vote Terminal
const useValidatorsVote = (daoPoolAddress?: string, isInternal?: boolean) => {
  // form state
  const [ERC20Amount, setERC20Amount] = useState(ZERO)

  const [tokenAddress, fromData, ERC20Balance] =
    useGovValidatorsValidatorsToken(daoPoolAddress ?? "")

  const { vote } = useGovValidatorsVote(daoPoolAddress)

  // UI data
  const formInfo = useMemo(() => {
    return {
      erc20: {
        address: tokenAddress,
        symbol: fromData?.symbol,
        decimal: fromData?.decimals,
        balance: ERC20Balance,
      },
    }
  }, [tokenAddress, fromData, ERC20Balance])

  // UI button variations
  const buttonType = useMemo(() => {
    if (ERC20Amount.isZero()) {
      return ButtonTypes.EMPTY_AMOUNT
    }

    return ButtonTypes.SUBMIT
  }, [ERC20Amount])

  const handleERC20Change = useCallback((targetValue: BigNumberish) => {
    const amount = BigNumber.from(targetValue)
    setERC20Amount(amount)
  }, [])

  const handleSubmit = useCallback(
    async (proposalId?: string) => {
      if (!proposalId) return

      await vote(proposalId, ERC20Amount, !!isInternal)
    },
    [ERC20Amount, isInternal, vote]
  )

  return {
    formInfo,
    handleERC20Change,
    ERC20Amount,
    buttonType,
    handleSubmit,
  }
}

export default useValidatorsVote
