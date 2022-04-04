import { useMemo, useEffect, useState, useCallback } from "react"
import { Contract } from "@ethersproject/contracts"
import {
  IUniswapV2Router02,
  UniswapExchangeTool,
  PancakeExchangeTool,
  ERC20,
  PancakeFactory,
} from "abi"
import { getContract } from "utils/getContract"
import { useActiveWeb3React } from "hooks"
import { BigNumber } from "@ethersproject/bignumber"
import { ITokenBase } from "constants/interfaces"

export default function useContract(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true
): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined
      )
    } catch (error) {
      console.error("Failed to get contract", error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useUniswapExchangeTool(): Contract | null {
  return useContract(
    process.env.REACT_APP_UNISWAP_EXCHANGE_TOOL,
    IUniswapV2Router02
  )
}

export function usePancakeExchangeTool(): Contract | null {
  return useContract(
    process.env.REACT_APP_PANCAKE_EXCHANGE_TOOL,
    PancakeExchangeTool
  )
}

export function usePancakeFactory(): Contract | null {
  return useContract(
    "0x6725F303b657a9451d8BA641348b6761A6CC7a17",
    PancakeFactory
  )
}

export function useERC20(
  address: string | undefined
): [
  Contract | null,
  { address: string; name: string; symbol: string; decimals: number } | null,
  BigNumber,
  () => void
] {
  const [tokenData, setTokenData] = useState<ITokenBase | null>(null)
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0))
  const contract = useContract(address, ERC20)
  const { account, library } = useActiveWeb3React()
  const isETH =
    !!address &&
    address.toLocaleLowerCase() === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"

  const init = useCallback(() => {
    // GET token info that doesn't need user address
    if (isETH) {
      setTokenData({
        address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        symbol: "ETH",
        name: "Ethereum Token",
        decimals: 18,
      })
      return
    }

    if (!contract || !library || !address) return
    ;(async () => {
      try {
        const symbol = await contract.symbol()
        const decimals = await contract.decimals()
        const name = await contract.name()

        setTokenData({
          address,
          name,
          symbol,
          decimals,
        })
      } catch (e) {
        // console.log(e, e.message)
      }
    })()

    // GET token account info
    if (typeof account !== "string" || account.length !== 42) return
    ;(async () => {
      try {
        const balance = await (isETH
          ? library.getBalance(account)
          : contract.balanceOf(account))
        setBalance(balance)
      } catch (e) {
        // console.log(e, e.message)
      }
    })()
  }, [account, address, contract, isETH, library])

  useEffect(() => {
    init()
  }, [contract, account, address, library, init])

  // useEffect(() => {
  //   if (withUpdate) {
  //     const interval = setInterval(() => {
  //       ;(async () => {
  //         console.log("update erc20 balance")
  //         try {
  //           const balance = await (isETH
  //             ? library.getBalance(account)
  //             : contract?.balanceOf(account))
  //           setBalance(balance)
  //         } catch (e) {
  //           // console.log(e, e.message)
  //         }
  //       })()
  //     }, 5000)
  //     return () => clearInterval(interval)
  //   }
  //   return () => {}
  // }, [])

  return [contract, tokenData, balance, init]
}