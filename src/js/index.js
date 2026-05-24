import PDFDocument from 'pdfkit';
import fs from 'fs';
import converter from 'number-to-words';
import remarkParse from 'remark-parse'

import {fountainParser} from './parser/fountainParser.js'

// Create a document
const doc = new PDFDocument({size: 'letter'});

doc.pipe(fs.createWriteStream('testing.pdf'));

function addHeader(document, headerTitle) {
    document
        .font('fonts/EB Garamond/static/EBGaramond-Bold.ttf')
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
        .font('fonts/EB Garamond/static/EBGaramond-SemiBold.ttf')
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
        .font('fonts/EB Garamond/static/EBGaramond-ExtraBold.ttf')
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
        .font('fonts/EB Garamond/static/EBGaramond-Bold.ttf')
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
        .font('fonts/EB Garamond/static/EBGaramond-ExtraBold.ttf')
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
        .font('fonts/EB Garamond/static/EBGaramond-Bold.ttf')
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
        .font('fonts/EB Garamond/static/EBGaramond-Regular.ttf')
        .text(transitionText, {
            width: 460,
            align: 'right'
        }
        )
}

function addLyrics(document, lyricsText) {
    document
        .fontSize(12)
        .font('fonts/EB Garamond/static/EBGaramond-Regular.ttf')
        .text(lyricsText.toUpperCase(), {
            width: 460,
            align: 'left'
        }
        )
}

function addAction(document, actionText) {
    document
        .fontSize(12)
        .font('fonts/EB Garamond/static/EBGaramond-Italic.ttf')
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
        .font('fonts/EB Garamond/static/EBGaramond-Regular.ttf')
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
        .font('fonts/EB Garamond/static/EBGaramond-Italic.ttf')
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
        .font('fonts/EB Garamond/static/EBGaramond-Regular.ttf')
        .text(centeredTextText, {
            align: 'center'  
        }
        )
}

function addSynopses(document, synopsesText) {
    document
        .fontSize(12)
        .moveDown(0.5)
        .font('fonts/EB Garamond/static/EBGaramond-Italic.ttf')
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
        .font('fonts/EB Garamond/static/EBGaramond-Italic.ttf')
        .text(notesText, {
            align: 'center',  
            underline: true
        }
        )
}

function addDualDialogue(document, characters = [], text = []) {
    document
        .fontSize(12)
        .font('fonts/EB Garamond/static/EBGaramond-Bold.ttf')

        .table({rowStyles: { border: false },}).row(characters);

    document
        .moveUp(0.25)

        .font('fonts/EB Garamond/static/EBGaramond-Regular.ttf')

        .table({rowStyles: { border: false },}).row(text)
}

function addPageBreak(document, pageNumber) {
    addFooter(document, pageNumber);
    document
        .addPage()
}

function marginChecker(document, lineOne, lineTwo) {
    let heightOne = document.heightOfString(lineOne, {
            width: 410,
            align: 'left',
            indent: 108,
            indentAllLines: true
        })
    let heightTwo = document.heightOfString(lineTwo, {
            width: 410,
            align: 'left',
            indent: 108,
            indentAllLines: true
        })
    return true ? heightOne + heightTwo + document.y + 10 < document.page.height - 50 : false
}

doc.on('pageAdded', () => addHeader(doc, "Nodes of Eventide High : Are You Kidding Me (Reprise) [FORUM]"));

addHeader(doc, "Nodes of Eventide High : Are You Kidding Me (Reprise) [FORUM]")

addCenteredText(doc, "Template Page - NOT FOR ACTUAL USAGE!")

const scriptParser = new fountainParser;

var script = scriptParser.parseFile("ref/aykm.fountain")

let sectionIterator = 0;

let pageNumber = 1;

let startingX = doc.x
let startingY = doc.y

for (let token in script.tokens) {
    let addCont = false
    if (!marginChecker(doc, script.tokens[token].text, script.tokens[token].text)){
            addFooter(doc, pageNumber) 
            pageNumber += 1
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
            addPageBreak(doc, pageNumber);
            pageNumber += 1;
            break;

    }
}

// Finalize PDF file
doc.end();