import {
  Dispatch,
  HTMLAttributes,
  ReactNode,
  SetStateAction,
  useCallback,
  useMemo,
} from "react"
import { CardDescription, CardHead } from "common"

import * as S from "./styled"
import { SelectableCardDescription } from "./styled"

interface Props<V> extends HTMLAttributes<HTMLDivElement> {
  nodeLeft?: ReactNode
  headNodeLeft?: ReactNode
  title: string
  headNodeRight?: ReactNode
  description?: ReactNode
  value: V
  valueToSet: V
  setValue: Dispatch<SetStateAction<V>>
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