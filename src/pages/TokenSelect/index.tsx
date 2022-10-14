import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { TraderPool } from "abi"

import IconButton from "components/IconButton"
import TokensList from "components/TokensList"
import Header, { EHeaderTitles } from "components/Header"

import { selectWhitelist } from "state/pricefeed/selectors"
import { Token } from "interfaces"
import useContract from "hooks/useContract"

import back from "assets/icons/angle-left.svg"

import { Title, Container, TitleContainer, CardHeader, Card } from "./styled"
import { useCurrencyBalances } from "hooks/useBalance"
import { useWeb3React } from "@web3-react/core"
import { useAllTokens } from "hooks/useToken"

const TokenSelect: React.FC = () => {
  const navigate = useNavigate()
  const { account } = useWeb3React()
  const { type, poolAddress, field, address } = useParams()
  const [q, setQuery] = useState("")
  const [balances, setBalances] = useState({})
  const whitelisted = useSelector(selectWhitelist)
  const traderPool = useContract(poolAddress, TraderPool)

  const allTokens = useAllTokens()
  const allTokensArray = useMemo(
    () => Object.values(allTokens ?? {}),
    [allTokens]
  )
  const bl = useCurrencyBalances(account, allTokensArray)
  console.log(bl.map((b) => [b?.toSignificant(4), b?.currency.symbol]))

  const onSelect = useCallback(
    (token: Token) => {
      const rootPath = `/pool/swap/${type}/${poolAddress}`

      if (field === "from") {
        navigate(`${rootPath}/${token.address}/${address}`)
      }

      if (field === "to") {
        navigate(`${rootPath}/${address}/${token.address}`)
      }
    },
    [navigate, poolAddress, type, field, address]
  )

  useEffect(() => {
    if (!traderPool) return

    const fetchBalances = async () => {
      const info = await traderPool?.getPoolInfo()
      const balance = {}

      info.openPositions.map((address: string, index) => {
        balance[address.toLocaleLowerCase()] =
          info.baseAndPositionBalances[index + 1]
      })

      setBalances(balance)
    }

    fetchBalances().catch(console.error)
  }, [traderPool])

  return (
    <>
      <Header title={EHeaderTitles.myTraderProfile} />

      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Card>
          <CardHeader>
            <TitleContainer>
              <IconButton media={back} onClick={() => navigate(-1)} />
              <Title>Select token</Title>
            </TitleContainer>
          </CardHeader>
          <TokensList
            balances={balances}
            handleChange={setQuery}
            tokens={whitelisted}
            onSelect={onSelect}
            query={q}
          />
        </Card>
      </Container>
    </>
  )
}

export default TokenSelect
