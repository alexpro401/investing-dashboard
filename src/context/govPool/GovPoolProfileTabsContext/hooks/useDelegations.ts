import { useParams } from "react-router-dom"
import { useActiveWeb3React } from "hooks"

import { useGovBalance, useGovPoolDelegations } from "hooks/dao"

interface IUseDelegationsProps {
  startLoading: boolean
}

const useDelegations = ({ startLoading }: IUseDelegationsProps) => {
  const { daoAddress } = useParams<"daoAddress">()
  const { account } = useActiveWeb3React()

  const delegatedTokensForMe = useGovBalance({
    daoPoolAddress: startLoading ? daoAddress : undefined,
    isMicroPool: true,
    useDelegated: false,
    method: "tokenBalance",
  })

  const delegatedNftsForMe = useGovBalance({
    daoPoolAddress: startLoading ? daoAddress : undefined,
    isMicroPool: true,
    useDelegated: false,
    method: "nftBalance",
  })

  const delegations = useGovPoolDelegations({
    daoPoolAddress: daoAddress,
    user: account,
  })

  // як дізнатись скільки всього топ делегаторів буде

  // console.log("delegatedTokensForMe: ", delegatedTokensForMe)
  // console.log("delegatedNftsForMe: ", delegatedNftsForMe)
  // console.log("delegations: ", delegations)

  return null
}

export default useDelegations
