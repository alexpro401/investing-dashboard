import { FC, ReactNode, useCallback, useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import * as S from "./styled"

interface ITab {
  name: ReactNode
  child: ReactNode
}

interface IProps {
  tabs: Array<ITab>
  initialTab?: number
  onChangeTab?: ({ name, index }: { name: ReactNode; index: number }) => void
  gap?: number
}

const Tabs: FC<IProps> = ({
  tabs,
  initialTab = 0,
  onChangeTab,
  gap,
  ...rest
}) => {
  const [activeTab, setTab] = useState(initialTab)

  useEffect(() => {
    setTab(initialTab)
  }, [initialTab])

  const handleSelectTab = useCallback(
    (index: number) => {
      setTab(index)

      if (onChangeTab && tabs[index]) {
        onChangeTab({ name: tabs[index].name, index })
      }
    },
    [onChangeTab, tabs]
  )

  return (
    <S.Container {...rest}>
      <S.List count={tabs.length} gap={gap}>
        {tabs.map(({ name }, index) => {
          return (
            <S.Tab
              onClick={() => handleSelectTab(index)}
              active={activeTab === index}
              key={uuidv4()}
            >
              {name}
            </S.Tab>
          )
        })}
      </S.List>
      <S.Content>{tabs[activeTab].child}</S.Content>
    </S.Container>
  )
}

export default Tabs
