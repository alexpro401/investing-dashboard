import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react"
import { useParams } from "react-router-dom"
import { BigNumber } from "@ethersproject/bignumber"
import { useQuery, UseQueryState } from "urql"

import { useActiveWeb3React } from "hooks"
import {
  useGovValidatorsValidatorsToken,
  useGovValidatorsTokenTotalSupply,
  useGovPoolVotingAssets,
  useGovPoolTreasury,
  useGovPoolDescription,
} from "hooks/dao"
import { Token } from "interfaces"
import { useAPI } from "api"
import { ITreasuryToken } from "api/token/types"
import { IGovPoolDescription } from "types"
import { graphClientDaoPools } from "utils/graphClient"
import { GovPoolQuery } from "queries"
import { IGovPoolQuery } from "interfaces/thegraphs/gov-pools"

interface INftCollection {
  name: string
  symbol: string
  count: number
  logo: string
  address: string
}

interface IGovPoolProfileCommonContext {
  govPoolQuery: UseQueryState<{ daoPool: IGovPoolQuery }> | undefined
  validatorsTokenAddress: string
  validatorsToken: Token | null
  validatorsTotalVotes: BigNumber | null
  descriptionObject: IGovPoolDescription | null | undefined
  haveNft: boolean
  haveToken: boolean
  mainToken: Token | null
  nftName: string
  nftAddress: string
  treasuryTokens: ITreasuryToken[]
  treasuryNftCollections: INftCollection[]
  treasuryLoading: boolean
}

export const GovPoolProfileCommonContext =
  createContext<IGovPoolProfileCommonContext>({
    govPoolQuery: undefined,
    validatorsTokenAddress: "",
    validatorsToken: null,
    validatorsTotalVotes: null,
    descriptionObject: undefined,
    haveNft: false,
    haveToken: false,
    mainToken: null,
    nftName: "",
    nftAddress: "",
    treasuryTokens: [],
    treasuryNftCollections: [],
    treasuryLoading: false,
  })

interface IGovPoolProfileCommonContextProviderProps {
  children: React.ReactNode
}

const GovPoolProfileCommonContextProvider: React.FC<
  IGovPoolProfileCommonContextProviderProps
> = ({ children }) => {
  const { daoAddress } = useParams<"daoAddress">()
  const { NFTAPI } = useAPI()
  const [treasuryTokens, treasuryTokensLoading] = useGovPoolTreasury(daoAddress)
  const [treasuryNftCollections, setTreasuryNftCollections] = useState<
    INftCollection[]
  >([])
  const [treasuryNFTsLoading, setTreasuryNFTsLoading] = useState<boolean>(true)
  const { chainId } = useActiveWeb3React()

  const [govPoolQuery] = useQuery<{ daoPool: IGovPoolQuery }>({
    query: GovPoolQuery,
    variables: useMemo(() => ({ address: daoAddress }), [daoAddress]),
    context: graphClientDaoPools,
  })

  const setupTreasury = useCallback(async () => {
    if (!chainId || !daoAddress) return

    setTreasuryNFTsLoading(true)
    try {
      const nftsByWallet = await NFTAPI.getNftsByWallet(daoAddress, { chainId })

      const treasuryNftCollections = nftsByWallet.reduce((acc, record) => {
        const path = `${record.name}-${record.symbol}`
        if (acc[path]) {
          return {
            ...acc,
            [path]: {
              ...acc[path],
              count: acc[path].count + 1,
            },
          }
        } else {
          return {
            ...acc,
            [path]: {
              name: record.name,
              symbol: record.symbol,
              logo: record.token_uri ?? "",
              count: 1,
              address: record.token_address,
            },
          }
        }
      }, {} as Record<string, INftCollection>)
      const flattedNftCollections = Object.keys(treasuryNftCollections).map(
        (key) => treasuryNftCollections[key]
      )

      setTreasuryNftCollections(flattedNftCollections)
    } catch (error) {
    } finally {
      setTreasuryNFTsLoading(false)
    }
  }, [chainId, NFTAPI, daoAddress])

  const [validatorsTokenAddress, validatorsToken] =
    useGovValidatorsValidatorsToken(daoAddress ?? "")

  const [validatorsTotalVotes] = useGovValidatorsTokenTotalSupply(daoAddress)
  const { descriptionObject } = useGovPoolDescription(daoAddress)

  const [
    { haveNft, haveToken },
    {
      token: mainToken,
      nft: { name: nftName, address: nftAddress },
    },
  ] = useGovPoolVotingAssets(daoAddress)

  useEffect(() => {
    setupTreasury()
  }, [setupTreasury])

  return (
    <GovPoolProfileCommonContext.Provider
      value={{
        govPoolQuery,
        validatorsToken,
        validatorsTokenAddress,
        validatorsTotalVotes,
        descriptionObject,
        haveNft,
        haveToken,
        mainToken,
        nftName,
        nftAddress,
        treasuryTokens: treasuryTokens ? treasuryTokens.items : [],
        treasuryLoading: treasuryTokensLoading || treasuryNFTsLoading || false,
        treasuryNftCollections,
      }}
    >
      {children}
    </GovPoolProfileCommonContext.Provider>
  )
}

export default GovPoolProfileCommonContextProvider
