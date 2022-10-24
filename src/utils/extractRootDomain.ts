function extractHostname(url) {
  let hostname
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("//") > -1) {
    hostname = url.split("/")[2]
  } else {
    hostname = url.split("/")[0]
  }

  //find & remove port number
  hostname = hostname.split(":")[0]
  //find & remove "?"
  hostname = hostname.split("?")[0]

  return hostname
}

// Warning: you can use this function to extract the "root" domain, but it will not be as accurate as using the psl package.

export default function extractRootDomain(url) {
  let domain = extractHostname(url)
  const splitArr = domain.split(".")
  const arrLen = splitArr.length

  //extracting the root domain here
  //if there is a subdomain
  if (arrLen > 2) {
    domain = splitArr[arrLen - 2] + "." + splitArr[arrLen - 1]
    //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
    if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
      //this is using a ccTLD
      domain = splitArr[arrLen - 3] + "." + domain
    }
  }
  return domain
}
