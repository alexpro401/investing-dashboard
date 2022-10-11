import { useSelector } from "react-redux"
import useContract from "hooks/useContract"

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
    ContractsRegistry_ABI
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
    PoolRegistry_ABI
  )
}

export function usePriceFeedContract() {
  return useContract<PriceFeed>(
    useSelector(selectPriceFeedAddress),
    PriceFeed_ABI
  )
}

export function useTraderPoolContract(address: Address) {
  return useContract<TraderPool>(address, TraderPool_ABI)
}

export function useTraderPoolInvestProposalContract(address: Address) {
  return useContract<TraderPoolInvestProposal>(
    address,
    TraderPoolInvestProposal_ABI
  )
}

export function useTraderPoolRiskyProposalContract(address: Address) {
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

export function useDistributionProposalContract(address: Address) {
  return useContract<DistributionProposal>(address, DistributionProposal_ABI)
}

export function useGovPoolContract(address: Address) {
  return useContract<GovPool>(address, GovPool_ABI)
}

export function useGovSettingsContract(address: Address) {
  return useContract<GovSettings>(address, GovSettings_ABI)
}

export function useGovUserKeeperContract(address: Address) {
  return useContract<GovUserKeeper>(address, GovUserKeeper_ABI)
}

export function useGovValidatorsContract(address: Address) {
  return useContract<GovValidators>(address, GovValidators_ABI)
}
