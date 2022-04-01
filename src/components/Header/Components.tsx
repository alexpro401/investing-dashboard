/**
 * Components which are used in Header
 */
import { Dispatch, SetStateAction } from "react"
import { ITopMembersFilters } from "constants/interfaces"
import IconSearch from "components/IconSearch"

import { ClickableArea, IconButton, PortraitsPlus } from "./styled"

import filtersIcon from "assets/icons/filters.svg"
import link from "assets/icons/link.svg"
import goBack from "assets/icons/pagination-prev.svg"
import people from "assets/icons/people.svg"
import more from "assets/icons/more-menu.svg"

interface IFiltersProps {
  onClick: () => void
}
export const Filters = ({ onClick }: IFiltersProps) => {
  return (
    <ClickableArea onClick={onClick}>
      <IconButton src={filtersIcon} />
    </ClickableArea>
  )
}

interface IProfilesProps {}
export const Profiles = ({}: IProfilesProps) => {
  return (
    <ClickableArea onClick={() => {}}>
      <IconButton src={people} />
    </ClickableArea>
  )
}

interface IGoBackProps {}
export const GoBack = ({}: IGoBackProps) => {
  return (
    <ClickableArea onClick={() => {}}>
      <IconButton src={goBack} />
    </ClickableArea>
  )
}

interface IPortaitsProps {}
export const Portaits = ({}: IPortaitsProps) => {
  return <PortraitsPlus>+</PortraitsPlus>
}

interface ILinkProps {}
export const Link = ({}: ILinkProps) => {
  return (
    <ClickableArea onClick={() => {}}>
      <IconButton src={link} />
    </ClickableArea>
  )
}

interface ISearchProps {
  onClick: () => void
  toggle: Dispatch<SetStateAction<boolean>>
  isSearchActive: boolean
  filters: ITopMembersFilters
  dispatchFilter: (field: string, value: string) => void
}
export const Search = ({
  onClick,
  toggle,
  isSearchActive,
  filters,
  dispatchFilter,
}: ISearchProps) => {
  return (
    <IconSearch
      q={filters.query}
      onChange={(q) => dispatchFilter("query", q)}
      onClick={onClick}
      active={isSearchActive}
      toggle={toggle}
    />
  )
}

interface IMoreProps {}
export const More = ({}: IMoreProps) => {
  return (
    <ClickableArea onClick={() => {}}>
      <IconButton src={more} />
    </ClickableArea>
  )
}
