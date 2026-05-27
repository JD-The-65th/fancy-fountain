# Fancy Fountain
A Fancy Fountain App for exporting Fountain scripts.

## Why?
For the sole purpose of having a completely FOSS writing process for making stageplays and musicals. This project is mainly intended for stageplays, however it was written in a hackable way for other methods of formatting to be added at a later date.

# Features

- Stageplay formatting
- Full compatibility with all Fountain Features
- Easy Extendability
- Booklet page exporting
- Garamond, Courier, and Inter fonts


# Usage

```bash
fancy-fountain --input ref/aykm.fountain --output testing.pdf

fancy-fountain -I ref/aykm.fountain -O testing.pdf --font inter

```


# Development

This project uses NPM and Bun. A compatibility mode for Node will eventually be made as development originally used NodeJS

To run this repository, clone it, run `npm init`, then run `bun src/js/index.js`

To compile this program, the command `bun build src/js/index.js --compile --minify --sourcemap --bytecode --outfile ./bin/fancy-fountain` was used.

This program is split into various components for maintainability. 

- `src/js/index.js` is the entrypoint, which handes arguments, the document itself, and iterating through tokens. 
- `src/js/parser` contains relevant parsers, including the Fountain Parser. 
- `src/js/formatter` contains formatters that dictate how the file is laid out. 
- `src/js/utils` contains basic utility functions.