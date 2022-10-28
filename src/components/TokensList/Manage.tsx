import RouteTabs from "components/RouteTabs"
import Search from "components/Search"
import { ITab } from "interfaces"
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import * as S from "modals/TokenSelect/styled"
import { Route, Routes, useLocation, useNavigate } from "react-router-dom"
import isActiveRoute from "utils/isActiveRoute"
import { AppButton } from "common"
import useDebounce from "hooks/useDebounce"
import Tokens from "./Tokens"
import Lists from "./Lists"
import { TokenList } from "lib/token-list"
import { Token } from "lib/entities"

interface Props {
  setImportList: (list: TokenList) => void
  setListUrl: (url: string) => void
  mainQuery: string
  setMainQuery: (query: string) => void
  customToken?: Token
}

/*
# explanaition of the main and local query params:
  - mainQuery variable: it's a search query value that is used to filter the tokens
  - all logic of mainQuery and tokens is in the parent component

  - localQuery: it's a query that is used to filter the lists
  - lists only can be controlled in the Lists component
  - so the localQuery is used to control the search input in the Lists component
*/

export const Manage: FC<Props> = (props) => {
  const { setImportList, setListUrl, mainQuery, setMainQuery, customToken } =
    props

  const [localQuery, setLocalQuery] = useState("")
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const debouncedQuery = useDebounce(localQuery, 200)

  const root = useMemo(
    () => pathname.slice(0, pathname.indexOf("/modal")),
    [pathname]
  )

  const manageTabs = useMemo(
    () => [
      {
        title: "Lists",
        source: root + "/modal/manage/lists",
      },
      {
        title: "Tokens",
        source: root + "/modal/manage/tokens",
      },
    ],
    [root]
  ) as ITab[]

  // check which tab is active and generate search props data
  const searchProps = useMemo(() => {
    const isActiveList = isActiveRoute(pathname, manageTabs[0].source)
    const placeholder = isActiveList ? "https:// or ipfs://" : "0x..."
    const value = isActiveList ? localQuery : mainQuery
    const handleChange = isActiveList ? setLocalQuery : setMainQuery

    return {
      placeholder,
      value,
      handleChange,
    }
  }, [mainQuery, manageTabs, pathname, localQuery, setMainQuery])

  // clear search query on tab change
  useEffect(() => {
    setLocalQuery("")
  }, [pathname])

  const handleBack = useCallback(() => {
    navigate(root + "/modal/search")
  }, [navigate, root])

  return (
    <S.Card>
      <S.CardHeader>
        <RouteTabs m="0 0 16px" tabs={manageTabs} />
        <Search {...searchProps} height="40px" />
      </S.CardHeader>
      <S.CardList style={{ minHeight: 400 }}>
        <Routes>
          <Route
            path={"lists"}
            element={
              <Lists
                setImportList={setImportList}
                setListUrl={setListUrl}
                debouncedQuery={debouncedQuery}
              />
            }
          />
          <Route
            path={"tokens"}
            element={
              <Tokens
                customToken={customToken}
                debouncedQuery={debouncedQuery}
              />
            }
          />
        </Routes>
      </S.CardList>
      <S.Footer>
        <AppButton
          onClick={handleBack}
          size="no-paddings"
          color="default"
          text="Return to the list"
        />
      </S.Footer>
    </S.Card>
  )
}
