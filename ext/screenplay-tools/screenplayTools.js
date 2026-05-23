import { XMLParser, XMLBuilder } from 'fast-xml-parser';

// This file is part of an MIT-licensed project: see LICENSE file or README.md for details.
// Copyright (c) 2024 Ian Thomas

const ElementType = Object.freeze({
    TITLEENTRY: 'TITLEENTRY',
    HEADING: 'HEADING',
    ACTION: 'ACTION',
    CHARACTER: 'CHARACTER',
    DIALOGUE: 'DIALOGUE',
    PARENTHETICAL: 'PARENTHETICAL',
    LYRIC: "LYRIC",
    TRANSITION: "TRANSITION",
    PAGEBREAK: "PAGEBREAK",
    NOTE: "NOTE",
    BONEYARD: "BONEYARD",
    SECTION: "SECTION",
    SYNOPSIS: "SYNOPSIS"
});

// Base class for all elements
class Element {
    constructor(type, text) {
        this.type = type;
        this._text = text;
        this.tags = [];
    }

    // This version will not contain any annotations / note markup
    get text() {
        const regex = /\[\[\d+\]\]|\/*\d+\*\//g;
        return this._text.replace(regex, "");
    }

    // Returns with embedded notes (e.g. [[1]] means notes index 1) or boneyards (e.g. /*2*/ means boneyard index 2)
    get textRaw() {
        return this._text;
    }

    appendLine(line) {
        this._text += "\n" + line;
    }

    appendTags(tags) {
        this.tags = this.tags.concat(tags.filter(item => !this.tags.includes(item)));
    }

    // For debugging
    dump() {
        return `${this.type}:"${this._text}"`;
    }
}


class TitleEntry extends Element {
    constructor(key, text) {
        super(ElementType.TITLEENTRY, text);
        this.key = key;
    }

    // For debugging
    dump() {
        return `${this.type}:"${this.key}":"${this._text}"`
    }
}


class Action extends Element {
    constructor(text, forced = false) {
        super(ElementType.ACTION, text);
        this.centered = false;
        this.forced = forced;
    }

    // For debugging
    dump() {
        let out = `${this.type}:"${this._text}"`;
        if (this.centered)
            out += " (centered)";
        return out;
    }
}


class SceneHeading extends Element {
    constructor(text, sceneNumber, forced = false) {
        super(ElementType.HEADING, text);
        this.sceneNumber = sceneNumber;
        this.forced = forced;
    }

    // For debugging
    dump() {
        let out = `${this.type}:"${this.text}"`;
        if (this.sceneNumber) {
            out += ` (${this.sceneNumber})`;
        }
        return out;
    }
}


class Character extends Element {
    constructor(name, extension, dual, forced = false) {
        super(ElementType.CHARACTER, "");
        this.name = name;
        this.extension = extension;
        this.isDualDialogue = dual;
        this.forced = forced;
    }

    // For debugging
    dump() {
        let out = `${this.type}:"${this.name}"`;
        if (this.extension) {
            out += ` "(${this.extension})"`;
        }
        if (this.isDualDialogue)
            out += ` (Dual)`;
        return out;
    }
}


class Dialogue extends Element {
    constructor(text) {
        super(ElementType.DIALOGUE, text);
    }
}


class Parenthetical extends Element {
    constructor(text) {
        super(ElementType.PARENTHETICAL, text);
    }
}


class Lyric extends Element {
    constructor(text) {
        super(ElementType.LYRIC, text);
    }
}


class Transition extends Element {
    constructor(text, forced = false) {
        super(ElementType.TRANSITION, text);
        this.forced = forced;
    }
}


class PageBreak extends Element {
    constructor() {
        super(ElementType.PAGEBREAK, "");
    }
}


class Note extends Element {
    constructor(text) {
        super(ElementType.NOTE, text);
    }
}


class Boneyard extends Element {
    constructor(text) {
        super(ElementType.BONEYARD, text);
    }
}


class Section extends Element {
    constructor(level, text) {
        super(ElementType.SECTION, text);
        this.level = level;
    }

    // For debugging
    dump() {
        return `${this.type}:"${this._text}" (${this.level})`;
    }
}

class Synopsis extends Element {
    constructor(text) {
        super(ElementType.SYNOPSIS, text);
    }
}


// Parsed script
class Script {

    constructor() {
        this.titleEntries = [];
        this.elements = [];
        this.notes = [];
        this.boneyards = [];
        this.lastChar = null;
    }

    dump() {
        let lines = [];
        for (const entry of this.titleEntries) {
            if (entry.tags.length > 0)
                lines.push(`${entry.dump()} tags:${entry.tags}`);
            else
                lines.push(`${entry.dump()}`);
        }
        for (const element of this.elements) {
            if (element.tags.length > 0)
                lines.push(`${element.dump()} tags:${element.tags}`);
            else
                lines.push(`${element.dump()}`);
        }
        let i = 0;
        for (const note of this.notes) {
            lines.push(`[[${i}]]${note.dump()}`);
            i++;
        }
        i = 0;
        for (const boneyard of this.boneyards) {
            lines.push(`/*${i}*/${boneyard.dump()}`);
            i++;
        }
        return lines.join("\n");
    }

    getLastElem() {
        if (this.elements.length == 0)
            return null;
        return this.elements[this.elements.length - 1];
    }

    addElement(elem, allowMerge = false) {
        let lastElem = this.getLastElem();
        if (elem.type == ElementType.CHARACTER) {
            let newChar = elem.name + (elem.extension ? elem.extension : "");
            if (allowMerge && this.lastChar == newChar)
                return;
            this.lastChar = newChar;
        }

        else if (elem.type == ElementType.DIALOGUE) {
            if (allowMerge && lastElem && lastElem.type == ElementType.DIALOGUE) {
                lastElem._text += "\n" + elem._text;
                return;
            }
        }

        else if (elem.type == ElementType.PARENTHETICAL) ;

        else {
            this.lastChar = null;
        }

        if (elem.type == ElementType.ACTION) {
            if (allowMerge && lastElem && lastElem.type == ElementType.ACTION) {
                lastElem._text += "\n" + elem._text;
                return;
            }
        }

        this.elements.push(elem);
    }
}

// This file is part of an MIT-licensed project: see LICENSE file or README.md for details.
// Copyright (c) 2024 Ian Thomas


// Module-level Regex Constants
const REGEX_TITLE_ENTRY = /^\s*([A-Za-z0-9 ]+?)\s*:\s*(.*?)\s*$/;
const REGEX_TITLE_MULTILINE_ENTRY = /^( {3,}|\t)/;
const REGEX_PAGE_BREAK = /^\s*={3,}\s*$/;
const REGEX_SYNOPSIS = /^=(?!\=)/;
const REGEX_HEADING_DECODE = /^(.*?)(?:\s*#([a-zA-Z0-9\-.]+)#)?$/;
const REGEX_FORCED_SCENE_HEADING = /^\.[a-zA-Z0-9]/;
const REGEX_SCENE_HEADING = /^\s*((INT|EXT|EST|INT\.\/EXT|INT\/EXT|I\/E)(\.|\s))|(FADE IN:\s*)/i;
const REGEX_FORCED_TRANSITION = /^\s*(?:[A-Z\s]+TO:)\s*$/;
const REGEX_PARENTHETICAL = /^\s*\((.*)\)\s*$/;
const REGEX_CONT = /\(\s*CONT[’']D\s*\)/g;
const REGEX_CHARACTER = /^([^(\^]+?)\s*(?:\((.*)\))?(?:\s*\^\s*)?$/;
const REGEX_CHARACTER_SIMPLE = /^([A-Z][^a-z]*?)\s*(?:\(.*\))?(?:\s*\^\s*)?$/; // Simplified for initial check
const REGEX_TAGS = /\s#([^\s#][^#]*?)(?=\s|$)/g;

function isWhitespaceOrEmpty(line) {
    return (!line.trim());
}

// Incremental parser - use .addText(), .addLines(), .addLine() to parse, use .script to retrieve the parsed script.
class FountainParser {

    constructor() {
        this.script = new Script();

        this.mergeActions = true;
        this.mergeDialogue = true;
        this.useTags = false;

        this._inTitlePage = true;
        this._multiLineTitleEntry = false;

        this._lineBeforeBoneyard = "";
        this._boneyard = null;

        this._lineBeforeNote = "";
        this._note = null;

        this._pending = [];
        this._padActions = [];

        this._line = "";
        this._lineTrim = "";
        this._lastLineEmpty = true;
        this._lastLine = "";
        this._lineTags = [];

        this._inDialogue = false;
    }

    // Expects UTF-8 text
    addText(inputText) {

        const lines = inputText.split(/\r?\n|\r/);
        return this.addLines(lines);
    }

    // Expects array of UTF-8 text lines
    addLines(lines) {

        for (const line of lines) {
            this.addLine(line);
        }
        this.finalize();
    }

    // Expects a single UTF-8 text line
    addLine(line) {

        this._lastLine = this._line;
        this._lastLineEmpty = isWhitespaceOrEmpty(this._line);

        this._line = line;

        if (this._parseBoneyard())
            return;

        if (this._parseNotes())
            return;

        let newTags = [];
        if (this.useTags) {
            const { untagged, tags } = this._extractTags(line);
            newTags = tags;
            this._line = untagged;
        }

        this._lineTrim = this._line.trim();

        // Some decisions can't be made until the next line lands
        if (this._pending.length > 0)
            this._parsePending();

        this._lineTags = newTags;

        if (this._inTitlePage && this._parseTitlePage())
            return;

        if (this._parseSection())
            return;

        if (this._parseForcedAction())
            return true;

        if (this._parseForcedSceneHeading())
            return true;

        if (this._parseForcedCharacter())
            return true;

        if (this._parseForcedTransition())
            return true;

        if (this._parsePageBreak())
            return;

        if (this._parseLyrics())
            return;

        if (this._parseSynopsis())
            return;

        if (this._parseCentredText())
            return;

        if (this._parseSceneHeading())
            return;

        if (this._parseTransition())
            return;

        if (this._parseParenthetical())
            return;

        if (this._parseCharacter())
            return;

        if (this._parseDialogue())
            return;

        this._parseAction();
    }

    // If you have definitely finished parsing, call this, as it completes
    // anything that's been waiting for the next line.
    // This is automatically called by addLines() and addText()
    finalize() {
        this._line = "";
        this._lineTrim = "";
        this._parsePending();
    }

    // Adds a new element or merges with existing element
    _addElement(elem) {

        elem.appendTags(this._lineTags);
        this._lineTags = [];

        let lastElem = this.script.getLastElem();

        // Are we trying to add a blank action line?
        if (elem.type == ElementType.ACTION && isWhitespaceOrEmpty(elem.textRaw) && !elem.centered) {

            this._inDialogue = false;

            // If this follows an existing action line, put it on as possible padding.
            if (lastElem && lastElem.type == ElementType.ACTION) {
                this._padActions.push(elem);
                return;
            }
            return;
        }

        // Add padding if there's some outstanding and we're just about to add another action.
        if (elem.type == ElementType.ACTION && this._padActions.length > 0) {

            if (this.mergeActions && !lastElem.centered) {
                for (const padAction of this._padActions) {
                    lastElem.appendLine(padAction.textRaw);
                    lastElem.appendTags(padAction.tags);
                }
            }
            else {
                for (const padAction of this._padActions) {
                    this.script.elements.push(padAction);
                }
            }
        }

        this._padActions = [];

        // If we're allowing actions to be merged, do it here.
        if (this.mergeActions && elem.type == ElementType.ACTION && !elem.centered) {
            if (lastElem && lastElem.type == ElementType.ACTION && !lastElem.centered) {
                lastElem.appendLine(elem.textRaw);
                lastElem.appendTags(elem.tags);
                return;
            }
        }

        this.script.elements.push(elem);

        this._inDialogue = (elem.type == ElementType.CHARACTER || elem.type == ElementType.PARENTHETICAL || elem.type == ElementType.DIALOGUE);
    }

    _parsePending() {

        for (const pending of this._pending) {

            pending.element.appendTags(this._lineTags);
            pending.backup.appendTags(this._lineTags);
            this._lineTags = [];

            if (pending.type == ElementType.TRANSITION) {

                if (isWhitespaceOrEmpty(this._line)) {  // Blank line, so it's definitely a transition
                    this._addElement(pending.element);
                } else {
                    this._addElement(pending.backup);
                }
            } else if (pending.type == ElementType.CHARACTER) {
                if (!isWhitespaceOrEmpty(this._line)) {  // Filled line, so it's definitely a piece of dialogue
                    this._addElement(pending.element);
                } else {
                    this._addElement(pending.backup);
                }
            }
        }
        this._pending = [];

    }

    _parseTitlePage() {

        let match = this._line.match(REGEX_TITLE_ENTRY);
        if (match) {    // It's of form key:text
            let text = match[2];
            this.script.titleEntries.push(new TitleEntry(match[1], text));
            this._multiLineTitleEntry = (text.length == 0);
            return true

        }

        if (this._multiLineTitleEntry) { // If we're expecting text on this line
            if (REGEX_TITLE_MULTILINE_ENTRY.test(this._line)) {
                let entry = this.script.titleEntries[this.script.titleEntries.length - 1];
                entry.appendLine(this._line);
                return true;
            }

        }

        this._inTitlePage = false;
        return false;
    }

    _parsePageBreak() {

        if (REGEX_PAGE_BREAK.test(this._line)) {
            this._addElement(new PageBreak());
            return true;
        }
        return false;
    }

    _parseLyrics() {

        if (this._lineTrim.startsWith('~')) {
            this._addElement(new Lyric(this._lineTrim.slice(1).trimStart()));
            return true;
        }
        return false;
    }

    _parseSynopsis() {

        if (REGEX_SYNOPSIS.test(this._lineTrim)) {
            this._addElement(new Synopsis(this._lineTrim.slice(1).trimStart()));
            return true;
        }
        return false;
    }

    _parseCentredText() {

        if (this._lineTrim.startsWith('>') && this._lineTrim.endsWith('<')) {
            // ACTION Logic: Remove tabs
            const text = this._lineTrim.slice(1, this._lineTrim.length - 1);
            let newElem = this.createAction(text);
            newElem.centered = true;
            this._addElement(newElem);
            return true;
        }
        return false;
    }

    _decodeSceneHeading(line) {
        const match = line.match(REGEX_HEADING_DECODE);
        return match ? { text: match[1].trim(), sceneNum: match[2] || null } : null;
    }

    _parseForcedSceneHeading() {
        if (REGEX_FORCED_SCENE_HEADING.test(this._lineTrim)) {
            let heading = this._decodeSceneHeading(this._lineTrim.slice(1));
            this._addElement(new SceneHeading(heading.text, heading.sceneNum, true));
            return true;
        }
        return false;
    }

    _parseSceneHeading() {

        if (REGEX_SCENE_HEADING.test(this._line)) {
            let heading = this._decodeSceneHeading(this._lineTrim);
            this._addElement(new SceneHeading(heading.text, heading.sceneNum));
            return true;
        }
        return false;
    }

    _parseForcedTransition() {
        if (this._lineTrim.startsWith(">") && !this._lineTrim.endsWith("<")) {
            this._addElement(new Transition(this._lineTrim.slice(1).trim(), true));
            return true;
        }
        return false;
    }

    _parseTransition() {
        if (REGEX_FORCED_TRANSITION.test(this._line) && isWhitespaceOrEmpty(this._lastLine)) {

            if (this._lastLineEmpty) {
                // Can't commit to which this is until we've checked the next line is empty.
                this._pending.push({
                    type: ElementType.TRANSITION,
                    element: new Transition(this._lineTrim),
                    backup: this.createAction(this._lineTrim)
                });

                return true;
            }
        }
        return false;
    }

    _parseParenthetical() {

        let lastElem = this.script.getLastElem();
        let match = this._line.match(REGEX_PARENTHETICAL);
        if (match && this._inDialogue && lastElem && (lastElem.type == ElementType.CHARACTER || lastElem.type == ElementType.DIALOGUE)) {
            this._addElement(new Parenthetical(match[1]));
            return true;
        }
        return false;
    }

    _decodeCharacter(line) {
        // Remove any CONT'D notes
        let lineTrim = line.trim().replace(REGEX_CONT, "");

        const match = lineTrim.match(REGEX_CHARACTER);
        if (match) {
            const name = match[1].trim(); // Extract NAME
            const extension = match[2] ? match[2].trim() : null; // Extract extension if present
            const hasCaret = line.trim().endsWith('^'); // Check for the caret
            return { name: name, dual: hasCaret, extension: extension };
        }
        return null; // Invalid format
    }

    _parseForcedCharacter() {
        // Remove any CONT'D notes
        if (this._lineTrim.startsWith("@")) {

            let lineTrim = this._lineTrim.slice(1);

            let character = this._decodeCharacter(lineTrim);
            if (character == null)
                return false;

            this._addElement(new Character(character.name, character.extension, character.dual));

            return true;
        }
        return false;
    }

    _parseCharacter() {

        // Remove any CONT'D notes
        let lineTrim = this._lineTrim.replace(REGEX_CONT, "").trim();

        if (this._lastLineEmpty && REGEX_CHARACTER_SIMPLE.test(lineTrim)) {

            let character = this._decodeCharacter(lineTrim);
            if (character == null)
                return false;

            let charElem = new Character(character.name, character.extension, character.dual);

            // Can't commit to which this is until we've checked the next line isn't empty.
            this._pending.push({
                type: ElementType.CHARACTER,
                element: charElem,
                backup: this.createAction(this._lineTrim)
            });

            return true;

        }
        return false;
    }

    _parseDialogue() {

        let lastElem = this.script.getLastElem();
        if (lastElem && this._line.length > 0 && (lastElem.type == ElementType.CHARACTER || lastElem.type == ElementType.PARENTHETICAL)) {
            this._addElement(new Dialogue(this._lineTrim));
            return true;
        }

        // Was the previous line dialogue? If so, offer possibility of merge
        if (lastElem && lastElem.type == ElementType.DIALOGUE) {

            // Special case - line-break in Dialogue. Only valid with more than one white-space character in the line.
            if (this._lastLineEmpty && this._lastLine.length > 0) {
                if (this.mergeDialogue) {
                    lastElem.appendLine("");
                    lastElem.appendLine(this._lineTrim);
                }
                else {
                    this._addElement(new Dialogue(""));
                    this._addElement(new Dialogue(this._lineTrim));
                }
                return true;
            }

            // Merge if the last line wasn't empty
            if (!this._lastLineEmpty && this._lineTrim.length > 0) {
                if (this.mergeDialogue)
                    lastElem.appendLine(this._lineTrim);
                else
                    this._addElement(new Dialogue(this._lineTrim));
                return true;
            }
        }

        return false;
    }

    _parseForcedAction() {
        if (this._lineTrim.startsWith("!")) {
            // ACTION Logic: Remove tabs
            const text = this._lineTrim.slice(1);
            this._addElement(this.createAction(text, true));
            return true;
        }
        return false;
    }

    _parseAction() {
        // ACTION Logic: Remove tabs
        this._addElement(this.createAction(this._line));
    }

    // Returns null if there is no content to continue parsing
    _parseBoneyard() {

        // Deal with any in-line boneyards
        let open = this._line.indexOf("/*");
        let close = this._line.indexOf("*/", open > -1 ? open : 0);
        let lastTag = -1;
        while (open > -1 && close > open) {
            let boneyardText = this._line.slice(open + 2, close);
            this.script.boneyards.push(new Boneyard(boneyardText));
            let tag = `/*${this.script.boneyards.length - 1}*/`;
            this._line = this._line.slice(0, open) + tag + this._line.slice(close + 2);
            lastTag = open + tag.length;
            open = this._line.indexOf("/*", lastTag);
            close = this._line.indexOf("*/", lastTag);
        }

        // If not in boneyard, check for boneyard content
        if (!this._boneyard) {

            let idx = this._line.indexOf("/*", lastTag > -1 ? lastTag : 0);
            if (idx > -1) { // Move into boneyard
                this._lineBeforeBoneyard = this._line.slice(0, idx);
                this._boneyard = new Boneyard(this._line.slice(idx + 2));
                return true;
            }

        } else {

            // Check for end of boneyard content
            let idx = this._line.indexOf("*/", lastTag > -1 ? lastTag : 0);
            if (idx > -1) {
                this._boneyard.appendLine(this._line.slice(0, idx));
                this.script.boneyards.push(this._boneyard);
                let tag = `/*${this.script.boneyards.length - 1}*/`;
                this._line = this._lineBeforeBoneyard + tag + this._line.slice(idx + 2);
                this._lineBeforeBoneyard = "";
                this._boneyard = null;
            }
            else { // Still in boneyard
                this._boneyard.appendLine(this._line);
                return true;
            }
        }
        return false;
    }

    // Returns null if there is no content to continue parsing
    _parseNotes() {

        // Deal with any in-line notes
        let open = this._line.indexOf("[[");
        let close = this._line.indexOf("]]", open > -1 ? open : 0);
        let lastTag = -1;
        while (open > -1 && close > open) {
            let noteText = this._line.slice(open + 2, close);
            this.script.notes.push(new Note(noteText));
            let tag = `[[${this.script.notes.length - 1}]]`;
            this._line = this._line.slice(0, open) + tag + this._line.slice(close + 2);
            lastTag = open + tag.length;
            open = this._line.indexOf("[[", lastTag);
            close = this._line.indexOf("]]", lastTag);
        }

        // If not in notes, check for note content
        if (!this._note) {

            let idx = this._line.indexOf("[[", lastTag > -1 ? lastTag : 0);
            if (idx > -1) { // Move into notes
                this._lineBeforeNote = this._line.slice(0, idx);
                this._note = new Note(this._line.slice(idx + 2));
                this._line = this._lineBeforeNote;
                return true;
            }

        } else {

            // Check for end of note content
            let idx = this._line.indexOf("]]", lastTag > -1 ? lastTag : 0);
            if (idx > -1) {
                this._note.appendLine(this._line.slice(0, idx));
                this.script.notes.push(this._note);
                let tag = `[[${this.script.notes.length - 1}]]`;
                this._line = this._lineBeforeNote + tag + this._line.slice(idx + 2);
                this._lineBeforeNote = "";
                this._note = null;
            }
            else if (this._line == "") {
                // End of note due to line break.
                this.script.notes.push(this._note);
                let tag = `[[${this.script.notes.length - 1}]]`;
                this._line = this._lineBeforeNote + tag;
                this._lineBeforeNote = "";
                this._note = null;
            }
            else { // Still in notes
                this._note.appendLine(this._line);
                return true;
            }
        }
        return false;
    }

    _parseSection() {
        let depth = 0;
        for (let char of this._lineTrim) {
            if (char === '#' && depth < 7) {
                depth += 1;
            } else {
                break;
            }
        }
        if (depth === 0) {
            return false;
        }

        this._addElement(new Section(depth, this._lineTrim.slice(depth).trim()));
        return true;
    }

    _extractTags(line) {
        let tags = [];
        let match;
        let firstMatchIndex = null;

        while ((match = REGEX_TAGS.exec(line)) !== null) {
            if (firstMatchIndex === null) {
                firstMatchIndex = match.index;
            }
            tags.push(match[1]);
        }

        const untagged = firstMatchIndex !== null ? line.substring(0, firstMatchIndex).trimEnd() : line;
        return { untagged: untagged, tags: tags };
    }

    createAction(text, forced = false) {
        return new Action(text.replace(/\t/g, '    '), forced);
    }
}

// This file is part of an MIT-licensed project: see LICENSE file or README.md for details.
// Copyright (c) 2024 Ian Thomas


class FountainCallbackParser extends FountainParser {

    constructor() {
        super();

        // array of {key:"key", value:"value"} 
        this.onTitlePage = null;

        // character:string, extension:string, parenthetical:string, line:string, isDualDialogue:bool
        this.onDialogue = null;

        // text:string
        this.onAction = null;

        // text:string, sceneNumber:string
        this.onSceneHeading = null;

        // text:string
        this.onLyrics = null;

        // text:string
        this.onTransition = null;

        // text:string, level:int
        this.onSection = null;

        // text:string
        this.onSynopsis = null;

        // No params 
        this.onPageBreak = null;



        this.ignoreBlanks = true; // By default don't callback on blank lines.

        this._lastChar = null;
        this._lastParen = null;
    }

    addLine(line) {

        this.mergeActions = false; // Don't merge actions, that's a problem for callbacks.
        this.mergeDialogue = false; // Don't merge dialogue, that's a problem for callbacks.

        let elementCount = this.script.elements.length;
        let inTitlePage = this._inTitlePage;

        super.addLine(line);

        if (inTitlePage && !this._inTitlePage) {
            // Finished reading title page
            if (this.onTitlePage) {
                let entries = [];
                for (const entry of this.script.titleEntries) {
                    entries.push({ "key": entry.key, "value": entry.text });
                }
                this.onTitlePage(entries);
            }
        }

        while (elementCount < this.script.elements.length) {
            this._handleNewElement(this.script.elements[elementCount]);
            elementCount++;
        }
    }

    _handleNewElement(elem) {

        if (elem.type == ElementType.CHARACTER) {
            this._lastChar = elem;
            return;
        }

        if (elem.type == ElementType.PARENTHETICAL) {
            this._lastParen = elem;
            return;
        }

        if (elem.type == ElementType.DIALOGUE) {

            let character = this._lastChar.name;
            let extension = this._lastChar.extension;
            let parenthetical = this._lastParen ? this._lastParen.text : null;
            let line = elem.text;
            let isDualDialogue = this._lastChar.isDualDialogue;

            this._lastParen = null;

            if (this.ignoreBlanks && !line.trim())
                return;

            if (this.onDialogue)
                this.onDialogue(character, extension, parenthetical, line, isDualDialogue);
            return;
        }

        this._lastChar = null;
        this._lastParen = null;

        if (elem.type == ElementType.ACTION) {

            if (this.ignoreBlanks && !elem.text.trim())
                return;

            if (this.onAction)
                this.onAction(elem.text);
            return;
        }

        if (elem.type == ElementType.HEADING) {

            if (this.ignoreBlanks && !elem.text.trim())
                return;

            if (this.onSceneHeading)
                this.onSceneHeading(elem.text, elem.sceneNumber);
            return;
        }

        if (elem.type == ElementType.LYRIC) {

            if (this.ignoreBlanks && !elem.text.trim())
                return;

            if (this.onLyrics)
                this.onLyrics(elem.text);
            return;
        }

        if (elem.type == ElementType.TRANSITION) {

            if (this.ignoreBlanks && !elem.text.trim())
                return;

            if (this.onTransition)
                this.onTransition(elem.text);
            return;
        }

        if (elem.type == ElementType.SECTION) {

            if (this.onSection)
                this.onSection(elem.text, elem.level);
            return;
        }

        if (elem.type == ElementType.SYNOPSIS) {

            if (this.onSynopsis)
                this.onSynopsis(elem.text);
            return;
        }

        if (elem.type == ElementType.PAGEBREAK) {
            if (this.onPageBreak)
                this.onPageBreak();
            return;
        }
    }

}

// This file is part of an MIT-licensed project: see LICENSE file or README.md for details.
// Copyright (c) 2024 Ian Thomas

function fountainToHtml(input) {
    // Escape sequences for emphasis characters
    const escapeMap = {
      "\\*": "!!ESCAPEDASTERISK!!",
      "\\_": "!!ESCAPEDUNDERSCORE!!"
    };
    let processed = input.replace(/\\(\*|_)/g, (match, char) => escapeMap[`\\${char}`]);
  
        // Split input into lines and process each line individually
        const lines = processed.split('\n').map(line => {
        // Handle ***bold italics***, ensuring no space before the closing ***
        line = line.replace(/\*\*\*(\S.*?\S|\S)\*\*\*(?!\s)/g, "<b><i>$1</i></b>");
        
        // Handle **bold**, ensuring no space before the closing **
        line = line.replace(/\*\*(\S.*?\S|\S)\*\*(?!\s)/g, "<b>$1</b>");
        
        // Handle *italics*, ensuring no space before the closing *
        line = line.replace(/\*(\S.*?\S|\S)\*(?!\s)/g, "<i>$1</i>");
        
        // Handle _underline_
        line = line.replace(/_(\S.*?\S|\S)_(?!\s)/g, "<u>$1</u>");
  
        return line;
    });
  
    // Re-join lines and restore escaped characters
    processed = lines.join("\n");
    processed = processed
      .replace(/\!\!ESCAPEDASTERISK\!\!/g, "*")
      .replace(/\!\!ESCAPEDUNDERSCORE\!\!/g, "_");
  
    return processed;
  }

// This file is part of an MIT-licensed project: see LICENSE file or README.md for details.
// Copyright (c) 2024 Ian Thomas


class FountainWriter {
    constructor() {
        this.prettyPrint = true;

        this._lastChar = null;
    }

    // Expects Script
    // returns utf-8 string
    write(script) {

        let lines = [];

        if (script.titleEntries.length > 0) {

            for (const entry of script.titleEntries) {
                lines.push(this._writeElem(entry));
            }

            lines.push("");
        }

        let lastElem = null;

        for (const element of script.elements) {

            // Padding
            let padBefore = false;
            if (element.type == ElementType.CHARACTER
                || element.type == ElementType.TRANSITION
                || element.type == ElementType.HEADING
            ) {
                padBefore = true;
            } else if (element.type == ElementType.ACTION) {
                padBefore = !lastElem || lastElem.type != ElementType.ACTION;
            }

            if (padBefore)
                lines.push("");

            lines.push(this._writeElem(element));

            lastElem = element;
        }

        let text = lines.join("\n");

        const regexNotes = /\[\[(\d+)\]\]/g;

        text = text.replace(regexNotes, (match, number) => {
            let num = Number(number);
            return `[[${script.notes[num].text}]]`;
        });

        const regexBoneyards = /\/\*(\d+)\*\//g;

        text = text.replace(regexBoneyards, (match, number) => {
            let num = Number(number);
            return `/*${script.boneyards[num].text}*/`;
        });

        // Remove leading and trailing newlines
        text = text.replace(/^\s*\n+|\n+\s*$/g, '');

        return text;
    }

    _writeElem(elem) {

        if (elem.type == ElementType.CHARACTER) {

            let pad = "";
            if (this.prettyPrint)
                pad = "\t".repeat(3);

            let char = elem.name;
            if (elem.isDualDialogue)
                char += " ^";
            if (elem.extension)
                char += ` (${elem.extension})`;
            if (elem.forced)
                char = "@" + char;
            let ext_char = elem.name + (elem.extension ? elem.extension : "");
            if (this._lastChar == ext_char)
                char += " (CONT'D)";
            this._lastChar = ext_char;
            return `${pad}${char}`;
        }

        if (elem.type == ElementType.DIALOGUE) {
            let output = elem._text;

            // Make sure blank lines in dialogue have at least a space
            output = output.split("\n")
                .map(line => line.trim() == "" ? " " : line)
                .join("\n");

            if (this.prettyPrint) {
                // Ensure there's a tab at the front of each line
                output = output.split("\n")
                    .map(line => (`\t${line}`))
                    .join("\n");
            }
            return output;
        }

        if (elem.type == ElementType.PARENTHETICAL) {
            let pad = "";
            if (this.prettyPrint)
                pad = "\t".repeat(2);
            return `${pad}(${elem._text})`;
        }

        if (elem.type == ElementType.ACTION) {
            if (elem.forced)
                return `!${elem._text}`;
            if (elem.centered)
                return `>${elem._text}<`;
            return `${elem._text}`;
        }

        if (elem.type == ElementType.LYRIC) {
            return `~ ${elem._text}`;
        }

        if (elem.type == ElementType.SYNOPSIS) {
            return `= ${elem._text}`;
        }

        this._lastChar = null;

        if (elem.type == ElementType.TITLEENTRY) {
            return `${elem.key}: ${elem._text}`
        }

        if (elem.type == ElementType.HEADING) {
            let sceneNumber = "";
            if (elem.sceneNumber)
                sceneNumber = ` #${elem.sceneNumber}#`;
            if (elem.forced)
                return `\n.${elem._text}${sceneNumber}`;
            return `\n${elem._text}${sceneNumber}`;
        }

        if (elem.type == ElementType.TRANSITION) {
            let pad = "";
            if (this.prettyPrint)
                pad = "\t".repeat(4);
            if (elem.forced)
                return `>${elem._text}`;
            return `${pad}${elem._text}`;
        }

        if (elem.type == ElementType.PAGEBREAK) {
            return "===";
        }

        if (elem.type == ElementType.SECTION) {
            return `\n${"#".repeat(elem.level)} ${elem.text}`;
        }

    }
}

// This file is part of an MIT-licensed project: see LICENSE file or README.md for details.
// Copyright (c) 2024 Ian Thomas


class FDXParser {
    constructor() {
    }

    /**
     * Parse an FDX XML string into a Script object.
     * @param {string} xmlContent - The FDX XML string.
     * @returns {Script} The parsed script.
     */
    parse(xmlContent) {
        let script = new Script();

        // fast-xml-parser options
        const options = {
            ignoreAttributes: false,
            attributeNamePrefix: "@_",
            textNodeName: "Text"
        };
        const parser = new XMLParser(options);

        // Pre-processing
        // Remove XML declaration if present to avoid any parsing issues similar to C# (though JS usually lenient)
        xmlContent = xmlContent.trim();
        // fast-xml-parser handles declarations fine usually, but let's be safe if needed.
        // For now, raw pass.

        let jsonObj;
        try {
            jsonObj = parser.parse(xmlContent);
        } catch (error) {
            throw new Error(`Failed to parse XML: ${error.message}`);
        }

        if (!jsonObj.FinalDraft || !jsonObj.FinalDraft.Content || !jsonObj.FinalDraft.Content.Paragraph) {
            // Empty script or invalid FDX structure
            return script;
        }

        // Paragraph can be an array or a single object if only one paragraph
        let paragraphs = jsonObj.FinalDraft.Content.Paragraph;
        if (!Array.isArray(paragraphs)) {
            paragraphs = [paragraphs];
        }

        for (const p of paragraphs) {
            const type = p["@_Type"] || "Action";
            // Text can be complex in FDX (mixed content), but fast-xml-parser might map it to 'Text' property if configured?

            let text = "";
            if (p.Text) {
                const textNodes = Array.isArray(p.Text) ? p.Text : [p.Text];
                text = textNodes.map(node => {
                    if (typeof node === 'string') return node;
                    // If textNodeName is "Text", the content is in node.Text
                    if (node && node.Text) return node.Text;
                    // If default #text processing or mixed content
                    if (node && node["#text"]) return node["#text"];
                    return "";
                }).join("");
            }

            switch (type) {
                case "Scene Heading":
                case "Scene Heading (Top of Page)": // FDX Sometimes has this
                case "Shot":
                    script.addElement(new SceneHeading(text));
                    break;
                case "Action":
                case "General":
                    script.addElement(new Action(text));
                    break;
                case "Character":
                    // Parse NAME (EXT)
                    let charText = text.trim();
                    let extension = null;
                    if (charText.endsWith(")")) {
                        let openParen = charText.lastIndexOf("(");
                        if (openParen > 0) {
                            extension = charText.substring(openParen + 1, charText.length - 1).trim(); // remove closing paren
                            charText = charText.substring(0, openParen).trim();
                        }
                    }
                    script.addElement(new Character(charText, extension));
                    break;
                case "Dialogue":
                    script.addElement(new Dialogue(text));
                    break;
                case "Parenthetical":
                    // Strip parens
                    let pText = text.trim();
                    if (pText.startsWith("(") && pText.endsWith(")")) {
                        pText = pText.substring(1, pText.length - 1).trim();
                    }
                    script.addElement(new Parenthetical(pText));
                    break;
                case "Transition":
                    script.addElement(new Transition(text));
                    break;
                default:
                    // Treat unknown as Action
                    script.addElement(new Action(text));
                    break;
            }
        }

        return script;
    }
}

// This file is part of an MIT-licensed project: see LICENSE file or README.md for details.
// Copyright (c) 2024 Ian Thomas


class FDXWriter {
    constructor() {
    }

    /**
     * Convert a Script object to an FDX XML string.
     * @param {Script} script - The script object.
     * @returns {string} The FDX XML string.
     */
    write(script) {
        // Construct basic FDX structure
        const finalDraft = {
            FinalDraft: {
                "@_DocumentType": "Script",
                "@_Template": "No",
                "@_Version": "5",
                Content: {
                    Paragraph: []
                }
            }
        };

        const paragraphs = finalDraft.FinalDraft.Content.Paragraph;

        for (const element of script.elements) {
            let type = "Action";
            let text = element.text || "";

            switch (element.type) {
                case ElementType.HEADING:
                    type = "Scene Heading";
                    break;
                case ElementType.ACTION:
                    type = "Action";
                    break;
                case ElementType.CHARACTER:
                    type = "Character";
                    if (element.extension) {
                        text += ` (${element.extension})`;
                    }
                    break;
                case ElementType.DIALOGUE:
                    type = "Dialogue";
                    break;
                case ElementType.PARENTHETICAL:
                    type = "Parenthetical";
                    if (!text.startsWith("(")) {
                        text = `(${text})`;
                    }
                    break;
                case ElementType.TRANSITION:
                    type = "Transition";
                    break;
                case ElementType.PAGEBREAK:
                    // Skip or handle as Action
                    // FDX logic usually skips unless we add specific Page Break logic
                    continue;
                case ElementType.NOTE:
                case ElementType.BONEYARD:
                case ElementType.SECTION:
                case ElementType.SYNOPSIS:
                    // Skip like C# implementation
                    continue;
                default:
                    type = "Action";
                    break;
            }

            paragraphs.push({
                "@_Type": type,
                Text: text
            });
        }

        const options = {
            ignoreAttributes: false,
            attributeNamePrefix: "@_",
            format: true,
            processEntities: true
        };
        const builder = new XMLBuilder(options);
        const xmlContent = builder.build(finalDraft);

        return `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n${xmlContent}`;
    }
}

export { Action, Boneyard, Character, Dialogue, Element, ElementType, FDXParser, FDXWriter, FountainCallbackParser, FountainParser, FountainWriter, Lyric, Note, PageBreak, Parenthetical, SceneHeading, Script, Section, Synopsis, TitleEntry, Transition, fountainToHtml };
//# sourceMappingURL=screenplayTools.js.map
