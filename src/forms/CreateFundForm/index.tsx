import { FC, useState, useCallback, useEffect, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Flex } from "theme"
import { useWeb3React } from "@web3-react/core"
import { PulseSpinner } from "react-spinners-kit"

import { AppButton } from "common"
import Avatar from "components/Avatar"
import AddressChips from "components/AddressChips"
import Input from "components/Input"
import IconButton from "components/IconButton"
import TextArea from "components/TextArea"
import TokenIcon from "components/TokenIcon"
import Slider from "components/Slider"
import Stepper, { Step as IStep } from "components/Stepper"
import SwitchRow, { InputText } from "components/SwitchRow"
import Icon from "components/Icon"
import ExternalLink from "components/ExternalLink"

import TokenSelect from "modals/TokenSelect"

import { bigify, isTxMined } from "utils"
import { Token } from "lib/entities"
import { UpdateListType } from "constants/types"
import { useUserAgreement } from "state/user/hooks"
import { TransactionType } from "state/transactions/types"
import { useTransactionAdder } from "state/transactions/hooks"
import { useCreateFundContext } from "context/CreateFundContext"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { sliderPropsByPeriodType, performanceFees } from "constants/index"

import ManagersIcon from "assets/icons/Managers"
import InvestorsIcon from "assets/icons/Investors"
import EmissionIcon from "assets/icons/Emission"
import MinInvestIcon from "assets/icons/MinInvestAmount"
import plus from "assets/icons/button-plus.svg"
import defaultAvatar from "assets/icons/default-avatar.svg"

import HeaderStep from "./Header"
import FeeCard from "./FeeCard"

import {
  Body,
  Steps,
  Step,
  StepBody,
  FeeCards,
  LinkButton,
  AvatarWrapper,
  ModalIcons,
  ValidationError,
  InputRow,
} from "./styled"
import { useUserTokens, useWhitelistTokens } from "hooks/useToken"
import { useAllTokenBalances } from "hooks/useBalance"
import { usePoolFactoryContract, useTraderPoolContract } from "contracts"
import { IpfsEntity } from "utils/ipfsEntity"

const deployMethodByType = {
  basic: "deployBasicPool",
  investment: "deployInvestPool",
}

interface Props {
  presettedFundType?: "basic" | "investment" | "daoPool"
}

const CreateFund: FC<Props> = ({ presettedFundType = "basic" }) => {
  const {
    handleChange,
    handleValidate,
    baseToken,
    description,
    strategy,
    fundName,
    fundSymbol,
    fundType,
    commissionPeriod,
    commissionPercentage,
    managers,
    investors,
    totalLPEmission,
    minimalInvestment,
    avatarBlobString,
    validationErrors,
  } = useCreateFundContext()

  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { chainId, account } = useWeb3React()

  const addTransaction = useTransactionAdder()

  const [isEmissionLimited, setEmission] = useState(totalLPEmission !== "")
  const [isMinimalInvest, setMinimalInvest] = useState(minimalInvestment !== "")
  const [isManagersAdded, setManagers] = useState(!!managers.length)
  const [isInvestorsAdded, setInvestors] = useState(!!investors.length)

  const [step, setStep] = useState(0)
  const [steps, setSteps] = useState<IStep[]>([])
  const [stepPending, setStepPending] = useState(false)
  const [isCreating, setCreating] = useState(false)
  const [transactionFail, setTransactionFail] = useState(false)
  const [stepsFormating, setStepsFormating] = useState(false)
  const [contractAddress, setCreactedAddress] = useState("")

  const traderPoolFactory = usePoolFactoryContract()
  const traderPool = useTraderPoolContract(contractAddress)

  const [{ agreed }, { setShowAgreement }] = useUserAgreement()

  const whitelistTokens = useWhitelistTokens()
  const userTokens = useUserTokens()
  const allTokens = useMemo(
    () => ({ ...whitelistTokens, ...userTokens }),
    [userTokens, whitelistTokens]
  )
  const [balances, balancesIsLoading] = useAllTokenBalances()

  const handleTokenSelectOpen = useCallback(() => {
    navigate("modal/search")
  }, [navigate])

  const handleTokenSelectClose = useCallback(() => {
    navigate(pathname.slice(0, pathname.indexOf("/modal")))
  }, [navigate, pathname])

  const handleTokenSelect = useCallback(
    (token: Token) => {
      handleChange("baseToken", token)
      handleTokenSelectClose()
    },
    [handleChange, handleTokenSelectClose]
  )

  const handlePoolCreate = useCallback(async () => {
    if (!account || !traderPoolFactory) return

    const poolIpfsMetadataEntity = new IpfsEntity({
      data: JSON.stringify({
        assets: [avatarBlobString],
        description,
        strategy,
        account,
        timestamp: new Date().getTime() / 1000,
      }),
    })

    await poolIpfsMetadataEntity.uploadSelf()

    const totalEmission = bigify(totalLPEmission, 18).toHexString()
    const minInvest = bigify(minimalInvestment, 18).toHexString()
    const percentage = bigify(commissionPercentage.toString(), 25).toHexString()

    const poolParameters = {
      descriptionURL: poolIpfsMetadataEntity._path,
      trader: account,
      privatePool: isInvestorsAdded,
      totalLPEmission: totalEmission,
      baseToken: baseToken.address,
      baseTokenDecimals: baseToken.decimals,
      minimalInvestment: minInvest,
      commissionPeriod,
      commissionPercentage: percentage,
    }

    const typeName = deployMethodByType[fundType]

    const receipt = await traderPoolFactory[typeName](
      fundName,
      fundSymbol,
      poolParameters
    )

    return addTransaction(receipt, {
      type: TransactionType.POOL_CREATE,
      baseCurrencyId: baseToken.address,
      fundName,
    })
  }, [
    account,
    avatarBlobString,
    baseToken.address,
    baseToken.decimals,
    commissionPercentage,
    commissionPeriod,
    description,
    fundName,
    fundSymbol,
    fundType,
    isInvestorsAdded,
    minimalInvestment,
    strategy,
    totalLPEmission,
    traderPoolFactory,
    addTransaction,
  ])

  const handleManagersAdd = useCallback(async () => {
    const receipt = await traderPool?.modifyAdmins(managers, true)

    return addTransaction(receipt, {
      type: TransactionType.POOL_UPDATE_MANAGERS,
      editType: UpdateListType.ADD,
      poolId: contractAddress,
    })
  }, [addTransaction, contractAddress, managers, traderPool])

  const handleInvestorsAdd = useCallback(async () => {
    const receipt = await traderPool?.modifyPrivateInvestors(investors, true)

    return addTransaction(receipt, {
      type: TransactionType.POOL_UPDATE_INVESTORS,
      editType: UpdateListType.ADD,
      poolId: contractAddress,
    })
  }, [addTransaction, contractAddress, investors, traderPool])

  const handleSubmit = async () => {
    if (stepsFormating) return

    if (!handleValidate()) return

    setStepsFormating(true)

    let stepsShape = [
      {
        title: "Create",
        description:
          "Create your fund by signing a transaction in your wallet. This will create ERC20 compatible token.",
        buttonText: "Create fund",
      },
    ]

    if (managers.length) {
      stepsShape = [
        ...stepsShape,
        {
          title: "Managers",
          description: "Add managers to your fund.",
          buttonText: "Add managers",
        },
      ]
    }

    if (investors.length) {
      stepsShape = [
        ...stepsShape,
        {
          title: "Investors",
          description: "Add investors to your fund.",
          buttonText: "Add investors",
        },
      ]
    }

    stepsShape = [
      ...stepsShape,
      {
        title: "Success",
        description: "Your fund has been successfully created.",
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
      if (steps[step].title === "Create") {
        setStepPending(true)
        const tx = await handlePoolCreate()

        if (isTxMined(tx) && !!tx!.logs.length && !!tx!.logs[1].address) {
          setCreactedAddress(tx!.logs[1].address)
          setStep(step + 1)
          setStepPending(false)
        }
      }

      if (steps[step].title === "Managers") {
        setStepPending(true)
        const tx = await handleManagersAdd()

        if (isTxMined(tx)) {
          setStep(step + 1)
          setStepPending(false)
        }
      }

      if (steps[step].title === "Investors") {
        setStepPending(true)
        const tx = await handleInvestorsAdd()

        if (isTxMined(tx)) {
          setStep(step + 1)
          setStepPending(false)
        }
      }

      if (steps[step].title === "Success") {
        setCreating(false)
        setStepPending(false)
        navigate(`/success/${contractAddress}`)
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

  const handleManagersRowChange = (state: boolean) => {
    setManagers(state)

    if (!state) {
      handleChange("managers", [])
    }
  }

  const handleInvestorsRowChange = (state: boolean) => {
    setInvestors(state)

    if (!state) {
      handleChange("investors", [])
    }
  }

  const handleMinInvestRowChange = (state: boolean) => {
    setMinimalInvest(state)

    if (!state) {
      handleChange("minimalInvestment", "")
    }
  }

  const baseTokenAvatar = !!baseToken.address && (
    <TokenIcon size={24} address={baseToken.address} />
  )

  const baseTokenLink = !baseToken.address ? (
    <IconButton onClick={handleTokenSelectOpen} media={plus} />
  ) : (
    <ExternalLink
      href={getExplorerLink(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        chainId!,
        baseToken.address,
        ExplorerDataType.ADDRESS
      )}
      iconColor="#616D8B"
    />
  )

  useEffect(() => {
    handleChange("fundType", presettedFundType)
  }, [handleChange, presettedFundType])

  return (
    <>
      {!!steps.length && (
        <Stepper
          failed={transactionFail}
          isOpen={isCreating}
          onClose={() => setCreating(false)}
          onSubmit={handleNextStep}
          current={step}
          pending={stepPending}
          steps={steps}
          title="Creation of fund"
        >
          {baseToken.address && (
            <ModalIcons
              left={
                <Icon
                  m="0"
                  size={28}
                  source={
                    avatarBlobString.length > 0
                      ? avatarBlobString
                      : defaultAvatar
                  }
                />
              }
              right={<TokenIcon m="0" size={28} address={baseToken.address} />}
              fund={fundSymbol}
              base={baseToken.symbol}
            />
          )}
        </Stepper>
      )}
      <TokenSelect
        allBalances={balances}
        balancesLoading={balancesIsLoading}
        whitelistOnly
        allTokens={allTokens}
        onClose={handleTokenSelectClose}
        onSelect={handleTokenSelect}
      />
      <Body>
        <AvatarWrapper>
          <Avatar
            m="0 auto"
            onCrop={handleChange}
            showUploader
            size={100}
            url={avatarBlobString}
          >
            <LinkButton>Add fund photo</LinkButton>
          </Avatar>
        </AvatarWrapper>
        <Steps>
          <Step>
            <HeaderStep
              title="Basic settings"
              description="This settings can not be changed afrer creation"
              index="1"
            />
            <StepBody>
              <InputRow>
                <Input
                  placeholder="---"
                  onClick={handleTokenSelectOpen}
                  disabled
                  leftIcon={baseTokenAvatar}
                  label="Base token"
                  value={baseToken.symbol}
                  rightIcon={baseTokenLink}
                />
                {getFieldErrors("baseToken")}
              </InputRow>
              <InputRow>
                <Input
                  label="Fund name"
                  limit={15}
                  value={fundName}
                  onChange={(value) => handleChange("fundName", value)}
                />
                {getFieldErrors("fundName")}
              </InputRow>
              <InputRow>
                <Input
                  limit={8}
                  label="Ticker symbol"
                  value={fundSymbol}
                  onChange={(value) => handleChange("fundSymbol", value)}
                />
                {getFieldErrors("fundSymbol")}
              </InputRow>
            </StepBody>
          </Step>
          <Step>
            <HeaderStep
              title="Investment"
              description="This settings can be changed in account ater"
              index="2"
            />
            <StepBody>
              <SwitchRow
                icon={<EmissionIcon active={isEmissionLimited} />}
                title="Limited Emission"
                isOn={isEmissionLimited}
                name="_emissionLimited"
                onChange={handleEmissionRowChange}
              >
                <InputRow>
                  <Input
                    type="number"
                    inputmode="decimal"
                    placeholder="---"
                    value={totalLPEmission}
                    onChange={(value) => handleChange("totalLPEmission", value)}
                    rightIcon={<InputText>LP</InputText>}
                  />
                  {getFieldErrors("totalLPEmission")}
                </InputRow>
              </SwitchRow>
              <SwitchRow
                icon={<ManagersIcon active={isManagersAdded} />}
                title="New fund managers"
                isOn={isManagersAdded}
                name="_managersRestricted"
                onChange={handleManagersRowChange}
              >
                <AddressChips
                  items={managers}
                  onChange={(v) => handleChange("managers", v)}
                  limit={100}
                  label="0x..."
                />
              </SwitchRow>
              <SwitchRow
                icon={<InvestorsIcon active={isInvestorsAdded} />}
                title="Invited investors"
                isOn={isInvestorsAdded}
                name="_investorsRestricted"
                onChange={handleInvestorsRowChange}
              >
                <AddressChips
                  items={investors}
                  onChange={(v) => handleChange("investors", v)}
                  limit={100}
                  label="0x..."
                />
              </SwitchRow>
              <SwitchRow
                icon={<MinInvestIcon active={isMinimalInvest} />}
                title="Minimum investment amount"
                isOn={isMinimalInvest}
                name="_minInvestRestricted"
                onChange={handleMinInvestRowChange}
              >
                <InputRow>
                  <Input
                    type="number"
                    inputmode="decimal"
                    placeholder="---"
                    value={minimalInvestment}
                    onChange={(v) => handleChange("minimalInvestment", v)}
                    rightIcon={<InputText>{baseToken.symbol}</InputText>}
                  />
                  {getFieldErrors("minimalInvestment")}
                </InputRow>
              </SwitchRow>
            </StepBody>
          </Step>
          <Step>
            <HeaderStep
              title="Fund Details"
              description="This settings can be changed in account ater"
              index="3"
            />
            <StepBody>
              <Flex full p="12px 0">
                <TextArea
                  defaultValue={description}
                  name="description"
                  placeholder="Fund description"
                  onChange={handleChange}
                />
              </Flex>
              <Flex full p="12px 0">
                <TextArea
                  defaultValue={strategy}
                  name="strategy"
                  placeholder="Fund strategy"
                  onChange={handleChange}
                />
              </Flex>
            </StepBody>
          </Step>
          <Step>
            <HeaderStep
              title="Management Fee"
              description="This settings can not be changed afrer creation"
              index="4"
            />
            <StepBody isLast>
              <FeeCards>
                {performanceFees.map((fee) => (
                  <FeeCard
                    key={fee.id}
                    name={fee.id}
                    label={fee.title}
                    description={fee.description}
                    selected={commissionPeriod}
                    handleSelect={(value: any) =>
                      handleChange("commissionPeriod", value)
                    }
                  />
                ))}
              </FeeCards>

              {getFieldErrors("commissionPercentage")}
              <Slider
                limits={sliderPropsByPeriodType[commissionPeriod]}
                name="commissionPercentage"
                initial={commissionPercentage}
                onChange={handleChange}
              />
            </StepBody>
          </Step>
        </Steps>
        <Flex full p="0 16px 42px">
          <AppButton
            full
            onClick={() => (agreed ? handleSubmit() : setShowAgreement(true))}
            text="Create fund"
            size="large"
            color="primary"
            iconRight={
              stepsFormating && (
                <PulseSpinner color="#34455F" size={12} loading />
              )
            }
          />
        </Flex>
      </Body>
    </>
  )
}

export default CreateFund
