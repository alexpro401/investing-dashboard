import {
  FC,
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import {
  useGovPoolProposal,
  useGovPoolValidators,
  useGovValidatorsValidatorsToken,
} from "hooks/dao"
import { ethers } from "ethers"
import { proposalTypeDataDecodingMap } from "types"
import Skeleton from "components/Skeleton"
import { ErrorText } from "components/AddressChips/styled"
import * as S from "../../styled"
import { isEqual } from "lodash"
import ExternalLink from "components/ExternalLink"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { cutStringZeroes, normalizeBigNumber, shortenAddress } from "utils"
import { useWeb3React } from "@web3-react/core"

interface Props extends HTMLAttributes<HTMLDivElement> {
  govPoolProposal: ReturnType<typeof useGovPoolProposal>
}

const GovPoolProposalChangeValidatorBalances: FC<Props> = ({
  govPoolProposal,
}) => {
  const { chainId } = useWeb3React()

  const [actualValidatorsBalances] = useGovPoolValidators(
    govPoolProposal.govPoolAddress || ""
  )

  const [, validatorTokenData] = useGovValidatorsValidatorsToken(
    govPoolProposal.govPoolAddress || ""
  )

  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoadFailed, setIsLoadFailed] = useState(false)

  const abiCoder = useMemo(() => new ethers.utils.AbiCoder(), [])

  const [newValidatorsBalances, setNewValidatorsBalances] = useState<
    {
      validatorAddress: string
      validatorBalance: ethers.BigNumber
    }[]
  >([])

  const decodeProposalData = useCallback(async () => {
    try {
      if (!govPoolProposal.proposalType) return

      const decodedData = abiCoder.decode(
        proposalTypeDataDecodingMap[govPoolProposal.proposalType],
        "0x" + govPoolProposal.wrappedProposalView.proposal.data[0].slice(10)
      )

      setNewValidatorsBalances(
        decodedData[1].map((el, idx) => ({
          validatorAddress: el,
          validatorBalance: decodedData[0][idx],
        }))
      )
    } catch (error) {
      console.log(error)
      setIsLoadFailed(true)
    }
    setIsLoaded(true)
  }, [abiCoder, govPoolProposal])

  useEffect(() => {
    decodeProposalData()
  }, [abiCoder, decodeProposalData, govPoolProposal])

  const validatorsToAdjust = useMemo(
    () =>
      actualValidatorsBalances
        .map((el) => {
          const newVB = newValidatorsBalances.find(
            (i) =>
              i.validatorAddress.toLowerCase() ===
              el.id
                .toLowerCase()
                .replace(
                  String(govPoolProposal?.govPoolAddress)
                    .toLowerCase()
                    .replace("0x", ""),
                  ""
                )
          )

          return {
            validatorAddress: el.id
              .toLowerCase()
              .replace(
                String(govPoolProposal?.govPoolAddress)
                  .toLowerCase()
                  .replace("0x", ""),
                ""
              ),
            actualBalance: el.balance,
            toChangeBalance: newVB?.validatorBalance.toString() || "0",
          }
        })
        .filter((el) => !isEqual(el.actualBalance, el.toChangeBalance)) || [],
    [actualValidatorsBalances, govPoolProposal, newValidatorsBalances]
  )

  const validatorsToAdd = useMemo(
    () =>
      newValidatorsBalances.filter(
        (el) =>
          !actualValidatorsBalances
            .map((i) =>
              i.id
                .toLowerCase()
                .replace(
                  String(govPoolProposal?.govPoolAddress)
                    .toLowerCase()
                    .replace("0x", ""),
                  ""
                )
            )
            .includes(el.validatorAddress.toLowerCase())
      ) || [],
    [actualValidatorsBalances, govPoolProposal, newValidatorsBalances]
  )

  const validatorsToRemove = useMemo(() => {
    return (
      actualValidatorsBalances.filter(
        (el) =>
          !newValidatorsBalances
            .map((i) => i.validatorAddress.toLowerCase())
            .includes(
              el.id
                .toLowerCase()
                .replace(
                  String(govPoolProposal?.govPoolAddress)
                    .toLowerCase()
                    .replace("0x", ""),
                  ""
                )
            )
      ) || []
    )
  }, [actualValidatorsBalances, govPoolProposal, newValidatorsBalances])

  return isLoaded ? (
    isLoadFailed ? (
      <ErrorText>Oops... Something went wrong</ErrorText>
    ) : (
      <>
        {!!validatorsToAdjust.length && (
          <S.DaoProposalDetailsCard>
            <S.DaoProposalDetailsRow>
              <S.DaoProposalDetailsRowText textType="complex">
                <p>Adjust token balance for:</p>
              </S.DaoProposalDetailsRowText>
              <S.DaoProposalDetailsRowText textType="value">
                {`Validators: ${validatorsToAdjust.length}`}
              </S.DaoProposalDetailsRowText>
            </S.DaoProposalDetailsRow>
            {validatorsToAdjust.map((el, idx) => (
              <div key={idx}>
                <S.DaoProposalCardRowDivider />
                <S.DaoProposalDetailsRow>
                  <S.DaoProposalDetailsRowText textType="label">
                    <ExternalLink
                      href={
                        chainId
                          ? getExplorerLink(
                              chainId,
                              el.validatorAddress,
                              ExplorerDataType.ADDRESS
                            )
                          : "#"
                      }
                    >
                      {shortenAddress(el.validatorAddress)}
                    </ExternalLink>
                  </S.DaoProposalDetailsRowText>
                  <S.DaoProposalDetailsRowText textType="value">
                    {`${cutStringZeroes(normalizeBigNumber(el.actualBalance))}${
                      validatorTokenData?.symbol
                    } -> ${cutStringZeroes(
                      normalizeBigNumber(el.toChangeBalance)
                    )}${validatorTokenData?.symbol}`}
                  </S.DaoProposalDetailsRowText>
                </S.DaoProposalDetailsRow>
              </div>
            ))}
          </S.DaoProposalDetailsCard>
        )}

        {!!validatorsToAdd.length && (
          <S.DaoProposalDetailsCard>
            <S.DaoProposalDetailsRow>
              <S.DaoProposalDetailsRowText textType="complex">
                <p>Add validator(s)</p>
              </S.DaoProposalDetailsRowText>
              <S.DaoProposalDetailsRowText textType="value">
                {`Validators: ${validatorsToAdd.length}`}
              </S.DaoProposalDetailsRowText>
            </S.DaoProposalDetailsRow>
            {validatorsToAdd.map((el, idx) => (
              <div key={idx}>
                <S.DaoProposalCardRowDivider />
                <S.DaoProposalDetailsRow>
                  <S.DaoProposalDetailsRowText textType="label">
                    <ExternalLink
                      href={
                        chainId
                          ? getExplorerLink(
                              chainId,
                              el.validatorAddress,
                              ExplorerDataType.ADDRESS
                            )
                          : "#"
                      }
                    >
                      {shortenAddress(el.validatorAddress)}
                    </ExternalLink>
                  </S.DaoProposalDetailsRowText>
                  <S.DaoProposalDetailsRowText textType="value">
                    {cutStringZeroes(normalizeBigNumber(el.validatorBalance))}
                    {validatorTokenData?.symbol}
                  </S.DaoProposalDetailsRowText>
                </S.DaoProposalDetailsRow>
              </div>
            ))}
          </S.DaoProposalDetailsCard>
        )}

        {!!validatorsToRemove.length && (
          <S.DaoProposalDetailsCard>
            <S.DaoProposalDetailsRow>
              <S.DaoProposalDetailsRowText textType="complex">
                <p>Add validator(s)</p>
              </S.DaoProposalDetailsRowText>
              <S.DaoProposalDetailsRowText textType="value">
                {`Validators: ${validatorsToRemove.length}`}
              </S.DaoProposalDetailsRowText>
            </S.DaoProposalDetailsRow>
            {validatorsToRemove.map((el, idx) => (
              <div key={idx}>
                <S.DaoProposalCardRowDivider />
                <S.DaoProposalDetailsRow>
                  <S.DaoProposalDetailsRowText textType="label">
                    <ExternalLink
                      href={
                        chainId
                          ? getExplorerLink(
                              chainId,
                              el.id,
                              ExplorerDataType.ADDRESS
                            )
                          : "#"
                      }
                    >
                      {shortenAddress(el.id)}
                    </ExternalLink>
                  </S.DaoProposalDetailsRowText>
                  <S.DaoProposalDetailsRowText textType="value">
                    {cutStringZeroes(normalizeBigNumber(el.balance))}
                    {validatorTokenData?.symbol}
                  </S.DaoProposalDetailsRowText>
                </S.DaoProposalDetailsRow>
              </div>
            ))}
          </S.DaoProposalDetailsCard>
        )}
      </>
    )
  ) : (
    <S.DaoProposalDetailsCard>
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </S.DaoProposalDetailsCard>
  )
}

export default GovPoolProposalChangeValidatorBalances
