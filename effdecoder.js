const decodeString = _0x436670

const fs = require('fs')

let rawCode = fs.readFileSync('./effecthook.cleaned.js', 'utf8')

//let fmRegex = /var (_0x[0-9a-f]{6})=function\((_0x[0-9a-f]{6}),_0x[0-9a-f]{6}\)\{return _0x5bf6b3\(\2- ?(-?'0x[0-9a-f]{0,3})/i
let fmRegex = /var (_0x[0-9a-f]{6})=function\((_0x[0-9a-f]{6}),_0x[0-9a-f]{6}\)\{return _0x436670\(\2- ?(-?'(?:\\x[0-9a-f]{2})*)'/i
let fmPaths = []
let regexes = []
let opts = []
const offsets = []
let rCode = fs.readFileSync('./effecthook.js', 'utf8')
let fmMatch = rCode.match(fmRegex)

while (!!fmMatch) {
  let res = fmMatch[1]
  //console.log(fmMatch[1], fmMatch[2], fmMatch[3])
  if (fmPaths.includes(res)) continue
  fmPaths.push(res)
  opts.push([fmMatch[1], fmMatch[2], fmMatch[3]])

  //regexes.push(new RegExp(`${res}\\("(0x.{0,4})"\\)`, 'i'))

  console.log(`pushed ${fmMatch[1]} to regexs`)

  rCode = rCode.replace(fmMatch[1], 'rplcd')
  let offset = fmMatch[3].replace(/'|"/gi, '')
  offsets[fmMatch[1]] = parseInt(
    decodeURIComponent(offset.replace(/\\x/gi, '%'))
  )
  console.log(offsets[fmMatch[1]])
  fmMatch = rCode.match(fmRegex)
}
let xRegex = /var (_0x[0-9a-f]{6})=function\((_0x[0-9a-f]{6}),_0x[0-9a-f]{6}\)\{return (_0x[0-9a-f]{6})\(\2- ?(-?'(?:\\x[0-9a-f]{2})*)'/i
let xMatch = rCode.match(xRegex)
console.log('cumcumcumcumcuccumcumcumc========')
while (!!xMatch) {
  let res = xMatch[1]
  if (fmPaths.includes(res)) continue
  fmPaths.push(res)
  //regexes.push(new RegExp(`${res}\\("(0x.{0,4})"\\)`, 'i'))
  let properOffset = offsets[xMatch[3]]
  // xd
  let ourOffset = xMatch[4].replace(/'|"/gi, '')
  console.log(ourOffset)
  ourOffset = parseInt(decodeURIComponent(ourOffset.replace(/\\x/gi, '%')))
  console.log(xMatch[1], '=', properOffset, '-', ourOffset)
  if (!properOffset) {
    rCode = rCode.replace(xMatch[1], 'rplcd')
    xMatch = rCode.match(xRegex)
    continue
  }
  opts.push([xMatch[1], xMatch[2], (properOffset + ourOffset).toString()])

  console.log(`pushed ${xMatch[1]} to regexes`)

  rCode = rCode.replace(xMatch[1], 'rplcd')

  //offsets[fmMatch[1]] = parseInt(decodeURIComponent(offset.replace(/\\x/gi, '%')))
  //console.log(offsets[fmMatch[1]])
  xMatch = rCode.match(xRegex)
}
console.log('===========')
opts.forEach((opt) => {
  let fnName = opt[0]
  let offset = opt[2].replace(/'|"/gi, '')
  offset = parseInt(decodeURIComponent(offset.replace(/\\x/gi, '%')))
  console.log(fnName, offset)
  //let regex = new RegExp(`${fnName}\\("(-?(?:\\x[0-9a-f]{2})*)"\\)`, 'i')
  let regex = new RegExp(`${fnName}\\((-?"(?:\\\\x[0-9a-f]{2})*)"\\)`)
  let match = rawCode.match(regex)
  while (!!match) {
    match[1] = match[1].replace(/'|"/gi, '')
    console.log(match[1])
    let a1 = decodeURIComponent(match[1].replace(/\\x/gi, '%'))
    let arg1 = parseInt(a1) - offset
    let res = decodeString(arg1, undefined)
    console.log(`${match[0]} --> ${res}`)
    rawCode = rawCode.replace(match[0], `'${res.replace(/\n/gi, '\\n')}'`)
    match = rawCode.match(regex)
  }
})

//let regex = /XCUM_0x2a04\("(0x.{0,4})", "(.{4})"\)/i

//let regex = /noauth\("(0x.{0,4})"\)/i
let regex = /_0x436670\("(-?(?:\\x[0-9a-f]{2})*)"\)/i
let match = rawCode.match(regex)
while (!!match) {
  //let res = decodeString(match[1], match[2])
  let a1 = decodeURIComponent(match[1].replace(/\\x/gi, '%'))
  let arg1 = parseInt(a1)
  let res = decodeString(arg1)
  console.log(match[1])
  console.log(`${match[0]} --> ${res}`)
  rawCode = rawCode.replace(match[0], `'${res.replace(/\n/gi, '\\n')}'`)
  match = rawCode.match(regex)
}

fs.writeFileSync('effecthook.strings.js', rawCode)
