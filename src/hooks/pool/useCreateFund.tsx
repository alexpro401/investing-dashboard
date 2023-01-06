import { useCallback, useContext, useState, useMemo } from "react"

import { useActiveWeb3React } from "hooks"
import { useTransactionAdder } from "state/transactions/hooks"
import { TransactionType } from "state/transactions/types"
import { usePoolFactoryContract, useTraderPoolContract } from "contracts"
import { UpdateListType } from "consts/types"
import { bigify, isTxMined } from "utils"
import { IpfsEntity } from "utils/ipfsEntity"
import { CreateFundContext } from "context/fund/CreateFundContext"

import Stepper from "components/Stepper"
import Icon from "components/Icon"
import TokenIcon from "components/TokenIcon"
import Modal from "components/Modal"
import { ModalIcons, SuccessModal as SuccessModalComponent } from "common/Pool"

import defaultAvatar from "assets/icons/default-avatar.svg"
import { IStep, mapCommissionPeriodToNumber, mapPoolCreateSteps } from "consts"
import { isString } from "lodash"

const deployMethodByType = {
  basic: "deployBasicPool",
  investment: "deployInvestPool",
}

interface IUseCreateFund {
  presettedFundType: "basic" | "investment"
}

const useCreateFund = ({ presettedFundType }: IUseCreateFund) => {
  const { account } = useActiveWeb3React()

  const {
    fundName,
    tickerSymbol,
    avatarUrl,
    description,
    descriptionURL,
    strategy,
    baseToken,
    feeType,
    comission,
    isLimitedEmission,
    limitedEmission,
    isMinInvestmentAmount,
    minInvestmentAmount,
    isPrivatAddresses,
    privateAddresses,
    isFundManagers,
    fundManagers,
  } = useContext(CreateFundContext)
  const traderPoolFactory = usePoolFactoryContract()
  const addTransaction = useTransactionAdder()

  const [createdPoolAddress, setCreatedPoolAddress] = useState<string>("")
  const [transactionFail, setTransactionFail] = useState<boolean>(false)
  const [step, setStep] = useState<number>(0)
  const [steps, setSteps] = useState<IStep[]>([])
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [stepPending, setStepPending] = useState<boolean>(false)
  const [successModalOpened, setSuccessModalOpened] = useState<boolean>(false)

  const traderPool = useTraderPoolContract(createdPoolAddress)

  const handlePoolCreate = useCallback(async () => {
    if (!account || !traderPoolFactory || !baseToken.get) return

    const totalEmission = bigify(
      isLimitedEmission.get ? limitedEmission.get : "0",
      18
    ).toHexString()
    const minInvest = bigify(
      isMinInvestmentAmount.get ? minInvestmentAmount.get : "0",
      18
    ).toHexString()
    const percentage = bigify(comission.get.toString(), 25).toHexString()

    const poolParameters = {
      descriptionURL: descriptionURL.get,
      trader: account,
      privatePool: isPrivatAddresses.get,
      totalLPEmission: totalEmission,
      baseToken: baseToken.get.address,
      baseTokenDecimals: baseToken.get.decimals,
      minimalInvestment: minInvest,
      commissionPeriod: mapCommissionPeriodToNumber[feeType.get],
      commissionPercentage: percentage,
    }

    const typeName = deployMethodByType[presettedFundType]

    const receipt = await traderPoolFactory[typeName](
      fundName.get,
      tickerSymbol.get,
      poolParameters
    )

    return addTransaction(receipt, {
      type: TransactionType.POOL_CREATE,
      baseCurrencyId: baseToken.get.address,
      fundName: fundName.get,
    })
  }, [
    account,
    descriptionURL,
    baseToken,
    feeType,
    comission,
    isPrivatAddresses,
    isLimitedEmission,
    limitedEmission,
    isMinInvestmentAmount,
    minInvestmentAmount,
    fundName,
    tickerSymbol,
    presettedFundType,
    traderPoolFactory,
    addTransaction,
  ])

  const handleIPFSUpload = useCallback(async () => {
    if (!account) return

    const poolIpfsMetadataEntity = new IpfsEntity({
      data: JSON.stringify({
        assets: [avatarUrl.get],
        description: description.get,
        strategy: strategy.get,
        account,
        timestamp: new Date().getTime() / 1000,
      }),
    })

    await poolIpfsMetadataEntity.uploadSelf()

    if (!isString(poolIpfsMetadataEntity._path)) {
      throw new Error("IPFS upload failed")
    }

    descriptionURL.set(poolIpfsMetadataEntity._path)
  }, [account, avatarUrl.get, description.get, strategy.get, descriptionURL])

  const handleManagersAdd = useCallback(async () => {
    const receipt = await traderPool?.modifyAdmins(
      isFundManagers.get ? fundManagers.get : [],
      true
    )

    return addTransaction(receipt, {
      type: TransactionType.POOL_UPDATE_MANAGERS,
      editType: UpdateListType.ADD,
      poolId: createdPoolAddress,
    })
  }, [
    addTransaction,
    createdPoolAddress,
    traderPool,
    isFundManagers,
    fundManagers,
  ])

  const handleInvestorsAdd = useCallback(async () => {
    const receipt = await traderPool?.modifyPrivateInvestors(
      isPrivatAddresses.get ? privateAddresses.get : [],
      true
    )

    return addTransaction(receipt, {
      type: TransactionType.POOL_UPDATE_INVESTORS,
      editType: UpdateListType.ADD,
      poolId: createdPoolAddress,
    })
  }, [
    addTransaction,
    createdPoolAddress,
    privateAddresses,
    isPrivatAddresses,
    traderPool,
  ])

  const createFund = useCallback(() => {
    setTransactionFail(false)

    const stepsShape: IStep[] = [
      mapPoolCreateSteps.IPFS,
      mapPoolCreateSteps.CREATE,
    ]

    if (isFundManagers.get && fundManagers.get.length) {
      stepsShape.push(mapPoolCreateSteps.MANAGERS)
    }

    if (isPrivatAddresses.get && privateAddresses.get.length) {
      stepsShape.push(mapPoolCreateSteps.INVESTORS)
    }

    stepsShape.push(mapPoolCreateSteps.SUCCESS)

    setSteps(stepsShape)
    setIsCreating(true)
  }, [fundManagers, isFundManagers, privateAddresses, isPrivatAddresses])

  const handleNextStep = useCallback(async () => {
    try {
      setTransactionFail(false)

      if (steps[step].title === mapPoolCreateSteps.IPFS.title) {
        setStepPending(true)
        await handleIPFSUpload()
        setStep(step + 1)
        setStepPending(false)
      }

      if (steps[step].title === mapPoolCreateSteps.CREATE.title) {
        setStepPending(true)
        const tx = await handlePoolCreate()

        if (isTxMined(tx) && !!tx!.logs.length && !!tx!.logs[1].address) {
          setCreatedPoolAddress(tx!.logs[1].address)
          setStep(step + 1)
          setStepPending(false)
        }
      }

      if (steps[step].title === mapPoolCreateSteps.MANAGERS.title) {
        setStepPending(true)
        const tx = await handleManagersAdd()

        if (isTxMined(tx)) {
          setStep(step + 1)
          setStepPending(false)
        }
      }

      if (steps[step].title === mapPoolCreateSteps.INVESTORS.title) {
        setStepPending(true)
        const tx = await handleInvestorsAdd()

        if (isTxMined(tx)) {
          setStep(step + 1)
          setStepPending(false)
        }
      }

      // detect when last step and open success modal
      if (steps.length - 2 === step) {
        setIsCreating(false)
        setStepPending(false)
        setSuccessModalOpened(true)
      }
    } catch (error) {
      setStepPending(false)
      setTransactionFail(true)
      console.log(error)
    }
  }, [
    handleIPFSUpload,
    handleInvestorsAdd,
    handleManagersAdd,
    step,
    steps,
    handlePoolCreate,
    setSuccessModalOpened,
  ])

  const StepperModal = useMemo(() => {
    if (steps.length === 0) return null

    return (
      <Stepper
        failed={transactionFail}
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onSubmit={handleNextStep}
        current={step}
        pending={stepPending}
        steps={steps}
        title="Creation of fund"
      >
        {baseToken.get && baseToken.get.address && (
          <ModalIcons
            left={
              <Icon
                m="0"
                size={32}
                address="0x"
                source={
                  avatarUrl.get.length > 0 ? avatarUrl.get : defaultAvatar
                }
              />
            }
            right={
              <TokenIcon m="0" size={32} address={baseToken.get.address} />
            }
            fund={tickerSymbol.get}
            base={baseToken.get.symbol ?? ""}
          />
        )}
      </Stepper>
    )
  }, [
    steps,
    transactionFail,
    isCreating,
    handleNextStep,
    step,
    stepPending,
    avatarUrl,
    baseToken,
    tickerSymbol,
  ])

  const SuccessModal = useMemo(
    () => (
      <Modal
        isOpen={successModalOpened}
        isShowCloseBtn={false}
        toggle={() => setSuccessModalOpened(!successModalOpened)}
        title=""
        maxWidth="450px"
      >
        <SuccessModalComponent
          createdFundAddress={createdPoolAddress}
          close={() => setSuccessModalOpened(false)}
        />
      </Modal>
    ),
    [successModalOpened, createdPoolAddress]
  )

  return { createFund, StepperModal, SuccessModal }
}

export default useCreateFund
