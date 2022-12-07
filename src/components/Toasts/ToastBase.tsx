import { FC, ReactNode, useState } from "react"

import theme, { Flex, Text } from "theme"
import { Container, Body, Content, Close } from "./styled"
import { Icon } from "common"
import IconButton from "components/IconButton"

import { ToastType } from "./types"

import close from "assets/icons/close-gray.svg"
import { ICON_NAMES } from "constants/icon-names"

const iconMapper = {
  [ToastType.Waiting]: (
    <Icon name={ICON_NAMES.clockCircle} color={theme.statusColors.info} />
  ),
  [ToastType.Success]: <Icon name={ICON_NAMES.successCircle} />,
  [ToastType.Warning]: (
    <Icon name={ICON_NAMES.warnCircled} color={theme.statusColors.error} />
  ),
}
const titleMapper = {
  [ToastType.Waiting]: (
    <Text fz={15} fw={700} color={theme.statusColors.info}>
      Waiting
    </Text>
  ),
  [ToastType.Success]: (
    <Text fz={15} fw={700} color={theme.statusColors.success}>
      Successful
    </Text>
  ),
  [ToastType.Warning]: (
    <Text fz={15} fw={700} color={theme.statusColors.error}>
      Failed
    </Text>
  ),
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
        <Body>
          <Flex full jc={"space-between"} ai={"flex-start"}>
            <Flex ai={"center"} jc={"flex-start"} gap={"8"}>
              {type && iconMapper[type]}
              {type && titleMapper[type]}
            </Flex>

            <Close>
              <IconButton
                onClick={onClose}
                media={close}
                size={16}
                aria-label="close"
              />
            </Close>
          </Flex>
          <Content>{children}</Content>
        </Body>
      </Container>
    </>
  )
}

export default ToastBase
