import fs from 'fs';
import { parse } from '../../../ext/better-fountain/afterwriting-parser.ts'

class fountainParser {
    constructor() {}

    parseFile(filePath = "") {
        let fileContent = fs.readFileSync(filePath, 'utf-8');
        return parse(fileContent)
    }
}

export {fountainParser};