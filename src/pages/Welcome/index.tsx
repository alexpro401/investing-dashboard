import { useState, useEffect, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Flex } from "theme"
import { useWeb3React } from "@web3-react/core"
import { CubeSpinner } from "react-spinners-kit"
import { useConnectWalletContext } from "context/ConnectWalletContext"
import { AppButton } from "common"
import ConnectWallet from "modals/ConnectWallet"
import { getRedirectedPoolAddress } from "utils"
import { useSelector } from "react-redux"
import { selectOwnedPools } from "state/user/selectors"

import logo from "assets/icons/logo-big.svg"
import facebook from "assets/icons/facebook.svg"
import twitter from "assets/icons/twitter.svg"
import telegram from "assets/icons/telegram.svg"
import linkedin from "assets/icons/linkedin.svg"
import medium from "assets/icons/medium.svg"
import arrowOutlineRight from "assets/icons/arrow-outline-right.svg"
import {
  Container,
  Center,
  LoadingText,
  Logo,
  Content,
  Buttons,
  Title,
  Description,
  Socials,
  SocialLink,
  SocialIcon,
  LoginContainer,
  ArrowOutlineRight,
} from "./styled"

enum LoginPathMapper {
  trader = "/me/trader/profile",
  investor = "/me/investor",
  wallet = "/wallet",
}

interface routerStateType {
  from: { pathname: string }
}

const Welcome: React.FC = () => {
  const [isLoading, setLoading] = useState(true)
  const [loginPath, setLoginPath] = useState<LoginPathMapper | string | null>(
    null
  )
  const { toggleConnectWallet, isWalletOpen } = useConnectWalletContext()
  const navigate = useNavigate()
  const { account } = useWeb3React()
  const ownedPools = useSelector(selectOwnedPools)
  const redirectPath = getRedirectedPoolAddress(ownedPools)
  const location = useLocation()
  const state = location.state as routerStateType

  const getTraderPath = useCallback(() => {
    if (!redirectPath) return LoginPathMapper.investor
    return `${LoginPathMapper.trader}/${redirectPath[0]}/${redirectPath[1]}`
  }, [redirectPath])

  useEffect(() => {
    if (!account) return

    const path = state?.from.pathname ?? "/"

    navigate(path, { replace: true })
  }, [account, navigate, state])

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setLoading(false)
      clearTimeout(loadingTimeout)
    }, 1500)

    return () => {
      clearTimeout(loadingTimeout)
    }
  }, [])

  const handleConnect = () => {
    if (loginPath === LoginPathMapper.wallet && !!state.from.pathname) {
      navigate(state.from.pathname, { replace: true })
    }

    navigate(loginPath ?? "/", { replace: true })
  }

  return (
    <>
      <Container
        initial={{ y: -5 }}
        animate={{ y: 0 }}
        exit={{ y: -5 }}
        transition={{ duration: 0.1, ease: [0.29, 0.98, 0.29, 1] }}
      >
        {isLoading ? (
          <Center>
            <CubeSpinner size={45} loading />
            <LoadingText>Reading blocchain data, please wait</LoadingText>
          </Center>
        ) : (
          <>
            <Flex full>
              <Logo src={logo} />
            </Flex>
            <Content>
              <Title>
                Investment <br /> social trading <br /> platform of the <br />{" "}
                new generation
              </Title>
              <Description>
                Start investing, create funds and trading at decentralized
                crypto platform
              </Description>
              <Socials>
                <SocialLink
                  href="https://t.me/Dexe_network"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SocialIcon src={telegram} />
                </SocialLink>
                <SocialLink
                  href="https://twitter.com/DexeNetwork"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SocialIcon src={twitter} />
                </SocialLink>
                <SocialLink
                  href="https://www.facebook.com/dexe.network/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SocialIcon src={facebook} />
                </SocialLink>
                <SocialLink
                  href="https://www.linkedin.com/company/dexe-network/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SocialIcon src={linkedin} />
                </SocialLink>
                <SocialLink
                  href="https://dexenetwork.medium.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SocialIcon src={medium} />
                </SocialLink>
              </Socials>
            </Content>
            <Buttons>
              <AppButton
                full
                size="large"
                text="Become a trader"
                onClick={() => {
                  toggleConnectWallet(true)
                  setLoginPath(getTraderPath())
                }}
              />
              <AppButton
                full
                size="large"
                color="secondary"
                text="Investing"
                onClick={() => {
                  toggleConnectWallet(true)
                  setLoginPath(LoginPathMapper.investor)
                }}
              />
            </Buttons>
            <LoginContainer
              onClick={() => {
                toggleConnectWallet(true)
                setLoginPath(LoginPathMapper.wallet)
              }}
            >
              <Flex>
                I already have account{" "}
                <ArrowOutlineRight src={arrowOutlineRight} />
              </Flex>
            </LoginContainer>
          </>
        )}
      </Container>
      <ConnectWallet
        isOpen={isWalletOpen}
        onRequestClose={() => {
          toggleConnectWallet(false)
          setLoginPath(null)
        }}
        onConnect={handleConnect}
      />
    </>
  )
}

export default Welcome
