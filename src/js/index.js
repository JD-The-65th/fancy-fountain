const PDFDocument = require('pdfkit');
const fs = require('fs');

// Create a document
const doc = new PDFDocument({size: 'letter'});

doc.pipe(fs.createWriteStream('testing.pdf'));

function createHeader(document, headerTitle) {
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

function createFooter(document, pageNumber) {
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

doc.on('pageAdded', () => createHeader(doc, "Nodes of Eventide High : Are You Kidding Me (Reprise) [FORUM]"));

createHeader(doc, "Nodes of Eventide High : Are You Kidding Me (Reprise) [FORUM]")
doc

    // Draw Section
    .moveDown(1.5)

    .rect(doc.x, doc.y - 20, 460, 25).fill('#000000').stroke()

    .moveUp(1)
    .font('fonts/EB Garamond/static/EBGaramond-Bold.ttf')
    .fillColor('white')
    .text('#2 - Are You Kidding Me (Reprise)', {
        align: 'center'  
    }
    )
    
    .fillColor('black')
    .moveDown(0.75)



    // End Section

    // Lizzy's Dialogue (LYRICS)
    .font('fonts/EB Garamond/static/EBGaramond-Bold.ttf')
    .text('LIZZY', {
        align: 'center'  
    }
    )
    .font('fonts/EB Garamond/static/EBGaramond-Regular.ttf')
    .text('Ted and Kev declared their war,'.toUpperCase(), {
        width: 460,
        align: 'left'
    }
    )
    .text('I need all the dirt you can find and then some more!'.toUpperCase(), {
        width: 460,
        align: 'left'
    }
    )
    .text('Get the people on our side, ound them into the floor'.toUpperCase(), {
        width: 460,
        align: 'left'
    }
    )
    .text('Before they gain advantage!'.toUpperCase(), {
        width: 460,
        align: 'left'
    }
    )

    // Jordan's Dialogue (Spoken Text, Action, Lyrics)
    .moveDown(0.5)
    .font('fonts/EB Garamond/static/EBGaramond-Bold.ttf')
    .fontSize(12)
    .text('JORDAN', {
        align: 'center'  
    }
    )
    .font('fonts/EB Garamond/static/EBGaramond-Regular.ttf')
    .text('I\'ll see what I can manage.', {
        width: 460,
        align: 'left',
        indent: 36,
        indentAllLines: true
    }
    )

    .moveDown(0.5)
    .text('JORDAN makes his way centerstage. He holds his phone up above his head, and THE NETWORK copies his movement.', {
        width: 410,
        align: 'left',
        indent: 108,
        indentAllLines: true
    }
    )
    .moveDown(0.5)

    .text('Calling all the folks of Eventide'.toUpperCase(), {
        width: 460,
        align: 'left'
    }
    )
    .text('Lana needs our help; join by her side against'.toUpperCase(), {
        width: 460,
        align: 'left'
    }
    )
    .text('Ted and Kevin and their snide tricks'.toUpperCase(), {
        width: 460,
        align: 'left'
    }
    )
    .text('We stand unified'.toUpperCase(), {
        width: 460,
        align: 'left'
    }
    )
    .text('We may have our differences'.toUpperCase(), {
        width: 460,
        align: 'left'
    }
    )
    .text('Even still, the difference is'.toUpperCase(), {
        width: 460,
        align: 'left'
    }
    )
    .text('Stopping injustice is our biz'.toUpperCase(), {
        width: 460,
        align: 'left'
    }
    )
    .text('Now, will you take a vow?'.toUpperCase(), {
        width: 460,
        align: 'left'
    }
    )

    // Student's Dialogue (Action and Lyrics)
    .moveDown(0.5)
    .text('The STUDENTS of Eventide High make a bold, inspiring march on stage.', {
        width: 410,
        align: 'left',
        indent: 108,
        indentAllLines: true
    }
    )
    .moveDown(0.5)

    .font('fonts/EB Garamond/static/EBGaramond-Bold.ttf')
    .text('STUDENTS', {
        align: 'center'  
    }
    )
    .font('fonts/EB Garamond/static/EBGaramond-Regular.ttf')
    .text('WE ARE BY YOUR SIDE NOW'.toUpperCase(), {
        width: 460,
        align: 'left'
    }
    )
    .text('THEY\'LL HEAR OUR REPLY NOW'.toUpperCase(), {
        width: 460,
        align: 'left'
    }
    )
    .text('THEY\'RE RUNNING OUT OF TIME NOW'.toUpperCase(), {
        width: 460,
        align: 'left'
    }
    )
    .text('THEY\'RE LOW TIDE NOW'.toUpperCase(), {
        width: 460,
        align: 'left'
    }
    )

    // Footer
    createFooter(doc, 1)


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