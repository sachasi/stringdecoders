const escodegen = require('escodegen'),
  acorn = require('acorn'),
  walk = require('acorn-walk'),
  fs = require('fs')

const src = fs.readFileSync('./faa.cleaned.js', 'utf8')

const ast = acorn.parse(src, { ecmaVersion: '2015' })

function math(left, operator, right) {
  switch (operator) {
    case '+':
      return left + right
    case '*':
      return left * right
    case '-':
      return left - right
    case '/':
      return left / right
  }
  return left
}

function unaryExpressionToNumber(node) {
  let num = node.argument.value
  if (node.operator === '-') num = num * -1
  return num
}

// walks through each BinaryExpression and combines them
function parse() {
  let matched = false

  walk.simple(ast, {
    BinaryExpression(node) {
      // string concatenation
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

      // Converts UnaryExpressions to numeric literals
      if (
        node.left.type === 'UnaryExpression' &&
        typeof node.left.argument.value === 'number'
      ) {
        node.left.type = 'Literal'
        node.left.value = unaryExpressionToNumber(node.left)
        delete node.left.operator
        delete node.left.prefix
      }
      if (
        node.right.type === 'UnaryExpression' &&
        typeof node.right.argument.value === 'number'
      ) {
        node.right.type = 'Literal'
        node.right.value = unaryExpressionToNumber(node.right)
        delete node.right.operator
        delete node.right.prefix
      }

      // Combines numeric Literals
      if (
        node.left.type === 'Literal' &&
        node.right.type === 'Literal' &&
        typeof node.left.value === 'number' &&
        typeof node.right.value === 'number'
      ) {
        let val = math(node.left.value, node.operator, node.right.value)
        matched = true
        node.type = 'Literal'
        node.value = val
        console.log(
          'Combined BinaryExpression ->',
          node.left.value,
          node.operator,
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

// Converts negative numeric Literals to UnaryExpressions
walk.simple(ast, {
  Literal(node) {
    if (typeof node.value === 'number' && node.value < 0) {
      node.type = 'UnaryExpression'
      node.operator = '-'
      node.prefix = true
      node.argument = {
        type: 'Literal',
        value: Math.abs(node.value),
      }
    }
  },
})

console.log('Finished parsing file')

fs.writeFileSync('./faa.unchunked.js', escodegen.generate(ast), 'utf8')
