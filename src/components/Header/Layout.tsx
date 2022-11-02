import { FC, ReactNode } from "react"

import HeaderTabs from "components/Header/Tabs"
import { More, GoBack } from "./Components"

import { Container, Bar, Icons, Title } from "./styled"
import { ITab } from "interfaces"

interface Props {
  left?: ReactNode
  right?: ReactNode
  tabs?: ITab[]
  children?: ReactNode
}

const Layout: FC<Props> = ({ children, left, right, tabs }) => {
  return (
    <>
      <Container
        initial={{ y: -102 }}
        animate={{ y: 0 }}
        exit={{ y: -102 }}
        transition={{ duration: 0.4, ease: [0.29, 0.98, 0.29, 1] }}
      >
        <Bar>
          <Icons>{left || <GoBack />}</Icons>
          <Title>{children}</Title>
          <Icons>
            {right}
            <More />
          </Icons>
        </Bar>
        {tabs !== undefined && !!tabs.length && <HeaderTabs tabs={tabs} />}
      </Container>
    </>
  )
}

export default Layout
