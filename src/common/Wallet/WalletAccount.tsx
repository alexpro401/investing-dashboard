import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { useWeb3React } from "@web3-react/core"
import { EHeaderTitles } from "components/Header"
import Header from "components/Header/Layout"

import { useCopyClipboard } from "hooks"

import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"

import { shortenAddress } from "utils"

import { useAddToast } from "state/application/hooks"

import bsc from "assets/wallets/bsc.svg"

import { ICON_NAMES, ROUTE_PATHS } from "consts"

import * as S from "./styled"

export default function WalletAccount() {
  const { account, chainId, deactivate } = useWeb3React()

  const [isCopied, copy] = useCopyClipboard()
  const addToast = useAddToast()

  const [txHistoryOpen, setTxHistoryOpen] = useState<boolean>(false)

  const handleLogout = () => {
    deactivate()
    localStorage.removeItem("dexe.network/investing/web3-auth-method")
  }

  const handleAddressCopy = () => {
    if (!account) return
    copy(account)
  }

  useEffect(() => {
    if (isCopied && account) {
      addToast(
        { type: "success", content: "Address copied to clipboard" },
        account,
        2000
      )
    }
  }, [isCopied, addToast, account])

  if (!account) return <Navigate to={ROUTE_PATHS.welcome} />

  return (
    <>
      <S.Container
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.5, ease: [0.29, 0.98, 0.29, 1] }}
      >
        <S.ContainerInner>
          <S.Title>Account</S.Title>
          <S.AccountBadgeWrp>
            {chainId ? (
              <S.AddressWrp>
                <S.NetworkIcon src={bsc} />
                <S.Address
                  href={getExplorerLink(
                    chainId,
                    account,
                    ExplorerDataType.ADDRESS
                  )}
                >
                  {shortenAddress(account, 2)}
                </S.Address>
              </S.AddressWrp>
            ) : (
              <></>
            )}
            <S.TextButton onClick={handleAddressCopy}>
              <S.TextIcon name={ICON_NAMES.copy} />
            </S.TextButton>
            <S.TextButton onClick={handleLogout}>
              <span>Log out</span>
              <S.TextIcon name={ICON_NAMES.logout} />
            </S.TextButton>
          </S.AccountBadgeWrp>

          <S.TransactionHistoryWrp
            open={txHistoryOpen}
            setOpen={setTxHistoryOpen}
          />
        </S.ContainerInner>
      </S.Container>
    </>
  )
}
