import { useERC721Contract } from "contracts"
import { useMemo } from "react"
import { useSingleContractMultipleData } from "state/multicall/hooks"
import { isAddress } from "utils"

interface Props {
  contractAddress?: string
  tokenIds: number[]
}

const useERC721TokenOwnerMulticall = ({
  contractAddress,
  tokenIds,
}: Props): [{ [tokenId: string]: string | undefined }, boolean] => {
  const erc721 = useERC721Contract(contractAddress)

  const validatedTokens = useMemo(
    () => tokenIds.filter((t) => t !== undefined),
    [tokenIds]
  )

  const callResults = useSingleContractMultipleData(
    erc721,
    "ownerOf",
    tokenIds.map((tokenId) => [tokenId])
  )

  const anyLoading: boolean = useMemo(
    () => callResults.some((callState) => callState.loading),
    [callResults]
  )

  return useMemo(
    () => [
      !!validatedTokens.length
        ? validatedTokens.reduce<{
            [tokenId: string]: string | undefined
          }>((memo, tokenId, i) => {
            const value = callResults?.at(i)?.result?.at(0) || undefined

            if (value && isAddress(value)) {
              memo[tokenId] = value as unknown as string
            }

            return memo
          }, {})
        : {},
      anyLoading,
    ],
    [validatedTokens, anyLoading, callResults]
  )
}

export default useERC721TokenOwnerMulticall
