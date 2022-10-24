import { FC } from "react"

const ModalCloseIcon: FC = ({ ...rest }) => {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <rect width="26" height="26" rx="9" fill="#141926" />
      <path
        d="M16.399 17.601C16.7309 17.933 17.2691 17.933 17.601 17.601C17.933 17.2691 17.933 16.7309 17.601 16.399L16.399 17.601ZM13 13L12.399 12.399C12.2396 12.5584 12.15 12.7746 12.15 13C12.15 13.2254 12.2396 13.4416 12.399 13.601L13 13ZM17.601 9.60104C17.933 9.2691 17.933 8.7309 17.601 8.39896C17.2691 8.06701 16.7309 8.06701 16.399 8.39896L17.601 9.60104ZM17.601 16.399L13.601 12.399L12.399 13.601L16.399 17.601L17.601 16.399ZM13.601 13.601L17.601 9.60104L16.399 8.39896L12.399 12.399L13.601 13.601Z"
        fill="#788AB4"
      />
      <path
        d="M9.60104 8.39896C9.2691 8.06701 8.7309 8.06702 8.39896 8.39896C8.06701 8.73091 8.06701 9.2691 8.39896 9.60104L9.60104 8.39896ZM13 13L13.601 13.601C13.933 13.2691 13.933 12.7309 13.601 12.399L13 13ZM8.39896 16.399C8.06701 16.7309 8.06701 17.2691 8.39896 17.601C8.73091 17.933 9.2691 17.933 9.60104 17.601L8.39896 16.399ZM8.39896 9.60104L12.399 13.601L13.601 12.399L9.60104 8.39896L8.39896 9.60104ZM12.399 12.399L8.39896 16.399L9.60104 17.601L13.601 13.601L12.399 12.399Z"
        fill="#788AB4"
      />
    </svg>
  )
}

export default ModalCloseIcon
