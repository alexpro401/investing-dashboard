import Avatar from "components/Avatar"
import Skeleton from "components/Skeleton"
import TokenIcon from "components/TokenIcon"
import { useActiveWeb3React } from "hooks"
import useInsuranceAmount from "hooks/useInsuranceAmount"
import { useSelector } from "react-redux"
import { selectDexeAddress } from "state/contracts/selectors"
import { useUserMetadata } from "state/ipfsMetadata/hooks"
import { formatBigNumber, shortenAddress } from "utils"
import * as S from "./styled"

const WalletBadge = () => {
  const { account } = useActiveWeb3React()
  const [{ loading, userAvatar }] = useUserMetadata(account)
  const dexeAddress = useSelector(selectDexeAddress)
  const { insuranceAmount } = useInsuranceAmount(account)

  return (
    <S.Card>
      <S.InsuranceInner>
        <TokenIcon address={dexeAddress} size={24} m="0 4px 0 0" />
        <S.InsuranceAmount>
          {formatBigNumber(insuranceAmount)} DeXe
        </S.InsuranceAmount>
      </S.InsuranceInner>
      <S.AccountCard>
        {loading ? (
          <Skeleton variant="circle" w="24px" h="24px" />
        ) : (
          <Avatar size={24} url={userAvatar} address={account} />
        )}
        {loading ? (
          <Skeleton variant="text" h="17px" w="72px" />
        ) : (
          <S.AccountAddress>{shortenAddress(account, 3)}</S.AccountAddress>
        )}
      </S.AccountCard>
    </S.Card>
  )
}

export default WalletBadge
