import * as S from "./styled"

export default function WalletInsurance() {
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
                0.0000 DeXe
              </S.InsuranceBadgeWrpDetailsTitle>
            </S.InsuranceBadgeWrpDetails>
            <S.InsuranceBadgeWrpManageBtn>Manage</S.InsuranceBadgeWrpManageBtn>
          </S.InsuranceBadgeWrp>

          <S.InsuranceAmountsRowsWrp>
            <S.InsuranceAmountsRow>
              <S.InsuranceAmountsRowLabel>
                My total Stake:
              </S.InsuranceAmountsRowLabel>
              <S.InsuranceAmountsRowValue>
                10,000 DEXE
              </S.InsuranceAmountsRowValue>
            </S.InsuranceAmountsRow>

            <S.InsuranceAmountsRow>
              <S.InsuranceAmountsRowLabel>
                DeXe Treasury Balance:
              </S.InsuranceAmountsRowLabel>
              <S.InsuranceAmountsRowValue>
                1m 478 57845 DEXE
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
