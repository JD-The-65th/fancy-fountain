import { FountainParser } from "../../../ext/screenplay-tools/screenplayTools.js"
import fs from 'fs';

class fountainParser {
    constructor() {}

    parseFile(filePath = "") {
        var fileContent = fs.readFileSync(filePath, 'utf-8');
        let fp = new FountainParser();
        fp.addText(fileContent);
        return fp.script;
  }
}

export {fountainParser};