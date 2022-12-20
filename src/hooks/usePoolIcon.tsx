import { useMemo } from "react"

import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { usePoolContract } from "hooks/usePool"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"

import Icon from "components/Icon"

export const usePoolIcon = (
  poolAddress: string,
  size = 24
): [JSX.Element, IPoolInfo | null] => {
  const [, poolInfo] = usePoolContract(poolAddress)

  const [{ poolMetadata }] = usePoolMetadata(
    poolAddress,
    poolInfo?.parameters.descriptionURL
  )

  const icon = useMemo(() => {
    return (
      <Icon
        m="0"
        size={size}
        source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
        address={poolAddress}
      />
    )
  }, [poolAddress, poolMetadata, size])

  return [icon, poolInfo]
}

export default usePoolIcon
