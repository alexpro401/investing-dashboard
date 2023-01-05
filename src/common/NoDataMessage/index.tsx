import { FC, HTMLAttributes } from "react"
import * as S from "./styled"
import { ICON_NAMES } from "consts/icon-names"

interface Props extends HTMLAttributes<HTMLDivElement> {
  message?: string
}

const NoDataMessage: FC<Props> = ({
  message = "There's no data, yet",
  ...rest
}) => {
  return (
    <S.Root {...rest}>
      {/* <S.NoDataIcon name={ICON_NAMES.clear} /> */}
      <S.NoDataTitle>{message}</S.NoDataTitle>
    </S.Root>
  )
}

export default NoDataMessage
