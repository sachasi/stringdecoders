var decodeString = _0x5bf6b3

const fs = require('fs')

let rawCode = fs.readFileSync('./javasy.cleaned.js', 'utf8')

let fmRegex = /var (_0x[0-9a-f]{6})=function\((_0x[0-9a-f]{6}),_0x[0-9a-f]{6}\)\{return _0x5bf6b3\(\2- ?(-?'0x[0-9a-f]{0,3})/i

let fmPaths = []
let regexes = []
let opts = []
let rCode = fs.readFileSync('./javasy.js', 'utf8')
let fmMatch = rCode.match(fmRegex)

while (!!fmMatch) {
  let res = fmMatch[1]
  console.log('cock')
  if (fmPaths.includes(res)) continue
  fmPaths.push(res)
  opts.push([fmMatch[1], fmMatch[2], fmMatch[3]])

  //regexes.push(new RegExp(`${res}\\("(0x.{0,4})"\\)`, 'i'))

  console.log(`pushed ${fmMatch[1]} to regexs`)

  rCode = rCode.replace(fmMatch[1], 'rplcd')
  fmMatch = rCode.match(fmRegex)
}

opts.forEach((opt) => {
  let fnName = opt[0]
  let offset = opt[2].replace(/'|"/gi, '')
  console.log(fnName, offset)
  let regex = new RegExp(`${fnName}\\("(0x.{0,4})"\\)`, 'i')
  let match = rawCode.match(regex)
  while (!!match) {
    let res = decodeString(match[1] - parseInt(offset), undefined)
    console.log(`${match[0]} --> ${res}`)
    rawCode = rawCode.replace(match[0], `'${res.replace(/\n/gi, '\\n')}'`)
    match = rawCode.match(regex)
  }
})

/*regexes.forEach(regex => {
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
*/
/*let match = rawCode.match(regex)
while (!!match) {
  let res = decodeString(match[1], match[2])
  console.log(`${match[0]} --> ${res}`)
  rawCode = rawCode.replace(match[0], `'${res.replace(/\n/gi, '\\n')}'`)
  match = rawCode.match(regex)
}*/

fs.writeFileSync('javasy.strings.js', rawCode)
