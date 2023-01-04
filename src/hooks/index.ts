import { useWeb3React } from "@web3-react/core"

export function useActiveWeb3React() {
  const web3 = useWeb3React()

  return web3
}

export * from "./useABI"
export * from "./useAbiKeeper"
export * from "./useActiveWallet"
export * from "./useAlert"
export * from "./useBalance"
export * from "./useBlockNumber"
export * from "./useBreakpoints"
export * from "./useContract"
export * from "./useCopyClipboard"
export * from "./useDebounce"
export * from "./useDefaultConnector"
export * from "./useEagerConnect"
export * from "./useERC20"
export * from "./useERC20Allowance"
export * from "./useErc721"
export * from "./useERC721Allowance"
export * from "./useERC721List"
export * from "./useERC721Power"
export * from "./useERC721TokenOwner"
export * from "./useError"
export * from "./useFetchListCallback"
export * from "./useForceUpdate"
export * from "./useForm"
export * from "./useFormValidation"
export * from "./useInactiveListener"
export * from "./useInsurance"
export * from "./useInsuranceAmount"
export * from "./useInvestmentPrice"
export * from "./useInvestmentProposals"
export * from "./useInvestorInvestProposals"
export * from "./useInvestorProposalPools"
export * from "./useInvestorRiskyProposals"
export * from "./useInvestorsInsuranceHistory"
export * from "./useInvestorsLastPoolPosition"
export * from "./useInvestorsLpHistory"
export * from "./useInvestorTotalInvest"
export * from "./useInvestorTV"
export * from "./useInvestProposalData"
export * from "./useIsValidator"
export * from "./useIsWindowVisible"
export * from "./useNativeToken"
export * from "./useNotifications"
export * from "./useOpenPositionsPriceOutUSD"
export * from "./useOwnedAndInvestedPools"
export * from "./usePathname"
export * from "./usePayload"
export * from "./usePool"
export * from "./usePoolIcon"
export * from "./usePoolInvestorsByDay"
export * from "./usePoolLockedFunds"
export * from "./usePoolPrice"
export * from "./usePoolType"
export * from "./usePrice"
export * from "./usePrivacyPolicy"
export * from "./useProposalAddress"
export * from "./useQueryPagination"
export * from "./useReadMore"
export * from "./useRiskyPosition"
export * from "./useRiskyPrice"
export * from "./useRiskyProposals"
export * from "./useStoreTransactionWaiter"
export * from "./useToken"
export * from "./useTokenPriceOutUSD"
export * from "./useTokenRating"
export * from "./useTransactionWaiter"
export * from "./useCountdown"
export * from "./useUserSettings"

export * from "./dao"
export * from "./pool"
