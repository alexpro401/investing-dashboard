import { createPortal } from "react-dom"
import { Flex } from "theme"

import { useAlertContext, AlertType } from "context/AlertContext"

import IconButton from "components/IconButton"
import { Container, Body, Header, Icon, Title, Content, Close } from "./styled"

import close from "assets/icons/close-gray.svg"
import info from "assets/icons/alert-info.svg"
import warning from "assets/icons/alert-warning.svg"

const alertRoot = document.getElementById("alert")

const iconMapper = {
  [AlertType.info]: <Icon src={info} />,
  [AlertType.warning]: <Icon src={warning} />,
}

const Alert: React.FC = () => {
  const { isOpen, type, title, content, hideAlert } = useAlertContext()

  const showHeader = type === AlertType.info && title !== null

  if (!alertRoot) return null
  return createPortal(
    <>
      <Container
        animate={isOpen ? "visible" : "hidden"}
        initial="hidden"
        variants={{
          visible: {
            opacity: 1,
            pointerEvents: "auto",
          },
          hidden: {
            opacity: 0,
            pointerEvents: "none",
          },
        }}
        transition={{ duration: 0.25 }}
        onClick={hideAlert}
      >
        <Body
          variants={{
            visible: {
              x: 0,
            },
            hidden: {
              x: "-100vw",
            },
          }}
          transition={{ duration: 0.5 }}
          withHeader={showHeader}
          onClick={(e) => e.stopPropagation()}
        >
          <Close>
            <IconButton onClick={hideAlert} media={close} size={16} />
          </Close>
          {showHeader && (
            <Header>
              <Flex m="0 7px 0 0">{type && iconMapper[type]}</Flex>
              <Title>{title}</Title>
            </Header>
          )}
          <Flex>
            {type === AlertType.warning && (
              <Flex m="0 7px 0 0">{type && iconMapper[type]}</Flex>
            )}
            <Content>{content}</Content>
          </Flex>
        </Body>
      </Container>
    </>,
    alertRoot
  )
}

export default Alert
