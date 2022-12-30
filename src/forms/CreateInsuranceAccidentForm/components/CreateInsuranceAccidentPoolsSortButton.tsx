import { FC } from "react"
import { Icon } from "common"
import { ICON_NAMES } from "consts/icon-names"
import { CreateInsuranceAccidentPoolsStyled as CIAPools } from "forms/CreateInsuranceAccidentForm/styled"

interface Props {
  filter?: "ask" | "desc"
  onClick: () => void
}

const CreateInsuranceAccidentPoolsSortButton: FC<Props> = ({
  onClick,
  filter,
}) => {
  return (
    <CIAPools.SortButton onClick={onClick}>
      <span>TVL</span>
      <CIAPools.SortButtonIconsWrp dir="column" gap="2" ai="center">
        <Icon
          name={ICON_NAMES.arrowUpFilled}
          color={filter === "ask" ? "#9ae2cb" : "inherit"}
        />
        <Icon
          name={ICON_NAMES.arrowDownFilled}
          color={filter === "desc" ? "#9ae2cb" : "inherit"}
        />
      </CIAPools.SortButtonIconsWrp>
    </CIAPools.SortButton>
  )
}

export default CreateInsuranceAccidentPoolsSortButton
