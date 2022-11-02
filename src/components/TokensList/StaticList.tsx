import { DefaultTokenIcon } from "components/TokenIcon"
import { TokenList } from "lib/token-list"
import { FC } from "react"
import { Flex } from "theme"
import * as S from "./styled"

interface Props {
  list: TokenList
  url: string
}

const StaticList: FC<Props> = (props) => {
  const { list, url } = props

  return (
    <S.StaticListCard>
      <S.StaticListCardContent>
        <DefaultTokenIcon m="0" size={34} symbol={list.name} />
        <S.StaticListCardInfo>
          <Flex gap="4">
            <S.StaticListCardName>{list.name}</S.StaticListCardName>
            <S.StaticListCardTokens>
              {list.tokens.length} tokens
            </S.StaticListCardTokens>
          </Flex>
          <S.StaticListCardLink
            href={url}
            target="_blank"
            rel="noopener noreply"
          >
            {url}
          </S.StaticListCardLink>
        </S.StaticListCardInfo>
      </S.StaticListCardContent>
    </S.StaticListCard>
  )
}

export default StaticList
