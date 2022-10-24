import WarnCard from "components/WarnCard"
import { Token } from "lib/entities"
import { FC } from "react"
import ImportRow from "./ImportRow"
import * as S from "./styled"

interface Props {
  token: Token
  isImport: boolean
  showImportToken: () => void
  importToken: (token: Token) => void
}

const ImportToken: FC<Props> = (props) => {
  const { token, isImport, showImportToken, importToken } = props

  return (
    <S.Card>
      <S.CardHeader></S.CardHeader>
      <S.CardList>
        <ImportRow
          importToken={showImportToken}
          importing={isImport}
          token={token}
        />
        <WarnCard isChecked onChange={() => {}} title="Import at your own risk">
          Anyone can create a BEP20 token on BNB Smart Chain with any name,
          including creating fake versions of existing tokens and tokens that
          claim to represent projects that do not have a token. <br />
          <br /> If you purchase an arbitrary token, you may be unable to sell
          it back.
        </WarnCard>
      </S.CardList>

      <S.Footer>
        <S.ImportButton
          onClick={() => importToken(token)}
          size="large"
          text="Import"
        />
      </S.Footer>
    </S.Card>
  )
}

export default ImportToken
