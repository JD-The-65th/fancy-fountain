import regularGaramond from "../../../fonts/EB Garamond/static/EBGaramond-Regular.ttf" with {type: "file"}
import boldGaramond from "../../../fonts/EB Garamond/static/EBGaramond-Bold.ttf" with { type: "file" };
import semiBoldGaramond from "../../../fonts/EB Garamond/static/EBGaramond-SemiBold.ttf" with { type: "file" };
import extraBoldGaramond from "../../../fonts/EB Garamond/static/EBGaramond-ExtraBold.ttf" with {type: "file" };
import regularItalicizedGaramond from "../../../fonts/EB Garamond/static/EBGaramond-Italic.ttf" with { type: "file" };

import regularInter from "../../../fonts/Inter/static/Inter_18pt-Regular.ttf" with {type: "file"}
import boldInter from "../../../fonts/Inter/static/Inter_18pt-Bold.ttf" with { type: "file" };
import semiBoldInter from "../../../fonts/Inter/static/Inter_18pt-SemiBold.ttf" with { type: "file" };
import extraBoldInter from "../../../fonts/Inter/static/Inter_18pt-ExtraBold.ttf" with {type: "file" };
import regularItalicizedInter from "../../../fonts/Inter/static/Inter_18pt-Italic.ttf" with { type: "file" };

import regularCourier from "../../../fonts/Courier Prime/Courier Prime.ttf" with {type: "file"}
import boldCourier from "../../../fonts/Courier Prime/Courier Prime Bold.ttf" with { type: "file" };
import regularItalicizedCourier from "../../../fonts/Courier Prime/Courier Prime Italic.ttf" with { type: "file" };


export function selectFont(document, font) {
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
        case "courier":
            document.registerFont('Regular', regularCourier);
            document.registerFont('Bold', boldCourier);
            document.registerFont('SemiBold', regularCourier);
            document.registerFont('ExtraBold', boldCourier);
            document.registerFont('RegularItalicized', regularItalicizedCourier);
            break;
    }
}