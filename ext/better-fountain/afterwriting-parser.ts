// IMPORTED FROM token.ts

export function create_token(text?: string, cursor?: number, line?: number, new_line_length?: number, type?:string){
    var t:token={
        text:text,
        type:type,
        start:cursor,
        end:cursor,
        line:line,
        ignore:false,
        number:undefined,
        dual:undefined,
        html:undefined,
        level:undefined,
        time:undefined,
        character:undefined,
        index:-1,
        takeNumber:-1,
        original_line:undefined,
        is:function(...args:string[]){
            return args.indexOf(this.type) !== -1;
        },
        is_dialogue:function() {
            return this.is("character", "parenthetical", "dialogue");
        },
        name:function(){
            var character = this.text;
            var p = character.indexOf("(");
            if (p !== -1) {
                character = character.substring(0, p);
            }
            character = character.trim();
            return character;
        },
        location:function() {
            var location = this.text.trim();
            location = location.replace(/^(INT\.?\/EXT\.?)|(I\/E)|(INT\.?)|(EXT\.?)/, "");
            var dash = location.lastIndexOf(" - ");
            if (dash !== -1) {
                location = location.substring(0, dash);
            }
            return location.trim();
        },
        has_scene_time:function(time:any) {
            var suffix = this.text.substring(this.text.indexOf(" - "));
            return this.is("scene_heading") && suffix.indexOf(time) !== -1;
        },
        location_type:function(){
            var location = this.text.trim();
            if (/^I(NT.?)?\/E(XT.?)?/.test(location)) {
                return "mixed";
            }
            else if (/^INT.?/.test(location)) {
                return "int";
            }
            else if (/^EXT.?/.test(location)) {
                return "ext";
            }
            return "other";
        }
    }
    if(text) t.end=cursor + text.length - 1 + new_line_length;
    return t;
}
export interface token {
    text:string;
    type:string;
    start:number;
    end:number;
    line:number;
    number:string;
    dual:string;
    html:string;
    level:number;
    time:number;
    takeNumber:number;
    original_line:number;
    is:Function;
    is_dialogue:Function;
    name:Function;
    location:Function;
    has_scene_time:Function;
    location_type:Function;
    character:string;
    ignore:boolean;
    index:number;
}

// IMPORTED FROM utils.ts

export const trimCharacterForceSymbol = (character: string): string => character.replace(/^[ \t]*@/, "");


export const last = function (array: any[]): any {
	return array[array.length - 1];
}

export function slugify(text: string): string
{
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w-]+/g, '')       // Remove all non-word chars
    .replace(/-{2,}/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

/**
 * Trims character extensions, for example the parantheses part in `JOE (on the radio)`
 */
export const trimCharacterExtension = (character: string): string => character.replace(/[ \t]*(\(.*\))[ \t]*([ \t]*\^)?$/, "");

export const parseLocationInformation = (scene_heading:RegExpMatchArray) => {
	//input group 1 is int/ext, group 2 is location and time, group 3 is scene number
	let splitLocationFromTime = scene_heading[2].match(/(.*)[-–—−](.*)/)
	if (scene_heading != null && scene_heading.length>=3) {
		return {
			name: splitLocationFromTime ? splitLocationFromTime[1].trim() : scene_heading[2].trim(),
			interior: scene_heading[1].indexOf('I') != -1,
			exterior: scene_heading[1].indexOf('EX') != -1|| scene_heading[1].indexOf('E.')!= -1,
			time_of_day: splitLocationFromTime ? splitLocationFromTime[2].trim() : ""
		}
	}
	return null;
}

// END IMPORTED FROM utils.ts



declare global {
    interface Array<T> {
        pushSorted(el:any, compareFn:Function):number
    }
}
Array.prototype.pushSorted = function(el, compareFn) {
    this.splice((function(arr) {
      var m = 0;
      var n = arr.length - 1;
  
      while(m <= n) {
        var k = (n + m) >> 1;
        var cmp = compareFn(el, arr[k]);
  
        if(cmp > 0) m = k + 1;
          else if(cmp < 0) n = k - 1;
          else return k;
      }
  
      return -m - 1;
    })(this), 0, el);
  
    return this.length;
  };

//Unicode uppercase letters:
export const regex: { [index: string]: RegExp } = {
    title_page: /(title|credit|author[s]?|source|notes|draft date|date|watermark|contact( info)?|revision|copyright|font|tl|tc|tr|cc|br|bl|header|footer)\:.*/i,

    section: /^[ \t]*(#+)(?: *)(.*)/,
    synopsis: /^[ \t]*(?:\=(?!\=+) *)(.*)/,

    scene_heading: /^[ \t]*([.](?![.])|(?:[*]{0,3}_?)(?:int|ext|est|int[.]?\/ext|i[.]?\/e)[. ])(.+?)(#[-.0-9a-z]+#)?$/i,
    scene_number: /#(.+)#/,

    transition: /^[ \t]*((?:FADE (?:TO BLACK|OUT)|CUT TO BLACK)\.|.+ TO\:|^TO\:$)|^(?:> *)(.+)/,

    dialogue: /^[ \t]*([*_]+[^\p{Ll}\p{Lo}\p{So}\r\n]*)(\^?)?(?:\n(?!\n+))([\s\S]+)/u,

    character: /^[ \t]*(?![#!]|(\[\[)|(SUPERIMPOSE:))(((?!@)[^\p{Ll}\r\n]*?\p{Lu}[^\p{Ll}\r\n]*?)|((@)[^\r\n]*?))(\(.*\))?(\s*\^)?$/u,
    parenthetical: /^[ \t]*(\(.+\))$/,

    action: /^(.+)/g,
    centered: /^[ \t]*(?:> *)(.+)(?: *<)(\n.+)*/g,

    page_break: /^\={3,}$/,
    line_break: /^ {2}$/,

    note_inline: /(?:\[{2}(?!\[+))([\s\S]+?)(?:\]{2}(?!\[+))/g,

    emphasis: /(_|\*{1,3}|_\*{1,3}|\*{1,3}_)(.+)(_|\*{1,3}|_\*{1,3}|\*{1,3}_)/g,
    bold_italic_underline: /(_{1}\*{3}(?=.+\*{3}_{1})|\*{3}_{1}(?=.+_{1}\*{3}))(.+?)(\*{3}_{1}|_{1}\*{3})/g,
    bold_underline: /(_{1}\*{2}(?=.+\*{2}_{1})|\*{2}_{1}(?=.+_{1}\*{2}))(.+?)(\*{2}_{1}|_{1}\*{2})/g,
    italic_underline: /(?:_{1}\*{1}(?=.+\*{1}_{1})|\*{1}_{1}(?=.+_{1}\*{1}))(.+?)(\*{1}_{1}|_{1}\*{1})/g,
    bold_italic: /(\*{3}(?=.+\*{3}))(.+?)(\*{3})/g,
    bold: /(\*{2}(?=.+\*{2}))(.+?)(\*{2})/g,
    italic: /(\*{1}(?=.+\*{1}))(.+?)(\*{1})/g,
    link: /(\[?(\[)([^\]\[]*\[?[^\]\[]*\]?[^\]\[]*)(\])(\()(.+?)(?:\s+(["'])(.*?)\4)?(\)))/g,
   // image: /(!\[?(\[)([^\]\[]*\[?[^\]\[]*[^\]\[]*)(\])(\()(.+?)(?:\s+(["'])(.*?)\4)?(\)))/g,
    lyric: /^(\~.+)/g,
    underline: /(_{1}(?=.+_{1}))(.+?)(_{1})/g,
};
export interface titleKeywordFormat{
    position:'cc'|'br'|'bl'|'tr'|'tc'|'tl'|'cc'|'hidden',
    index:number
}

export const titlePageDisplay: {[index:string]:titleKeywordFormat} = {
    title:{position:'cc', index:0},
    credit:{position:'cc', index:1},
    author:{position:'cc', index:2},
    authors:{position:'cc', index:3},
    source:{position:'cc', index:4},

    watermark:{position:'hidden', index:-1},
    font:{position:'hidden', index:-1},
    header:{position:'hidden', index:-1},
    footer:{position:'hidden', index:-1},

    notes:{position:'bl', index:0},
    copyright:{position:'bl', index:1},

    revision:{position:'br', index:0},
    date:{position:'br', index:1},
    draft_date:{position:'br', index:2},
    contact:{position:'br', index:3},
    contact_info:{position:'br', index:4},


    br:{position:'br', index:-1},
    bl:{position:'bl', index:-1},
    tr:{position:'tr', index:-1},
    tc:{position:'tc', index:-1},
    tl:{position:'tl', index:-1},
    cc:{position:'cc', index:-1}
}

interface LexerReplacements{
    [key:string]:string,
    //image: string,
    link:string,
    note:string,
    line_break:string,
    bold_italic_underline:string,
    bold_underline:string,
    italic_underline:string,
    bold_italic:string,
    bold:string,
    italic:string,
    underline:string
}

export function lexer(s: string, type: string, replacer:LexerReplacements, titlepage:boolean = false) {
    if (!s) {
        return s;
    }

    var styles = ['underline', 'italic', 'bold', 'bold_italic', 'italic_underline', 'bold_underline', 'bold_italic_underline']
        , i = styles.length, style, match;

    if(titlepage){
        s = s.replace(regex.link, replacer.link);
    }
    s = s.replace(regex.note_inline, replacer.note).replace(/\\\*/g, '[star]').replace(/\\_/g, '[underline]').replace(/\n/g, replacer.line_break);

    // if (regex.emphasis.test(s)) {                         // this was causing only every other occurence of an emphasis syntax to be parsed
    while (i--) {
        style = styles[i];
        match = regex[style];

        if (match.test(s)) {
            s = s.replace(match, replacer[style]);
        }
    }
    // }
    s = s.replace(/\[star\]/g, '*').replace(/\[underline\]/g, '_');
    if (type != "action")
        s = s.trim();
    return s;
}
export class Location {
    scene_number: number;
    name: string;
    interior: boolean;
    exterior: boolean;
    time_of_day: string;
    line:number;
}
export class StructToken {
    text: string;
    isnote: boolean;
    id: any;
    children: any; //Children of the section
    range: Range; //Range of the scene/section header
    level: number;
    section: boolean; // true->section, false->scene
    synopses: { synopsis: string; line: number }[];
    notes: { note: string; line: number }[];
}
export class screenplayProperties {
    scenes: { scene: string; text:string, line: number, actionLength: number, dialogueLength: number }[];
    sceneLines: number[];
    sceneNames: string[];
    titleKeys: string[];
    firstTokenLine: number;
    fontLine: number;
    lengthAction: number; //Length of the action character count
    lengthDialogue: number; //Length of the dialogue character count
    characters: Map<string, number[]>;
    locations: Map<string, Location[]>;
    structure: StructToken[];
}
export interface parseoutput {
    title_page: {[index:string]:token[]},
    tokens: token[],
    tokenLines: { [line: number]: number }
    lengthAction: number,
    lengthDialogue: number,
    parseTime: number,
    properties: screenplayProperties
}
export var parse = function (original_script: string): parseoutput {
    var emptytitlepage = true;
    var script = original_script,
        result: parseoutput = {
            title_page: {
                tl:[],
                tc:[],
                tr:[],
                cc:[],
                bl:[],
                br:[],
                hidden:[]
            },
            tokens: [],
            lengthAction: 0,
            lengthDialogue: 0,
            tokenLines: {},
            parseTime: +new Date(),
            properties:
            {
                sceneLines: [],
                scenes: [],
                sceneNames: [],
                titleKeys: [],
                firstTokenLine: Infinity,
                fontLine: -1,
                lengthAction: 0,
                lengthDialogue: 0,
                characters: new Map<string, number[]>(),
                locations: new Map<string, Location[]>(),
                structure: []
            }
        };
    if (!script) {
        return result;
    }

    var new_line_length = script.match(/\r\n/) ? 2 : 1;



    var lines = script.split(/\r\n|\r|\n/);
    var pushToken = function (token: token) {
        result.tokens.push(token);
        if (thistoken.line)
            result.tokenLines[thistoken.line] = result.tokens.length - 1;
    }

    var lines_length = lines.length,
        current = 0,
        scene_number = 1,
        current_depth = 0,
        match, text, last_title_page_token,
        thistoken: token,
        last_was_separator = false,
        //top_or_separated = false,
        token_category = "none",
        last_character_index,
        dual_right,
        state = "normal",
        previousCharacter,
        cache_state_for_comment,
        nested_comments = 0,
        title_page_started = false


    var reduce_comment = function (prev: any, current: any) {
        if (current === "/*") {
            nested_comments++;
        } else if (current === "*/") {
            nested_comments--;
        } else if (!nested_comments) {
            prev = prev + current;
        }
        return prev;
    };

    var if_not_empty = function (a: any) {
        return a;
    };

    var lengthActionSoFar = 0; //total action length until the previous scene header
    var lengthDialogueSoFar = 0; //total dialogue length until the previous scene header

    var takeCount = 1; //total number of takes

    function updatePreviousSceneLength() {
        var action = result.lengthAction - lengthActionSoFar;
        var dialogue = result.lengthDialogue - lengthDialogueSoFar;
        lengthActionSoFar = result.lengthAction;
        lengthDialogueSoFar = result.lengthDialogue;

        if (result.properties.scenes.length > 0) {
            result.properties.scenes[result.properties.scenes.length - 1].actionLength = action;
            result.properties.scenes[result.properties.scenes.length - 1].dialogueLength = dialogue;
        }
    }

    const latestSectionOrScene = (depth: number, condition: (token: StructToken) => boolean): StructToken => {
        try {
            if (depth <= 0) {
                return null;
            }
            else if (depth == 1) {
                var lastItem:StructToken = last(result.properties.structure.filter(condition));
                return lastItem;
            }
            else {
                var prevSection = latestSectionOrScene(depth - 1, condition)
                if (prevSection.children != null) {
                    var lastChild = last(prevSection.children.filter(condition))
                    if (lastChild) return lastChild
                }
                // nest ###xyz inside #abc if there's no ##ijk to nest within
                return prevSection;
            }
        }
        catch {
            var section: StructToken = null;
            while (!section && depth > 0) section = latestSectionOrScene(--depth, condition);
            return section;
        }
    }

    const processInlineNote = (text: string, linenumber:number): number => {
        let irrelevantTextLength = 0;
        if (match = text.match(new RegExp(regex.note_inline))) {
            var level = latestSectionOrScene(current_depth + 1, () => true);
            if (level) {
                level.notes = level.notes || []
                for (let i = 0; i < match.length; i++) {
                    match[i] = match[i].slice(2, match[i].length - 2);
                    level.notes.push({ note: match[i], line: thistoken.line });
                    irrelevantTextLength += match[i].length+4;
                }
            }
            else{
                for(let i = 0; i < match.length; i++){
                    match[i] = match[i].slice(2, match[i].length - 2);
                    result.properties.structure.push({text: match[i], id:'/' + linenumber, isnote:true, children:[],level:0,notes:[],range:new Range(new Position(linenumber, 0), new Position(linenumber, match[i].length+4)), section:false,synopses:[] })
                    irrelevantTextLength += match[i].length+4;
                }
            }
        }
        return irrelevantTextLength;
    }
    const processDialogueBlock = (token:token) => {
        let textWithoutNotes = token.text.replace(regex.note_inline, "");
        processInlineNote(token.text, token.line);
        if (false) {
            token.text = textWithoutNotes;
            if(token.text.trim().length == 0) token.ignore = true;
        }
        result.lengthDialogue += token.time;
    }
    const processActionBlock = (token:token) => {
        let irrelevantActionLength = processInlineNote(token.text, token.line);
        token.time = (token.text.length - irrelevantActionLength) / 20;
        if (false) {
            token.text = token.text.replace(regex.note_inline, "");
            if(token.text.trim().length == 0) token.ignore = true;
        }
        result.lengthAction += token.time;
    }

    let ignoredLastToken = false;
    for (var i = 0; i < lines_length; i++) {
        text = lines[i];

        // replace inline comments
        text = text.split(/(\/\*){1}|(\*\/){1}|([^\/\*]+)/g).filter(if_not_empty).reduce(reduce_comment, "");

        if (nested_comments && state !== "ignore") {
            cache_state_for_comment = state;
            state = "ignore";
        } else if (state === "ignore") {
            state = cache_state_for_comment;
        }

        if (nested_comments === 0 && state === "ignore") {
            state = cache_state_for_comment;
        }


        thistoken = create_token(text, current, i, new_line_length);
        thistoken.original_line = i + 1;
        current = thistoken.end + 1;

        
        if (text.trim().length === 0 && text !== "  ") {
            var skip_separator = (true && last_was_separator) || (ignoredLastToken && result.tokens.length>1 && result.tokens[result.tokens.length-1].type == "separator");

            if(ignoredLastToken) ignoredLastToken=false;

            if (state == "dialogue")
                pushToken(create_token(undefined, undefined, undefined, undefined, "dialogue_end"));
            if (state == "dual_dialogue")
                pushToken(create_token(undefined, undefined, undefined, undefined, "dual_dialogue_end"));
            state = "normal";


            if (skip_separator || state === "title_page") {
                continue;
            }

            dual_right = false;
            thistoken.type = "separator";
            last_was_separator = true;
            pushToken(thistoken);
            continue;
        }

        //top_or_separated = last_was_separator || i === 0;
        token_category = "script";

        if (!title_page_started && regex.title_page.test(thistoken.text)) {
            state = "title_page";
        }

        if (state === "title_page") {
            if (regex.title_page.test(thistoken.text)) {
                var index = thistoken.text.indexOf(":");
                thistoken.type = thistoken.text.substr(0, index).toLowerCase().replace(" ", "_");
                thistoken.text = thistoken.text.substr(index + 1).trim();
                last_title_page_token = thistoken;
                let keyformat = titlePageDisplay[thistoken.type];
                if(keyformat){
                    thistoken.index = keyformat.index;
                    result.title_page[keyformat.position].push(thistoken);
                    emptytitlepage = false;
                }
                title_page_started = true;
                continue;
            } else if (title_page_started) {
                last_title_page_token.text += (last_title_page_token.text ? "\n" : "") + thistoken.text.trim();
                continue;
            }
        }

        const latestSection = (depth: number): StructToken => latestSectionOrScene(depth, token => token.section)


        
        if (state === "normal") {
            if (thistoken.text.match(regex.line_break)) {
                token_category = "none";
            } else if (result.properties.firstTokenLine == Infinity) {
                result.properties.firstTokenLine = thistoken.line;
            }
            let sceneHeadingMatch = thistoken.text.match(regex.scene_heading);
            if (sceneHeadingMatch) {
                thistoken.text = thistoken.text.replace(/^\./, "");
                if (false && scene_number !== 1) {
                    var page_break = create_token();
                    page_break.type = "page_break";
                    page_break.start = thistoken.start;
                    page_break.end = thistoken.end;
                    pushToken(page_break);
                }
                thistoken.type = "scene_heading";
                thistoken.number = scene_number.toString();
                if (match = thistoken.text.match(regex.scene_number)) {
                    thistoken.text = thistoken.text.replace(regex.scene_number, "");
                    thistoken.number = match[1];
                }
                let cobj: StructToken = new StructToken();
                cobj.text = thistoken.text;
                cobj.children = null;



                if (current_depth == 0) {
                    cobj.id = '/' + thistoken.line;
                    result.properties.structure.push(cobj);
                }
                else {
                    var level = latestSection(current_depth);
                    if(level){
                        cobj.id = level.id + '/' + thistoken.line;
                        level.children.push(cobj);
                    }
                    else{
                        cobj.id = '/' + thistoken.line;
                        result.properties.structure.push(cobj);
                    }
                }

                updatePreviousSceneLength();
                result.properties.scenes.push({ scene: thistoken.number, text:thistoken.text, line: thistoken.line, actionLength: 0, dialogueLength: 0 })
                result.properties.sceneLines.push(thistoken.line);
                result.properties.sceneNames.push(thistoken.text);

                const location = parseLocationInformation(sceneHeadingMatch);
                if (location) {
                    const locationSlug = slugify(location.name);
                    if (result.properties.locations.has(locationSlug)) {
                        const values = result.properties.locations.get(locationSlug);
                        if (values.findIndex(it => it.scene_number == scene_number) == -1) {
                            values.push({
                                scene_number: scene_number,
                                line: thistoken.line,
                                ...location
                            });
                        }
                        result.properties.locations.set(locationSlug, values);
                    }
                    else {
                        result.properties.locations.set(locationSlug, [{scene_number, line:thistoken.line, ...location}]);
                    }
                }
                scene_number++;
                
            } else if (thistoken.text.length && thistoken.text[0] === "!") {
                thistoken.type = "action";
                thistoken.text = thistoken.text.substr(1);
                processActionBlock(thistoken);
            } else if (thistoken.text.match(regex.centered)) {
                thistoken.type = "centered";
                thistoken.text = thistoken.text.replace(/>|</g, "").trim();
            } else if (thistoken.text.match(regex.transition)) {
                thistoken.text = thistoken.text.replace(/> ?/, "");
                thistoken.type = "transition";
            } else if (match = thistoken.text.match(regex.synopsis)) {
                thistoken.text = match[1];
                thistoken.type = thistoken.text ? "synopsis" : "separator";

                var level = latestSectionOrScene(current_depth + 1, () => true);
                if (level) {
                    level.synopses = level.synopses || []
                    level.synopses.push({ synopsis: thistoken.text, line: thistoken.line })
                }
            } else if (match = thistoken.text.match(regex.section)) {
                thistoken.level = match[1].length;
                thistoken.text = match[2];
                thistoken.type = "section";
                let cobj: StructToken = new StructToken();
                cobj.text = thistoken.text;
                current_depth = thistoken.level;
                cobj.level = thistoken.level;
                cobj.children = [];
                cobj.section = true;

                const level = current_depth > 1 && latestSectionOrScene(current_depth, token => token.section && token.level < current_depth)
                if (current_depth == 1 || !level) {
                    cobj.id = '/' + thistoken.line;
                    result.properties.structure.push(cobj)
                }
                else {
                    cobj.id = level.id + '/' + thistoken.line;
                    level.children.push(cobj);
                }
            } else if (thistoken.text.match(regex.page_break)) {
                thistoken.text = "";
                thistoken.type = "page_break";
            } else if (thistoken.text.match(regex.character) && i != lines_length && i != lines_length - 1 && ((lines[i + 1].trim().length == 0) ? (lines[i + 1] == "  ") : true)) {
                // The last part of the above statement ('(lines[i + 1].trim().length == 0) ? (lines[i+1] == "  ") : false)')
                // means that if the trimmed length of the following line (i+1) is equal to zero, the statement will only return 'true',
                // and therefore consider the token as a character, if the content of the line is exactly two spaces.
                // If the trimmed length is larger than zero, then it will be accepted as dialogue regardless
                state = "dialogue";
                thistoken.type = "character";
                thistoken.takeNumber = takeCount++;
                thistoken.text = trimCharacterForceSymbol(thistoken.text);
                if (thistoken.text[thistoken.text.length - 1] === "^") {
                    if (true) {
                        state = "dual_dialogue"
                        // update last dialogue to be dual:left
                        var dialogue_tokens = ["dialogue", "character", "parenthetical"];
                        while (dialogue_tokens.indexOf(result.tokens[last_character_index].type) !== -1) {
                            result.tokens[last_character_index].dual = "left";
                            last_character_index++;
                        }
                        //update last dialogue_begin to be dual_dialogue_begin and remove last dialogue_end
                        var foundmatch = false;
                        var temp_index = result.tokens.length;
                        temp_index = temp_index - 1;
                        while (!foundmatch) {
                            temp_index--;
                            switch (result.tokens[temp_index].type) {
                                case "dialogue_end":
                                    result.tokens.splice(temp_index);
                                    temp_index--;
                                    break;
                                case "separator": break;
                                case "character": break;
                                case "dialogue": break;
                                case "parenthetical": break;
                                case "dialogue_begin":
                                    result.tokens[temp_index].type = "dual_dialogue_begin";
                                    foundmatch = true;
                                    break;
                                default: foundmatch = true;
                            }
                        }
                        dual_right = true;
                        thistoken.dual = "right";
                    }
                    else{
                        pushToken(create_token(undefined, undefined, undefined, undefined, "dialogue_begin"));
                    }
                    thistoken.text = thistoken.text.replace(/\^$/, "");
                }
                else {
                    pushToken(create_token(undefined, undefined, undefined, undefined, "dialogue_begin"));
                }
                let character = trimCharacterExtension(thistoken.text).trim();
                previousCharacter = character;
                if (result.properties.characters.has(character)) {
                    var values = result.properties.characters.get(character);
                    if (values.indexOf(scene_number) == -1) {
                        values.push(scene_number);
                    }
                    result.properties.characters.set(character, values);
                }
                else {
                    result.properties.characters.set(character, [scene_number]);
                }
                last_character_index = result.tokens.length;
            }
            else {
                thistoken.type = "action";
                processActionBlock(thistoken);
            }
        } else {
            if (thistoken.text.match(regex.parenthetical)) {
                thistoken.type = "parenthetical";
            }
            else if (thistoken.text.match(regex.lyric)) {
                thistoken.type = "lyric";
                thistoken.text = thistoken.text.substring(1, thistoken.text.length)
                thistoken.character = previousCharacter;
            } else {
                thistoken.type = "dialogue";
                processDialogueBlock(thistoken);
                thistoken.character = previousCharacter;
            }
            if (dual_right) {
                thistoken.dual = "right";
            }
        }

        if (thistoken.type != "action" && !(thistoken.type == "dialogue" && thistoken.text == "  ")) {
            thistoken.text = thistoken.text.trim();
        }

        last_was_separator = false;

        if (token_category === "script" && state !== "ignore") {
            if (thistoken.is("scene_heading", "transition")) {
                thistoken.text = thistoken.text.toUpperCase();
                title_page_started = true; // ignore title tags after first heading
            }
            if (thistoken.type != "action" && thistoken.type != "dialogue")
                thistoken.text = thistoken.text.trim();

            if(thistoken.ignore){
                ignoredLastToken = true;
            }
            else{
                ignoredLastToken = false;
                pushToken(thistoken);
            }   
        }

    }

    if (state == "dialogue") {
        pushToken(create_token(undefined, undefined, undefined, undefined, "dialogue_end"));
    }

    if (state == "dual_dialogue") {
        pushToken(create_token(undefined, undefined, undefined, undefined, "dual_dialogue_end"));
    }

    // clean separators at the end
    while (result.tokens.length > 0 && result.tokens[result.tokens.length - 1].type === "separator") {
        result.tokens.pop();
    }
    return result;
};
