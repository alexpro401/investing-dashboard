import { useState } from "react"
import { createPortal } from "react-dom"
import { useWeb3React } from "@web3-react/core"
import { connectorsByName, ROUTE_PATHS } from "consts"
import { WalletConnectConnector } from "@web3-react/walletconnect-connector"
import { RotateSpinner } from "react-spinners-kit"

import metamask from "assets/wallets/metamask.svg"
import walletconnect from "assets/wallets/walletconnect.svg"
import closeIcon from "assets/icons/modal-close.svg"

import { activateInjectedProvider } from "utils/activateInjectedProvider"

import * as S from "./styled"

const modalRoot = document.getElementById("modal")

export default function ConnectWallet({ isOpen, onRequestClose, onConnect }) {
  const [isActivating, setActivating] = useState("")
  const { activate, connector } = useWeb3React()

  const activateProvider = (name) => {
    setActivating(name)
    const provider = connectorsByName[name]

    if (provider === connector) {
      setActivating("")
      return
    }

    if (
      provider instanceof WalletConnectConnector &&
      provider.walletConnectProvider?.wc?.uri
    ) {
      provider.walletConnectProvider = undefined
    }

    if (name === "injected") {
      activateInjectedProvider("MetaMask")
    }

    if (provider) {
      localStorage.setItem("dexe.network/investing/web3-auth-method", name)

      setTimeout(() => {
        activate(provider, undefined, true)
          .then(() => {
            setActivating("")
            onRequestClose()
            onConnect()
          })
          .catch((e) => {
            if (e) {
              console.log(e)
              setTimeout(() => {
                activate(provider)
                setActivating("")
                onRequestClose()
                onConnect()
              }, 500)
            }
          })
      }, 500)
    }
  }

  if (!modalRoot) return null
  return createPortal(
    <>
      <S.Overlay
        onClick={onRequestClose}
        animate={isOpen ? "visible" : "hidden"}
        initial="hidden"
        variants={{
          visible: {
            opacity: 0.4,
            display: "block",
          },
          hidden: {
            opacity: 0,
            transitionEnd: { display: "none" },
          },
        }}
      />
      <S.Container
        animate={isOpen ? "visible" : "hidden"}
        initial="hidden"
        variants={{
          visible: {
            opacity: 1,
            display: "block",
          },
          hidden: {
            opacity: 0,
            transitionEnd: { display: "none" },
          },
        }}
      >
        <S.Head>
          <S.Title>Connect wallet</S.Title>
          <S.Close onClick={onRequestClose} src={closeIcon} />
        </S.Head>
        <S.Body>
          <S.PrivacyText>
            By connecting the wallet I accept
            <S.LinkText to={ROUTE_PATHS.serviceTerms}>
              {" "}
              Terms of Service{" "}
            </S.LinkText>
            and
            <S.LinkText to={ROUTE_PATHS.privacyPolicy}>
              {" "}
              Privacy Policy{" "}
            </S.LinkText>
            DeXe Network
          </S.PrivacyText>

          <S.Wallets full>
            <S.Wallet onClick={() => activateProvider("walletconnect")}>
              {isActivating === "walletconnect" ? (
                <RotateSpinner size={33} loading />
              ) : (
                <S.WalletIcon src={walletconnect} alt="walletconnect" />
              )}
              <S.WalletTitle>Wallet Connect</S.WalletTitle>
            </S.Wallet>
            <S.Wallet onClick={() => activateProvider("injected")}>
              {isActivating === "injected" ? (
                <RotateSpinner size={33} loading />
              ) : (
                <S.WalletIcon src={metamask} alt="metamask" />
              )}
              <S.WalletTitle>Metamask</S.WalletTitle>
            </S.Wallet>
          </S.Wallets>
        </S.Body>
      </S.Container>
    </>,
    modalRoot
  )
}
