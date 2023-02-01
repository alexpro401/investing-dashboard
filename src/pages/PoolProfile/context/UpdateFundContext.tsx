import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { arrayDifference, arrayIntersection, arrayIncludes } from "utils/array"
import { getIpfsData } from "utils/ipfs"
import { formatEther, parseEther } from "@ethersproject/units"
import { IStep, UpdateListType } from "consts"
import { useAddToast } from "state/application/hooks"
import { useTransactionAdder } from "state/transactions/hooks"
import { useUserAgreement } from "state/user/hooks"
import { IpfsEntity } from "utils/ipfsEntity"
import { bigify, formatBigNumber, isTxMined, shortenAddress } from "utils"
import { TransactionType } from "state/transactions/types"
import { addPool } from "state/ipfsMetadata/actions"
import { ValidationError } from "../components/FundDetails/components/FundDetailsGeneral/styled"
import { PoolProfileContext } from "./PoolProfileContext"
import { useDispatch } from "react-redux"
import { useWeb3React } from "@web3-react/core"
import { usePoolContract, usePoolQuery } from "hooks"
import { useERC20Data } from "state/erc20/hooks"
import { useTraderPoolContract } from "contracts"

interface IState {
  loading: boolean

  avatarBlobString: string
  assets: string[]

  description: string
  descriptionInitial: string
  strategy: string
  strategyInitial: string

  totalLPEmission: string
  totalLPEmissionInitial: string
  minimalInvestment: string
  minimalInvestmentInitial: string

  managers: string[]
  managersInitial: string[]
  managersAdded: string[]
  managersRemoved: string[]

  investors: string[]
  investorsInitial: string[]
  investorsAdded: string[]
  investorsRemoved: string[]

  validationErrors: IValidationError[]
}

interface IValidationError {
  message: string
  field: string
}

interface IContext extends IState {
  handleChange: (name: string, value: any) => void
  setInitial: (payload: any) => void
  setInitialIpfs: (payload: any) => void
  setDefault: () => void
  poolParametersSaveCallback: () => void
  managersRemoveCallback: () => void
  managersAddCallback: () => void
  investorsRemoveCallback: () => void
  investorsAddCallback: () => void
  isIpfsDataUpdated: () => boolean
  isPoolParametersUpdated: () => boolean
  handleValidate: () => boolean
}

const defaultState = {
  loading: true,

  avatarBlobString: "",
  assets: [],

  description: "",
  descriptionInitial: "",
  strategy: "",
  strategyInitial: "",

  totalLPEmission: "",
  totalLPEmissionInitial: "",
  minimalInvestment: "",
  minimalInvestmentInitial: "",

  managers: [],
  managersInitial: [],
  managersAdded: [],
  managersRemoved: [],

  investors: [],
  investorsInitial: [],
  investorsAdded: [],
  investorsRemoved: [],

  validationErrors: [],
}

const defaultContext = {
  ...defaultState,
  handleChange: () => {},
  setInitial: () => {},
  setDefault: () => {},
  setInitialIpfs: () => {},
  poolParametersSaveCallback: () => {},
  managersRemoveCallback: () => {},
  managersAddCallback: () => {},
  investorsRemoveCallback: () => {},
  investorsAddCallback: () => {},
  isIpfsDataUpdated: () => false,
  isPoolParametersUpdated: () => false,
  handleValidate: () => false,
}

export const FundContext = createContext<IContext>(defaultContext)

export const useUpdateFundContext = () => {
  const { fundAddress } = useContext(PoolProfileContext)

  const {
    loading,
    handleChange,
    handleValidate,
    setInitial,
    setInitialIpfs,
    setDefault,
    poolParametersSaveCallback,
    managersRemoveCallback,
    managersAddCallback,
    investorsRemoveCallback,
    investorsAddCallback,
    isIpfsDataUpdated,
    isPoolParametersUpdated,

    avatarBlobString,
    assets,

    description,
    strategy,

    totalLPEmission,
    minimalInvestment,

    managers,
    managersRemoved,
    managersAdded,

    investors,
    investorsRemoved,
    investorsAdded,

    validationErrors,
  } = useContext(FundContext)

  const dispatch = useDispatch()
  const { account } = useWeb3React()

  const [poolData] = usePoolQuery(fundAddress)
  const [, poolInfoData] = usePoolContract(fundAddress)
  const [baseData] = useERC20Data(poolData?.baseToken)
  const traderPool = useTraderPoolContract(poolData?.id)

  const avatar = useMemo(() => {
    if (avatarBlobString.length > 0) {
      return avatarBlobString
    }
    return assets.at(-1)
  }, [avatarBlobString, assets])

  const [isEmissionLimited, setEmission] = useState<boolean>(false)
  const [isMinimalInvest, setMinimalInvest] = useState<boolean>(false)
  const [isManagersAdded, setManagers] = useState<boolean>(false)
  const [isInvestorsAdded, setInvestors] = useState<boolean>(false)

  const [step, setStep] = useState(0)
  const [steps, setSteps] = useState<IStep[]>([])
  const [stepPending, setStepPending] = useState(false)
  const [stepsFormating, setStepsFormating] = useState(false)
  const [isCreating, setCreating] = useState(false)
  const [transactionFail, setTransactionFail] = useState(false)

  const addToast = useAddToast()
  const addTransaction = useTransactionAdder()
  const [{ agreed }, { setShowAgreement }] = useUserAgreement()

  const handleParametersUpdate = useCallback(async () => {
    if (!traderPool || !poolData || !poolInfoData || !account || !fundAddress) {
      return
    }

    const ipfsChanged = isIpfsDataUpdated()

    let ipfsReceipt
    const assetsParam = assets
    if (ipfsChanged) {
      // Avatar Blob string must be array with previous avatars
      if (avatarBlobString !== "") {
        assetsParam.push(avatarBlobString)
      }
      const poolIpfsMetadataEntity = new IpfsEntity({
        data: JSON.stringify({
          assets: assetsParam,
          description,
          strategy,
          account,
          timestamp: new Date().getTime() / 1000,
        }),
      })

      await poolIpfsMetadataEntity.uploadSelf()
      ipfsReceipt = poolIpfsMetadataEntity._path
    } else {
      ipfsReceipt = poolInfoData.parameters.descriptionURL
    }

    const descriptionURL = ipfsReceipt
    const totalEmission = bigify(totalLPEmission, 18).toHexString()
    const minInvest = bigify(minimalInvestment, 18).toHexString()

    const receipt = await traderPool.changePoolParameters(
      descriptionURL,
      poolInfoData?.parameters.privatePool,
      totalEmission,
      minInvest
    )

    const tx = await addTransaction(receipt, {
      type: TransactionType.POOL_EDIT,
      baseCurrencyId: poolData.baseToken,
      fundName: poolData.name,
    })

    if (isTxMined(tx)) {
      dispatch(
        addPool({
          params: {
            poolId: fundAddress,
            hash: receipt.hash,
            assets: assetsParam,
            description,
            strategy,
            account,
          },
        })
      )
    }

    return tx
  }, [
    traderPool,
    poolData,
    poolInfoData,
    account,
    assets,
    avatarBlobString,
    description,
    isIpfsDataUpdated,
    minimalInvestment,
    strategy,
    totalLPEmission,
    addTransaction,
    dispatch,
    fundAddress,
  ])

  const handleManagersRemove = useCallback(async () => {
    const receipt = await traderPool?.modifyAdmins(managersRemoved, false)

    return addTransaction(receipt, {
      type: TransactionType.POOL_UPDATE_MANAGERS,
      editType: UpdateListType.REMOVE,
      poolId: fundAddress,
    })
  }, [traderPool, managersRemoved, addTransaction, fundAddress])

  const handleManagersAdd = useCallback(async () => {
    const receipt = await traderPool?.modifyAdmins(managersAdded, true)

    return addTransaction(receipt, {
      type: TransactionType.POOL_UPDATE_MANAGERS,
      editType: UpdateListType.ADD,
      poolId: fundAddress,
    })
  }, [traderPool, managersAdded, addTransaction, fundAddress])

  const handleInvestorsRemove = useCallback(async () => {
    const receipt = await traderPool?.modifyPrivateInvestors(
      investorsRemoved,
      false
    )

    return addTransaction(receipt, {
      type: TransactionType.POOL_UPDATE_INVESTORS,
      editType: UpdateListType.REMOVE,
      poolId: fundAddress,
    })
  }, [traderPool, investorsRemoved, addTransaction, fundAddress])

  const handleInvestorsAdd = useCallback(async () => {
    const receipt = await traderPool?.modifyPrivateInvestors(
      investorsAdded,
      true
    )

    return addTransaction(receipt, {
      type: TransactionType.POOL_UPDATE_INVESTORS,
      editType: UpdateListType.ADD,
      poolId: fundAddress,
    })
  }, [traderPool, investorsAdded, addTransaction, fundAddress])

  const handleSubmit = async () => {
    if (stepsFormating) return

    if (!handleValidate()) return

    setStepsFormating(true)

    let stepsShape: IStep[] = []

    if (isPoolParametersUpdated()) {
      stepsShape = [
        ...stepsShape,
        {
          title: "Parameters",
          description:
            "Update your fund by signing a transaction in your wallet. This will update ERC20 compatible data.",
          buttonText: "Update fund",
        },
      ]
    }

    if (!!managersRemoved.length || !!managersAdded.length) {
      // TODO: description must include count of transactions and what user must approve
      stepsShape = [
        ...stepsShape,
        {
          title: "Managers",
          description: "Update managers for your fund.",
          buttonText: "Update managers",
        },
      ]
    }

    if (!!investorsRemoved.length || !!investorsAdded.length) {
      // TODO: description must include count of transactions and what user must approve
      stepsShape = [
        ...stepsShape,
        {
          title: "Investors",
          description: "Update investors for your fund.",
          buttonText: "Update investors",
        },
      ]
    }

    stepsShape = [
      ...stepsShape,
      {
        title: "Success",
        description: "Your fund has been successfully updated.",
        buttonText: "Finish",
      },
    ]

    setSteps(stepsShape)
    setStepsFormating(false)
    setCreating(true)
  }

  const handleNextStep = async () => {
    try {
      setTransactionFail(false)
      if (steps[step].title === "Parameters") {
        setStepPending(true)
        const tx = await handleParametersUpdate()

        if (isTxMined(tx)) {
          setStep(step + 1)
          setStepPending(false)
          poolParametersSaveCallback()
        }
      }
      if (steps[step].title === "Managers") {
        setStepPending(true)

        let managersSuccess = false

        if (!!managersRemoved.length) {
          const removeReceipt = await handleManagersRemove()

          if (isTxMined(removeReceipt)) {
            managersRemoveCallback()
            managersSuccess = true
          }
        }
        if (!!managersAdded.length) {
          managersSuccess = false
          const addReceipt = await handleManagersAdd()

          if (isTxMined(addReceipt)) {
            managersAddCallback()
            managersSuccess = true
          }
        }

        if (managersSuccess) {
          setStep(step + 1)
          setStepPending(false)
        }
      }

      if (steps[step].title === "Investors") {
        setStepPending(true)

        let investorsSuccess = false

        if (!!investorsRemoved.length) {
          const removeReceipt = await handleInvestorsRemove()

          if (isTxMined(removeReceipt)) {
            investorsRemoveCallback()
            investorsSuccess = true
          }
        }
        if (!!investorsAdded.length) {
          investorsSuccess = false
          const addReceipt = await handleInvestorsAdd()

          if (isTxMined(addReceipt)) {
            investorsAddCallback()
            investorsSuccess = true
          }
        }

        if (investorsSuccess) {
          setStep(step + 1)
          setStepPending(false)
        }
      }

      if (steps[step].title === "Success") {
        setCreating(false)
        setStepPending(false)
        setStep(0)
        setSteps([])
      }
    } catch (error) {
      setStepPending(false)
      setTransactionFail(true)
      console.log(error)
    }
  }

  const getFieldErrors = (name: string) => {
    return validationErrors
      .filter((error) => error.field === name)
      .map((error) => (
        <ValidationError key={error.field}>{error.message}</ValidationError>
      ))
  }

  const handleEmissionRowChange = (state: boolean) => {
    setEmission(state)

    if (!state) {
      handleChange("totalLPEmission", "")
    }
  }

  const handleMinInvestRowChange = (state: boolean) => {
    setMinimalInvest(state)

    if (!state) {
      handleChange("minimalInvestment", "")
    }
  }

  const handleInvestorsRowChange = async (state: string[]) => {
    if (!poolData) return
    if (state.length > investors.length) {
      handleChange("investors", state)
    } else {
      // Prevent removing investor if he claimed some LP's
      const removedAddress = arrayDifference(investors, state)[0]
      const claimedAmountBigNumber = await traderPool?.balanceOf(removedAddress)
      const claimedAmount = formatBigNumber(claimedAmountBigNumber, 18, 6)

      if (Number(claimedAmount) > 0) {
        addToast(
          {
            type: "warning",
            content: `Can't remove ${shortenAddress(
              removedAddress,
              3
            )}. Claimed: ${claimedAmount} ${poolData.ticker}.`,
          },
          removedAddress,
          5000
        )
      } else {
        handleChange("investors", state)
      }
    }
  }

  const onStepperClose = async () => {
    setCreating(false)
    setStepPending(false)
    setStep(0)
    setSteps([])
  }

  // update initial value context
  useEffect(() => {
    if (!poolData || !poolInfoData) return
    ;(async () => {
      const parsedIpfs = await getIpfsData(
        poolInfoData.parameters.descriptionURL
      )

      if (!!parsedIpfs) {
        setInitialIpfs({
          assets: parsedIpfs.assets,
          description: parsedIpfs.description,
          strategy: parsedIpfs.strategy,
        })
      }

      const totalEmission =
        poolInfoData && formatEther(poolInfoData.parameters.totalLPEmission)
      const minInvestment =
        poolInfoData && formatEther(poolInfoData.parameters.minimalInvestment)

      const investors = poolData?.privateInvestors.map((m) => m.id)
      const managers = poolData?.admins

      setInitial({
        totalLPEmission: totalEmission,
        minimalInvestment: minInvestment,
        investors: investors,
        managers: managers,
      })
    })()
  }, [poolData, poolInfoData, setInitialIpfs, setInitial])

  // update emission switch state
  useEffect(() => {
    if (!poolInfoData) return
    if (!poolInfoData.parameters.totalLPEmission.eq(parseEther("0"))) {
      setEmission(true)
    }
  }, [poolInfoData])

  // update min invest amount switch state
  useEffect(() => {
    if (!poolInfoData) return
    if (!poolInfoData.parameters.minimalInvestment.eq(parseEther("0"))) {
      setMinimalInvest(true)
    }
  }, [poolInfoData])

  // update managers switch state
  useEffect(() => {
    if (!!managers.length) {
      setManagers(true)
    }
  }, [managers])

  // update investors switch state
  useEffect(() => {
    if (!!investors.length) {
      setInvestors(true)
    }
  }, [investors])

  // clean state when user leaves page
  useEffect(() => {
    return () => {
      setDefault()
    }
  }, [setDefault])

  return {}
}

const propertiesMapping = {
  managers: {
    initial: "managersInitial",
    added: "managersAdded",
    removed: "managersRemoved",
  },
  investors: {
    initial: "investorsInitial",
    added: "investorsAdded",
    removed: "investorsRemoved",
  },
}

interface Props {
  children?: React.ReactNode
}

class UpdateFundContext extends React.Component<Props> {
  static contextType = FundContext

  state = {
    loading: true,

    avatarBlobString: "",
    assets: [],

    description: "",
    descriptionInitial: "",
    strategy: "",
    strategyInitial: "",

    totalLPEmission: "",
    totalLPEmissionInitial: "",
    minimalInvestment: "",
    minimalInvestmentInitial: "",

    managers: [],
    managersInitial: [],
    managersAdded: [],
    managersRemoved: [],

    investors: [],
    investorsInitial: [],
    investorsAdded: [],
    investorsRemoved: [],

    validationErrors: [],
  }

  handleChange = (name: string, value: any) => {
    if (Object.prototype.toString.call(value) === "[object Array]") {
      if (value.length < this.state[name].length) {
        this.updateRemovedList(name, value)
      } else {
        this.updateAddingList(name, value)
      }

      this.setState({
        [name]: [...value],
      })

      return
    }

    this.setState({ [name]: value })
  }

  updateRemovedList = (name: string, value: any) => {
    const { initial, removed, added } = propertiesMapping[name]
    // Who removed
    const removedAddress = arrayDifference<string>(this.state[name], value)[0]
    const inInitial = arrayIncludes<string>(this.state[initial], removedAddress)

    // Add in list for removing if address has been in initial list
    if (inInitial) {
      this.setState({
        [removed]: [...this.state[removed], removedAddress],
      })
    }

    // Clear added list from removed address
    this.setState({
      [added]: arrayIntersection<string>(this.state[added], value),
    })
  }

  updateAddingList = (name: string, value: any) => {
    const { initial, removed, added } = propertiesMapping[name]
    // Who added
    const addedAddress = arrayDifference<string>(value, this.state[name])[0]
    const inInitial = arrayIncludes<string>(this.state[initial], addedAddress)

    // Add in list for adding if address doesnt been in initial list
    if (!inInitial) {
      this.setState({
        [added]: [...this.state[added], addedAddress],
      })
    }

    // Clear removed list from added address
    this.setState({
      [removed]: this.state[removed].filter((x) => x !== addedAddress),
    })
  }

  // Set initial pool data
  setInitial = (payload: any) => {
    this.setState({
      loading: false,
      investorsInitial: payload.investors,
      managersInitial: payload.managers,
      totalLPEmissionInitial: payload.totalLPEmission,
      minimalInvestmentInitial: payload.minimalInvestment,
      ...payload,
    })
  }

  // Set initial data from IPFS
  setInitialIpfs = (payload: any) => {
    this.setState({
      descriptionInitial: payload.description,
      strategyInitial: payload.strategy,
      ...payload,
    })
  }

  setDefault = () => {
    this.setState(defaultState)
  }

  // Clean pool parameters state after saving
  poolParametersSaveCallback = () => {
    this.setState({
      avatarBlobString: "",
      assets: [...this.state.assets, this.state.avatarBlobString],
      descriptionInitial: this.state.description,
      strategyInitial: this.state.strategy,
      totalLPEmissionInitial: this.state.totalLPEmission,
      minimalInvestmentInitial: this.state.minimalInvestment,
    })
  }

  // Clean managers state after removing
  managersRemoveCallback = () => {
    const newManagersInitial = arrayDifference(
      this.state.managersInitial,
      this.state.managersRemoved
    )

    this.setState({
      managersInitial: newManagersInitial,
      managersRemoved: [],
    })
  }

  // Clean managers state after adding
  managersAddCallback = () => {
    const newManagersInitial = [
      ...this.state.managersInitial,
      ...this.state.managersAdded,
    ]

    this.setState({
      managersInitial: newManagersInitial,
      managersAdded: [],
    })
  }

  // Clean investors state after removing
  investorsRemoveCallback = () => {
    const newInvestorsInitial = arrayDifference(
      this.state.investorsInitial,
      this.state.investorsRemoved
    )

    this.setState({
      investorsInitial: newInvestorsInitial,
      investorsRemoved: [],
    })
  }

  // Clean investors state after adding
  investorsAddCallback = () => {
    const newInvestorsInitial = [
      ...this.state.investorsInitial,
      ...this.state.investorsAdded,
    ]

    this.setState({
      investorsInitial: newInvestorsInitial,
      investorsAdded: [],
    })
  }

  isIpfsDataUpdated = () => {
    if (
      this.state.avatarBlobString !== "" ||
      this.state.description !== this.state.descriptionInitial ||
      this.state.strategy !== this.state.strategyInitial
    ) {
      return true
    }
    return false
  }

  isPoolParametersUpdated = () => {
    if (
      this.isIpfsDataUpdated() ||
      this.state.totalLPEmission !== this.state.totalLPEmissionInitial ||
      this.state.minimalInvestment !== this.state.minimalInvestmentInitial
    ) {
      return true
    }
    return false
  }

  handleValidate = () => {
    const { totalLPEmission, minimalInvestment } = this.state

    const errors: IValidationError[] = []

    // TOTAL LPEmission

    if (totalLPEmission !== "") {
      if (isNaN(Number(totalLPEmission))) {
        errors.push({
          message: "Total LP emission must be a number",
          field: "totalLPEmission",
        })
      }
    }

    // MINIMAL INVESTMENT

    if (minimalInvestment !== "") {
      if (isNaN(Number(minimalInvestment))) {
        errors.push({
          message: "Minimal investment must be a number",
          field: "minimalInvestment",
        })
      }
    }

    this.setState({ validationErrors: errors })

    return !errors.length
  }

  render() {
    const { children } = this.props

    return (
      <FundContext.Provider
        value={{
          ...this.state,
          handleChange: this.handleChange,
          setInitial: this.setInitial,
          setInitialIpfs: this.setInitialIpfs,
          setDefault: this.setDefault,
          poolParametersSaveCallback: this.poolParametersSaveCallback,
          managersRemoveCallback: this.managersRemoveCallback,
          managersAddCallback: this.managersAddCallback,
          investorsRemoveCallback: this.investorsRemoveCallback,
          investorsAddCallback: this.investorsAddCallback,
          isIpfsDataUpdated: this.isIpfsDataUpdated,
          isPoolParametersUpdated: this.isPoolParametersUpdated,
          handleValidate: this.handleValidate,
        }}
      >
        {children}
      </FundContext.Provider>
    )
  }
}

export default UpdateFundContext
