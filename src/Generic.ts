import { CharacterData } from "./chardata.js";
import { Utils } from "./utils.js";

export class CharacterAttributes {    // minified as No
    constructor(){
	// seems to do nothing 
    }
}

export class FieldData {
    position:number;
    
    constructor(position:number){
	this.position = position;
    }

    isNoDisplay():boolean{  // minified pn()
        console.log("Reached superclass isnodisplay");
	throw "Must implement this in superclass";
    }
  
}

export class CharsetInfo {  // minified as kr
    name:string;
    font:string; // this.pt
    isDBCS:boolean; // this.At
    bt:any;
    gt:any;
    Et:any;
    kt:any;
    St:any;
    Tt:any;
    
    constructor(name:string,
		font:string,
		isDBCS:boolean,
		i:any ,
		e:any,
		s:any,
		u?:any,
		h?:any,
		r?:any) { // u h r optional only used in Asian fontscjars
        this.name = name;
	this.font = font; // was this.pt
	this.isDBCS = isDBCS;  // only true when all the extra stuff is in constructor - was this.At
	this.bt = i;  // can be an array of 4 numbers or null
	this.gt = e;  // can be an array of 4 numbers or null
	this.Et = s;  // Er,B, Wn Er.W Er.k, what is it???
	this.kt = h;
	this.St = u;
	this.Tt = r;
    }

    static DEFAULT_FONT_FAMILY:string = "Lucida Console, Monaco, monospace"; // was u at top level

    // fill in the rest later
    static TERMINAL_DEFAULT_CHARSETS = [
	new CharsetInfo("037: International", CharsetInfo.DEFAULT_FONT_FAMILY, false, null, null, CharacterData.Er.B) ];

    toString():string{
	return "<CharsetInfo " + this.name + " font=" + this.font + ">";
    }
}

export class OIALine{
    xn:any[];
    
    constructor(ignoredParm:any, width?:number){
	this.xn = new Array(width||80).fill(0x20); // unicode blanks
    }

}

export class TypeValuePair { // was pr(t,l)
    type:number;
    value:string;
    
    constructor(type:number, value:string){
	this.type = type;
	this.value = value;
    }
}

export type KeyboardMapEntry = (TypeValuePair|null)[];

export class KeyboardMapEntry_old {  
    t:TypeValuePair|null;
    l:TypeValuePair|null;
    n:TypeValuePair|null;
    i:TypeValuePair|null;
    e:TypeValuePair|null;
    s:TypeValuePair|null;
    u:TypeValuePair|null;
    h:TypeValuePair|null;
    r:(TypeValuePair|null)[];
    
    constructor(t:TypeValuePair|null,
		l:TypeValuePair|null,
		n:TypeValuePair|null,
		i:TypeValuePair|null,
		e:TypeValuePair|null,
		s:TypeValuePair|null,
		u:TypeValuePair|null,
		h:TypeValuePair|null) {
	this.r = [];
	this.t = t;
	this.l = l;
	this.n = n;
	this.i = i;
	this.e = e;
	this.s = s;
	this.u = u;
	this.h = h;
	// (this.r[0] = t), (r[1] = l), (r[2] = n), (r[4] = i), (r[6] = e), (r[3] = s), (r[5] = u), (r[7] = h);
    }
}

export class KeyboardMap{
    // Ar(t, l, n, i, e, s, u, h) {
    static entry(t:TypeValuePair|null,
		 l:TypeValuePair|null,
		 n:TypeValuePair|null,
		 i:TypeValuePair|null,
		 e:TypeValuePair|null,
		 s:TypeValuePair|null,
		 u:TypeValuePair|null,
		 h:TypeValuePair|null){
	let r:(TypeValuePair|null)[] = [];
	(r[0] = t), (r[1] = l), (r[2] = n), (r[4] = i), (r[6] = e), (r[3] = s), (r[5] = u), (r[7] = h);
	return r;
    }
    
    static standard:any = {  // was global gr = {......}
          Accept: null,
          Again: null,
          AllCandidates: null,
          Alphanumeric: null,
          ContextMenu: null,
          Attn: null,
          BrowserBack: null,
          BrowserFavorites: null,
          BrowserForward: null,
          BrowserHome: null,
          BrowserRefresh: null,
          BrowserSearch: null,
          BrowserStop: null,
          CapsLock: null,
          Clear: null,
          CodeInput: null,
          Compose: null,
          Crsel: null,
          Convert: null,
          Copy: null,
          Cut: null,
          Down: KeyboardMap.entry(new TypeValuePair(16, "Cursor Down"), null, null, null, null, null, null, null),
          End: KeyboardMap.entry(new TypeValuePair(16, "End"), null, null, null, null, null, null, null),
          Enter: KeyboardMap.entry(new TypeValuePair(16, "Enter"), null, new TypeValuePair(16, "New Line"), null, null, null, null, null),
          EraseEof: null,
          Execute: null,
          Exsel: null,
          F1: KeyboardMap.entry(new TypeValuePair(16, "PF01"), new TypeValuePair(16, "PF13"), null, null, null, null, null, null),
          F2: KeyboardMap.entry(new TypeValuePair(16, "PF02"), new TypeValuePair(16, "PF14"), null, null, null, null, null, null),
          F3: KeyboardMap.entry(new TypeValuePair(16, "PF03"), new TypeValuePair(16, "PF15"), null, null, null, null, null, null),
          F4: KeyboardMap.entry(new TypeValuePair(16, "PF04"), new TypeValuePair(16, "PF16"), null, null, null, null, null, null),
          F5: KeyboardMap.entry(new TypeValuePair(16, "PF05"), new TypeValuePair(16, "PF17"), null, null, null, null, null, null),
          F6: KeyboardMap.entry(new TypeValuePair(16, "PF06"), new TypeValuePair(16, "PF18"), null, null, null, null, null, null),
          F7: KeyboardMap.entry(new TypeValuePair(16, "PF07"), new TypeValuePair(16, "PF19"), null, null, null, null, null, null),
          F8: KeyboardMap.entry(new TypeValuePair(16, "PF08"), new TypeValuePair(16, "PF20"), null, null, null, null, null, null),
          F9: KeyboardMap.entry(new TypeValuePair(16, "PF09"), new TypeValuePair(16, "PF21"), null, null, null, null, null, null),
          F10: KeyboardMap.entry(new TypeValuePair(16, "PF10"), new TypeValuePair(16, "PF22"), null, null, null, null, null, null),
          F11: KeyboardMap.entry(new TypeValuePair(16, "PF11"), new TypeValuePair(16, "PF23"), null, null, null, null, null, null),
          F12: KeyboardMap.entry(new TypeValuePair(16, "PF12"), new TypeValuePair(16, "PF24"), null, null, null, null, null, null),
          F13: KeyboardMap.entry(new TypeValuePair(16, "PF13"), null, null, null, null, null, null, null),
          F14: KeyboardMap.entry(new TypeValuePair(16, "PF14"), null, null, null, null, null, null, null),
          F15: KeyboardMap.entry(new TypeValuePair(16, "PF15"), null, null, null, null, null, null, null),
          F16: KeyboardMap.entry(new TypeValuePair(16, "PF16"), null, null, null, null, null, null, null),
          F17: KeyboardMap.entry(new TypeValuePair(16, "PF17"), null, null, null, null, null, null, null),
          F18: KeyboardMap.entry(new TypeValuePair(16, "PF18"), null, null, null, null, null, null, null),
          F19: KeyboardMap.entry(new TypeValuePair(16, "PF19"), null, null, null, null, null, null, null),
          F20: KeyboardMap.entry(new TypeValuePair(16, "PF20"), null, null, null, null, null, null, null),
          F21: KeyboardMap.entry(new TypeValuePair(16, "PF21"), null, null, null, null, null, null, null),
          F22: KeyboardMap.entry(new TypeValuePair(16, "PF22"), null, null, null, null, null, null, null),
          F23: KeyboardMap.entry(new TypeValuePair(16, "PF23"), null, null, null, null, null, null, null),
          F24: KeyboardMap.entry(new TypeValuePair(16, "PF24"), null, null, null, null, null, null, null),
          FinalMode: null,
          Find: null,
          FullWidth: null,
          HalfWidth: null,
          HangulMode: null,
          HanjaMode: null,
          Help: null,
          Hiragana: null,
          Home: KeyboardMap.entry(new TypeValuePair(16, "Home"), null, null, null, null, null, null, null),
          Insert: KeyboardMap.entry(new TypeValuePair(16, "Insert"), null, null, null, null, null, null, null),
          JapaneseHiragana: null,
          JapaneseKatakana: null,
          JapaneseRomaji: null,
          JunjaMode: null,
          KanaMode: null,
          KanjiMode: null,
          Katakana: null,
          LaunchApplication1: null,
          LaunchApplication2: null,
          LaunchMail: null,
          Left: KeyboardMap.entry(new TypeValuePair(16, "Cursor Left"), null, new TypeValuePair(16, "Rapid Left"), null, null, null, null, null),
          MediaNextTrack: null,
          MediaPlayPause: null,
          MediaPreviousTrack: null,
          MediaStop: null,
          ModeChange: null,
          Nonconvert: null,
          NumLock: null,
          PageDown: KeyboardMap.entry(new TypeValuePair(2, "PageDown"), null, null, null, null, null, null, null),
          PageUp: KeyboardMap.entry(new TypeValuePair(2, "PageUp"), null, null, null, null, null, null, null),
          Paste: null,
          Pause: null,
          Play: null,
          PreviousCandidate: null,
          PrintScreen: null,
          Process: null,
          Props: null,
          Right: KeyboardMap.entry(new TypeValuePair(16, "Cursor Right"), null, new TypeValuePair(16, "Rapid Right"), null, null, null, null, null),
          RomanCharacters: null,
          ScrollLock: null,
          Select: null,
          SelectMedia: null,
          Stop: null,
          Up: KeyboardMap.entry(new TypeValuePair(16, "Cursor Up"), null, null, null, null, null, null, null),
          Undo: null,
          VolumeDown: null,
          VolumeMute: null,
          VolumeUp: null,
          Win: null,
          Zoom: null,
          " ": KeyboardMap.entry(new TypeValuePair(2, " "), new TypeValuePair(2, " "), null, null, null, null, null, null),
          "!": KeyboardMap.entry(null, new TypeValuePair(2, "!"), null, null, null, null, null, null),
          '"': KeyboardMap.entry(null, new TypeValuePair(2, '"'), null, null, null, null, null, null),
          "#": KeyboardMap.entry(null, new TypeValuePair(2, "#"), null, null, null, null, null, null),
          $: KeyboardMap.entry(null, new TypeValuePair(2, "$"), null, null, null, null, null, null),
          "%": KeyboardMap.entry(null, new TypeValuePair(2, "%"), null, null, null, null, null, null),
          "&": KeyboardMap.entry(null, new TypeValuePair(2, "&"), null, null, null, null, null, null),
          "'": KeyboardMap.entry(new TypeValuePair(2, "'"), null, null, null, null, null, null, null),
          "(": KeyboardMap.entry(null, new TypeValuePair(2, "("), null, null, null, null, null, null),
          ")": KeyboardMap.entry(null, new TypeValuePair(2, ")"), null, null, null, null, null, null),
          "*": KeyboardMap.entry(null, new TypeValuePair(2, "*"), null, null, null, null, null, null),
          "+": KeyboardMap.entry(null, new TypeValuePair(2, "+"), null, null, null, null, null, null),
          ",": KeyboardMap.entry(new TypeValuePair(2, ","), null, null, null, null, null, null, null),
          "-": KeyboardMap.entry(new TypeValuePair(2, "-"), null, null, null, null, null, null, null),
          ".": KeyboardMap.entry(new TypeValuePair(2, "."), null, null, null, null, null, null, null),
          "/": KeyboardMap.entry(new TypeValuePair(2, "/"), null, null, null, null, null, null, null),
          0: KeyboardMap.entry(new TypeValuePair(2, "0"), null, null, null, null, null, null, null),
          1: KeyboardMap.entry(new TypeValuePair(2, "1"), null, new TypeValuePair(2, "|"), new TypeValuePair(16, "PA1"), null, null, null, null),
          2: KeyboardMap.entry(new TypeValuePair(2, "2"), null, null, new TypeValuePair(16, "PA2"), null, null, null, null),
          3: KeyboardMap.entry(new TypeValuePair(2, "3"), null, null, new TypeValuePair(16, "PA3"), null, null, null, null),
          4: KeyboardMap.entry(new TypeValuePair(2, "4"), null, null, null, null, null, null, null),
          5: KeyboardMap.entry(new TypeValuePair(2, "5"), null, null, null, null, null, null, null),
          6: KeyboardMap.entry(new TypeValuePair(2, "6"), null, new TypeValuePair(2, String.fromCharCode.apply(null, [172])), null, null, null, null, null),
          7: KeyboardMap.entry(new TypeValuePair(2, "7"), null, null, null, null, null, null, null),
          8: KeyboardMap.entry(new TypeValuePair(2, "8"), null, null, null, null, null, null, null),
          9: KeyboardMap.entry(new TypeValuePair(2, "9"), null, null, null, null, null, null, null),
          Numpad0: KeyboardMap.entry(new TypeValuePair(2, "0"), null, null, null, null, null, null, null),
          Numpad1: KeyboardMap.entry(new TypeValuePair(2, "1"), null, null, new TypeValuePair(2, "PA1"), null, null, null, null),
          Numpad2: KeyboardMap.entry(new TypeValuePair(2, "2"), null, null, new TypeValuePair(2, "PA2"), null, null, null, null),
          Numpad3: KeyboardMap.entry(new TypeValuePair(2, "3"), null, null, new TypeValuePair(2, "PA3"), null, null, null, null),
          Numpad4: KeyboardMap.entry(new TypeValuePair(2, "4"), null, null, null, null, null, null, null),
          Numpad5: KeyboardMap.entry(new TypeValuePair(2, "5"), null, null, null, null, null, null, null),
          Numpad6: KeyboardMap.entry(new TypeValuePair(2, "6"), null, null, null, null, null, null, null),
          Numpad7: KeyboardMap.entry(new TypeValuePair(2, "7"), null, null, null, null, null, null, null),
          Numpad8: KeyboardMap.entry(new TypeValuePair(2, "8"), null, null, null, null, null, null, null),
          Numpad9: KeyboardMap.entry(new TypeValuePair(2, "9"), null, null, null, null, null, null, null),
          "Numpad/": KeyboardMap.entry(new TypeValuePair(2, "/"), null, null, null, null, null, null, null),
          "Numpad*": KeyboardMap.entry(new TypeValuePair(2, "*"), null, null, null, null, null, null, null),
          "Numpad-": KeyboardMap.entry(new TypeValuePair(2, "-"), null, null, null, null, null, null, null),
          "Numpad+": KeyboardMap.entry(new TypeValuePair(2, "+"), null, null, null, null, null, null, null),
          NumpadEnter: KeyboardMap.entry(new TypeValuePair(16, "Enter"), null, new TypeValuePair(16, "New Line"), null, null, null, null, null),
          "Numpad.": KeyboardMap.entry(new TypeValuePair(2, "."), null, null, null, null, null, null, null),
          NumpadUp: KeyboardMap.entry(new TypeValuePair(16, "Cursor Up"), null, null, null, null, null, null, null),
          NumpadDown: KeyboardMap.entry(new TypeValuePair(16, "Cursor Down"), null, null, null, null, null, null, null),
          NumpadLeft: KeyboardMap.entry(new TypeValuePair(16, "Cursor Left"), null, null, null, null, null, null, null),
          NumpadRight: KeyboardMap.entry(new TypeValuePair(16, "Cursor Right"), null, null, null, null, null, null, null),
          NumpadHome: KeyboardMap.entry(new TypeValuePair(16, "Home"), null, null, null, null, null, null, null),
          NumpadPageUp: KeyboardMap.entry(new TypeValuePair(2, "PageUp"), null, null, null, null, null, null, null),
          NumpadPageDown: KeyboardMap.entry(new TypeValuePair(2, "PageDown"), null, null, null, null, null, null, null),
          NumpadEnd: KeyboardMap.entry(new TypeValuePair(2, "End"), null, null, null, null, null, null, null),
          NumpadInsert: KeyboardMap.entry(new TypeValuePair(16, "Insert"), null, null, null, null, null, null, null),
          NumpadDelete: KeyboardMap.entry(new TypeValuePair(16, "Delete"), null, null, null, null, null, null, null),
          ":": KeyboardMap.entry(null, new TypeValuePair(2, ":"), null, null, null, null, null, null),
          ";": KeyboardMap.entry(new TypeValuePair(2, ";"), null, null, null, null, null, null, null),
          "<": KeyboardMap.entry(null, new TypeValuePair(2, "<"), null, null, null, null, null, null),
          "=": KeyboardMap.entry(new TypeValuePair(2, "="), null, null, null, null, null, null, null),
          ">": KeyboardMap.entry(null, new TypeValuePair(2, ">"), null, null, null, null, null, null),
          "?": KeyboardMap.entry(null, new TypeValuePair(2, "?"), null, null, null, null, null, null),
          "@": KeyboardMap.entry(null, new TypeValuePair(2, "@"), null, null, null, null, null, null),
          "[": KeyboardMap.entry(new TypeValuePair(2, "["), null, new TypeValuePair(2, String.fromCharCode.apply(null, [162])), null, null, null, null, null),
          "\\": KeyboardMap.entry(new TypeValuePair(2, "\\"), null, null, null, null, null, null, null),
          "]": KeyboardMap.entry(new TypeValuePair(2, "]"), null, null, null, null, null, null, null),
          "^": KeyboardMap.entry(null, new TypeValuePair(2, "^"), null, null, null, null, null, null),
          _: KeyboardMap.entry(null, new TypeValuePair(2, "_"), null, null, null, null, null, null),
          "`": KeyboardMap.entry(new TypeValuePair(2, "`"), null, null, null, null, null, null, null),
          a: KeyboardMap.entry(new TypeValuePair(2, "a"), new TypeValuePair(2, "A"), new TypeValuePair(16, "Attn"), null, null, null, null, null),
          b: KeyboardMap.entry(new TypeValuePair(2, "b"), new TypeValuePair(2, "B"), null, null, null, null, null, null),
          c: KeyboardMap.entry(new TypeValuePair(2, "c"), new TypeValuePair(2, "C"), null, null, null, null, null, null),
          d: KeyboardMap.entry(new TypeValuePair(2, "d"), new TypeValuePair(2, "D"), new TypeValuePair(16, "Dup"), null, null, null, null, null),
          e: KeyboardMap.entry(new TypeValuePair(2, "e"), new TypeValuePair(2, "E"), new TypeValuePair(16, "Erase EOF"), null, null, null, null, null),
          f: KeyboardMap.entry(new TypeValuePair(2, "f"), new TypeValuePair(2, "F"), null, null, null, null, null, null),
          g: KeyboardMap.entry(new TypeValuePair(2, "g"), new TypeValuePair(2, "G"), null, null, null, null, null, null),
          h: KeyboardMap.entry(new TypeValuePair(2, "h"), new TypeValuePair(2, "H"), null, null, null, null, null, null),
          i: KeyboardMap.entry(new TypeValuePair(2, "i"), new TypeValuePair(2, "I"), new TypeValuePair(16, "Erase Input"), null, null, null, null, null),
          j: KeyboardMap.entry(new TypeValuePair(2, "j"), new TypeValuePair(2, "J"), null, null, null, null, null, null),
          k: KeyboardMap.entry(new TypeValuePair(2, "k"), new TypeValuePair(2, "K"), null, null, null, null, null, null),
          l: KeyboardMap.entry(new TypeValuePair(2, "l"), new TypeValuePair(2, "L"), new TypeValuePair(16, "Erase Field"), null, null, null, null, null),
          m: KeyboardMap.entry(new TypeValuePair(2, "m"), new TypeValuePair(2, "M"), null, null, null, null, null, null),
          n: KeyboardMap.entry(new TypeValuePair(2, "n"), new TypeValuePair(2, "N"), null, new TypeValuePair(16, "Null"), null, null, null, null),
          o: KeyboardMap.entry(new TypeValuePair(2, "o"), new TypeValuePair(2, "O"), null, null, null, null, null, null),
          p: KeyboardMap.entry(new TypeValuePair(2, "p"), new TypeValuePair(2, "P"), null, null, null, null, null, null),
          q: KeyboardMap.entry(new TypeValuePair(2, "q"), new TypeValuePair(2, "Q"), null, null, null, null, null, null),
          r: KeyboardMap.entry(new TypeValuePair(2, "r"), new TypeValuePair(2, "R"), new TypeValuePair(16, "Reset"), new TypeValuePair(16, "Reset"), null, null, null, null),
          s: KeyboardMap.entry(new TypeValuePair(2, "s"), new TypeValuePair(2, "S"), null, null, null, null, null, null),
          t: KeyboardMap.entry(new TypeValuePair(2, "t"), new TypeValuePair(2, "T"), null, null, null, null, null, null),
          u: KeyboardMap.entry(new TypeValuePair(2, "u"), new TypeValuePair(2, "U"), null, null, null, null, null, null),
          v: KeyboardMap.entry(new TypeValuePair(2, "v"), new TypeValuePair(2, "V"), null, null, null, null, null, null),
          w: KeyboardMap.entry(new TypeValuePair(2, "w"), new TypeValuePair(2, "W"), null, new TypeValuePair(16, "Erase Word"), null, null, null, null),
          x: KeyboardMap.entry(new TypeValuePair(2, "x"), new TypeValuePair(2, "X"), null, null, null, null, null, null),
          y: KeyboardMap.entry(new TypeValuePair(2, "y"), new TypeValuePair(2, "Y"), null, null, null, null, null, null),
          z: KeyboardMap.entry(new TypeValuePair(2, "z"), new TypeValuePair(2, "Z"), null, null, null, new TypeValuePair(16, "Clear"), null, null),
          "{": KeyboardMap.entry(null, new TypeValuePair(2, "{"), null, null, null, null, null, null),
          "|": KeyboardMap.entry(null, new TypeValuePair(2, "|"), null, null, null, null, null, null),
          "}": KeyboardMap.entry(null, new TypeValuePair(2, "}"), null, null, null, null, null, null),
          "~": KeyboardMap.entry(null, new TypeValuePair(2, "~"), null, null, null, null, null, null),
          Backspace: KeyboardMap.entry(new TypeValuePair(16, "Backspace"), null, null, null, null, null, null, null),
          Tab: KeyboardMap.entry(new TypeValuePair(16, "Tab"), new TypeValuePair(16, "Back Tab"), null, null, null, null, null, null),
          "U+0018": null,
          Escape: KeyboardMap.entry(new TypeValuePair(2, "Escape"), null, null, null, null, null, null, null),
          Delete: KeyboardMap.entry(new TypeValuePair(16, "Delete"), null, null, null, null, null, null, null),
          "U+00A1": null,
          "U+0300": null,
          "U+0301": null,
          "U+0302": null,
          "U+0303": null,
          "U+0304": null,
          "U+0306": null,
          "U+0307": null,
          "U+0308": null,
          "U+030A": null,
          "U+030B": null,
          "U+030C": null,
          "U+0327": null,
          "U+0328": null,
          "U+0345": null,
          "U+20AC": null,
          "U+3099": null,
          "U+309A": null,
          ControlLeft: KeyboardMap.entry(new TypeValuePair(16, "Reset"), null, null, null, null, null, null, null),
          ControlRight: KeyboardMap.entry(new TypeValuePair(16, "Enter"), null, null, null, null, null, null, null),
    }

    static ir:any = { // a global ir, that doesn't have a great name yet
        Esc: "Escape",
        Nonconvert: "NonConvert",
        Spacebar: " ",
        ArrowLeft: "Left",
        ArrowRight: "Right",
        ArrowDown: "Down",
        ArrowUp: "Up",
        Del: "Delete",
        "U+001B": "Escape",
        "U+007F": "Delete",
        "U+0008": "Backspace",
        "U+0009": "Tab",
        OS: "Win",
        Meta: "Win",
        Menu: "ContextMenu",
        Apps: "ContextMenu",
        Scroll: "ScrollLock",
        MediaTrackNext: "MediaNextTrack",
        MediaTrackPrevious: "MediaPreviousTrack",
        AudioVolumeMute: "VolumeMute",
        AudioVolumeDown: "VolumeDown",
        AudioVolumeUp: "VolumeUp",
        Caps: "CapsLock",
        Ctrl: "Control",
        Ins: "Insert",
        Space: " ",
        Ent: "Enter",
    }
}

export class Sounds {
    static sound1:any = new Audio(
        "data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH\n3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfH\noSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAEx\nBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576\nv////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS\n4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQ\nRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDA\nmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAU\nABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM\n7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ\n+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGt\njLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDA\nAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveE\nAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTI\nnzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dz\nNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkw\ndxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eD\nvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU\n8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAo\nRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImN\ng3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzr\nO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUd\nU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHp\nMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb//////////////////////////\n/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////\n/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////\n/////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3ku\nZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
}

/* Typescript helps the programmer use HTML DOM well by having massive type 
   declaration for it

   https://github.com/microsoft/TypeScript/blob/main/lib/lib.dom.d.ts
*/

export type HTMLElementOrNull = (HTMLElement|null);

export type HTMLColor = string;

export class VirtualScreen {  // all terminal types, minified as ko
    canvas:HTMLCanvasElement|null;  // Node type is an HTML node
    selectionCanvas:HTMLCanvasElement|null;
    parentDiv:HTMLElementOrNull;
    textAreaOverlay:HTMLTextAreaElement|null;  // the textArea overlay thing, was Ii
    oiaEnabled:number;
    width:number;
    height:number;
    On:any;   // hmmm
    renderer:BaseRenderer|null;
    oiaLine:OIALine;
    Kl:any[]; // could be screen element, or...
    defaultWidth:number;  // was Ln
    defaultHeight:number; // was Bn
    _n:any[];
    websocket:any;  // what type is a websocket?
    Qn:any;  // event key modifiers
    Tl:number|null;
    Sl:number|null;
    Rl:number|null;
    yl:number|null;
    mouseIsDown:boolean;
    jn:boolean;
    Vn:HTMLColor;
    zn:any;
    keyboardMap:any;
    Hn:boolean;
    Yn:any;
    qn:boolean;
    Jn:any[];
    scriptIsRunning:boolean;
    Xn:boolean;
    $n:boolean;
    ti:any; // connection state
    li:any;
    ni:boolean;
    ii:string[];
    shortName:string|null; // was wi
    longName:string;  // was vi
    cursorPos:number; // was this.kl
    bi:any;
    attentionSound:any;
    Ei:any;  // not declared originally
    mi:any;  // not declared originally
    callbacks:any; // not declared originally
    id:any; // not declared originally
    inInsertMode:boolean = false; // inInsertMode (drives cursor drawing and other things - and should be abstracted better
    zi:any;     // mobile browser info
    contextRightClick:any; // this exists in minified code, but I really don't know what it does
    Ft:any;  // poorly understood, has to do with fonts
    size:number;
    ee:any; // some mouse handling timeout,
    re?:HTMLElement;  // this.re is only mentioned in a trivial part of an event handler
                      // and probably can be eliminated
    we?:HTMLElement;  // more trivial dead stuff
    resizeTimeoutID:any; // this was a global/state "go", but that was ridiculous
    
    constructor(width:number, height:number){
	this.canvas = null;
	this.selectionCanvas = null; // min'd as this.Il
	this.textAreaOverlay = null;
	this.parentDiv = null;
	this.oiaEnabled = 1;
	this.width = width;
	this.height = height;
	this.On = VirtualScreen.co.In;
	this.oiaLine = new OIALine(this); // this.Mn = new Eo(this);
	this.Kl = new Array(this.height * this.width);
	this.renderer = null; // minified as Un
	this.defaultWidth = 80;
	this.defaultHeight = 24;
	this.size = -1; // will be clobbered in subclasses
	this._n = [];
	this.websocket = null;  // minified as this.Wn = null;
	this.Qn = 0;      // Key event modifiers, bits to be checked
	this.Tl = null;   // copy box region start x or y
	this.Sl = null;   // copy box region start x or y
	this.Rl = null;   // copy box region end x or y
	this.yl = null;   // copy box region end x or y
	this.mouseIsDown = false; // this.Gn = !1;
	this.jn = false;
	this.Vn = "rgb(255,255,255)";
	this.zn; // has zn.height zn.language, language indexes the charsetInfo by lang=csinfo.name
	this.keyboardMap = null; // was this.Kn = null;
	this.Hn = !0;
	this.Yn = null;
	this.qn = !1;
	this.Jn = new Array();
	this.scriptIsRunning = false; // this.Zn = false;
	this.Xn = !1;
	this.$n = !1;
	this.ti = 0;     // connection state?? 
	this.li = 0;
	this.ni = !1;
	this.ii = ["Reset"];
	
	this.attentionSound = Sounds.sound1;
	// saw evidence of dynamic property "this.id" in method
	this.shortName = "a"; // is called .wi
	this.longName = "a";
	// These are used a lot but declared one level up in paged.
	this.cursorPos = 0; // was this.kl
	// this.bufferPos = 0; // was this.Oe
	this.bi; // holds onto hos info but not declared
    }

    static co:any = { In: 0, Dn: 1 };  // I have no idea what this is yet;

    static sessionNames:string[] = [ "A","B","C","D","E","F","G","H",   // Was V
				     "I","J","K","L","M","N","O","P",
				     "Q","R","S","T","U","V","W","X","Y","Z",
				     "[","\\","]","^","_","`",
				     "a","b","c","d","e","f","g","h",
				     "i","j","k","l","m","n","o","p",
				     "q","r","s","t","u","v","w","x","y","z",
				     "{","|","}","~"];
    
    static namesInUse:boolean[] = new Array(VirtualScreen.sessionNames.length).fill(false); // (VirtualScreen.namesInUse = new Array(V.length)),

    nameThisSession(){ // (ko.prototype.di = function () {
	let len = VirtualScreen.namesInUse.length;
	for (var i = 0; i < len; i++){
            if (!VirtualScreen.namesInUse[i]) {
		VirtualScreen.namesInUse[i] = !0;
		this.shortName = VirtualScreen.sessionNames[i]; // was wi
		break;
            }
	}
	this.shortName || (this.shortName = " ");
	this.longName = this.shortName;
    }

    getCharsetInfo():CharsetInfo {
	throw "Subclasses must implement getCharsetInfo()";
    }

    // some sort of user-alerting base method 
    Pl(){
	// do nothing
    }


    pi(t:any){ // (ko.prototype.pi = function (t) {
	this.Ai(4999, t.data, "Connection to host closed due to error.\nHost: " + this.bi.host +
		"\nPort: " + this.bi.port + "\nError:" + t.data);
    }
    
    gi(t:any){ // (ko.prototype.gi = function (t) {
	this.Ai(t.code, t.reason, "Connection to host closed.\nHost: " + this.bi.host +
		"\nPort: " + this.bi.port + "\nCode: " + t.code + "\nReason: " + t.reason);
    }
    
    Ai(t:number, l:string, n:string){ // (ko.prototype.Ai = function (t, l, n) {
	let logger = Utils.eventLogger;
	if (t != this.mi) {
            if ((logger.warn(n), !this.callbacks.wsErrorCallback))
		return void setTimeout(() => {
                    alert(n), this.closeConnection(t, l), (this.websocket = null), (this.Ei = !1);
		}, 500);
            this.callbacks.wsErrorCallback(t, l, n);
	}
	this.closeConnection(t, l);
	this.websocket = null;
	this.Ei = false;
    }

    isConnected ():boolean{  // (ko.prototype.isConnected = function () {
	return 2 === this.ti; 
    }

    getRendererOrFail():BaseRenderer{
	if (this.renderer){
	    return this.renderer;
	} else {
	    throw "Screen does not have Renderer";
	}
    }

    getCanvasOrFail():HTMLCanvasElement{
	if (this.canvas){
	    return this.canvas;
	} else {
	    throw "Screen does not have Canvas";
	}
    }

    getElementByIdOrFail(id:string|null):HTMLElement{
	if (id){
	    let element = document.getElementById(id);
	    if (element){
		return element;
	    } else {
		throw "element not found for id="+id;
	    }
	} else {
	    throw "no id provided";
	}
    }

    disconnect():void{ // (ko.prototype.disconnect = function () {
	let logger = Utils.coreLogger;
	logger.info("Disconnected terminal with ID=" + this.id);
	this.Ei = false;  // not set in constructor
	this.scriptIsRunning = true;   // GURU, this seems wrong, why would a script be running
	this.closeConnection(4e3, "Terminal Closed");
	this.getRendererOrFail().fullPaint();
    }
    
    closeConnection(closeCode:number, message:string):void{ // (ko.prototype.closeConnection = function (t, l) {
	this.mi = closeCode;  // not seen in constructor
	var n = this.websocket;
	if (n){
            try {
		n.close(closeCode, message);
            } catch (t) {}
	}
	this.handleUnbind();
	this.clear();
	if (!this.Ei) {
            var parentDiv:HTMLElementOrNull =
		(this.parentDiv ?
		    this.parentDiv :
		    (this.getElementByIdOrFail(this.getCanvasOrFail().id).parentNode as HTMLElementOrNull)); // A cast 
            try {
		this.removeFromDOM(parentDiv as HTMLElement);
		var parentID:string|null = (parentDiv ? parentDiv.id : null);
		if (this.callbacks && this.callbacks.closeCallback){
		    this.callbacks.closeCallback(parentID);
		}
	    } catch (t) {}
	    if (this.shortName && this.shortName != " "){
		VirtualScreen.namesInUse[this.shortName.charCodeAt(0) - 65] = false;
		this.shortName = null;
	    }
	}
	this.Ei = false;  // not seen in constructor 
    }

    getOIAArray():any{ // (ko.prototype.Fl = function () {
	Utils.superClassWarning("getOIAArray");
    }
    
    initScreen():void { // (ko.prototype.Ti = function () {
	Utils.superClassWarning("initScreen");
    }
    
    connect(url:string,l:any):void { // (ko.prototype.connect = function (t, l) {
	Utils.superClassWarning("connect");
    }
    
    paste(t:string):boolean{ // (ko.prototype.Ri = function (t) {
	Utils.superClassWarning("paste");
	return false;
    }
    
    copy(t:any):void{ // (ko.prototype.yi = function (t) {
	Utils.superClassWarning("copy");
    }

    Ui(t:any):void{ // WTF
	Utils.superClassWarning("Ui");
    }
    
    getScreenContents(t:any, l:any, n:any, i:any, e:any, s:any) {   // (ko.prototype.Ci = function (t, l, n, i, e, s) {
	Utils.superClassWarning("getScreenContents");
    }

    yi(t:boolean,l:boolean):(string|null){ // lc.prototype.yi = function (t, l) {
	Utils.superClassWarning("yi");
	return null;
    }
    
    setCursorPos(position:number):boolean{ // (ko.prototype.Ni = function (t) {
	Utils.superClassWarning("setCursorPos");
	return false;
    }
    
    modifyCursorPos(delta:number):void{ // (ko.prototype.Pi = function (t) {
	Utils.superClassWarning("modifyCursorPos");
    }
    
    enterCharacterAtCursor(t:any){ // (ko.prototype.Fi = function (t) { // t is probably number or string
	Utils.superClassWarning("enterCharacterAtCursor");
    }
    
    clear():void{ // (ko.prototype.clear = function () {
	Utils.superClassWarning("clear");
    }
    
    handleUnbind():void{ // (ko.prototype.ki = function () {
	Utils.coreLogger.info("handle unbind function");
    }

    removeFromDOM(parentDiv:HTMLElement):void{ // (ko.prototype.Si = function (parentDiv) {
	if (this.textAreaOverlay){
	    parentDiv.removeChild(this.textAreaOverlay); // this.Ii not in constructor, but it's an HTMLTextAreaElement I think
	}
	if (this.canvas){
	    parentDiv.removeChild(this.canvas);
	}
	if (this.selectionCanvas){
	    parentDiv.removeChild(this.selectionCanvas);
	}
    }

    /**

     */

    
    handleContainerResize(parentDiv:HTMLElement, t?:number, n?:number){ // (ko.prototype.handleContainerResize = function (parentDiv, t, n) {
	Utils.coreLogger.info("handling resize");
	if (this.resizeTimeoutID){
	    clearTimeout(this.resizeTimeoutID);   // JOE is this insane global use of go really intentional, wow!!
	}
	var i = t || parentDiv.clientWidth,
            e = n || parentDiv.clientHeight;
	this.parentDiv = parentDiv;
	(0 !== e && null != e) || (e = this.zn.height),
	this.removeFromDOM(parentDiv); 
	if (this.renderer){
	    this.renderer.clear();
	}
	Utils.coreLogger.info("resize w=" + i + " h=" + e);
	this.Oi(parentDiv, { width: i, height: e });
	this.buildEventHandlers();
	if (this.renderer) {
	    ((this.renderer.canvas = this.canvas),
	     this.renderer.sl(),
	     this.Ui(this.zn), // NEEDSWORK Ui has interim implementation
	     this.renderer.fullPaint(),
	     this.renderer.handleResize());
	}
	var s = this;
	this.resizeTimeoutID = setTimeout(function () {
            s.Li();
	}, 200);
    }

    userAttentionSound(){ // (ko.prototype.oi = function () {
	this.attentionSound && this.attentionSound.play();
    }
    
    hasFocus():boolean{ //  (ko.prototype.Ht = function () {
	let activeElement:Element|null = document.activeElement;
	return ( ((this.canvas != null) && document.getElementById(this.canvas.id) === activeElement) ||
	    ((this.selectionCanvas != null) && document.getElementById(this.selectionCanvas.id) == activeElement) ||
	    ((this.textAreaOverlay != null) && document.getElementById(this.textAreaOverlay.id) == activeElement));
    }

    static makeTextArea(name:string,
			width:number,
			height:number):HTMLTextAreaElement{ // (ko.xi = function (t) {
	let textArea:HTMLTextAreaElement = document.createElement("textarea") as HTMLTextAreaElement;
	textArea.id = name + "Input";
	let n = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(navigator.appVersion);
        let agent = navigator.userAgent;
        if (n ||
	    (-1 !== agent.indexOf("Android")) ||
	    (-1 !== agent.indexOf("iOS"))){
	    textArea.readOnly = true;
	}
	console.log("JOE is hacking makeTextArea position!!");
        textArea.style.position = "absolute"; // "relative";
        textArea.style.zIndex = "3";
        /* textArea.style.bottom = "0px"; */
        textArea.style.left = "0px";
	textArea.style.top = "0px"; // JOE
        textArea.style.opacity = "0";
        textArea.style.width =  width+"px"; // "100%";
        textArea.style.height = height+"px"; // "100%";
        textArea.style.cursor = "default";
        return textArea;
    }
    
    static makeCanvas(id:string,
		      parentDiv:HTMLElement,
		      width:number,
		      height:number,
		      zIndex:number):HTMLCanvasElement{ //ko.ci = function (t, parentDiv, n, i, e) {
	Utils.coreLogger.debug(`make canvas w/ id=${id}, parentDiv=${parentDiv}, w,h=${width},${height}`);
	let canvas:HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;
	canvas.id = id;
	canvas.style.zIndex = zIndex+"";
	canvas.style.position = "absolute";
	canvas.style.left = "0px";
	canvas.style.top = "0px";
	canvas.width = width;
	canvas.height = height;
	canvas.innerHTML = "If you see this message, rather than an HTML &lt;canvas&gt;, upgrade your browser";
	parentDiv.appendChild(canvas);
	return canvas;
    }

    Ne(){ // (ko.prototype.Ne = function () {
	this.callbacks || (this.callbacks = {}),
	this.callbacks.passwordPrompt ||
            (this.callbacks.passwordPrompt = function (t:any) { // cheesy any declaration, could be tighter
		setTimeout(function () {
                    let l = prompt("Script paused for password input. Enter password.");
                    t(l);
		}, 100);
            });
    }

    // A bunch of integer-guaranteeing sizing computations 
    me(t:number):any{ // (ko.prototype.me = function (t) {
	return { row: Math.floor(t / (this.width + 1)) + 1, column: Math.floor((t - 1) % this.width) + 1 };
    }
    Ee(t:number,l:number):number{ // (ko.prototype.Ee = function (t, l) {
	return this.width * (t - 1) + l;
    }
    ke(t:number):any{ // (ko.prototype.ke = function (t) {
	return { row: Math.floor(t / (this.width + 1)), column: Math.floor((t - 1) % this.width) };
    }
    Se(t:number,l:number):number{ // (ko.prototype.Se = function (t, l) {
	return this.width * (t - 1) + (l - 1);
    }
    // getRow-Column from position
    Te(t:number):any{ // (ko.prototype.Te = function (t) {
	return { row: Math.floor(t / this.width) + 1, column: Math.floor(t % this.width) + 1 };
    }
    Re(t:number,l:number):number{//(ko.prototype.Re = function (t, l) {
	return this.width * t + (l + 1);
    }
    ye(t:number):any{ // (ko.prototype.ye = function (t) {
	return { row: Math.floor(t / this.width), column: Math.floor(t % this.width) };
    }
    Ce(t:number, l:number){ // (ko.prototype.Ce = function (t, l) {
	return this.width * t + l;
    }

    /**
      parentDiv is a DOM iv
      dimensions is generic JS object with .width and .height
    */
    Oi(parentDiv:HTMLElement, dimensions:any){ // (ko.prototype.Oi = function (parentDiv, t) {
	this.parentDiv = parentDiv;
	let l = parentDiv.id;
	var n = l + "Canvas";
	this.canvas = VirtualScreen.makeCanvas(n, parentDiv, dimensions.width, dimensions.height, 1);
	var i = l + "SelectionCanvas";
	this.selectionCanvas = VirtualScreen.makeCanvas(i, parentDiv, dimensions.width, dimensions.height, 2);
	/* JOE: I maintain that the following line is meaningless, who ever references innerHTMLMessageLength */
	(this.selectionCanvas as any).innerHTMLMessageLength = this.selectionCanvas.innerHTML.length;
	/* JOE: the textarea spans the canvas and become a more sophisticated way
	        of taking key events, especially for internationalization and cut/paste.
	*/
	this.textAreaOverlay = VirtualScreen.makeTextArea(l,dimensions.width,dimensions.height);// hacked for now JOE
	parentDiv.appendChild(this.textAreaOverlay);
	return { canvas: this.canvas, Il: this.selectionCanvas, Pe: this.textAreaOverlay };
    }
    
    resize(width:number, height:number, suppressRedraw?:boolean) { // (ko.prototype.resize = function (t, n, i) {
	this.width = width;
	this.height = height;
	this.size = width * this.height;
	this.oiaLine.xn = new Array(width || 80).fill(0x20);
	Utils.coreLogger.info("Resized canvas grid to r=" + this.height + ", c=" + this.width + ", size=" + this.size);
	if (!suppressRedraw){
	    this.clear();
	    if (this.renderer){
		this.renderer.sl(); // some canvas reset which doesn't have a nice name yet.
		if (null !== this.zn && void 0 !== this.zn){  // NEEDSWORK this.zn
		    this.Ui(this.zn);                         // NEEDSWORK Ui has interim implementation
		    this.renderer.fullPaint();
		}
	    }
	}
    }

    handleKeyUp(event:KeyboardEvent):void{ // (ko.prototype.Bi = function (t) {
	console.log("VirtualScreen.handleKeyUp");
    }

    /* this is not called by subclasses, but only by event-handling internals */
    keyUpHandlerInternal(event:KeyboardEvent):void { // (ko.prototype._i = function (t) {
	let logger = Utils.keyboardLogger;
	var keyCode = event.keyCode; // was l
	// event.keyIdentifier is non-stanard, obsolete, and probably a little desperate in the following line
        var bestKeyName = (event.key ? event.key : (event as any).keyIdentifier); // was n
	logger.debug("keyup " + event + " target=" + event.target +
		     " keyName='" + bestKeyName + "' keyCode=0x" + Utils.hexString(keyCode));
	if (this.Xn && !["Shift", "Control", "Alt"].includes(bestKeyName)){  // NEEDSWORK .Xn
            Utils.eventLogger.debug("Screen locked by error occurrence in handleKeyUp event="+JSON.stringify(event)+
				    " bestKeyName="+bestKeyName);
	    event.stopPropagation();
	    event.preventDefault();
	    return; // slight discrepancies agains minified
	}
	this.handleKeyUp(event);
	logger.debug("keyup, modifier state starts at " + this.Qn.toString(2)); // NEEDSWORK .Qn
	if ( 0 !== this.Qn && 256 !== this.Qn){
            if (("AltLeft" == bestKeyName ? (this.Qn &= -2) : "AltRight" == bestKeyName && (this.Qn &= -3), "Alt" == bestKeyName)) this.Qn &= -2;
            else if ("ControlLeft" == bestKeyName) this.Qn &= -5;
            else if ("ControlRight" == bestKeyName) this.Qn &= -9;
            else if ("Control" == bestKeyName) this.Qn &= -5;
            else if ("OSLeft" == bestKeyName || "Win" == bestKeyName) this.Qn &= -17;
            else if ("OSRight" == bestKeyName) this.Qn &= -33;
            else if ("ShiftLeft" == bestKeyName) this.Qn &= -65;
            else if ("ShiftRight" == bestKeyName) this.Qn &= -129;
            else {
		if ("Shift" != bestKeyName) return;
		this.Qn &= -65;
            }
            if (0 === this.Qn || 256 === this.Qn) {
		if (!this.ni && ["Shift", "Control", "Alt"].includes(bestKeyName)) { // NEEDSWORK .ni
                    var i = this.keyboardMap[event.code];
                    i && i[0] && i[0].type && (!this.Xn || (this.ii && this.ii.includes(i[0].value))) && this.handleKey(i[0], event);
		}
		this.ni = !1;
            }
            event.stopPropagation();
	    event.preventDefault();
	    logger.debug("keyup, modifier state is now " + this.Qn.toString(2));
	}
    }
    
    Qi(event:KeyboardEvent):void { // (ko.prototype.Qi = function (t) {
        if (-1 === navigator.appName.indexOf("Safari") && event.getModifierState){ // GURU why safari?
	    event.getModifierState("CapsLock") ? (this.Qn |= 0x000100) : (this.Qn &= 0xFFFEFF); // NEEDSWORK .Qn 
	}
    }

    // get/update modifiers as a name
    Gi(typeValuePair:TypeValuePair, event:KeyboardEvent):boolean{ // (ko.prototype.Gi = function (t, l) {
	if (event.getModifierState){ // modern, easy way
	    this.Qn = 0; // NEEDSWORK .Qn
            if (event.getModifierState("Control")) this.Qn |= 4;
	    if (event.getModifierState("Alt")) this.Qn |= 1;  
            if (event.getModifierState("Shift")) this.Qn |= 64;
            if (event.getModifierState("CapsLock")) this.Qn |= 256;
            if (event.getModifierState("Meta") ||
		event.getModifierState("OS") ||
		event.getModifierState("Win")){
		this.Qn |= 16;
	    }
            return true;
        }
	// Why the hell does Qn not get set to 0 this case, but it does above, GURU
	if (2 === typeValuePair.type ||
	    (8 === typeValuePair.type && typeValuePair.value.length > 1)) {
            var name = typeValuePair.value;
            if ("CapsLock" == name) this.Qn ^= 256;
            else if ("AltLeft" == name) this.Qn |= 1;
            else if ("AltRight" == name) this.Qn |= 2;
            else if ("Alt" == name) this.Qn |= 1;
            else if ("ControlLeft" == name) this.Qn |= 4;
            else if ("ControlRight" == name) this.Qn |= 8;
            else if ("Control" == name) this.Qn |= 4;
            else if ("OSLeft" == name || "Win" == name) this.Qn |= 16;
            else if ("OSRight" == name) this.Qn |= 32;
            else if ("ShiftLeft" == name) this.Qn |= 64;
            else if ("ShiftRight" == name) this.Qn |= 128;
            else {
		if ("Shift" != name) return !1;
		this.Qn |= 64;
            }
            return true;
	}
	return false; // no modifier info was gained/extracted
    }

    static beginsWithAlpha(str:string) {  // was mo(t), a global function
        return new RegExp("[a-zA-Z]").test(str.charAt(0));
    }
    
    keyDownAndPressHandlerInternal(event:KeyboardEvent):void{ // (ko.prototype.ji = function (t) {
	let logger = Utils.keyboardLogger;
	const l:any = { Add: "+", Subtract: "-", Multiply: "*", Divide: "/", Decimal: "." };
	this.Qi(event); // NEEDSWORK .Qi
	var keyCode = event.keyCode; // was n
	// event.keyIdentifier is non-stanard, obsolete, and probably a little desperate in the following line
        var i = (l[event.key] ?
		 l[event.key] :
		 (("Cancel" === event.key && 3 === event.charCode && void 0 === event.code) ?
		  "Pause" :
		  (("Cancel" === event.key || event.key) ?
		   event.key :
		      (event as any).keyIdentifier)));
	this.Gi(new TypeValuePair(8, i), event);
	if ((event.ctrlKey || event.shiftKey || event.altKey) &&
	    !["Control", "Alt", "Shift"].includes(i)){
	    this.ni = !0; // NEEDSWORK .ni
	}
        logger.debug("keydown " + event + " target=" + event.target + " keyName='" + i +
		     "' keyCode=0x" + Utils.hexString(keyCode));
        logger.debug("keydown, modifier state starts at " + this.Qn.toString(2));
         
	if (i.startsWith("U+") && 6 == i.length){
            if ("U+0000" === i && (this.zi.isAndroid || this.zi.isIOS)) return;
            var e = parseInt(i.substring(2), 16);
            e >= 32 && e < 127 && (i = String.fromCharCode(e));
	}
	var s = 1 == i.length && VirtualScreen.beginsWithAlpha(i); 
	if (s) {
	    i = i.toLowerCase();
	}
	var u:any = KeyboardMap.ir[i]; // INTERIM, i really don't know what's here
	logger.debug("keydown, i="+i+"u="+u);
	if (u){
	    i = u;
	}
	if (!(3 !== event.location || "NumLock" == i || i.startsWith("Numpad"))){
	    i = "Numpad" + i;
	}
	var h;
        var r = this.keyboardMap[i];
	logger.debug("keydown, i(now)="+i+" r="+JSON.stringify(r)+" this.Qn = "+this.Qn);
	if (r && r != null){
            var a = 0;
            12 & this.Qn && (a |= 2), 3 & this.Qn && (a |= 4), 192 & this.Qn && (a |= 1), 256 == this.Qn && s ? (a = 1) : 1 == a && 256 & this.Qn && s && (a = 0), logger.debug("keydown modifier=" + a), 0 === a && (a = 0);
            var o = r[a];
            o && o.type && o.value && (h = o);
	}
	h ? 4 === h.type && (h = new TypeValuePair(1, String.fromCharCode.apply(null, h.value))) : (h = new TypeValuePair(8, i));
	logger.debug("keydown, deciding to handleKey based on this.Xn="+this.Xn+" and h="+JSON.stringify(h));
	this.dumpFields();
	(!this.Xn || (this.ii && this.ii.includes(h.value))) &&
	    (logger.debug("keydown mapping result: type=" + h.type +
			  " value=" + h.value),
	     this.handleKey(h, event),
	     logger.debug("keydown, modifier state is now " + this.Qn.toString(2)));
    }

    dumpFields():void{
	console.log("override me");
    }
    
    runCommand(commandText:string):void{ // (ko.prototype.Hi = function (t) {
	if (commandText && "string" == typeof commandText) {
            var l = commandText.toLowerCase();
            document.execCommand(l);
	}
    }
    
    // overridden in paged, but might be dead-end code
    Yi(t:number):void { // (ko.prototype.Yi = function (t) {
	Utils.superClassWarning("handleKeyCode");
    }
    
    qi(t:any){ // (ko.prototype.qi = function (t) {
	var l = t.charCode;
	this.handleCharCodeInput(l);
    }
    
    Zi(t:string){ // (ko.prototype.Zi = function (t) {
	var l = t.charCodeAt(0);
	this.handleCharCodeInput(l);
    }

    // overridden in paged.js, note that lowercase .ji exists
    handleCharCodeInput(charCode:number):void{ // (ko.prototype.Ji = function (t) {
	Utils.superClassWarning("handleCharCodeInput");
    }
    
    Xi(t:string):string { // (ko.prototype.Xi = function (t) {
	if (!this.Hn) return t;
	let l = t.trim().replace(/ {2,}/g, "\t");
	return (l = l.replace(/ ([\+\-\.\d])/g, "\t$1")), l;
    }
    
    cleanString(t:string):string{ // (ko.prototype.$i = function (t) {
	return this.Hn ? t.trim().replace(/\t/g, " ") : t;
    }
    
    // overridden in model3270 // GURU - two args, never called with more than one argument - hmm
    autotype(t:any,l?:any):void{ // (ko.prototype.te = function (t, l) { 
	Utils.superClassWarning("autoType");
    }

    handleMouseMove(event:MouseEvent):void{ // (ko.prototype.le = function (t) {
	if (this.mouseIsDown && this.renderer) {
            var l = this.renderer.gl(event.offsetX, event.offsetY); // NEEDSWORK .gl
            l.columns + 1 <= this.width && (this.yl = l.columns + 1),
	    l.rows + 1 <= this.height && (this.Rl = l.rows + 1),
	    this.renderer.ml();
	}
    }
    
    handleMouseUp(event:MouseEvent):void { // (ko.prototype.ne = function (t) {
	this.mouseIsDown = !1;
    }
    
    handleMouseDown(event:MouseEvent):void { // (ko.prototype.ie = function (t) {
	if (!0 === this.jn) (this.jn = !1), clearTimeout(this.ee);
	else {
            var l = this;
	    this.ee = setTimeout(function () {  // NEEDSWORK this.ee
                !0 === l.mouseIsDown && (l.jn = !0);
	    }, 200); 
            if (((2 == event.button || 2 == event.buttons) && this.contextRightClick) || !this.renderer){
		return;
	    }
            this.mouseIsDown = true;
            var n = this.renderer.gl(event.offsetX, event.offsetY); // NEEDSWORK .gl
            this.Sl = n.columns; // NEEDSWORK .Sl .Tl
	    this.Tl = n.rows;
	}
    }

    handleKey(typeValuePair:TypeValuePair,l:KeyboardEvent):void { // (Oo.prototype.Wi = function (t, l) {
	Utils.superClassWarning("handleKey");
    }
    
    // overridden in model3270
    handleClick(offsetX:number, offsetY:number,
		coords:any,
		screenPos:number): void { // (ko.prototype.se = function (t, l, n, i) {
	
    }
    
    handleTripleClick(offsetX:number, offsetY:number,
		      coords:any,
		      screenPos:number):void { // (ko.prototype.ue = function (t, l, n, i) {
	Utils.superClassWarning("handleTripleClick");
    }
    
    handleClicksInternal(event:MouseEvent):void{ // (ko.prototype.he = function (t) {
	let logger = Utils.eventLogger;
	let l:number = event.offsetX;
        let n:number = event.offsetY;
	logger.debug("click " + event + ", pos=(" + l +"," + n + ")");
	if (!1 === this.jn){ // NEEDSWORK .jn	    
	    this.Sl = null; // nulling the copybox
	    this.Tl = null;
	    this.yl = null;
	    this.Rl = null;
	    if (this.re){
		this.re.style.display = "none";
	    }
	}
	if (this.renderer){
            var coords = this.renderer.gl(l, n); // NEEDSWORK .gl - does this compute mouse coordinates,  was i
	    logger.debug("click row,col = "+JSON.stringify(coords));
            if ( coords != null) {
		// declaring e inside this lexical context is legal but seems as cheesy and confusing as hell
		var e = coords.rows * this.width + coords.columns;
            if ("dblclick" == event.type) {
                var s,
                    u = this.keyboardMap.ae; // NEEDSWORK GURU
                if (u && null != u) {
                    var h = 0;
                    12 & this.Qn && (h |= 2), 3 & this.Qn && (h |= 4), 192 & this.Qn && (h |= 1), 256 == this.Qn ? (h = 1) : 1 == h && 256 & this.Qn && (h = 0), Utils.keyboardLogger.debug("keydown modifier=" + h), 0 === h && (h = 0);
                    var r = u[h];
                    r && (s = r);
                }
                this.handleDoubleClick(l, n, coords, e, s);
            } else 3 == event.detail ? this.handleTripleClick(l, n, coords, e) : this.handleClick(l, n, coords, e);
            } else logger.warn("rejecting mouse event, type=" + event.type + " because rowColumn == null");
	}
    }

    // overridden in model3270, too
    // problem with number of arguments
    handleDoubleClick(x:number,
		      y:number,
		      coords:any,
		      screenPos:number,
		      s?:any){ // (lc.prototype.oe = function (t, l, n, i) {
	Utils.superClassWarning("handleDoubleClick");
	Utils.eventLogger.debug("dblclick " + JSON.stringify(coords));
    }
    
    ce(e:any){ // (ko.prototype.ce = function (t) {
	Utils.coreLogger.debug("Received connected message from server");
	this.ti = 2; // NEEDSWORK ti
    }

    fe(t:any){ // (ko.prototype.fe = function (t) {
	this.websocket.close(4001, "server sent close/error/exception message");
	this.Xn = true; // NEEDSWORK .Xn
    }
    
    Li(){ // (ko.prototype.Li = function () {
	Utils.superClassWarning("handleResizeComplete");
    }
    
    de(t:number,l:number):number{ // (ko.prototype.de = function (t, l) {
	return this.width * t + l;
    }

    ve(t:string):void { // created because no base class method was present
	Utils.superClassWarning("ve");
    }

    handleWheel(event:WheelEvent):void { // created because no base class method was present
	Utils.superClassWarning("handleWheel");
    }

    handleContextMenu(event:MouseEvent):void { // created because no base class method was present
	Utils.superClassWarning("handleContextMenu");
    }

    establishMobileBrowserInfo():void{
	let e = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(navigator.appVersion),
            s = navigator.userAgent;
        var isAndroid = false;  // was h
        var isIOS = false;      // was r
	if (e && (-1 !== s.indexOf("Android"))){
	    isAndroid = true;
	}
	if (e && (-1 !== s.indexOf("iOS"))){
	    isIOS = true;
	}
	this.zi = { isAndroid: isAndroid, isIOS: isIOS }; // NEEDSWORK .zi, not declared but shared wtih some other event handlers
    }
    
    buildEventHandlers():void{ // (ko.prototype.Mi = function () {
	let eventLogger = Utils.eventLogger;
	let selectionCanvas = this.selectionCanvas; // was t
        let textArea = this.textAreaOverlay; // was l
        var n = this.we;   // was n JOE thinks this is dead code, ".we" not defined and n not used, or is it set from outside GURU
        var screen = this; // was i
	if (selectionCanvas){
	    selectionCanvas.tabIndex = 0;
	    selectionCanvas.contentEditable = 'true'; // it's not a boolean, it's a 3-value enum, look at W3 spec!
	}
	var compositionData:any; // was u;
	this.establishMobileBrowserInfo();
	screen.Kl.fill(null); // NEEDSWORK Kl
	var postEventCleanup = function () { // was o()
            screen.jn = false; // NEEDSWORK
	    if (textArea){
		textArea.value = "";
		textArea.selectionEnd = 0;
		textArea.selectionStart = 0;
	    }
	    // the copybox bounds 
	    screen.Sl = null;
	    screen.Tl = null;
	    screen.yl = null;
	    screen.Rl = null;
	    if (screen.renderer){
		screen.renderer.ml();
	    }
	};
	
	document.addEventListener("copy", function (eventArg:any) {
	    let event:ClipboardEvent = eventArg as ClipboardEvent;
            if ((document.activeElement == textArea || document.activeElement == n) && !screen.scriptIsRunning) {
		eventLogger.debug("Copy, box region start=(" + screen.Sl + "," + screen.Tl +
		    "), end=(" + screen.yl + "," + screen.Rl + ")");
		event.stopPropagation();
		let l:string|null = screen.yi(!1, !0); // NEEDSWORK
		if (l){
		    l = screen.Xi(l);
		    if (null != l) {
			if (event.clipboardData){ // I don't think this really can be null, but I am not the compiler!
			    event.clipboardData.setData("text/plain", l);
			}
			event.preventDefault();
		    }
		}
		postEventCleanup();
            }
	});
	document.addEventListener("paste", function (eventArg:any) {
	    let event:ClipboardEvent = eventArg as ClipboardEvent;
            if ((document.activeElement == textArea || document.activeElement == n) && !screen.scriptIsRunning) {
		eventLogger.debug("Paste, box region start=(" + screen.Sl + "," + screen.Tl +
		    "), end=(" + screen.yl + "," + screen.Rl + ")");
		event.stopPropagation();
		eventLogger.debug("PASTE: Found types: "+event.clipboardData?.types);
		let l = (event.clipboardData ? event.clipboardData.getData("text/plain") : "");
		l = screen.cleanString(l);
		if (l && !0 === screen.paste(l)) {
		    event.preventDefault();
		}
		postEventCleanup();
            }
	});
	var a = this; // note that screen/i already has "this"
	var focusLost = function(event:any){
	    a.Qn &= 256;
	    if (a.renderer){
		a.renderer.hasFocus = !1;
		eventLogger.info("Terminal focus lost");
		a.renderer.ml();
	    }
	}
	var focusGained = function(event:any){
	    if (a.renderer){
		a.renderer.hasFocus = !0;
		eventLogger.info("Terminal gained focus");
		a.renderer.ml();
	    }
	}
	if (textArea){ // factoring null from type, God Bless Typescript
	    if (("Firefox" == navigator.appName || "Netscape" == navigator.appName) && parseInt(navigator.appVersion, 10) < 52){
		textArea.addEventListener("blur", focusLost);
		textArea.addEventListener("focus",focusGained);
	    } else {
		textArea.addEventListener("focusout",focusLost);
		textArea.addEventListener("focusin", focusGained);
	    }
	    textArea.addEventListener("compositionstart", function (eventArg:any) {
		let event:CompositionEvent = eventArg as CompositionEvent;
		eventLogger.debug("Compositionstart: "+event);
		screen.qn = true; // NEEDSWORK .qn
		if (!screen.scriptIsRunning){
		    postEventCleanup();
		    var n = Math.floor(screen.cursorPos / screen.width), // NEEDSWORK, small "kl/cursorPos" not declared at this level
                    e = Math.floor(screen.cursorPos % screen.width); // NEEDSWORK, is "this" really the screen??
		    let renderer = screen.renderer;
		    if (renderer && textArea && textArea.style){
			textArea.style.top = n * (renderer.charHeight/ renderer.scaleV) + "px";  // NEEDSWORK .Bt Lt 
			textArea.style.left = e * (renderer.charWidth / renderer.scaleH) + "px";
		    } else {
			eventLogger.warn("compositionStart received by screen with no renderer or textArea");
		    }
		}
	    });
	    textArea.addEventListener("compositionupdate", function (eventArg:any) {
		let event:CompositionEvent = eventArg as CompositionEvent;
		eventLogger.debug("Compositionupdate: data=" + event.data);
		screen.qn = true; // NEEDSWORK
		if (!screen.scriptIsRunning){
		    compositionData = event.data;
		    screen.Kl.fill(null);  // NEEDSWORK .Kl
		    screen.ve(compositionData); // NEEDSWORK .ve
		}
	    });
	    textArea.addEventListener("compositionend", function (eventArg:any) {
		let event:CompositionEvent = eventArg as CompositionEvent;
		eventLogger.debug("Compositionend: " + JSON.stringify(event) + ", data=" + event.data);
		screen.qn = false;
		if (!screen.scriptIsRunning){
		    screen.Kl.fill(null); // NEEDSWORK .Kl
		    if (compositionData){
			screen.autotype(compositionData); // GURU note one arg as opposed to prototype
			if (textArea){ // I don't know why typescript thinks this can be null
			    textArea.value = "";
			    textArea.style.top = "0px";
			    textArea.style.left = "0px";
			}
		    }
		}
	    });
	    // GURU why close the connection only on textArea unload, what about the rest of the world?
	    textArea.addEventListener("unload", function (event) {
		screen.closeConnection(4e3, "Terminal Closed"); // JOE - maybe something more specific
	    });
	    textArea.addEventListener("wheel", function (eventArg:any) {
		let event:WheelEvent = (eventArg as WheelEvent); // a subclass of MouseEven;
		if (screen.scriptIsRunning){
		    eventLogger.debug("Script in progress: rejecting wheel event");
		    event.stopPropagation();
		    event.preventDefault();
		} else {
		    screen.handleWheel(event); // NEEDSWORK .pe
		}
	    }),
	    textArea.addEventListener("keydown", function (eventArg:any) {
		let event:KeyboardEvent = eventArg as KeyboardEvent;
		if (screen.scriptIsRunning){
		    eventLogger.debug("Script in progress: rejecting keydown");
		    event.stopPropagation(), event.preventDefault();
		} else if (!screen.qn){ // NEEDSWORK .qn
		    if (textArea){ // I don't know why typescript thinks this can be null
			textArea.value = "";
		    }
		    eventLogger.debug("Keydown: "+event);
		    Utils.keyboardLogger.debug("Keydown: "+event);
		    screen.keyDownAndPressHandlerInternal(event); 
		}
	    });
	    textArea.addEventListener("keyup", function (eventArg:any) {
		let event:KeyboardEvent = eventArg as KeyboardEvent;
		if (screen.scriptIsRunning){
		    eventLogger.debug("Script in progress: rejecting keyup");
		    event.stopPropagation();
		    event.preventDefault();
		} else {
		    postEventCleanup();
		    if (!screen.qn){
			screen.keyUpHandlerInternal(event);
		    }
		}
	    });
	    textArea.addEventListener("keypress", function (eventArg:any) {
		let event:KeyboardEvent = eventArg as KeyboardEvent;
		if (screen.scriptIsRunning){
		    eventLogger.debug("Script in progress: rejecting keypress");
		    event.stopPropagation();
		    event.preventDefault();
		} else if (screen.Xn){
		    eventLogger.debug("Screen locked by error occurrence");
		    event.stopPropagation();
		    event.preventDefault();
		} else if (!screen.qn){
		    if (textArea){ // I don't know why typescript thinks this can be null
			textArea.value = "";
		    }
		    eventLogger.debug("Keypress: "+event);
		    Utils.keyboardLogger.debug("Keypress: "+event);
		    screen.keyDownAndPressHandlerInternal(event);
		    event.stopPropagation();
		    event.preventDefault();
		}
	    });
	    // establish
	    if (this.zi.isAndroid || this.zi.isIOS){
		textArea.addEventListener("input", function () { // no event object, hmmm
		    if (textArea){
			eventLogger.debug("Input event seen. value=" + textArea.value +
			    ", textContent=" + textArea.textContent);
		    } else {
			eventLogger.debug("Input event seen. Without textArea!!!");
		    }
		    if (screen.scriptIsRunning){
			eventLogger.debug("Script in progress: rejecting input");
		    } else if (screen.Xn){
			eventLogger.debug("Screen locked by error occurrence: rejecting input");
		    } else {
			postEventCleanup();
			if (textArea){ // I don't know why typescript thinks this can be null
			    var text = textArea.value;
			    if (text) {
				textArea.value = "";
				eventLogger.debug("Input was " + text);
				eventLogger.debug("Textcontent is now " + textArea.value);
				for (var cc = 0; cc < text.length; cc++) {
				    screen.Zi(text.charAt(cc));
				}
			    } else {
				eventLogger.debug("Empty input event ignored.");
			    }
			}
		    }
		});
	    }			     			     
	    textArea.addEventListener("mouseup", function (eventArg:any) {
		let event:MouseEvent = (eventArg as MouseEvent);
		if (screen.scriptIsRunning){
		    eventLogger.debug("Script in progress: rejecting mouseup");
		} else {
		    eventLogger.debug("mouse event " + event + " target=" + event.target);
		    let targetElement:HTMLElement = event.target as HTMLElement;
		    targetElement.focus();
		    screen.handleMouseUp(event);
		}
	    });
	    textArea.addEventListener("mousedown", function (eventArg:any) {
		let event:MouseEvent = (eventArg as MouseEvent);
		if (screen.scriptIsRunning){
		    eventLogger.debug("Script in progress: rejecting mousedown");
		} else {
		    eventLogger.debug("mouse event " + event + " target=" + event.target);
		    let targetElement:HTMLElement = event.target as HTMLElement;
		    targetElement.focus();
		    screen.handleMouseDown(event);
		}
	    });
	    textArea.addEventListener("mouseenter", function (eventArg:any){
		let event:MouseEvent = (eventArg as MouseEvent);
		eventLogger.debug2("mouse event " + event + " target=" + event.target);
		if (textArea){
		    if (!screen.qn && textArea && textArea.value.length > 0){
			textArea.value = "";
			textArea.selectionEnd = 0;
			textArea.selectionStart = 0;
		    }
		}
	    });
	    textArea.addEventListener("mousemove", function (eventArg:any){
		let event:MouseEvent = (eventArg as MouseEvent);
		if (screen.scriptIsRunning) {
		    eventLogger.debug2("Script in progress: rejecting mousemove");
		} else {
		    eventLogger.debug2("mouse event " + event + " target=" + event.target);
		    let targetElement:HTMLElement = event.target as HTMLElement;
		    targetElement.focus();
		    screen.handleMouseMove(event);
		}
	    });
	    textArea.addEventListener("click", function (eventArg:any) {
		let event:MouseEvent = (eventArg as MouseEvent);
		if (screen.scriptIsRunning){
		    eventLogger.warn("Script in progress: rejecting click");
		    event.stopPropagation();
		} else {
		    eventLogger.debug("click event " + event + " target=" + event.target);
		    let targetElement:HTMLElement = event.target as HTMLElement;
		    targetElement.focus();
		    screen.handleClicksInternal(event);
		}
	    });
	    textArea.addEventListener("dblclick", function (eventArg:any) {
		let event:MouseEvent = (eventArg as MouseEvent);
		if (screen.scriptIsRunning){
		    eventLogger.warn("Script in progress: rejecting dblclick");
		    event.stopPropagation();
		} else if (screen.Xn){
		    eventLogger.warn("Screen locked by error occurrence: rejecting dblclick");
		    event.stopPropagation();
		} else {
		    event.stopPropagation();
		    eventLogger.debug("dblclick event " + event + " target=" + event.target);
		    if (!0 === screen.jn){ // NEEDSWORK .jn
			eventLogger.debug("dblclick set drag to false");
			(screen.jn = !1),
			clearTimeout(screen.ee); // NEEDSWORK .ee
		    }
		    let targetElement:HTMLElement = event.target as HTMLElement;
		    targetElement.focus();
		    screen.handleClicksInternal(event); 
		}
	    });
	    textArea.addEventListener("contextmenu", function (eventArg:any) {
		let event:MouseEvent = (eventArg as MouseEvent);
		screen.jn = false; // NEEDSWORK .jn 
		screen.mouseIsDown = false;
		if ((screen.contextRightClick && event.shiftKey)||
		    (!screen.contextRightClick && !event.shiftKey)){
		    if (screen.scriptIsRunning) {
			eventLogger.debug("Script in progress: rejecting contextmenu");
			event.stopPropagation();
		    } else {
			eventLogger.debug("mouse event " + event + " target=" + event.target);
			let targetElement:HTMLElement = event.target as HTMLElement;
			targetElement.focus();
			screen.handleContextMenu(event); // NEEDSWORK .Ae
		    }
		} else if (null != screen.Sl && null != screen.yl) { // NEEDSWORK .Sl .yl
		    let textArea = screen.textAreaOverlay;
		    // GURU - this code seems crazy inserting a "c"
		    if (textArea){
			if (0 == textArea.value.length){
			    textArea.value = "c";
			}
			textArea.select();
		    }
		}
	    });
	}
	if (selectionCanvas){
	    selectionCanvas.addEventListener("click", function (eventArg:any) {
		let event:MouseEvent = (eventArg as MouseEvent);
		if (screen.scriptIsRunning){
		    eventLogger.debug("Script in progress: rejecting click");
		    event.stopPropagation();
		} else {
		    event.stopPropagation();
		    eventLogger.debug("click event " + event + " target=" + event.target);
		    let targetElement:HTMLElement = event.target as HTMLElement;
		    targetElement.focus();
		    screen.handleClicksInternal(event);
		}
	    });
	}
    }
}


export class BaseRenderer {   // minified as Ea
    canvas:HTMLElementOrNull;
    screen:VirtualScreen;

    yt:number; // i have no idea what this is yet
    Ct:number; // ditto
    Pt:number; // ditto
    Nt:number; // ditto
    
    font:any;
    fontSize:number;
    fontFamily:string;
    fontsNOTReady:boolean; // weird, but hey...
    unicodeTable:any;
    nl?:string;  // some DBCS font thing
    scaleH:number;
    scaleV:number;
    activeWidth:number;
    activeHeight:number;
    charWidth:number;
    charHeight:number;
    ascent:number;
    descent:number;
    leading:number;
    Qt:number;
    jt:number;
    Vt:number;
    Kt:any; // this is one F-ed up polymorphic beast
    hasFocus:boolean;

    // are these 4 colors as RGB values??
    qt:number;
    Jt:number;
    Zt:number;
    Xt:number;

    Yt:number;

    background:number; // I hope that as a color it's never not a number, but...

    scaleMethod:number;
    timerDelay:number;
    timerIntervalID:any;
    otherTimerIntervalID:any;

    selectionCTX:CanvasRenderingContext2D|null;
    Bl:boolean;
    Ml:any; // because of weird type polymorphism seen, but not understood, and perhaps not intentional in code
    Ul?:number; // this is used as a setInterval timeout amount, when it exists. FML.

    cl:any;  // font scaling stuff - heinous polymorphism abounds in its use
    fl:any;  // font scaling stuff - heinous polymorphism abounds in its use

    constructor(virtualScreen:VirtualScreen, unicodeTable:any){
	this.canvas = virtualScreen.canvas;
	this.screen = virtualScreen; // minified as Rt
	this.yt = -1;
	this.Ct = -1;
	this.Nt = -1;
	this.Pt = -1;
	this.font = null;
	this.fontSize = Number(BaseRenderer.fontSize);
	this.fontFamily = ((virtualScreen.Ft && virtualScreen.Ft.pt) ?       // minified as pt
			   virtualScreen.Ft.pt :
			   CharsetInfo.DEFAULT_FONT_FAMILY);
	Utils.coreLogger.debug("virtualScreen = " + virtualScreen);
	this.nl = virtualScreen.getCharsetInfo().font;
	Utils.coreLogger.debug("charsetInfo: font(nl)=" + this.nl); // virtualScreen.It not in base VirtualScreen , hope it's in 3270
	this.fontsNOTReady = true; // this.Dt = true; // boolean a backwards boolean, go figure
	this.scaleH = 1; // min'd as this.xt = 1;
	this.scaleV = 1; // min'd as this.Ot = 1;
	this.activeWidth = -1; // this.Ut = -1;
	this.activeHeight = -1; // this.Mt = -1;
	this.charWidth = 1;  // this.Lt = 1;
	this.charHeight = 1; // this.Bt = 1;
	this.ascent = 1; // this._t = 1;  // charAscent   from debug string
	this.descent = 0; // was this.rl
	this.leading = 0; // this.Wt = 0;  // charLeading, from debug string  // see "rl" too but not in Ea, hmmm
	this.Qt = 0;
	this.unicodeTable = unicodeTable; // was this.Gt
	this.jt = 0;
	this.Vt = 3;
	this.Kt = true;
	this.hasFocus = virtualScreen.hasFocus();
	this.Yt = 0;
	this.background = 0;
	this.qt = 0xFFFFFF; // 16777215;
	this.Jt = 0xFFFFFF; //16777215;
	this.Zt = 0xFFFFFF; // 16777215;
	this.Xt = 0xFFFFFF; // 16777215;
	this.scaleMethod = 1;
	this.timerDelay = 500; // this.zt = 500;
	this.timerIntervalID = null; // this.$t = null;
	this.otherTimerIntervalID = null;  // this.tl
	if (3 == this.Vt && this.timerDelay >= 100) {
	    this.ll();
	}
	// Undeclareds
	this.selectionCTX = null; // this.dl;
	this.cl; // x scale as given to canvas.ctx
	this.fl; // y scale as given to canvas.ctx
	this.nl; // a secondary font family, for asian/DBCS fonts???
	this.Bl = false;
    }
    
    static fontWeight = "normal";
    static fontStyle = "normal";
    static fontSize = 10;
    static fontFamily = CharsetInfo.DEFAULT_FONT_FAMILY; // so goofy that both static and instance, but whatever

    /* static methods for utility drawing global functions */

    static useWebColorSpec(colorSpec:string, defaultSpec?:string):string {
	if (colorSpec.match(/^#([a-fA-F0-9]){6}/)) {
	    let rgbValue = parseInt(colorSpec.substring(1, 7), 16);
            return "rgb(" + (rgbValue >> 16) + "," + ((rgbValue >> 8) & 255) + "," + (255 & rgbValue) + ")";
	} else if (colorSpec.match(/^rgb\((?:\d{1,3},){2}\d{1,3}\)/)){
	    return colorSpec;
	} else {
	    Utils.renderLogger.warn("Webcolor: bad web color spec, using default!" + colorSpec);
	    return defaultSpec || "rgb(200,60,150)"; // a crazy pink if no default
	}
    }

    static setFillColor(ctx:CanvasRenderingContext2D, opt1:any, opt2?:any, opt3?:any, opt4?:any){ // da = function (t, l, n, i, e) {
	let logger = Utils.colorLogger;
        logger.debug3("setFillColor() was=" + ctx.fillStyle +
		      " arg.length=" + arguments.length);
	let argsLength = 2;
	if (opt2) argsLength++;
	if (opt3) argsLength++;
	if (opt4) argsLength++;
	switch (argsLength){
	case 2:
	    ctx.fillStyle = ("rgb(" + ((opt1 & 0xFF0000) >> 16) +
			     "," +((opt1&0xFF00) >> 8) +
			     "," + (opt1&0xFF) + ")");
	    break;
	case 3:
	    logger.warn("setFillColor is not supposed to get 3 arguments");
	    ctx.fillStyle = BaseRenderer.useWebColorSpec(opt1,"rgb(64,64,64)"); // dark gray
	    break;
	case 4:
	    ctx.fillStyle = "rgb(" + opt1 + "," + opt2 + "," + opt3 + ")";
	    break;
	case 5:
	    ctx.fillStyle = "rgba(" + opt1 + "," + opt2 + "," + opt3 + "," + opt4 + ")";
	    break;
	default:
	    ctx.fillStyle = BaseRenderer.useWebColorSpec(opt1,"rgb(64,64,64)"); // dark gray
	    break;
	}
        logger.debug3("Set fill color. New color=" + ctx.fillStyle);
    }

    static setStrokeColor(ctx:CanvasRenderingContext2D, opt1:any, opt2?:any, opt3?:any, opt4?:any){ // wa = function (t, l, n, i, e) {
	let logger = Utils.colorLogger;
        logger.debug3("setStrokeColor() was=" + ctx.strokeStyle +
	    " arg.length=" + arguments.length);
	let argsLength = 2;
	if (opt2) argsLength++;
	if (opt3) argsLength++;
	if (opt4) argsLength++;
	switch (argsLength){
	case 2:
	    ctx.strokeStyle = ("rgb(" + ((opt1 & 0xFF0000) >> 16) +
			     "," +((opt1&0xFF00) >> 8) +
			     "," + (opt1&0xFF) + ")");
	    break;
	case 3:
	    logger.warn("setStrokeColor is not supposed to get 3 arguments");
	    ctx.fillStyle = BaseRenderer.useWebColorSpec(opt1,"rgb(160,160,160)"); // lightish gray
	    break;
	case 4:
	    ctx.strokeStyle = "rgb(" + opt1 + "," + opt2 + "," + opt3 + ")";
	    break;
	case 5:
	    ctx.strokeStyle = "rgba(" + opt1 + "," + opt2 + "," + opt3 + "," + opt4 + ")";
	    break;
	default:
	    ctx.strokeStyle = BaseRenderer.useWebColorSpec(opt1,"rgb(160,160,160)"); // lightish gray
	    break;
	}
        logger.debug3("setStrokeColor(), now=" + ctx.strokeStyle);
    }

    setGlobalAlpha(ctx:CanvasRenderingContext2D, alphaValue:number):void { // va = function (t, l) {
        ctx.globalAlpha = alphaValue;
    }

    // full circle
    static pa(ctx:CanvasRenderingContext2D,
	      x:number,
	      y:number,
	      radius:number):void {
        ctx.beginPath();
	ctx.arc(x, y, radius, 0, 6.29, false);
	ctx.closePath();
	ctx.fill();
    }

    // arc - portion of circle
    static Aa(ctx:CanvasRenderingContext2D,
	      x:number, y:number,
	      radius:number,
	      startAngle:number,
	      endAngle:number):void {
        ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.arc(x, y, radius, startAngle, endAngle, false);
	ctx.closePath();
	ctx.fill();
    }

    static drawCharArraySlice(ctx:CanvasRenderingContext2D,
			      unicodeLine:any[],
			      offset:number,
			      len:number,
			      x:number,
			      y:number):void { //    ba = function (t, l, n, i, e, s) {
        let unicodeString:string = String.fromCharCode.apply(null, unicodeLine.slice(offset,offset+len));
        Utils.renderLogger.debug3("Draw chars at canvas px(" + x + "," + y + ") runLength=" + len +
				  " lineBuffer start=" + offset + " text=" + unicodeString);
	ctx.fillText(unicodeString, x, y);
    };

    // weird draw line variant 
    static ga(ctx:CanvasRenderingContext2D,
	      l:number, n:number, i:number, e:number):void {
	Utils.renderLogger.debug("Draw line (2) from (" + l + "," + n + ") to (" + i + "," + e + ")");
	ctx.beginPath();
	let savedFillStyle = ctx.fillStyle;
	ctx.fillStyle = ctx.strokeStyle;
	var u = Math.sqrt((i - l) * (i - l) + (e - n) * (e - n)),
	    h = i - l,
	    r = e - n,
	    a = Math.atan(r / (0 == h ? 0.01 : h)) + (h < 0 ? Math.PI : 0);
	for (var o = 0; o < u; o++){
            ctx.fillRect(Math.round(l + Math.cos(a) * o), Math.round(n + Math.sin(a) * o), 1, 1);
	}
	ctx.stroke();
	ctx.fillStyle = savedFillStyle;
    }
    
    static drawLine(ctx:CanvasRenderingContext2D,
		    x1:number, y1:number, x2:number, y2:number):void {
	Utils.renderLogger.debug("Draw line from (" + x1 + "," + y1 + ") to (" + x2 + "," + y2 + ")");
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
    };


    // GURU where is this called if anywhere
    // it looks like "t" is a BaseRenderer, or a pile of defaults
    el(t:any){ // Ea.prototype.el = function (t) {
	let logger = Utils.renderLogger;
        if (t) {
            if ((logger.debug("Setting font properties="+t), t.size && null !== t.size)) {
                let l = Number(t.size);
                this.fontSize = l;
		BaseRenderer.fontSize = l;
            }
            t.scaleMethod && null !== t.scaleMethod && ((this.scaleMethod = t.scaleMethod), 1 == this.scaleMethod && (BaseRenderer.fontSize = 10)), this.sl(), this.fullPaint();
        }
    }

    static defaultLeading = 0; // was global "ha"
    
    calculateCharDimensions(ctx:CanvasRenderingContext2D,
			    pixelSize:number,
			    fontName:string,
			    sampleChar:string):any { // Ea.prototype.hl = function (t, l, n, i) {
        ctx.font = BaseRenderer.fontStyle + " " + BaseRenderer.fontWeight + " " + pixelSize + "px " + fontName;
        var textMetrics = ctx.measureText(sampleChar); // W3 defines measureText() and textMetrics return val
        this.leading = BaseRenderer.defaultLeading;
	this.ascent = 0.85 * pixelSize;
	this.descent = pixelSize - (this.leading + this.ascent);
	this.Qt = this.ascent + this.leading;
        return { width: textMetrics.width, height: pixelSize };
    }

    static il = 2; // GURU what is this
    
    al():number{ // Ea.prototype.al = function () {
        return this.screen.oiaEnabled ? this.screen.height + BaseRenderer.il : this.screen.height;
    }
    
    setFontInformation(canvas:HTMLCanvasElement,
		       ctx:CanvasRenderingContext2D):void{ // Ea.prototype.ol = function (t, l) {
	let logger = Utils.scalingLogger;
        var n; // holds a "box"
        // var i = canvas.width;  -- these are underused and superfluous
        // var e = canvas.height;
        var screen = this.screen; // was s
	var fontSize; // was r
	this.fontsNOTReady = true;  // NEEDSWORK .Dt
	this.activeWidth = 0;
	this.activeHeight= 0;
	this.cl = "1";
	this.fl = "1";
	logger.debug("Calculate font for canvas w=" + canvas.width + ",h=" + canvas.height);
        if (this.scaleMethod == 0){
	    // walk fontSize down until we can fit in a line of text at 80/132/whatever columns
            for (logger.debug("Calculating for scaleMethod=ratio"), fontSize = 50; fontSize > 4; fontSize--) {
                var u = (n = this.calculateCharDimensions(ctx, fontSize, this.fontFamily, "M")).width * screen.width;
                var h = n.height * this.al();  // NEEDSWORK .al
		logger.debug("At font size=" + fontSize + ", need w=" + u + ",h=" + h);
                if (u <= canvas.width && h <= canvas.height) {
                    logger.debug("Found size match. Chose font size =" + fontSize +
				 " for canvas w=" + canvas.width + ",h=" + canvas.height +
				 " ascent=" + this.ascent + ", descent=" + this.descent + " leading=" + this.leading);
                    this.fontsNOTReady = false;
                    this.charWidth = n.width;
                    this.charHeight = n.height;
                    this.font = BaseRenderer.fontStyle + " " + BaseRenderer.fontWeight + " " + fontSize + "px " + this.fontFamily;
                    this.activeWidth = u;
                    this.activeHeight = h;
                    break;
                }
            }
        }else if (1 == this.scaleMethod) {
            logger.debug("Calculating for scaleMethod=fit");
	    fontSize = 10;
	    n = this.calculateCharDimensions(ctx, fontSize, this.fontFamily, "M");
	    this.fontsNOTReady = false; 
	    this.charWidth = n.width;
	    this.charHeight = n.height;
	    this.font = BaseRenderer.fontStyle + " " + BaseRenderer.fontWeight + " " + fontSize + "px " + this.fontFamily;
	    // JOE: The full horror of the next 6 lines of code is hard to quantify
	    //      It's the stuff that makes JS programmers seem like witchdoctors
	    let a:any = canvas.width / (screen.width * n.width);
            let o:any = canvas.height / (this.al() * n.height); // NEEDSWORK .al
            a = (parseInt((10 * a)+"") / 10).toFixed(1);
            o = (parseInt((10 * o)+"") / 10).toFixed(1);
            this.scaleH = 1 / a;
            this.scaleV = 1 / o;
            this.activeWidth = canvas.width * this.scaleH;
            this.activeHeight = canvas.height * this.scaleV;
            ctx.scale(a, o);
            this.cl = a;
            this.fl = o;
	    let selectionCTX = this.getSelectionCTXOrFail();
            selectionCTX.setTransform(1, 0, 0, 1, 0, 0),
            selectionCTX.scale(a, o),
            logger.debug("Scaled for font size=" + fontSize +
			 ", canvas w=" + canvas.width + ",h=" + canvas.height +
			 " ascent=" + this.ascent +
			 ", descent=" + this.descent +
			 " leading=" + this.leading),
            logger.debug("Scale factors are: sfX=" + this.scaleH + ", sfY=" + this.scaleV +
			 ", aH=" + this.activeHeight + ", aW=" + this.activeWidth + ", sW=" + a + ", sH=" + o);
        } else {
            logger.debug("Calculating for scaleMethod=no scale"),
            fontSize = BaseRenderer.fontSize;
            n = this.calculateCharDimensions(ctx, fontSize, this.fontFamily, "M");
            this.fontsNOTReady = false;
            this.charWidth = n.width;
            this.charHeight = n.height;
            this.font = BaseRenderer.fontStyle + " " + BaseRenderer.fontWeight + " " + fontSize + "px " + this.fontFamily;
            this.scaleH = 1;
            this.scaleV = 1;
            this.activeWidth = canvas.width;
            this.activeHeight = canvas.height;
            ctx.scale(1,1); // "1", "1"); // JOE - why were there strings here?
	    let selectionCTX = this.getSelectionCTXOrFail();
            selectionCTX.setTransform(1, 0, 0, 1, 0, 0);
            selectionCTX.scale(1,1); // "1", "1"); // JOE - why were there strings here?
            logger.debug("Scaled for font size=" + fontSize +
			 ", canvas w=" + canvas.width + ",h=" + canvas.height +
			 " ascent=" + this.ascent +
			 ", descent=" + this.descent +
			 " leading=" + this.leading);
	}
        if (this.nl && this.fontFamily != this.nl) {
	    logger.debug("Determining font size for DBCS=" + this.nl);
		// GURU, why would r/fontSize  have a value here??
            var c = this.calculateCharDimensions(ctx, fontSize, this.nl, "M"),  // NEEDSWORK .nl
                f = this.calculateCharDimensions(ctx, fontSize, this.nl, "䭺");
            logger.debug("SBCS box=" + JSON.stringify(n) +
			 " dbcsBox=" + JSON.stringify(c) +
			 " testSymbolBox=" + JSON.stringify(f));
        }
    }
    
    // drawChars // Ea.prototype.wl = function (t, l, n, i, e, s) {
    wl(ctx:CanvasRenderingContext2D,
       l:number[],  // ebcdic codes, or similar, not a string yet!
       n:number,
       i:number,
       e:number,
       s:number):void { 
	let logger = Utils.renderLogger;
        let u = [];
        const h = this.qt;
	let charPosColor = h;
        let r = charPosColor;
        let a:number = 0;
        for (let o:number = 0; o < i; o++) {
            let c:any = l[n + o];
            switch (o) {
            case 0:
                charPosColor = h;
                break;
            case 8:
                7 === c && ((charPosColor = this.Jt), (c = 32));
                break;
            case 25:
                charPosColor = h;
                break;
            case 50:
                charPosColor = this.Zt;
                break;
            case 52:
            case 79:
                charPosColor = h;
            }
            if ((u.push(c), r != charPosColor)) {
                let theString:string = String.fromCharCode.apply(null, u);
                BaseRenderer.setFillColor(ctx, r);
		ctx.fillText(theString, e + a, s);
		logger.debug3("Draw chars at canvas px(" + e + "," + s + ") runLength=" +
		    i + " lineBuffer start=" + n + " text=" + l);
		a = (o + 1) * this.charWidth;
		u = [];
		r = charPosColor;
            }
        }
        if (u.length > 0) {
            let l = String.fromCharCode.apply(null, u);
            BaseRenderer.setFillColor(ctx, r), ctx.fillText(l, e + a, s), logger.debug3("Draw chars at canvas px(" + e + "," + s + ") runLength=" + i + " lineBuffer start=" + n + " text=" + l);
        }
    }
	
    initLineArrays(unicodes:number[], renderingFlags:number[], colors:number[], width:number):void { // Ea.prototype.vl = function (t, l, n, i) {
	for (var i = 0; i < width; i++){
	    unicodes[i] = 0x20;
	    renderingFlags[i] = 0;
	    colors[i] = 0;
	}
    }
    
    pl(t:number[], l:number, n:number):number{ // Ea.prototype.pl = function (t, l, n) {
        for (var i = l; i < n; i++) if (t[i] > 32) return i;
        return -1;
    }

    static ea:number = 0x8800FF00;  // is this a color, or what, hm

    // arg "s" is either an array or a number, call site is weird
    Al(t:any[], l:any[], n:any[], i:number, e:number, s:any):number { // Ea.prototype.Al = function (t, l, n, i, e, s) {
	let h = t[i];
	let r = s ? s[i] : null;
	let a = l[i];
        for (var u = i + 1;
	     u < e && (h == BaseRenderer.ea ? t[u] == BaseRenderer.ea : h == t[u]) && a == l[u] && (!s || r == s[u]); )
	    u++;
        return u - i;
    }
    
    clear():void{ // (Ea.prototype.clear = function () {
        let screen:VirtualScreen = this.screen;
	let canvas:HTMLCanvasElement = screen.getCanvasOrFail();
        let ctx:CanvasRenderingContext2D|null = canvas.getContext("2d");
	if (ctx){ // ain't gonna be false, but lib.dom.d.ts thinks it might be
            let w = canvas.width;
            let h = canvas.height;
	    Utils.renderLogger.debug("Renderer.clear pxWidth=" + w + " pxHeight=" + h + " inactiveFill=0x404040");
	    BaseRenderer.setFillColor(ctx, 0x404040);
	    ctx.fillRect(0, 0, w, h);
	    BaseRenderer.setFillColor(ctx, this.background);
	    ctx.fillRect(0, 0, this.activeWidth, this.activeHeight);
	}
        if (screen.selectionCanvas){
            let ctx2 = screen.selectionCanvas.getContext("2d");
	    if (ctx2){ // ain't gonna be false
		BaseRenderer.setFillColor(ctx2, this.background);
		ctx2.fillRect(0, 0, screen.selectionCanvas.width, screen.selectionCanvas.height);
	    }
	}
    }
    
    // SL is some sort of Canvas reset thing 
    sl():void{ // (Ea.prototype.sl = function () {
	let ctx = this.screen.getCanvasOrFail().getContext("2d");
	if (ctx){
	    ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
	if (this.screen.selectionCanvas){ 
	    let ctx2 = this.screen.selectionCanvas.getContext("2d");
	    if (ctx2){
		ctx2.setTransform(1, 0, 0, 1, 0, 0);
	    }
	}
	this.scaleH = 1;
	this.scaleV = 1;
	this.yt = -1; // was 0 in constructor, what does this mean
    }
    
    gl(t:number,l:number):any{ // Ea.prototype.gl = function (t, l) {
        return (
            this.screen.canvas,
            this.screen,
            1 == this.scaleMethod && ((t *= this.scaleH), (l *= this.scaleV)),
            (t >= this.activeWidth|| l >= this.activeHeight) && Utils.renderLogger.debug("canvasX or canvasY is greater than activeWidth or activeHeight"),
            { rows: Math.floor(l / this.charHeight), columns: Math.floor(t / this.charWidth) }
        );
    }

    getSelectionCTXOrFail():CanvasRenderingContext2D{
	if (this.selectionCTX){
	    return this.selectionCTX;
	} else {
	    throw "Renderer has no selectionCTX Canvas 2D context";
	}
    }

    // clearing selection canvas, and then drawing what?? 
    ml(){ // Ea.prototype.ml = function () {
        let screen = this.screen;
        let canvas:HTMLCanvasElement = screen.getCanvasOrFail();
        var ctx:CanvasRenderingContext2D = this.getSelectionCTXOrFail();
        ctx.font = this.font;
        BaseRenderer.setFillColor(ctx, 255, 255, 255, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, this.activeWidth, this.activeHeight);
        if ((this.hasFocus === true) &&
	    (3 != this.Vt || 0 == this.timerDelay || 1 == this.Kt) &&
	    (this.Vt > 0)){
	    this.showTheCursor(ctx, screen.cursorPos);
	}
        if (null != screen.Sl &&
	    null != screen.Tl &&
	    null != screen.Rl &&
	    null != screen.yl){
	    this.Cl(screen.Sl, screen.Tl, screen.yl, screen.Rl);
	}
        if (1 == screen.oiaEnabled){
            this.Nl(ctx, screen, function () {
                screen.Pl();
            });
	}
    }
    
    // drawOIA
    Nl(ctx:CanvasRenderingContext2D, screen:VirtualScreen, callAfter:any):void{ // Ea.prototype.Nl = function (t, l, n) {
        let canvas:HTMLCanvasElement = screen.getCanvasOrFail();
        var lineWidthSave:number = ctx.lineWidth;
        ctx.beginPath();
	BaseRenderer.setStrokeColor(ctx, this.qt);
	ctx.lineWidth = 5 * this.scaleV;
        var s = canvas.height * this.scaleV + -1.5 * this.charHeight;
        ctx.moveTo(0, s), ctx.lineTo(this.activeWidth - 12, s);
        var u = screen.getOIAArray(),
            h = canvas.height * this.scaleV + -0.25 * this.charHeight;
        this.wl(ctx, u, 0, screen.width, 0, h),
	ctx.closePath(), ctx.stroke();
	ctx.lineWidth = lineWidthSave;
	if (callAfter) {
	    callAfter.call(this);
	}
    }

    // drawSelectionBox
    Cl(t:number, l:number, n:number, i:number):void{ // Ea.prototype.Cl = function (t, l, n, i) {
        if (t != n && l !== i) {
            (l = l > i ? l + 1 : l), (t = t > n ? t + 1 : t);
            var e = Math.min(t, n),
                s = Math.max(t, n),
                u = Math.min(l, i),
                h = Math.max(l, i);
            Utils.renderLogger.debug("drawSelectionBox selectionStartColumn=" + t + " selectionStartRow=" + l + " selectionEndColumn=" + n + " selectionEndRow=" + i);
            let screen:VirtualScreen = this.screen;
            let ctx2 = screen.selectionCanvas?.getContext("2d");
	    if (ctx2){
		ctx2.beginPath();
		this.Dl(e, u, s, h, ctx2, screen.canvas?.getContext("2d"));
		ctx2.closePath();
	    }
        }
    }
    
    xl(){ // (Ea.prototype.xl = function () {
	clearTimeout(this.timerIntervalID),
	1 != this.Kt && ((this.Kt = !0), this.ml()),
	3 == this.Vt && this.timerDelay >= 100 && this.ll();
    }
    
    ll(){ // (Ea.prototype.ll = function () {
	var renderer = this;
	this.timerIntervalID = setInterval(function () {
            (renderer.Kt = !renderer.Kt);
	    if (!0 === renderer.hasFocus){
		renderer.ml();
	     }
	}, this.timerDelay);
    }
    
    
    Ol(){ // (Ea.prototype.Ol = function () {
	 clearTimeout(this.otherTimerIntervalID);
	if (1 != this.Ml){ // more shitty type polymorphism here!
	    this.Ml = true;
	    this.fullPaint();
	    if (this.Ul && this.Ul >= 100){
		this.Ll();
	    }
	}
    }
    
    Ll(){ // (Ea.prototype.Ll = function () {
	var renderer = this;
	this.otherTimerIntervalID = setInterval(function () {
            if (renderer.Bl){
		(renderer.Ml = !renderer.Ml),
		renderer.fullPaint();
	    }
	}, this.Ul);
    }

    // was El()
    showTheCursor(ctx:CanvasRenderingContext2D, n:number){ // Ea.prototype.El = function (t, n) {
        if (-1 !== n) {
            var i:VirtualScreen = this.screen;
	    var canvas:HTMLCanvasElement = i.getCanvasOrFail();
            var e:number = this.charHeight;
            var s:number = this.charWidth;
            var u:number = this.screen.inInsertMode ? 0.2 : 1;
            if (0 != i.width) {
                var h:number = Math.floor(n / i.width) + 1;
                var r:number = n % i.width;
                Utils.renderLogger.debug("show cursor pos=" + n + " at row=" + h + " column=" + r),
                ctx.beginPath(),
                BaseRenderer.setFillColor(ctx, this.Xt),
                1 == this.Vt
                    ? (BaseRenderer.setStrokeColor(ctx, this.Xt),
		       ctx.moveTo(r * s, (h - u) * e),
		       ctx.lineTo((1 + r) * s, (h - u) * e),
		       ctx.lineTo((1 + r) * s, h * e),
		       ctx.lineTo(r * s, h * e),
		       ctx.lineTo(r * s, (h - u) * e),
		       ctx.closePath(), ctx.stroke())
                    : (this.Dl(r, h - u, 1 + r, h, ctx, canvas.getContext("2d")), ctx.closePath());
            } else {
		Utils.coreLogger.info("CANNOT SHOW CURSOR screen.width==0\n");
	    }
        }
    }

    // does this really have two ctx args e, and ctx
    
    Dl(t:number, l:number, n:number, i:number, ctx2:any, ctx:any) { // Ea.prototype.Dl = function (t, l, n, i, e, s) {
        var u:number = this.charHeight;
        var h:number = this.charWidth;
        var r:number = t * h;
        var a:number = l * u;
        var o:number = n * h;
        var c:number = i * u;
        var f:number = (1 == this.scaleMethod) ? r / this.scaleH : r;
        var d:number = (1 == this.scaleMethod) ? a / this.scaleV : a;
        var w:number = (1 == this.scaleMethod) ? o / this.scaleH : o;
        var v:number = (1 == this.scaleMethod) ? c / this.scaleV : c;
        var p:number = Math.abs(f - w);
        var A = Math.abs(d - v);
        Utils.renderLogger.debug("scaledX=" + f + "scaledY=" + d + "width=" + p + "height=" + A);
	var b:any = ctx.getImageData(f, d, p, A);
        for (var g = 0; g < b.data.length; g += 4)
	    (b.data[g] = 255 - b.data[g]), (b.data[g + 1] = 255 - b.data[g + 1]),
	    (b.data[g + 2] = 255 - b.data[g + 2]), (b.data[g + 3] = 255);
        ctx2.putImageData(b, f, d);
    }
    
    fullPaint(){ // (Ea.prototype.ul = function () {
	Utils.superClassWarning("fullPaint");
    }
    
    handleResize(){ // (Ea.prototype.Wl = function () {
	Utils.coreLogger.debug("Renderer resize completed");
    }

}

