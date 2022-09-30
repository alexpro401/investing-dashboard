import {
  createContext,
  Dispatch,
  FC,
  HTMLAttributes,
  SetStateAction,
  useState,
} from "react"

type UserKeeperDeployParams = {
  tokenAddress: string
  nftAddress: string
  totalPowerInTokens: number
  nftsTotalSupply: number
}

type ValidatorsDeployParams = {
  name: string
  symbol: string
  duration: number
  quorum: number
  validators: string[]
  balances: number[]
}

type GovPoolDeployParams = {
  descriptionUrl: string
}

type ProposalSettings = {
  earlyCompletion: boolean
  delegatedVotingAllowed: boolean
  validatorsVote: boolean
  duration: number
  durationValidators: number
  quorum: number
  quorumValidators: number
  minVotesForVoting: number
  minVotesForCreating: number
  rewardToken: string
  creationReward: number
  executionReward: number
  voteRewardsCoefficient: number
  executorDescription: string
}

export interface UserKeeperDeployParamsForm {
  tokenAddress: { get: string; set: Dispatch<SetStateAction<string>> }
  nftAddress: { get: string; set: Dispatch<SetStateAction<string>> }
  totalPowerInTokens: { get: number; set: Dispatch<SetStateAction<number>> }
  nftsTotalSupply: { get: number; set: Dispatch<SetStateAction<number>> }
}

export interface ValidatorsDeployParamsForm {
  name: { get: string; set: Dispatch<SetStateAction<string>> }
  symbol: { get: string; set: Dispatch<SetStateAction<string>> }
  duration: { get: number; set: Dispatch<SetStateAction<number>> }
  quorum: { get: number; set: Dispatch<SetStateAction<number>> }
  validators: { get: string[]; set: Dispatch<SetStateAction<string[]>> }
  balances: { get: number[]; set: Dispatch<SetStateAction<number[]>> }
}

export interface GovPoolDeployParamsForm {
  descriptionUrl: { get: string; set: Dispatch<SetStateAction<string>> }
}

export interface DaoProposalSettingsForm {
  earlyCompletion: { get: boolean; set: Dispatch<SetStateAction<boolean>> }
  delegatedVotingAllowed: {
    get: boolean
    set: Dispatch<SetStateAction<boolean>>
  }
  validatorsVote: { get: boolean; set: Dispatch<SetStateAction<boolean>> }
  duration: { get: number; set: Dispatch<SetStateAction<number>> }
  durationValidators: { get: number; set: Dispatch<SetStateAction<number>> }
  quorum: { get: number; set: Dispatch<SetStateAction<number>> }
  quorumValidators: { get: number; set: Dispatch<SetStateAction<number>> }
  minVotesForVoting: { get: number; set: Dispatch<SetStateAction<number>> }
  minVotesForCreating: { get: number; set: Dispatch<SetStateAction<number>> }
  rewardToken: { get: string; set: Dispatch<SetStateAction<string>> }
  creationReward: { get: number; set: Dispatch<SetStateAction<number>> }
  executionReward: { get: number; set: Dispatch<SetStateAction<number>> }
  voteRewardsCoefficient: { get: number; set: Dispatch<SetStateAction<number>> }
  executorDescription: { get: string; set: Dispatch<SetStateAction<string>> }

  // TODO: ?
  // minTokenBalance: { get: string; set: Dispatch<SetStateAction<string>> }
  // minNftBalance: { get: string; set: Dispatch<SetStateAction<string>> }
}

interface FundDaoCreatingContext {
  isErc20: { get: boolean; set: Dispatch<SetStateAction<boolean>> }
  isErc721: { get: boolean; set: Dispatch<SetStateAction<boolean>> }

  isValidator: { get: boolean; set: Dispatch<SetStateAction<boolean>> }

  avatarUrl: { get: string; set: Dispatch<SetStateAction<string>> }
  daoName: { get: string; set: Dispatch<SetStateAction<string>> }
  websiteUrl: { get: string; set: Dispatch<SetStateAction<string>> }
  description: { get: string; set: Dispatch<SetStateAction<string>> }

  userKeeperParams: UserKeeperDeployParamsForm
  validatorsParams: ValidatorsDeployParamsForm
  govPoolDeployParams: GovPoolDeployParamsForm

  internalProposalForm: DaoProposalSettingsForm
  distributionProposalSettingsForm: DaoProposalSettingsForm
  validatorsBalancesSettingsForm: DaoProposalSettingsForm
  defaultProposalSettingForm: DaoProposalSettingsForm
}

export const FundDaoCreatingContext = createContext<FundDaoCreatingContext>({
  isErc20: { get: false, set: () => {} },
  isErc721: { get: false, set: () => {} },

  isValidator: { get: false, set: () => {} },

  avatarUrl: { get: "", set: () => {} },
  daoName: { get: "", set: () => {} },
  websiteUrl: { get: "", set: () => {} },
  description: { get: "", set: () => {} },

  userKeeperParams: {} as UserKeeperDeployParamsForm,
  validatorsParams: {} as ValidatorsDeployParamsForm,
  govPoolDeployParams: {} as GovPoolDeployParamsForm,

  internalProposalForm: {} as DaoProposalSettingsForm,
  distributionProposalSettingsForm: {} as DaoProposalSettingsForm,
  validatorsBalancesSettingsForm: {} as DaoProposalSettingsForm,
  defaultProposalSettingForm: {} as DaoProposalSettingsForm,
})

const FundDaoCreatingContextProvider: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
}) => {
  const [_isErc20, _setIsErc20] = useState<boolean>(false)
  const [_isErc721, _setIsErc721] = useState<boolean>(false)

  const [_isValidator, _setIsValidator] = useState(false)

  // to ipfs
  const [_avatarUrl, _setAvatarUrl] = useState<string>("")
  const [_daoName, _setDaoName] = useState("")
  const [_websiteUrl, _setWebsiteUrl] = useState("")
  const [_description, _setDescription] = useState("")

  const _userKeeperParams = {
    tokenAddress: useState(""),
    nftAddress: useState(""),
    totalPowerInTokens: useState(0),
    nftsTotalSupply: useState(0),
  }
  const _validatorsParams = {
    name: useState<string>(""),
    symbol: useState<string>(""),
    duration: useState<number>(0),
    quorum: useState<number>(0),
    validators: useState<string[]>([]),
    balances: useState<number[]>([]),
  }
  const _govPoolDeployParams = {
    descriptionUrl: useState<string>(""),
  }

  const _internalProposalForm = {
    earlyCompletion: useState<boolean>(false),
    delegatedVotingAllowed: useState<boolean>(false),
    validatorsVote: useState<boolean>(false),
    duration: useState<number>(0),
    durationValidators: useState<number>(0),
    quorum: useState<number>(0),
    quorumValidators: useState<number>(0),
    minVotesForVoting: useState<number>(0),
    minVotesForCreating: useState<number>(0),
    rewardToken: useState<string>(""),
    creationReward: useState<number>(0),
    executionReward: useState<number>(0),
    voteRewardsCoefficient: useState<number>(0),
    executorDescription: useState<string>(""),
  }
  const _distributionProposalSettingsForm = {
    earlyCompletion: useState<boolean>(false),
    delegatedVotingAllowed: useState<boolean>(false),
    validatorsVote: useState<boolean>(false),
    duration: useState<number>(0),
    durationValidators: useState<number>(0),
    quorum: useState<number>(0),
    quorumValidators: useState<number>(0),
    minVotesForVoting: useState<number>(0),
    minVotesForCreating: useState<number>(0),
    rewardToken: useState<string>(""),
    creationReward: useState<number>(0),
    executionReward: useState<number>(0),
    voteRewardsCoefficient: useState<number>(0),
    executorDescription: useState<string>(""),
  }
  const _validatorsBalancesSettingsForm = {
    earlyCompletion: useState<boolean>(false),
    delegatedVotingAllowed: useState<boolean>(false),
    validatorsVote: useState<boolean>(false),
    duration: useState<number>(0),
    durationValidators: useState<number>(0),
    quorum: useState<number>(0),
    quorumValidators: useState<number>(0),
    minVotesForVoting: useState<number>(0),
    minVotesForCreating: useState<number>(0),
    rewardToken: useState<string>(""),
    creationReward: useState<number>(0),
    executionReward: useState<number>(0),
    voteRewardsCoefficient: useState<number>(0),
    executorDescription: useState<string>(""),
  }
  const _defaultProposalSettingForm = {
    earlyCompletion: useState<boolean>(false),
    delegatedVotingAllowed: useState<boolean>(false),
    validatorsVote: useState<boolean>(false),
    duration: useState<number>(0),
    durationValidators: useState<number>(0),
    quorum: useState<number>(0),
    quorumValidators: useState<number>(0),
    minVotesForVoting: useState<number>(0),
    minVotesForCreating: useState<number>(0),
    rewardToken: useState<string>(""),
    creationReward: useState<number>(0),
    executionReward: useState<number>(0),
    voteRewardsCoefficient: useState<number>(0),
    executorDescription: useState<string>(""),
  }

  return (
    <>
      <FundDaoCreatingContext.Provider
        value={{
          isErc20: { get: _isErc20, set: _setIsErc20 },
          isErc721: { get: _isErc721, set: _setIsErc721 },

          isValidator: { get: _isValidator, set: _setIsValidator },

          avatarUrl: { get: _avatarUrl, set: _setAvatarUrl },
          daoName: { get: _daoName, set: _setDaoName },
          websiteUrl: { get: _websiteUrl, set: _setWebsiteUrl },
          description: { get: _description, set: _setDescription },

          userKeeperParams: {
            tokenAddress: {
              get: _userKeeperParams.tokenAddress[0],
              set: _userKeeperParams.tokenAddress[1],
            },
            nftAddress: {
              get: _userKeeperParams.nftAddress[0],
              set: _userKeeperParams.nftAddress[1],
            },
            totalPowerInTokens: {
              get: _userKeeperParams.totalPowerInTokens[0],
              set: _userKeeperParams.totalPowerInTokens[1],
            },
            nftsTotalSupply: {
              get: _userKeeperParams.nftsTotalSupply[0],
              set: _userKeeperParams.nftsTotalSupply[1],
            },
          } as UserKeeperDeployParamsForm,
          validatorsParams: {
            name: {
              get: _validatorsParams.name[0],
              set: _validatorsParams.name[1],
            },
            symbol: {
              get: _validatorsParams.symbol[0],
              set: _validatorsParams.symbol[1],
            },
            duration: {
              get: _validatorsParams.duration[0],
              set: _validatorsParams.duration[1],
            },
            quorum: {
              get: _validatorsParams.quorum[0],
              set: _validatorsParams.quorum[1],
            },
            validators: {
              get: _validatorsParams.validators[0],
              set: _validatorsParams.validators[1],
            },
            balances: {
              get: _validatorsParams.balances[0],
              set: _validatorsParams.balances[1],
            },
          } as ValidatorsDeployParamsForm,
          govPoolDeployParams: {
            descriptionUrl: {
              get: _govPoolDeployParams.descriptionUrl[0],
              set: _govPoolDeployParams.descriptionUrl[1],
            },
          } as GovPoolDeployParamsForm,

          internalProposalForm: {
            earlyCompletion: {
              get: _internalProposalForm.earlyCompletion[0],
              set: _internalProposalForm.earlyCompletion[1],
            },
            delegatedVotingAllowed: {
              get: _internalProposalForm.delegatedVotingAllowed[0],
              set: _internalProposalForm.delegatedVotingAllowed[1],
            },
            validatorsVote: {
              get: _internalProposalForm.validatorsVote[0],
              set: _internalProposalForm.validatorsVote[1],
            },
            duration: {
              get: _internalProposalForm.duration[0],
              set: _internalProposalForm.duration[1],
            },
            durationValidators: {
              get: _internalProposalForm.durationValidators[0],
              set: _internalProposalForm.durationValidators[1],
            },
            quorum: {
              get: _internalProposalForm.quorum[0],
              set: _internalProposalForm.quorum[1],
            },
            quorumValidators: {
              get: _internalProposalForm.quorumValidators[0],
              set: _internalProposalForm.quorumValidators[1],
            },
            minVotesForVoting: {
              get: _internalProposalForm.minVotesForVoting[0],
              set: _internalProposalForm.minVotesForVoting[1],
            },
            minVotesForCreating: {
              get: _internalProposalForm.minVotesForCreating[0],
              set: _internalProposalForm.minVotesForCreating[1],
            },
            rewardToken: {
              get: _internalProposalForm.rewardToken[0],
              set: _internalProposalForm.rewardToken[1],
            },
            creationReward: {
              get: _internalProposalForm.creationReward[0],
              set: _internalProposalForm.creationReward[1],
            },
            executionReward: {
              get: _internalProposalForm.executionReward[0],
              set: _internalProposalForm.executionReward[1],
            },
            voteRewardsCoefficient: {
              get: _internalProposalForm.voteRewardsCoefficient[0],
              set: _internalProposalForm.voteRewardsCoefficient[1],
            },
            executorDescription: {
              get: _internalProposalForm.executorDescription[0],
              set: _internalProposalForm.executorDescription[1],
            },
          } as DaoProposalSettingsForm,
          distributionProposalSettingsForm: {
            earlyCompletion: {
              get: _distributionProposalSettingsForm.earlyCompletion[0],
              set: _distributionProposalSettingsForm.earlyCompletion[1],
            },
            delegatedVotingAllowed: {
              get: _distributionProposalSettingsForm.delegatedVotingAllowed[0],
              set: _distributionProposalSettingsForm.delegatedVotingAllowed[1],
            },
            validatorsVote: {
              get: _distributionProposalSettingsForm.validatorsVote[0],
              set: _distributionProposalSettingsForm.validatorsVote[1],
            },
            duration: {
              get: _distributionProposalSettingsForm.duration[0],
              set: _distributionProposalSettingsForm.duration[1],
            },
            durationValidators: {
              get: _distributionProposalSettingsForm.durationValidators[0],
              set: _distributionProposalSettingsForm.durationValidators[1],
            },
            quorum: {
              get: _distributionProposalSettingsForm.quorum[0],
              set: _distributionProposalSettingsForm.quorum[1],
            },
            quorumValidators: {
              get: _distributionProposalSettingsForm.quorumValidators[0],
              set: _distributionProposalSettingsForm.quorumValidators[1],
            },
            minVotesForVoting: {
              get: _distributionProposalSettingsForm.minVotesForVoting[0],
              set: _distributionProposalSettingsForm.minVotesForVoting[1],
            },
            minVotesForCreating: {
              get: _distributionProposalSettingsForm.minVotesForCreating[0],
              set: _distributionProposalSettingsForm.minVotesForCreating[1],
            },
            rewardToken: {
              get: _distributionProposalSettingsForm.rewardToken[0],
              set: _distributionProposalSettingsForm.rewardToken[1],
            },
            creationReward: {
              get: _distributionProposalSettingsForm.creationReward[0],
              set: _distributionProposalSettingsForm.creationReward[1],
            },
            executionReward: {
              get: _distributionProposalSettingsForm.executionReward[0],
              set: _distributionProposalSettingsForm.executionReward[1],
            },
            voteRewardsCoefficient: {
              get: _distributionProposalSettingsForm.voteRewardsCoefficient[0],
              set: _distributionProposalSettingsForm.voteRewardsCoefficient[1],
            },
            executorDescription: {
              get: _distributionProposalSettingsForm.executorDescription[0],
              set: _distributionProposalSettingsForm.executorDescription[1],
            },
          } as DaoProposalSettingsForm,
          validatorsBalancesSettingsForm: {
            earlyCompletion: {
              get: _validatorsBalancesSettingsForm.earlyCompletion[0],
              set: _validatorsBalancesSettingsForm.earlyCompletion[1],
            },
            delegatedVotingAllowed: {
              get: _validatorsBalancesSettingsForm.delegatedVotingAllowed[0],
              set: _validatorsBalancesSettingsForm.delegatedVotingAllowed[1],
            },
            validatorsVote: {
              get: _validatorsBalancesSettingsForm.validatorsVote[0],
              set: _validatorsBalancesSettingsForm.validatorsVote[1],
            },
            duration: {
              get: _validatorsBalancesSettingsForm.duration[0],
              set: _validatorsBalancesSettingsForm.duration[1],
            },
            durationValidators: {
              get: _validatorsBalancesSettingsForm.durationValidators[0],
              set: _validatorsBalancesSettingsForm.durationValidators[1],
            },
            quorum: {
              get: _validatorsBalancesSettingsForm.quorum[0],
              set: _validatorsBalancesSettingsForm.quorum[1],
            },
            quorumValidators: {
              get: _validatorsBalancesSettingsForm.quorumValidators[0],
              set: _validatorsBalancesSettingsForm.quorumValidators[1],
            },
            minVotesForVoting: {
              get: _validatorsBalancesSettingsForm.minVotesForVoting[0],
              set: _validatorsBalancesSettingsForm.minVotesForVoting[1],
            },
            minVotesForCreating: {
              get: _validatorsBalancesSettingsForm.minVotesForCreating[0],
              set: _validatorsBalancesSettingsForm.minVotesForCreating[1],
            },
            rewardToken: {
              get: _validatorsBalancesSettingsForm.rewardToken[0],
              set: _validatorsBalancesSettingsForm.rewardToken[1],
            },
            creationReward: {
              get: _validatorsBalancesSettingsForm.creationReward[0],
              set: _validatorsBalancesSettingsForm.creationReward[1],
            },
            executionReward: {
              get: _validatorsBalancesSettingsForm.executionReward[0],
              set: _validatorsBalancesSettingsForm.executionReward[1],
            },
            voteRewardsCoefficient: {
              get: _validatorsBalancesSettingsForm.voteRewardsCoefficient[0],
              set: _validatorsBalancesSettingsForm.voteRewardsCoefficient[1],
            },
            executorDescription: {
              get: _validatorsBalancesSettingsForm.executorDescription[0],
              set: _validatorsBalancesSettingsForm.executorDescription[1],
            },
          } as DaoProposalSettingsForm,
          defaultProposalSettingForm: {
            earlyCompletion: {
              get: _defaultProposalSettingForm.earlyCompletion[0],
              set: _defaultProposalSettingForm.earlyCompletion[1],
            },
            delegatedVotingAllowed: {
              get: _defaultProposalSettingForm.delegatedVotingAllowed[0],
              set: _defaultProposalSettingForm.delegatedVotingAllowed[1],
            },
            validatorsVote: {
              get: _defaultProposalSettingForm.validatorsVote[0],
              set: _defaultProposalSettingForm.validatorsVote[1],
            },
            duration: {
              get: _defaultProposalSettingForm.duration[0],
              set: _defaultProposalSettingForm.duration[1],
            },
            durationValidators: {
              get: _defaultProposalSettingForm.durationValidators[0],
              set: _defaultProposalSettingForm.durationValidators[1],
            },
            quorum: {
              get: _defaultProposalSettingForm.quorum[0],
              set: _defaultProposalSettingForm.quorum[1],
            },
            quorumValidators: {
              get: _defaultProposalSettingForm.quorumValidators[0],
              set: _defaultProposalSettingForm.quorumValidators[1],
            },
            minVotesForVoting: {
              get: _defaultProposalSettingForm.minVotesForVoting[0],
              set: _defaultProposalSettingForm.minVotesForVoting[1],
            },
            minVotesForCreating: {
              get: _defaultProposalSettingForm.minVotesForCreating[0],
              set: _defaultProposalSettingForm.minVotesForCreating[1],
            },
            rewardToken: {
              get: _defaultProposalSettingForm.rewardToken[0],
              set: _defaultProposalSettingForm.rewardToken[1],
            },
            creationReward: {
              get: _defaultProposalSettingForm.creationReward[0],
              set: _defaultProposalSettingForm.creationReward[1],
            },
            executionReward: {
              get: _defaultProposalSettingForm.executionReward[0],
              set: _defaultProposalSettingForm.executionReward[1],
            },
            voteRewardsCoefficient: {
              get: _defaultProposalSettingForm.voteRewardsCoefficient[0],
              set: _defaultProposalSettingForm.voteRewardsCoefficient[1],
            },
            executorDescription: {
              get: _defaultProposalSettingForm.executorDescription[0],
              set: _defaultProposalSettingForm.executorDescription[1],
            },
          } as DaoProposalSettingsForm,
        }}
      >
        {children}
      </FundDaoCreatingContext.Provider>
    </>
  )
}

export default FundDaoCreatingContextProvider
