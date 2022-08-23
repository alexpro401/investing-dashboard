import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react"
import { useSelector } from "react-redux"
import { useWeb3React } from "@web3-react/core"
// import {
//   signTypedData,
//   SignTypedDataVersion,
//   TypedMessage,
// } from "@metamask/eth-sig-util"

import { isTxMined, parseTransactionError } from "utils"
import { UserRegistry } from "abi"
import useContract from "hooks/useContract"
import { TransactionType } from "state/transactions/types"
import { useTransactionAdder } from "state/transactions/hooks"
import { selectUserRegistryAddress } from "state/contracts/selectors"

const privacyHash = process.env.REACT_APP_PRIVACY_POLICY_HASH
// const OWNER_PRIVATE_KEY =
//   "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

const usePrivacyPolicySign = () => {
  const { account, library, chainId } = useWeb3React()
  const userRegistryAddress = useSelector(selectUserRegistryAddress)

  return useCallback(
    async (hash) => {
      if (!account || !library) return

      // const privateKey = Buffer.from(OWNER_PRIVATE_KEY, "hex")

      // const EIP712Domain = [
      //   { name: "name", type: "string" },
      //   { name: "version", type: "string" },
      //   { name: "chainId", type: "uint256" },
      //   { name: "verifyingContract", type: "address" },
      // ]

      const Agreement = [{ name: "documentHash", type: "bytes32" }]

      const domain = {
        name: "USER_REGISTRY", // ASCII "85 83 69 82 95 82 69 71 73 83 84 82 89 "
        version: "1", // ASCII "49 "
        chainId: chainId,
        verifyingContract: userRegistryAddress,
      }

      const message = {
        documentHash: hash,
      }

      // const data = {
      //   types: { EIP712Domain, Agreement },
      //   primaryType: "Agreement",
      //   domain: domain,
      //   message: message,
      // } as unknown as TypedMessage<any>

      const signer = library.getSigner(account)
      return signer._signTypedData(domain, { Agreement }, message)

      // return signTypedData({
      //   privateKey,
      //   data: data,
      //   version: SignTypedDataVersion.V4,
      // })
    },
    [account, chainId, library, userRegistryAddress]
  )
}

interface IPayload {
  error: string
  loading: boolean
  isAgreed: boolean
  showAgreement: boolean
}

interface IMethods {
  onAgree: (cb?: () => void) => any
  setError: Dispatch<SetStateAction<string>>
  setLoading: Dispatch<SetStateAction<boolean>>
  setShowAgreement: Dispatch<SetStateAction<boolean>>
}

export default function usePrivacyPolicyAgreed(): [IPayload, IMethods] {
  const { account } = useWeb3React()

  const userRegistryAddress = useSelector(selectUserRegistryAddress)
  const userRegistry = useContract(userRegistryAddress, UserRegistry)

  const addTransaction = useTransactionAdder()
  const sign = usePrivacyPolicySign()

  // DATA
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [isAgreed, setIsAgreed] = useState<boolean>(false)
  const [showAgreement, setShowAgreement] = useState<boolean>(false)

  // METHODS

  // Sign agreement hash and send signature
  const onAgree = async (cb?) => {
    if (!userRegistry || !privacyHash || !account) return

    try {
      setLoading(true)
      setError("")
      const signature = await sign(privacyHash)

      const tx = await userRegistry.agreeToPrivacyPolicy(signature)
      const receipt = await addTransaction(tx, {
        type: TransactionType.USER_AGREED_TO_PRIVACY_POLICY,
      })

      if (isTxMined(receipt)) {
        setIsAgreed(true)
        setShowAgreement(false)
        cb && cb()
      }
    } catch (error: any) {
      if (!!error && !!error.data && !!error.data.message) {
        setError(error.data.message)
      } else {
        const errorMessage = parseTransactionError(error.toString())
        !!errorMessage && setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const getUserAgreed = async (user, userRegistry) => {
    if (!userRegistry || !user) return

    try {
      return userRegistry.agreed(user)
    } catch (error) {
      console.error(error)
    }
  }

  // SIDE EFFECTS

  // Fetch agreed flag for current user
  useEffect(() => {
    if (!userRegistry || !account) return
    ;(async () => {
      try {
        const agreed = await getUserAgreed(account, userRegistry)
        setIsAgreed(agreed)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [userRegistry, account])

  return [
    { error, loading, isAgreed, showAgreement },
    { setError, setLoading, setShowAgreement, onAgree },
  ]
}
