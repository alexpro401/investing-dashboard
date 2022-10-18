import { useActiveWeb3React } from "hooks"
import { useState } from "react"
import { useERC721Contract } from "../contracts"

export const useErc721 = (address: string) => {
  const { account, library } = useActiveWeb3React()

  const contract = useERC721Contract(address)

  return {}
}
