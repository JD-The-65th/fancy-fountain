# Fancy Fountain
A Fancy Fountain App for exporting Fountain scripts.

## Why?
For the sole purpose of exporting prettier scripts, primarily with Stageplay Formatting. It includes the EB Garamond, Courier, and Inter fonts, with custom font support coming in a later update.

# Usage

```
fancy-fountain --input ref/aykm.fountain --output testing.pdf

fancy-fountain -I ref/aykm.fountain -O testing.pdf --font inter

```


# Usability

This project is approximately 89% complete. It contains support for nearly all fountain features, with the exception of the Title Page and Emphasis markings.

Currently, this project has title name at the top of all exported pdf's.

# Development

This project uses NPM and Bun. A compatibility mode for Node will eventually be made as development originally used NodeJS

To run this repository, clone it, run `npm init`, then run `bun src/js/index.js`

To compile this program, the command `bun build src/js/index.js --compile --minify --sourcemap --bytecode --outfile ./bin/fancy-fountain` was used.

This program is split into various components for maintainability. 

- `src/js/index.js` is the entrypoint, which handes arguments, the document itself, and iterating through tokens. 
- `src/js/parser` contains relevant parsers, including the Fountain Parser. 
- `src/js/formatter` contains formatters that dictate how the file is laid out. 
- `src/js/utils` contains basic utility functions.