import { BigNumber } from "@ethersproject/bignumber"

export enum BN_ROUNDING {
  DEFAULT = 4,
  UP = 0,
  DOWN = 1,
  CEIL = 2,
  FLOOR = 3,
  HALF_UP = 4,
  HALF_DOWN = 5,
  HALF_EVEN = 6,
  HALF_CEIL = 7,
  HALF_FLOOR = 8,
}

export interface BnCfg {
  decimals?: number
  rounding?: BN_ROUNDING
  noGroupSeparator?: boolean
}

export type BnFormatCfg = BigNumber.Format & BnCfg
export type BnLike = string | number | BigNumber | MathUtil

BigNumber.config({
  DECIMAL_PLACES: 0,
  ROUNDING_MODE: BN_ROUNDING.DEFAULT,
  FORMAT: {
    decimalSeparator: ".",
    groupSeparator: ",",
    groupSize: 3,
  },
})

export class MathUtil {
  static TO_WEI_FACTOR = BigNumber.from(10).pow(18)
  static MIN_WEI_STR = BigNumber.from(0.1).pow(18).toString()
  static FROM_WEI_FACTOR = BigNumber.from(0.1).pow(18)
  static ROUNDING = BN_ROUNDING
  static MAX_UINT256 = BigNumber.from(2).pow(256).sub(1)
  #bn: BigNumber
  #cfg?: BnCfg

  constructor(bigLike: BnLike, cfg?: BnCfg) {
    this.#bn = this._bn(bigLike, cfg)
    this.#cfg = cfg
  }

  static isBn(arg: unknown): arg is MathUtil {
    return arg instanceof BN
  }

  static min(...args: BnLike[]): BN {
    return new BN(BigNumber.minimum(...args.map((e) => new BN(e).#bn)))
  }

  static max(...args: BnLike[]): BN {
    return new BN(BigNumber.maximum(...args.map((e) => new BN(e).#bn)))
  }

  mul(other: BnLike, cfg = this.#cfg): BN {
    return new BN(this.#bn.multipliedBy(this._bn(other)), cfg)
  }

  div(other: BnLike, cfg = this.#cfg): BN {
    return new BN(this.#bn.dividedBy(this._bn(other)), cfg)
  }

  add(other: BnLike, cfg = this.#cfg): BN {
    return new BN(this.#bn.plus(this._bn(other)), cfg)
  }

  sub(other: BnLike, cfg = this.#cfg): BN {
    return new BN(this.#bn.minus(this._bn(other)), cfg)
  }

  pow(other: BnLike, cfg = this.#cfg): BN {
    return new BN(this.#bn.pow(this._bn(other)), cfg)
  }

  /**
   * this > other => 1;
   * this < other => -1;
   * this === other => 0;
   *
   * @param {BnLike} other
   * @returns {number}
   */
  compare(other: BnLike): number {
    return this.#bn.comparedTo(this._bn(other))
  }

  round(precision: number, mode?: BN_ROUNDING): string {
    return this.#bn.toPrecision(precision, mode)
  }

  format(format?: BnFormatCfg): string {
    try {
      const groupSeparatorFormat: { [key: string]: string | number } = {}
      const {
        decimals = BigNumber.config({}).DECIMAL_PLACES as number,
        rounding = BigNumber.config({}).ROUNDING_MODE as BN_ROUNDING,
        noGroupSeparator,
        ...fmt
      } = format || {}
      if (noGroupSeparator) {
        groupSeparatorFormat.groupSeparator = ""
      }
      Object.assign(fmt, BigNumber.config({}).FORMAT, groupSeparatorFormat)
      return this.#bn.toFormat(decimals, rounding, fmt)
    } catch (error) {
      console.error(error)
      return "—"
    }
  }

  toFraction(decimals?: number): BN {
    const fr = decimals ? new BN(10).pow(decimals) : BN.TO_WEI_FACTOR
    return this.mul(fr)
  }

  fromFraction(decimals?: number): BN {
    const fr = decimals ? new BN(0.1).pow(decimals) : BN.FROM_WEI_FACTOR
    return this.mul(fr)
  }

  toString(): string {
    return this.#bn.toFormat({
      groupSeparator: "",
      decimalSeparator: ".",
      fractionGroupSeparator: "",
    })
  }

  valueOf(): string {
    return this.toString()
  }

  private _bn(value: BnLike, config?: BnCfg): BigNumber {
    let ctor = BigNumber
    if (config) {
      ctor = ctor.clone()
      ctor.config({
        ...("decimals" in config ? { DECIMAL_PLACES: config.decimals } : {}),
        ...("rounding" in config ? { ROUNDING_MODE: config.rounding } : {}),
      })
    }

    if (BigNumber.isBigNumber(value)) {
      return value
    }

    if (value instanceof BN) {
      return value.#bn
    }

    try {
      return new ctor(value)
    } catch (error) {
      throw new TypeError(`Cannot convert the given "${value}" to BN!`)
    }
  }
}
