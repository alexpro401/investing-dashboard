import { useSelector } from "react-redux"
import {
  useContract,
  useGovPoolHelperContracts,
  useActiveWeb3React,
  useProposalAddress,
} from "hooks"
import { getMulticallAddress } from "utils/addressHelpers"

import {
  ERC20 as ERC20_ABI,
  BasicTraderPool as BasicTraderPool_ABI,
  ContractsRegistry as ContractsRegistry_ABI,
  CoreProperties as CoreProperties_ABI,
  DistributionProposal as DistributionProposal_ABI,
  ERC721 as ERC721_ABI,
  GovPool as GovPool_ABI,
  GovSettings as GovSettings_ABI,
  GovUserKeeper as GovUserKeeper_ABI,
  GovValidators as GovValidators_ABI,
  Insurance as Insurance_ABI,
  InvestTraderPool as InvestTraderPool_ABI,
  PoolFactory as PoolFactory_ABI,
  PoolRegistry as PoolRegistry_ABI,
  PriceFeed as PriceFeed_ABI,
  TraderPool as TraderPool_ABI,
  TraderPoolInvestProposal as TraderPoolInvestProposal_ABI,
  TraderPoolRiskyProposal as TraderPoolRiskyProposal_ABI,
  UserRegistry as UserRegistry_ABI,
  TokenSaleProposal as TokenSaletProposal_ABI,
  Multicall as Multicall_ABI,
} from "abi"

import {
  selectCorePropertiesAddress,
  selectInsuranceAddress,
  selectPoolFactoryAddress,
  selectPoolRegistryAddress,
  selectPriceFeedAddress,
  selectUserRegistryAddress,
} from "state/contracts/selectors"

import {
  ERC20,
  ERC721Power,
  ContractsRegistry,
  CoreProperties,
  BasicTraderPool,
  Insurance,
  InvestTraderPool,
  PoolFactory,
  PoolRegistry,
  PriceFeed,
  TraderPool,
  TraderPoolInvestProposal,
  TraderPoolRiskyProposal,
  UserRegistry,
  DistributionProposal,
  GovPool,
  GovSettings,
  GovUserKeeper,
  GovValidators,
  TokenSaleProposal,
  Multicall,
} from "interfaces/typechain"

type Address = string | undefined

export function useERC20Contract(address: Address) {
  return useContract<ERC20>(address, ERC20_ABI)
}

export function useERC721Contract(address: Address) {
  return useContract<ERC721Power>(address, ERC721_ABI)
}

export function useContractsRegistryContract() {
  return useContract<ContractsRegistry>(
    process.env.REACT_APP_CONTRACTS_REGISTRY_ADDRESS,
    ContractsRegistry_ABI,
    true
  )
}

export function useCorePropertiesContract() {
  return useContract<CoreProperties>(
    useSelector(selectCorePropertiesAddress),
    CoreProperties_ABI
  )
}

export function useBasicPoolContract(address: Address) {
  return useContract<BasicTraderPool>(address, BasicTraderPool_ABI)
}

export function useInsuranceContract() {
  return useContract<Insurance>(
    useSelector(selectInsuranceAddress),
    Insurance_ABI
  )
}

export function useInvestTraderPoolContract(address: Address) {
  return useContract<InvestTraderPool>(address, InvestTraderPool_ABI)
}

export function usePoolFactoryContract() {
  return useContract<PoolFactory>(
    useSelector(selectPoolFactoryAddress),
    PoolFactory_ABI
  )
}

export function usePoolRegistryContract() {
  return useContract<PoolRegistry>(
    useSelector(selectPoolRegistryAddress),
    PoolRegistry_ABI,
    true
  )
}

export function usePriceFeedContract() {
  return useContract<PriceFeed>(
    useSelector(selectPriceFeedAddress),
    PriceFeed_ABI,
    true
  )
}

export function useTraderPoolContract(address: Address) {
  return useContract<TraderPool>(address, TraderPool_ABI)
}

export function useTraderPoolInvestProposalContract(poolAddress: Address) {
  const address = useProposalAddress(poolAddress)

  return useContract<TraderPoolInvestProposal>(
    address,
    TraderPoolInvestProposal_ABI
  )
}

export function useTraderPoolRiskyProposalContract(poolAddress: Address) {
  const address = useProposalAddress(poolAddress)

  return useContract<TraderPoolRiskyProposal>(
    address,
    TraderPoolRiskyProposal_ABI
  )
}

export function useUserRegistryContract() {
  return useContract<UserRegistry>(
    useSelector(selectUserRegistryAddress),
    UserRegistry_ABI
  )
}

export function useDistributionProposalContract(poolAddress: Address) {
  const { govDistributionProposalAddress } = useGovPoolHelperContracts(
    poolAddress ?? ""
  )

  return useContract<DistributionProposal>(
    govDistributionProposalAddress,
    DistributionProposal_ABI,
    true
  )
}

export function useGovPoolContract(address: Address) {
  return useContract<GovPool>(address, GovPool_ABI, true)
}

export function useGovSettingsContract(poolAddress: Address) {
  const { govSettingsAddress } = useGovPoolHelperContracts(poolAddress ?? "")

  return useContract<GovSettings>(govSettingsAddress, GovSettings_ABI, true)
}

export function useGovUserKeeperContract(poolAddress: Address) {
  const { govUserKeeperAddress } = useGovPoolHelperContracts(poolAddress ?? "")

  return useContract<GovUserKeeper>(
    govUserKeeperAddress,
    GovUserKeeper_ABI,
    true
  )
}

export function useGovValidatorsContract(poolAddress: Address) {
  const { govValidatorsAddress } = useGovPoolHelperContracts(poolAddress ?? "")

  return useContract<GovValidators>(
    govValidatorsAddress,
    GovValidators_ABI,
    true
  )
}

export function useTokenSaleProposalContract(govPoolAddress: Address) {
  return useContract<TokenSaleProposal>(govPoolAddress, TokenSaletProposal_ABI)
}

export function useMulticallContract() {
  const { chainId } = useActiveWeb3React()

  return useContract<Multicall>(getMulticallAddress(chainId), Multicall_ABI)
}
