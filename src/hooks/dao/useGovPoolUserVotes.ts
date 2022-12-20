import { BigNumber } from "@ethersproject/bignumber"
import { useGovPoolContract } from "contracts"
import { useMemo } from "react"
import {
  OptionalMethodInputs,
  useSingleContractMultipleData,
} from "state/multicall/hooks"

interface Params {
  proposalId: string
  voter: string
  isMicroPoool?: boolean
}

interface Props {
  daoPoolAddress: string
  params: Params[]
}

const useGovPoolUserVotes = ({ daoPoolAddress, params }: Props) => {
  const govPool = useGovPoolContract(daoPoolAddress)

  const validatedParams = useMemo(
    () =>
      params.map((p) => {
        return [p.proposalId, p.voter, p.isMicroPoool || false]
      }),
    [params]
  ) as unknown as OptionalMethodInputs[]

  const callResults = useSingleContractMultipleData(
    govPool,
    "getUserVotes",
    validatedParams
  )

  const anyLoading: boolean = useMemo(
    () => callResults.some((callState) => callState.loading),
    [callResults]
  )

  return useMemo(
    () => [
      !!params.length && !!validatedParams.length
        ? validatedParams.map((votes, i) => {
            return callResults[i].result?.voteInfo || undefined
          })
        : [],
      anyLoading,
    ],
    [params.length, validatedParams, anyLoading, callResults]
  ) as [any, boolean]
}

export default useGovPoolUserVotes
