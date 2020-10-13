const decodeString = rt_0x4e9b

const fs = require('fs')

let rawCode = fs.readFileSync('./essentials.cleaned.js', 'utf8')

let fmRegex = /var (_0x[a-f0-9]{6}) = var_0xe2e6;?/i
let fmMatch = rawCode.match(fmRegex)

let fmPaths = []
let regexes = []
let rCode = rawCode
while (!!fmMatch) {
  let res = fmMatch[1]
  if (fmPaths.includes(res)) continue
  fmPaths.push(res)
  regexes.push(new RegExp(`${res}\\("(0x.{0,4})"\\)`, 'i'))

  console.log(`pushed ${fmMatch[1]} to regexs`)

  rCode = rCode.replace(fmMatch[1], 'rplcd')
  fmMatch = rCode.match(fmRegex)
}

regexes.forEach((regex) => {
  console.log(regex)
  let match = rawCode.match(regex)
  while (!!match) {
    let res = decodeString(match[1], match[2])
    console.log(`${match[0]} --> ${res}`)
    rawCode = rawCode.replace(match[0], `'${res.replace(/\n/gi, '\\n')}'`)
    match = rawCode.match(regex)
  }
})

let regex = /_0x58464a\("(0x.{0,4})", "(.{4})"\)/i

/*let match = rawCode.match(regex)
while (!!match) {
  let res = decodeString(match[1], match[2])
  console.log(`${match[0]} --> ${res}`)
  rawCode = rawCode.replace(match[0], `'${res.replace(/\n/gi, '\\n')}'`)
  match = rawCode.match(regex)
}*/

fs.writeFileSync('essentials.strings.js', rawCode)
