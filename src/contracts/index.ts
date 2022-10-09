import { useSelector } from "react-redux"

import useContract from "hooks/useContract"

import {
  BasicTraderPool,
  ContractsRegistry,
  CoreProperties,
  DistributionProposal,
  ERC20,
  ERC721,
  GovPool,
  GovSettings,
  GovUserKeeper,
  GovValidators,
  Insurance,
  InvestTraderPool,
  PoolFactory,
  PoolRegistry,
  PriceFeed,
  TraderPool,
  TraderPoolInvestProposal,
  TraderPoolRiskyProposal,
  UserRegistry,
} from "abi"

import {
  BasicTraderPoolType,
  ContractsRegistryType,
  CorePropertiesType,
  DistributionProposalType,
  ERC20Type,
  ERC721Type,
  GovPoolType,
  GovSettingsType,
  GovUserKeeperType,
  GovValidatorsType,
  InsuranceType,
  InvestTraderPoolType,
  PoolFactoryType,
  PoolRegistryType,
  PriceFeedType,
  TraderPoolInvestProposalType,
  TraderPoolRiskyProposalType,
  TraderPoolType,
  UserRegistryType,
} from "interfaces/abi-typings"

import {
  selectCorePropertiesAddress,
  selectInsuranceAddress,
  selectPoolFactoryAddress,
  selectPoolRegistryAddress,
  selectPriceFeedAddress,
  selectUserRegistryAddress,
} from "state/contracts/selectors"

import { Multicall } from "interfaces/abi-typings/Multicall"
import multiCallAbi from "abi/Multicall.json"
import { getMulticallAddress } from "utils/addressHelpers"
import { useActiveWeb3React } from "hooks"

/*
    TODO: useERC20Contract
      * hint | add ERC20 abi to folder containing all json abis
*/

type Address = string | undefined

export function useERC20Contract(address: Address) {
  return useContract(address, ERC20) as unknown as ERC20Type | null
}

export function useERC721Contract(address: Address) {
  return useContract(address, ERC721) as unknown as ERC721Type | null
}

export function useContractsRegistryContract() {
  return useContract(
    process.env.REACT_APP_CONTRACTS_REGISTRY_ADDRESS,
    ContractsRegistry
  ) as unknown as ContractsRegistryType | null
}

export function useCorePropertiesContract() {
  return useContract(
    useSelector(selectCorePropertiesAddress),
    CoreProperties
  ) as unknown as CorePropertiesType | null
}

export function useBasicPoolContract(address: Address) {
  return useContract(
    address,
    BasicTraderPool
  ) as unknown as BasicTraderPoolType | null
}

export function useInsuranceContract() {
  return useContract(
    useSelector(selectInsuranceAddress),
    Insurance
  ) as unknown as InsuranceType | null
}

export function useInvestTraderPoolContract(address: Address) {
  return useContract(
    address,
    InvestTraderPool
  ) as unknown as InvestTraderPoolType | null
}

// no type for this contract
// reason: bad generated ts code
export function usePoolFactoryContract() {
  return useContract(useSelector(selectPoolFactoryAddress), PoolFactory)
}

export function usePoolRegistryContract() {
  return useContract(
    useSelector(selectPoolRegistryAddress),
    PoolRegistry
  ) as unknown as PoolRegistryType | null
}

export function usePriceFeedContract() {
  return useContract(
    useSelector(selectPriceFeedAddress),
    PriceFeed
  ) as unknown as PriceFeedType | null
}

export function useTraderPoolContract(address: Address) {
  return useContract(address, TraderPool) as unknown as TraderPoolType | null
}

export function useTraderPoolInvestProposalContract(address: Address) {
  return useContract(
    address,
    TraderPoolInvestProposal
  ) as unknown as TraderPoolInvestProposalType | null
}

export function useTraderPoolRiskyProposalContract(address: Address) {
  return useContract(
    address,
    TraderPoolRiskyProposal
  ) as unknown as TraderPoolRiskyProposalType | null
}

export function useUserRegistryContract() {
  return useContract(
    useSelector(selectUserRegistryAddress),
    UserRegistry
  ) as unknown as UserRegistryType | null
}

export function useDistributionProposalContract(address: Address) {
  return useContract(
    address,
    DistributionProposal
  ) as unknown as DistributionProposalType | null
}

export function useGovPoolContract(address: Address) {
  return useContract(address, GovPool) as unknown as GovPoolType | null
}

export function useGovSettingsContract(address: Address) {
  return useContract(address, GovSettings) as unknown as GovSettingsType | null
}

export function useGovUserKeeperContract(address: Address) {
  return useContract(
    address,
    GovUserKeeper
  ) as unknown as GovUserKeeperType | null
}

export function useGovValidatorsContract(address: Address) {
  return useContract(
    address,
    GovValidators
  ) as unknown as GovValidatorsType | null
}

export function useMulticallContract() {
  const { chainId } = useActiveWeb3React()
  return useContract(
    getMulticallAddress(chainId),
    multiCallAbi,
    false
  ) as unknown as Multicall | null
}
