import * as React from "react"
import { v4 as uuidv4 } from "uuid"
import { isEmpty, map, reduce } from "lodash"
import { useWeb3React } from "@web3-react/core"
import { Swiper, SwiperSlide } from "swiper/react"

import { Pagination } from "swiper"

import { Card } from "common"
import {
  AppButtonFull,
  SliderContainer,
  SliderHeader,
  TextLabel,
} from "../styled"
import DaoProfileTokenInTreasuryCard from "./DaoProfileTokenInTreasuryCard"

interface Props {
  tokens: Array<any>
}

const DaoProfileTokensInTreasuryCard: React.FC<Props> = ({ tokens }) => {
  const { chainId } = useWeb3React()
  const payload = React.useMemo(() => {
    if (isEmpty(tokens)) return []

    return reduce(
      tokens,
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
        if (tokens.length === index + 1 && acc[acc.length - 1].length === 1) {
          acc[acc.length - 1].push({ isFallback: true })
        }

        return acc
      },
      [] as Array<Array<any>>
    )
  }, [tokens])

  return (
    <Card>
      <SliderHeader>
        <TextLabel fw={500}>Token in treasury</TextLabel>
        <TextLabel fw={500}>Amount</TextLabel>
        <TextLabel fw={500} align="right">
          In treasury/used
        </TextLabel>
      </SliderHeader>

      <SliderContainer>
        <Swiper
          spaceBetween={16}
          pagination={{ clickable: true }}
          modules={[Pagination]}
        >
          {map(payload, (tokens) => (
            <SwiperSlide key={uuidv4()}>
              {map(tokens, (token) => (
                <DaoProfileTokenInTreasuryCard
                  key={uuidv4()}
                  token={token}
                  chainId={chainId}
                />
              ))}
            </SwiperSlide>
          ))}
        </Swiper>
      </SliderContainer>
      <AppButtonFull
        color="secondary"
        onClick={() => alert("Deposit dao treasury 💸")}
        text="Пополнить трежери DAO"
      />
    </Card>
  )
}

export default DaoProfileTokensInTreasuryCard
