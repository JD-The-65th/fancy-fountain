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
    //console.log("Step 1")
    text = text.replaceAll("\n", "--PARSERBREAK--").replaceAll(" ", "--PARSERSPACE--")
    console.log(text)
    let underlinedSegments = parseUnderlines(text)
    //console.log("Step 2")

    let textSegments = []
    for (let segment of underlinedSegments) {
        if (segment.text === "\n") {
            textSegments.push(segment)
            continue;
        }
        let parsed = fromMarkdown(segment.text);
        //console.log("Step 3")

        for (let paragraph of parsed.children) {
            if (paragraph.type !== "paragraph") {
                break;
            }
            let paragraphChildren = []
            for (let item of paragraph.children) {
                let segmentDict = {}
                segmentDict["underlined"] = true ? segment.underlined : segmentDict["underlined"] = false;
                    
                textSegments.push(processTree(item, segmentDict))
                //console.log("Step 4")
            }        
        }
    }
    let itr = 0;
    for (let textSegment of textSegments) {
        //console.log("Step 5")
        textSegment.text = textSegment.text.replaceAll("--PARSERBREAK--", "\n").replaceAll("--PARSERSPACE--", " ") // What ever man.
        console.log(textSegment)
        if (textSegment.text === "\n") { textSegment.text = "\n\n"} // This fixes that??? ...What even.
        //console.log("Step 6")
        let textSegmentSettings = Object.assign({}, defaultTextSettings);
        if (textSegments[itr + 1] !== undefined) { textSegmentSettings["continued"] = true } else { textSegmentSettings["continued"] = false }
        if (textSegment.underlined || textSegmentSettings["underline"] === true) { textSegmentSettings["underline"] = true } else { textSegmentSettings["underline"] = false }
        if (textSegment.italics || textSegmentSettings["oblique"] === true) { textSegmentSettings["oblique"] = true } else { textSegmentSettings["oblique"] = false }
        if (!customFont) { if (textSegment.bold) {document.font("Bold")} else {document.font("Regular")} }
        console.log(textSegmentSettings)

        if (itr === 0) {
            if (coordinates !== undefined) {
                //console.log("Step 7 (1)")
                document.text(textSegment.text, coordinates[0], coordinates[1], textSegmentSettings)
                //console.log("Step 7 (1) Passed")
            }
            else {
                //console.log("Step 7 (2)")
                document.text(textSegment.text, textSegmentSettings)
                //console.log("Step 7 (2) Passed")
            }
        }
        else {
            // console.log("Step 7 (3)")
            // console.log(textSegment.text, textSegmentSettings)
            document.text(textSegment.text, textSegmentSettings)
            // console.log("Step 7 (3) Passed")
        }
        itr += 1;
    }

}
