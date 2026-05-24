import PDFDocument from 'pdfkit';
import fs from 'fs';
import converter from 'number-to-words';
import remarkParse from 'remark-parse'

import {fountainParser} from './parser/fountainParser.js'

import regularGaramond from "../../fonts/EB Garamond/static/EBGaramond-Regular.ttf" with {type: "file"}
import boldGaramond from "../../fonts/EB Garamond/static/EBGaramond-Bold.ttf" with { type: "file" };
import semiBoldGaramond from "../../fonts/EB Garamond/static/EBGaramond-SemiBold.ttf" with { type: "file" };
import extraBoldGaramond from "../../fonts/EB Garamond/static/EBGaramond-ExtraBold.ttf" with {type: "file" };
import regularItalicizedGaramond from "../../fonts/EB Garamond/static/EBGaramond-Italic.ttf" with { type: "file" };

import regularInter from "../../fonts/Inter/static/Inter_18pt-Regular.ttf" with {type: "file"}
import boldInter from "../../fonts/Inter/static/Inter_18pt-Bold.ttf" with { type: "file" };
import semiBoldInter from "../../fonts/Inter/static/Inter_18pt-SemiBold.ttf" with { type: "file" };
import extraBoldInter from "../../fonts/Inter/static/Inter_18pt-ExtraBold.ttf" with {type: "file" };
import regularItalicizedInter from "../../fonts/Inter/static/Inter_18pt-Italic.ttf" with { type: "file" };

function selectFont(document, font) {
    switch (font) {
        case "garamond":
            document.registerFont('Regular', regularGaramond);
            document.registerFont('Bold', boldGaramond);
            document.registerFont('SemiBold', semiBoldGaramond);
            document.registerFont('ExtraBold', extraBoldGaramond);
            document.registerFont('RegularItalicized', regularItalicizedGaramond);
            break;
        case "inter":
            document.registerFont('Regular', regularInter);
            document.registerFont('Bold', boldInter);
            document.registerFont('SemiBold', semiBoldInter);
            document.registerFont('ExtraBold', extraBoldInter);
            document.registerFont('RegularItalicized', regularItalicizedInter);
            break;
    }
}


function addHeader(document, headerTitle) {
    document
        .font("Bold")
        .fontSize(12)
        .moveUp(2)
        .text(headerTitle, {align: "center"})
        .moveDown(0.25)
        .moveTo(50, doc.y) 
        .lineTo(doc.page.width - 50, doc.y) 
        .lineWidth(1)       
        .strokeColor('#000000')
        .stroke()
        .moveDown(0.5);
}

function addFooter(document, pageNumber) {
    var y = document.page.height - 50
    document
        .font("SemiBold")
        .fontSize(12)

        .moveTo(document.page.width / 2 - 40, y)
        .lineTo(document.page.width / 2 - 20, y) 
        .lineWidth(0.5)       
        .strokeColor('#000000')
        .stroke()
        
        .moveTo(document.page.width / 2 + 20, y)
        .lineTo(document.page.width / 2 + 40, y) 
        .lineWidth(0.5)       
        .strokeColor('#000000')
        .stroke()

        .moveTo(document.page.width / 2, y)
        .text(pageNumber, 0, y, {
            width: document.page.width,
            height: 0,
            baseline: 'middle',
            lineBreak: false,
            align: 'center',
        });

        
}

function addSection(document, sectionName) {
    document
        .fontSize(28)
        .moveDown(0.25)
        .font('ExtraBold')
        .text(sectionName, {
            align: 'center'  
        }
        )
        .moveDown(0.25)

}

function addSubSection(document, sectionText, sectionNumber, sectionAltPageNumber) {
    // TODO: Add annotation to next page
    document
        .fontSize(12)

        .moveDown(1.5)

        .rect(doc.x, doc.y - 20, 460, 25).fill('#000000').stroke()

        .moveUp(1)
        .font('Bold')
        .fillColor('white')
        .text(`#${sectionNumber} - ${sectionText}       Page ${sectionAltPageNumber}`, {
            align: 'center'  
        }
        )
        
        .fillColor('black')
        .moveDown(0.75)
}

function addScene(document, sceneText, sceneNumber, subScene = "") {
    document
        .fontSize(12)
        .font('ExtraBold')
        .text(`SCENE ${converter.toWords(sceneNumber).toUpperCase()}${subScene} - ${sceneText}`, {
            width: 460,
            align: 'left'
        }
        )
        .moveDown(0.5)

}

function addCharacter(document, characterName, continued, extensionText,) {
    if (continued) {
        characterName = `(${characterName})`
    }
    document
        .fontSize(12)
        .moveDown(0.5)
        .font('Bold')
        .text(characterName, {
            align: 'center',
        }
        );
    if (extensionText) {
        addParenthetical(document, extensionText);
    }
}

function addTransition(document, transitionText) {
    document
        .fontSize(12)
        .font('Regular')
        .text(transitionText, {
            width: 460,
            align: 'right'
        }
        )
}

function addLyrics(document, lyricsText) {
    document
        .fontSize(12)
        .font('Regular')
        .text(lyricsText.toUpperCase(), {
            width: 460,
            align: 'left'
        }
        )
}

function addAction(document, actionText) {
    document
        .fontSize(12)
        .font('RegularItalicized')
        .moveDown(0.5)
        .text(actionText, {
            width: 410,
            align: 'left',
            indent: 108,
            indentAllLines: true
        }
        )
        .moveDown(0.5)
}

function addDialogue(document, dialogueText) {
    document
        .fontSize(12)
        .font('Regular')
        .text(dialogueText, {
            width: 460,
            align: 'left',
            indent: 36,
            indentAllLines: true
        }
        )
}
function addParenthetical(document, parentheticalText) {
    document
        .fontSize(12)
        .font('RegularItalicized')
        .text(`(${parentheticalText})`, {
            width: 460,
            align: 'left',
            indent: 42,
            indentAllLines: true

        }
        )
}

function addCenteredText(document, centeredTextText) {
    document
        .fontSize(12)
        .moveDown(0.5)
        .font('Regular')
        .text(centeredTextText, {
            align: 'center'  
        }
        )
}

function addSynopses(document, synopsesText) {
    document
        .fontSize(12)
        .moveDown(0.5)
        .font('RegularItalicized')
        .text(synopsesText, {
            align: 'center',  
            underline: true
        }
        )
}
function addNotes(document, notesText) {
    document
        .fontSize(12)
        .moveDown(0.5)
        .font('RegularItalicized')
        .text(notesText, {
            align: 'center',  
            underline: true
        }
        )
}

function addDualDialogue(document, characters = [], text = []) {
    document
        .fontSize(12)
        .font('Bold')

        .table({rowStyles: { border: false },}).row(characters);

    document
        .moveUp(0.25)

        .font('Regular')

        .table({rowStyles: { border: false },}).row(text)
}

function addPageBreak(document, pageNumber) {
    addFooter(document, pageNumber);
    document
        .addPage()
}

function marginChecker(document, lineOne, lineTwo, testLines = 0) {
    document.font('Regular')
    const lineHeight = document.currentLineHeight(true);


    let heightOne = document.heightOfString(lineOne, {
            width: 410,
            align: 'left',
            indent: 108,
            indentAllLines: true,
        })
    let heightTwo = document.heightOfString(lineTwo, {
            width: 410,
            align: 'left',
            indent: 108,
            indentAllLines: true,
        })
    return heightOne + heightTwo + document.y + (lineHeight) + (lineHeight * testLines) < document.page.height - 60
}

// Source - https://stackoverflow.com/a/74800019
// Posted by Vincent Maret, modified by community. See post 'Timeline' for change history
// Retrieved 2026-05-24, License - CC BY-SA 4.0

function getCurrentPageNumber(document) {
    const pageBuffer = document._pageBuffer;
    const currentPage = document.page;
    let currentPageNumber = null;
    pageBuffer.forEach((page, i) => {
        if (page === currentPage) {
            currentPageNumber = i;
        }
    })
    if (currentPageNumber === null) {
        throw new Error('Unable to get current page number');
    }
    return currentPageNumber;
}

function showHelpMessage() {
    console.log("Fancy Fountain (v0.9)")
    console.log("Options:")
    console.log("   --input    |  -I             Input File Path (.fountain)")
    console.log("   --output   |  -O             Output File Path (.pdf) ")
    console.log("   --font     |  -F             Selects a font to use (garamond | inter) ")
    console.log("   --help     |  -H             Displays this help message and exits. ")
    console.log("\nUsage: node src/js/index.js --input ref/aykm.fountain --output testing.pdf")
}

let args = process.argv

let inputFilePath
let outputFilePath
let font = "garamond"
let booklet = false

for (let arg in args) {
    switch (args[arg]) {
        case ("--input" || "-I"):
            inputFilePath = args[Number(arg) + 1];
            break;
        case ("--output" || "-O"):
            outputFilePath = args[Number(arg) + 1];
            break;
        case ("--font" || "-F"):
            font = ["garamond", "inter"].includes(args[Number(arg) + 1]) ? args[Number(arg) + 1] : "garamond";
            break;
        case ("--booklet" || "-B"):
            booklet = true;
            break;
        case ("--help" || "-H"):
            showHelpMessage()
            process.exit()
            break;
    }
}

// Create a document

const scriptParser = new fountainParser;
const doc = new PDFDocument({size: 'letter', bufferPages: true});

selectFont(doc,font);

if (inputFilePath === undefined || outputFilePath === undefined) {
    showHelpMessage();
    process.exit();
}

var script = scriptParser.parseFile(inputFilePath)

let sectionIterator = 0;


doc.pipe(fs.createWriteStream(outputFilePath));

doc.on('pageAdded', () => addHeader(doc, "Nodes of Eventide High : Are You Kidding Me (Reprise) [FORUM]"));

addHeader(doc, "Nodes of Eventide High : Are You Kidding Me (Reprise) [FORUM]")

addCenteredText(doc, "Template Page - NOT FOR ACTUAL USAGE!")


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
                            if (script.tokens[doubleIndex].type == "dialogue" || script.tokens[index].type == "lyric") {
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
    
    if (!marginChecker(doc, script.tokens[token].text, testText, testLines)){
            addFooter(doc, getCurrentPageNumber(doc) + 1) 
            doc.addPage()
            addCont = true
    }
    switch (script.tokens[token].type) {
        case "dialogue":
            if (addCont) {
                if (script.tokens[token].character.endsWith("(CONT'D)")) {
                    addCharacter(doc, script.tokens[token].character.substring(0, script.tokens[token].character.length - 9), true);
                }
                else {
                    addCharacter(doc, script.tokens[token].character, true)
                }
            }
            addDialogue(doc, script.tokens[token].text);
            break;
        case "lyric":
            if (addCont) {
                if (script.tokens[token].character.endsWith("(CONT'D)")) {
                    addCharacter(doc, script.tokens[token].character.substring(0, script.tokens[token].character.length - 9), true);
                }
                else {
                    addCharacter(doc, script.tokens[token].character, true)
                }
            }
            addLyrics(doc, script.tokens[token].text);
            break;
        case "character":
            if (script.tokens[token].text.endsWith("(CONT'D)")) {
                addCharacter(doc, script.tokens[token].text.substring(0, script.tokens[token].text.length - 9), true);
            }
            else {
                addCharacter(doc, script.tokens[token].text, false);
            }
            break;
        case "action":
            addAction(doc, script.tokens[token].text);
            break;
        case "transition":
            addTransition(doc, script.tokens[token].text);
            break;
        case "section":
            if (script.tokens[token].level == 1) {
                addSection(doc, script.tokens[token].text);
            }
            else if (script.tokens[token].level == 2) {
                sectionIterator += 1;
                addSubSection(doc, script.tokens[token].text, sectionIterator, 8);
            }
            break;
        
        case "parenthetical":
            addParenthetical(doc, script.tokens[token].text);
            break;
        
        case "scene_heading":
            addScene(doc, script.tokens[token].text, script.tokens[token].number);
            break;
        case "centered":
            addCenteredText(doc, script.tokens[token].text);
            break;
        
        case "page_break":
            addPageBreak(doc, getCurrentPageNumber(doc) + 1);
            break;

    }
}

addFooter(doc, getCurrentPageNumber(doc) + 1)

// Finalize PDF file
doc.end();