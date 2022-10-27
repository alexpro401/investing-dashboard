import { useWeb3React } from "@web3-react/core"
import { UNSUPPORTED_LIST_URLS } from "constants/lists"
import { FC, useMemo } from "react"
import { useActiveListUrls, useAllLists } from "state/lists/hooks"
import ListRow from "./ListRow"

interface Props {
  debouncedQuery: string
}

const Lists: FC<Props> = ({ debouncedQuery }) => {
  const { chainId } = useWeb3React()
  const lists = useAllLists()

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

  // sort by active but only if not visible
  const activeListUrls = useActiveListUrls()

  const sortedLists = useMemo(() => {
    const listUrls = Object.keys(lists)
    return listUrls
      .filter((listUrl) => {
        // only show loaded lists, hide unsupported lists
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

  return (
    <>
      {sortedLists.map((listUrl) => (
        <ListRow key={listUrl} listUrl={listUrl} />
      ))}
    </>
  )
}

export default Lists
