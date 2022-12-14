import React, { createContext, useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { BigNumber } from "@ethersproject/bignumber"

import { useActiveWeb3React } from "hooks"
import {
  useGovValidatorsValidatorsToken,
  useGovValidatorsTokenTotalSupply,
  useGovPoolVotingAssets,
  useGovPoolTreasury,
} from "hooks/dao"
import { Token } from "interfaces"
import { useAPI } from "api"
import { ITreasuryToken } from "api/token/types"

interface INftCollection {
  name: string
  symbol: string
  count: number
  logo: string
  address: string
}

interface IGovPoolProfileCommonContext {
  validatorsTokenAddress: string
  validatorsToken: Token | null
  validatorsTotalVotes: BigNumber | null
  haveNft: boolean
  haveToken: boolean
  mainToken: Token | null
  treasuryTokens: ITreasuryToken[]
  treasuryNftCollections: INftCollection[]
  treasuryLoading: boolean
}

export const GovPoolProfileCommonContext =
  createContext<IGovPoolProfileCommonContext>({
    validatorsTokenAddress: "",
    validatorsToken: null,
    validatorsTotalVotes: null,
    haveNft: false,
    haveToken: false,
    mainToken: null,
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

  const [{ haveNft, haveToken }, { token: mainToken }] =
    useGovPoolVotingAssets(daoAddress)

  useEffect(() => {
    setupTreasury()
  }, [setupTreasury])

  return (
    <GovPoolProfileCommonContext.Provider
      value={{
        validatorsToken,
        validatorsTokenAddress,
        validatorsTotalVotes,
        haveNft,
        haveToken,
        mainToken,
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
