import { useCallback, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { useDispatch, useSelector } from "react-redux"

import {
  updateUserProMode,
  showAgreementModal,
  processedAgreement,
  changeTermsAgreed,
  setAgreementError,
} from "state/user/actions"
import { UserRegistry } from "abi"
import { IUserTerms } from "./types"
import useContract from "hooks/useContract"
import { AppDispatch, AppState } from "state"
import { TransactionType } from "state/transactions/types"
import { useTransactionAdder } from "state/transactions/hooks"
import { selectUserRegistryAddress } from "state/contracts/selectors"
import { getTypedSignature, isTxMined, parseTransactionError } from "utils"

const privacyHash = process.env.REACT_APP_PRIVACY_POLICY_HASH

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
  setError: (p: string) => void
  setProcessed: (p: boolean) => void
  setShowAgreement: (s: boolean) => void
  setupAgreement: (cb: () => any) => void
  onAgree: () => void
}

export function useUserAgreement(): [IUserTerms, IMethods] {
  const { account, library, chainId } = useWeb3React()

  const addTransaction = useTransactionAdder()
  const userRegistryAddress = useSelector(selectUserRegistryAddress)
  const userRegistry = useContract(userRegistryAddress, UserRegistry)

  const dispatch = useDispatch<AppDispatch>()
  const userTermsAgreement = useSelector<AppState, AppState["user"]["terms"]>(
    (state) => state.user.terms
  )

  const [callback, setCallback] = useState<any>(() => {})

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

  const setProcessed = useCallback(
    (processed: boolean) => {
      dispatch(processedAgreement({ processed }))
    },
    [dispatch]
  )

  const setError = useCallback(
    (error: string) => {
      dispatch(setAgreementError({ error }))
    },
    [dispatch]
  )

  // When start sign agreement we set callback function and show modal
  const setupAgreement = useCallback(
    (cb?) => {
      if (!!cb && typeof cb === "function") {
        setCallback(() => cb)
      }
      setShowAgreement(true)
    },
    [setShowAgreement]
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
    setProcessed(true)
    try {
      const signature = await getSignature()
      const tx = await userRegistry.agreeToPrivacyPolicy(signature)
      const receipt = await addTransaction(tx, {
        type: TransactionType.USER_AGREED_TO_PRIVACY_POLICY,
      })

      if (isTxMined(receipt)) {
        setError("")
        setAgreed(true)
        setShowAgreement(false)
      }
    } catch (error: any) {
      if (!!error && !!error.data && !!error.data.message) {
        setError(error.data.message)
      } else {
        const errorMessage = parseTransactionError(error.toString())
        !!errorMessage && setError(errorMessage)
      }
    } finally {
      setProcessed(false)
    }
  }, [
    addTransaction,
    getSignature,
    setAgreed,
    setError,
    setProcessed,
    setShowAgreement,
    userRegistry,
  ])

  return [
    userTermsAgreement,
    { setShowAgreement, setProcessed, setupAgreement, setError, onAgree },
  ]
}
