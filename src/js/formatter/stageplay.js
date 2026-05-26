import converter from 'number-to-words';
import { formatter } from './formatter';
import { addEmphasizedText } from "../utils/emphasizedTextUtils"


class stageplayFormatter extends formatter {
    constructor(doc) {
        super(doc);
    }
    addHeader(document, headerTitle) {
        document
            .font("Bold")
            .fontSize(12)
            .moveUp(2)
            .text(headerTitle, {align: "center"})
            .moveDown(0.25)
            .moveTo(50, document.y) 
            .lineTo(document.page.width - 50, document.y) 
            .lineWidth(1)       
            .strokeColor('#000000')
            .stroke()
            .moveDown(0.5);
    }

    addFooter(document, pageNumber) {
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

    addSection(document, sectionName) {
        document
            .fontSize(28)
            .moveDown(0.25)
            .font('ExtraBold')
        addEmphasizedText(document, sectionName, {align: 'center'}, undefined, true)
        document.moveDown(0.25)

    }

    addSubSection(document, sectionText, sectionNumber, sectionAltPageNumber) {
        // TODO: Add annotation to next page
        document
            .fontSize(12)

            .moveDown(1.5)

            .rect(document.x, document.y - 20, 460, 25).fill('#000000').stroke()

            .moveUp(1)
            .font('Bold')
            .fillColor('white')
        addEmphasizedText(document, `#${sectionNumber} - ${sectionText}       Page ${sectionAltPageNumber}`, {align: 'center'}, undefined, true)
        document
            .fillColor('black')
            .moveDown(0.75)
    }

    addScene(document, sceneText, sceneNumber, subScene = "") {
        document
            .fontSize(12)
            .font('ExtraBold')
        addEmphasizedText(document, `SCENE ${converter.toWords(sceneNumber).toUpperCase()}${subScene} - ${sceneText}`, {width: 460, align: "left"}, undefined, true)
        document.moveDown(0.5)

    }

    addCharacter(document, characterName, continued, extensionText,) {
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
            this.addParenthetical(document, extensionText);
        }
    }

    addTransition(document, transitionText) {
        document
            .fontSize(12)
            .font('Regular')
            .text(transitionText, {
                width: 460,
                align: 'right'
            }
            )
    }

    addLyrics(document, lyricsText) {
        document
            .fontSize(12)
            .font('Regular')
        addEmphasizedText(document, lyricsText.toUpperCase(), {
            width: 460,
            align: 'left'
        })
    }

    addAction(document, actionText) {
        document
            .fontSize(12)
            .moveDown(0.5)
        addEmphasizedText(document, actionText, {
                width: 410,
                align: 'left',
                indent: 108,
                indentAllLines: true,
                oblique: true
            }
            )
        document.moveDown(0.5)
    }

    addDialogue(document, dialogueText) {
        let oldX = document.x
        document
            .fontSize(12)
            .font('Regular')
        addEmphasizedText(document, dialogueText, {
            width: 460,
                align: 'left',
            }, [108, document.y])
        document.x = oldX;
    }
    addParenthetical(document, parentheticalText) {
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

    addCenteredText(document, centeredTextText) {
        document
            .fontSize(12)
            .moveDown(0.5)
            .font('Regular')
            .text(centeredTextText, {
                align: 'center'  
            }
            )
    }

    addSynopses(document, synopsesText) {
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
    addNotes(document, notesText) {
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

    addDualDialogue(document, characters = [], text = []) {
        document
            .fontSize(12)
            .font('Bold')

            .table({rowStyles: { border: false },}).row(characters);

        document
            .moveUp(0.25)

            .font('Regular')

            .table({rowStyles: { border: false },}).row(text)
    }

    addPageBreak(document, pageNumber) {
        if (pageNumber != 0) {
            this.addFooter(document, pageNumber);
        }
        document.addPage()
    }

    marginChecker(document, lineOne, lineTwo, testLines = 0) {
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
    
}

export {stageplayFormatter};