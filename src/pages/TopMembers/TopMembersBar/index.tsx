import { FC, HTMLAttributes } from "react"

import Header from "components/Header/Layout"

import { ITab } from "interfaces"

interface Props extends HTMLAttributes<HTMLDivElement> {
  tabs: ITab[]
}

const TopMembersBar: FC<Props> = ({ tabs }) => {
  return (
    <>
      <Header tabs={tabs}>Top funds</Header>
    </>
  )
}

export default TopMembersBar
