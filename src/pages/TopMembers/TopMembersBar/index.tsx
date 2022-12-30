import { FC, HTMLAttributes, useState } from "react"
import { Flex } from "theme"
import { titleVariants } from "motion/variants"

import Header from "components/Header/Layout"
import { Filters, Search } from "components/Header/Components"
import TradersSort from "components/TradersSort"

import { ITab } from "interfaces"
import { usePoolsFilters } from "state/pools/hooks"

interface Props extends HTMLAttributes<HTMLDivElement> {
  tabs: ITab[]
}

const TopMembersBar: FC<Props> = ({ tabs }) => {
  const [filters, dispatchFilter] = usePoolsFilters()
  const [isFiltersActive, setFiltersActive] = useState(false)
  const [isSearchActive, setSearchActive] = useState(filters.query !== "")

  const handleFiltersClick = () => !isFiltersActive && setFiltersActive(true)
  const handleSearchClick = () => !isSearchActive && setSearchActive(true)

  return (
    <>
      <Header
        tabs={tabs}
        left={
          <Filters onClick={handleFiltersClick}>
            <TradersSort
              handleClose={() => setFiltersActive(false)}
              isOpen={isFiltersActive}
            />
          </Filters>
        }
        right={
          <Search
            onClick={handleSearchClick}
            toggle={setSearchActive}
            isSearchActive={isSearchActive}
            filters={filters}
            dispatchFilter={dispatchFilter}
          />
        }
      >
        <Flex
          initial="visible"
          animate={isSearchActive ? "hidden" : "visible"}
          variants={titleVariants}
          transition={{ duration: 0.1, ease: [0.29, 0.98, 0.29, 1] }}
        >
          Top funds
        </Flex>
      </Header>
    </>
  )
}

export default TopMembersBar
