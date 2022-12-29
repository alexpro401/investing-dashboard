import { useWeb3React } from "@web3-react/core"
import { useTransactionAdder } from "state/transactions/hooks"
import { useUserRegistryContract } from "contracts"
import { useUserMetadata } from "../state/ipfsMetadata/hooks"
import { useCallback, useEffect, useState } from "react"
import { IpfsEntity } from "utils/ipfsEntity"
import { TransactionType } from "state/transactions/types"
import { isTxMined } from "utils"

export const useUserSettings = (): [
  {
    isUserEditing: boolean
    isLoading: boolean
    userName: string
    userAvatar: string
  },
  {
    setUserEditing: (state: boolean) => void
    setUserName: (name: string) => void
    setUserAvatar: (avatar: string) => void
    handleUserSubmit: () => void
  }
] => {
  const { account } = useWeb3React()
  const addTransaction = useTransactionAdder()
  const userRegistry = useUserRegistryContract()
  const [{ userMetadata }, { fetchUserMetadata }] = useUserMetadata(account)

  const [isLoading, setLoading] = useState(false)
  const [isUserEditing, setUserEditing] = useState(false)
  const [userName, setUserName] = useState("")
  const [userNameInitial, setUserNameInitial] = useState("")
  const [userAvatar, setUserAvatar] = useState("")
  const [userAvatarInitial, setUserAvatarInitial] = useState("")
  const [assets, setAssets] = useState<string[]>([])

  const handleUserSubmit = useCallback(async () => {
    setLoading(true)
    const isAvatarChanged = userAvatar !== userAvatarInitial
    const isNameChanged = userName !== userNameInitial

    if (!isAvatarChanged && !isNameChanged) {
      setLoading(false)
      setUserEditing(false)
      return
    }

    const actualAssets = isAvatarChanged ? [...assets, userAvatar] : assets

    const userIpfsDataEntity = new IpfsEntity({
      data: JSON.stringify({
        timestamp: new Date().getTime() / 1000,
        name: userName,
        assets: actualAssets,
        account,
      }),
    })

    await userIpfsDataEntity.uploadSelf()

    const receipt = await userRegistry?.changeProfile(
      userIpfsDataEntity._path as string
    )

    const tx = await addTransaction(receipt, {
      type: TransactionType.UPDATED_USER_CREDENTIALS,
    })

    if (isTxMined(tx)) {
      await fetchUserMetadata(false)
      if (isAvatarChanged) {
        setUserAvatarInitial(userAvatar)
        setAssets(actualAssets)
      }

      if (isNameChanged) {
        setUserNameInitial(userName)
      }

      setLoading(false)
      setUserEditing(false)
    }
  }, [
    account,
    addTransaction,
    assets,
    fetchUserMetadata,
    userAvatar,
    userAvatarInitial,
    userName,
    userNameInitial,
    userRegistry,
  ])

  useEffect(() => {
    if (userMetadata !== null) {
      if ("name" in userMetadata) {
        setUserName(userMetadata.name)
        setUserNameInitial(userMetadata.name)
      }

      if ("assets" in userMetadata && userMetadata.assets.length) {
        setAssets(userMetadata.assets)
        setUserAvatar(userMetadata.assets[userMetadata.assets.length - 1])
        setUserAvatarInitial(
          userMetadata.assets[userMetadata.assets.length - 1]
        )
      }
    } else {
      setUserName("")
      setUserNameInitial("")
      setAssets([])
      setUserAvatar("")
      setUserAvatarInitial("")
    }
  }, [userMetadata])

  return [
    {
      isUserEditing,
      userName,
      userAvatar,
      isLoading,
    },
    {
      setUserEditing,
      setUserName,
      setUserAvatar,
      handleUserSubmit,
    },
  ]
}
