const ROOT =
  "https://raw.githubusercontent.com/dexe-network/investing-dashboard/master/public"

const DEXE_DEFAULT = `${ROOT}/lists/dexe-default.tokenlist.json`
const DEXE_WHITELIST = `${ROOT}/lists/dexe-whitelist.tokenlist.json`
const DEXE_BLACKLIST = `${ROOT}/lists/dexe-blacklist.tokenlist.json`

// List of official tokens list
export const DEFAULT_LIST_OF_LISTS_TO_DISPLAY = [DEXE_DEFAULT, DEXE_WHITELIST]

export const WHITELIST_LIST_URLS: string[] = [DEXE_WHITELIST]
export const UNSUPPORTED_LIST_URLS: string[] = [DEXE_BLACKLIST]
export const WARNING_LIST_URLS: string[] = []
export const PRODUCT_LIST_URLS: string[] = [DEXE_WHITELIST, DEXE_BLACKLIST]

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  ...DEFAULT_LIST_OF_LISTS_TO_DISPLAY,
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
  ...WARNING_LIST_URLS,
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [
  ...DEFAULT_LIST_OF_LISTS_TO_DISPLAY,
]
