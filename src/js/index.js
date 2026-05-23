const PDFDocument = require('pdfkit');
const fs = require('fs');

// Create a document
const doc = new PDFDocument({size: 'letter'});

doc.pipe(fs.createWriteStream('testing.pdf'));

doc
    .font('fonts/EB Garamond/static/EBGaramond-Bold.ttf')
    .text('LIZZY', {
        width: 410,
        align: 'center'  
    }
    )
    .font('fonts/EB Garamond/static/EBGaramond-Regular.ttf')
    .text('Before they gain advantage!'.toUpperCase(), {
        width: 460,
        align: 'left'
    }
    )

    .moveDown(0.5)
    .font('fonts/EB Garamond/static/EBGaramond-Bold.ttf')
    .fontSize(12)
    .text('JORDAN', {
        width: 410,
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
    .text('JORDAN makes his way centerstage. He holds his phone up above his head, and THE NETWORK copies his movement.', {
        width: 460,
        align: 'left',
        indent: 108,
        indentAllLines: true
    }
    )
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

    doc.text('1', doc.page.width / 2, doc.page.height - 50, {
        lineBreak: false,
        align: 'center',
    }
    );


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