import { IUserData } from "constants/interfaces"
import { OwnedPools } from "constants/interfaces_v2"

export interface IUserTerms {
  agreed: boolean
  processed: boolean
  showAgreement: boolean
}

export interface IUserState {
  userProMode: boolean
  loading: boolean
  ownedPools: OwnedPools
  data: IUserData | null | false
  terms: IUserTerms
}
