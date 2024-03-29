import { IUserData } from "interfaces"
import { OwnedPools } from "interfaces"

export interface IUserTerms {
  agreed: boolean
  showAgreement: boolean
}

export interface IUserState {
  userProMode: boolean
  loading: boolean
  ownedPools: OwnedPools
  data: IUserData | null | false
  terms: IUserTerms
  tokens: {
    [chainId: number]: {
      [address: string]: SerializedToken
    }
  }
}

export interface SerializedToken {
  chainId: number
  address: string
  decimals: number
  symbol?: string
  name?: string
}
