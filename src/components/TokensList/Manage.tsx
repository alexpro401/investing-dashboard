import RouteTabs from "components/RouteTabs"
import Search from "components/Search"
import { ITab } from "interfaces"
import { useMemo, useState } from "react"
import * as S from "modals/TokenSelect/styled"
import { Route, Routes, useLocation } from "react-router-dom"
import isActiveRoute from "utils/isActiveRoute"
import ManageToken from "./ManageToken"
import { useUserAddedTokens } from "state/user/hooks"

export const Manage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const { pathname } = useLocation()
  const userTokens = useUserAddedTokens()

  const manageTabs = useMemo(
    () => [
      {
        title: "Lists",
        source: "/create-fund/basic/lists",
      },
      {
        title: "Tokens",
        source: "/create-fund/basic/tokens",
      },
    ],
    []
  ) as ITab[]

  const searchTitle = useMemo(
    () =>
      isActiveRoute(pathname, manageTabs[0].source)
        ? "https:// or ipfs://"
        : "0x...",
    [manageTabs, pathname]
  )

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
            element={
              <>
                {userTokens.map((token) => (
                  <ManageToken key={token.address} token={token} />
                ))}
                {!userTokens.length && (
                  <S.Placeholder>No tokens found</S.Placeholder>
                )}
              </>
            }
          />
        </Routes>
      </S.CardList>
    </S.Card>
  )
}
