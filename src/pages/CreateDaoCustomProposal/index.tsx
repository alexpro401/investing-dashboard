import React, { useCallback, useState, useMemo, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import { createPortal } from "react-dom"

import {
  Card,
  CardHead,
  CardDescription,
  SelectableCard,
  StepsNavigation,
  CreateDaoCardStepNumber,
} from "common"
import Header from "components/Header/Layout"
import RadioButton from "components/RadioButton"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import Skeleton from "components/Skeleton"
import { Flex } from "theme"
import { useBreakpoints } from "hooks"
import { hideTapBar, showTabBar } from "state/application/actions"

import * as S from "./styled"
import * as SForms from "common/FormSteps/styled"

enum ECustomProposalTypes {
  walletConnect = "walletConnect",
  abi = "abi",
  manual = "manual",
}

interface ICustomProposalSelectType {
  type: ECustomProposalTypes
  title: string
  description: React.ReactNode
}

const CreateDaoCustomProposal: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { daoAddress, executorAddress } = useParams<
    "daoAddress" | "executorAddress"
  >()
  const { isMobile } = useBreakpoints()
  const [selectedCard, setSelectedCard] = useState<ECustomProposalTypes>(
    ECustomProposalTypes.abi
  )
  const [appNavigationEl, setAppNavigationEl] = useState<Element | null>(null)

  useEffect(() => {
    dispatch(hideTapBar())
    setTimeout(() => {
      setAppNavigationEl(document.querySelector("#app-navigation"))
    }, 100)

    return () => {
      dispatch(showTabBar())
    }
  }, [dispatch])

  const handlePrevStep = useCallback(() => {
    navigate(`/dao/${daoAddress}/create-proposal`)
  }, [navigate, daoAddress])

  const handleNextStep = useCallback(() => {
    const slug = `/dao/${daoAddress}/create-custom-proposal`

    if (selectedCard === ECustomProposalTypes.walletConnect) {
      return navigate(slug + `/wallet-connect/${executorAddress}`)
    }

    if (selectedCard === ECustomProposalTypes.abi) {
      return navigate(slug + `/abi/${executorAddress}`)
    }

    if (selectedCard === ECustomProposalTypes.manual) {
      return navigate(slug + `/manual/${executorAddress}`)
    }
  }, [navigate, daoAddress, selectedCard, executorAddress])

  const customProposalSelectTypes = useMemo<ICustomProposalSelectType[]>(
    () => [
      // {
      //   type: ECustomProposalTypes.walletConnect,
      //   title: "Wallet connect",
      //   description: (
      //     <>
      //       <p>Interact with dApps via Wallet connect.</p>
      //     </>
      //   ),
      // },
      {
        type: ECustomProposalTypes.abi,
        title: "ABI (advanced)",
        description: (
          <>
            <p>
              If you are using tooling like Hardhart/Truffle or an IDE like
              Remix, the contract ABI is automatically generated for you. You
              can also manually create the ABI by using the Solidity Compiler
              NPM package.
            </p>
          </>
        ),
      },
      {
        type: ECustomProposalTypes.manual,
        title: "Manual (advanced)",
        description: (
          <>
            <p>Insert in the field below the DATA of the formed transaction:</p>
          </>
        ),
      },
    ],
    []
  )

  return (
    <SForms.StepsFormContainer
      totalStepsAmount={3}
      currentStepNumber={1}
      prevCb={handlePrevStep}
      nextCb={handleNextStep}
    >
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation
        daoPoolAddress={daoAddress ?? ""}
        loader={
          <Flex
            gap={"24"}
            full
            m="16px 0 0 0"
            dir="column"
            ai={"center"}
            jc={"flex-start"}
          >
            <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"70px"} />
            <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"70px"} />
            <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"70px"} />
          </Flex>
        }
      >
        <SForms.StepsWrapper>
          <SForms.StepsContainer>
            <S.PageHolder>
              <S.PageContent>
                <Card>
                  <CardHead
                    nodeLeft={<CreateDaoCardStepNumber number={1} />}
                    title="Select creation method"
                  />
                  <CardDescription>
                    <p>
                      This proposl type is to create a proposal for autonomous
                      interaction with any DeFi protocol. Connect the treasury
                      wallet with the needed dApp and initiate the transaction
                      to be finalized once the proposal passes.
                    </p>
                    <p>
                      E.g., you can create a proposal to buy any asset on 1inch
                      to diversify or provide liquidity to a pair on Uniswap to
                      generate extra profit for your DAO.
                    </p>
                  </CardDescription>
                </Card>
                {customProposalSelectTypes.map(
                  ({ type, title, description }) => (
                    <SelectableCard
                      key={type}
                      value={selectedCard}
                      setValue={setSelectedCard}
                      valueToSet={type}
                      nodeLeft={
                        <RadioButton
                          selected={selectedCard}
                          value={type}
                          onChange={() => {}}
                        />
                      }
                      title={title}
                      description={description}
                    />
                  )
                )}
                {isMobile &&
                  appNavigationEl &&
                  createPortal(<StepsNavigation />, appNavigationEl)}
                {!isMobile && <StepsNavigation />}
              </S.PageContent>
            </S.PageHolder>
          </SForms.StepsContainer>
          {!isMobile && (
            <SForms.SideStepsNavigationBarWrp
              title={"Create proposal"}
              steps={[
                {
                  number: 1,
                  title: "Select creation method",
                },
                {
                  number: 2,
                  title: "Custom voting params",
                },
                {
                  number: 3,
                  title: "Basic info",
                },
              ]}
              currentStep={1}
            />
          )}
        </SForms.StepsWrapper>
      </WithGovPoolAddressValidation>
    </SForms.StepsFormContainer>
  )
}

export default CreateDaoCustomProposal
