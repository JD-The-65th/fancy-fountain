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

export function addEmphasizedText(document, text, defaultTextSettings, coordinates) {
    // Singlehandedly the worst code I will ever write.
    // We are only going three levels deep with this.
    // If you go more than three levels deep you had it coming.
    let underlinedSegments = parseUnderlines(text)

    let textSegments = []
    for (let segment in underlinedSegments) {
        let parsed = fromMarkdown(underlinedSegments[segment].text);

        for (let paragraph in parsed.children) {
            if (parsed.children[paragraph].type !== "paragraph") {
                break;
            }
            for (let item in parsed.children[paragraph].children) {
                    let segmentDict = {}
                    segmentDict["underlined"] = true ? underlinedSegments[segment].underlined : segmentDict["underlined"] = false;
                    
                    let textItem = parsed.children[paragraph].children[item]
                    switch (textItem.type) {
                        case "text":
                            segmentDict["text"] = textItem.value
                            textSegments.push(segmentDict)
                            break;
                        case "strong":
                            console.log(textItem)
                            segmentDict["text"] = textItem.value
                            segmentDict["bold"] = true
                            textSegments.push(segmentDict)
                            break;
                        case "emphasis":
                            for (let emphasizedItem in textItem.children) {
                                // console.log(textItem.children[emphasizedItem])
                            }
                    }
                }
        }

        // console.log(textSegments)
    }

}
