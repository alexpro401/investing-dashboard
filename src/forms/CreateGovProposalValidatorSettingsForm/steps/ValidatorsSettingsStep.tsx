import React, { useCallback, useContext, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { parseUnits, formatUnits } from "@ethersproject/units"

import {
  StepsNavigation,
  CardHead,
  Card,
  CardDescription,
  Icon,
  AppButton,
} from "common"
import { OverlapInputField } from "fields"
import { stepsControllerContext } from "context/StepsControllerContext"
import { ValidatorsListContext } from "context/govPool/proposals/ValidatorsListContext"
import { FundDaoCreatingContext } from "context/FundDaoCreatingContext"
import { CreateDaoCardStepNumber } from "common"
import ValidatorsList from "components/ValidatorsList"
import GovVotingSettings from "modals/GovVotingSettings"
import { ICON_NAMES } from "constants/icon-names"
import { readFromClipboard } from "utils/clipboard"
import { useFormValidation } from "hooks/useFormValidation"
import useGovUserKeeperGetTotalVoteWeight from "hooks/dao/useGovUserKeeperGetTotalVoteWeight"
import { required, isAddressValidator } from "utils/validators"
import { cutStringZeroes } from "utils"
import { divideBignumbers, multiplyBignumbers } from "utils/formulas"

import * as S from "../styled"

const ValidatorsSettingsStep: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()

  const { currentStepNumber, nextCb } = useContext(stepsControllerContext)
  const { validators, balances, handleChangeValidator, hiddenIdxs } =
    useContext(ValidatorsListContext)
  const { initialForm } = useContext(FundDaoCreatingContext)
  const totalVoteWeight = useGovUserKeeperGetTotalVoteWeight(daoAddress ?? "")

  const [previousSettingsOpened, setPreviousSettingsOpened] = useState(false)
  const { isFieldsValid, touchForm } = useFormValidation(
    {
      balances: balances.filter((_, idx) => !hiddenIdxs.includes(idx)),
      validators: validators.filter((_, idx) => !hiddenIdxs.includes(idx)),
    },
    {
      balances: {
        required,
        $every: {
          required,
        },
      },
      validators: {
        required,
        $every: {
          required,
          isAddressValidator,
        },
      },
    }
  )

  const handleOpenPreviousSettings = useCallback(() => {
    setPreviousSettingsOpened(true)
  }, [setPreviousSettingsOpened])

  const handleNextStep = useCallback(() => {
    touchForm()

    if (
      balances
        .filter((_, idx) => !hiddenIdxs.includes(idx))
        .filter((balance) => balance !== "" && Number(balance) !== 0).length !==
      balances.filter((_, idx) => !hiddenIdxs.includes(idx)).length
    ) {
      return
    }

    if (isFieldsValid) {
      nextCb()
    }
  }, [nextCb, balances, isFieldsValid, hiddenIdxs, touchForm])

  const haveAtLeastOneValidator = useMemo<boolean>(
    () =>
      validators.filter((el) => el !== "").length > 0 ||
      balances.filter((el) => el !== "").length > 0,
    [validators, balances]
  )

  const handlePasteAddressToValidator = useCallback(async () => {
    try {
      const text = await readFromClipboard()
      handleChangeValidator(text, 0)
    } catch (error) {
      console.log(error)
    }
  }, [handleChangeValidator])

  const regularQuorum = useMemo(() => {
    if (!totalVoteWeight) return "0"

    const quorumBN = parseUnits(
      initialForm._validatorsBalancesSettingsForm.quorum.toString(),
      18
    )

    // quorum_votes = (validator_total_supply * validators_quorum) / 100
    const multiplyResult = multiplyBignumbers(
      [quorumBN, 18],
      [totalVoteWeight, 18]
    )
    const quorumResult = divideBignumbers(
      [multiplyResult, 18],
      [parseUnits("100"), 18]
    )

    return cutStringZeroes(formatUnits(quorumResult, 18))
  }, [totalVoteWeight, initialForm])

  return (
    <>
      <GovVotingSettings
        isOpen={previousSettingsOpened}
        toggle={() => setPreviousSettingsOpened((b) => !b)}
        earlyCompletion={
          initialForm._validatorsBalancesSettingsForm.earlyCompletion
        }
        delegatedVotingAllowed={
          initialForm._validatorsBalancesSettingsForm.delegatedVotingAllowed
        }
        duration={initialForm._validatorsBalancesSettingsForm.duration}
        quorum={regularQuorum}
        minVotesForVoting={
          initialForm._validatorsBalancesSettingsForm.minVotesForVoting
        }
        minVotesForCreating={
          initialForm._validatorsBalancesSettingsForm.minVotesForCreating
        }
        rewardToken={initialForm._validatorsBalancesSettingsForm.rewardToken}
        creationReward={
          initialForm._validatorsBalancesSettingsForm.creationReward
        }
        voteRewardsCoefficient={
          initialForm._validatorsBalancesSettingsForm.voteRewardsCoefficient
        }
        executionReward={
          initialForm._validatorsBalancesSettingsForm.executionReward
        }
      />
      <S.StepsRoot>
        <Card>
          <CardHead
            nodeLeft={<CreateDaoCardStepNumber number={currentStepNumber} />}
            title="Validators"
          />
          <CardDescription>
            {haveAtLeastOneValidator && (
              <>
                <p>
                  Here you can propose adding/removing validators, and the
                  change voting power of each validator.
                </p>
                <p>Will be voted on by users only.</p>
              </>
            )}
            {!haveAtLeastOneValidator && (
              <>
                <p>
                  Here you can designate trusted DAO members to serve as
                  validators who will hold a validator-only second vote on every
                  passed proposal to filter out potentially malicious proposals.
                </p>
                <p>
                  Validators can also create special proposals to be voted on
                  exclusively among themselves.
                </p>
              </>
            )}
            <br />
            <S.VotingSettingsModalButton
              text="View current voting settings"
              color="default"
              size="no-paddings"
              onClick={handleOpenPreviousSettings}
            />
          </CardDescription>
        </Card>
        {haveAtLeastOneValidator && <ValidatorsList />}
        {!haveAtLeastOneValidator && (
          <Card>
            <CardHead
              nodeLeft={<Icon name={ICON_NAMES.users} />}
              title="Validator addresses"
            />
            <CardDescription>
              <p>
                Validators vote via a separate token that is created
                automatically.
              </p>
              <p>
                Add all validator addresses and the number of tokens to
                distribute to each. Validator tokens will be automatically
                distributed to them accordingly.
              </p>
            </CardDescription>
            <OverlapInputField
              nodeLeft={
                <AppButton
                  type="button"
                  color="default"
                  size="no-paddings"
                  text={"Paste address"}
                  onClick={handlePasteAddressToValidator}
                />
              }
              value={""}
              setValue={() => {}}
              readonly
              errorMessage={
                !isFieldsValid ? "Please enter valid address" : undefined
              }
            />
          </Card>
        )}
      </S.StepsRoot>
      <StepsNavigation customNextCb={handleNextStep} />
    </>
  )
}

export default ValidatorsSettingsStep
