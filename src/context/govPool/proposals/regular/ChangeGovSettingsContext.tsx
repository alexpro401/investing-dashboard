import React, {
  createContext,
  useCallback,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react"
import { SUPPORTED_SOCIALS } from "constants/socials"

export type ExternalFileDocument = {
  name: string
  url: string
}

interface IChangeGovSettingsContext {
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
  socialLinks: {
    get: [SUPPORTED_SOCIALS, string][]
    set: Dispatch<SetStateAction<[SUPPORTED_SOCIALS, string][]>>
  }
}

interface IChangeGovSettingsContextProviderProps {
  children: React.ReactNode
  initialForm: {
    avatarUrl: string
    daoName: string
    documents: ExternalFileDocument[]
    websiteUrl: string
    description: string
    socialLinks: [SUPPORTED_SOCIALS, string][]
  }
}

export const ChangeGovSettingsContext =
  createContext<IChangeGovSettingsContext>({
    avatarUrl: { get: "", set: () => {} },
    daoName: { get: "", set: () => {} },
    documents: {
      get: [],
      set: () => {},
    },
    websiteUrl: { get: "", set: () => {} },
    description: { get: "", set: () => {} },
    socialLinks: { get: [], set: () => {} },
  })

const ChangeGovSettingsContextProvider: React.FC<
  IChangeGovSettingsContextProviderProps
> = ({ children, initialForm }) => {
  const [_avatarUrl, _setAvatarUrl] = useState<string>("")
  const [_daoName, _setDaoName] = useState<string>("")
  const [_documents, _setDocuments] = useState<ExternalFileDocument[]>([
    { name: "", url: "" },
  ])
  const [_websiteUrl, _setWebsiteUrl] = useState<string>("")
  const [_descriptionUrl, _setDescriptionUrl] = useState<string>("")
  const [_socialLinks, _setSocialLinks] = useState<
    [SUPPORTED_SOCIALS, string][]
  >([])

  useEffect(() => {
    _setAvatarUrl(initialForm.avatarUrl ?? "")
    _setDaoName(initialForm.daoName ?? "")
    _setDocuments(initialForm.documents ?? [{ name: "", url: "" }])
    _setWebsiteUrl(initialForm.websiteUrl ?? "")
    _setDescriptionUrl(initialForm.description ?? "")
    _setSocialLinks(initialForm.socialLinks ?? [])
  }, [initialForm])

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

  return (
    <ChangeGovSettingsContext.Provider
      value={{
        avatarUrl: { get: _avatarUrl, set: _setAvatarUrl },
        daoName: { get: _daoName, set: _setDaoName },
        documents: { get: _documents, set: _handleChangeDocuments },
        websiteUrl: { get: _websiteUrl, set: _setWebsiteUrl },
        description: { get: _descriptionUrl, set: _setDescriptionUrl },
        socialLinks: { get: _socialLinks, set: _setSocialLinks },
      }}
    >
      {children}
    </ChangeGovSettingsContext.Provider>
  )
}

export default ChangeGovSettingsContextProvider
