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
        for (let child in tree.children) {
            processTree(tree.children[child], existingQualities)
        }
    }
    return existingQualities;
}

export function addEmphasizedText(document, text, defaultTextSettings, coordinates) {
    let underlinedSegments = parseUnderlines(text)

    let textSegments = []
    for (let segment in underlinedSegments) {
        let parsed = fromMarkdown(underlinedSegments[segment].text);

        for (let paragraph in parsed.children) {
            if (parsed.children[paragraph].type !== "paragraph") {
                break;
            }
            let paragraphChildren = []
            for (let item in parsed.children[paragraph].children) {
                let segmentDict = {}
                segmentDict["underlined"] = true ? underlinedSegments[segment].underlined : segmentDict["underlined"] = false;
                    
                let textItem = parsed.children[paragraph].children[item]
                textSegments.push(processTree(textItem, segmentDict))
            }        
        }

        for (textSegment in textSegments) {
            let textSegmentSettings = defaultTextSettings;
            if (textSegments[Number(textSegment) + 1] !== undefined) { textSegmentSettings["continued"] = true }
            if (textSegments[textSegment].underlined) { textSegmentSettings["underline"] = true }
            if (textSegments[textSegment].italics) { textSegmentSettings["oblique"] = true }
            if (textSegments[textSegment].bold) {document.font("Bold")} else {document.font("Regular")}
        }
    }

}
