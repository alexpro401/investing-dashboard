import { FC, useCallback, useEffect, useState } from "react"
import { ZERO } from "consts"
import Modal from "components/Modal"
import Tile from "./Tile"
import * as S from "./styled"

// TODO: replace with real images
const url =
  "https://public.nftstatic.com/static/nft/res/nft-cex/S3/1664823519694_jkjs8973ujyphjznjmmjd5h88tay9e0x.png"

interface Props {
  nftIds: string[]
  defaultValue: string[]
  isOpen: boolean
  handleSelect: (nfts: string[]) => void
  onClose: () => void
}

const NftSelect: FC<Props> = ({
  nftIds,
  defaultValue,
  isOpen,
  onClose,
  handleSelect,
}) => {
  const [selectedNfts, setSelectedNfts] = useState<string[]>(defaultValue)

  const onSelect = useCallback((id: string) => {
    setSelectedNfts((prev) => [...prev, id])
  }, [])

  const onDeselect = useCallback((id: string) => {
    setSelectedNfts((prev) => prev.filter((i) => i !== id))
  }, [])

  // reset selected in case when user de-selected delegated tokens and list was filtered
  useEffect(() => {
    setSelectedNfts(defaultValue)
  }, [defaultValue])

  return (
    <Modal
      maxWidth="fit-content"
      isOpen={isOpen}
      toggle={onClose}
      title={"Choose ERC-721 "}
    >
      <S.Container>
        {nftIds.map((nft) => (
          <Tile
            isSelected={selectedNfts.includes(nft)}
            onSelect={onSelect}
            onDeselect={onDeselect}
            key={nft}
            votingPower={ZERO}
            tokenId={nft}
            tokenUri={url}
          />
        ))}
      </S.Container>
      <S.Button
        disabled={!selectedNfts.length && !defaultValue.length}
        type="button"
        size="large"
        onClick={() => handleSelect(selectedNfts)}
        text={`Choose ${
          !!selectedNfts.length ? `${selectedNfts.length} ` : ""
        }ERC-721`}
      />
    </Modal>
  )
}

export default NftSelect
