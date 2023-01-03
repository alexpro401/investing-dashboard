import React, { useEffect, useState, useCallback } from "react"
import { v4 as uuid } from "uuid"

import { RegularText, AppButton } from "common"
import { InputField } from "fields"
import { useBreakpoints, useFormValidation } from "hooks"
import theme from "theme"
import { ICON_NAMES } from "consts"
import { shortenAddress } from "utils"
import { readFromClipboard } from "utils/clipboard"
import { required, isAddressValidator } from "utils/validators"

import * as S from "./styled"

interface IAddressesModalProps {
  isOpen: boolean
  toggle: () => void
  onConfirm: (addresses: string[]) => void
  title: string
  description?: React.ReactNode
  initialAddresses?: string[] | undefined
}

const AddressesModal: React.FC<IAddressesModalProps> = ({
  isOpen,
  toggle,
  onConfirm,
  title,
  description,
  initialAddresses,
}) => {
  const { isMobile } = useBreakpoints()

  const [addresses, setAddresses] = useState<{ address: string; id: string }[]>(
    initialAddresses && initialAddresses.length !== 0
      ? initialAddresses.map((el) => ({ address: el, id: uuid() }))
      : [{ address: "", id: uuid() }]
  )

  const { getFieldErrorMessage, isFieldsValid, touchField, touchForm } =
    useFormValidation(
      { addresses: addresses.map((el) => el.address) },
      { addresses: { $every: { required, isAddressValidator } } }
    )

  const handleDeleteAddress = useCallback((id: string) => {
    setAddresses((addresses) => addresses.filter((el) => el.id !== id))
  }, [])

  const handleDeleteAddresses = useCallback(() => {
    setAddresses([])
  }, [])

  const handleAddAddress = useCallback(() => {
    setAddresses((addresses) => addresses.concat([{ address: "", id: uuid() }]))
  }, [])

  const handleChangeAddress = useCallback(
    async (id: string, index: number) => {
      try {
        const addressFromClipboard = await readFromClipboard()

        if (addressFromClipboard.length <= 42) {
          setAddresses((addresses) => {
            const newAddresses = [...addresses]
            const searchedElement = newAddresses.find((el) => el.id === id)

            if (searchedElement) {
              newAddresses[newAddresses.indexOf(searchedElement)] = {
                ...newAddresses[id],
                address: addressFromClipboard,
              }
            }

            return newAddresses
          })
          touchField(`addresses[${index}]`)
        }
      } catch (error) {
        console.log(error)
      }
    },
    [touchField]
  )

  useEffect(() => {
    setAddresses(
      initialAddresses && initialAddresses.length !== 0
        ? initialAddresses.map((el) => ({ address: el, id: uuid() }))
        : [{ address: "", id: uuid() }]
    )
  }, [initialAddresses])

  const handleConfirm = useCallback(() => {
    touchForm()

    if (isFieldsValid) {
      onConfirm(
        addresses.filter((el) => el.address !== "").map((el) => el.address)
      )
      toggle()
    }
  }, [addresses, onConfirm, touchForm, isFieldsValid, toggle])

  return (
    <S.ModalWrp
      isOpen={isOpen}
      title={title}
      toggle={toggle}
      maxWidth={!isMobile ? "500px" : undefined}
    >
      <S.Content>
        {description && <S.DescriptionWrp>{description}</S.DescriptionWrp>}
        <S.AddressesActions>
          <RegularText weight={700}>Addresses: {addresses.length}</RegularText>
          <S.AddressesDeleteButton
            style={{ color: theme.statusColors.error }}
            disabled={addresses.length === 0}
            text="Delete all"
            color="default"
            type="button"
            size="no-paddings"
            onClick={handleDeleteAddresses}
          />
        </S.AddressesActions>
        <S.AddressesList>
          {addresses.map(({ address, id }, index) => (
            <InputField
              key={id}
              value={""}
              readonly
              nodeLeft={
                address === "" ? (
                  <S.AddressPlaceholder>0x...</S.AddressPlaceholder>
                ) : (
                  <S.AddressValue>{shortenAddress(address)}</S.AddressValue>
                )
              }
              nodeRight={
                address === "" ? (
                  <AppButton
                    size={"no-paddings"}
                    color={"default"}
                    text={"Paste"}
                    onClick={() => handleChangeAddress(id, index)}
                  />
                ) : (
                  <S.TrashWrp onClick={() => handleDeleteAddress(id)}>
                    <S.TrashIcon name={ICON_NAMES.trash} />
                  </S.TrashWrp>
                )
              }
              errorMessage={getFieldErrorMessage(`addresses[${index}]`)}
            />
          ))}
        </S.AddressesList>
        <S.AddressAddButton
          text="+ Add address"
          color="default"
          type="button"
          size="no-paddings"
          onClick={handleAddAddress}
        />
        <S.ConfirmButton
          text={"Confirm"}
          type="button"
          full
          onClick={handleConfirm}
        />
      </S.Content>
    </S.ModalWrp>
  )
}

export default AddressesModal
