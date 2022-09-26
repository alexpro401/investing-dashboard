import { createSelector } from "@reduxjs/toolkit"
import { AppState } from "state"

const selectIpfsMetadataState = (state: AppState) => state.ipfsMetadata

export const selectPoolsMetadata = createSelector(
  [selectIpfsMetadataState],
  (metadata) => metadata.pools
)

export const selectPoolMetadata = (poolId, hash) =>
  createSelector([selectIpfsMetadataState], (metadata) => {
    if (!metadata.pools[poolId] || !metadata.pools[poolId][hash]) {
      return null
    }
    return metadata.pools[poolId][hash]
  })

export const selectinvestProposalMetadata = (poolId, hash) =>
  createSelector([selectIpfsMetadataState], (metadata) => {
    if (
      !metadata.proposals ||
      !metadata.proposals[poolId] ||
      !metadata.proposals[poolId][hash]
    ) {
      return null
    }
    return metadata.proposals[poolId][hash]
  })

export const selectUserMetadata = (hash) =>
  createSelector([selectIpfsMetadataState], (metadata) =>
    metadata.user?.hash === hash ? metadata.user : null
  )

export const selectInsuranceAccident = (hash) =>
  createSelector([selectIpfsMetadataState], (metadata) =>
    metadata.insuranceAccidents?.hash === hash
      ? metadata.insuranceAccidents[hash]
      : null
  )

export const selectInsuranceAccidentByPool = (pool?: string) => {
  return createSelector([selectIpfsMetadataState], (metadata) => {
    if (!pool) return null
    // eslint-disable-next-line prefer-const
    let result = null
    for (const ia of Object.values(metadata.insuranceAccidents)) {
      if (ia.pool === pool) {
        result === ia
        break
      }
    }

    return result
  })
}
