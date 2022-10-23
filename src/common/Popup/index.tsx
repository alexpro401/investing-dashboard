import { Dispatch, FC, HTMLAttributes, SetStateAction } from "react"

import * as S from "./styled"
import { AnimatePresence } from "framer-motion"

interface Props extends HTMLAttributes<HTMLDivElement> {
  isShown: boolean
  setIsShown: Dispatch<SetStateAction<boolean>>
}

const Popup: FC<Props> = ({ isShown, setIsShown, children }) => {
  return (
    <AnimatePresence initial={false} exitBeforeEnter={true}>
      {isShown && (
        <S.Backdrop onClick={() => setIsShown(false)}>
          <S.ModalPane onClick={(e) => e.stopPropagation()}>
            {children}
          </S.ModalPane>
        </S.Backdrop>
      )}
    </AnimatePresence>
  )
}

export default Popup
