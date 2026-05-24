import fs from 'fs';

class fountainParser {
    constructor() {}

    parseFile(filePath = "") {
        let fileContent = fs.readFileSync(filePath, 'utf-8');
        
    }
}

export {fountainParser};