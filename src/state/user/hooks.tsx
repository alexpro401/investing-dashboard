import { useCallback } from "react"
import { useWeb3React } from "@web3-react/core"
import { useDispatch, useSelector } from "react-redux"

import {
  updateUserProMode,
  showAgreementModal,
  changeTermsAgreed,
} from "state/user/actions"
import { IUserTerms } from "./types"
import { AppDispatch, AppState } from "state"
import { selectTermsState } from "./selectors"
import { TransactionType } from "state/transactions/types"
import { useUserRegistryContract } from "contracts"
import { useTransactionAdder } from "state/transactions/hooks"
import { selectUserRegistryAddress } from "state/contracts/selectors"
import { getTypedSignature, isTxMined, parseTransactionError } from "utils"
import usePayload from "hooks/usePayload"
import useError from "hooks/useError"
import { SubmitState } from "constants/types"

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
