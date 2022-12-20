import {
  FC,
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useGovPoolProposal } from "hooks/dao"
import { IGovPoolDescription, proposalTypeDataDecodingMap } from "types"
import { ethers } from "ethers"
import { IpfsEntity } from "utils/ipfsEntity"
import * as S from "../../styled"
import extractRootDomain from "utils/extractRootDomain"
import { createContentLink } from "utils"
import ExternalLink from "components/ExternalLink"
import { isEqual } from "lodash"
import { useEffectOnce } from "react-use"

interface Props extends HTMLAttributes<HTMLDivElement> {
  govPoolProposal: ReturnType<typeof useGovPoolProposal>
}

const GovPoolProposalProfile: FC<Props> = ({ govPoolProposal }) => {
  const [, setIsLoaded] = useState(false)
  const [, setIsLoadFailed] = useState(false)

  const [actualGovPoolDescription, setActualGovPoolDescription] =
    useState<IGovPoolDescription>()

  const [proposedGovPoolDescription, setProposedGovPoolDescription] =
    useState<IGovPoolDescription>()

  const abiCoder = useMemo(() => new ethers.utils.AbiCoder(), [])

  const decodeProposalData = useCallback(async () => {
    try {
      if (!govPoolProposal.proposalType) return

      const decodedData = abiCoder.decode(
        proposalTypeDataDecodingMap[govPoolProposal.proposalType],
        "0x" + govPoolProposal.wrappedProposalView.proposal.data[0].slice(10)
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
  }, [abiCoder, govPoolProposal])

  const loadGovPoolActualDescription = useCallback(async () => {
    try {
      const actualDescriptionIpfsEntity = new IpfsEntity<IGovPoolDescription>({
        path: govPoolProposal.govPoolDescriptionURL,
      })
      setActualGovPoolDescription(await actualDescriptionIpfsEntity.load())
    } catch (error) {
      console.error(error)
    }
  }, [govPoolProposal])

  const init = useCallback(async () => {
    try {
      await Promise.all([decodeProposalData, loadGovPoolActualDescription])
    } catch (error) {
      console.log(error)
      setIsLoadFailed(true)
    }
    setIsLoaded(true)
  }, [decodeProposalData, loadGovPoolActualDescription])

  useEffectOnce(() => {
    init()
  })

  useEffect(() => {
    loadGovPoolActualDescription()
  }, [loadGovPoolActualDescription])

  useEffect(() => {
    decodeProposalData()
  }, [abiCoder, decodeProposalData, govPoolProposal])

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
        proposedGovPoolDescription?.documents,
        actualGovPoolDescription?.documents
      ) && (
        <>
          <S.DaoProposalCardRowDivider />

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText textType="complex">
              <span>Documents</span>
              <S.DaoProposalDetailsRowList>
                {actualGovPoolDescription?.documents.map((el, idx) => (
                  <ExternalLink href={el.url} key={idx}>
                    <S.DaoProposalDetailsRowExternalCroppedLinkWrp>
                      <S.DaoProposalDetailsRowExternalCroppedLink>
                        {el.name}
                      </S.DaoProposalDetailsRowExternalCroppedLink>
                    </S.DaoProposalDetailsRowExternalCroppedLinkWrp>
                  </ExternalLink>
                ))}
              </S.DaoProposalDetailsRowList>
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText textType="success">
              <S.DaoProposalDetailsRowList>
                {proposedGovPoolDescription?.documents.map((el, idx) => (
                  <ExternalLink href={el.url} key={idx}>
                    <S.DaoProposalDetailsRowExternalCroppedLinkWrp>
                      <S.DaoProposalDetailsRowExternalCroppedLink>
                        {el.name}
                      </S.DaoProposalDetailsRowExternalCroppedLink>
                    </S.DaoProposalDetailsRowExternalCroppedLinkWrp>
                  </ExternalLink>
                ))}
              </S.DaoProposalDetailsRowList>
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>
        </>
      )}
    </>
  )
}

export default GovPoolProposalProfile
