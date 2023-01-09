import { FC, ReactNode, useMemo } from "react"
import { isNil } from "lodash"

import { useUserMetadata } from "state/ipfsMetadata/hooks"

import { Flex, Text } from "theme"
import Avatar from "components/Avatar"
import Skeleton from "components/Skeleton"
import { shortenAddress } from "utils"
import { useBreakpoints } from "hooks"

interface Props {
  account?: string | null
  children?: ReactNode
}

const AccountInfo: FC<Props> = ({ account, children }) => {
  const { isMobile } = useBreakpoints()

  const [{ loading, userName, userAvatar }] = useUserMetadata(account)

  const name = useMemo(() => {
    if (isNil(userName)) return ""

    return userName.length > 15 ? shortenAddress(userName, 7) : userName
  }, [userName])

  const _isMobile = useMemo(() => {
    if (isNil(isMobile)) return false
    return isMobile
  }, [isMobile])

  const iconSize = _isMobile ? 38 : 100

  if (loading) {
    return (
      <Flex ai="center" jc="flex-start">
        <Skeleton variant="circle" w={`${iconSize}px`} h={`${iconSize}px`} />
        <Flex dir="column" ai="flex-start" jc="space-between" m="0 0 0 10px">
          <Skeleton variant="text" h="21px" w="121px" />
          {!isNil(children) && (
            <Skeleton variant="text" h="17px" w="50px" m="4px 0 0" />
          )}
        </Flex>
      </Flex>
    )
  }

  return (
    <Flex ai="center" jc="flex-start">
      <Avatar size={iconSize} url={userAvatar} address={account} />
      <Flex p="0 0 0 10px" dir="column" ai="flex-start">
        <Text color="#ffffff" fz={16} lh="19px" fw={600}>
          {name}
        </Text>
        {children}
      </Flex>
    </Flex>
  )
}

export default AccountInfo
