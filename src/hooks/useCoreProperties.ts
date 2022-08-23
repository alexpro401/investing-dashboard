import { useSelector } from "react-redux"

import { CoreProperties } from "abi"
import useContract from "hooks/useContract"
import { selectCorePropertiesAddress } from "state/contracts/selectors"

export default function useCoreProperties() {
  const corePropertiesAddress = useSelector(selectCorePropertiesAddress)
  const coreProperties = useContract(corePropertiesAddress, CoreProperties)

  return coreProperties
}
