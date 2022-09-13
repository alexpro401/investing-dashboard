import { FC, ReactNode, useState } from "react"

import { Flex } from "theme"
import { Container, Body, Content, Icon, Close } from "./styled"
import IconButton from "components/IconButton"

import { ToastType } from "./types"

import close from "assets/icons/close-gray.svg"
import success from "assets/icons/alert-check.svg"
import waiting from "assets/icons/alert-clock.svg"
import warning from "assets/icons/alert-warning.svg"

const iconMapper = {
  [ToastType.Waiting]: <Icon src={waiting} />,
  [ToastType.Success]: <Icon src={success} />,
  [ToastType.Warning]: <Icon src={warning} />,
}

interface IProps {
  type: string
  children: ReactNode
  onClose: () => void
  visible: boolean
}

const ToastBase: FC<IProps> = ({
  type,
  children,
  onClose = () => {},
  visible,
}) => {
  const [visibleX, setVisibleX] = useState(0)

  const handleDragEnd = (e, info) => {
    if (info.point.y > 75) {
      setVisibleX(window.innerWidth)
      onClose()
    }
  }

  return (
    <>
      <Container
        drag="x"
        dragConstraints={{ left: 0, right: 5, top: 0, bottom: 0 }}
        onDragEnd={handleDragEnd}
        animate={visible ? "visible" : "hidden"}
        initial="hidden"
        variants={{
          visible: {
            x: visibleX,
          },
          hidden: {
            x: window.innerWidth,
          },
        }}
      >
        <Close>
          <IconButton
            onClick={onClose}
            media={close}
            size={16}
            aria-label="close"
          />
        </Close>
        <Body>
          <Flex m="0 7px 0 0">{type && iconMapper[type]}</Flex>
          <Content>{children}</Content>
        </Body>
      </Container>
    </>
  )
}

export default ToastBase
