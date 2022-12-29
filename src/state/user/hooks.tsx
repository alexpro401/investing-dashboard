import { useCallback, useMemo } from "react"
import { useWeb3React } from "@web3-react/core"
import { useDispatch, useSelector } from "react-redux"

import {
  updateUserProMode,
  showAgreementModal,
  changeTermsAgreed,
  addSerializedToken,
  removeSerializedToken,
} from "state/user/actions"
import { IUserTerms, SerializedToken } from "./types"
import { AppDispatch, AppState } from "state"
import { selectTermsState, selectUserTokens } from "./selectors"
import { TransactionType } from "state/transactions/types"
import { useUserRegistryContract } from "contracts"
import { useTransactionAdder } from "state/transactions/hooks"
import { selectUserRegistryAddress } from "state/contracts/selectors"
import { getTypedSignature, isTxMined, parseTransactionError } from "utils"
import usePayload from "hooks/usePayload"
import useError from "hooks/useError"
import { SubmitState } from "consts/types"
import { Token } from "lib/entities"

const privacyHash = process.env.REACT_APP_PRIVACY_POLICY_HASH

function serializeToken(token: Token): SerializedToken {
  return {
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
  }
}

function deserializeToken(serializedToken: SerializedToken): Token {
  return new Token(
    serializedToken.chainId,
    serializedToken.address,
    serializedToken.decimals,
    serializedToken.symbol,
    serializedToken.name
  )
}

export function useUserProMode(): [boolean, () => void] {
  const dispatch = useDispatch<AppDispatch>()

  const userSlippageTolerance = useSelector<
    AppState,
    AppState["user"]["userProMode"]
  >((state) => {
    return state.user.userProMode
  })

  const setUserProMode = useCallback(() => {
    dispatch(updateUserProMode())
  }, [dispatch])

  return [userSlippageTolerance, setUserProMode]
}

interface IMethods {
  setShowAgreement: (s: boolean) => void
  onAgree: () => void
}

export function useUserAgreement(): [IUserTerms, IMethods] {
  const { account, library, chainId } = useWeb3React()

  const [, updatePayload] = usePayload()
  const [, updateError] = useError()
  const addTransaction = useTransactionAdder()
  const userRegistry = useUserRegistryContract()
  const userRegistryAddress = useSelector(selectUserRegistryAddress)

  const dispatch = useDispatch<AppDispatch>()
  const userTermsAgreement = useSelector(selectTermsState)

  const setAgreed = useCallback(
    (agreed: boolean) => {
      dispatch(changeTermsAgreed({ agreed }))
    },
    [dispatch]
  )

  const setShowAgreement = useCallback(
    (show: boolean) => {
      dispatch(showAgreementModal({ show }))
    },
    [dispatch]
  )

  const getSignature = useCallback(() => {
    if (!account || !library || !chainId || !userRegistryAddress) return

    const Agreement = [{ name: "documentHash", type: "bytes32" }]

    const domain = {
      name: "USER_REGISTRY",
      version: "1",
      chainId: chainId,
      verifyingContract: userRegistryAddress,
    }

    const message = {
      documentHash: privacyHash,
    }

    return getTypedSignature(account, library, {
      domain,
      types: { Agreement },
      message,
    })
  }, [account, chainId, library, userRegistryAddress])

  const onAgree = useCallback(async () => {
    if (!userRegistry) return
    updatePayload(SubmitState.SIGN)
    try {
      const signature = await getSignature()
      const tx = await userRegistry.agreeToPrivacyPolicy(signature)
      const receipt = await addTransaction(tx, {
        type: TransactionType.USER_AGREED_TO_PRIVACY_POLICY,
      })

      if (isTxMined(receipt)) {
        updateError("")
        setAgreed(true)
        setShowAgreement(false)
        updatePayload(SubmitState.IDLE)
      }
    } catch (error: any) {
      if (!!error && !!error.data && !!error.data.message) {
        updateError(error.data.message)
      } else {
        const errorMessage = parseTransactionError(error.toString())
        !!errorMessage && updateError(errorMessage)
      }
    } finally {
      updatePayload(SubmitState.IDLE)
    }
  }, [
    addTransaction,
    getSignature,
    setAgreed,
    updateError,
    updatePayload,
    setShowAgreement,
    userRegistry,
  ])

  return [userTermsAgreement, { setShowAgreement, onAgree }]
}

export function useUserAddedTokens(): Token[] {
  const { chainId } = useWeb3React()
  const serializedTokensMap = useSelector(selectUserTokens)

  return useMemo(() => {
    if (!chainId) return []
    const tokenMap: Token[] = serializedTokensMap?.[chainId]
      ? Object.values(serializedTokensMap[chainId]).map(deserializeToken)
      : []
    return tokenMap
  }, [serializedTokensMap, chainId])
}

export function useAddUserToken(): (token: Token) => void {
  const dispatch = useDispatch<AppDispatch>()

  return useCallback(
    (token: Token) => {
      dispatch(addSerializedToken({ serializedToken: serializeToken(token) }))
    },
    [dispatch]
  )
}

export function useRemoveUserAddedToken(): (
  chainId: number,
  address: string
) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (chainId: number, address: string) => {
      dispatch(removeSerializedToken({ chainId, address }))
    },
    [dispatch]
  )
}
