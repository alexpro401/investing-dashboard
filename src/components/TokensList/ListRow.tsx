import { useWeb3React } from "@web3-react/core"
import { Icon } from "common"
import Switch from "components/Switch"
import { DefaultTokenIcon } from "components/TokenIcon"
import { ICON_NAMES } from "constants/icon-names"
import { PRODUCT_LIST_URLS } from "constants/lists"
import { memo, useCallback, useMemo } from "react"
import { useSelector } from "react-redux"
import { useAppDispatch } from "state/hooks"
import { disableList, enableList, removeList } from "state/lists/actions"
import { useIsListActive } from "state/lists/hooks"
import { selectListsByUrl } from "state/lists/selectors"
import * as S from "./styled"

const ListRow = memo(function ListRow({ listUrl }: { listUrl: string }) {
  const { chainId } = useWeb3React()
  const listsByUrl = useSelector(selectListsByUrl)
  const dispatch = useAppDispatch()

  const { current: list, pendingUpdate: pending } = listsByUrl[listUrl]

  const isLocked = useMemo(() => PRODUCT_LIST_URLS.includes(listUrl), [listUrl])
  const isActive = useIsListActive(listUrl)

  const activeTokensOnThisChain = useMemo(() => {
    if (!list || !chainId) {
      return 0
    }
    return list.tokens.reduce(
      (acc, cur) => (cur.chainId === chainId ? acc + 1 : acc),
      0
    )
  }, [chainId, list])

  const handleRemoveList = useCallback(() => {
    if (
      window.prompt(
        `Please confirm you would like to remove this list by typing REMOVE`
      ) === `REMOVE`
    ) {
      dispatch(removeList(listUrl))
    }
  }, [dispatch, listUrl])

  const handleEnableList = useCallback(() => {
    dispatch(enableList(listUrl))
  }, [dispatch, listUrl])

  const handleDisableList = useCallback(() => {
    dispatch(disableList(listUrl))
  }, [dispatch, listUrl])

  if (!list) return null

  return (
    <S.ListRow>
      <DefaultTokenIcon m="0" size={34} symbol={list.name} />
      <S.ListRowContent>
        <S.ListRowName>{list.name}</S.ListRowName>
        <S.ListRowTokensCounter>
          {activeTokensOnThisChain} tokens{" "}
          <S.PopoverWrapper>
            <Icon name={ICON_NAMES.settings} />
            {/* <S.PopoverContent></S.PopoverContent> */}
          </S.PopoverWrapper>
        </S.ListRowTokensCounter>
      </S.ListRowContent>
      <Switch
        isOn={isActive}
        disabled={isLocked}
        name={list.name}
        onChange={(_, v) => (v ? handleEnableList() : handleDisableList())}
      />
    </S.ListRow>
  )
})

export default ListRow
