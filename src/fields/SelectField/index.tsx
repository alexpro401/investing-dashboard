import React, { useCallback, useState, useRef, useMemo } from "react"
import { useClickAway, useDebounce } from "react-use"

import { Collapse } from "common"
import { OverlapInputField } from "fields"
import { ICON_NAMES } from "consts/icon-names"

import * as S from "./styled"

interface ISelectFieldProps<T> extends React.HTMLAttributes<HTMLInputElement> {
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  errorMessage?: string
  selected?: T
  setSelected: (item: T | null) => void
  list: T[]
  searchingFields?: (keyof T)[]
  renderSelected: (item: T) => React.ReactNode
  renderItem: (item: T) => React.ReactNode
}

function SelectField<T>({
  placeholder = " ",
  disabled = false,
  readonly = false,
  errorMessage,
  selected,
  setSelected,
  list,
  searchingFields = [],
  renderSelected,
  renderItem,
  ...rest
}: ISelectFieldProps<T>) {
  const inputFieldRef = useRef<HTMLDivElement | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const [isOpened, setIsOpened] = useState<boolean>(false)
  const [innerList, setInnerList] = useState<T[]>(list)
  const [searchingValue, setSearchingValue] = useState<string>("")

  const searchingIsActive = useMemo(
    () => searchingFields.length !== 0,
    [searchingFields]
  )

  const [] = useDebounce(
    () => {
      if (!searchingValue || !searchingIsActive) {
        setInnerList(list)
        return
      }

      const newList = list.filter((item) =>
        searchingFields
          .map((searchingField) =>
            (item[searchingField] as string).toString().toLowerCase()
          )
          .reduce((acc, val) => {
            if (val.includes(searchingValue.toLowerCase())) {
              return true
            } else return acc
          }, false)
      )
      setInnerList(newList)
    },
    200,
    [searchingValue, searchingFields, searchingIsActive, list]
  )

  const handleOpenList = useCallback(() => {
    setIsOpened(true)
  }, [])

  const handleCloseList = useCallback(() => {
    setIsOpened(false)
  }, [])

  const handleSelectItem = useCallback(
    (item: T) => {
      handleCloseList()
      setSelected(item)
    },
    [handleCloseList, setSelected]
  )

  const handleRemoveSelectedItem = useCallback(() => {
    setIsOpened(true)
    setSelected(null)
  }, [setSelected])

  useClickAway(listRef, (event) => {
    if (!isOpened) return

    if (
      !inputFieldRef ||
      !inputFieldRef.current ||
      inputFieldRef.current.contains(event.target as HTMLElement)
    )
      return

    handleCloseList()
  })

  return (
    <S.Root {...rest}>
      <OverlapInputField
        readonly={!searchingIsActive || readonly}
        disabled={disabled}
        label={selected ? "" : placeholder}
        placeholder={selected ? "" : placeholder}
        value={searchingIsActive && !selected ? searchingValue : ""}
        setValue={searchingIsActive ? setSearchingValue : () => {}}
        onClick={handleOpenList}
        overlapNodeLeft={
          selected ? (
            renderSelected(selected)
          ) : searchingIsActive ? (
            <S.SearchingValue>{searchingValue}</S.SearchingValue>
          ) : null
        }
        labelNodeRight={
          selected ? <S.SuccessLabelIcon name={ICON_NAMES.greenCheck} /> : <></>
        }
        overlapNodeRight={
          <S.NodeRightContainer>
            {selected && (
              <S.NodeRightIcon
                name={ICON_NAMES.close}
                onClick={handleRemoveSelectedItem}
              />
            )}
            {!selected && !isOpened && (
              <S.NodeRightIcon name={ICON_NAMES.angleDown} />
            )}
            {!selected && isOpened && (
              <S.NodeRightIcon name={ICON_NAMES.angleUp} />
            )}
          </S.NodeRightContainer>
        }
        cRef={inputFieldRef}
      />

      <S.ListCollapse isOpen={isOpened} cRef={listRef}>
        {isOpened &&
          innerList.map((item, index) => (
            <S.ListItem key={index} onClick={() => handleSelectItem(item)}>
              {renderItem(item)}
            </S.ListItem>
          ))}
      </S.ListCollapse>

      <Collapse isOpen={!!errorMessage} duration={0.3}>
        <S.ErrorMessage>{errorMessage}</S.ErrorMessage>
      </Collapse>
    </S.Root>
  )
}

export default SelectField
