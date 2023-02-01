import { FC, HTMLAttributes, ReactNode, useRef, useState } from "react"
import { useClickAway } from "react-use"

import * as S from "./styled"

interface Props extends HTMLAttributes<HTMLDivElement> {
  headingNode: ReactNode
  position?: "left" | "right"
}

const Dropdown: FC<Props> = ({
  headingNode,
  children,
  position = "right",
  ...rest
}) => {
  const [isShown, setIsShown] = useState(false)

  const rootEl = useRef<HTMLDivElement>(null)

  useClickAway(rootEl, (event) => {
    event.stopPropagation()
    setIsShown(false)
  })

  return (
    <S.DropdownRoot ref={rootEl} {...rest}>
      <S.DropdownHeading onClick={() => setIsShown(!isShown)}>
        {headingNode}
      </S.DropdownHeading>
      <S.DropdownBody isOpen={isShown} position={position}>
        {children}
      </S.DropdownBody>
    </S.DropdownRoot>
  )
}

export default Dropdown
