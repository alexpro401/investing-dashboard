import theme, { Flex, To } from "theme"
import styled from "styled-components"
import { motion } from "framer-motion"
import { useMatch } from "react-router-dom"

export const MobileMenu = styled(motion.div)`
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  z-index: 100;
  background: #0e121b;
  border-radius: 8px 8px 0 0;

  padding: 15px 14px 12px 14px;

  @media all and (display-mode: standalone) {
    height: 70px;
    padding: 5px 14px 25px 14px;
  }

  @media (min-width: 768px) {
    flex-direction: column;
    justify-content: flex-start;
    width: 100px;
    padding: 0;
  }
`

const MobileItem = styled(motion.div)`
  width: 55px;
  height: 49px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media (min-width: 768px) {
    width: 100px;
    height: 100px;
  }
`

const MobileIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
`

export const LogoWrapper = styled(Flex)`
  width: 100px;
  height: 100px;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`

const MobileLabel = styled.div<{ active: boolean }>`
  margin-bottom: 3px;

  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-family: ${(props) => props.theme.appFontFamily};
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  text-align: center;
  letter-spacing: 0.16px;

  color: ${(props) => (props.active ? "#9AE2CB" : theme.textColors.secondary)};
`

const Wrapper = styled.div`
  &:nth-child(4) {
    ${MobileIcon} {
      transform: translateY(2px);
    }
  }
`

interface Props {
  text: string
  path: string
  onClick?: () => void
  Icon: any
}
export const NavItem: React.FC<Props> = ({
  text,
  path,
  Icon,
  onClick = () => {},
}) => {
  const match = useMatch({
    path,
    end: true,
  })

  if (!path) {
    return (
      <Wrapper>
        <MobileItem onClick={onClick}>
          <MobileIcon>
            <Icon active={!!match} />
          </MobileIcon>
          <MobileLabel active={!!match}>{text}</MobileLabel>
        </MobileItem>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <To to={path}>
        <MobileItem>
          <MobileIcon>
            <Icon active={!!match} />
          </MobileIcon>
          <MobileLabel active={!!match}>{text}</MobileLabel>
        </MobileItem>
      </To>
    </Wrapper>
  )
}

export default {}
