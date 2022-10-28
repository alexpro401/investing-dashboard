import { FC } from "react"
import WarnCard from "components/WarnCard"
import { Token } from "lib/entities"
import ImportRow from "./ImportRow"

interface Props {
  token: Token
  showImportToken: () => void
  confirmed: boolean
  setConfirmed: (confirmed: boolean) => void
}

// warning card modal view: when the user is trying to import a custom token
const ImportToken: FC<Props> = (props) => {
  const { token, confirmed, setConfirmed, showImportToken } = props

  return (
    <>
      <ImportRow importToken={showImportToken} importing token={token} />
      <WarnCard
        isChecked={confirmed}
        onChange={(v) => setConfirmed(v)}
        title="Import at your own risk"
      >
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
