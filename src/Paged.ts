import { Utils } from "./utils.js";
import { VirtualScreen, TypeValuePair, CharacterAttributes, FieldData, OIALine, CharsetInfo, BaseRenderer } from "./generic.js";

export class ScreenElement { // was Io
    position:number;
    ebcdicChar:number;
    fieldData:FieldData|null;
    isGraphic:boolean; // was this.fn
    charAttrs:CharacterAttributes|null;
    isModified:boolean;
    inputChar:number;
    field:any;
    ai:boolean;
    pn:boolean;
    
    constructor(position:number,ebcdicChar:number,fieldData:FieldData|null){  // function Io(t, l, n) {
	this.position = position;
	this.ebcdicChar = ebcdicChar;
	this.fieldData = fieldData; // this.zl
	this.isGraphic = false;     // was this.fn
	this.charAttrs = null;      // was this.cn
	this.isModified = false;  // this.Hl = false;
	this.inputChar = -1; // minified as this.Yl = -1;
	this.field = null;   // minified as this.gn = null;
	this.ai = false;
	this.pn = false; // this is used in choosing a fallback color, but not sure what really means
    }

    match(ch:number, isGraphic:boolean):boolean{ // (Io.prototype.match = function (t, l) {
	return this.ebcdicChar === ch && this.isGraphic === isGraphic;
    }

    charToDisplay():number{
	if (this.isModified){
	    return this.inputChar;
	} else {
	    return this.ebcdicChar;
	}
    }
    
    matchAnyOf(arrayOfChars:number[], isGraphic:boolean):boolean{ // (Io.prototype.De = function (t, l) {
	for (var n = 0; n < arrayOfChars.length; n++) {
            var ch = arrayOfChars[n];
            if (this.ebcdicChar === ch && this.isGraphic === isGraphic){
		return true;
	    }
	}
	return false;
    }
    
    toString():string{
	return ("<ScreenElement 0x" + Utils.hexString(this.ebcdicChar) +
		(this.isGraphic ? "(GRPHC)" : "") +
		" field=" + this.fieldData + ">");
    }
}


export class PagedVirtualScreen extends VirtualScreen {  // 3270, 5250, and maybe other stuff, minified as Oo
    websocket:WebSocket|null;
    screenElements:(ScreenElement|null)[];
    isFormatted:boolean;   // That is, are the fields known
    fieldDataMap:any;
    bufferPos:number;
    charsetInfo:CharsetInfo;
    isFieldDataMapCached:boolean;

    Me:boolean;  // not understood yet
    Le:number;  // not understood yet
    Be:number;  // not understood yet
    We:boolean;  // not understood yet
    _e:any[];

    constructor(width:number, height:number){
	super(width,height);
	this.canvas = null;
	this.selectionCanvas = null;  // this.Il = null;
	this.parentDiv = null;
	this.oiaEnabled = 1;
	this.width = width;
	this.height = height;
	this.On = VirtualScreen.co.In;
	this.oiaLine = new OIALine(this); // this.Mn = new Eo(this);
	this.size = this.height * this.width;
	this.Kl = new Array(this.height * this.width);
	this.renderer = null;    // this.Un = null;
	this.defaultWidth=80;    // this.Ln = 80;
	this.defaultHeight=24;   // this.Bn = 24;
	this._n = [];
	this.websocket = null;  // minified as this.Wn = null;
	/* all of these input handling instance vars are owned by the parent class */
	// this.Qn = 0; - key event modifiers
	// these 4 are the bounding box
	// this.Tl = null;
	// this.Sl = null;
	// this.Rl = null;
	// this.yl = null;
	// this.Gn = !1; // mouseIsDown isDefined in superclass which really owns event handling
	this.jn = !1;
	this.Vn = "rgb(255,255,255)";
	this.zn;
	this.keyboardMap = null; // this.Kn = null; 
	this.screenElements = new Array(this.size); // was this.jl
	this.isFormatted = false; // this.Vl = !1;
	this.fieldDataMap = {}; // was this.xe
	this.clear(); // really, calling a method here??
	this.cursorPos = 0; // was this.kl
	this.bufferPos = 0; // was this.Oe
	this.charsetInfo = CharsetInfo.TERMINAL_DEFAULT_CHARSETS[0]; // was this.It = Oo.Ft;
	Utils.coreLogger.debug("charsetInfo = " + this.charsetInfo);
	this.Me = !1;
	this.isFieldDataMapCached = false; // this.Ue = !1;
	this.Le = 3647;
	this.shortName = "a"; // this.wi = "a";  
	this.longName = "a";  // this.vi = "a";  // longName?
	this.Be = -1;
	this._e = [];
	this.We = !1;
    }

    initScreen(){ // (Oo.prototype.Ti = function () {
	if (this.renderer){
	    Utils.coreLogger.warn("Will not init screen that already has renderer");
	} else {
            this.clear();
            let t = this.size;
            for (let l = 0; l < t; l++) {
		this.screenElements[l] = new ScreenElement(l, 0, null);
	    }
            this.cursorPos = 0;
	    this.showScreen();
	}
    }
    
    /*
      Charsets owned here in static variables
       (Oo.Qe = TERMINAL_DEFAULT_CHARSETS),
       (Oo.Ft = Oo.Qe[0]),
    */
    setCharsetInfo(name:string):void{ // (Oo.prototype.setCharsetInfo = function (t) {
	for (var n = 0; n < CharsetInfo.TERMINAL_DEFAULT_CHARSETS.length; n++) {
            var charset = CharsetInfo.TERMINAL_DEFAULT_CHARSETS[n];
            if (charset.name == name){
		this.charsetInfo = charset;
		break;
            }
	}
	if (this.renderer){
	    let pagedRenderer:PagedRenderer = this.renderer as PagedRenderer;
	    pagedRenderer.unicodeTable = this.charsetInfo.Et; // NEEDSWORK  - these are unicode/font mapping things
	    pagedRenderer.St = this.charsetInfo.St; // NEEDSWORK  - ditto - and no panic for now
	    pagedRenderer.fullPaint();
	}
	Utils.coreLogger.debug("charset info set to " + this.charsetInfo.name + " font=" + this.charsetInfo.font);
    }

    getCharsetInfo():CharsetInfo {
	return this.charsetInfo;
    }

    Ql(t:number){ // (Oo.prototype.Ql = function (t) {
	if (8364 == t && this.charsetInfo.St > 0) {
	    return this.charsetInfo.St;
	}
	for (var l = this.charsetInfo.Et, n = 0; n < l.length; n++) if (l[n] === t) return n;
	var i = this.charsetInfo.kt;
	if (null != i) for (var e = 0; e < i.length; e++) if (null != i[e]) for (var s = 0; s < i[e].length; s++) if (i[e][s] == t) return (e << 8) | s;
	return 0;
    }
    
    je(){ // (Oo.prototype.je = function () {
	var element = this.screenElements[this.cursorPos];
	if (element == null) return -1;
	if (15 == element.charToDisplay()) return this.cursorPos;
	for (var l = this.cursorPos - 1; l != this.cursorPos; l--) {
            var otherElement = this.screenElements[l];
            if (otherElement && 15 == otherElement.charToDisplay()) return l; // JOE, gating with null check
            0 == l && (l = this.size);
	}
	return -1;
    }

    // the third argument and its type are confusing
    Ve(t:string, l:boolean, n:boolean):number[]{ // (Oo.prototype.Ve = function (t, l, n) {
	let i:boolean = l;
	let e = [];
	for (var s = 0; s < t.length; s++) {
            var u = t.charCodeAt(s),
		h = this.Ql(u);
            Utils.keyboardLogger.debug("Getting DBCS for UTF. Given text code=0x" + Utils.hexString(u) + " ebcdic=0x" + Utils.hexString(h)),
            null != h ? (u > 127 ?
		// Joe - replacing '0 == i' with '!i' for equivalent truthiness
		(!i && (e.push(14), (i = !0)), e.push((65280 & h) >> 8), e.push(255 & h)) :
		(!0 === i && (e.push(15), (i = !1)), e.push(h))) : e.push(64);
	}
	if (n && !0 === i){ // JOE - replaced "1 == n" with n because evaluates the same for truthiness
	    e.push(15); // shift out
	}
	return e;
    }
    
    putScreenElement(position:number,screenElement:ScreenElement){ // (Oo.prototype.ze = function (t, l) {
	var fieldData = screenElement.fieldData; // was n
        var existingElement = this.screenElements[position]; // was i
	this.screenElements[position] = screenElement;
	if (null != existingElement && null != existingElement.fieldData){
	    delete this.fieldDataMap[position];
	}
	if (fieldData != null){
	    this.fieldDataMap[position] = fieldData;
	    this.isFormatted = true; // screen has >= 1 fields
	}
    }

    Ui(languageThing:any){ //(lc.prototype.Ui = function (t) {
	if (languageThing != null){
	    this.setCharsetInfo(this.zn.language);  // zn holds the languageThing
	}
    }

    // JOE, don't see any 2-arg callers
    Ke(t:any,l?:any){ // Oo.prototype.Ke = function (t, l) {
	alert("In the superclass!");
    }

    // JOE, don't know if ever used
    He(t:any){ // (Oo.prototype.He = function (t) {
	alert("In the superclass!");
    }

    handleWheel(event:WheelEvent):void { 
	// do nothing
    }


    // declare with two args here, but one in the parent class, grrrrr
    enterCharacterAtCursor(t:number,l?:any):boolean{ // (Oo.prototype.Fi = function (t, l) {
	alert("In the superclass!");
	return false;
    }

    getScreenElementRowColumn(row:number, column:number):(ScreenElement|null) { // (Oo.prototype.Ye = function (t, l) {
	return this.screenElements[row * this.width + column];
    }

    // JOE - try again on return type
    getScreenElementByPosition(position:number):any { // (Oo.prototype.qe = function (t) {
	return this.screenElements[position];
    }
    
    setCursorPos(newPos:number):boolean{ // (Oo.prototype.Ni = function (t) {
	if (newPos >= this.size) newPos %= this.size;
	if (newPos < 0) newPos += this.size;
	this.cursorPos = newPos;
	if (this.renderer && this.renderer.timerIntervalID){  
	    this.renderer.xl(); 
	}
	return true;
    }
    
    getCurrorPos():number{ // Oo.prototype.ge = function () {
	return this.cursorPos;
    } 

    modifyCursorPos(delta:number){ // (Oo.prototype.Pi = function (t) {
	this.setCursorPos(this.cursorPos + delta);
    }

    // ugly return declaration
    handleFunction(t:string):boolean|undefined{ // (Oo.prototype.Je = function (t) {
	Utils.superClassWarning("handleFunction");
	return false;
    }

    
    /* Event Handling Overrides of Base Class */

    // this is probably dead or worthless code
    Yi(t:number){ // (Oo.prototype.Yi = function (t) {
	Utils.keyboardLogger.info("Handlekeycode hit");
    }

    handleCharCodeInput(t:number):boolean{ // (Oo.prototype.Ji = function (t) {
	let logger = Utils.keyboardLogger;
	logger.debug("keypress, charCode=" + t);
	if (( 160 == t && (t = 32), this.We)) { // NEEDSWORK .We
            if ((this._e.push(String.fromCharCode(t)), !(this._e.length >= 2))) return !1; // NEEDSWORK ._e
            {
		let l = "";
		this._e.forEach((t) => { l += t;}); 
		let n = parseInt(l, 16).toString(10); // hexadecimal parsing to decimal string
		t = this.charsetInfo.Et[n]; // NEEDSWORK .Et
		this.We = !1; // NEEDSWORK .We
		this._e = [];
            }
	}
	if (this.renderer){
	    let renderer:PagedRenderer = this.renderer as PagedRenderer;
	    var l = renderer.Ql(t); // NEEDSWORK .Ql
	    if (l >= 64 && l < 255) {
		logger.debug("normal press code=0x" + Utils.hexString(t) + " ebcdic=0x" + Utils.hexString(l));
		if (this.enterCharacterAtCursor(l)) { 
		    renderer.fullPaint();
		    return true;
		}
		this.userAttentionSound();
	    } else {
		logger.warn("Unhandled key press 0x" + Utils.hexString(t));
		this.userAttentionSound();
	    }
	} else {
	    logger.warn("no PagedRenderer on VirtualScreen duing handleCharCodeInput");
	    this.userAttentionSound();
	}
	return !1;
    }
    
    handleKey(typeValuePair:TypeValuePair,l:KeyboardEvent):void { // (Oo.prototype.Wi = function (t, l) {
	if (8 === typeValuePair.type && 1 === typeValuePair.value.length && this.Qn & this.Le){
	    Utils.keyboardLogger.warn("Rejecting FALLBACK keydown, value=" + typeValuePair.value +
		    ", because modifierKeyState=" + this.Qn + ", which leads to undefined behavior");
	} else {
            var n = l.keyCode;
            if (2 === typeValuePair.type || 8 === typeValuePair.type) {
		var i = typeValuePair.value;
		if (1 != i.length) return;
		this.getFieldDataByPosition(this.cursorPos, !0);
		this.handleCharCodeInput(i.charCodeAt(0));
            } else {
		if (16 !== typeValuePair.type && 32 !== typeValuePair.type) return void this.Yi(n); // INTERIM .Yi
		this.handleFunction(typeValuePair.value);
            }
            l.stopPropagation(), l.preventDefault();
	}
    }

    // no overrides
    getFieldDataByPosition(position:number,lookInFieldDataMap:boolean):(FieldData|null){ //(Oo.prototype.Ze = function (t, l) {
        if (!this.isFormatted) return null;
        const keys = Object.keys(this.fieldDataMap);
        if (0 == keys.length) return null;
        if (lookInFieldDataMap) {
            for (let l = 0; l < keys.length; l++) {
                const i = this.fieldDataMap[keys[l]],
                      e = i.position,
                      s = (e + i.length) % this.size;
		// console.log("JOE i="+i+" e="+e+" s="+s+" pos="+position);
                if (s <= e && (position >= e || position < s)) return i;
                if (position >= e && position < s) return i;
            }
            return null;
        }
	// why this second loop, GURU
        for (let l = 0; l < this.size; l++) {
            let nn = (position - l) % this.size;
            nn < 0 && (nn = this.size + nn);
            const element = this.screenElements[nn];
            if (element && null != element.fieldData){
		return element.fieldData;
	    }
        }
	Utils.protocolLogger.warn("warning failed to get field data");
        return null;
    }

    showScreen(){ // (Oo.prototype.Ge = function () {
	Utils.superClassWarning("showScreen"); // if we are superclass warning, there should be no body
	/*this.size, this.width;
    for (var t = "", l = 0; l < this.size; l++) {
        var n = this.qe(l);
        if ((l % this.width == 0 && (Za.debug(t), (t = "")), n)) {
            var i = n.isModified ? n.inputChar : n.ebcdicChar,
                e = this.It.Et[i];
            t += e ? String.fromCharCode(e) : " ";
        } else t += " ";
    }
	*/
    }
}



export class PagedRenderer extends BaseRenderer {  // minified as ka
    St:any; // unknown yet
    
    
    
    constructor(canvas:HTMLCanvasElement|null, virtualScreenArg:VirtualScreen, unicodeTable:any){
	super(virtualScreenArg,unicodeTable);
	let virtualScreen = virtualScreenArg as PagedVirtualScreen;
	this.canvas = canvas;
	this.screen = virtualScreen;
	this.yt = -1;
	this.Ct = -1;
	this.Nt = -1;
	this.Pt = -1;
	this.font = null;
	this.fontFamily = ((virtualScreen.Ft && virtualScreen.Ft.pt) ?
			   virtualScreen.Ft.pt :
			   CharsetInfo.DEFAULT_FONT_FAMILY);
	Utils.coreLogger.debug("virtualScreen = " + virtualScreen);
	Utils.coreLogger.debug("charsetInfo=" + virtualScreen.charsetInfo);
	this.nl = virtualScreen.charsetInfo.font;
	// these are initialized in parent class exactly the same way
	//this.Dt = true;
	//this.scaleH = 1;  // this.xt
	//this.scaleV = 1;  // this.Ot
	//this.activeWidth = -1; // this.Ut = -1;
	//this.activeHeight = -1; // this.Mt = -1;
	//this.charWidth = 1;  // this.Lt = 1;
	//this.charHeight = 1; // this.Bt = 1;
	//this.ascent = 1; // this._t = 1;  // charAscent   from debug string
	//this.descent = 0; // was this.rl
	//this.leading = 0; // this.Wt = 0;  // charLeading, from debug string  // see "rl" too but not in Ea, hmmm
	this.Qt = 0;
	this.unicodeTable = unicodeTable; // was this.Gt = i;
	this.jt = 0;
	this.Vt = 3;
	this.timerDelay = 500;
	this.Kt = true;
	this.hasFocus = virtualScreen.hasFocus();
	this.background = 0;
	this.qt = 0xFFFFFF;
	this.Jt = 16711680;  // colors for symbolic colors like protected hi/lo
	this.Zt = 65280;
	this.Xt = 16777215; 
	this.scaleMethod = 1;
	if (3 == this.Vt && this.timerDelay > 0){
	    this.ll();
	}
	// undeclared's
	this.St;  // set from charsetInfo.st (screen.It.St) during setCharsetInfo
    }

    Ql(t:number){ // (ka.prototype.Ql = function (t) {
        if (8364 == t && this.St > 0) return this.St;
        for (var l = 0; l < this.unicodeTable.length; l++) if (this.unicodeTable[l] == t) return l;
        return 0;
    }

    Gl(t:number){ // ka.prototype.Gl = function (t) {
        return 8364 == t && this.St > 0 ? this.St : this.unicodeTable[t].toString(16);
    }

    // an override, but what is different
    Al(t:any[], l:any[], n:any[], i:number, e:number, s:any) { // ka.prototype.Al = function (t, l, n, i, e, s) {
	let ea = BaseRenderer.ea;
        for (var u = e + 1, h = t[e], r = l[e], a = n[i + e]; u < s && (h == ea ? t[u] == ea : h == t[u]) && r == l[u] && a == n[i + u]; ) u++;
        return u - e;
    }
}
