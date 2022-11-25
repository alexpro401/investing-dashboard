import React, { useCallback, useState, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"

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
import StepsControllerContext from "context/StepsControllerContext"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"

import * as S from "./styled"

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
  const { daoAddress, executorAddress } = useParams<
    "daoAddress" | "executorAddress"
  >()
  const [selectedCard, setSelectedCard] = useState<ECustomProposalTypes>(
    ECustomProposalTypes.walletConnect
  )

  const handlePrevStep = useCallback(() => {
    navigate(`/dao/${daoAddress}/create-proposal`)
  }, [navigate, daoAddress])

  const handleNextStep = useCallback(() => {
    //TODO
  }, [navigate, daoAddress, selectedCard, executorAddress])

  const customProposalSelectTypes = useMemo<ICustomProposalSelectType[]>(
    () => [
      {
        type: ECustomProposalTypes.walletConnect,
        title: "Wallet connect",
        description: (
          <>
            <p>Interact with dApps via Wallet connect.</p>
          </>
        ),
      },
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
    <StepsControllerContext
      totalStepsAmount={3}
      currentStepNumber={1}
      prevCb={handlePrevStep}
      nextCb={handleNextStep}
    >
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation daoPoolAddress={daoAddress ?? ""}>
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
                  wallet with the needed dApp and initiate the transaction to be
                  finalized once the proposal passes.
                </p>
                <p>
                  E.g., you can create a proposal to buy any asset on 1inch to
                  diversify or provide liquidity to a pair on Uniswap to
                  generate extra profit for your DAO.
                </p>
              </CardDescription>
            </Card>
            {customProposalSelectTypes.map(({ type, title, description }) => (
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
            ))}
            <StepsNavigation />
          </S.PageContent>
        </S.PageHolder>
      </WithGovPoolAddressValidation>
    </StepsControllerContext>
  )
}

export default CreateDaoCustomProposal
