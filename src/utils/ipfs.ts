import axios from "axios"
import { create } from "ipfs-http-client"
import { Buffer } from "buffer"

export interface AddResult {
  cid: any
  size: number
  path: string
  mode?: number
  mtime?: any
}

const auth =
  "Basic " +
  Buffer.from(
    process.env.REACT_APP_IPFS_PROJECT_ID +
      ":" +
      process.env.REACT_APP_IPFS_PROJECT_SECRET
  ).toString("base64")

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
})

export const blobToBase64 = (blob): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onloadend = function () {
      resolve(reader.result)
    }
  })
}

const stringify = (json) => {
  try {
    return JSON.stringify(json)
  } catch (e) {
    return ""
  }
}

export const parseIpfsString = (ipfsString: string): string => {
  return ipfsString.replace("ipfs://", "")
}

export const getIpfsData = async (hash) => {
  try {
    if (!!hash && hash.length === 46) {
      const res = await axios.post(
        `https://ipfs.infura.io:5001/api/v0/cat?arg=${hash}`,
        {},
        {
          headers: {
            authorization: auth,
          },
        }
      )
      return res.data
    }
  } catch (e) {
    console.log(e)
    return false
  }
}

export const addInsuranceProposalData = (payload) => {
  const data = {
    ...payload,
    timestamp: new Date().getTime() / 1000,
  }
  const dataString = stringify(data)

  return client.add(dataString)
}

export const addDaoProposalData = ({
  proposalName,
  proposalDescription,
}: {
  proposalName: string
  proposalDescription: string
}) => {
  const data = {
    proposalName,
    proposalDescription,
    timestamp: new Date().getTime() / 1000,
  }
  const dataToString = stringify(data)

  return client.add(dataToString)
}
