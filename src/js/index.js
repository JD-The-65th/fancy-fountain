import PDFDocument from 'pdfkit';
import fs from 'fs';

import {fountainParser} from './parser/fountainParser.js'

import { selectFont } from './utils/fontUtils.js';
import { stageplayFormatter } from './formatter/stageplay.js';
import { titlePageFormatter } from './formatter/titlePage.js';
import { getCurrentPageNumber } from './utils/pdfUtils.js';

function showHelpMessage() {
    console.log("Fancy Fountain (v0.9)")
    console.log("Options:")
    console.log("   --input    |  -I             Input File Path (.fountain)")
    console.log("   --output   |  -O             Output File Path (.pdf) ")
    console.log("   --font     |  -F             Selects a font to use ( garamond | inter | courier | helvetica ) ")
    console.log("   --help     |  -H             Displays this help message and exits. ")
    console.log("\nUsage: fancy-fountain --input ref/aykm.fountain --output testing.pdf")
}

let args = process.argv

let inputFilePath
let outputFilePath
let font = "garamond"

for (let arg in args) {
    switch (args[arg]) {
        case ("--input"):
        case ("-I"):
            inputFilePath = args[Number(arg) + 1];
            break;
        case ("--output"):
        case ("-O"):
            outputFilePath = args[Number(arg) + 1];
            break;
        case ("--font"):
        case ("-F"):
            font = ["garamond", "inter", "courier", "helvetica"].includes(args[Number(arg) + 1]) ? args[Number(arg) + 1] : "garamond";
            break;
        case ("--help"):
        case ("-F"):
            showHelpMessage()
            process.exit()
            break;
    }
}

// Create a document

const scriptParser = new fountainParser;
const doc = new PDFDocument({size: 'letter', bufferPages: true});
const scriptFormatter = new stageplayFormatter(doc);


selectFont(doc,font);

if (inputFilePath === undefined || outputFilePath === undefined) {
    showHelpMessage();
    process.exit();
}

var script = scriptParser.parseFile(inputFilePath)

let sectionIterator = 0;


doc.pipe(fs.createWriteStream(outputFilePath));

let documentTitle = inputFilePath.split('\\').pop().split('/').pop();

doc.on('pageAdded', () => scriptFormatter.addHeader(doc, documentTitle));

let titleFormatter = new titlePageFormatter(doc);

for (let sectionToken in script.title_page) {
    for (let titleToken in script.title_page[sectionToken]) {
        switch (script.title_page[sectionToken][titleToken].type) {
            case "title":
                titleFormatter.addTitle(doc, script.title_page[sectionToken][titleToken].text);
                documentTitle = script.title_page[sectionToken][titleToken].text.replaceAll("\n", " - ").replace(/\*|_/g, "")
                break;
            case "credit":
                titleFormatter.addCenteredText(doc, script.title_page[sectionToken][titleToken].text);
                break;
            case "author":
                titleFormatter.addCenteredText(doc, script.title_page[sectionToken][titleToken].text);
                break;
            case "source":
                titleFormatter.addCenteredText(doc, script.title_page[sectionToken][titleToken].text);
                break;
            case "copyright":
                titleFormatter.addBottomLeftText(doc, script.title_page[sectionToken][titleToken].text);
                break;
            case "draft_date":
            case "date":
            case "contact":
                titleFormatter.addBottomRightText(doc, script.title_page[sectionToken][titleToken].text);
                break;
                
        }
    }

}


let dualDialogueCharacterPool = []
let dualDialogueDialoguePool = []
let dualDialoguePending = false

for (let token in script.tokens) {
    let addCont = false
    let testText = ""
    let testLines = 0
    if (script.tokens[token].type === "character" || script.tokens[token].type === "parenthetical") {

        for (let index = Number(token) + 1; index < script.tokens.length - 1; index++) {
            if (script.tokens[index].text !== undefined) {
                if (script.tokens[index].type == "dialogue" || script.tokens[index].type == "lyric") {
                    testText = script.tokens[index].text
                    testLines = 0.5
                }
                if (script.tokens[index].type == "parenthetical") {
                    for (let doubleIndex = index + 1; doubleIndex < script.tokens.length - 1; doubleIndex++) {
                        if (script.tokens[doubleIndex].text !== undefined) {
                            if (script.tokens[doubleIndex].type == "dialogue" || script.tokens[doubleIndex].type == "lyric") {
                                testText += "\n" + script.tokens[doubleIndex].text 
                                testLines = 0.5
                            }
                            break;
                        }
                    }
                }
                break;
            }
        }
    }
    if (!scriptFormatter.marginChecker(doc, script.tokens[token].text, testText, testLines)){
            scriptFormatter.addFooter(doc, getCurrentPageNumber(doc)) 
            doc.addPage()
            addCont = true
    }
    if (script.tokens[token].dual) {
        dualDialoguePending = true;
        let characterIndex
        switch (script.tokens[token].type) {
            case "character":
                dualDialogueCharacterPool.push(script.tokens[token].text)  
                break;
            case "dialogue":
                characterIndex = dualDialogueCharacterPool.indexOf(script.tokens[token].character)
                if (dualDialogueDialoguePool[characterIndex] !== undefined) {
                    dualDialogueDialoguePool[characterIndex] += "\n" + script.tokens[token].text
                }
                else {
                    dualDialogueDialoguePool[characterIndex] = script.tokens[token].text
                }
                break;
            case "lyric":
                characterIndex = dualDialogueCharacterPool.indexOf(script.tokens[token].character)
                if (dualDialogueDialoguePool[characterIndex] !== undefined) {
                    dualDialogueDialoguePool[characterIndex] += "\n" + script.tokens[token].text.toUpperCase()
                }
                else {
                    dualDialogueDialoguePool[characterIndex] = script.tokens[token].text.toUpperCase()
                }
                break;
        }
    }
    else if (dualDialoguePending) {
        scriptFormatter.addDualDialogue(doc, dualDialogueCharacterPool, dualDialogueDialoguePool)
        dualDialogueCharacterPool = []
        dualDialogueDialoguePool = []
        dualDialoguePending = false
    }
    else switch (script.tokens[token].type) {
        case "dialogue":
            if (addCont) {
                if (script.tokens[token].character.endsWith("(CONT'D)")) {
                    scriptFormatter.addCharacter(doc, script.tokens[token].character.substring(0, script.tokens[token].character.length - 9), true);
                }
                else {
                    scriptFormatter.addCharacter(doc, script.tokens[token].character, true)
                }
            }
            scriptFormatter.addDialogue(doc, script.tokens[token].text);
            break;
        case "lyric":
            if (addCont) {
                if (script.tokens[token].character.endsWith("(CONT'D)")) {
                    scriptFormatter.addCharacter(doc, script.tokens[token].character.substring(0, script.tokens[token].character.length - 9), true);
                }
                else {
                    scriptFormatter.addCharacter(doc, script.tokens[token].character, true)
                }
            }
            scriptFormatter.addLyrics(doc, script.tokens[token].text);
            break;
        case "character":
            if (script.tokens[token].text.endsWith("(CONT'D)")) {
                scriptFormatter.addCharacter(doc, script.tokens[token].text.substring(0, script.tokens[token].text.length - 9), true);
            }
            else {
                scriptFormatter.addCharacter(doc, script.tokens[token].text, false);
            }
            break;
        case "action":
            scriptFormatter.addAction(doc, script.tokens[token].text);
            break;
        case "transition":
            scriptFormatter.addTransition(doc, script.tokens[token].text);
            break;
        case "section":
            if (script.tokens[token].level == 1) {
                scriptFormatter.addSection(doc, script.tokens[token].text);
            }
            else if (script.tokens[token].level == 2) {
                sectionIterator += 1;
                scriptFormatter.addSubSection(doc, script.tokens[token].text, sectionIterator, 8);
            }
            break;
        
        case "parenthetical":
            scriptFormatter.addParenthetical(doc, script.tokens[token].text);
            break;
        
        case "scene_heading":
            scriptFormatter.addScene(doc, script.tokens[token].text, script.tokens[token].number);
            break;
        case "centered":
            scriptFormatter.addCenteredText(doc, script.tokens[token].text);
            break;
        
        case "page_break":
            scriptFormatter.addPageBreak(doc, getCurrentPageNumber(doc));
            break;

    }
}

scriptFormatter.addFooter(doc, getCurrentPageNumber(doc))

// Finalize PDF file
doc.end();