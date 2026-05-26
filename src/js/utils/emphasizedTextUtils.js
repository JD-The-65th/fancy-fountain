import {fromMarkdown} from 'mdast-util-from-markdown'

// Dragons be here!

function parseUnderlines(str) {
    const regex = /(_[^_]+_)|([^_]+)/g
    const result = []
    let match

    while ((match = regex.exec(str)) !== null) {
        if (match[1]) {
            result.push({ text: match[1].slice(1, -1), underlined: true })
        } else {
            result.push({ text: match[2], underlined: false })
        }
    }

    return result;
}

function processTree(tree, existingQualities = []) {
    switch (tree.type) {
        case "text":
            existingQualities["text"] = tree.value
            break;
        case "strong":
            existingQualities["bold"] = true
            break;
        case "emphasis":
            existingQualities["italics"] = true
            break;
    }
    if (tree.children !== undefined) {
        for (let child of tree.children) {
            processTree(child, existingQualities)
        }
    }
    return existingQualities;
}

export function addEmphasizedText(document, text, defaultTextSettings, coordinates, customFont = false) {
    text = text.replaceAll("\n", "--PARSERBREAK--").replaceAll(" ", "--PARSERSPACE--")
    let underlinedSegments = parseUnderlines(text)

    let textSegments = []
    for (let segment of underlinedSegments) {
        if (segment.text === "\n") {
            textSegments.push(segment)
            continue;
        }
        let parsed = fromMarkdown(segment.text);

        for (let paragraph of parsed.children) {
            if (paragraph.type !== "paragraph") {
                break;
            }
            let paragraphChildren = []
            for (let item of paragraph.children) {
                let segmentDict = {}
                segmentDict["underlined"] = true ? segment.underlined : segmentDict["underlined"] = false;
                    
                textSegments.push(processTree(item, segmentDict))
            }        
        }
    }
    let itr = 0;
    for (let textSegment of textSegments) {
        textSegment.text = textSegment.text.replaceAll("--PARSERBREAK--", "\n").replaceAll("--PARSERSPACE--", " ") // What ever man.
        if (textSegment.text === "\n") { textSegment.text = "\n\n"} // This fixes that??? ...What even.
        let textSegmentSettings = Object.assign({}, defaultTextSettings);
        if (textSegments[itr + 1] !== undefined) { textSegmentSettings["continued"] = true } else { textSegmentSettings["continued"] = false }
        if (textSegment.underlined || textSegmentSettings["underline"] === true) { textSegmentSettings["underline"] = true } else { textSegmentSettings["underline"] = false }
        if (textSegment.italics || textSegmentSettings["oblique"] === true) { textSegmentSettings["oblique"] = true } else { textSegmentSettings["oblique"] = false }
        if (!customFont) { if (textSegment.bold) {document.font("Bold")} else {document.font("Regular")} }
        
        if (itr === 0) {
            if (coordinates !== undefined) {
                document.text(textSegment.text, coordinates[0], coordinates[1], textSegmentSettings)
            }
            else {
                document.text(textSegment.text, textSegmentSettings)
            }
        }
        else {
            document.text(textSegment.text, textSegmentSettings)
        }
        itr += 1;
    }

}
