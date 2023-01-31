import React, { useContext } from "react"
import { map } from "lodash"
import { format } from "date-fns"
import { v4 as uuidv4 } from "uuid"

import { Flex } from "theme"
import { Card, Icon } from "common"
import TabFallback from "../TabFallback"

import ExternalLink from "components/ExternalLink"

import extractRootDomain from "utils/extractRootDomain"
import { DATE_FORMAT } from "consts/time"
import { ICON_NAMES } from "consts/icon-names"
import { GovPoolProfileCommonContext } from "context/govPool/GovPoolProfileCommonContext/GovPoolProfileCommonContext"

import { Divider, TextLabel, TextValue } from "../../styled"

interface IDaoProfileTabAboutProps {
  creationTime: number | undefined
}

const DaoProfileTabAbout: React.FC<IDaoProfileTabAboutProps> = ({
  creationTime,
}) => {
  const { descriptionObject } = useContext(GovPoolProfileCommonContext)

  if (descriptionObject === undefined) return <TabFallback />

  if (descriptionObject === null) {
    return (
      <Card>
        <TextValue lh="19.5px">
          <p>Цей ДАО пул має не валідний опис.</p>
          <br />
          <p>
            Будь ласка створіть пропоузал на зміну налаштувань дао пула, щоб
            заповнити дану інформацію.
          </p>
        </TextValue>
      </Card>
    )
  }

  const { description, documents, socialLinks, websiteUrl } = descriptionObject

  return (
    <Card>
      <TextValue lh="19.5px">
        <p>{description}</p>
      </TextValue>
      <Divider />
      {creationTime && !isNaN(creationTime) && (
        <Flex full ai="center" jc="space-between">
          <TextLabel>Creation day</TextLabel>
          <TextValue>
            {format(new Date(creationTime * 1000), DATE_FORMAT)}
          </TextValue>
        </Flex>
      )}
      <Flex full ai="center" jc="space-between">
        <TextLabel>DAO site</TextLabel>
        <ExternalLink href={websiteUrl} color="#2669EB">
          {extractRootDomain(websiteUrl)}
        </ExternalLink>
      </Flex>
      {map(documents, (document) => (
        <Flex key={uuidv4()} full ai="center" jc="space-between">
          <TextLabel>{document.name}</TextLabel>
          <ExternalLink href={document.url} color="#2669EB">
            {extractRootDomain(document.url)}
          </ExternalLink>
        </Flex>
      ))}
      {socialLinks.filter((el) => !!el[1]).length > 6 && (
        <>
          <Divider />
          {socialLinks
            .slice(5)
            .filter((el) => !!el[1])
            .map((customSocialLink) => (
              <Flex key={uuidv4()} full ai="center" jc="space-between">
                <TextLabel></TextLabel>
                <ExternalLink href={customSocialLink[1]} color="#2669EB">
                  {extractRootDomain(customSocialLink[1])}
                </ExternalLink>
              </Flex>
            ))}
        </>
      )}
      {socialLinks.length !== 0 &&
        socialLinks.slice(0, 5).filter((el) => !!el[1]) && (
          <>
            <Divider />
            <Flex full ai="center" jc="space-around">
              {socialLinks
                .slice(0, 5)
                .filter((el) => !!el[1])
                .map(([tag, url]) => (
                  <ExternalLink
                    key={uuidv4()}
                    href={url}
                    color="#788AB4"
                    removeIcon
                  >
                    <Icon name={ICON_NAMES[tag]} />
                  </ExternalLink>
                ))}
            </Flex>
          </>
        )}
    </Card>
  )
}

export default DaoProfileTabAbout
