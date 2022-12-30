import WalletInsurance from "./WalletInsurance"
import WalletAccount from "./WalletAccount"

import { useCallback, useMemo, useRef, useState } from "react"
import * as S from "./styled"
import { ICON_NAMES } from "consts"
import { AnimatePresence } from "framer-motion"
import { useClickAway } from "react-use"
import { useActiveWeb3React, useInsuranceAmount } from "hooks"
import { formatFiatNumber, shortenAddress } from "utils"
import { formatEther } from "@ethersproject/units"
import { MediumText } from "common/Typography"

type WalletType = "account" | "insurance" | ""

export default function Wallet() {
  const { account } = useActiveWeb3React()
  const rootEl = useRef<HTMLDivElement>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [{ insuranceAmount }] = useInsuranceAmount(account)

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
        <S.TogglerBtnIcon name={ICON_NAMES.dexeTokenIcon} />
        <MediumText weight={600} size="14px">
          {!insuranceAmount.isZero()
            ? formatFiatNumber(formatEther(insuranceAmount), 0)
            : "Insurance"}
        </MediumText>
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
        <S.TogglerBtnAccount>{shortenAddress(account, 3)}</S.TogglerBtnAccount>
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
