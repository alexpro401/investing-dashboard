import { useMemo } from "react"
import { useGovPoolUserVotes } from "hooks/dao"
import { ZERO } from "consts"
import { addBignumbers } from "utils/formulas"
import { isAddress } from "utils"
import { BigNumber } from "@ethersproject/bignumber"

interface Props {
  daoPoolAddress?: string
  account?: string | null
  proposalId?: string
}

export const useUserVotes = ({
  daoPoolAddress,
  account,
  proposalId,
}: Props) => {
  const isValidParams = useMemo(
    () => isAddress(daoPoolAddress) && isAddress(account) && !!proposalId,
    [daoPoolAddress, account, proposalId]
  )

  const params = useMemo(
    () =>
      !proposalId || !account
        ? []
        : [
            { voter: account, proposalId },
            { voter: account, proposalId, isMicroPool: true },
          ],
    [account, proposalId]
  )

  const [userVotes] = useGovPoolUserVotes({
    daoPoolAddress: daoPoolAddress ?? "",
    params: params,
  })

  const ERC20Voted: BigNumber = useMemo(() => {
    if (!isValidParams) return ZERO

    try {
      return userVotes[0].tokensVoted || ZERO
    } catch (error) {
      return ZERO
    }
  }, [isValidParams, userVotes])

  const ERC20VotedDelegated: BigNumber = useMemo(() => {
    if (!isValidParams) return ZERO

    try {
      return userVotes[1].tokensVoted || ZERO
    } catch (error) {
      return ZERO
    }
  }, [isValidParams, userVotes])

  const ERC721Voted = useMemo(() => {
    if (!isValidParams) return []

    try {
      return userVotes[0].nftsVoted.map((nft) => nft.toString())
    } catch (error) {
      return []
    }
  }, [isValidParams, userVotes]) as string[]

  const ERC721VotedDelegated = useMemo(() => {
    if (!isValidParams) return []

    try {
      return userVotes[1].nftsVoted.map((nft) => nft.toString())
    } catch (error) {
      return []
    }
  }, [isValidParams, userVotes]) as string[]

  return useMemo(
    () => ({
      erc20: {
        total: addBignumbers([ERC20Voted, 18], [ERC20VotedDelegated, 18]),
        owned: ERC20Voted,
        delegated: ERC20VotedDelegated,
      },
      erc721: {
        total: [...ERC721Voted, ...ERC721VotedDelegated],
        owned: ERC721Voted,
        delegated: ERC721VotedDelegated,
      },
    }),
    [ERC20Voted, ERC20VotedDelegated, ERC721Voted, ERC721VotedDelegated]
  )
}
