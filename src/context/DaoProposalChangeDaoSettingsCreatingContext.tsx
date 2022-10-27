import React, {
  createContext,
  useCallback,
  useState,
  Dispatch,
  SetStateAction,
} from "react"
import { SUPPORTED_SOCIALS } from "constants/socials"

export type ExternalFileDocument = {
  name: string
  url: string
}

export type ExternalCustomSocialLink = {
  url: string
}

interface IDaoProposalChangeDaoSettingsCreatingContext {
  avatarUrl: { get: string; set: Dispatch<SetStateAction<string>> }
  daoName: { get: string; set: Dispatch<SetStateAction<string>> }
  documents: {
    get: ExternalFileDocument[]
    set: (
      value: ExternalFileDocument | ExternalFileDocument[],
      idx?: number
    ) => void
  }
  websiteUrl: { get: string; set: Dispatch<SetStateAction<string>> }
  description: { get: string; set: Dispatch<SetStateAction<string>> }
  telegramUrl: { get: string; set: Dispatch<SetStateAction<string>> }
  twitterUrl: { get: string; set: Dispatch<SetStateAction<string>> }
  mediumUrl: { get: string; set: Dispatch<SetStateAction<string>> }
  githubUrl: { get: string; set: Dispatch<SetStateAction<string>> }
  socialLinks: {
    get: [SUPPORTED_SOCIALS, string][]
    set: Dispatch<SetStateAction<[SUPPORTED_SOCIALS, string][]>>
  }
  customUrls: {
    get: ExternalCustomSocialLink[]
    set: (
      value: ExternalCustomSocialLink | ExternalCustomSocialLink[],
      idx?: number
    ) => void
  } // TODO: remove
}

interface IDaoProposalChangeDaoSettingsCreatingContextProviderProps {
  children: React.ReactNode
}

export const DaoProposalChangeDaoSettingsCreatingContext =
  createContext<IDaoProposalChangeDaoSettingsCreatingContext>({
    avatarUrl: { get: "", set: () => {} },
    daoName: { get: "", set: () => {} },
    documents: {
      get: [],
      set: () => {},
    },
    websiteUrl: { get: "", set: () => {} },
    description: { get: "", set: () => {} },
    telegramUrl: { get: "", set: () => {} },
    twitterUrl: { get: "", set: () => {} },
    mediumUrl: { get: "", set: () => {} },
    githubUrl: { get: "", set: () => {} },
    socialLinks: { get: [], set: () => {} },
    customUrls: {
      get: [],
      set: () => {},
    }, // TODO: remove
  })

const DaoProposalChangeDaoSettingsCreatingContextProvider: React.FC<
  IDaoProposalChangeDaoSettingsCreatingContextProviderProps
> = ({ children }) => {
  const [_avatarUrl, _setAvatarUrl] = useState<string>("")
  const [_daoName, _setDaoName] = useState<string>("")
  const [_documents, _setDocuments] = useState<ExternalFileDocument[]>([
    { name: "", url: "" },
  ])
  const [_websiteUrl, _setWebsiteUrl] = useState<string>("")
  const [_descriptionUrl, _setDescriptionUrl] = useState<string>("")
  const [_telegramUrl, _setTelegramUrl] = useState<string>("")
  const [_twitterUrl, _setTwitterUrl] = useState<string>("")
  const [_mediumUrl, _setMediumUrl] = useState<string>("")
  const [_githubUrl, _setGithubUrl] = useState<string>("")
  const [_socialLinks, _setSocialLinks] = useState<
    [SUPPORTED_SOCIALS, string][]
  >([])
  const [_customUrls, _setCustomUrls] = useState<ExternalCustomSocialLink[]>([
    { url: "" },
  ]) // TODO: remove

  const _handleChangeDocuments = useCallback((value, idx?: number) => {
    _setDocuments((prev) => {
      if (Array.isArray(value)) {
        return value
      } else {
        const newDocs = [...prev]
        if (idx !== undefined && idx !== null) {
          newDocs[idx] = value
        }
        return newDocs
      }
    })
  }, [])

  const _handleChangeCustomUrls = useCallback((value, idx?: number) => {
    _setCustomUrls((prev) => {
      if (Array.isArray(value)) {
        return value
      } else {
        const newCustomUrls = [...prev]
        if (idx !== undefined && idx !== null) {
          newCustomUrls[idx] = value
        }
        return newCustomUrls
      }
    })
  }, [])

  return (
    <DaoProposalChangeDaoSettingsCreatingContext.Provider
      value={{
        avatarUrl: { get: _avatarUrl, set: _setAvatarUrl },
        daoName: { get: _daoName, set: _setDaoName },
        documents: { get: _documents, set: _handleChangeDocuments },
        websiteUrl: { get: _websiteUrl, set: _setWebsiteUrl },
        description: { get: _descriptionUrl, set: _setDescriptionUrl },
        telegramUrl: { get: _telegramUrl, set: _setTelegramUrl },
        twitterUrl: { get: _twitterUrl, set: _setTwitterUrl },
        mediumUrl: { get: _mediumUrl, set: _setMediumUrl },
        githubUrl: { get: _githubUrl, set: _setGithubUrl },
        socialLinks: { get: _socialLinks, set: _setSocialLinks },
        customUrls: { get: _customUrls, set: _handleChangeCustomUrls }, // TODO: remove
      }}
    >
      {children}
    </DaoProposalChangeDaoSettingsCreatingContext.Provider>
  )
}

export default DaoProposalChangeDaoSettingsCreatingContextProvider
