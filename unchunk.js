const escodegen = require('escodegen'),
  acorn = require('acorn'),
  walk = require('acorn-walk'),
  fs = require('fs')

const src = fs.readFileSync('./bs.strings.js', 'utf8')

const ast = acorn.parse(src, { ecmaVersion: '2015' })

// walks through each BinaryExpression and converts to Literals if both sides are literals of type Strings
function parse() {
  let matched = false
  walk.simple(ast, {
    BinaryExpression(node) {
      if (
        node.left.type === 'Literal' &&
        node.right.type === 'Literal' &&
        typeof node.left.value === 'string' &&
        typeof node.right.value === 'string'
      ) {
        matched = true
        node.type = 'Literal'
        node.value = node.left.value + node.right.value
        console.log(
          'Combined BinaryExpression ->',
          node.left.value,
          '+',
          node.right.value
        )
      }
    },
  })
  return matched
}

let pass = 0,
  res = parse()
console.log('Pass', pass, 'complete')
while (res) {
  res = parse()
  pass++
  console.log('Pass', pass, 'complete')
}

console.log('Finished parsing file')

fs.writeFileSync('./bs.unchunked.js', escodegen.generate(ast), 'utf8')
