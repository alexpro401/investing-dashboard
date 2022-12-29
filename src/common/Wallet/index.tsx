import WalletInsurance from "./WalletInsurance"
import WalletAccount from "./WalletAccount"

import { useCallback, useMemo, useRef, useState } from "react"
import * as S from "./styled"
import { ICON_NAMES } from "consts"
import { AnimatePresence } from "framer-motion"
import { useClickAway } from "react-use"

type WalletType = "account" | "insurance" | ""

export default function Wallet() {
  const rootEl = useRef<HTMLDivElement>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const [walletType, setWalletType] = useState<WalletType>("")

  useClickAway(rootEl, (event) => {
    event.stopPropagation()
    setIsDropdownOpen(false)
    setWalletType("")
  })

  const DropdownContent = useMemo(() => {
    return {
      account: <WalletAccount />,
      insurance: <WalletInsurance />,
    }[walletType]
  }, [walletType])

  const handleTogglerClick = useCallback(
    (type: WalletType) => {
      if (type === walletType) {
        setIsDropdownOpen(false)
        setWalletType("")

        return
      }

      setWalletType(type)
      setIsDropdownOpen(true)
    },
    [walletType]
  )

  return (
    <S.TogglersWrp ref={rootEl}>
      <S.TogglerBtn
        onClick={() => handleTogglerClick("insurance")}
        isActive={walletType === "insurance"}
      >
        <S.TogglerBtnIcon name={ICON_NAMES.insurance} />
        <S.TogglerBtnIconIndicator
          name={ICON_NAMES.angleDown}
          isActive={walletType === "insurance"}
        />
      </S.TogglerBtn>
      <S.TogglerBtn
        onClick={() => handleTogglerClick("account")}
        isActive={walletType === "account"}
      >
        <S.TogglerBtnIcon name={ICON_NAMES.bsc} />
        <S.TogglerBtnIconIndicator
          name={ICON_NAMES.angleDown}
          isActive={walletType === "account"}
        />
      </S.TogglerBtn>
      {isDropdownOpen ? (
        <S.Backdrop
          onClick={() => {
            setIsDropdownOpen(false)
            setWalletType("")
          }}
        />
      ) : (
        <></>
      )}
      <AnimatePresence>
        {isDropdownOpen && (
          <S.DropdownContentWrp>{DropdownContent}</S.DropdownContentWrp>
        )}
      </AnimatePresence>
    </S.TogglersWrp>
  )
}
