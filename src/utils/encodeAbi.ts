import { Interface } from "@ethersproject/abi"
import { isEmpty, isNil } from "lodash"

/**
 * Encode contract method to bytes data
 * @param ABI - contract interface
 * @param methodName - method to encode
 * @param methodArgs - arguments of method
 * @return string
 */
export function encodeAbiMethod(
  ABI,
  methodName: string,
  methodArgs?: any[]
): string {
  if (isNil(ABI) || isNil(methodName) || isEmpty(methodName)) {
    const message =
      "For encode contract method you must provide at least ABI and method name."
    throw Error(message)
  }

  const generatedInterface = new Interface(ABI)

  return generatedInterface.encodeFunctionData(methodName, methodArgs ?? [])
}
