import {
  createContext,
  Dispatch,
  FC,
  HTMLAttributes,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
} from "react"
import { useERC20 } from "hooks/useERC20"
import { useErc721 } from "hooks/useErc721"
import { useLocalStorage } from "react-use"
import { DaoProposal, ExternalFileDocument } from "types"
import { INITIAL_DAO_PROPOSAL } from "constants/dao"
import { get, isEqual } from "lodash"

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
  validators: { get: string[]; set: (value: any, idx?: number) => void }
  balances: { get: number[]; set: (value: any, idx?: number) => void }
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
}

interface FundDaoCreatingContext {
  isErc20: { get: boolean; set: Dispatch<SetStateAction<boolean>> }
  isErc721: { get: boolean; set: Dispatch<SetStateAction<boolean>> }
  erc20: ReturnType<typeof useERC20>
  erc721: ReturnType<typeof useErc721>

  isCustomVoting: { get: boolean; set: Dispatch<SetStateAction<boolean>> }
  isDistributionProposal: {
    get: boolean
    set: Dispatch<SetStateAction<boolean>>
  }
  isValidator: { get: boolean; set: Dispatch<SetStateAction<boolean>> }

  avatarUrl: { get: string; set: Dispatch<SetStateAction<string>> }
  daoName: { get: string; set: Dispatch<SetStateAction<string>> }
  websiteUrl: { get: string; set: Dispatch<SetStateAction<string>> }
  description: { get: string; set: Dispatch<SetStateAction<string>> }
  documents: {
    get: ExternalFileDocument[]
    set: (
      value: ExternalFileDocument | ExternalFileDocument[],
      idx?: number
    ) => void
  }

  userKeeperParams: UserKeeperDeployParamsForm
  validatorsParams: ValidatorsDeployParamsForm

  defaultProposalSettingForm: DaoProposalSettingsForm
  internalProposalForm: DaoProposalSettingsForm
  validatorsBalancesSettingsForm: DaoProposalSettingsForm
  distributionProposalSettingsForm: DaoProposalSettingsForm

  clearFormStorage: () => void
  createdDaoAddress: { get: string; set: Dispatch<SetStateAction<string>> }
  initialForm: DaoProposal
}

export const FundDaoCreatingContext = createContext<FundDaoCreatingContext>({
  isErc20: { get: false, set: () => {} },
  isErc721: { get: false, set: () => {} },
  isCustomVoting: { get: false, set: () => {} },
  isDistributionProposal: { get: false, set: () => {} },
  isValidator: { get: false, set: () => {} },
  erc20: {} as ReturnType<typeof useERC20>,
  erc721: {} as ReturnType<typeof useErc721>,

  avatarUrl: { get: "", set: () => {} },
  daoName: { get: "", set: () => {} },
  websiteUrl: { get: "", set: () => {} },
  description: { get: "", set: () => {} },
  documents: { get: [], set: () => {} },

  userKeeperParams: {} as UserKeeperDeployParamsForm,
  validatorsParams: {} as ValidatorsDeployParamsForm,

  internalProposalForm: {} as DaoProposalSettingsForm,
  validatorsBalancesSettingsForm: {} as DaoProposalSettingsForm,
  defaultProposalSettingForm: {} as DaoProposalSettingsForm,
  distributionProposalSettingsForm: {} as DaoProposalSettingsForm,

  clearFormStorage: () => {},
  createdDaoAddress: { get: "", set: () => {} },
  initialForm: {} as DaoProposal,
})

interface IFundDaoCreatingContextProviderProps
  extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  customLSKey?: string
  daoProposal?: DaoProposal
}

const FundDaoCreatingContextProvider: FC<
  IFundDaoCreatingContextProviderProps
> = ({ children, customLSKey, daoProposal }) => {
  const [value, setValue, remove] = useLocalStorage(
    customLSKey ? customLSKey : "fund-dao-creating-form",
    JSON.stringify(daoProposal ? daoProposal : INITIAL_DAO_PROPOSAL)
  )

  const initialForm = useMemo<DaoProposal>(() => {
    if (customLSKey) {
      const customFormFromLS = localStorage.getItem(customLSKey)

      if (customFormFromLS) {
        return JSON.parse(JSON.parse(customFormFromLS))
      }

      return daoProposal
    } else {
      const formFromLS = localStorage.getItem("fund-dao-creating-form")

      if (formFromLS) {
        return JSON.parse(JSON.parse(formFromLS))
      }

      return INITIAL_DAO_PROPOSAL
    }
  }, [customLSKey, daoProposal])

  const storedForm = useMemo<DaoProposal>(() => {
    try {
      return value ? JSON.parse(value) : {}
    } catch (error) {
      return {}
    }
  }, [value])

  const [_isErc20, _setIsErc20] = useState<boolean>(storedForm._isErc20)
  const [_isErc721, _setIsErc721] = useState<boolean>(storedForm._isErc721)

  const [_isCustomVoting, _setIsCustomVoting] = useState<boolean>(
    storedForm._isCustomVoting
  )
  const [_isDistributionProposal, _setIsDistributionProposal] =
    useState<boolean>(storedForm._isDistributionProposal)

  const [_isValidator, _setIsValidator] = useState(storedForm._isValidator)

  // to ipfs
  const [_avatarUrl, _setAvatarUrl] = useState<string>(storedForm._avatarUrl)
  const [_daoName, _setDaoName] = useState(storedForm._daoName)
  const [_websiteUrl, _setWebsiteUrl] = useState(storedForm._websiteUrl)
  const [_description, _setDescription] = useState(storedForm._description)
  const [_documents, _setDocuments] = useState<ExternalFileDocument[]>(
    storedForm._documents
  )

  const _handleChangeDocuments = useCallback((value, idx?: number) => {
    _setDocuments((prev) => {
      if (Array.isArray(value)) {
        return value
      } else {
        const newDocs = [...prev]
        if (idx !== undefined && idx !== null) {
          newDocs[idx] = value
        }
        return newDocs
      }
    })
  }, [])

  const _userKeeperParams = {
    tokenAddress: useState(storedForm._userKeeperParams.tokenAddress),
    nftAddress: useState(storedForm._userKeeperParams.nftAddress),
    totalPowerInTokens: useState(
      storedForm._userKeeperParams.totalPowerInTokens
    ),
    nftsTotalSupply: useState(storedForm._userKeeperParams.nftsTotalSupply),
  }
  const _validatorsParams = {
    name: useState<string>(storedForm._validatorsParams.name),
    symbol: useState<string>(storedForm._validatorsParams.symbol),
    duration: useState<number>(storedForm._validatorsParams.duration),
    quorum: useState<number>(storedForm._validatorsParams.quorum),
    validators: useState<string[]>(storedForm._validatorsParams.validators),
    balances: useState<number[]>(storedForm._validatorsParams.balances),
  }

  const _handleChangeValidators = useCallback(
    (value, idx?: number) => {
      _validatorsParams.validators[1]((prev) => {
        if (Array.isArray(value)) {
          return value
        } else {
          const newValidators = [...prev]
          if (idx !== undefined && idx !== null) {
            newValidators[idx] = value
          }
          return newValidators
        }
      })
    },
    [_validatorsParams.validators]
  )

  const _handleChangeBalances = useCallback(
    (value, idx?: number) => {
      _validatorsParams.balances[1]((prev) => {
        if (Array.isArray(value)) {
          return value
        } else {
          const newBalances = [...prev]
          if (idx !== undefined && idx !== null) {
            newBalances[idx] = value
          }
          return newBalances
        }
      })
    },
    [_validatorsParams.balances]
  )

  const _internalProposalForm = {
    earlyCompletion: useState<boolean>(
      storedForm._internalProposalForm.earlyCompletion
    ),
    delegatedVotingAllowed: useState<boolean>(
      storedForm._internalProposalForm.delegatedVotingAllowed
    ),
    validatorsVote: useState<boolean>(
      storedForm._internalProposalForm.validatorsVote
    ),
    duration: useState<number>(storedForm._internalProposalForm.duration),
    durationValidators: useState<number>(
      storedForm._internalProposalForm.durationValidators
    ),
    quorum: useState<number>(storedForm._internalProposalForm.quorum),
    quorumValidators: useState<number>(
      storedForm._internalProposalForm.quorumValidators
    ),
    minVotesForVoting: useState<number>(
      storedForm._internalProposalForm.minVotesForVoting
    ),
    minVotesForCreating: useState<number>(
      storedForm._internalProposalForm.minVotesForCreating
    ),
    rewardToken: useState<string>(storedForm._internalProposalForm.rewardToken),
    creationReward: useState<number>(
      storedForm._internalProposalForm.creationReward
    ),
    executionReward: useState<number>(
      storedForm._internalProposalForm.executionReward
    ),
    voteRewardsCoefficient: useState<number>(
      storedForm._internalProposalForm.voteRewardsCoefficient
    ),
    executorDescription: useState<string>(
      storedForm._internalProposalForm.executorDescription
    ),
  }
  const _distributionProposalSettingsForm = {
    earlyCompletion: useState<boolean>(
      storedForm._distributionProposalSettingsForm.earlyCompletion
    ),
    delegatedVotingAllowed: useState<boolean>(
      storedForm._distributionProposalSettingsForm.delegatedVotingAllowed
    ),
    validatorsVote: useState<boolean>(
      storedForm._distributionProposalSettingsForm.validatorsVote
    ),
    duration: useState<number>(
      storedForm._distributionProposalSettingsForm.duration
    ),
    durationValidators: useState<number>(
      storedForm._distributionProposalSettingsForm.durationValidators
    ),
    quorum: useState<number>(
      storedForm._distributionProposalSettingsForm.quorum
    ),
    quorumValidators: useState<number>(
      storedForm._distributionProposalSettingsForm.quorumValidators
    ),
    minVotesForVoting: useState<number>(
      storedForm._distributionProposalSettingsForm.minVotesForVoting
    ),
    minVotesForCreating: useState<number>(
      storedForm._distributionProposalSettingsForm.minVotesForCreating
    ),
    rewardToken: useState<string>(
      storedForm._distributionProposalSettingsForm.rewardToken
    ),
    creationReward: useState<number>(
      storedForm._distributionProposalSettingsForm.creationReward
    ),
    executionReward: useState<number>(
      storedForm._distributionProposalSettingsForm.executionReward
    ),
    voteRewardsCoefficient: useState<number>(
      storedForm._distributionProposalSettingsForm.voteRewardsCoefficient
    ),
    executorDescription: useState<string>(
      storedForm._distributionProposalSettingsForm.executorDescription
    ),
  }
  const _validatorsBalancesSettingsForm = {
    earlyCompletion: useState<boolean>(
      storedForm._validatorsBalancesSettingsForm.earlyCompletion
    ),
    delegatedVotingAllowed: useState<boolean>(
      storedForm._validatorsBalancesSettingsForm.delegatedVotingAllowed
    ),
    validatorsVote: useState<boolean>(
      storedForm._validatorsBalancesSettingsForm.validatorsVote
    ),
    duration: useState<number>(
      storedForm._validatorsBalancesSettingsForm.duration
    ),
    durationValidators: useState<number>(
      storedForm._validatorsBalancesSettingsForm.durationValidators
    ),
    quorum: useState<number>(storedForm._validatorsBalancesSettingsForm.quorum),
    quorumValidators: useState<number>(
      storedForm._validatorsBalancesSettingsForm.quorumValidators
    ),
    minVotesForVoting: useState<number>(
      storedForm._validatorsBalancesSettingsForm.minVotesForVoting
    ),
    minVotesForCreating: useState<number>(
      storedForm._validatorsBalancesSettingsForm.minVotesForCreating
    ),
    rewardToken: useState<string>(
      storedForm._validatorsBalancesSettingsForm.rewardToken
    ),
    creationReward: useState<number>(
      storedForm._validatorsBalancesSettingsForm.creationReward
    ),
    executionReward: useState<number>(
      storedForm._validatorsBalancesSettingsForm.executionReward
    ),
    voteRewardsCoefficient: useState<number>(
      storedForm._validatorsBalancesSettingsForm.voteRewardsCoefficient
    ),
    executorDescription: useState<string>(
      storedForm._validatorsBalancesSettingsForm.executorDescription
    ),
  }
  const _defaultProposalSettingForm = {
    earlyCompletion: useState<boolean>(
      storedForm._defaultProposalSettingForm.earlyCompletion
    ),
    delegatedVotingAllowed: useState<boolean>(
      storedForm._defaultProposalSettingForm.delegatedVotingAllowed
    ),
    validatorsVote: useState<boolean>(
      storedForm._defaultProposalSettingForm.validatorsVote
    ),
    duration: useState<number>(storedForm._defaultProposalSettingForm.duration),
    durationValidators: useState<number>(
      storedForm._defaultProposalSettingForm.durationValidators
    ),
    quorum: useState<number>(storedForm._defaultProposalSettingForm.quorum),
    quorumValidators: useState<number>(
      storedForm._defaultProposalSettingForm.quorumValidators
    ),
    minVotesForVoting: useState<number>(
      storedForm._defaultProposalSettingForm.minVotesForVoting
    ),
    minVotesForCreating: useState<number>(
      storedForm._defaultProposalSettingForm.minVotesForCreating
    ),
    rewardToken: useState<string>(
      storedForm._defaultProposalSettingForm.rewardToken
    ),
    creationReward: useState<number>(
      storedForm._defaultProposalSettingForm.creationReward
    ),
    executionReward: useState<number>(
      storedForm._defaultProposalSettingForm.executionReward
    ),
    voteRewardsCoefficient: useState<number>(
      storedForm._defaultProposalSettingForm.voteRewardsCoefficient
    ),
    executorDescription: useState<string>(
      storedForm._defaultProposalSettingForm.executorDescription
    ),
  }

  console.log("_defaultProposalSettingForm: ", _defaultProposalSettingForm)

  const erc20 = useERC20(_userKeeperParams.tokenAddress[0])
  const erc721 = useErc721(_userKeeperParams.nftAddress[0])
  const [_createdDaoAddress, _setCreatedDaoAddress] = useState("")

  useEffect(() => {
    setValue((prevState) => {
      const nextState = JSON.stringify({
        _isErc20,
        _isErc721,
        _isCustomVoting,
        _isDistributionProposal,
        _isValidator,
        _avatarUrl,
        _daoName,
        _websiteUrl,
        _description,
        _documents,
        _userKeeperParams: {
          tokenAddress: _userKeeperParams.tokenAddress[0],
          nftAddress: _userKeeperParams.nftAddress[0],
          totalPowerInTokens: _userKeeperParams.totalPowerInTokens[0],
          nftsTotalSupply: _userKeeperParams.nftsTotalSupply[0],
        },
        _validatorsParams: {
          name: _validatorsParams.name[0],
          symbol: _validatorsParams.symbol[0],
          duration: _validatorsParams.duration[0],
          quorum: _validatorsParams.quorum[0],
          validators: _validatorsParams.validators[0],
          balances: _validatorsParams.balances[0],
        },
        _internalProposalForm: {
          earlyCompletion: _internalProposalForm.earlyCompletion[0],
          delegatedVotingAllowed:
            _internalProposalForm.delegatedVotingAllowed[0],
          validatorsVote: _internalProposalForm.validatorsVote[0],
          duration: _internalProposalForm.duration[0],
          durationValidators: _internalProposalForm.durationValidators[0],
          quorum: _internalProposalForm.quorum[0],
          quorumValidators: _internalProposalForm.quorumValidators[0],
          minVotesForVoting: _internalProposalForm.minVotesForVoting[0],
          minVotesForCreating: _internalProposalForm.minVotesForCreating[0],
          rewardToken: _internalProposalForm.rewardToken[0],
          creationReward: _internalProposalForm.creationReward[0],
          executionReward: _internalProposalForm.executionReward[0],
          voteRewardsCoefficient:
            _internalProposalForm.voteRewardsCoefficient[0],
          executorDescription: _internalProposalForm.executorDescription[0],
        },
        _distributionProposalSettingsForm: {
          earlyCompletion: _distributionProposalSettingsForm.earlyCompletion[0],
          delegatedVotingAllowed:
            _distributionProposalSettingsForm.delegatedVotingAllowed[0],
          validatorsVote: _distributionProposalSettingsForm.validatorsVote[0],
          duration: _distributionProposalSettingsForm.duration[0],
          durationValidators:
            _distributionProposalSettingsForm.durationValidators[0],
          quorum: _distributionProposalSettingsForm.quorum[0],
          quorumValidators:
            _distributionProposalSettingsForm.quorumValidators[0],
          minVotesForVoting:
            _distributionProposalSettingsForm.minVotesForVoting[0],
          minVotesForCreating:
            _distributionProposalSettingsForm.minVotesForCreating[0],
          rewardToken: _distributionProposalSettingsForm.rewardToken[0],
          creationReward: _distributionProposalSettingsForm.creationReward[0],
          executionReward: _distributionProposalSettingsForm.executionReward[0],
          voteRewardsCoefficient:
            _distributionProposalSettingsForm.voteRewardsCoefficient[0],
          executorDescription:
            _distributionProposalSettingsForm.executorDescription[0],
        },
        _validatorsBalancesSettingsForm: {
          earlyCompletion: _validatorsBalancesSettingsForm.earlyCompletion[0],
          delegatedVotingAllowed:
            _validatorsBalancesSettingsForm.delegatedVotingAllowed[0],
          validatorsVote: _validatorsBalancesSettingsForm.validatorsVote[0],
          duration: _validatorsBalancesSettingsForm.duration[0],
          durationValidators:
            _validatorsBalancesSettingsForm.durationValidators[0],
          quorum: _validatorsBalancesSettingsForm.quorum[0],
          quorumValidators: _validatorsBalancesSettingsForm.quorumValidators[0],
          minVotesForVoting:
            _validatorsBalancesSettingsForm.minVotesForVoting[0],
          minVotesForCreating:
            _validatorsBalancesSettingsForm.minVotesForCreating[0],
          rewardToken: _validatorsBalancesSettingsForm.rewardToken[0],
          creationReward: _validatorsBalancesSettingsForm.creationReward[0],
          executionReward: _validatorsBalancesSettingsForm.executionReward[0],
          voteRewardsCoefficient:
            _validatorsBalancesSettingsForm.voteRewardsCoefficient[0],
          executorDescription:
            _validatorsBalancesSettingsForm.executorDescription[0],
        },
        _defaultProposalSettingForm: {
          earlyCompletion: _defaultProposalSettingForm.earlyCompletion[0],
          delegatedVotingAllowed:
            _defaultProposalSettingForm.delegatedVotingAllowed[0],
          validatorsVote: _defaultProposalSettingForm.validatorsVote[0],
          duration: _defaultProposalSettingForm.duration[0],
          durationValidators: _defaultProposalSettingForm.durationValidators[0],
          quorum: _defaultProposalSettingForm.quorum[0],
          quorumValidators: _defaultProposalSettingForm.quorumValidators[0],
          minVotesForVoting: _defaultProposalSettingForm.minVotesForVoting[0],
          minVotesForCreating:
            _defaultProposalSettingForm.minVotesForCreating[0],
          rewardToken: _defaultProposalSettingForm.rewardToken[0],
          creationReward: _defaultProposalSettingForm.creationReward[0],
          executionReward: _defaultProposalSettingForm.executionReward[0],
          voteRewardsCoefficient:
            _defaultProposalSettingForm.voteRewardsCoefficient[0],
          executorDescription:
            _defaultProposalSettingForm.executorDescription[0],
        },
      })

      return isEqual(prevState, nextState) ? prevState : nextState
    })
  }, [
    _avatarUrl,
    _daoName,
    _defaultProposalSettingForm.creationReward,
    _defaultProposalSettingForm.delegatedVotingAllowed,
    _defaultProposalSettingForm.duration,
    _defaultProposalSettingForm.durationValidators,
    _defaultProposalSettingForm.earlyCompletion,
    _defaultProposalSettingForm.executionReward,
    _defaultProposalSettingForm.executorDescription,
    _defaultProposalSettingForm.minVotesForCreating,
    _defaultProposalSettingForm.minVotesForVoting,
    _defaultProposalSettingForm.quorum,
    _defaultProposalSettingForm.quorumValidators,
    _defaultProposalSettingForm.rewardToken,
    _defaultProposalSettingForm.validatorsVote,
    _defaultProposalSettingForm.voteRewardsCoefficient,
    _description,
    _distributionProposalSettingsForm.creationReward,
    _distributionProposalSettingsForm.delegatedVotingAllowed,
    _distributionProposalSettingsForm.duration,
    _distributionProposalSettingsForm.durationValidators,
    _distributionProposalSettingsForm.earlyCompletion,
    _distributionProposalSettingsForm.executionReward,
    _distributionProposalSettingsForm.executorDescription,
    _distributionProposalSettingsForm.minVotesForCreating,
    _distributionProposalSettingsForm.minVotesForVoting,
    _distributionProposalSettingsForm.quorum,
    _distributionProposalSettingsForm.quorumValidators,
    _distributionProposalSettingsForm.rewardToken,
    _distributionProposalSettingsForm.validatorsVote,
    _distributionProposalSettingsForm.voteRewardsCoefficient,
    _documents,
    _internalProposalForm.creationReward,
    _internalProposalForm.delegatedVotingAllowed,
    _internalProposalForm.duration,
    _internalProposalForm.durationValidators,
    _internalProposalForm.earlyCompletion,
    _internalProposalForm.executionReward,
    _internalProposalForm.executorDescription,
    _internalProposalForm.minVotesForCreating,
    _internalProposalForm.minVotesForVoting,
    _internalProposalForm.quorum,
    _internalProposalForm.quorumValidators,
    _internalProposalForm.rewardToken,
    _internalProposalForm.validatorsVote,
    _internalProposalForm.voteRewardsCoefficient,
    _isCustomVoting,
    _isDistributionProposal,
    _isErc20,
    _isErc721,
    _isValidator,
    _userKeeperParams.nftAddress,
    _userKeeperParams.nftsTotalSupply,
    _userKeeperParams.tokenAddress,
    _userKeeperParams.totalPowerInTokens,
    _validatorsBalancesSettingsForm.creationReward,
    _validatorsBalancesSettingsForm.delegatedVotingAllowed,
    _validatorsBalancesSettingsForm.duration,
    _validatorsBalancesSettingsForm.durationValidators,
    _validatorsBalancesSettingsForm.earlyCompletion,
    _validatorsBalancesSettingsForm.executionReward,
    _validatorsBalancesSettingsForm.executorDescription,
    _validatorsBalancesSettingsForm.minVotesForCreating,
    _validatorsBalancesSettingsForm.minVotesForVoting,
    _validatorsBalancesSettingsForm.quorum,
    _validatorsBalancesSettingsForm.quorumValidators,
    _validatorsBalancesSettingsForm.rewardToken,
    _validatorsBalancesSettingsForm.validatorsVote,
    _validatorsBalancesSettingsForm.voteRewardsCoefficient,
    _validatorsParams.balances,
    _validatorsParams.duration,
    _validatorsParams.name,
    _validatorsParams.quorum,
    _validatorsParams.symbol,
    _validatorsParams.validators,
    _websiteUrl,
    setValue,
  ])

  return (
    <>
      <FundDaoCreatingContext.Provider
        value={{
          isErc20: { get: _isErc20, set: _setIsErc20 },
          isErc721: { get: _isErc721, set: _setIsErc721 },
          isCustomVoting: { get: _isCustomVoting, set: _setIsCustomVoting },
          isDistributionProposal: {
            get: _isDistributionProposal,
            set: _setIsDistributionProposal,
          },
          isValidator: { get: _isValidator, set: _setIsValidator },
          erc20,
          erc721,

          avatarUrl: { get: _avatarUrl, set: _setAvatarUrl },
          daoName: { get: _daoName, set: _setDaoName },
          websiteUrl: { get: _websiteUrl, set: _setWebsiteUrl },
          description: { get: _description, set: _setDescription },
          documents: { get: _documents, set: _handleChangeDocuments },

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
              set: _handleChangeValidators,
            },
            balances: {
              get: _validatorsParams.balances[0],
              set: _handleChangeBalances,
            },
          } as ValidatorsDeployParamsForm,

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

          clearFormStorage: remove,
          createdDaoAddress: {
            get: _createdDaoAddress,
            set: _setCreatedDaoAddress,
          },
          initialForm,
        }}
      >
        {children}
      </FundDaoCreatingContext.Provider>
    </>
  )
}

export const useIsDaoFieldChanged = ({ field }: { field: string }): boolean => {
  const [result, setResult] = useState<boolean>(false)

  const contextValue = useContext(FundDaoCreatingContext)

  useEffect(() => {
    try {
      const initialValue = get(contextValue.initialForm, "_" + field)
      const currentValue = get(contextValue, field + ".get")

      setResult(JSON.stringify(initialValue) !== JSON.stringify(currentValue))
    } catch (error) {
      setResult(false)
    }
  }, [field, contextValue])

  return result
}

export default FundDaoCreatingContextProvider
