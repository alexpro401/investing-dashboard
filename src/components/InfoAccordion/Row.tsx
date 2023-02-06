import { Icon, PNLIndicator } from "common"
import Tooltip from "components/Tooltip"
import { ICON_NAMES } from "consts"
import { dropdownVariants, rotate180Variants } from "motion/variants"
import { FC, useState } from "react"
import { Info } from "."
import * as S from "./styled"

interface Props {
  data: Info
  children?: React.ReactNode | null
}

const Row: FC<Props> = ({ data, children }) => {
  const { title, tooltip, value, pnl, rightNode } = data
  const hasChildren = !!children

  const [isOpened, setIsOpened] = useState(false)

  const handleBodyChange = () => {
    if (!hasChildren) return

    setIsOpened((prevState) => !prevState)
  }

  return (
    <S.Row>
      <S.Content>
        <S.Left>
          {tooltip && <Tooltip id={title}>{tooltip}</Tooltip>}
          <S.Title>{title}</S.Title>
        </S.Left>
        <S.Right onClick={handleBodyChange}>
          {!!rightNode && rightNode}
          <S.Value>{value}</S.Value>
          {pnl && <PNLIndicator type="brackets" pnl={pnl} fontSize={13} />}
          {hasChildren && (
            <S.AngleIconWrapper
              initial="hidden"
              variants={rotate180Variants}
              animate={isOpened ? "visible" : "hidden"}
            >
              <Icon name={ICON_NAMES.angleDown} />
            </S.AngleIconWrapper>
          )}
        </S.Right>
      </S.Content>
      {hasChildren && (
        <S.Body
          initial="hidden"
          variants={dropdownVariants}
          animate={isOpened ? "visible" : "hidden"}
        >
          {children}
        </S.Body>
      )}
    </S.Row>
  )
}

export default Row
