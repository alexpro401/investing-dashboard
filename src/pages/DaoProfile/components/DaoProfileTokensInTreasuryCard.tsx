import React, { useContext, useMemo } from "react"
import { v4 as uuidv4 } from "uuid"
import { isEmpty, map, reduce } from "lodash"
import { useWeb3React } from "@web3-react/core"
import { Swiper, SwiperSlide } from "swiper/react"
import { BigNumber } from "@ethersproject/bignumber"

import { Pagination } from "swiper"
import { useBreakpoints } from "hooks"
import DaoProfileTokenInTreasuryCard from "./DaoProfileTokenInTreasuryCard"
import { GovPoolProfileCommonContext } from "context/govPool/GovPoolProfileCommonContext/GovPoolProfileCommonContext"
import { formatTokenNumber, formatFiatNumber } from "utils"

import {
  AppButtonFull,
  SliderContainer,
  SliderHeader,
  TextLabel,
  TreasuryEmptyText,
  DaoTreasuryCardWrap,
  TreasuryDesktopTokensHolder,
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

const FAKE_LOADING_RECORD = (id: string): ITokenView => ({
  type: "nft",
  logo: "",
  symbol: "",
  amount: "",
  amountUsd: "",
  treasuryPercent: "",
  address: "",
  isFallback: true,
  id: id,
})

const DaoProfileTokensInTreasuryCard: React.FC = () => {
  const { chainId } = useWeb3React()
  const { isBigTablet } = useBreakpoints()
  const { treasuryLoading, treasuryNftCollections, treasuryTokens } =
    useContext(GovPoolProfileCommonContext)

  const FAKE_LOADING_TREASURY = useMemo(() => {
    if (isBigTablet) {
      return [
        FAKE_LOADING_RECORD(uuidv4()),
        FAKE_LOADING_RECORD(uuidv4()),
        FAKE_LOADING_RECORD(uuidv4()),
      ]
    } else return [FAKE_LOADING_RECORD(uuidv4()), FAKE_LOADING_RECORD(uuidv4())]
  }, [isBigTablet])

  const SECTION_SIZE = useMemo(() => 2, [])

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
          el.contract_decimals,
          6
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

        if (acc[acc.length - 1].length < SECTION_SIZE) {
          acc[acc.length - 1].push(token)
          return acc
        }

        acc.push([token])

        // If tokens length is odd then add one empty item for correct swiping from last screen
        if (
          commonArray.length === index + 1 &&
          acc[acc.length - 1].length === 1 &&
          !isBigTablet
        ) {
          acc[acc.length - 1].push(FAKE_LOADING_RECORD(uuidv4()))
        }

        return acc
      },
      [] as Array<Array<ITokenView>>
    )
  }, [treasuryNftCollections, treasuryTokens, SECTION_SIZE, isBigTablet])

  const treasuryIsEmpty = useMemo(
    () => !treasuryLoading && payload.flat().length === 0,
    [treasuryLoading, payload]
  )

  return (
    <DaoTreasuryCardWrap>
      <SliderHeader>
        <TextLabel fw={500}>
          Token in treasury{" "}
          {isBigTablet
            ? `- ${treasuryTokens.length + treasuryNftCollections.length}`
            : ""}
        </TextLabel>
        <TextLabel fw={500}>Amount</TextLabel>
        {isBigTablet && <TextLabel fw={500}>Amount in $</TextLabel>}
        <TextLabel fw={500} align="right">
          In treasury
        </TextLabel>
      </SliderHeader>

      <SliderContainer>
        {!isBigTablet && (
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
        )}
        {isBigTablet && (
          <TreasuryDesktopTokensHolder>
            {treasuryLoading && (
              <>
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
              </>
            )}
            {!treasuryLoading &&
              payload.flat().length !== 0 &&
              map(payload.flat(), (token) => (
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
            {treasuryIsEmpty && (
              <TreasuryEmptyText>
                Текст: зараз ДАО тережері нульовий
              </TreasuryEmptyText>
            )}
          </TreasuryDesktopTokensHolder>
        )}
      </SliderContainer>
      {!treasuryLoading && (
        <AppButtonFull
          color="secondary"
          onClick={() => alert("Deposit dao treasury 💸")}
          text="Поповнити трежері DAO"
        />
      )}
    </DaoTreasuryCardWrap>
  )
}

export default DaoProfileTokensInTreasuryCard
