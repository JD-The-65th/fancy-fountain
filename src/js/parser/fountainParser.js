import fs from 'fs';

class fountainParser {
    constructor() {}

    parseFile(filePath = "") {
        var fileContent = fs.readFileSync(filePath, 'utf-8');
        return null;
  }
}

export {fountainParser};