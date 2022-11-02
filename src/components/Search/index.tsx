import React, { useState, useRef } from "react"
import { Icon } from "common"
import { ICON_NAMES } from "constants/icon-names"
import * as S from "./styled"

interface Props {
  height: string
  placeholder: string
  value: string
  handleChange: (v: string) => void
}

const Search: React.FC<Props> = ({
  height,
  placeholder,
  handleChange,
  value,
}) => {
  const ref = useRef<HTMLInputElement>(null)
  const [isFocused, setFocused] = useState(false)
  return (
    <S.Container height={height} focused={isFocused}>
      <S.IconWrapper
        onClick={() => ref.current && ref.current?.focus && ref.current.focus()}
      >
        <Icon name={ICON_NAMES.search} />
      </S.IconWrapper>
      <S.Input
        spellCheck={false}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        value={value}
        ref={ref}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
      />

      {!!value && (
        <S.IconWrapper onClick={() => handleChange("")}>
          <Icon name={ICON_NAMES.clear} />
        </S.IconWrapper>
      )}
    </S.Container>
  )
}

export default Search
