import { FC } from "react"
import WarnCard from "components/WarnCard"
import StaticList from "./StaticList"
import { TokenList } from "lib/token-list"

interface Props {
  listURL: string
  importList: TokenList
  confirmed: boolean
  setConfirmed: (confirmed: boolean) => void
}

const ImportList: FC<Props> = (props) => {
  const { listURL, importList, confirmed, setConfirmed } = props

  return (
    <>
      <StaticList list={importList} url={listURL} />
      <WarnCard
        isChecked={confirmed}
        onChange={(v) => setConfirmed(v)}
        title="Import at your own risk"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit .
      </WarnCard>
    </>
  )
}

export default ImportList
