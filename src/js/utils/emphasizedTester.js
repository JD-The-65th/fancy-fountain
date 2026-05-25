import { addEmphasizedText } from "./emphasizedTextUtils";
import { selectFont } from "./fontUtils";

import PDFDocument from 'pdfkit';

const doc = new PDFDocument()
selectFont(doc, "inter")

addEmphasizedText(doc, "This isn't right, **this isn't fair,** stop! _***Let me go!***_ PLEASE! _*This Isn't Right!*_", {dummy: true});