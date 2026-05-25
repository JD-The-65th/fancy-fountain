import { formatter } from "./formatter";

export class titlePageFormatter extends formatter {
    constructor(doc) {
        super(doc);
    }
    addTitle(document, titleText) {
        document
            .font("Regular")
            .fontSize(12)
            .text(titleText, 0, (document.page.height / 2 - document.heightOfString(titleText)), {
                width: document.page.width,
                align: 'center',
            }
            )
            .moveDown(1)
    }
}