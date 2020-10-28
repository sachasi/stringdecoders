# stringdecoders

As of late, cracking onetap scripts has become increasingly boring due to every script I've found using [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator)

Personally, I think selling lines of code that call a few functions with some different numbers and strings is stupid.

All of the code in this repo was written hastily without thought for reading the string array or functions from the actual file instead of pasting it at the top.

## Helper scripts

### clean.bat

- Copys argv[1].js to argv[1].cleaned.js
- Runs prettier to beautify the code

### rel.bat

- Copys argv[1].strings.js to argv[1].cracked.js
- Runs terser to uglify the script

## Miscellaneous scripts

### unchunk.js

- Converts BinaryExpressions (e.g. string concatenation) into Literals (defeats javascript-obfuscator's [splitStrings](https://github.com/javascript-obfuscator/javascript-obfuscator#splitstrings) option)
- Requires packages from npm:
  - [acorn](https://yarn.pm/acorn): for parsing the AST of the script
  - [acorn-walk](https://yarn.pm/acorn-walk): walk through the AST
  - [escodegen](https://yarn.pm/escodegen): generate a valid script from the modified ast

## Decoding scripts

### decoder.js

- javascript-obfuscator creates one function that decodes strings from the string array. easily matched using regex

### effdecoder.js

- Created for a script named "effecthook"
- javascript-obfuscator creates numerous functions with specific offsets in \x escape sequences
  - Which are then used by functions inside of each function with their own offsets

### essdecoder.js

- Created for a script named HvH essentials
- javascript-obfuscator creates references back to the original string decoding function in each function
  - there is no offset, just a variable that is set to the function

### jadecoder.js

- Created for a script named javasy
- javascript-obfuscator creates functions that call the original string decoding function with offsets encoded in hex
