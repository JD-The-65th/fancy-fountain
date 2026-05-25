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

function processTree(tree, treeDictionary, children = []) {
    let childDictionary = []
    switch (tree.type) {
        case "text":
            console.log("Text Detected!")
            childDictionary["text"] = tree.value
        case "strong":
            console.log("Bold Detected!")
            childDictionary["bold"] = true
        case "emphasis":
            console.log("Emphasis Detected!")
            childDictionary["italics"] = true
    }
    if (tree.children !== undefined) {
        for (let child in tree.children) {
            children.push(processTree(tree.children[child], childDictionary, children))
        }
    }
    console.log(children)
    return treeDictionary;
}

export function addEmphasizedText(document, text, defaultTextSettings, coordinates) {
    // Singlehandedly the worst code I will ever write.
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
                    console.log(processTree(textItem, segmentDict))
            }
                    
        }

        // console.log(textSegments)
    }

}
