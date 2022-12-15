import React, { useContext, useMemo } from "react"
import { v4 as uuidv4 } from "uuid"
import { isEmpty, map, reduce } from "lodash"
import { useWeb3React } from "@web3-react/core"
import { Swiper, SwiperSlide } from "swiper/react"
import { BigNumber } from "@ethersproject/bignumber"

import { Pagination } from "swiper"

import { Card } from "common"
import DaoProfileTokenInTreasuryCard from "./DaoProfileTokenInTreasuryCard"
import { GovPoolProfileCommonContext } from "context/govPool/GovPoolProfileCommonContext/GovPoolProfileCommonContext"
import { formatTokenNumber, formatFiatNumber } from "utils"

import {
  AppButtonFull,
  SliderContainer,
  SliderHeader,
  TextLabel,
  TreasuryEmptyText,
} from "../styled"

interface ITokenView {
  type: "nft" | "token"
  logo: string
  symbol: string
  amount: string
  amountUsd: string
  treasuryPercent: string
  isFallback?: boolean
  address: string
  id: string
}

const FAKE_LOADING_TREASURY: Array<ITokenView> = [
  {
    type: "nft",
    logo: "",
    symbol: "",
    amount: "",
    amountUsd: "",
    treasuryPercent: "",
    address: "",
    isFallback: true,
    id: uuidv4(),
  },
  {
    type: "nft",
    logo: "",
    symbol: "",
    amount: "",
    amountUsd: "",
    treasuryPercent: "",
    address: "",
    isFallback: true,
    id: uuidv4(),
  },
]

const DaoProfileTokensInTreasuryCard: React.FC = () => {
  const { chainId } = useWeb3React()
  const { treasuryLoading, treasuryNftCollections, treasuryTokens } =
    useContext(GovPoolProfileCommonContext)

  const payload = useMemo(() => {
    if (isEmpty(treasuryNftCollections) && isEmpty(treasuryTokens)) return []

    const totalPrice = treasuryTokens.reduce(
      (acc, el) => acc + Number(el.quote),
      0
    )

    const commonArray = treasuryTokens
      .map<ITokenView>((el) => ({
        type: "token",
        logo: el.logo_url,
        symbol: el.contract_ticker_symbol,
        amount: formatTokenNumber(
          BigNumber.from(el.balance),
          el.contract_decimals
        ),
        amountUsd: formatFiatNumber(el.quote),
        treasuryPercent:
          totalPrice === 0 ? "0" : (Number(el.quote) / totalPrice).toFixed(2),
        address: el.contract_address,
        id: uuidv4(),
      }))
      .concat(
        treasuryNftCollections.map<ITokenView>((el) => ({
          type: "nft",
          logo: el.logo,
          symbol: el.symbol,
          amount: el.count.toString(),
          amountUsd: "-",
          treasuryPercent: "-",
          address: el.address,
          id: uuidv4(),
        }))
      )

    return reduce(
      commonArray,
      function (acc, token, index) {
        if (isEmpty(acc)) {
          acc.push([token])
          return acc
        }

        if (acc[acc.length - 1].length < 2) {
          acc[acc.length - 1].push(token)
          return acc
        }

        acc.push([token])

        // If tokens length is odd then add one empty item for correct swiping from last screen
        if (
          commonArray.length === index + 1 &&
          acc[acc.length - 1].length === 1
        ) {
          acc[acc.length - 1].push({
            amount: "0",
            amountUsd: "0",
            logo: "",
            symbol: "LOAD",
            treasuryPercent: "0",
            type: "token",
            address: "",
            isFallback: true,
            id: uuidv4(),
          })
        }

        return acc
      },
      [] as Array<Array<ITokenView>>
    )
  }, [treasuryNftCollections, treasuryTokens])

  const treasuryIsEmpty = useMemo(
    () => !treasuryLoading && payload.flat().length === 0,
    [treasuryLoading, payload]
  )

  return (
    <Card>
      <SliderHeader>
        <TextLabel fw={500}>Token in treasury</TextLabel>
        <TextLabel fw={500}>Amount</TextLabel>
        <TextLabel fw={500} align="right">
          In treasury
        </TextLabel>
      </SliderHeader>

      <SliderContainer>
        <Swiper
          spaceBetween={16}
          pagination={{ clickable: true }}
          modules={[Pagination]}
          style={treasuryIsEmpty ? { padding: "20px 0" } : undefined}
        >
          {treasuryLoading && (
            <SwiperSlide>
              {map(FAKE_LOADING_TREASURY, (token) => (
                <DaoProfileTokenInTreasuryCard
                  key={token.id}
                  address={token.address}
                  amount={token.amount}
                  amountUsd={token.amountUsd}
                  type={token.type}
                  logo={token.logo}
                  chainId={chainId}
                  isFallback={token.isFallback ?? false}
                  symbol={token.symbol}
                  treasuryPercent={token.treasuryPercent}
                />
              ))}
            </SwiperSlide>
          )}
          {!treasuryLoading &&
            payload.flat().length !== 0 &&
            map(payload, (tokens, index) => (
              <SwiperSlide key={index}>
                {map(tokens, (token) => (
                  <DaoProfileTokenInTreasuryCard
                    key={token.id}
                    address={token.address}
                    amount={token.amount}
                    amountUsd={token.amountUsd}
                    type={token.type}
                    logo={token.logo}
                    chainId={chainId}
                    isFallback={token.isFallback ?? false}
                    symbol={token.symbol}
                    treasuryPercent={token.treasuryPercent}
                  />
                ))}
              </SwiperSlide>
            ))}
          {treasuryIsEmpty && (
            <TreasuryEmptyText>
              Текст: зараз ДАО тережері нульовий
            </TreasuryEmptyText>
          )}
        </Swiper>
      </SliderContainer>
      {!treasuryLoading && (
        <AppButtonFull
          color="secondary"
          onClick={() => alert("Deposit dao treasury 💸")}
          text="Пополнить трежери DAO"
        />
      )}
    </Card>
  )
}

export default DaoProfileTokensInTreasuryCard
