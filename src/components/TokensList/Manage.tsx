import RouteTabs from "components/RouteTabs"
import Search from "components/Search"
import { ITab } from "interfaces"
import { useCallback, useMemo, useState } from "react"
import * as S from "modals/TokenSelect/styled"
import { Route, Routes, useLocation, useNavigate } from "react-router-dom"
import isActiveRoute from "utils/isActiveRoute"
import { AppButton } from "common"
import useDebounce from "hooks/useDebounce"
import Tokens from "./Tokens"

export const Manage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const debouncedQuery = useDebounce(searchQuery, 200)

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

  const searchTitle = useMemo(
    () =>
      isActiveRoute(pathname, manageTabs[0].source)
        ? "https:// or ipfs://"
        : "0x...",
    [manageTabs, pathname]
  )

  const handleBack = useCallback(() => {
    navigate(root + "/modal/search")
  }, [navigate, root])

  return (
    <S.Card>
      <S.CardHeader>
        <RouteTabs m="0 0 16px" tabs={manageTabs} />
        <Search
          placeholder={searchTitle}
          value={searchQuery}
          handleChange={setSearchQuery}
          height="40px"
        />
      </S.CardHeader>
      <S.CardList style={{ minHeight: 400 }}>
        <Routes>
          <Route
            path={"tokens"}
            element={<Tokens debouncedQuery={debouncedQuery} />}
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
