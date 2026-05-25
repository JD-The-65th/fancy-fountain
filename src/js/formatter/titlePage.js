import { formatter } from "./formatter";

export class titlePageFormatter extends formatter {
    constructor(doc) {
        super(doc);
    }
    bottomLeftLineHeight = 0;
    bottomRightLineHeight = 0;

    addTitle(document, titleText) {
        document
            .font("Regular")
            .fontSize(12)
            .text(titleText, 0, (document.page.height / 2 - document.heightOfString(titleText) * 2), {
                width: document.page.width,
                align: 'center',
            }
            )
            .moveDown(0.5)
    }
    addCenteredText(document, centeredTextText) {
        document
            .fontSize(12)
            .font('Regular')
            .text(centeredTextText, {
                width: document.page.width,
                align: 'center'  
            }
            )
            .moveDown(0.5)
    }
    addBottomLeftText(document, bottomLeftText) {
        this.bottomLeftLineHeight += document.heightOfString(bottomLeftText + "\n")
        document
            .fontSize(12)
            .font('Regular')
            .text(bottomLeftText, 0, document.page.height - 80 - this.bottomLeftLineHeight, {
                width: document.page.width,
                align: 'left',
                indent: 54,
                indentAllLines: true 
            }
            )
    }
    addBottomRightText(document, bottomRightText) {
        this.bottomRightLineHeight += document.heightOfString(bottomRightText + "\n")
        document
            .fontSize(12)
            .font('Regular')
            .text(bottomRightText, 0, document.page.height - 80 - this.bottomRightLineHeight, {
                width: document.page.width - 54,
                align: 'right'  
            }
            )
    }
}