import React, { useContext } from "react"

import { ValidatorsListContext } from "context/ValidatorsListContext"
import ValidatorField from "./ValidatorField/index"
import { isAddress } from "utils"

import * as S from "./styled"

const ValidatorsList: React.FC = () => {
  const {
    validators,
    validatorTokenSymbol,
    balances,
    hiddenIdxs,
    handleAddValidator,
    handleDeleteValidator,
    handleChangeValidator,
    handleHideValidator,
    handleRestoreValidator,
    handleRestoreToDefault,
    handleChangeBalance,
    initialForm,
  } = useContext(ValidatorsListContext)

  return (
    <S.ValidatorsSection>
      <S.ValidatorsSectionHeader>
        <S.HeaderButton
          type="button"
          text={"+ Add new validator"}
          color="default"
          size="no-paddings"
          onClick={handleAddValidator}
        />
        <S.HeaderButton
          type="button"
          text={"Restore all to default"}
          color="default"
          size="no-paddings"
          onClick={handleRestoreToDefault}
        />
      </S.ValidatorsSectionHeader>
      <S.ValidatorsList>
        {validators.map((validator, idx) => {
          const address = validator
          const isHidden = hiddenIdxs.includes(idx)

          let errorMessage: string | undefined = undefined
          if (address !== "" && !isAddress(address) && !isHidden) {
            errorMessage = "Please enter valid address"
          } else if (
            validators.filter(
              (el, index) => el === address && !hiddenIdxs.includes(index)
            ).length > 1
          ) {
            errorMessage = "Ця адреса дублюється"
          }

          return (
            <ValidatorField
              key={idx}
              address={address}
              token={validatorTokenSymbol}
              isHidden={isHidden}
              isInitial={initialForm.validators.includes(validator)}
              setAddress={(value) => handleChangeValidator(value, idx)}
              handleDelete={() => handleDeleteValidator(idx)}
              handleHide={() => handleHideValidator(idx)}
              handleRestore={() => handleRestoreValidator(idx)}
              amount={balances[idx]}
              errorMessage={errorMessage}
              setAmount={(string: string) => handleChangeBalance(string, idx)}
            />
          )
        })}
      </S.ValidatorsList>
    </S.ValidatorsSection>
  )
}

export default ValidatorsList
