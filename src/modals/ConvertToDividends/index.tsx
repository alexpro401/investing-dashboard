import Confirm from "components/Confirm"
import { FC } from "react"
import { IConvertToDividendsParams } from "./useConvertToDividendsContext"
import * as S from "./styled"
import Button from "components/Button"
import useConvertToDividends from "./useConvertToDividends"
import { usePoolContract } from "hooks/usePool"
import TokenIcon from "components/TokenIcon"

interface Props {
  isOpen: boolean
  onClose: () => void
  params: IConvertToDividendsParams
}

const ConvertToDividends: FC<Props> = (props) => {
  const { isOpen, onClose, params } = props
  const [info, submit] = useConvertToDividends(params, onClose)

  return (
    <Confirm title="Confirmation" isOpen={isOpen} toggle={onClose}>
      <S.Text>
        After this action, the balance of the proposal is converted into
        dividends
      </S.Text>
      <S.BalanceLabel>Balance</S.BalanceLabel>
      <S.BalanceRow>
        {info && (
          <>
            <TokenIcon m="-4px 4px 0 0" address={info.address} size={24} />
            <S.Balance>
              {info.amount} {info.symbol}
            </S.Balance>
          </>
        )}
      </S.BalanceRow>
      <Button
        m="10px 0 0"
        size="large"
        theme="primary"
        onClick={submit}
        fz={22}
        full
      >
        Convert balance to dividends
      </Button>
    </Confirm>
  )
}

export default ConvertToDividends
