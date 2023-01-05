import { memo, FC } from "react"
import { IconProps } from "consts/types"
import { motion } from "framer-motion"

const Emission: FC<IconProps> = ({ active }) => {
  return (
    <svg width={24} height={24} fill="none">
      <motion.path
        initial={active ? "active" : "default"}
        animate={active ? "active" : "default"}
        variants={{
          active: {
            fill: "#9AE2CB",
          },
          default: {
            fill: "#616D8B",
          },
        }}
        d="M20.242 9.259l-1.156 1.738a7.517 7.517 0 01-.206 7.123H5.854A7.518 7.518 0 0115.73 7.643l1.739-1.156A9.397 9.397 0 004.239 19.06a1.88 1.88 0 001.616.94H18.87a1.88 1.88 0 001.635-.94 9.397 9.397 0 00-.253-9.81l-.01.009z"
      />
      <motion.path
        initial={active ? "active" : "default"}
        animate={active ? "active" : "default"}
        variants={{
          active: {
            fill: "#9AE2CB",
          },
          default: {
            fill: "#616D8B",
          },
        }}
        d="M11.043 15.687a1.878 1.878 0 002.659 0l5.319-7.978-7.978 5.318a1.878 1.878 0 000 2.66z"
      />
    </svg>
  )
}

const MemoEmission = memo(Emission)
export default MemoEmission
