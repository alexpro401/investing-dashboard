import { FC, memo } from "react"

interface Props {
  direction: "asc" | "desc" | ""
}

const SortIcon: FC<Props> = ({ direction }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Arrow / Arrow_Down_Up">
        <g id="Group 427318790">
          <path
            id="Polygon 1"
            d="M11.6143 5.46767C11.8143 5.22519 12.1857 5.22519 12.3857 5.46767L15.6553 9.43186C15.9243 9.75798 15.6923 10.25 15.2696 10.25H8.73039C8.30766 10.25 8.07569 9.75798 8.34467 9.43186L11.6143 5.46767Z"
            fill={direction === "desc" ? "#9AE2CB" : "#6781BD"}
          />
          <path
            id="Polygon 2"
            d="M12.3857 18.5323C12.1857 18.7748 11.8143 18.7748 11.6143 18.5323L8.34467 14.5681C8.07569 14.242 8.30766 13.75 8.73039 13.75L15.2696 13.75C15.6923 13.75 15.9243 14.242 15.6553 14.5681L12.3857 18.5323Z"
            fill={direction === "asc" ? "#9AE2CB" : "#6781BD"}
          />
        </g>
      </g>
    </svg>
  )
}

const MemoSortIcon = memo(SortIcon)
export default MemoSortIcon
