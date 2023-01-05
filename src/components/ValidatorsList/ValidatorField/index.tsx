import React, { useMemo, useCallback } from "react"

import { OverlapInputField } from "fields"
import { ICON_NAMES } from "consts/icon-names"
import { AppButton } from "common"
import { readFromClipboard } from "utils/clipboard"
import { shortenAddress, isAddress } from "utils"
import { useBreakpoints } from "hooks"

import * as S from "./styled"

const EmptyAddressNodeLeft: React.FC<{
  setAddress: (value: string) => void
  handleDelete: () => void
}> = ({ setAddress, handleDelete }) => {
  const handleSetAddress = useCallback(async () => {
    try {
      const text = await readFromClipboard()
      setAddress(text)
    } catch (error) {
      console.log(error)
    }
  }, [setAddress])

  return (
    <S.AddressContainer>
      <S.BlueIcon name={ICON_NAMES.trash} onClick={handleDelete} />
      <AppButton
        type="button"
        text={"Paste address"}
        color="default"
        size="no-paddings"
        onClick={handleSetAddress}
      />
    </S.AddressContainer>
  )
}

const AddressNodeLeft: React.FC<{
  address: string
  isHidden: boolean
  isInitial: boolean
  handleHide: () => void
  handleRestore: () => void
  handleDelete: () => void
}> = ({
  address,
  isHidden,
  isInitial,
  handleHide,
  handleRestore,
  handleDelete,
}) => {
  return (
    <S.AddressContainer>
      {isHidden && (
        <S.BlueIcon name={ICON_NAMES.reload} onClick={handleRestore} />
      )}
      {!isHidden && (
        <S.BlueIcon
          name={ICON_NAMES.trash}
          onClick={isInitial ? handleHide : handleDelete}
        />
      )}
      <S.Address isHidden={isHidden}>
        {isAddress(address)
          ? shortenAddress(address)
          : `${address.substring(0, 5)}...`}
      </S.Address>
    </S.AddressContainer>
  )
}

interface IValidatorFieldProps {
  address: string
  token: string | null
  isHidden: boolean
  isInitial: boolean
  onlyAddress?: boolean
  setAddress: (value: string) => void
  handleDelete: () => void
  handleHide: () => void
  handleRestore: () => void
  amount: string
  errorMessage: string | undefined
  setAmount: (string: string) => void
}

const ValidatorField: React.FC<IValidatorFieldProps> = ({
  address = "",
  token,
  isHidden,
  isInitial,
  setAddress,
  handleDelete,
  handleHide,
  handleRestore,
  amount,
  setAmount,
  errorMessage,
}) => {
  const { isMobile } = useBreakpoints()

  const addressIsEmpty = useMemo(() => address === "", [address])

  const handleChangeTokenInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isNaN(Number(event.currentTarget.value))) return

      setAmount(event.currentTarget.value)
    },
    [setAmount]
  )

  return (
    <S.Root>
      {isMobile && (
        <OverlapInputField
          value={""}
          disabled
          overlapNodeLeft={
            <>
              {addressIsEmpty && (
                <EmptyAddressNodeLeft
                  setAddress={setAddress}
                  handleDelete={handleDelete}
                />
              )}
              {!addressIsEmpty && (
                <AddressNodeLeft
                  address={address}
                  isHidden={isHidden}
                  isInitial={isInitial}
                  handleHide={handleHide}
                  handleRestore={handleRestore}
                  handleDelete={handleDelete}
                />
              )}
            </>
          }
          overlapNodeRight={
            <S.TokenContainer>
              <S.TokenInput
                isHidden={isHidden}
                disabled={isHidden}
                value={amount}
                type={"text"}
                inputMode={"decimal"}
                onChange={handleChangeTokenInput}
                placeholder={"amount"}
              />
              {token && (
                <S.TokenLabel isHidden={isHidden}>{token}</S.TokenLabel>
              )}
            </S.TokenContainer>
          }
          errorMessage={errorMessage}
        />
      )}
      {!isMobile && (
        <S.DektopInputContainer>
          <S.DesktopLeftInput
            value={""}
            readonly
            disabled={isHidden}
            overlapNodeLeft={
              <>
                {addressIsEmpty && (
                  <EmptyAddressNodeLeft
                    setAddress={setAddress}
                    handleDelete={handleDelete}
                  />
                )}
                {!addressIsEmpty && (
                  <AddressNodeLeft
                    address={address}
                    isHidden={isHidden}
                    isInitial={isInitial}
                    handleHide={handleHide}
                    handleRestore={handleRestore}
                    handleDelete={handleDelete}
                  />
                )}
              </>
            }
            errorMessage={errorMessage}
          />
          <S.DesktopRightInput
            type={"number"}
            value={amount}
            readonly={isHidden}
            disabled={isHidden}
            onChange={handleChangeTokenInput}
            placeholder={"Amount of token"}
            nodeRight={
              <S.TokenContainer>
                {token && (
                  <S.TokenLabel isHidden={isHidden}>{token}</S.TokenLabel>
                )}
              </S.TokenContainer>
            }
          />
        </S.DektopInputContainer>
      )}
    </S.Root>
  )
}

export default ValidatorField
