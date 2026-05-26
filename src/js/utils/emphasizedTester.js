import { addEmphasizedText } from "./emphasizedTextUtils";
import { selectFont } from "./fontUtils";

import PDFDocument from 'pdfkit';

const doc = new PDFDocument()
selectFont(doc, "inter")

addEmphasizedText(doc, "Can you wait _until_ I cash in my favor to do... whatever *that* is?", {dummy: true});