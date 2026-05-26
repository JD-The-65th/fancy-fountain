import { formatter } from "./formatter";

import { addEmphasizedText } from "../utils/emphasizedTextUtils"

export class titlePageFormatter extends formatter {
    constructor(doc, booklet) {
        super(doc, booklet);
    }
    bottomLeftLineHeight = 0;
    bottomRightLineHeight = 0;

    addTitle(document, titleText) {
        document
            .font("Regular")
            .fontSize(12)
        addEmphasizedText(document, titleText, { width: document.page.width, align: "center", }, [0, (document.page.height / 2 - document.heightOfString(titleText) * 2)])
        document.moveDown(0.5)

    }
    addCenteredText(document, centeredTextText) {
        document
            .fontSize(12)
            .font('Regular')
        addEmphasizedText(document, centeredTextText, {width: document.page.width, align: "center"})
        document.moveDown(0.5)
    }
    addBottomLeftText(document, bottomLeftText) {
        this.bottomLeftLineHeight += document.heightOfString(bottomLeftText + "\n")
        document
            .fontSize(12)
            .font('Regular')

        addEmphasizedText(document, bottomLeftText, 
            {width: document.page.width - 54, align: 'left'}, 
            [54, document.page.height - 80 - this.bottomLeftLineHeight])

        // Yes, I know this looks weird.
        // Some people put notes on the title page and DON'T frame them as notes.
        // FML.
        document.moveUp(16)
    }
    addBottomRightText(document, bottomRightText) {
        this.bottomRightLineHeight += document.heightOfString(bottomRightText + "\n")
        document
            .fontSize(12)
            .font('Regular')
        addEmphasizedText(document, bottomRightText, 
            {width: document.page.width - 54,
                align: 'right'
            },
            [0, document.page.height - 80 - this.bottomRightLineHeight]
        )
        // Ditto.
        document.moveUp(16)
    }
}