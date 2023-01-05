import { Icon } from "common"
import Checkbox from "components/Checkbox"
import { ICON_NAMES } from "consts/icon-names"
import { FC, ReactNode } from "react"
import { Flex } from "theme"

import * as S from "./styled"

interface Props {
  title: string
  children?: ReactNode
  isChecked: boolean
  onChange: (isChecked: boolean) => void
}

const WarnCard: FC<Props> = (props) => {
  const { title, children, isChecked, onChange } = props

  return (
    <S.Card>
      <S.Head>
        <Icon name={ICON_NAMES.warnCircled} />
        {title}
      </S.Head>
      <S.Inner>{children}</S.Inner>
      <Checkbox
        name="check-warning"
        checked={isChecked}
        onChange={onChange}
        label={
          <Flex p="0 0 0 8px">
            <S.Text>I understand</S.Text>
          </Flex>
        }
      />
    </S.Card>
  )
}

export default WarnCard
