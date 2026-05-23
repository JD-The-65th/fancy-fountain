import PDFDocument from 'pdfkit';
import fs from 'fs';
import converter from 'number-to-words';
import remarkParse from 'remark-parse'

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

function addCharacter(document, characterName) {
    document
        .fontSize(12)
        .moveDown(0.5)
        .font('fonts/EB Garamond/static/EBGaramond-Bold.ttf')
        .text(characterName, {
            align: 'center'  
        }
        )
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

doc.on('pageAdded', () => addHeader(doc, "Nodes of Eventide High : Are You Kidding Me (Reprise) [FORUM]"));

addHeader(doc, "Nodes of Eventide High : Are You Kidding Me (Reprise) [FORUM]")

addCenteredText(doc, "Template Page - NOT FOR ACTUAL USAGE!")

addSection(doc, "Act Two")


addSubSection(doc, "Are You Kidding Me (Reprise)", 2, 1)

addTransition(doc, "CUT TO:")
addScene(doc, "INT. Eventide High : Atrium - Moments Later", 4)

addSynopses(doc, "LIZZY enlists the help of JORDAN ALEXANDER to rally up the students.")

addCharacter(doc, "LIZZY")
addParenthetical(doc, "boldly")
addLyrics(doc, "Ted and Kev declared their war,")
addLyrics(doc, "I need all the dirt you can find and then some more!")
addLyrics(doc, "Get the people on our side, pound them into the floor")
addLyrics(doc, "Before they gain advantage!")

addCharacter(doc, "JORDAN")
addDialogue(doc, "I'll see what I can manage.")

addAction(doc, "JORDAN makes his way centerstage. He holds his phone up above his head, and THE NETWORK copies his movement.")

addLyrics(doc, "Calling all the folks of Eventide")
addLyrics(doc, "Lana needs our help; join by her side against")
addLyrics(doc, "Ted and Kevin and their snide tricks")
addLyrics(doc, "We stand unified!")
addLyrics(doc, "We may have our differences")
addLyrics(doc, "Even still, the difference is")
addLyrics(doc, "Stopping injustice is our biz")
addLyrics(doc, "Now, will you take a vow?")

addAction(doc, "The STUDENTS of Eventide High make a bold, inspiring march on stage.")

addCharacter(doc, "STUDENTS")
addLyrics(doc, "We are by your side now")
addLyrics(doc, "They'll hear our reply now")
addLyrics(doc, "They're running out of time now")
addLyrics(doc, "They're low tide now!")

addFooter(doc, 1)


// Add another page
doc
    .addPage()
    .fontSize(25)
    .text('Here is some vector graphics...', 100, 100);

// Add some text with annotations
doc
    .addPage()
    .fillColor('blue')
    .text('Here is a link!', 100, 100)
    .underline(100, 100, 160, 27, { color: '#0000FF' })
    .link(100, 100, 160, 27, 'http://google.com/');

// Finalize PDF file
doc.end();