import {
  FC,
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useGovPoolProposal } from "hooks/dao"
import { IExecutorType, IGovPoolDescription } from "types"
import { ethers } from "ethers"
import { IpfsEntity } from "utils/ipfsEntity"
import * as S from "../../styled"
import extractRootDomain from "utils/extractRootDomain"
import { createContentLink } from "utils"
import ExternalLink from "components/ExternalLink"
import { isEqual } from "lodash"

interface Props extends HTMLAttributes<HTMLDivElement> {
  govPoolProposal: ReturnType<typeof useGovPoolProposal>
}

const GovPoolProposalProfile: FC<Props> = ({ govPoolProposal, ...rest }) => {
  const [actualGovPoolDescription, setActualGovPoolDescription] =
    useState<IGovPoolDescription>()

  const [proposedGovPoolDescription, setProposedGovPoolDescription] =
    useState<IGovPoolDescription>()

  const proposalTypeDataDecodingMap = useMemo<Record<IExecutorType, string[]>>(
    () => ({
      ["profile"]: ["string"], // description ipfs path
      ["change-settings"]: [],
      ["change-validator-balances"]: [],
      ["distribution"]: [],
      ["add-token"]: [],
      ["custom"]: [],
      ["insurance"]: [],
    }),
    []
  )

  const abiCoder = useMemo(() => new ethers.utils.AbiCoder(), [])

  const decodeProposalData = useCallback(async () => {
    try {
      if (!govPoolProposal.proposalType) return

      const decodedData = abiCoder.decode(
        proposalTypeDataDecodingMap[govPoolProposal.proposalType],
        "0x" + govPoolProposal.proposalView.proposal.data[0].slice(10)
      )

      if (govPoolProposal.proposalType === "profile") {
        const profileChangingOptionsIpfs = new IpfsEntity<IGovPoolDescription>({
          path: decodedData[0],
        })

        setProposedGovPoolDescription(await profileChangingOptionsIpfs.load())
      }
    } catch (error) {
      console.log(error)
    }
  }, [abiCoder, govPoolProposal, proposalTypeDataDecodingMap])

  const loadGovPoolActualDescription = useCallback(async () => {
    try {
      const descriptionURL =
        await govPoolProposal.govPoolContract?.descriptionURL()
      const actualDescriptionIpfsEntity = new IpfsEntity<IGovPoolDescription>({
        path: descriptionURL,
      })
      setActualGovPoolDescription(await actualDescriptionIpfsEntity.load())
    } catch (error) {
      console.error(error)
    }
  }, [govPoolProposal])

  useEffect(() => {
    loadGovPoolActualDescription()
  }, [loadGovPoolActualDescription])

  useEffect(() => {
    decodeProposalData()
  }, [
    abiCoder,
    decodeProposalData,
    govPoolProposal,
    proposalTypeDataDecodingMap,
  ])

  return (
    <>
      <S.DaoProposalDetailsRow>
        <S.DaoProposalDetailsRowText textType="complex">
          <p>Change Info</p>
        </S.DaoProposalDetailsRowText>
        <S.DaoProposalDetailsRowText textType="success">
          Proposed changes
        </S.DaoProposalDetailsRowText>
      </S.DaoProposalDetailsRow>
      {!isEqual(
        proposedGovPoolDescription?.avatarUrl,
        actualGovPoolDescription?.avatarUrl
      ) && (
        <>
          <S.DaoProposalCardRowDivider />

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText textType="complex">
              <span>Dao Photo</span>
              <S.DaoProposalDetailsRowAvatarImg
                src={actualGovPoolDescription?.avatarUrl}
                alt={actualGovPoolDescription?.daoName}
              />
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText textType="success">
              <S.DaoProposalDetailsRowAvatarImg
                src={proposedGovPoolDescription?.avatarUrl}
                alt={proposedGovPoolDescription?.daoName}
              />
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>
        </>
      )}
      {!isEqual(
        proposedGovPoolDescription?.daoName,
        actualGovPoolDescription?.daoName
      ) && (
        <>
          <S.DaoProposalCardRowDivider />

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText textType="complex">
              <span>Name</span>
              <p>{actualGovPoolDescription?.daoName}</p>
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText textType="success">
              {proposedGovPoolDescription?.daoName}
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>
        </>
      )}

      {!isEqual(
        proposedGovPoolDescription?.description,
        actualGovPoolDescription?.description
      ) && (
        <>
          <S.DaoProposalCardRowDivider />

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText textType="complex">
              <span>Description</span>
              <ExternalLink
                href={createContentLink(
                  actualGovPoolDescription?.description || ""
                )}
              >
                Open current description
              </ExternalLink>
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText textType="success">
              <ExternalLink
                href={createContentLink(
                  proposedGovPoolDescription?.description || ""
                )}
              >
                Open new
              </ExternalLink>
              {}
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>
        </>
      )}

      {!isEqual(
        proposedGovPoolDescription?.websiteUrl,
        actualGovPoolDescription?.websiteUrl
      ) && (
        <>
          <S.DaoProposalCardRowDivider />

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText textType="complex">
              <span>Dao Site</span>
              <a href={actualGovPoolDescription?.websiteUrl}>
                {extractRootDomain(actualGovPoolDescription?.websiteUrl || "")}
              </a>
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText textType="success">
              <a href={actualGovPoolDescription?.websiteUrl}>
                {extractRootDomain(
                  proposedGovPoolDescription?.websiteUrl || ""
                )}
              </a>
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>
        </>
      )}

      {!isEqual(
        proposedGovPoolDescription?.websiteUrl,
        actualGovPoolDescription?.websiteUrl
      ) && (
        <>
          <S.DaoProposalCardRowDivider />

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText textType="complex">
              <span>Documents</span>
              {actualGovPoolDescription?.documents.map((el, idx) => (
                <ExternalLink href={el.url} key={idx}>
                  <S.DaoProposalDetailsRowExternalCroppedLinkWrp>
                    <S.DaoProposalDetailsRowExternalCroppedLink>
                      {el.name}
                    </S.DaoProposalDetailsRowExternalCroppedLink>
                  </S.DaoProposalDetailsRowExternalCroppedLinkWrp>
                </ExternalLink>
              ))}
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText textType="success">
              {proposedGovPoolDescription?.documents.map((el, idx) => (
                <ExternalLink href={el.url} key={idx}>
                  <S.DaoProposalDetailsRowExternalCroppedLinkWrp>
                    <S.DaoProposalDetailsRowExternalCroppedLink>
                      {el.name}
                    </S.DaoProposalDetailsRowExternalCroppedLink>
                  </S.DaoProposalDetailsRowExternalCroppedLinkWrp>
                </ExternalLink>
              ))}
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>
        </>
      )}
    </>
  )
}

export default GovPoolProposalProfile
