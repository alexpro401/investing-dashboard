import { useSelector } from "react-redux"

import useContract from "hooks/useContract"

import {
  BasicTraderPool,
  ContractsRegistry,
  CoreProperties,
  ERC20,
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

/*
    TODO: useERC20Contract
      * hint | add ERC20 abi to folder containing all json abis
*/

type Address = string | undefined

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

export function usePoolFactoryContract() {
  return useContract(
    useSelector(selectPoolFactoryAddress),
    PoolFactory
  ) as unknown as PoolFactoryType | null
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
