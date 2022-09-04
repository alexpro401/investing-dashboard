import { BigNumber } from "@ethersproject/bignumber"
import { AddressZero } from "@ethersproject/constants"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers"
import { isAddress } from "./index"

export function getContract(
  address: string,
  ABI: any,
  library: Web3Provider,
  account?: string
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(
    address,
    ABI,
    getProviderOrSigner(library, account) as any
  )
}

export function getSigner(
  library: Web3Provider,
  account: string
): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(
  library: Web3Provider,
  account?: string
): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// function that decides which method to use to get a balanceOf
// possible cases:
// 1. main asset of network (e.g. ETH, BNB) - use getBalance
// 2. ERC20 - use balanceOf
export async function getBalanceOf({
  tokenAddress,
  library,
  contract,
  account,
}): Promise<BigNumber> {
  const isERC20 =
    tokenAddress.toLocaleLowerCase() !==
    process.env.REACT_APP_MAIN_ASSET_ADDRESS

  return await (isERC20
    ? contract.balanceOf(account)
    : library.getBalance(account))
}
