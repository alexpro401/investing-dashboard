import { FC, useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Center } from "theme"
import { GuardSpinner } from "react-spinners-kit"

import Header from "components/Header/Layout"
import Icon from "components/Icon"
import Button from "components/Button"

import {
  useTraderPoolContract,
  useTraderPoolRegistryContract,
} from "hooks/useContract"
import { PoolType } from "constants/types"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"

import { shortenAddress } from "utils"

import LinkImg from "assets/icons/link.svg"
import GreenCheck from "assets/icons/green-check.svg"
import facebook from "assets/icons/facebook.svg"
import twitter from "assets/icons/twitter.svg"
import telegram from "assets/icons/telegram.svg"

import {
  SuccessContainer,
  Body,
  IconContainer,
  AddressContainer,
  Address,
  TopSideContent,
  Title,
  CenterSideContent,
  Subtitle,
  ListDiv,
  Check,
  BottomSideContent,
  BottomTitle,
  ShareIcons,
  FacebookIcon,
  TwitterIcon,
  TelegramIcon,
  ButtonsContainer,
} from "./styled"

interface SuccessProps {}

const CheckList = [
  "Listable on Exchandges",
  "Smart Contract Ready",
  "Borderless Transactions",
]

const Success: FC<SuccessProps> = () => {
  const { poolAddress } = useParams()
  const navigate = useNavigate()

  const [poolInfo, setPoolInfo] = useState<IPoolInfo | null>(null)
  const [, setPoolType] = useState<PoolType | null>(null)

  const traderPool = useTraderPoolContract(poolAddress)
  const traderPoolRegistry = useTraderPoolRegistryContract()

  const [{ poolMetadata }] = usePoolMetadata(
    poolAddress,
    poolInfo?.parameters.descriptionURL
  )

  const getPoolInfo = useCallback(async () => {
    if (!traderPool) return

    const info = await traderPool.getPoolInfo()
    setPoolInfo(info)
  }, [traderPool])

  // get pool info
  useEffect(() => {
    getPoolInfo()
  }, [getPoolInfo])

  useEffect(() => {
    if (!traderPoolRegistry) return
    ;(async () => {
      const isBase = await traderPoolRegistry.isBasicPool(poolAddress)
      setPoolType(isBase ? "BASIC_POOL" : "INVEST_POOL")
    })()
  }, [traderPoolRegistry, poolAddress])

  const handleDepositRedirect = () => {
    navigate(`/pool/invest/${poolAddress}`)
  }

  if (!poolInfo) {
    return (
      <Center>
        <GuardSpinner size={40} loading />
      </Center>
    )
  }

  return (
    <>
      <Header>Success</Header>
      <SuccessContainer>
        <Body>
          <IconContainer>
            <Icon
              m="0"
              size={110}
              address={poolAddress}
              source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
            />
          </IconContainer>

          <TopSideContent>
            <AddressContainer
              href={`https://bscscan.com/address/${poolAddress}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Address>{shortenAddress(poolAddress)}</Address>
              <img src={LinkImg} alt="link" />
            </AddressContainer>
            <Title>{poolInfo.name}</Title>
          </TopSideContent>

          <CenterSideContent>
            {CheckList.map((item) => (
              <ListDiv key={item}>
                <Check>
                  <img src={GreenCheck} alt="green check" />
                </Check>
                <Subtitle>{item}</Subtitle>
              </ListDiv>
            ))}
          </CenterSideContent>

          <BottomSideContent>
            <BottomTitle>Share my fund</BottomTitle>
            <ShareIcons>
              <FacebookIcon>
                <img src={facebook} alt="facebook" />
              </FacebookIcon>
              <TwitterIcon>
                <img src={twitter} alt="twitter" />
              </TwitterIcon>
              <TelegramIcon>
                <img src={telegram} alt="telegram" />
              </TelegramIcon>
            </ShareIcons>
          </BottomSideContent>

          <ButtonsContainer>
            <Button onClick={handleDepositRedirect} size="large" full>
              Deposit funds
            </Button>
          </ButtonsContainer>
        </Body>
      </SuccessContainer>
    </>
  )
}

export default Success
