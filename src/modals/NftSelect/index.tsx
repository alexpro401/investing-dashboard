import Modal from "components/Modal"
import Tile from "./Tile"
import * as S from "./styled"
import { INftTile } from "interfaces/exchange"
import { ZERO } from "constants/index"

const dummyNFTData: INftTile[] = [
  {
    votingPower: ZERO,
    tokenId: "1",
    tokenUri:
      "https://public.nftstatic.com/static/nft/res/nft-cex/S3/1664823519694_jkjs8973ujyphjznjmmjd5h88tay9e0x.png",
  },
]

const NftSelect = () => {
  return (
    <Modal
      maxWidth="fit-content"
      isOpen
      toggle={() => {}}
      title={"Choose ERC-721 "}
    >
      <S.Container>
        {dummyNFTData.map((nft) => (
          <Tile key={nft.tokenId} {...nft} />
        ))}
      </S.Container>
      <S.Button
        type="button"
        size="large"
        onClick={() => {}}
        text={"Choose 2 ERC-721"}
      />
    </Modal>
  )
}

export default NftSelect
