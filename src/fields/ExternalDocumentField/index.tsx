import {
  ChangeEvent,
  FC,
  HTMLAttributes,
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

interface Props extends HTMLAttributes<HTMLDivElement> {
  value: ExternalFileDocument
  setValue: (...params: any) => any
  label?: string
  placeholder?: string
  errorMessage?: string
}

const ExternalDocumentField: FC<Props> = ({
  value,
  setValue,
  label,
  placeholder,
  errorMessage,
  ...rest
}) => {
  const [isShowUrlOverlap, setIsShowUrlOverlap] = useState<boolean>(false)
  const [localUrl, setLocalUrl] = useState<string>("")

  const { name, url } = useMemo(() => value, [value])

  const handleNameInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const targetValue = e.currentTarget.value

      if (targetValue) {
        setValue({ name: targetValue, url })
      }
    },
    [setValue, url]
  )

  useEffect(() => {
    if (localUrl && isValidUrl(localUrl)) {
      if (url !== localUrl) {
        setValue({ name, url: localUrl })
      }
      setIsShowUrlOverlap(true)
    } else {
      setIsShowUrlOverlap(false)
    }
  }, [localUrl, name, setValue, url])

  return (
    <S.Root {...rest}>
      <S.TopInputField
        value={name}
        label={label}
        placeholder={placeholder}
        onInput={handleNameInput}
        nodeRight={
          isShowUrlOverlap ? (
            <AppButton
              type="button"
              color="default"
              size="no-paddings"
              iconRight={ICON_NAMES.trash}
            />
          ) : null
        }
        labelNodeRight={
          !!name && isShowUrlOverlap ? (
            <S.SuccessLabelIcon name={ICON_NAMES.greenCheck} />
          ) : null
        }
      />
      <S.BottomInputField>
        <OverlapInputField
          value={localUrl}
          setValue={setLocalUrl}
          overlapNodeLeft={
            isShowUrlOverlap ? (
              <ExternalLink href={url}>{name}</ExternalLink>
            ) : null
          }
          nodeRight={
            <AppButton
              type="button"
              color="default"
              size="no-paddings"
              text={isShowUrlOverlap ? "Change link" : "+ Paste Link"}
              onClick={async () =>
                isShowUrlOverlap
                  ? setLocalUrl("")
                  : setLocalUrl(await readFromClipboard())
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
