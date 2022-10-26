import { InputField, InputFieldProps } from "fields"

import * as S from "./styled"
import { ICON_NAMES } from "constants/icon-names"
import { SUPPORTED_SOCIALS } from "constants/socials"
import { useCallback, useMemo, useState } from "react"
import { Collapse } from "common"
import { useEffectOnce } from "react-use"

interface Props<V extends string | number> extends InputFieldProps<V> {
  socialType: SUPPORTED_SOCIALS
  onShowInput?: () => void
  onHideInput?: () => void
}

function SocialLinkField<V extends string | number>({
  socialType,
  value,
  setValue,
  label,
  placeholder,
  labelNodeRight,
  errorMessage,
  onBlur,
  onShowInput,
  onHideInput,
}: Props<V>) {
  const [isShowInput, setIsShowInput] = useState(false)

  const iconName = useMemo(() => {
    const iconNamesMap = {
      facebook: ICON_NAMES.facebook,
      linkedin: ICON_NAMES.linkedin,
      medium: ICON_NAMES.medium,
      telegram: ICON_NAMES.telegram,
      twitter: ICON_NAMES.twitter,
      github: ICON_NAMES.github,
      other: "",
    }
    return iconNamesMap[socialType] as ICON_NAMES
  }, [socialType])

  const handleInputBtnClick = useCallback(() => {
    if (isShowInput) {
      if (setValue) {
        setValue("" as V)
      }
      setIsShowInput(false)
      if (onHideInput) {
        onHideInput()
      }
    } else {
      setIsShowInput(true)
      if (onShowInput) {
        onShowInput()
      }
    }
  }, [isShowInput, onShowInput, setValue])

  useEffectOnce(() => {
    setIsShowInput(!!value)
  })

  const handleInput = useCallback(
    (e) => {
      if (setValue) {
        setValue(e.currentTarget.value)
      }
    },
    [setValue]
  )

  return (
    <S.Root isGap={!!value || isShowInput}>
      <S.InputBtn
        iconLeft={iconName}
        text={`Paste ${socialType}`}
        onClick={handleInputBtnClick}
      />
      <Collapse isOpen={!!value || isShowInput}>
        <InputField
          value={value}
          label={label}
          labelNodeRight={labelNodeRight}
          placeholder={placeholder}
          onInput={handleInput}
          nodeLeft={iconName ? <S.InputIcon name={iconName} /> : null}
          nodeRight={
            value ? <S.RemoveBtn onClick={handleInputBtnClick} /> : null
          }
          errorMessage={errorMessage}
          onBlur={onBlur}
        />
      </Collapse>
    </S.Root>
  )
}

export default SocialLinkField
