import * as React from "react"
import { useSelector } from "react-redux"
import { createClient } from "urql"
import { isEmpty, isNil } from "lodash"

import { useGovPoolContract } from "contracts"
import { MAX_PAGINATION_COUNT } from "consts/misc"
import { GovProposalsByPoolInMiscQuery } from "queries"
import { IGovPool } from "interfaces/typechain/GovPool"
import useQueryPagination from "hooks/useQueryPagination"
import { ProposalState, proposalStatusToStates } from "types"
import { selectInsuranceAddress } from "state/contracts/selectors"
import { IGovProposalQuery } from "interfaces/thegraphs/gov-pools"

const daoPoolsApiUrl = process.env.REACT_APP_DAO_POOLS_API_URL ?? ""
const dexeDaoPoolAddress = process.env.REACT_APP_DEXE_DAO_ADDRESS ?? ""

const govPoolsClient = createClient({
  url: daoPoolsApiUrl,
  requestPolicy: "network-only",
})

interface ActiveInsuranceProposal {
  query: IGovProposalQuery
  wrappedProposalView: IGovPool.ProposalViewStructOutput
}

const useActiveInsuranceProposalByPool = (
  basicPool
): [ActiveInsuranceProposal | undefined, boolean] => {
  const [_pool, _setPool] = React.useState()
  const [_loading, _setLoading] = React.useState(true)
  const [proposal, setProposal] = React.useState<ActiveInsuranceProposal>()

  React.useEffect(() => {
    if (!isNil(basicPool) && !isEmpty(basicPool) && basicPool !== _pool) {
      _setPool(basicPool)
      _setLoading(true)
    }
  }, [basicPool])

  const insuranceContractAddress = useSelector(selectInsuranceAddress)
  const govPoolContract = useGovPoolContract(dexeDaoPoolAddress)

  const [{ data, loading, lastFetchLen }, fetchMore] =
    useQueryPagination<IGovProposalQuery>(
      {
        query: GovProposalsByPoolInMiscQuery,
        variables: React.useMemo(
          () => ({
            misc: String(_pool).toLocaleLowerCase(),
            pool: String(dexeDaoPoolAddress).toLocaleLowerCase(),
          }),
          [_pool]
        ),
        pause: !_pool || isEmpty(dexeDaoPoolAddress),
        context: govPoolsClient,
        formatter: (response) => response?.proposals,
      },
      {
        limit: MAX_PAGINATION_COUNT,
        initialOffset: 0,
      }
    )

  React.useEffect(() => {
    if (!loading && lastFetchLen === MAX_PAGINATION_COUNT) {
      _setLoading(true)
      fetchMore()
    }
  }, [loading, lastFetchLen])

  React.useEffect(() => {
    if (!loading && data.length === 0) {
      setProposal(undefined)
      _setLoading(false)
      return
    }
    if (!govPoolContract || loading || data.length === 0) {
      return
    }
    ;(async () => {
      _setLoading(true)
      for (const proposal of data) {
        const pId = Number(proposal.proposalId)
        const offset = pId === 0 ? 0 : pId - 1

        const _proposals = await govPoolContract.getProposals(offset, 1)

        if (_proposals[0]) {
          const lastExecutor = String(
            _proposals[0]?.proposal?.executors[
              _proposals[0]?.proposal?.executors.length - 1
            ]
          ).toLocaleLowerCase()

          const isInsurance =
            lastExecutor ===
            String(insuranceContractAddress).toLocaleLowerCase()

          const isActive = proposalStatusToStates["opened-insurance"].includes(
            String(_proposals[0].proposalState) as ProposalState
          )

          if (isInsurance && isActive) {
            setProposal({
              query: proposal,
              wrappedProposalView: _proposals[0],
            })
            _setLoading(false)
            return
          }
        }
      }
      _setLoading(false)
    })()
  }, [data, loading, govPoolContract])

  return [proposal, _loading]
}

export default useActiveInsuranceProposalByPool
