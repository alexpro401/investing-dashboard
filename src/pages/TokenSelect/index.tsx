import React, { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"

import Search from "components/Search"
import IconButton from "components/IconButton"

import { selectWhitelist } from "state/pricefeed/selectors"

import back from "assets/icons/angle-left.svg"

import {
  Container,
  Card,
  CardHeader,
  Title,
  TitleContainer,
  CardList,
  TokenItem,
} from "./styled"
import { useHistory, useParams } from "react-router-dom"

interface TokenSelectParams {
  operation: string
  type: string
  poolAddress: string
}

const TokenSelect: React.FC = () => {
  const history = useHistory()
  const { type, poolAddress } = useParams<TokenSelectParams>()
  const [q, setQuery] = useState("")
  const whitelisted = useSelector(selectWhitelist)

  const onSelect = (tokenAddress) => {
    const rootPath = `/pool/swap/${type}`

    history.push(`${rootPath}/${poolAddress}/${tokenAddress}`)
  }

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardHeader>
          <TitleContainer>
            <IconButton media={back} onClick={() => {}} />
            <Title>Select token</Title>
          </TitleContainer>
          <Search
            placeholder="Name, ticker, address"
            value={q}
            handleChange={setQuery}
            height="38px"
          />
        </CardHeader>
        <CardList>
          {whitelisted.map((token) => (
            <TokenItem
              onClick={onSelect}
              key={token.address}
              tokenData={token}
            />
          ))}
        </CardList>
      </Card>
    </Container>
  )
}

export default TokenSelect
