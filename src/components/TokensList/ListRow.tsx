import { useWeb3React } from "@web3-react/core"
import { Icon } from "common"
import Switch from "components/Switch"
import { DefaultTokenIcon } from "components/TokenIcon"
import { ICON_NAMES } from "constants/icon-names"
import { memo } from "react"
import { useSelector } from "react-redux"
import { selectListsByUrl } from "state/lists/selectors"
import * as S from "./styled"

const ListRow = memo(function ListRow({ listUrl }: { listUrl: string }) {
  const { chainId } = useWeb3React()
  const listsByUrl = useSelector(selectListsByUrl)

  const { current: list, pendingUpdate: pending } = listsByUrl[listUrl]

  if (!list) return null

  return (
    <S.ListRow>
      <DefaultTokenIcon m="0" size={32} symbol={list.name} />
      <S.ListRowContent>
        <S.ListRowName>{list.name}</S.ListRowName>
        <S.ListRowTokensCounter>
          0 tokens <Icon name={ICON_NAMES.settings} />
        </S.ListRowTokensCounter>
      </S.ListRowContent>
      <Switch isOn name={list.name} onChange={() => {}} />
    </S.ListRow>
  )
})

export default ListRow
