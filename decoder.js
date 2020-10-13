const decodeString = _0x5991 // example

const fs = require('fs')

let rawCode = fs.readFileSync('./sync.cleaned.js', 'utf8')

let regex = /_0x2ec366\("(0x.{0,4})", "(.{4})"\)/i

//let regexx = /_0x5991\("(0x.{0,4})"\)/i
let regexes = [
  /_0x2ec366\("(0x.{0,4})", "(.{4})"\)/i,
  /_0x1197cd\("(0x.{0,4})", "(.{4})"\)/i,
]

function g(regex) {
  let match = rawCode.match(regex)
  while (!!match) {
    let res = decodeString(match[1], match[2])
    //let res = decodeString(match[1])
    console.log(`${match[0]} --> ${res}`)
    rawCode = rawCode.replace(match[0], `'${res.replace(/\n/gi, '\\n')}'`)
    match = rawCode.match(regex)
  }
}

//g(regex)
regexes.forEach(g)

fs.writeFileSync('sync.strings.js', rawCode)
