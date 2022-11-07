const fs = require("fs")
const path = require("path")
const { exec } = require("child_process")

// path to the folder where the ABI files are located in your project
const ABI_PATH = path.join(__dirname, "src/abi")

const writeInFile = (path, content) => {
  try {
    fs.writeFileSync(path, content)
  } catch (err) {
    console.error(err)
  }
}

const getAllFiles = function (dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push({ file, dirPath })
    }
  })

  return arrayOfFiles
}

const ignoreFiles = ["index.ts"]

const fileNames = getAllFiles(ABI_PATH)
  .filter((f) => !ignoreFiles.includes(f.file))
  .map((f) => f.file.substring(0, f.file.length - 5))

console.log(`ABI's found: (${fileNames.length}): `)

if (process.argv.length < 3) {
  console.log("!Error: not provided update ABI's path")
  console.log("!try: 'node updateABI.js <path>'")
  console.log("Update unsucessful")
  process.exit(1)
}

const abiUpdateAllFilesList = getAllFiles(process.argv[2]).filter((f) =>
  fileNames.includes(f.file.substring(0, f.file.length - 5))
)

console.log(`Files to update found: (${abiUpdateAllFilesList.length})`)

const parseJSON = (path) => {
  try {
    let rawdata = fs.readFileSync(path)
    let student = JSON.parse(rawdata)
    return student
  } catch {
    console.log("!Error: file not found")
    return false
  }
}

abiUpdateAllFilesList.map((f) => {
  const jsonPath = f.dirPath + "/" + f.file

  const abi = parseJSON(jsonPath)
  const jsonContent = JSON.stringify(abi.abi)

  writeInFile(
    ABI_PATH + "/" + f.file.substring(0, f.file.length - 5) + ".json",
    jsonContent
  )
})

exec(`yarn eslint src/abi/*.ts`, (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`)
    return
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`)
    return
  }
  console.log(`stdout: ${stdout}`)
})
