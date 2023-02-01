import * as React from "react"
import * as S from "./styled"
import { accordionSummaryVariants } from "motion/variants"

interface IAction {
  label: string
  active?: boolean
  onClick: (e: React.MouseEvent<HTMLElement>) => void
}

interface IActionsProps {
  actions: IAction[]
  visible: boolean
}

const CardActions: React.FC<IActionsProps> = ({
  actions,
  visible,
  ...rest
}) => {
  if (!actions.length) return null

  return (
    <S.Root
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      variants={accordionSummaryVariants}
      {...rest}
    >
      <S.CardActionsWrp>
        {actions.map((a, i) => (
          <S.CardAction key={i} active={a.active} onClick={a.onClick}>
            {a.label}
          </S.CardAction>
        ))}
      </S.CardActionsWrp>
    </S.Root>
  )
}
export default CardActions
