import { ImportCandidate } from "ipfs-core-types/src/utils"
import { Buffer } from "buffer"
import { create } from "ipfs-http-client"
import axios from "axios"

const auth =
  "Basic " +
  Buffer.from(
    process.env.REACT_APP_IPFS_PROJECT_ID +
      ":" +
      process.env.REACT_APP_IPFS_PROJECT_SECRET
  ).toString("base64")

export class IpfsEntity<T> {
  _rawData?: T
  _path?: string
  _client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  })
  _axios = axios.create({
    baseURL: "https://ipfs.infura.io:5001",
    headers: {
      authorization: auth,
    },
  })

  constructor(args: { data?: T; path?: string }) {
    const { data, path } = args

    this._rawData = data
    this._path = path
  }

  static convertFileToBase64(file: File | Blob): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = function () {
        resolve(reader.result as string)
      }
    })
  }

  async uploadSelf(): Promise<void> {
    if (!this._rawData) throw new Error("No data provided to upload")

    const { path } = await this._client.add(this._rawData as ImportCandidate)

    this._path = path
  }

  async load(): Promise<T> {
    if (!this._path) throw new Error("No path provided to load from")

    const { data } = await this._axios.post(`api/v0/cat?arg=${this._path}`)

    return data as T
  }
}
