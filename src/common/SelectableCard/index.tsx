import { HTMLAttributes, ReactNode, useCallback, useMemo } from "react"

import * as S from "./styled"

interface Props<V> extends HTMLAttributes<HTMLDivElement> {
  nodeLeft?: ReactNode
  headNodeLeft?: ReactNode
  title: string
  headNodeRight?: ReactNode
  description?: ReactNode
  value: V
  valueToSet: V
  setValue: (v: V) => void
}

function SelectableCard<V>({
  nodeLeft,
  headNodeLeft,
  title,
  headNodeRight,
  description,
  value,
  valueToSet,
  setValue,
  children,
  ...rest
}: Props<V>) {
  const isActive = useMemo(() => valueToSet === value, [value, valueToSet])

  const handleClick = useCallback(() => {
    setValue(valueToSet)
  }, [setValue, valueToSet])

  return (
    <S.Root isActive={isActive} isNodeLeftExist={!!nodeLeft} {...rest}>
      {nodeLeft ? <S.NodeLeft>{nodeLeft}</S.NodeLeft> : <></>}
      <S.SelectableCardHead>
        <S.SelectableCardTitles
          nodeLeft={headNodeLeft}
          title={title}
          nodeRight={headNodeRight}
        />
        <S.SelectableCardDescription>{description}</S.SelectableCardDescription>
      </S.SelectableCardHead>
      {children ? (
        <S.SelectableCardBody>{children}</S.SelectableCardBody>
      ) : (
        <></>
      )}
      <S.SelectableCardButton onClick={handleClick} />
    </S.Root>
  )
}

export default SelectableCard
