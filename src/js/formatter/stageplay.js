import converter from 'number-to-words';
import { formatter } from './formatter';
import { addEmphasizedText } from "../utils/emphasizedTextUtils"
import { getCurrentPageNumber } from '../utils/pdfUtils';

// Note : 1 Inch == this.defaultMarginpx
// Lyrics = 1 in from left
// Dialogue = 1.5 in from left
// Action = 2.5 in from left

function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}

class stageplayFormatter extends formatter {
    constructor(doc, booklet) {
        super(doc, booklet);
    }

    addHeader(document, headerTitle) {
        document
            .font("Bold")
            .fontSize(12)
            .moveUp(2)
            .text(headerTitle, this.defaultMargin, document.y, {align: "center", width: document.page.width - this.defaultMargin * 2})
            .moveDown(0.25)
            .moveTo(this.defaultMargin, document.y) 
            .lineTo(document.page.width - this.defaultMargin, document.y) 
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
        addEmphasizedText(document, sectionName, {align: 'center', width: document.page.width - this.defaultMargin * 2}, [this.defaultMargin, document.y], true)
        document.moveDown(0.25)

    }

    addSubSection(document, sectionText, sectionNumber, sectionAltPageNumber) {
        // TODO: Add annotation to next page
        document
            .fontSize(12)

            .moveDown(1.5)

            .rect(this.defaultMargin, document.y - 20, document.page.width - this.defaultMargin * 2, 25).fill('#000000').stroke()

            .moveUp(1)
            .font('Bold')
            .fillColor('white')
        addEmphasizedText(document, `#${sectionNumber} - ${sectionText}       Page ${sectionAltPageNumber}`, {align: 'center', width: document.page.width - this.defaultMargin * 2}, [this.defaultMargin, document.y], true)
        document
            .fillColor('black')
            .moveDown(0.75)
    }

    addScene(document, sceneText, sceneNumber, subScene = "") {
        // Resized
        document
            .fontSize(12)
            .font('ExtraBold')
        addEmphasizedText(document, `SCENE ${converter.toWords(sceneNumber).toUpperCase()}${subScene} - ${sceneText}`, {width: document.page.width - this.defaultMargin * 2, align: "left"}, [this.defaultMargin, document.y], true)
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
            .text(characterName, this.defaultMargin, document.y, {
                align: 'center',
                width: document.page.width - this.defaultMargin * 2
            },
            );
        if (extensionText) {
            this.addParenthetical(document, extensionText);
        }
    }

    addTransition(document, transitionText) {
        document
            .fontSize(12)
            .font('Regular')
            .text(transitionText, this.defaultMargin, document.y, {
                width: document.page.width - this.defaultMargin * 2,
                align: 'right'
            }
            )
    }

    addLyrics(document, lyricsText) {
        document
            .fontSize(12)
            .font('Regular')
        addEmphasizedText(document, lyricsText.toUpperCase(), {
            width: document.page.width - this.defaultMargin * 2,
            align: 'left'
        })
    }

    addAction(document, actionText) {
        document
            .fontSize(12)
            .moveDown(0.5)
        addEmphasizedText(document, actionText, {
                width: document.page.width - (this.defaultMargin * 2.5) - (this.defaultMargin + (this.defaultMargin * 0.5)),
                align: 'left',
                oblique: true
            }, [this.defaultMargin * 2.5, document.y]
            )
        document.moveDown(0.5)
    }

    addDialogue(document, dialogueText) {
        let oldX = document.x
        document
            .fontSize(12)
            .font('Regular')
        addEmphasizedText(document, dialogueText, {
            width: document.page.width - (this.defaultMargin + (this.defaultMargin / 2)) - this.defaultMargin,
            align: 'left',
            }, [this.defaultMargin + (this.defaultMargin / 2), document.y])
        document.x = oldX;
    }
    addParenthetical(document, parentheticalText) {
        let oldX = document.x
        document
            .fontSize(12)
        addEmphasizedText(document, `(${parentheticalText})`, {
                width: document.page.width - (this.defaultMargin + 54) - this.defaultMargin,
                align: 'left',
                oblique: true
            }, [(this.defaultMargin + 54), document.y])
        document.x = oldX;
    }

    addCenteredText(document, centeredTextText) {
        document
            .fontSize(12)
            .moveDown(0.5)
        addEmphasizedText(document, centeredTextText, {
                align: 'center',
                width: document.page.width - this.defaultMargin * 2
            }, [this.defaultMargin, document.y])
    }

    addSynopses(document, synopsesText) {
        document
            .fontSize(12)
            .moveDown(0.5)
        addEmphasizedText(document, synopsesText, {
                align: 'center',  
                underline: true,
                oblique: true,
                width: document.page.width - this.defaultMargin * 2
            }, [this.defaultMargin, document.y])
    }
    addNotes(document, notesText) {
        document
            .fontSize(12)
            .moveDown(0.5)
            .font('RegularItalicized')
        addEmphasizedText(document, notesText, {
                align: 'center',  
                underline: true,
                oblique: true,
                width: document.page.width - this.defaultMargin * 2
            }, [this.defaultMargin, document.y])
    }

    addDualDialogue(document, characters = [], text = {}, lineCount) {
        document.x = this.defaultMargin
        
        document
            .fontSize(12)
            .font('Bold')
            // .table({rowStyles: { border: false }}).row(characters);
        let currentY = document.y
        
        for (let character of range(characters.length, 0)) {
            let characterX = 0
            if (character === 0) {characterX = this.defaultMargin} else {characterX = this.defaultMargin + ((document.page.width - this.defaultMargin * 2) / (character + 1))}
            console.log(characterX)
            addEmphasizedText(document, characters[character] !== undefined ? characters[character] : "", {
                align: 'left',
                width: (document.page.width - this.defaultMargin * 2) / characters.length,
            }, [characterX, currentY], true)
        }

        document
            .moveUp(0.25)
        
        let itr = 0
        for (let line in range(lineCount, 0)) {
            document.moveUp(0.25)
            let currentLines = []
            let passesMarginCheck = true
            for (let character of characters) {
                currentLines.push(text[character][itr])
            }
            for (let characterLine of currentLines) {
                if (passesMarginCheck) {
                    passesMarginCheck = this.marginChecker(document, characterLine, "", 0, true)
                }
            }
            if (!passesMarginCheck) {
                this.addPageBreak(document, getCurrentPageNumber(document))
                document
                    .moveTo(this.defaultMargin, document.y)
                    .fontSize(12)
                    .font('Bold')
                    .table({rowStyles: { border: false }}).row(characters);
            }

            document
                .font("Regular")
                .table({rowStyles: { border: false }}).row(currentLines);
            itr += 1
        }

            
    }

    addPageBreak(document, pageNumber) {
        if (pageNumber != 0) {
            this.addFooter(document, pageNumber);
        }
        document.addPage()
    }

    marginChecker(document, lineOne, lineTwo, testLines = 0, dualDialogue = false) {
        document.font('Regular')
        const lineHeight = document.currentLineHeight(true);
        let heightOne
        let heightTwo

        if (!dualDialogue) {
            heightOne = document.heightOfString(lineOne, {
                width: document.page.width - (this.defaultMargin * 2),
                align: 'left',
            })
            heightTwo = document.heightOfString(lineTwo, {
                    width: document.page.width - (this.defaultMargin * 2),
                    align: 'left',
            })
        }
        else {
            heightOne = document.heightOfString(lineOne, {
                width: (document.page.width / 2) - (this.defaultMargin * 2),
                align: 'left',
            })
            heightTwo = document.heightOfString(lineTwo, {
                width: (document.page.width / 2) - (this.defaultMargin * 2),
                align: 'left',
            })
        }

        return heightOne + heightTwo + document.y + (lineHeight) + (lineHeight * testLines) < document.page.height - 60
    }
    
}

export {stageplayFormatter};