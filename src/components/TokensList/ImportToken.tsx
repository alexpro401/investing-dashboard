import { FC } from "react"
import WarnCard from "components/WarnCard"
import { Token } from "lib/entities"
import ImportRow from "./ImportRow"

interface Props {
  token: Token
  isImport: boolean
  showImportToken: () => void
}

const ImportToken: FC<Props> = (props) => {
  const { token, isImport, showImportToken } = props

  return (
    <>
      <ImportRow
        importToken={showImportToken}
        importing={isImport}
        token={token}
      />
      <WarnCard isChecked onChange={() => {}} title="Import at your own risk">
        Anyone can create a BEP20 token on BNB Smart Chain with any name,
        including creating fake versions of existing tokens and tokens that
        claim to represent projects that do not have a token. <br />
        <br /> If you purchase an arbitrary token, you may be unable to sell it
        back.
      </WarnCard>
    </>
  )
}

export default ImportToken
