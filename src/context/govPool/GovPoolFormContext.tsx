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
  ReactNode,
} from "react"
import { useERC20 } from "hooks/useERC20"
import { useErc721 } from "hooks/useErc721"
import { useLocalStorage } from "react-use"
import {
  GovPoolFormOptions,
  ExternalFileDocument,
  GovPoolSettings,
  UserKeeperDeployParamsForm,
  ValidatorsDeployParamsForm,
  GovPoolSettingsForm,
  GovPoolSettingsState,
} from "types"
import { INITIAL_DAO_PROPOSAL } from "constants/dao"
import { isEqual } from "lodash"
import { SUPPORTED_SOCIALS } from "constants/socials"
import { formatUnits, parseUnits } from "@ethersproject/units"

interface IGovPoolFormContext {
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
  socialLinks: {
    get: [SUPPORTED_SOCIALS, string][]
    set: Dispatch<SetStateAction<[SUPPORTED_SOCIALS, string][]>>
  }
  documents: {
    get: ExternalFileDocument[]
    set: (
      value: ExternalFileDocument | ExternalFileDocument[],
      idx?: number
    ) => void
  }

  userKeeperParams: UserKeeperDeployParamsForm
  validatorsParams: ValidatorsDeployParamsForm

  defaultProposalSettingForm: GovPoolSettingsForm
  internalProposalForm: GovPoolSettingsForm
  validatorsBalancesSettingsForm: GovPoolSettingsForm
  distributionProposalSettingsForm: GovPoolSettingsForm

  clearFormStorage: () => void
  createdDaoAddress: { get: string; set: Dispatch<SetStateAction<string>> }
  initialForm: GovPoolFormOptions
}

export const GovPoolFormContext = createContext<IGovPoolFormContext>({
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
  socialLinks: { get: [], set: () => {} },
  documents: { get: [], set: () => {} },

  userKeeperParams: {} as UserKeeperDeployParamsForm,
  validatorsParams: {} as ValidatorsDeployParamsForm,

  internalProposalForm: {} as GovPoolSettingsForm,
  validatorsBalancesSettingsForm: {} as GovPoolSettingsForm,
  defaultProposalSettingForm: {} as GovPoolSettingsForm,
  distributionProposalSettingsForm: {} as GovPoolSettingsForm,

  clearFormStorage: () => {},
  createdDaoAddress: { get: "", set: () => {} },
  initialForm: {} as GovPoolFormOptions,
})

interface IGovPoolFormContextProviderProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  customLSKey?: string
  govPoolFormOptions?: GovPoolFormOptions
}

const GovPoolFormContextProvider: FC<IGovPoolFormContextProviderProps> = ({
  children,
  customLSKey,
  govPoolFormOptions,
}) => {
  const [localStorageValue, setLocalStorageValue, removeLocalStorageValue] =
    useLocalStorage(
      customLSKey || "fund-dao-creating-form",
      JSON.stringify(govPoolFormOptions || INITIAL_DAO_PROPOSAL)
    )

  const initialForm = useMemo<GovPoolFormOptions>(() => {
    if (customLSKey) {
      const customFormFromLS = localStorage.getItem(customLSKey)

      if (customFormFromLS) {
        return JSON.parse(JSON.parse(customFormFromLS))
      }

      return govPoolFormOptions
    } else {
      const formFromLS = localStorage.getItem("fund-dao-creating-form")

      if (formFromLS) {
        return JSON.parse(JSON.parse(formFromLS))
      }

      return INITIAL_DAO_PROPOSAL
    }
  }, [customLSKey, govPoolFormOptions])

  const storedForm = useMemo<GovPoolFormOptions>(() => {
    try {
      return localStorageValue ? JSON.parse(localStorageValue) : {}
    } catch (error) {
      return {}
    }
  }, [localStorageValue])

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
  const [_socialLinks, _setSocialLinks] = useState<
    [SUPPORTED_SOCIALS, string][]
  >(storedForm._socialLinks)
  const [_documents, _setDocuments] = useState<ExternalFileDocument[]>(
    storedForm._documents
  )

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
    duration: useState<number>(
      Number(formatUnits(storedForm._internalProposalForm.duration, 0))
    ),
    durationValidators: useState<number>(
      Number(
        formatUnits(storedForm._internalProposalForm.durationValidators, 0)
      )
    ),
    quorum: useState<string>(
      formatUnits(storedForm._internalProposalForm.quorum, 25)
    ),
    quorumValidators: useState<string>(
      formatUnits(storedForm._internalProposalForm.quorumValidators, 25)
    ),
    minVotesForVoting: useState<string>(
      formatUnits(storedForm._internalProposalForm.minVotesForVoting, 18)
    ),
    minVotesForCreating: useState<string>(
      formatUnits(storedForm._internalProposalForm.minVotesForCreating, 18)
    ),
    rewardToken: useState<string>(storedForm._internalProposalForm.rewardToken),
    creationReward: useState<string>(
      formatUnits(storedForm._internalProposalForm.creationReward, 18)
    ),
    executionReward: useState<string>(
      formatUnits(storedForm._internalProposalForm.executionReward, 18)
    ),
    voteRewardsCoefficient: useState<string>(
      formatUnits(storedForm._internalProposalForm.voteRewardsCoefficient, 18)
    ),
    executorDescription: useState<string>(
      storedForm._internalProposalForm.executorDescription
    ),
  } as GovPoolSettingsState
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
      Number(
        formatUnits(storedForm._distributionProposalSettingsForm.duration, 0)
      )
    ),
    durationValidators: useState<number>(
      Number(
        formatUnits(
          storedForm._distributionProposalSettingsForm.durationValidators,
          0
        )
      )
    ),
    quorum: useState<string>(
      formatUnits(storedForm._distributionProposalSettingsForm.quorum, 25)
    ),
    quorumValidators: useState<string>(
      formatUnits(
        storedForm._distributionProposalSettingsForm.quorumValidators,
        25
      )
    ),
    minVotesForVoting: useState<string>(
      formatUnits(
        storedForm._distributionProposalSettingsForm.minVotesForVoting,
        18
      )
    ),
    minVotesForCreating: useState<string>(
      formatUnits(
        storedForm._distributionProposalSettingsForm.minVotesForCreating,
        18
      )
    ),
    rewardToken: useState<string>(
      storedForm._distributionProposalSettingsForm.rewardToken
    ),
    creationReward: useState<string>(
      formatUnits(
        storedForm._distributionProposalSettingsForm.creationReward,
        18
      )
    ),
    executionReward: useState<string>(
      formatUnits(
        storedForm._distributionProposalSettingsForm.executionReward,
        18
      )
    ),
    voteRewardsCoefficient: useState<string>(
      formatUnits(
        storedForm._distributionProposalSettingsForm.voteRewardsCoefficient,
        18
      )
    ),
    executorDescription: useState<string>(
      storedForm._distributionProposalSettingsForm.executorDescription
    ),
  } as GovPoolSettingsState
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
      Number(
        formatUnits(storedForm._validatorsBalancesSettingsForm.duration, 0)
      )
    ),
    durationValidators: useState<number>(
      Number(
        formatUnits(
          storedForm._validatorsBalancesSettingsForm.durationValidators,
          0
        )
      )
    ),
    quorum: useState<string>(
      formatUnits(storedForm._validatorsBalancesSettingsForm.quorum, 25)
    ),
    quorumValidators: useState<string>(
      formatUnits(
        storedForm._validatorsBalancesSettingsForm.quorumValidators,
        25
      )
    ),
    minVotesForVoting: useState<string>(
      formatUnits(
        storedForm._validatorsBalancesSettingsForm.minVotesForVoting,
        18
      )
    ),
    minVotesForCreating: useState<string>(
      formatUnits(
        storedForm._validatorsBalancesSettingsForm.minVotesForCreating,
        18
      )
    ),
    rewardToken: useState<string>(
      storedForm._validatorsBalancesSettingsForm.rewardToken
    ),
    creationReward: useState<string>(
      formatUnits(storedForm._validatorsBalancesSettingsForm.creationReward, 18)
    ),
    executionReward: useState<string>(
      formatUnits(
        storedForm._validatorsBalancesSettingsForm.executionReward,
        18
      )
    ),
    voteRewardsCoefficient: useState<string>(
      formatUnits(
        storedForm._validatorsBalancesSettingsForm.voteRewardsCoefficient,
        18
      )
    ),
    executorDescription: useState<string>(
      storedForm._validatorsBalancesSettingsForm.executorDescription
    ),
  } as GovPoolSettingsState
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
    duration: useState<number>(
      Number(formatUnits(storedForm._defaultProposalSettingForm.duration, 0))
    ),
    durationValidators: useState<number>(
      Number(
        formatUnits(
          storedForm._defaultProposalSettingForm.durationValidators,
          0
        )
      )
    ),
    quorum: useState<string>(
      formatUnits(storedForm._defaultProposalSettingForm.quorum, 25)
    ),
    quorumValidators: useState<string>(
      formatUnits(storedForm._defaultProposalSettingForm.quorumValidators, 25)
    ),
    minVotesForVoting: useState<string>(
      formatUnits(storedForm._defaultProposalSettingForm.minVotesForVoting, 18)
    ),
    minVotesForCreating: useState<string>(
      formatUnits(
        storedForm._defaultProposalSettingForm.minVotesForCreating,
        18
      )
    ),
    rewardToken: useState<string>(
      storedForm._defaultProposalSettingForm.rewardToken
    ),
    creationReward: useState<string>(
      formatUnits(storedForm._defaultProposalSettingForm.creationReward, 18)
    ),
    executionReward: useState<string>(
      formatUnits(storedForm._defaultProposalSettingForm.executionReward, 18)
    ),
    voteRewardsCoefficient: useState<string>(
      formatUnits(
        storedForm._defaultProposalSettingForm.voteRewardsCoefficient,
        18
      )
    ),
    executorDescription: useState<string>(
      storedForm._defaultProposalSettingForm.executorDescription
    ),
  } as GovPoolSettingsState

  const erc20 = useERC20(_userKeeperParams.tokenAddress[0])
  const erc721 = useErc721(_userKeeperParams.nftAddress[0])
  const [_createdDaoAddress, _setCreatedDaoAddress] = useState("")

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

  const populateSettings = useCallback(
    (settingsForm: GovPoolSettingsState, settings: GovPoolSettings) => {
      const [, setEarlyCompletion] = settingsForm.earlyCompletion
      const [, setDelegatedVotingAllowed] = settingsForm.delegatedVotingAllowed
      const [, setValidatorsVote] = settingsForm.validatorsVote
      const [, setDuration] = settingsForm.duration
      const [, setDurationValidators] = settingsForm.durationValidators
      const [, setQuorum] = settingsForm.quorum
      const [, setQuorumValidators] = settingsForm.quorumValidators
      const [, setMinVotesForVoting] = settingsForm.minVotesForVoting
      const [, setMinVotesForCreating] = settingsForm.minVotesForCreating
      const [, setRewardToken] = settingsForm.rewardToken
      const [, setCreationReward] = settingsForm.creationReward
      const [, setExecutionReward] = settingsForm.executionReward
      const [, setVoteRewardsCoefficient] = settingsForm.voteRewardsCoefficient
      const [, setExecutorDescription] = settingsForm.executorDescription

      setEarlyCompletion(settings.earlyCompletion)
      setDelegatedVotingAllowed(settings.delegatedVotingAllowed)
      setValidatorsVote(settings.validatorsVote)
      setDuration(Number(formatUnits(settings.duration, 0)))
      setDurationValidators(Number(formatUnits(settings.durationValidators, 0)))
      setQuorum(formatUnits(settings.quorum, 25))
      setQuorumValidators(formatUnits(settings.quorumValidators, 25))
      setMinVotesForVoting(formatUnits(settings.minVotesForVoting, 18))
      setMinVotesForCreating(formatUnits(settings.minVotesForCreating, 18))
      setRewardToken(settings.rewardToken)
      setCreationReward(formatUnits(settings.creationReward, 18))
      setExecutionReward(formatUnits(settings.executionReward, 18))
      setVoteRewardsCoefficient(
        formatUnits(settings.voteRewardsCoefficient, 18)
      )
      setExecutorDescription(settings.executorDescription)
    },
    []
  )

  const populateForm = useCallback(
    (govPool: GovPoolFormOptions) => {
      _setAvatarUrl(govPool._avatarUrl)
      _setDaoName(govPool._daoName)
      _setDescription(govPool._description)
      _setSocialLinks(govPool._socialLinks)
      _setDocuments(govPool._documents)
      _setWebsiteUrl(govPool._websiteUrl)

      _setIsErc20(govPool._isErc20)
      _setIsErc721(govPool._isErc721)

      _setIsValidator(govPool._isValidator)
      _setIsCustomVoting(govPool._isCustomVoting)
      _setIsDistributionProposal(govPool._isDistributionProposal)

      const [, _setTokenAddress] = _userKeeperParams.tokenAddress
      const [, _setNftAddress] = _userKeeperParams.nftAddress
      const [, _setTotalPowerInTokens] = _userKeeperParams.totalPowerInTokens
      const [, _setNftsTotalSupply] = _userKeeperParams.nftsTotalSupply

      _setTokenAddress(govPool._userKeeperParams.tokenAddress)
      _setNftAddress(govPool._userKeeperParams.nftAddress)
      _setTotalPowerInTokens(govPool._userKeeperParams.totalPowerInTokens)
      _setNftsTotalSupply(govPool._userKeeperParams.nftsTotalSupply)

      const [, setName] = _validatorsParams.name
      const [, setSymbol] = _validatorsParams.symbol
      const [, setDuration] = _validatorsParams.duration
      const [, setQuorum] = _validatorsParams.quorum
      const [, setValidators] = _validatorsParams.validators
      const [, setBalances] = _validatorsParams.balances

      setName(govPool._validatorsParams.name)
      setSymbol(govPool._validatorsParams.symbol)
      setDuration(govPool._validatorsParams.duration)
      setQuorum(govPool._validatorsParams.quorum)
      setValidators(govPool._validatorsParams.validators)
      setBalances(govPool._validatorsParams.balances)

      populateSettings(_internalProposalForm, govPool._internalProposalForm)
      populateSettings(
        _defaultProposalSettingForm,
        govPool._defaultProposalSettingForm
      )
      populateSettings(
        _distributionProposalSettingsForm,
        govPool._distributionProposalSettingsForm
      )
      populateSettings(
        _validatorsBalancesSettingsForm,
        govPool._validatorsBalancesSettingsForm
      )
    },
    [
      _defaultProposalSettingForm,
      _distributionProposalSettingsForm,
      _internalProposalForm,
      _userKeeperParams,
      _validatorsBalancesSettingsForm,
      _validatorsParams,
      populateSettings,
    ]
  )

  const convertForm = useCallback(
    (): GovPoolFormOptions => ({
      _isErc20,
      _isErc721,
      _isCustomVoting,
      _isDistributionProposal,
      _isValidator,
      _avatarUrl,
      _daoName,
      _websiteUrl,
      _description,
      _socialLinks,
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
        earlyCompletion: _internalProposalForm.earlyCompletion[0] as boolean,
        delegatedVotingAllowed: _internalProposalForm
          .delegatedVotingAllowed[0] as boolean,
        validatorsVote: _internalProposalForm.validatorsVote[0] as boolean,
        duration: parseUnits(String(_internalProposalForm.duration[0]), 0),
        durationValidators: parseUnits(
          String(_internalProposalForm.durationValidators[0]),
          0
        ),
        quorum: parseUnits(_internalProposalForm.quorum[0] as string, 25),
        quorumValidators: parseUnits(
          _internalProposalForm.quorumValidators[0] as string,
          25
        ),
        minVotesForVoting: parseUnits(
          _internalProposalForm.minVotesForVoting[0] as string,
          18
        ),
        minVotesForCreating: parseUnits(
          _internalProposalForm.minVotesForCreating[0] as string,
          18
        ),
        rewardToken: _internalProposalForm.rewardToken[0] as string,
        creationReward: parseUnits(
          _internalProposalForm.creationReward[0] as string,
          18
        ),
        executionReward: parseUnits(
          _internalProposalForm.executionReward[0] as string,
          18
        ),
        voteRewardsCoefficient: parseUnits(
          _internalProposalForm.voteRewardsCoefficient[0] as string,
          18
        ),
        executorDescription: _internalProposalForm
          .executorDescription[0] as string,
      },
      _distributionProposalSettingsForm: {
        earlyCompletion: _distributionProposalSettingsForm
          .earlyCompletion[0] as boolean,
        delegatedVotingAllowed: _distributionProposalSettingsForm
          .delegatedVotingAllowed[0] as boolean,
        validatorsVote: _distributionProposalSettingsForm
          .validatorsVote[0] as boolean,
        duration: parseUnits(
          String(_distributionProposalSettingsForm.duration[0]),
          0
        ),
        durationValidators: parseUnits(
          String(_distributionProposalSettingsForm.durationValidators[0]),
          0
        ),
        quorum: parseUnits(
          _distributionProposalSettingsForm.quorum[0] as string,
          25
        ),
        quorumValidators: parseUnits(
          _distributionProposalSettingsForm.quorumValidators[0] as string,
          25
        ),
        minVotesForVoting: parseUnits(
          _distributionProposalSettingsForm.minVotesForVoting[0] as string,
          18
        ),
        minVotesForCreating: parseUnits(
          _distributionProposalSettingsForm.minVotesForCreating[0] as string,
          18
        ),
        rewardToken: _distributionProposalSettingsForm.rewardToken[0] as string,
        creationReward: parseUnits(
          _distributionProposalSettingsForm.creationReward[0] as string,
          18
        ),
        executionReward: parseUnits(
          _distributionProposalSettingsForm.executionReward[0] as string,
          18
        ),
        voteRewardsCoefficient: parseUnits(
          _distributionProposalSettingsForm.voteRewardsCoefficient[0] as string,
          18
        ),
        executorDescription: _distributionProposalSettingsForm
          .executorDescription[0] as string,
      },
      _validatorsBalancesSettingsForm: {
        earlyCompletion: _validatorsBalancesSettingsForm
          .earlyCompletion[0] as boolean,
        delegatedVotingAllowed: _validatorsBalancesSettingsForm
          .delegatedVotingAllowed[0] as boolean,
        validatorsVote: _validatorsBalancesSettingsForm
          .validatorsVote[0] as boolean,
        duration: parseUnits(
          String(_validatorsBalancesSettingsForm.duration[0]),
          0
        ),
        durationValidators: parseUnits(
          String(_validatorsBalancesSettingsForm.durationValidators[0]),
          0
        ),
        quorum: parseUnits(
          _validatorsBalancesSettingsForm.quorum[0] as string,
          25
        ),
        quorumValidators: parseUnits(
          _validatorsBalancesSettingsForm.quorumValidators[0] as string,
          25
        ),
        minVotesForVoting: parseUnits(
          _validatorsBalancesSettingsForm.minVotesForVoting[0] as string,
          18
        ),
        minVotesForCreating: parseUnits(
          _validatorsBalancesSettingsForm.minVotesForCreating[0] as string,
          18
        ),
        rewardToken: _validatorsBalancesSettingsForm.rewardToken[0] as string,
        creationReward: parseUnits(
          _validatorsBalancesSettingsForm.creationReward[0] as string,
          18
        ),
        executionReward: parseUnits(
          _validatorsBalancesSettingsForm.executionReward[0] as string,
          18
        ),
        voteRewardsCoefficient: parseUnits(
          _validatorsBalancesSettingsForm.voteRewardsCoefficient[0] as string,
          18
        ),
        executorDescription: _validatorsBalancesSettingsForm
          .executorDescription[0] as string,
      },
      _defaultProposalSettingForm: {
        earlyCompletion: _defaultProposalSettingForm
          .earlyCompletion[0] as boolean,
        delegatedVotingAllowed: _defaultProposalSettingForm
          .delegatedVotingAllowed[0] as boolean,
        validatorsVote: _defaultProposalSettingForm
          .validatorsVote[0] as boolean,
        duration: parseUnits(
          String(_defaultProposalSettingForm.duration[0]),
          0
        ),
        durationValidators: parseUnits(
          String(_defaultProposalSettingForm.durationValidators[0]),
          0
        ),
        quorum: parseUnits(_defaultProposalSettingForm.quorum[0] as string, 25),
        quorumValidators: parseUnits(
          _defaultProposalSettingForm.quorumValidators[0] as string,
          25
        ),
        minVotesForVoting: parseUnits(
          _defaultProposalSettingForm.minVotesForVoting[0] as string,
          18
        ),
        minVotesForCreating: parseUnits(
          _defaultProposalSettingForm.minVotesForCreating[0] as string,
          18
        ),
        rewardToken: _defaultProposalSettingForm.rewardToken[0] as string,
        creationReward: parseUnits(
          _defaultProposalSettingForm.creationReward[0] as string,
          18
        ),
        executionReward: parseUnits(
          _defaultProposalSettingForm.executionReward[0] as string,
          18
        ),
        voteRewardsCoefficient: parseUnits(
          _defaultProposalSettingForm.voteRewardsCoefficient[0] as string,
          18
        ),
        executorDescription: _defaultProposalSettingForm
          .executorDescription[0] as string,
      },
    }),
    [
      _avatarUrl,
      _daoName,
      _defaultProposalSettingForm,
      _description,
      _distributionProposalSettingsForm,
      _documents,
      _internalProposalForm,
      _isCustomVoting,
      _isDistributionProposal,
      _isErc20,
      _isErc721,
      _isValidator,
      _socialLinks,
      _userKeeperParams,
      _validatorsBalancesSettingsForm,
      _validatorsParams,
      _websiteUrl,
    ]
  )

  useEffect(() => {
    if (govPoolFormOptions) {
      populateForm(govPoolFormOptions)
    }
  }, [govPoolFormOptions, populateForm])

  useEffect(() => {
    setLocalStorageValue((prevState) => {
      const nextState = JSON.stringify(convertForm())

      return isEqual(prevState, nextState) ? prevState : nextState
    })
  }, [
    _avatarUrl,
    _daoName,
    _description,
    _documents,
    _isCustomVoting,
    _isDistributionProposal,
    _isErc20,
    _isErc721,
    _isValidator,
    _socialLinks,
    _userKeeperParams,
    _validatorsParams,
    _websiteUrl,
    _defaultProposalSettingForm,
    _distributionProposalSettingsForm,
    _validatorsBalancesSettingsForm,
    _internalProposalForm,
    setLocalStorageValue,
    convertForm,
  ])

  return (
    <>
      <GovPoolFormContext.Provider
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
          socialLinks: { get: _socialLinks, set: _setSocialLinks },
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
          } as GovPoolSettingsForm,
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
          } as GovPoolSettingsForm,
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
          } as GovPoolSettingsForm,
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
          } as GovPoolSettingsForm,

          clearFormStorage: removeLocalStorageValue,
          createdDaoAddress: {
            get: _createdDaoAddress,
            set: _setCreatedDaoAddress,
          },
          initialForm,
        }}
      >
        {children}
      </GovPoolFormContext.Provider>
    </>
  )
}

export default GovPoolFormContextProvider
