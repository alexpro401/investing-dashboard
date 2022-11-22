import { ReactNode } from "react"
import { AppButton } from "common"

import { BigNumberInput } from "big-number-input"

import Avatar from "components/Avatar"

import angleIcon from "assets/icons/angle-down.svg"
import { useUserMetadata } from "state/ipfsMetadata/hooks"
import { cutDecimalPlaces, isAddress, shortenAddress } from "utils"

import * as S from "./styled"

interface Props {
  nodeLeft: ReactNode
  nodeRight: ReactNode
  amount: string
  address?: string
  onChange?: (value: string) => void
}

const WalletInput: React.FC<Props> = ({
  amount,
  address,
  nodeLeft,
  nodeRight,
  onChange,
}) => {
  const [{ userAvatar }] = useUserMetadata(address)

  const addAddress = async () => {
    if (!onChange) return

    const addedAddress = await prompt("Add address 0x...")

    if (isAddress(addedAddress)) {
      onChange(addedAddress!)
      return
    }

    alert("Invalid address")
  }

  return (
    <S.InputContainer>
      <S.InputTop>
        <S.Price>{nodeLeft}</S.Price>

        <S.Balance>
          <S.Tokens>{nodeRight}</S.Tokens>
        </S.Balance>
      </S.InputTop>

      <S.InputBottom>
        <BigNumberInput
          decimals={18}
          onChange={() => {}}
          value={cutDecimalPlaces(amount, 18, false, 6).toString()}
          renderInput={(props: any) => (
            <S.Input disabled inputMode="decimal" {...props} />
          )}
        />

        <S.ActiveSymbol onClick={addAddress}>
          {!address && !!onChange ? (
            <AppButton
              type="button"
              text="Add address"
              color="default"
              size="no-paddings"
            />
          ) : (
            <>
              <Avatar url={userAvatar ?? ""} address={address} size={26} />
              <S.SymbolLabel>{shortenAddress(address, 3)}</S.SymbolLabel>
              {!!onChange && <S.Icon src={angleIcon} />}
            </>
          )}
        </S.ActiveSymbol>
      </S.InputBottom>
    </S.InputContainer>
  )
}

export default WalletInput
