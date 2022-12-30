import { formatUnits } from "@ethersproject/units"
import { PulseSpinner } from "react-spinners-kit"
import {
  useActiveWeb3React,
  useGovPoolTreasury,
  useInsuranceAmount,
} from "hooks"
import { useMemo } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { selectDexeAddress } from "state/contracts/selectors"
import { formatFiatNumber, normalizeBigNumber } from "utils"
import * as S from "./styled"

export default function WalletInsurance() {
  const { account } = useActiveWeb3React()
  const { insuranceAmount, stakeAmount } = useInsuranceAmount(account)

  const dexeAddress = useSelector(selectDexeAddress)

  const [treasuryTokens, treasuryTokensLoading] = useGovPoolTreasury(
    process.env.REACT_APP_DEXE_DAO_ADDRESS
  )

  const navigate = useNavigate()

  const handleInsuranceRedirect = () => {
    navigate("/insurance")
  }

  const treasuryDexeBalance = useMemo(() => {
    if (treasuryTokensLoading || !treasuryTokens) return "-"

    const dexeToken = treasuryTokens.items.filter(
      (token) => token.contract_address.toLocaleLowerCase() === dexeAddress
    )[0]

    if (!dexeToken) return "-"

    return formatFiatNumber(formatUnits(dexeToken.balance, 18), 0)
  }, [dexeAddress, treasuryTokens, treasuryTokensLoading])

  return (
    <>
      <S.Container
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.5, ease: [0.29, 0.98, 0.29, 1] }}
      >
        <S.ContainerInner>
          <S.Title>Insurance</S.Title>
          <S.InsuranceBadgeWrp>
            <S.InsuranceBadgeWrpDetails>
              <S.InsuranceBadgeWrpDetailsLabel>
                Amount Insured
                <S.InsuranceBadgeWrpDetailsMultiplier>
                  x10
                </S.InsuranceBadgeWrpDetailsMultiplier>
              </S.InsuranceBadgeWrpDetailsLabel>
              <S.InsuranceBadgeWrpDetailsTitle>
                {normalizeBigNumber(insuranceAmount, 18, 2)} DEXE
              </S.InsuranceBadgeWrpDetailsTitle>
            </S.InsuranceBadgeWrpDetails>
            <S.InsuranceBadgeWrpManageBtn onClick={handleInsuranceRedirect}>
              Manage
            </S.InsuranceBadgeWrpManageBtn>
          </S.InsuranceBadgeWrp>

          <S.InsuranceAmountsRowsWrp>
            <S.InsuranceAmountsRow>
              <S.InsuranceAmountsRowLabel>
                My total Stake:
              </S.InsuranceAmountsRowLabel>
              <S.InsuranceAmountsRowValue>
                {normalizeBigNumber(stakeAmount, 18, 2)} DEXE
              </S.InsuranceAmountsRowValue>
            </S.InsuranceAmountsRow>

            <S.InsuranceAmountsRow>
              <S.InsuranceAmountsRowLabel>
                DeXe Treasury Balance:
              </S.InsuranceAmountsRowLabel>
              <S.InsuranceAmountsRowValue>
                {treasuryTokensLoading ? (
                  <PulseSpinner size={12} loading />
                ) : (
                  treasuryDexeBalance
                )}{" "}
                DEXE
              </S.InsuranceAmountsRowValue>
            </S.InsuranceAmountsRow>
          </S.InsuranceAmountsRowsWrp>

          <S.InsuranceFooter>
            <S.InsuranceCallToActionBlock>
              <S.InsuranceCallToActionBlockTitle>
                Застрахуй свои инвестиции с Дикси текст пропушить страховку
              </S.InsuranceCallToActionBlockTitle>

              <S.InsuranceCallToActionBlockLink>
                How it works?
              </S.InsuranceCallToActionBlockLink>
            </S.InsuranceCallToActionBlock>
          </S.InsuranceFooter>
        </S.ContainerInner>
      </S.Container>
    </>
  )
}
