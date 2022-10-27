import { useWeb3React } from "@web3-react/core"
import { AppButton } from "common"
import { DefaultTokenIcon } from "components/TokenIcon"
import { PRODUCT_LIST_URLS, UNSUPPORTED_LIST_URLS } from "constants/lists"
import { useFetchListCallback } from "hooks/useFetchListCallback"
import { TokenList } from "lib/token-list"
import parseENSAddress from "lib/utils/parseENSAddress"
import uriToHttp from "lib/utils/uriToHttp"
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useActiveListUrls, useAllLists } from "state/lists/hooks"
import ListRow from "./ListRow"
import * as S from "./styled"

interface Props {
  debouncedQuery: string
  setImportList: (list: TokenList) => void
  setListUrl: (url: string) => void
}

const Lists: FC<Props> = ({ debouncedQuery, setImportList, setListUrl }) => {
  const { chainId } = useWeb3React()
  const lists = useAllLists()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const tokenCountByListName = useMemo<Record<string, number>>(
    () =>
      Object.values(lists).reduce((acc, { current: list }) => {
        if (!list) {
          return acc
        }
        return {
          ...acc,
          [list.name]: list.tokens.reduce(
            (count: number, token) =>
              token.chainId === chainId ? count + 1 : count,
            0
          ),
        }
      }, {}),
    [chainId, lists]
  )

  const validUrl: boolean = useMemo(() => {
    return (
      uriToHttp(debouncedQuery).length > 0 ||
      Boolean(parseENSAddress(debouncedQuery))
    )
  }, [debouncedQuery])

  const fetchList = useFetchListCallback()

  // temporary fetched list for import flow
  const [tempList, setTempList] = useState<TokenList>()
  const [addError, setAddError] = useState<string | undefined>()

  useEffect(() => {
    async function fetchTempList() {
      fetchList(debouncedQuery, false)
        .then((list) => setTempList(list))
        .catch(() => setAddError(`Error importing list`))
    }
    // if valid url, fetch details for card
    if (validUrl) {
      fetchTempList()
    } else {
      setTempList(undefined)
      debouncedQuery !== "" && setAddError(`Enter valid list location`)
    }

    // reset error
    if (debouncedQuery === "") {
      setAddError(undefined)
    }
  }, [fetchList, debouncedQuery, validUrl])

  // sort by active but only if not visible
  const activeListUrls = useActiveListUrls()

  const sortedLists = useMemo(() => {
    const listUrls = Object.keys(lists)
    return listUrls
      .filter((listUrl) => {
        return (
          Boolean(lists[listUrl].current) &&
          !Boolean(UNSUPPORTED_LIST_URLS.includes(listUrl))
        )
      })
      .sort((listUrlA, listUrlB) => {
        const { current: listA } = lists[listUrlA]
        const { current: listB } = lists[listUrlB]

        // first filter on active lists
        if (
          activeListUrls?.includes(listUrlA) &&
          !activeListUrls?.includes(listUrlB)
        ) {
          return -1
        }
        if (
          !activeListUrls?.includes(listUrlA) &&
          activeListUrls?.includes(listUrlB)
        ) {
          return 1
        }

        if (listA && listB) {
          if (
            tokenCountByListName[listA.name] > tokenCountByListName[listB.name]
          ) {
            return -1
          }
          if (
            tokenCountByListName[listA.name] < tokenCountByListName[listB.name]
          ) {
            return 1
          }
          return listA.name.toLowerCase() < listB.name.toLowerCase()
            ? -1
            : listA.name.toLowerCase() === listB.name.toLowerCase()
            ? 0
            : 1
        }
        if (listA) return -1
        if (listB) return 1
        return 0
      })
  }, [lists, activeListUrls, tokenCountByListName])

  const root = useMemo(
    () => pathname.slice(0, pathname.indexOf("/modal")),
    [pathname]
  )

  // set list values and have parent modal switch to import list view
  const handleImport = useCallback(() => {
    if (!tempList) return
    setImportList(tempList)
    setListUrl(debouncedQuery)
    navigate(root + "/modal/import")
  }, [debouncedQuery, setImportList, setListUrl, tempList, navigate, root])

  return (
    <>
      {tempList && (
        <S.ListRow>
          <DefaultTokenIcon m="0" size={34} symbol={tempList.name} />
          <S.ListRowContent>
            <S.ListRowName>{tempList.name}</S.ListRowName>
            <S.ListRowTokensCounter>
              {tempList.tokens.length} tokens{" "}
            </S.ListRowTokensCounter>
          </S.ListRowContent>

          <AppButton onClick={handleImport} size="x-small" text="Import" />
        </S.ListRow>
      )}
      {addError && <S.Error>{addError}</S.Error>}
      {sortedLists.map((listUrl) => (
        <ListRow key={listUrl} listUrl={listUrl} />
      ))}
    </>
  )
}

export default Lists
