import * as React from "react"
import { isNil } from "lodash"
import { format } from "date-fns"

import * as S from "./styled"
import { Icon } from "common"
import theme, { Flex, Text } from "theme"

import { DATE_FORMAT } from "constants/time"
import { ICON_NAMES } from "constants/icon-names"
import ExternalLink from "components/ExternalLink"
import { expandTimestamp, shortenAddress } from "utils"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"

const GovDelegateeCard: React.FC<{
  data: any
  chainId?: number
}> = ({ data, chainId }) => {
  const senderExplorerLink = React.useMemo(() => {
    if (isNil(chainId) || isNil(data)) return ""
    return getExplorerLink(chainId, data.from.id, ExplorerDataType.ADDRESS)
  }, [chainId, data])

  return (
    <S.Container href={senderExplorerLink}>
      <S.Content>
        <Flex full>
          <ExternalLink
            fz="13px"
            fw="500"
            color={theme.textColors.primary}
            href={senderExplorerLink}
          >
            {shortenAddress(data.from.id, 3)}
          </ExternalLink>
          <Flex ai={"center"} gap={"4"}>
            <Icon
              name={ICON_NAMES.arrow}
              color={
                data.isDelegate
                  ? theme.statusColors.success
                  : theme.statusColors.error
              }
              dir={data.isDelegate ? "top-right" : "bottom-left"}
            />
            <Text color={theme.textColors.primary} fz={13}>
              100 Votes
            </Text>
          </Flex>
          <Text color={theme.textColors.secondary} fz={13}>
            {format(expandTimestamp(data.timestamp.toString()), DATE_FORMAT)}
          </Text>
        </Flex>
      </S.Content>
    </S.Container>
  )
}

export default GovDelegateeCard
