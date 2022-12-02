import { FC, HTMLAttributes } from "react"
import * as S from "../../styled"
import TokenIcon from "components/TokenIcon"
import { useGovPoolProposal } from "hooks/dao"
import { fromBig } from "utils"

interface Props extends HTMLAttributes<HTMLDivElement> {
  govPoolProposal: ReturnType<typeof useGovPoolProposal>
}

const GovPoolProposalDistribution: FC<Props> = ({ govPoolProposal }) => {
  return (
    <>
      <S.DaoProposalDetailsRow>
        <S.DaoProposalDetailsRowText textType="label">
          <p>Amount of token</p>
        </S.DaoProposalDetailsRowText>
        <S.DaoProposalDetailsRowText textType="label">
          ERC-20
        </S.DaoProposalDetailsRowText>
      </S.DaoProposalDetailsRow>
      <S.DaoProposalDetailsRow>
        <S.DaoProposalDetailsRowText textType="label">
          <S.DaoProposalDPAmountValue>
            {fromBig(govPoolProposal.distributionProposalTokenAmount)}
          </S.DaoProposalDPAmountValue>
        </S.DaoProposalDetailsRowText>
        <S.DaoProposalDetailsRowText textType="label">
          <S.DaoProposalDPActiveSymbol>
            {govPoolProposal.distributionProposalTokenAddress ? (
              <TokenIcon
                m="0"
                address={govPoolProposal?.distributionProposalTokenAddress}
                size={26}
              />
            ) : (
              <></>
            )}
            {govPoolProposal.distributionProposalToken?.symbol && (
              <S.DaoProposalDPSymbolLabel>
                {govPoolProposal.distributionProposalToken.symbol}
              </S.DaoProposalDPSymbolLabel>
            )}
          </S.DaoProposalDPActiveSymbol>
        </S.DaoProposalDetailsRowText>
      </S.DaoProposalDetailsRow>
    </>
  )
}

export default GovPoolProposalDistribution
