import * as React from "react"
import { map } from "lodash"
import { v4 as uuidv4 } from "uuid"

import { Flex } from "theme"
import { Card, Icon } from "common"
import { Divider, TextValue } from "../styled"

import ExternalLink from "components/ExternalLink"

import { shortenAddress } from "utils"
import { ICON_NAMES } from "constants/icon-names"

const links = [
  {
    name: "DAO site",
    url: "http://111pg.io/",
  },
  {
    name: "Privacy",
    url: "http://111pg.io/",
  },
  {
    name: "Terms",
    url: "http://111pg.io/",
  },
  {
    name: "DOC Name",
    url: "http://111pg.io/",
  },
]

const customSocials = [
  {
    name: "DAO Link",
    url: "http://111pg.io/",
  },
  {
    name: "WeChat",
    url: "http://111pg.io/",
  },
]

const socials = [
  {
    name: "telegram",
    url: "https://t.me",
  },
  {
    name: "twitter",
    url: "https://twitter.com",
  },
  {
    name: "medium",
    url: "https://medium.com",
  },
  {
    name: "facebook",
    url: "https://facebook.com",
  },
  {
    name: "github",
    url: "https://github.com",
  },
]

const DaoProfileTabAbout: React.FC = () => {
  return (
    <>
      <Card>
        <TextValue lh="19.5px">
          <p>
            The 111PG DAO was founded by its 111 members to protect and help
            fintech startups go to the DeFi market.
          </p>
          <br />
          <p>
            DAO is governed by 111 NFT heads, which may have various statuses
            such as: alive, dying, and dead. As it gets weaker, the NFT look
            deteriorates. Keeping the head alive takes 111PG tokens. The weaker
            the NFT, the less voting power in the DAO and the less you earn from
            the Treasury.
          </p>
          <br />
          <p>
            If you don’t, it will lose 1% of its power daily, with the lost
            value being distributed among all the other living heads (aka, all
            the other active 111PG NFTs). This creates a strong incentive to
            keep the NFT in good shape and a big chunk of 111PG tokens out of
            active circulation = scarcity and long-term value alignment.
          </p>
        </TextValue>
        <Divider />
        {map(links, (link) => (
          <Flex key={uuidv4()} full ai="center" jc="space-between">
            <TextValue>{link.name}</TextValue>
            <ExternalLink href={link.url} color="#2669EB">
              {shortenAddress(link.url, 8)}
            </ExternalLink>
          </Flex>
        ))}
        <Divider />
        {map(customSocials, (link) => (
          <Flex key={uuidv4()} full ai="center" jc="space-between">
            <TextValue>{link.name}</TextValue>
            <ExternalLink href={link.url} color="#2669EB">
              {shortenAddress(link.url, 8)}
            </ExternalLink>
          </Flex>
        ))}
        <Divider />
        <Flex full ai="center" jc="space-between">
          {map(socials, (link) => (
            <ExternalLink
              key={uuidv4()}
              href={link.url}
              color="#788AB4"
              removeIcon
            >
              <Icon name={ICON_NAMES[link.name]} />
            </ExternalLink>
          ))}
        </Flex>
      </Card>
    </>
  )
}

export default DaoProfileTabAbout
