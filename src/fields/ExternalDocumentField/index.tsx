import {
  ChangeEvent,
  FC,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import ExternalLink from "components/ExternalLink"
import { OverlapInputField } from "fields"
import { AppButton } from "common"

import * as S from "./styled"

import { ExternalFileDocument } from "context/FundDaoCreatingContext"
import { ICON_NAMES } from "constants/icon-names"
import { isValidUrl } from "utils"
import { readFromClipboard } from "utils/clipboard"
import { isEqual } from "lodash"

interface Props extends HTMLAttributes<HTMLDivElement> {
  value: ExternalFileDocument
  setValue: (...params: any) => any
  topFieldNodeRight?: ReactNode
  label?: string
  labelNodeRight?: ReactNode
  placeholder?: string
  errorMessage?: string
}

const ExternalDocumentField: FC<Props> = ({
  value,
  setValue,
  topFieldNodeRight,
  label,
  labelNodeRight,
  placeholder,
  errorMessage,
  ...rest
}) => {
  const [isShowUrlOverlap, setIsShowUrlOverlap] = useState<boolean>(false)

  const { name, url } = useMemo(() => value, [value])

  const croppedLink = useMemo(() => {
    return !!url ? `${url.slice(0, 4)}...${url.slice(-4)}` : ""
  }, [url])

  const handleNameInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const targetValue = e.currentTarget.value

      setValue({ name: targetValue, url })
    },
    [setValue, url]
  )

  const handleUrlInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const targetValue = e.currentTarget.value

      setValue({ name, url: targetValue })
    },
    [name, setValue]
  )

  const handlePasteLink = useCallback(async () => {
    setValue({ name, url: await readFromClipboard() })
  }, [name, setValue])

  const handleChangeLink = useCallback(() => {
    setValue({ name, url: "" })
  }, [name, setValue])

  useEffect(() => {
    if (url && isValidUrl(url)) {
      setIsShowUrlOverlap(true)
    } else {
      setIsShowUrlOverlap(false)
    }
  }, [url])

  return (
    <S.Root {...rest}>
      <S.TopInputField
        value={name}
        label={label}
        placeholder={placeholder}
        onInput={handleNameInput}
        nodeRight={topFieldNodeRight}
        labelNodeRight={
          labelNodeRight ||
          (!!name && isShowUrlOverlap && (
            <S.SuccessLabelIcon name={ICON_NAMES.greenCheck} />
          )) ||
          null
        }
      />
      <S.BottomInputField>
        <OverlapInputField
          value={url}
          onInput={handleUrlInput}
          overlapNodeLeft={
            isShowUrlOverlap ? (
              <ExternalLink href={url}>{croppedLink}</ExternalLink>
            ) : null
          }
          nodeRight={
            <AppButton
              type="button"
              color="default"
              size="no-paddings"
              text={isShowUrlOverlap ? "Change link" : "+ Paste Link"}
              onClick={async () =>
                isShowUrlOverlap ? handleChangeLink() : handlePasteLink()
              }
            />
          }
          errorMessage={errorMessage}
        />
      </S.BottomInputField>
    </S.Root>
  )
}

export default ExternalDocumentField
