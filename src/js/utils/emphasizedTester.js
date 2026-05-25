import { addEmphasizedText } from "./emphasizedTextUtils";
import { selectFont } from "./fontUtils";

import PDFDocument from 'pdfkit';

const doc = new PDFDocument()
selectFont(doc, "inter")

addEmphasizedText(doc, "INT.  _Eventide High_ : Councilor's Office - Afternoon", {dummy: true});