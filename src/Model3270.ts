/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
  Copyright Contributors to the Open Mainframe Project's TSTerm Project
*/

import { Exception,Utils } from "./Utils";
import { CharacterAttributes, FieldData, KeyboardMap, RowAndColumn, 
	 VirtualScreen, OIALine, CharsetInfo, BaseRenderer } from "./Generic";
import { ScreenElement, PagedVirtualScreen, PagedRenderer } from "./Paged";
import { GraphicsState } from "./Graphics";

class Ebcdic {

    /* 
       static th = 28; // what is this?? EBCDIC IFS?, ASCII FS
       static lh = 30; // Field mark, record separator, was lh
    */
    static fieldMark = 28; // was th, See EBCDIC docs
    static recordMark = 30; // was lh
    static hyphen = 0x60;
    static specialMarks = [ 28, 30]; // keep in sync with above definitions
    static boxTRight = 0xC6;
    static boxTUp   = 0xC7;
    static boxCrossedLines = 0xD3;
    static boxTLeft = 0xD6;
    static boxTDown = 0xD7;
    static boxHLine = 0xA2;
    static boxLowLCorner = 0xC4;
    static boxLowRCorner = 0xD4;
    static boxTopLCorner = 0xC5;
    static boxTopRCorner = 0xC6;
}

class Unicode {
    static euro = 0x20AC;  // 8364
    static space2000 = 0x2000; // 8192

}

class CharacterAttributes3270 extends CharacterAttributes { // minified as Xo
    classicBits:number;
    highlighting:number;
    color:number;
    backgroundColor:number;
    characterSet:number;
    outlining:number;
    transparency:number;
    validation:number;
    sisoAllowed:number;
    // These are not well-understood yet
    hn:number; 
    rn:number;
    an:number;
    
    constructor(classicBits?:number){
	super();
	this.classicBits = (classicBits ? classicBits : 0); // minified "this.sn"
	this.highlighting = 0; // minified as .wn
	this.color = 0;
	this.backgroundColor = 0;
	this.characterSet = 0;
	this.outlining = 0; // minified .mn
	this.transparency = 0;  // minified .hs
	this.validation = 0;    // minified .rs
	this.sisoAllowed = 0;   // DBCS shift in-out -- minified .ql
	this.hn = 0;   // not yet known from minified code, not in toString Method
	this.rn = 0;
	this.an = 0;
    }

    copy(){  // minified as prototype.yi()
        let c = new CharacterAttributes3270(this.classicBits);
	c.highlighting = this.highlighting;
	c.color = this.color;
	c.backgroundColor = this.backgroundColor;
        c.characterSet = this.characterSet;
        c.outlining = this.outlining;
        c.transparency = this.transparency;
        c.validation = this.validation;
	c.sisoAllowed = this.sisoAllowed;
        c.hn = this.hn;
        c.rn = this.rn;
        c.an = this.an;
        return c;
    }
    
    toString(){
        let t = ("<CharAttrs3270 std=0x" + Utils.hexString(this.classicBits) +
		 " color=0x" + Utils.hexString(this.color) +
		 " bgCol=0x" + Utils.hexString(this.backgroundColor));
	if (this.outlining != 0){
	    t += " outln=0x" + Utils.hexString(this.outlining);
	}
	if (this.highlighting != 0){
	    t += " hilite=0x" + Utils.hexString(this.highlighting);
	}
	if (this.characterSet != 0){
	    t += " charSet=0x" + Utils.hexString(this.characterSet);
	}
	if (this.transparency != 0){
            t += " transpcy=0x" + Utils.hexString(this.transparency);
	}
	if (this.validation != 0){
            t += " valdtn=0x" + Utils.hexString(this.validation);
	}
	if (this.sisoAllowed != 0){ 
            t += " SI/SO Allowed";
	}
        t += ">"
	return t;
    }

    /*
      os is only called from lc.prototype._h = function (t) {}
      the trace messages indicate this is VirtualScreen3270 generating some sort of read response
    */

    
    os(){   // (Xo.prototype.os = function () {  -- not well understood yet
        let t = [];
        return (
            64 != this.classicBits && 0 != this.classicBits && (t.push(192), t.push(this.classicBits)),
            0 != this.highlighting && (t.push(65), t.push(this.highlighting)),
            0 != this.color && (t.push(66), t.push(this.color)),
            0 != this.backgroundColor && (t.push(69), t.push(this.backgroundColor)),
            0 != this.characterSet && (t.push(67), t.push(this.characterSet)),
            0 != this.outlining && (t.push(194), t.push(this.outlining)),
            0 != this.transparency && (t.push(70), t.push(this.transparency)),
            0 != this.validation && (t.push(193), t.push(this.validation)),
            0 != this.sisoAllowed && (t.push(254), t.push(this.sisoAllowed)),
            0 != this.hn && (t.push(113), t.push(this.hn)),
            0 != this.rn && (t.push(114), t.push(this.rn)),
            0 != this.an && (t.push(115), t.push(this.an)),
            t
        );
    }

    /*
      cs (like os() above) is only called from lc.prototype._h = function (t) {}
      the trace messages indicate this is VirtualScreen3270 generating some sort of read response
    */

    cs(t:CharacterAttributes3270):Map<number,number>|null {  // (Xo.prototype.cs = function (t) { -- not well understood yet
        if (null == t) {
	    return null;
	}
        let l = new Map<number,number>();
        let n:boolean = false;
        if (this.classicBits != t.classicBits){
	    l.set(192, t.classicBits);
	    n = true;
	}
        if (this.highlighting != t.highlighting){
	    l.set(65, t.highlighting);
	    n = true;
	}
        if (this.color != t.color){
	    l.set(66, t.color);
	    n = true;
	}
        if (this.backgroundColor != t.backgroundColor){
	    l.set(69, t.backgroundColor);
	    n = !0;
	}
	if (this.characterSet != t.characterSet){
	    l.set(67, t.characterSet);
	    n = true;
	}
        if (this.outlining != t.outlining){
	    l.set(194, t.outlining);
	    n = true;
	}
        if (this.transparency != t.transparency){
	    l.set(70, t.transparency);
	    n = true;
	}
        if (this.validation != t.validation){
	    l.set(193, t.validation);
	    n = true;
	}
        if (this.sisoAllowed != t.sisoAllowed){
	    l.set(254, t.sisoAllowed);
	    n = true;
	}
        if (this.hn != t.hn){
	    l.set(113, t.hn);
	    n = true;
	}
	if (this.rn != t.rn){
	    l.set(114, t.rn);
	    n = true;
	}
        if (this.an != t.an){
	    l.set(115, t.an);
	    n = true;
	}
	if (n && !t.isNonDefault()){
	    l = new Map<number,number>();
	    l.set(0,0);
	}
        return n ? l : null;
    }

    isProtected():boolean{  // minified as ".ds"
	return (this.classicBits & FieldConstants.FIELD_ATTRIBUTE_PROTECTED) != 0;
    }

    ws():boolean{   // prototype.ws - no nice name yet
        return 0 != (4 & this.validation);
    }
    
    vs():boolean{   // prototype.vs - no nice name yet
        return 0 != (2 & this.validation);
    }

    isNonDefault():boolean{  // minified as "prototype.fs"
        return ((0 != this.classicBits) ||
		(0 != this.highlighting) ||
		(0 != this.color) ||
		(0 != this.backgroundColor) ||
		(0 != this.characterSet) ||
		(0 != this.outlining) ||
		(0 != this.transparency) ||
		(0 != this.validation) ||
		(0 != this.sisoAllowed) ||
		(0 != this.hn) ||
		(0 != this.rn) ||
		(0 != this.an));
    }

    un():boolean{  // (Xo.prototype.un = function () {  no nice name yet
        return 0 != this.hn || 0 != this.rn || 0 != this.an;
    }

    getHighlightingString():string{  // minified as "ps"
        switch (this.highlighting) {
        case 0:
            return "00 Default";
        case 240:
            return "F0 Normal (By 3270 Attribute)";
        case 241:
            return "F1 Blink";
        case 242:
            return "F2 Reverse";
        case 244:
            return "F3 Underscore";
        default:
            return "Unknown " + this.highlighting;
        }
    }

    getColorString(useBackground:boolean):string{  // minified as As(t)
	if (!useBackground && this.un()){
	    return "RGB " + this.hn + "," + this.rn + "," + this.an;
	}
	var color = useBackground ? this.backgroundColor : this.color;
        switch (color) {
        case 0:
            return "00 Default (By QueryReply)";
        case 240:
            return "F0 Neutral (Black on Display)";
        case 241:
            return "F1 Blue";
        case 242:
            return "F2 Red";
        case 243:
            return "F3 Pink";
        case 244:
            return "F4 Green";
        case 245:
            return "F5 Turquoise";
        case 246:
            return "F6 Yellow";
        case 247:
            return "F7 Neutral (White on Displays)";
        case 248:
            return "F8 Black";
        case 249:
            return "F9 Deep Blue";
        case 250:
            return "FA Orange";
        case 251:
            return "FB Purple";
        case 252:
            return "FC Pale Green";
        case 253:
            return "FD Pale Turquoise";
        case 254:
            return "FE Grey";
        case 255:
            return "FF White";
        default:
            return "Unknown Color" + color;
        }
    }

    /*
      This is only called from lc.prototype.$u (handleWriteOrders(t)
      lc == VirtualScreen3270

      t is a numerical key probably from orders or structuredFields, or some such
      mabye bs(orderType,order)    orders of 40 (SET_ATTR) and 41 (START_FIELD_EXTENDED) seen

      // returns true if any garbage data seen
     */
    incorporateSFE(orderKey:number,order:any):any[]|null { //    (Xo.prototype.bs = function (t, l) {
        var props = Object.keys(order);
        let updateResults:any[] = [];
        for (var n = 0; n < props.length; n++) {
            var propertyName = props[n];
            var value = order[propertyName];
            if (propertyName.startsWith("0x")) {
                var numericalKey = parseInt(propertyName.substring(2), 16);
                let l = this.update(orderKey, numericalKey, value);
                updateResults.push(l);
            }
        }
        if (updateResults && !updateResults.every((t) => t.status)){
	    return updateResults;
	} else {
	    return null; // implicitly return unbound, ugh - now null, but still falsy
	}
    }

    static ATTRIBUTE_CLASSIC_BITS     = 0xC0;   
    static ATTRIBUTE_VALIDATION       = 0xC1;
    static ATTRIBUTE_OUTLINING        = 0xC2;
    static ATTRIBUTE_HIGHLIGHTING     = 0x41;
    static ATTRIBUTE_COLOR            = 0x42;   
    static ATTRIBUTE_CHARSET          = 0x43;
    static ATTRIBUTE_BACKGROUND_COLOR = 0x45;
    static ATTRIBUTE_TRANSPARENCY     = 0x46;
    static ATTRIBUTE_SISO             = 0xFE;  

    update(t:any, attributeType:number, attributeValue:number):any{ // (Xo.prototype.update = function (t, l, n) {
	let logger = Utils.protocolLogger;
        switch (attributeType) {
            case 0:
		if (0 != attributeValue){
		    logger.warn("Character attribute update: clear attribute (0x0) must be followed by 0x0, but was=0x" + Utils.hexString(attributeValue));
		}
		this.classicBits = 0;
		this.highlighting = 0;
		this.color = 0;
		this.characterSet = 0;
		this.outlining = 0;
		this.transparency = 0;
		this.validation = 0;
		this.sisoAllowed = 0;
		this.hn = 0;
		this.rn = 0;
		this.an = 0;
		break;
            case CharacterAttributes3270.ATTRIBUTE_CLASSIC_BITS:
		this.classicBits = attributeValue;
		break;
            case CharacterAttributes3270.ATTRIBUTE_VALIDATION:
		this.validation = attributeValue;
		break;
            case CharacterAttributes3270.ATTRIBUTE_OUTLINING:
		this.outlining = attributeValue;
		break;
		case CharacterAttributes3270.ATTRIBUTE_HIGHLIGHTING:
			if (attributeValue !== 0) {
				let i = attributeValue - 240;
				if (3 == i || i > 4 || i < 0) {
					logger.warn("[ATTRIBUTE_HIGHLIGHTING] Unexpected invalid attribute type=0x" + Utils.hexString(attributeValue));
					attributeValue = 0;
					//return { code: "753", type: "ext_highlingting", status: !1, gs: "1003" };
				}
			}
			this.highlighting = attributeValue;;
		break;
		case CharacterAttributes3270.ATTRIBUTE_COLOR:
			if (attributeValue !== 0) {
			let i = attributeValue - 240;
				if (i > 15 || i < 0) {
					logger.warn("[ATTRIBUTE_COLOR] Unexpected invalid attribute type=0x" + Utils.hexString(attributeValue));
					attributeValue = 0;
					// return { code: "753", type: "ext_color", status: !1, gs: "1003" };
				}
			}
			this.color = attributeValue;
		break;
            case CharacterAttributes3270.ATTRIBUTE_CHARSET:
		this.characterSet = attributeValue;
		break;
            case CharacterAttributes3270.ATTRIBUTE_BACKGROUND_COLOR:
		this.backgroundColor = attributeValue;
		break;
            case CharacterAttributes3270.ATTRIBUTE_TRANSPARENCY:
		this.transparency = attributeValue;
		break;
            case 113:
		this.hn = attributeValue;
		break;
            case 114:
		this.rn = attributeValue;
		break;
            case 115:
		this.an = attributeValue;
		break;
            case 254:
		this.sisoAllowed = attributeValue;
		break;
            default:
		logger.warn("Unexpected field/char attribute type=0x" + Utils.hexString(attributeType));
		return (41 === t ?
		    { code: "752", type: "attribute_type", status: false, gs: "1005" } :
		    { code: "752", type: "attribute_type", status: false, gs: "1003" }
		       );
	}
        return { status: true };
    }

}

class FieldConstants {
    static FIELD_ATTRIBUTE_PRINTABLILITY_MASK =0xC0;
    static FIELD_ATTRIBUTE_PROTECTED =         0x20;
    static FIELD_ATTRIBUTE_NUMERIC   =         0x10; 
    static FIELD_ATTRIBUTE_DISPLAY_MASK      = 0x0c;
    static FIELD_ATTRIBUTE_MODIFIED          = 0x01;
    
    static FIELD_ATTRIBUTE_DISPLAY_NOT_DETECTABLE    = 0x00;
    static FIELD_ATTRIBUTE_DISPLAY_DETECTABLE        = 0x04;
    static FIELD_ATTRIBUTE_INTENSIFIED_DETECTABLE    = 0x08;
    static FIELD_ATTRIBUTE_NO_DISPLAY_NOT_DETECTABLE = 0x0c;
}


class FieldData3270 extends FieldData {  // minified $o
    attributes:CharacterAttributes3270;
    precedingSBAOrder:any;
    length:number;
    
    constructor(attributes:CharacterAttributes3270, position:number){
	super(position);  
	this.attributes = attributes;
	this.precedingSBAOrder = null;   // not renamed yet from minification was this.as
	this.length = 0;  // what does this mean in this context
    }

    toString():string{
	return ("<FieldData3270:  position=" +
                this.position +
                " color=0x" +
                Utils.hexString(this.attributes.color) +
                " attr=0x" +
                Utils.hexString(this.attributes.classicBits) +
                (0 != this.attributes.sisoAllowed ? " SO/SI allowed" : "") +
                (0 != this.attributes.characterSet ? " charset=0x" + Utils.hexString(this.attributes.characterSet) : "") +
                ">"
               );
    }

    isNoDisplay():boolean{  // formerly prototype.pn()
	return ((this.attributes.classicBits & FieldConstants.FIELD_ATTRIBUTE_DISPLAY_MASK) ==
		FieldConstants.FIELD_ATTRIBUTE_NO_DISPLAY_NOT_DETECTABLE);
    }

    setModified():void{    // minified as "prototype.Es()"
	this.attributes.classicBits |= 1;
    }

    clearModified():void{  // minified as "prototype.ms()"
	this.attributes.classicBits &= 254;
    }

    isModified():boolean{     // minified as "prototype.Hl()" 
	return (this.attributes.classicBits & 1) != 0;
    }

    ks():boolean{  // looks like it isProtectedNumeric, which is weird
	return (this.attributes.classicBits & 0x30) == 0x30;
    }

    isDisplayNotDetectable():boolean { // minified as "prottype.Ss()"
	return ((this.attributes.classicBits & FieldConstants.FIELD_ATTRIBUTE_DISPLAY_MASK) ==
		FieldConstants.FIELD_ATTRIBUTE_DISPLAY_NOT_DETECTABLE);
    }

    isEditable():boolean{  // minified as "prototype.dn"
	return (this.attributes.classicBits & FieldConstants.FIELD_ATTRIBUTE_PROTECTED) == 0;
    }

}

class Field {  // minified as Fo
    fieldData:FieldData3270;
    start:number;
    end:number;
    Ie?:number;  // poorly understood see note in method contains()
    
    constructor(fieldData:FieldData3270, start:number, end:number){
	this.fieldData = fieldData; // was this.zl
	this.start = start;
	this.end = end;
    }

    size(screenSize:number):number{  // minified as I(t)
	if (this.end > this.start) { // non-wrapping
	    return this.end - this.start;
	} else {
	    return this.end + (screenSize - this.start);
	}
    }

    /* this is terribly weird method with "this.Ie" coming out of nowhere
       But it doesn't appear to be called, which is good.
    */
    contains(position:number):boolean{ // (Fo.prototype.contains = function (t) {
	if (!this.Ie){
	    throw "Illegal State this.Ie is not set";
	}
	return this.Ie >= this.start && this.Ie < this.end;
    }

    toString():string{
	return "<Field " + this.fieldData + " from " + this.start + " to " + this.end + ">";
    }
}


/* This stupid thing is not always built in every conversaion and is shitty in general 
   and its parts are specifically shitty.
*/
class TN3270Capabilities { // Zo = function (t, l, n, i, e, s, u) {
    $e:any;
    ts:any;
    ls:any;
    ns:any;
    es:any;
    ss:any;
    us:any;
    
    constructor(t:any,l:any,n:any,i:any,e:any,s:any,u:any){
        this.$e = t;
	this.ts = l;
	this.ls = n;
	this.ns = i;
	this.es = e;
	this.ss = s;
	this.us = u;
    }
}

export class DeviceType3270 {
    constructor(){

    }

    static rs = { type: 1, string: "IBM-3278-2", height: 24, width: 80 };
    static as = { type: 2, string: "IBM-3278-2-E", isExtended: !0, height: 24, width: 80 };
    static deviceType1E = DeviceType3270.as;
    static os = { type: 3, string: "IBM-3278-3", height: 32, width: 80 };
    static cs = { type: 4, string: "IBM-3278-3-E", isExtended: !0, height: 32, width: 80 };
    static deviceType2E = DeviceType3270.cs;
    static fs = { type: 5, string: "IBM-3278-4", height: 43, width: 80 };
    static ds = { type: 6, string: "IBM-3278-4-E", isExtended: !0, height: 43, width: 80 };
    static deviceType3E = DeviceType3270.ds;
    static ws = { type: 7, string: "IBM-3278-5", height: 27, width: 132 };
    static vs = { type: 8, string: "IBM-3278-5-E", isExtended: !0, height: 27, width: 132 };
    static deviceType4E = DeviceType3270.vs;
    static ps = { type: 9, string: "IBM-DYNAMIC", isExtended: !0 };
}

export class TN3270EParser{  // minified as ic
    screen:VirtualScreen3270;
    messageName:string;
    state:number;
    previousByte:number;
    subData:any[];
    messageData:any[];
    outerMessagePos:number;
    responseBuffer:any[];
    tn3270EMode:boolean;
    printableChars:any[];
    sequenceNumber:number;
    capabilitiesToOffer:number[];
    atEndOfHostMessage:boolean;
    // these fields are a duplicate of fields in VirtualScreen3270
    // and there is no reason for this duplication.  It's probably
    // a vestige of an ancient factoring that missed some details
    usingAlternateSize:boolean;
    currentPartitionID:number = 0; // JOE - I think this is OK for initial state
    partitionState:number;
    partitionInfoMap:any;

    // poorly understood fields
    Bu:boolean;
    sh:boolean;
    aa:boolean;
    qh:number;
    Jh:number;
    lastHeader:any;
    xu:any; // horrible thing that only seems to be used w/o being set
    
    constructor(virtualScreen:VirtualScreen3270,
		messageName:string) {  // seen messageName of "3270_CLIENT_MESSAGE"
	this.messageName = messageName; // don't really like instance var name,  was this.ri
	this.screen = virtualScreen;
	this.state = 0; // indexes telnetStateNames [0 to 3]
	this.previousByte = 0;  // minimized as this.ui
	this.subData = [];  // minimized as this.hi = [] - only holds data for TELENT/TN3270E sub negotiation
	this.messageData = [];  // this.sa = []; message data as opposed to subData
	this.outerMessagePos = 0; //this.ua = 0;   this syncs 0 to the 5-byte header
	this.responseBuffer = [];   // minified as this.si
	this.tn3270EMode = false;  // this.Zh = false; because we handle NVT, too
	this.printableChars = []; // this.ha = []; used when reading orders out of WRITE_COMMAND_xxx
	this.sequenceNumber= 0;
	// note that Rs and TS are "globals"
	
	this.capabilitiesToOffer = (virtualScreen.useBetterCapabilities ?  // was this.ra
				    TN3270EParser.betterCapabilities :
				    TN3270EParser.regularCapabilities);
	this.atEndOfHostMessage = false; // this.Yh = false;  - long-winded name, but
	this.usingAlternateSize = virtualScreen.usingAlternateSize;
	this.partitionState = virtualScreen.partitionState; // this.Os
	this.partitionInfoMap = virtualScreen.partitionInfoMap;
	this.Bu = true;    // something about echoing, but used as both capability and state it seems
	this.sh = false
	this.aa = false;   // this is managed by telnet negotiation, but not used meaningfully
	/* These are bit fields with the 1,2,4,8 set in in protocol negotiation 
	   - when all four bits are set, the hh/process loop chooses NVT or TN3270E convo types 
	   bit 1
	   bit 2
	   bit 4
	   bit 8
	   
	 */
	this.qh = 0;    
	this.Jh = 0;
	// JOE found and brought these properties to the constructor
	this.lastHeader = null; // minified this.va = null; 
    }

    static regularCapabilities = [3, 7, 0, 2, 4]; // minified as Ts
    static betterCapabilities = [3, 7, 0, 2, 4, 5, 7]; // minified as Rs

    static failureExplanations:any = {
          "CONN-PARTNER": "The requested LU Name is associated with another terminal.",
          "DEVICE-IN-USE": "The requested LU Name is already in use with another session.",
          "INV-ASSOCIATE": "The requested Device Type is not a printer or the associated LU Name is not a terminal.",
          "INV-NAME": "The LU Name is not known to the server.",
          "INV-DEVICE-TYPE": "The server does not support the requested Device Type.",
          "TYPE-NAME-ERROR": "The requested LU Name is incompatible with the requested Device Type.",
          "UNKNOWN-ERROR": "The server rejected the connection but did not give a specific reason.",
          "UNSUPPORTED-REQ": "The server is unable to satisfy a client request.",
          UNKNOWN: "Unknown error."
    }

    static WCC_ALARM = 0x04;
    static WCC_KEYBOARD_RESTORE = 0x02;
    static WCC_MDT_RESET = 0x01;

    static COMMAND_WRITE = 0xF1; // 241
    static COMMAND_WRITE_LOCAL = 0x01;
    static COMMAND_WRITE_ASCII = 0x31; // 49
    static COMMAND_ERASE_WRITE = 0xF5; // 245
    static COMMAND_ERASE_WRITE_LOCAL = 0x05; // 5
    static COMMAND_ERASE_WRITE_ASCII = 0x35; // 53
    static COMMAND_ERASE_WRITE_ALTERNATE = 0x7E; // 126
    static COMMAND_ERASE_WRITE_ALTERNATE_LOCAL = 0x0D; // 13
    static COMMAND_ERASE_WRITE_ALTERNATE_ASCII = 0x3D; // 61
    static COMMAND_ERASE_ALL_UNPROTECTED = 0x6F;       // 111
    static COMMAND_ERASE_ALL_UNPROTECTED_LOCAL = 0x0F; //15
    static COMMAND_ERASE_ALL_UNPROTECTED_ASCII = 0x3F; // 63
    static COMMAND_WRITE_STRUCTURED_FIELD = 0xF3;         // 243
    static COMMAND_WRITE_STRUCTURED_FIELD_LOCAL = 0x11;   // 17
    static COMMAND_READ_BUFFER = 0xF2;                    // 242
    static COMMAND_READ_BUFFER_LOCAL = 0x02;
    static COMMAND_READ_BUFFER_ASCII = 0x32;
    static COMMAND_READ_MODIFIED = 0xF6;                  // 246
    static COMMAND_READ_MODIFIED_LOCAL = 0x06;
    static COMMAND_READ_MODIFIED_ASCII = 0x36;
    static COMMAND_READ_MODIFIED_ALL = 0x6E;              // 110
    static COMMAND_READ_MODIFIED_ALL_LOCAL = 0x0e;
    static COMMAND_READ_MODIFIED_ALL_ASCII = 0x3D;
  
    // Orders are the sub-messages of write commands
    static ORDER_START_FIELD = 0x1D; // 29
    static ORDER_START_FIELD_EXTENDED = 0x29; // 41
    static ORDER_SET_BUFFER_ADDRESS = 0x11; // 17
    static ORDER_SET_ATTRIBUTE = 0x28;
    static ORDER_INSERT_CURSOR = 0x13;
    static ORDER_MODIFY_FIELD = 0x2C;
    static ORDER_PROGRAM_TAB = 0x05;
    static ORDER_REPEAT_TO_ADDRESS = 0x3C;
    static ORDER_ERASE_UNPROTECTED_TO_ADDRESS = 0x12;
    static ORDER_GRAPHIC_ESCAPE = 0x08;

    // Structured Fields are the submessages of COMMAND_WRITE_STRUCTURED_FIELD
    static STRFLD_RESET_PARTN             = 0x00;
    static STRFLD_READ_PARTN              = 0x01;
    static STRFLD_ERASE_RESET             = 0x03;
    static STRFLD_LOAD_PROGRAMMED_SYMBOLS = 0x06;
    static STRFLD_SET_REPLY_MODE          = 0x09;
    static STRFLD_SET_WINDOW_ORIGIN       = 0x0B;
    static STRFLD_CREATE_PARTN            = 0x0C;
    static STRFLD_DESTROY_PARTN           = 0x0D;
    static STRFLD_ACTIVATE_PARTN          = 0x0E;
    static STRFLD_UNKNOWN_000F            = 0x0F;
    static STRFLD_UNKNOWN_0010            = 0x10;
    static STRFLD_OUTBOUND_3270_DATA_STREAM = 0x40;
    static STRFLD_SCS_DATA                = 0x41;
    static STRFLD_SELECT_FORMAT_GROUP     = 0x4A;
    static STRFLD_PRESENT_ABSOLUTE_FORMAT = 0x4B;
    static STRFLD_PRESENT_RELATIVE_FORMAT = 0x4C;    
    static STRFLD_INBOUND_3270_DATA_STREAM= 0x80; 
    static STRFLD_QUERY_REPLY             = 0x81;  // 129
    static STRFLD_READ_PARTN_QUERY        = 0x0102;
    static STRFLD_READ_PARTN_QUERY_LIST   = 0x0103;
    static STRFLD_READ_PARTN_MODIFIED_ALL = 0x016E;
    static STRFLD_READ_PARTN_BUFFER       = 0x01F2;
    static STRFLD_READ_PARTN_MODIFIED     = 0x01F6;
    static STRFLD_SET_MSR_CONTROL         = 0x0F01; // 3841
    static STRFLD_DESTINATION_ORIGIN      = 0x0F02; // 3842
    static STRFLD_SELECT_COLOR_TABLE      = 0x0F04;
    static STRFLD_LOAD_COLOR_TABLE        = 0x0F05;
    static STRFLD_LOAD_LINE_TYPE          = 0x0F07;
    static STRFLD_SET_PARTN_CHARACTERISTICS = 0x0F08;
    static STRFLD_MODIFY_PARTN              = 0x0F0A;
    static STRFLD_OBJECT_DATA               = 0x0F0F;  // 3855
    static STRFLD_OBJECT_PICTURE            = 0x0F10;  // 3856
    static STRFLD_OBJECT_CONTROL            = 0x0F11;  // 3857
    static STRFLD_OEM_DATA                  = 0x0F1F;
    static STRFLD_DATA_CHAIN                = 0x0F21;
    static STRFLD_EXCEPTION_STATUS          = 0x0F22;
    static STRFLD_LOAD_FORMAT_STORAGE       = 0x0F24;
    static STRFLD_SELECT_IPDS_MODE          = 0x0F83;
    static STRFLD_SET_PRINTER_CHARACTERISTICS = 0x0F84;
    static STRFLD_BEGIN_END_FILE            = 0x0F85;
    static STRFLD_INBOUND_TEXT_HEADER       = 0x0FB1;
    static STRFLD_TYPE1_TEXT_OUTBOUND       = 0x0FC1;

    // http://bitsavers.org/pdf/ibm/3270/GA23-0059-07_3270_Data_Stream_Programmers_Reference_199206.pdf
    static STRFLD_PCLK_PROTOCOL               = 0x1013;  // even wireshark doesn't know what this is!
    static STRFLD_REQUEST_RECOVERY_DATA       = 0x1030;
    static STRFLD_RECOVERY_DATA               = 0x1031; 
    static STRFLD_SET_CHECKPOINT_INTERVAL     = 0x1032;
    static STRFLD_RESTART                     = 0x1033;
    static STRFLD_SAVE_RESTORE_PANEL          = 0x1034;

    // PF1 is F1
    // PF9 is F9
    // PF10 is 7A
    // PF11 is 7B
    // PF12 is 7C
    // PF13 is C1
    // PF21 is C9
    // PF22 is 4A
    // PF23 is 4B
    // PF24 is 4C
    static AID_NO_AID              = 0x60; //  96
    static AID_STRUCTURED_FIELD    = 0x88; // 136
    static AID_READ_PARTITION      = 0x61; //  97
    static AID_TRIGGER_ACTION      = 0x7f; // 127
    static AID_CLEAR_PARTITION_KEY = 0x6a; // 106
    static AID_PA3                 = 0x6b; // 107
    static AID_PA1                 = 0x6c; // 108
    static AID_CLEAR_KEY           = 0x6d; // 109
    static AID_PA2                 = 0x6e; // 110
    static AID_ENTER_KEY           = 0x7d; // 125
    static AID_SELECTOR_PEN_MOUSE  = 0x7e; // 126
    // sysreq 0xF0 - 240

    static IAC = 0xFF;   // 255
    static DONT = 0xFE;  // 254
    static DO = 0xFD;    // 253
    static WONT = 0xFC;  // 252
    static WILL = 0xFB;  // 251
    static SB = 0xFA;    // 250

    static AO = 0xF5;    // 245  - abort output
    static IP = 0xF4;    // 244  - interrupt process
    static BREAK = 0xF3; // 243  - Break (see RFC)
    static DM = 0xF2;    // 242  - Data Mark
    static NOP = 0xF1;   // 241
    static SE = 0xF0;    // 240
    static EOR = 0xEF;   // 239

    static OPTION_BINARY_XMIT = 0;
    static OPTION_ECHO = 1;
    static OPTION_SUPPRESS_GO_AHEAD = 3;
    static OPTION_TTYPE = 0x18;  // 24   - will occur in SB/SE sequences
    static OPTION_EOR = 0x19;    // 25   - end of record
    static OPTION_TN3270E = 0x28; // 40

    // from RFC2355
    static DATA_TYPE_3270 = 0;
    static DATA_TYPE_SCS  = 1;
    static DATA_TYPE_RESPONSE = 2;
    static DATA_TYPE_BIND_IMAGE = 3;
    static DATA_TYPE_UNBIND = 4;
    static DATA_TYPE_NVT = 5;
    static DATA_TYPE_REQUEST = 6;
    static DATA_TYPE_SSCPLU = 7;
    static DATA_TYPE_PRINT_EOJ = 8;
    static DATA_TYPE_9 = 9;   // this is a bit mysterious

    static PARSE_STATE_NONE = 0;
    static PARSE_STATE_OPTION = 1;
    static PARSE_STATE_SUB = 2;
    static PARSE_STATE_VERB = 3;

    // TN3270E response Flags see RFC 2355
    static NO_RESPONSE = 0;
    static ERROR_RESPONSE = 1;
    static ALWAYS_RESPONSE = 2;

    
    static telnetStateNames =  ["TELNET_NO_STATE", "PARSER_TELNET_OPTION",
				"PARSER_TELNET_SUB", "PARSER_TELNET_VERB"];

    // NVT is network virtual terminal

    addTelnetResponse(b1:number, b2:number){ // ic.prototype.ea = function(byte, inputByte){
	// this thing accumulates a response byte
	this.responseBuffer.push(255);
	this.responseBuffer.push(b1);
	if (Number(b2) >= 0){
	    this.responseBuffer.push(b2);
	}
    }

    handleTelnetNegotiation(b:number){ // t is the first negotiation byte (ic.prototype.wa = function (t) {
	let logger = Utils.telnetLogger;
	logger.debug("Handling telnet option");
	logger.debug("-- b=0x" + Utils.hexString(b));
	switch (this.previousByte) {
	case TN3270EParser.DO:
	    logger.debug("-- Verb=DO");
            switch (b) {
            case TN3270EParser.OPTION_TN3270E:
		if (this.screen.enableTN3270E){
		    this.addTelnetResponse(TN3270EParser.WILL, b);
		    this.screen.convoType = VirtualScreen3270.convoTypes.LULU;
		    console.log("JOE postload going TN3270E");
		    this.screen.inTN3270EMode = true;
		    this.tn3270EMode = true;
		} else {
		    this.addTelnetResponse(TN3270EParser.WONT, b);
		}
		break;
            case 24:
		this.aa = !0;
		this.addTelnetResponse(TN3270EParser.WILL, b);
		break;
            case 25:
		this.Jh |= 1;
		if (0 == (8 & this.Jh)){
		    this.Jh |= 8;
		}
		this.addTelnetResponse(TN3270EParser.WILL, b);
		break;
            case 0:
		this.qh |= 1;
		if (0 == (8 & this.qh)){
		    this.qh |= 8;
		}
		this.addTelnetResponse(TN3270EParser.WILL, b);
		break;
            case 1:
		if (this.aa){
		    this.Bu = !1;
		    this.addTelnetResponse(TN3270EParser.WONT, b);
		} else {
		    this.Bu = !0;
		    this.addTelnetResponse(TN3270EParser.WILL, b);
		}
		break;
            case 3:
		this.sh = !1;
		this.addTelnetResponse(TN3270EParser.WILL, b);
		break;
            case 5:
            case 31:
            case 32:
            case 39:
            default:
		logger.warn("Defaulted on DO, sending WONT for b=0x" + Utils.hexString(b));
		this.addTelnetResponse(TN3270EParser.WONT, b);
            }
	    break;
	case TN3270EParser.DONT:
	    logger.debug("-- Verb=DONT");
            switch (b) {
            case TN3270EParser.OPTION_TN3270E:
		this.screen.inTN3270EMode = false;
		this.tn3270EMode = false;
		this.addTelnetResponse(TN3270EParser.WONT, b);
		break;
            case 1:
		(this.Bu = !1);
		this.addTelnetResponse(TN3270EParser.WONT, b);
		break;
            case 25:
		(this.Jh = 0);
		this.addTelnetResponse(TN3270EParser.WONT, b);
		break;
            case 0:
		(this.qh = 0);
		this.addTelnetResponse(TN3270EParser.WONT, b);
		break;
            case 3:
            case 31:
            default:
		this.addTelnetResponse(TN3270EParser.WONT, b);
		logger.warn("Defaulted on DONT, sending WONT for b=0x" + Utils.hexString(b));
            }
            break;
	case TN3270EParser.WONT:
	    logger.debug("-- Verb=WONT");
            switch (b) {
            case TN3270EParser.OPTION_TN3270E:
		logger.warn("Server responded to TN3270 option with WONT, closing connection");
		this.screen.closeConnection(4e3, "Terminal Closed"); // JOE maybe something more specific
		break;
            case 6:
            case 1:
		break;
            case 0:
		this.qh = 0;
            case 3:
            default:
		this.addTelnetResponse(TN3270EParser.DONT, b);
		logger.warn("Defaulted on WONT, sending DONT for b=0x" + Utils.hexString(b));
            }
            break;
	case TN3270EParser.WILL:
	    logger.debug("-- Verb=WILL");
            switch (b) {
            case 0:
		this.qh |= 2;
		if (0 == (4 & this.qh)){
		    this.qh |= 4;
		}
		this.addTelnetResponse(TN3270EParser.DO, b);
		break;
            case 25:
		this.Jh |= 2;
		if (0 == (4 & this.Jh)){
		    this.Jh |= 4;
		}
		this.addTelnetResponse(TN3270EParser.DO, b);
		break;
            case 1:
		if (this.aa){
		    this.Bu = !1;
		    this.addTelnetResponse(TN3270EParser.DONT, b);
		} else {
		    this.Bu = !0;
		    this.addTelnetResponse(TN3270EParser.DO, b);
		}
		break;
            case 3:
		this.sh = !1;
		this.addTelnetResponse(TN3270EParser.DO, b);
		break;
            case TN3270EParser.OPTION_TN3270E:
		if (this.screen.enableTN3270E){ // JOE originally said this.enableTN3270E which is nuts
		    this.screen.convoType = VirtualScreen3270.convoTypes.LULU;
		    console.log("JOE postload going TN3270E");
		    this.screen.inTN3270EMode = true;
		    this.tn3270EMode = true;
		    this.addTelnetResponse(TN3270EParser.DO, b);
		} else {
		    this.addTelnetResponse(TN3270EParser.DONT, b);
		}
		break;
            case 29:
            case 5:
            case 38:
            default:
		this.addTelnetResponse(TN3270EParser.DONT, b);
		logger.warn("Ignoring WILL for b=0x" + Utils.hexString(b));
            }
	}
    }

    /*
      handleSub cannot be understood w/o RFC's
     */

    handleSub() { // (ic.prototype.ca = function () {
	var screen = this.screen; // was t
        var l = this.subData.length; 
	let nextState = 0; // was n
	let logger = Utils.telnetLogger;
	var i = 0;
	if (screen.deviceType){
	    i = screen.deviceType.string.length;
	}
	var e = 0;
        var s = this.subData[e++];
	if (40 === s) { // this says we are at IAC, SB, TN3270E
	    var subState = 0; // the parsing state of this loop
            for (var u;  e < l; ) {
		s = this.subData[e++];
		switch (subState) {
		case 0:
                    if (8 === s){ // SEND == 8
			nextState = 1;
		    } else if (2 === s){ // DEVICE_TYPE == 2 
			nextState = 2;
		    } else if (3 === s){ // FUNCTIONS == 3
			nextState = 3;
		    } else if (1 === s){ // CONNECT == 1
			nextState = 5;
		    } else {
			logger.warn("tn3270 telnet sub type 0x" + Utils.hexString(s) +
				    " found, unknown and unhandled");
		    }
		    break;
		case 1:
                    if (2 === s){
			if (this.screen.deviceType) {
			    var r = [2, 7];
			    var a = screen.deviceType.string;
                            for (var o = 0; o < a.length; o++) {
				r.push(a.charCodeAt(o));
			    }
                            if (this.screen.sessionDeviceName) {
				r.push(1);
				for (let t = 0; t < this.screen.sessionDeviceName.length; t++){ // note shadowing of t
				    r.push(this.screen.sessionDeviceName.charCodeAt(t));
				}
                            }
                            screen.sendNegotiationResponse(40, r);
			} else {
			    logger.severe("No device type defined, cannot respond to telnet sub");
			}
                    } else {
			logger.warn("Requested to send 0x" + Utils.hexString(s) + " but unknown type");
		    }
		    nextState = 0;
		    break;
		case 2:
		    if (4 === s){ // IS == 4
			if (l - e < i + 1){
			    logger.warn("Device type length is shorter than what was given");
			} else { // for (let t = 0; t < i; t++) e++;
			    e += i; // e is pos in input array, i is 
			}
                    } else {
			if (6 === s) { // REJECT ==6
                            if (5 === this.subData[e++]) { // REASON == 5
				let failCode = this.subData[e++];
				this.alertNegotiationFailure(failCode);
				logger.severe("tn3270 sub rejected with reason=0x" + Utils.hexString(failCode));
                            }
                            return;
			}
			logger.warn("Unknown b 0x" + Utils.hexString(s) +
				    " seen under tn3270 sub DEVICE_TYPE");
                    }
                    nextState = 0;
                    break;
		case 5: 
                    u || (u = []), u.push(s), 8 === u.length && ((nextState = 0), (screen.sessionDeviceName = u),
								 screen.sendNegotiationResponse(40, this.capabilitiesToOffer));
                    break;
		case 3: // expecting FUNCTIONS
                    if (4 === s){ // IS == 4 - the reply
			((e === l - 1) ?
			 this.establishCapabilities([]) :
			 this.establishCapabilities(this.subData.slice(e + 1)), (e = l));
                    }else if (7 === s) { // REQUEST == 7
			var c,
                            f = 0,
                            d = [];
			if (e !== l - 1)
                            for (; e < l; )
				(((c = this.subData[e++]) >= 0 && c <= 7) ?
				 ((7 === c || 5 === c) ?
				  !0 === screen.useBetterCapabilities && d.push(c) : 
				  1 !== c && 3 !== c && d.push(c)) :
				 logger.warn("Saw unknown function type 0x" + Utils.hexString(c) +
					     " during tn3270 FUNCTION negotiation"),
				 f++);
			let n;
			d.length === f ? ((n = [3, 4]), this.establishCapabilities(d)) : (n = [3, 7]);
			for (let t = 0; t < d.length; t++) n.push(d[t]); // note shadowing
			screen.sendNegotiationResponse(40, n);
                    } else logger.warn("Unexpected byte 0x" + Utils.hexString(s) +
				       " seen after FUNCTIONS tn3270 sub");
                    nextState = 0;
                    break;
		default:
                    logger.warn("Unhandled 3270e telnet sub type=0x" + Utils.hexString(s));
		}
		subState = nextState;
            }
            5 === subState && ((screen.sessionDeviceName = u),
			       screen.sendNegotiationResponse(40, this.capabilitiesToOffer)); 
	} else if (24 === s) // TELNET TTYPE REQUEST
            if (this.screen.deviceType) {
		let l = [0],
                    n = this.screen.deviceType.string;
		for (let t = 0; t < n.length; t++) l.push(n.charCodeAt(t));
		screen.sendNegotiationResponse(s, l);
            } else logger.severe("No device type defined, cannot respond to telnet sub");
	else logger.severe("Request for telnet sub of type 0x" + Utils.hexString(s) +
			   " but it is not handled");
    }


    // Parse Status
    // 0-NORMAL
    // 3-SEEN_IAC

    // TELNET_IAC 0xFF 255
    // TELNET_EOR 0xEF 239
    // TELNET_SB  0xFA 250
    // TELENT_SE  0XF0 240
    // TELNET_NOP 0xF1 241
    
    // only lc.prototype.Hh calls process 
    process(b:number){ // t is the next byte (ic.prototype.process = function (t) {
	let logger = Utils.parseLogger;
	logger.debug2("Parser Loop Top: b=0x" + Utils.hexString(b) +
		      " state=" + TN3270EParser.telnetStateNames[this.state]+" ("+this.state+")");
	var nextState = 0; // minified as l
	switch (this.state) {
	case TN3270EParser.PARSE_STATE_NONE: // 0
            if (b === TN3270EParser.IAC){ // 255
		nextState = 3;
	    } else {
		this.messageData.push(b);
		if (this.atEndOfHostMessage){
		    if (this.tn3270EMode){
			this.lastHeader = this.read3270DSHeader(this.messageData);
		    }
		    if ((this.lastHeader && 5 === this.lastHeader.dataType) ||
			this.screen.convoType === VirtualScreen3270.convoTypes.NVT) {
			logger.debug("About to parse NVT message:"),
			Utils.hexDump(this.messageData, logger),
			this.handleData(this.messageData);
		    }
		}
	    }
	    break;
	case TN3270EParser.PARSE_STATE_VERB: // 3
            if (255 === b) {
		this.messageData.push(b);
		break;
            }
            if (this.messageData.length > 0) {
		this.tn3270EMode && (this.lastHeader = this.read3270DSHeader(this.messageData));
		logger.debug("About to parse tn3270 message:");
		Utils.hexDump(this.messageData, logger);
		this.handleData(this.messageData);
	    }
            this.previousByte = b;
            nextState = (TN3270EParser.EOR === b ?
			 TN3270EParser.PARSE_STATE_NONE :
			 (TN3270EParser.SB === b ?
			  TN3270EParser.PARSE_STATE_SUB :
			  (TN3270EParser.SE === b || TN3270EParser.NOP === b) ?
			  TN3270EParser.PARSE_STATE_NONE :
			  TN3270EParser.PARSE_STATE_OPTION));
            break;
	case TN3270EParser.PARSE_STATE_OPTION: // 1
            this.handleTelnetNegotiation(b);
	    nextState = 0;
            break;
	case TN3270EParser.PARSE_STATE_SUB:  // 2
            if (255 === b) {
		this.handleSub(), (this.subData = []), (nextState = 3);
		break;
            }
	    this.subData.push(b), (nextState = 2);
	    }
	this.state = nextState;
    }

    read3270DSHeader(messageBytes:any[]):any{ // (ic.prototype.pa = function (t) {
	console.log("JOE postLoad read3270DSHeader() outerMessagePos="+this.outerMessagePos);
	Utils.hexDump(messageBytes,Utils.messageLogger);
	var header:any = {};
	this.outerMessagePos = 0; 
	this.screen.responseDisposition = { Js: TN3270EParser.NO_RESPONSE,
					    Zs: TN3270EParser.NO_RESPONSE};
	header.dataType = messageBytes[this.outerMessagePos++];     // dataType == .Aa
	header.requestFlag = messageBytes[this.outerMessagePos++];  // request flags == .qs
	header.responseFlag = messageBytes[this.outerMessagePos++];  // response flag == .ga
        header.seqNumber = Utils.readU16(messageBytes, this.outerMessagePos);  // seqNumber == .ma
	this.outerMessagePos += 2;
	console.log("JOE postLoad TN3270E mode="+this.screen.inTN3270EMode);
	if (this.screen.inTN3270EMode){
            if (TN3270EParser.DATA_TYPE_3270 == header.dataType ||
		TN3270EParser.DATA_TYPE_SCS == header.dataType){
		if (this.screen.capabilities && 
		    this.screen.capabilities.us){ // capability.us is REASON capability
		    console.log("JOE postLoad header.requestFlag="+header.requestFlag);
		    if (header.requestFlag == 1){
			this.screen.responseDisposition.Js = 1;
		    }
		    if (header.requestFlag == 2){
			this.screen.responseDisposition.Zs = 1;
		    }
		}
	    }
	}
	console.log("JOE read3270DS returning this header = "+JSON.stringify(header));
	return header;
    }
    
    handleData(t:any[]){  // ic.prototype.ba = function (t) {
	// Ea(messageHeader, tail) only called here
	let logger = Utils.protocolLogger;
	if (this.tn3270EMode){
	    logger.debug("Reading TN3270E header before message parse");
	    this.handleDataBody(this.lastHeader, t.slice(this.outerMessagePos));  // JOE array tail
	} else {
	    if (this.screen.convoType === VirtualScreen3270.convoTypes.NVT) {
		this.screen.handleNVTData1(t);
	    } else {
		this.lastHeader = null;
		this.handleDataBody(null, t.slice(this.outerMessagePos));
	    }
	}
	// JOE: are these in the else block or tail of function
	this.outerMessagePos = 0; 
	this.messageData = []; 
    }

    handleDataBody(header:any,l:any[]){ // t is 3270MessageHeader (JSON), l is intarray tail (ic.prototype.Ea = function (t, l) {
	var n;
	let logger = Utils.protocolLogger;
	if (header && this.screen.inTN3270EMode){
	    logger.debug("TN3270E Message header="+JSON.stringify(header));
	    this.screen.convoType = VirtualScreen3270.convoTypes.LULU;
            switch (header.dataType) { // .Aa originally
            case TN3270EParser.DATA_TYPE_SSCPLU:
		this.screen.convoType = VirtualScreen3270.convoTypes.SSCPLU;
		this.screen.handleSSCPData(l);
		break;
            case TN3270EParser.DATA_TYPE_BIND_IMAGE:
		this.screen.bindStatus = true;
		var i = l[26];
		logger.debug("-- Type=BIND_IMAGE");
		logger.debug("---- PS usage=0x" + Utils.hexString(l[14]));
		logger.debug("----LU level=0x" + Utils.hexString(l[15]));
		logger.debug("----Encrypt Data=0x" + Utils.hexString(i));
		logger.debug("Bind status=" + this.screen.bindStatus);
		if (0 != i){
                    throw Exception.runtimeException("encrypted VTAM stuff not supported");
		}
		var e = l[27];
		l.slice(28, 28 + e); // why is value not bound??
		logger.debug("----Primary LU Name: Starts at 0x" + Utils.hexString(27) + ", len=" + e);
		break;
            case TN3270EParser.DATA_TYPE_UNBIND:
		logger.debug("-- Type=UNBIND");
		this.screen.bindStatus = false;
		logger.debug("Unbind status=" + this.screen.bindStatus);
		break;
            case TN3270EParser.DATA_TYPE_NVT:
		logger.debug("-- Type=NVT");
		this.screen.handleNVTData2(l); 
		break;
            case TN3270EParser.DATA_TYPE_RESPONSE:
		logger.debug("-- Type=RESPONSE");
		logger.debug("** Skipping **");
		break;
            case TN3270EParser.DATA_TYPE_9:
		logger.debug("-- Type=BID b=0x09");
		break;
            case TN3270EParser.DATA_TYPE_3270:
		logger.debug("-- Type=3270_DATA");
		this.screen.convoType = VirtualScreen3270.convoTypes.LULU;
		n = this.parseCommands(l); // commands are the top-level in 3270DS
		break;
            default:
		logger.debug("-- Type=UNKNOWN");
		logger.warn("Unknown message header dataType=0x" + Utils.hexString(header.dataType));
		return false;
            }
	} else {
	    n = this.parseCommands(l); 
	}
	if (n) {
	    this.screen.processTN3270Command(n); 
	} else {
	    if (this.screen.responseDisposition != TN3270EParser.NO_RESPONSE) {
		this.screen.doPostLoadStuff(); 
		this.screen.showScreen(); 
	    }
	    logger.debug("No action taken on 3270 message, no commandJSON generated");
	}
	let shouldRespond = false;
        let u = true;
        let h = this.screen.errorStringOrNeg1;
	if (header){
	    console.log("JOE BID capabilities="+JSON.stringify(this.screen.capabilities)+
			" this.screen.errorStringOrNeg1="+this.screen.errorStringOrNeg1);
            if (this.screen.capabilities && this.screen.capabilities.us && 9 === header.dataType){
		logger.debug("-- BID response");
		shouldRespond = true;
		header.responseFlag = 2;
		if (4 !== header.requestFlag){
		    if (this.screen.Vs.zs){ // NEEDSWORK .Vs
			h = "0813";
			logger.debug("--BID 0813");
			u = false;
		    } else if (this.screen.Vs.Hs){ // NEEDSWORK .Vs
			h = "081B";
			logger.debug("--BID 081B");
			u = false;
		    } else {
			h = -1;
			this.screen.Vs.zs = 1;  // NEEDSWORK .Vs
			logger.debug("--BID Change direction");
			this.screen.Su(2);
		    }
		} else {
		    h = -1;
		    this.screen.Vs.zs = 1;
		    logger.debug("--BID Signal Change direction");
		    this.screen.Su(2);
		}
	    } else if (0 !== header.responseFlag){
		console.log("JOE generic response true");
		shouldRespond = true;
	    }
	}
	if (shouldRespond){
	    console.log("JOE should respond h="+h+" u="+u+
			" header.responseFlag="+header.responseFlag);
            let l = (0xFF00 & header.seqNumber) >> 8;
            let n = (0xFF & header.seqNumber);
            let i:number[] = [];
	    if (2 === header.responseFlag){
		logger.debug("-- Response Type:ALWAYS-RESPONSE "),
		-1 !== h ? (u && this.Ra(h),
			    logger.debug("-- Negative Response; Error Type: " + h),
			    (i = this.buildResponse(h, l, n))) :
		    (logger.debug("-- Positive Response"),
		     (i = [2, 0, 0]),
		     Utils.pushTelnetByte(i, l),
		     Utils.pushTelnetByte(i, n),
		     i.push(0));
	    } else if (1 === header.responseFlag) {
		if (-1 === h) return;
		u &&
		    this.Ra(h),
		logger.debug("-- Response type: IF ERROR"),
		logger.debug("-- Negative Response; Error Type: " + h),
		(i = this.buildResponse(h, l, n));
		}
	    logger.debug("Sending TN3270 message response. Seq Num=" + header.seqNumber),
	    Utils.messageLogger.debug("Sending TN3270E message response, dump follows"),
	    this.screen.eorAndSend(i);
	} else -1 !== h && this.Ra(h);
    }

    buildResponse(errorOrNeg1:any, seqHi:number, seqLo:number):number[]{ // (ic.prototype.ya = function (t, l, n) {
	let response:number[] = [2, 0]; // datatype is 2, requestFlag is 0
	
	if (this.screen.capabilities && !this.screen.capabilities.ns) {
	    response.push(1);
	    Utils.pushTelnetByte(response, seqHi);
	    Utils.pushTelnetByte(response, seqLo);
	    response.push(0);
	} else {
            response.push(2);
	    Utils.pushTelnetByte(response, seqHi);
	    Utils.pushTelnetByte(response, seqLo);
	    let s = this.screen.$s.get(errorOrNeg1); // NEEDSWORK .$s
	    let e = s;
	    if (e){
		this.buildErrorBytes(s.gs); // .gs is one of the error/alert map entry's properties
	    } else {
		this.buildErrorBytes(errorOrNeg1);
	    }
	    response = response.concat(e);
	}
	return response;
    }

    Ra(t:any){ // error|status sender (ic.prototype.Ra = function (t) {
	let l = null;
	if ("753" === t) {
	    l = [55, 53, 51];
	} else if ("752" === t){
	    l = [55, 53, 50]; // ascii
	} else if ("750" === t){
	    l = [55, 53, 48]; // ascii bytes
	} else if ("763" === t){
	    l = [55, 54, 51];
	}
	this.screen.errorStringOrNeg1 = -1; // this is the errorString or -1 abortion
	this.screen.Su(4, l); 
    }

    buildErrorBytes(errorOrNeg1:any){ // ic.prototype.Ca = function (t) {
	let l = [];
	switch (errorOrNeg1) {
	case "1003":
            l.push(16, 3, 0, 0);
            break;
	case "0820":
            l.push(8, 2, 0, 0);
            break;
	case "1005":
            l.push(16, 5, 0, 0);
            break;
	case "0831":
            l.push(8, 49, 0, 0);
            break;
	case "0813":
            l.push(8, 19, 0, 0);
            break;
	case "081B":
            l.push(8, 27, 0, 0);
            break;
	default:
            Utils.messageLogger.debug("Unknow negative response error code");
	}
	return l;
    }

    static Na(t:number[],
	      l:number,
	      n:number,
	      i:number,
	      e:number[],
	      s:number):number {  //ic.Na = function (t, l, n, i, e, s) {
	var u = i - s;
	if (i >= s) {
            for (var h = 0; h < u; ) {
		for (var r = !0, a = 0; a < s; a++)
                    if (t[l + n + h + a] != e[a]) {
			r = !1;
			break;
                    }
		if (r) return l + n + h;
		h++;
            }
            return -1;
	}
	return -1;
    }

    establishCapabilities(t:number[]){  // (ic.prototype.oa = function (t) {
	var l,
            n = this.screen,
            i = false,
            e = false,
            s = false,
            u = false,
            h = false,
            r = false,
            a = false,
            o = 0;
	if (t.length > 0){
            for (; o < t.length; )
		0 === (l = t[o++]) // ASSOCIATE
            ? (i = !0)
            : 2 === l  // DEVICE-TYPE
            ? (e = !0)
            : 4 === l  // IS
            ? (s = !0)
            : 1 === l  // CONNECT
            ? (r = !0)
            : 3 === l  // FUNCTIONS
            ? (h = !0)
            : 5 === l  // REASON
            ? (a = !0)
            : 7 === l  // REQUEST
            ? (u = !0)
            : Utils.telnetLogger.warn("Unknown function type 0x" + Utils.hexString(l) +
		" during tn3270 FUNCTION negotiation");
	}
	n.capabilities = new TN3270Capabilities(i, e, s, u, h, r, a);
	//n.Ns new Zo(i, e, s, u, h, r, a); //  what is this??  a becomes Ns.us REASON
        //            $e ts ls ns es ss us  //                  u becomes Ns.ns REQUEST
	// only Ns.us and Ns.ns are referenced, so far
    }

    alertNegotiationFailure(failCode:number){ // (ic.prototype.fa = function (t) {
	let l;
	switch (failCode) {
	case 0:
            l = "CONN-PARTNER";
            break;
	case 1:
            l = "DEVICE-IN-USE";
            break;
	case 2:
            l = "INV-ASSOCIATE";
            break;
	case 3:
            l = "INV-NAME";
            break;
	case 4:
            l = "INV-DEVICE-TYPE";
            break;
	case 5:
            l = "TYPE-NAME-ERROR";
            break;
	case 6:
            l = "UNKNOWN-ERROR";
            break;
	case 7:
            l = "UNSUPPORTED-REQ";
            break;
	default:
            l = "UNKNOWN";
	}
	const n:any = TN3270EParser.failureExplanations[l];
        const message = `Connection to host is rejected.\nHost: ${this.screen.bi.host}\nPort: ${this.screen.bi.port}\nReason Name: ${l}\nReason: ${n}`;
	alert(message);
    }

    // prototype.Sa() is parseWrite with its many boolean rags
    // prototype.Ta() is parseWSF
    parseCommands(t:number[]){ // ka(t){  // t is a byteArray -- (ic.prototype.ka = function (t) {
	let logger = Utils.protocolLogger;
	let implicitPartition = VirtualScreen3270.IMPLICIT_PARTITION;
	var l = t.length;
	if (0 !== l) {
            var n,
		i = 255 & t[0];
	    this.screen.errorStringOrNeg1 = -1;
	    logger.debug("Parsing TN3270 message data. Length=" + l + ", Command b=0x" + Utils.hexString(i));
            switch (i){
            case TN3270EParser.COMMAND_WRITE:
            case TN3270EParser.COMMAND_WRITE_LOCAL:
            case TN3270EParser.COMMAND_WRITE_ASCII:
		logger.debug("-- Type=WRITE"), (n = this.parseWrite(t, 0, l, implicitPartition, false, false, false));
		break;
            case TN3270EParser.COMMAND_ERASE_WRITE:
            case TN3270EParser.COMMAND_ERASE_WRITE_LOCAL:
            case TN3270EParser.COMMAND_ERASE_WRITE_ASCII:
		logger.debug("-- Type=ERASE_WRITE"), (n = this.parseWrite(t, 0, l, implicitPartition, true, false, false));
		break;
            case TN3270EParser.COMMAND_ERASE_WRITE_ALTERNATE:
            case TN3270EParser.COMMAND_ERASE_WRITE_ALTERNATE_LOCAL:
            case TN3270EParser.COMMAND_ERASE_WRITE_ALTERNATE_ASCII:
		logger.debug("-- Type=WRITE_ALTERNATE"), (n = this.parseWrite(t, 0, l, implicitPartition, true, false, true));
		break;
            case TN3270EParser.COMMAND_ERASE_ALL_UNPROTECTED:
            case TN3270EParser.COMMAND_ERASE_ALL_UNPROTECTED_LOCAL:
            case TN3270EParser.COMMAND_ERASE_ALL_UNPROTECTED_ASCII:
		logger.debug("-- Type=ERASE_ALL_UNPROTECTED"), (n = this.parseWrite(t, 0, l, implicitPartition, !1, !1, !1));
		break;
            case TN3270EParser.COMMAND_WRITE_STRUCTURED_FIELD:
            case TN3270EParser.COMMAND_WRITE_STRUCTURED_FIELD_LOCAL:
		logger.debug("-- Type=WRITE_STRUCTURED_FIELD"), (n = this.parseWSF(t, 0, l, true));
		break;
            case TN3270EParser.AID_ENTER_KEY: // 125
		logger.debug("-- Type=AID_ENTER_KEY");
		logger.warn("Unhandled: Enter AID seen in 3270 message data");
		Utils.hexDump(t, logger);
		break;
            case TN3270EParser.AID_STRUCTURED_FIELD: // 136
		logger.debug("-- Type=AID_STRUCTURED_FIELD");
		Utils.hexDump(t, logger);
		break;
            case TN3270EParser.COMMAND_READ_BUFFER:
            case TN3270EParser.COMMAND_READ_BUFFER_LOCAL:
            case TN3270EParser.COMMAND_READ_BUFFER_ASCII:
            case TN3270EParser.COMMAND_READ_MODIFIED:
            case TN3270EParser.COMMAND_READ_MODIFIED_LOCAL:
            case TN3270EParser.COMMAND_READ_MODIFIED_ASCII:
            case TN3270EParser.COMMAND_READ_MODIFIED_ALL:
            case TN3270EParser.COMMAND_READ_MODIFIED_ALL_LOCAL:
            case TN3270EParser.COMMAND_READ_MODIFIED_ALL_ASCII:
		n = { key: i };
		break;
            default:
		logger.warn("Unsupported TN3270 command 0x" + Utils.hexString(i));
		let e = { type: "O_COM", code: "750", status: false, gs: "1003" };
		this.screen.oh(this.screen.$s, e); // accumulate errors
		this.screen.fh(); // NEEDSWORK (have minified impl)
		return null;
            }
            return n;
	}	
    }

    /**
       startPos was l
       erase first was e
       useAlternate was u

       returns what parseWriteOrders 
       
       but augments with key=command, plus
       
    */
    
     // (ic.prototype.Sa = function (t, l, n, i, e, s, u) {
    parseWrite(t:number[],
	       startPos:number,
	       n:number,
	       partitionID:number,
	       eraseFirst:boolean,
	       resizeProhibited:boolean,
	       useAlternate:boolean):any {
	let logger = Utils.protocolLogger; // aka "Za"
	var commandByte = 0;  // was h
	for (var r = startPos;
	     (commandByte = Utils.pseudoRead(t, r++, n)) === 0;
	    ){
	    logger.debug("junk byte 0x00 in TN3270EMessage");
	}
	switch (commandByte) {
	case TN3270EParser.COMMAND_WRITE = 0xF1: // 241
	case TN3270EParser.COMMAND_WRITE_LOCAL:
	case TN3270EParser.COMMAND_WRITE_ASCII:
	case TN3270EParser.COMMAND_ERASE_WRITE: // 245
	case TN3270EParser.COMMAND_ERASE_WRITE_LOCAL:
	case TN3270EParser.COMMAND_ERASE_WRITE_ASCII:
	case TN3270EParser.COMMAND_ERASE_WRITE_ALTERNATE: // 126
	case TN3270EParser.COMMAND_ERASE_WRITE_ALTERNATE_LOCAL:
	case TN3270EParser.COMMAND_ERASE_WRITE_ALTERNATE_ASCII:
            var a:any = this.parseWriteOrders(t, r, n);
            a.key = commandByte;
	    a.partitionID = partitionID; // was a.Ju = i;
	    a.eraseFirst = eraseFirst;   // a.Zu = e; 
	    a.resizeProhibited = resizeProhibited; // a.Xu = s;
	    a.useAlternate = useAlternate; // a.js = u;
	    return a;
	case TN3270EParser.COMMAND_ERASE_ALL_UNPROTECTED: // 111
        case TN3270EParser.COMMAND_ERASE_ALL_UNPROTECTED_LOCAL:
        case TN3270EParser.COMMAND_ERASE_ALL_UNPROTECTED_ASCII:
	    // this is so irregular, some cases return values,
	    // others do things immediately, blecch.
            this.screen.handleEraseAllUnprotected(); // NEEDSWORK
            break;
	case TN3270EParser.COMMAND_WRITE_STRUCTURED_FIELD: // 243
	case TN3270EParser.COMMAND_WRITE_STRUCTURED_FIELD_LOCAL:
	case -1234567:
	default:
            throw Exception.runtimeException("**** unexpected command byte 0x" + Utils.hexString(commandByte) + " *****");
	}
    }

    static Y:number[] = [4, 5]; // don't really know what this is, a message fragment

    // this returns an order
    parseWSF(t:number[],
	     startPos:number,
	     endPos:number,
	     isOutbound:boolean):any { // (ic.prototype.Ta = function (t, l, n, i) {
	let logger = Utils.protocolLogger; // was "Za"
	var e = startPos + 1; // skipping the command byte 0xF3
	// t[startPos]; // this is side-effect free junk expression that we don't need
        var recordLength = endPos;
	var n;
	logger.debug("ParseSF.recordLength=0x" + Utils.hexString(recordLength) +
		     " startPos=0x" + Utils.hexString(startPos) +
		     ", endPos=0x" + Utils.hexString(endPos));
	Utils.hexDump(t, logger, startPos, endPos);
	var order:any = { key: 243, structuredFields: [] }; // was r
	var partitionID = 0; // u
	var flags = 0;       // was h
	while (e < endPos){
            if (e + 2 >= endPos) {
		logger.warn("Mal-formed structured field, no Length-and-type");
		break;
            }
            let a = Utils.readU16(t, e);
            logger.debug("structuredFieldLength=0x" +Utils.hexString(a));
	    if (a == 0){
		logger.info("Taking rest of data for structured field length 0000");
		a = endPos - e;
	    }
            let type = t[e + 2]&0xFF; // was o
	    // on the following line l should be 0 because of analogy
	    let ell:number = 0; // not l
	    if (type == 15 || type == 16){ // these are extended two-byte type introducers
		let lowTypeByte = t[e+3]&0xFF;
		type = (type<<8)|lowTypeByte;
	    }
	    logger.debug("Parsing StructuredField type=0x" + Utils.hexString(type));
            switch (type) {
            case TN3270EParser.STRFLD_QUERY_REPLY: // 129
		if (isOutbound) {
		    logger.warn("Query reply seen in host's outbound 3270 data stream");
		} else {
		    logger.warn("Need to handle a query reply"); // JOE i assume this is being seen by screen
		}
		break;
            case TN3270EParser.STRFLD_ERASE_RESET: // 3
		var eraseResetFlags = t[e + 3]&0xFF;
		logger.debug("StructuredField: ERASE/RESET" +
			     " - (new implicit partition default characteristics and size) "+
			     "flags=0x" + Utils.hexString(eraseResetFlags)),
		logger.debug("  -- high bit in flags implies alternate size active"),
		// Ugly code warning for this part of the code - setting all sorts of undeclared
		    // props into the TN3270EParser object.
		this.usingAlternateSize = 0 != (128 & eraseResetFlags); // use alternate size
		this.currentPartitionID = 0;
		this.partitionState = 0; // this.Os = 0
		this.partitionInfoMap = { 0: { amode: false, size: this.screen.size } }; // JOE - was this.size
		this.screen.handleErase(false, this.usingAlternateSize);
		logger.debug("StructuredField: ERASE/RESET current partition ID=" + this.currentPartitionID);
		logger.debug("StructuredField: ERASE/RESET current partition state=" + this.partitionState);
		logger.debug("StructuredField: ERASE/RESET current partition amode=" +
			     this.partitionInfoMap[this.currentPartitionID].amode);
		logger.debug("StructuredField: ERASE/RESET current partition size=" +
			     this.partitionInfoMap[this.currentPartitionID].size);
		break;
            case TN3270EParser.STRFLD_CREATE_PARTN: // 12
		partitionID = t[e + 3]&0xFF;
		var byte4 = t[e + 4]&0xFF;  // was f
                var unitsOfMeasure = (0xF0 & byte4) >> 4;
                var addressMode = byte4&0x0F;
		flags = t[e + 5]&0xFF;
		let presentationH = Utils.readU16(t, e + 6), // was v
                    presentationW  = Utils.readU16(t, e + 8), // was p
                    viewportY = Utils.readU16(t, e + 10),     // was A
                    viewportX = Utils.readU16(t, e + 12),     // was B
                    viewportH = Utils.readU16(t, e + 14),
                    viewportW = Utils.readU16(t, e + 16),
                    viewportPresentationY = Utils.readU16(t, e + 18),
                    viewportPresentationX = Utils.readU16(t, e + 20),
		    vscrollAmount = Utils.readU16(t, e + 22),
		    /* bytes 24=25 reserved */
		    charWidthInPoints = Utils.readU16(t, e + 26),
		    charHeightInPoints = Utils.readU16(t, e + 28),
                    S = TN3270EParser.Na(t, ell, 30, a - 30, TN3270EParser.Y, 2); // Self-defining parm stuff
		let screenWidth = this.screen.getAlternateWidth(),
                    screenHeight = this.screen.getAlternateHeight();
		console.log("JOE sw="+screenWidth+" pw="+presentationW+" sh="+screenHeight+" ph="+presentationH);
		if (screenWidth < presentationW || screenHeight < presentationH) {
                    let t = { type: "create_partition_was_ra", code: "763", status: !1, gs: "1005" };
                    this.screen.oh(this.screen.$s, t); 
		    this.screen.fh(); // NEEDSWORK (have minified impl)
		    return null;
		}
		if (this.usingAlternateSize){
                    let t = this.partitionInfoMap[this.currentPartitionID];
                    if (t) {
			t.size = presentationH * presentationW;
			this.screen.resize(presentationW, presentationH);
		    }
		}
		logger.debug("StructuredField: CREATE_PARTITION pid=" + partitionID +
			     " uom=0x" + Utils.hexString(unitsOfMeasure) +
			     " aMode=0x" + Utils.hexString(addressMode) +
			     " flags=0x" + Utils.hexString(flags)),
		logger.debug("  -- if implicit partition state, destroy it and make new partition with new PID"),
		logger.debug("  -- if explicit partition state, clobber PID with same value and rebuild"),
		logger.debug("  presSpace width =" + presentationW + " height=" + presentationH),
		logger.debug("  viewport  column=" + viewportX + "    row=" + viewportY),
		logger.debug("  viewport  width =" + viewportW + " height=" + viewportH),
		logger.debug("  origin    column=" + viewportPresentationX + "    row=" + viewportPresentationY),
		logger.debug("  presentationSpaceType       =" + (-1 != S ? t[ell + S] : 999999));
		    break;
            case TN3270EParser.STRFLD_LOAD_PROGRAMMED_SYMBOLS:
                logger.debug("Ignoring LOAD_PROGRAMMED_SYMBOLS Structured field");
		break;
            case TN3270EParser.STRFLD_PCLK_PROTOCOL:
	        logger.debug("Ignoring PCLK_PROTOCOL Structured field");
		    break;
	    case TN3270EParser.STRFLD_DESTINATION_ORIGIN:
	        logger.debug("Ignoring DESTINATION_ORIGIN Structured field");
		break;
	    case TN3270EParser.STRFLD_OEM_DATA:
	        logger.debug("Ignoring OEM_DATA Structured field");
		break;
            case TN3270EParser.STRFLD_OBJECT_DATA:
            case TN3270EParser.STRFLD_OBJECT_PICTURE:
            case TN3270EParser.STRFLD_OBJECT_CONTROL:
		let U = this.parseObjectData(t, e, a, type, isOutbound); 
		U && order.structuredFields.push(U);
		break;
            case TN3270EParser.STRFLD_READ_PARTN:
                let L:any = { key: 1 };
		partitionID = t[e + 3]&0xFF; /* 0-0x7E is read ops, 0xFF, query ops */
		var readPartitionType = t[e + 4]&0xF; /* 2-Query, 3-QueryList, 0x6E-readmodfdall, 0xF2-readBuf 0xF6 ReadMod */
		// here - look at book
		logger.debug("READ PARTITION seen at record position=0x" + Utils.hexString(e));
		Utils.hexDump(t, logger, startPos, e + a);
		if (partitionID == 0xFF && readPartitionType === 2){
                    logger.debug("StructuredField: READ PARTITION - request for all terminal capabilities");
		    L.Uh = "all";
		    L.sub = 258;
		} else if (partitionID == 0xFF && readPartitionType === 3){
                    L.sub = 259;
                    var R = e + 6,
			y = a - 6;
                    logger.debug("StructuredField: READ PARTITION - request for selected terminal capabilities");
		    Utils.hexDump(t, logger, ell + R, y); // worry about ell for l swap
		    L.Uh = "specific";
		    L.Lh = [];
                    for (var C = 0; C < y; C++) {
			var N = t[R + C];
			L.Lh.push(N);
                    }
		} else {
		    L.sub = readPartitionType;
		    L.Bh = partitionID;
		    logger.debug("StructuredField: READ PARTITION structured field, length=0x" + Utils.hexString(a) +
				 " pid=0x" + Utils.hexString(partitionID) +
				 ", readPartitionType=0x" + Utils.hexString(readPartitionType));
		}
		order.structuredFields.push(L);
		break;
            case TN3270EParser.STRFLD_SET_REPLY_MODE:
		partitionID = t[ e + 3]&0xFF;
		let mode = t[ e + 4]&0xFF,
                    attrList = [],
                    attrListOffset = 5;
		while (attrListOffset < a) attrList.push(t[ e + attrListOffset++]&0xFF);
		order.structuredFields.push({ key: 9, Bh: partitionID, mode: mode, Fa: attrList });
		break;
            case TN3270EParser.STRFLD_RESET_PARTN:
		partitionID = t[ e + 3]&0xFF;
		order.structuredFields.push({ key: 0, Bh: partitionID });
		logger.debug("StructuredField: RESET PARTITION structured field, length=0x" + Utils.hexString(a) +
			     " pid=0x" + Utils.hexString(partitionID));
		break;
            case TN3270EParser.STRFLD_OUTBOUND_3270_DATA_STREAM:
		var u = t[ e + 3]&0xFF,
	            command = t[ e + 4]&0xFF,
                    wcc = t[ e + 5]&0xFF,
                    wdt = Utils.readU16(t, e + 6);
		logger.debug("StructuredField: 0utbound 3270DS structured field, length=0x" + Utils.hexString(a) +
			     " pid=0x" + Utils.hexString(partitionID) + ", command=0x" + Utils.hexString(command) +
			     " wcc=0x" + Utils.hexString(wcc) + " weirdDataThing=0x" + Utils.hexString(wdt));
		var D = e + 4,
                    x = a - 4,
                    eraseFirst = (command == TN3270EParser.COMMAND_ERASE_WRITE ||
				  command == TN3270EParser.COMMAND_ERASE_WRITE_ALTERNATE);
                let Q:any = { key: 64 };
		logger.debug("Sub.handleWrite at embeddedStart=0x" + Utils.hexString(D) +
			     " len=0x" + Utils.hexString(x));
		Utils.hexDump(t, logger, D, x);
		var M = this.parseWrite(t, D, D + x, partitionID, eraseFirst, true, false);
		if (M) {
		    Q.Qh = M; 
		}
		order.structuredFields.push(Q);
		break;
            case TN3270EParser.STRFLD_INBOUND_3270_DATA_STREAM:
		logger.warn("Unhandled inbound 3270DS structured field");
		break;
            default:
		logger.warn("unhandled " + (isOutbound ? "outbound" : "inbound") + " structured field seen 0x" + Utils.hexString(type) + ", len=" + a);
            }
            e += a;
	}
	return order;
    }

    incorporatePrintableChars(orderList:any[]):any[]{ // (ic.Ia = function (t, l) {
	if (this.printableChars.length > 0){
	    orderList.push({ key: 16777215, data: this.printableChars.slice() });
	    this.printableChars = [];  // was "parser.ha"
	}
	return orderList;
    }

    addPrintableChar(c:number,isGraphic:boolean){ // (ic.Da = function (t, l, n) {
	if (isGraphic){
	    this.printableChars.push(8); // graphic escape mark
	}
	this.printableChars.push(c);
    }

    /**
	returns { orders: orders, // - an array of orders
                  wcc: wcc };

     */
    parseWriteOrders(t:number[],startIndex:number, n:number) { // (ic.prototype.xa = function (t, l, n) {
	let logger = Utils.protocolLogger;
	var orders = [];
	var i = startIndex;
	var e = Utils.pseudoRead(t, i++, n); // HERE this is the WCC saved until returning the order
	for (var done = false ; !done; ) {
            var h = Utils.pseudoRead(t, i++, n);
            switch (h) {
            case TN3270EParser.ORDER_SET_BUFFER_ADDRESS:
		orders = this.incorporatePrintableChars(orders);
		orders.push({ key: 17, wh: Utils.pseudoRead(t, i++, n), vh: Utils.pseudoRead(t, i++, n) });
            break;
            case TN3270EParser.ORDER_START_FIELD:
		orders = this.incorporatePrintableChars(orders);
		orders.push({ key: 29, ah: Utils.pseudoRead(t, i++, n) });
		break;
            case TN3270EParser.ORDER_START_FIELD_EXTENDED:
            case TN3270EParser.ORDER_MODIFY_FIELD:
		orders = this.incorporatePrintableChars(orders);
		var r = Utils.pseudoRead(t, i++, n);
                let l:any = { key: h };
		for (var a = 0; a < r; a++) {
                    let e = Utils.pseudoRead(t, i++, n),
			s = Utils.pseudoRead(t, i++, n);
                    l["0x" + Utils.hexString(e)] = s;
		}
		orders.push(l);
		break;
            case TN3270EParser.ORDER_SET_ATTRIBUTE:
		orders = this.incorporatePrintableChars(orders);
                let e:any = { key: 40 },
                    R = Utils.pseudoRead(t, i++, n),
                    y = Utils.pseudoRead(t, i++, n);
		e["0x" + Utils.hexString(R)] = y;
		orders.push(e);
		break;
            case TN3270EParser.ORDER_INSERT_CURSOR:
		orders = this.incorporatePrintableChars(orders);
		orders.push({ key: 19 });
		break;
            case TN3270EParser.ORDER_PROGRAM_TAB:
		orders = this.incorporatePrintableChars(orders);
		orders.push({ key: 5 });
		break;
            case TN3270EParser.ORDER_REPEAT_TO_ADDRESS:
		orders = this.incorporatePrintableChars(orders);
		var bufferAddressByte1 = Utils.pseudoRead(t, i++, n), // o
                    bufferAddressByte2 = Utils.pseudoRead(t, i++, n), // c
                    ch = Utils.pseudoRead(t, i++, n),
                    isGraphic = false;
		if (ch == 8){
		    logger.debug("GraphicEscape repeatTo");
		    isGraphic = true;
		    ch = Utils.pseudoRead(t, i++, n);
		}
		var orderName = "O_RTA";
                var hasSpecificChar = true;
		if (ch == 0){
		    orderName = "O_RN"; // repeat nulls
		    hasSpecificChar = false;
		} else if (ch == 0x40){    // repeat blanks
		    orderName = "O_RB";
		    hasSpecificChar = false;
		}
                let order:any = { key: 60, orderName: orderName, b1: bufferAddressByte1, b2: bufferAddressByte2,
			      isGraphic: isGraphic };
		if (hasSpecificChar){
		    order.specificChar = ch;
		}
		orders.push(order);
		break;
            case TN3270EParser.ORDER_GRAPHIC_ESCAPE:
		var p = Utils.pseudoRead(t, i++, n);
		if (p < 0x40) { // below EBCDIC blank
		    // if this error occurs, this reading will really send things to hell, but...
                    var A = Utils.pseudoRead(t, i++, n),
			b = Utils.pseudoRead(t, i++, n),
			g = Utils.pseudoRead(t, i++, n),
			m = Utils.pseudoRead(t, i++, n),
			E = Utils.pseudoRead(t, i++, n),
			k = Utils.pseudoRead(t, i++, n);
		    logger.debug("GraphicEscape preceding non-printing chars char=0x" + Utils.hexString(p) +
				 ", next chars 0x" + Utils.hexString(A) + " 0x" + Utils.hexString(b) +
				 " 0x" + Utils.hexString(g) + " 0x" + Utils.hexString(m) + " 0x" +
				 Utils.hexString(E) + " 0x" + Utils.hexString(k));
                    return false;
		}
		this.addPrintableChar( p, true);
		break;
            case TN3270EParser.ORDER_ERASE_UNPROTECTED_TO_ADDRESS:
		orders = this.incorporatePrintableChars(orders);
		var S = Utils.pseudoRead(t, i++, n),
                    T = Utils.pseudoRead(t, i++, n);
		orders.push({ key: 18, wh: S, vh: T });
		break;
            case -1: // EOF-ish value from Utils.pseudoRead
		done = true;
		break;
            default: // this is the non-special case of just writing a char at buffer address
		this.addPrintableChar(h,false);
            }
	}
	orders = this.incorporatePrintableChars(orders);
	return { orders: orders,
		 wcc: e };
    }

    parseObjectData(data:number[],
		    startPos:number, // points at SF length
		    length:number,   // including length 
		    structuredFieldType:number,
		    isOutbound:boolean){ // (ic.prototype.Pa = function (t, l, n, i, e) {
	/*
	  0x0F11 - control
	  0x0F10 - picture 
	  0x0F09 - data
	  the first 7 bytes
	  length - 2 bytes
          SF type - 2 bytes above
	  ID
	  flags - for fragmentation and reassembly - 0x80 is isFirst 0x40 isLast
	  
	  the payload, relative to fragmentation and reassembly, is the chunk w/o the 7 intro bytes
	*/
	let logger = Utils.protocolLogger;
	let fragFlags = data[startPos+5];
	Utils.protocolLogger.debug("parse object structured field "+data+" from "+startPos);
	this.screen.graphicsState.ingestFragment(fragFlags,structuredFieldType,data,startPos+7,length-7);
	return null;
    }

    // seems like it belongs here, but on wrong class in minified
    Fe(){ // (So.prototype.Fe = function () {
	let logger = Utils.messageLogger;
	if (this.messageName && this.responseBuffer.length > 0) {
            var encodedString = Utils.base64Encode(this.responseBuffer);
	    var jsonMessage = { t: this.messageName, data: encodedString };
            logger.debug("sending telnet options, dump follows");
	    Utils.hexDump(this.responseBuffer, logger);
	    if (this.screen.websocket != null){
		this.screen.websocket.send(JSON.stringify(jsonMessage));
		this.responseBuffer = [];
	    }
	}
    }


}

export class VirtualScreen3270 extends PagedVirtualScreen {   // minified as lc
    username:string;
    password:string;

    deviceType:any;
    enableTN3270E:boolean; // this really should be called isTN3270Capable
    useBetterCapabilities:boolean;  // govern functions or capabilities in Tn3270 protocol
    capabilities:any = null;   // minimized this.Ns; - this is weird that not always filled
    inTN3270EMode:boolean; // minified this.Ps = !1;

    sessionType:string;
    sessionDeviceName:any;

    currentPartitionID:number; // I have seen null checks, so...
    partitionInfoMap:any;
    partitionState:number;

    alternateWidth:number;
    alternateHeight:number;
    usingAlternateSize:boolean;

    convoType:number;
    ipAddress:string|null = null; // was this.Xh

    // poorly understood stuff
    Ts:number; // bound, not used, I think.
    replyMode:number; // replyMode, also has per-partition thing - was .Fs
    Ds:boolean;
    Ls:any;  // see notes in constructor
    Vs:any;
    Ys:any;  // a setInterval interval ID
    responseDisposition:any;
    errorStringOrNeg1:any;
    $s:Map<any,any>;
    tu:boolean;
    ii:any;
    bindStatus:boolean;
    nu:boolean;
    iu:number;
    eu:any;
    su:any;
    ou:boolean;
    cu:boolean;
    fu:boolean;
    parser:TN3270EParser|null;
    Cu:any;
    na:any; // something to do with keepAlive
    Vu:any;
    graphicsWidth:number = 0; // probably obsolete, only set, never used
    graphicsHeight:number = 0; // probably obsolete, only set, never used
    Iu:any; // OIA stuff?
    Tr:any[] = [];  // probably obsolete, only set, never used
    Sr:boolean = false; // probably obsolete, only set, never used
    latestDemoScreenContext:any;  // something that only seem to be used in demo code

    // Graphics extensions
    graphicsState:GraphicsState = new GraphicsState();

    static REPLY_MODE_FIELD = 0; // old
    static REPLY_MODE_EXTENDED = 1; // extended field attribues
    static REPLY_MODE_CHARACTER = 2; // per-character attributes (most feature-rich)
        
    constructor(width:number, height:number){ // function lc(t, n) {
	super(width,height);
	this.ti = 0;
	this.canvas = null;
	this.selectionCanvas = null;
	this.parentDiv = null;
	this.oiaEnabled = 1;
	this.width = width;
	this.height = height;
	this.On = VirtualScreen.co.In;
	this.oiaLine = new OIALine(this, this.width); // this.Mn = new Eo(this, this.width);
	this.Kl = new Array(this.height * width);
	this.renderer = null; // minified as this.Un
	this.defaultWidth = 80;  // minified as this.Ln = 80;
	this.defaultHeight = 24; //             this.Bn = 24;
	this._n = [];
	this.websocket = null;  // was minified this.Wn
	/* all of these input-handling instance vars are owned by base class */
	// this.Qn = 0; modifiers
	// Bounds:
	// this.Tl = null;
	// this.Sl = null;
	// this.Rl = null;
	// this.yl = null;
	// this.Gn = false; = mouseIsDown
	this.jn = false;
	this.Vn = "rgb(255,255,255)";
	this.zn; // holds customizations, see start3270()
	this.username = "";
	this.password = "";
	this.size = width * height;
	this.screenElements = new Array(this.size); // minified this.jl
	// this is an official 3270 term about whether any fields are defined on screen
	// things can be formatted or not
	this.isFormatted = false;  // this.Vl
	this.isFieldDataMapCached = false; // this.Ue = false
	this.fieldDataMap = {};   // minified this.xe = {}; - an association of <Integer,FieldData>
	this.Be = -1; // defined in Oo (parent) class, never used, so I don't know
	this.clear();
	this.cursorPos = 0; // minified as this.kl = 0;
	this.bufferPos = 0; // minified as this.Oe = 0; 
	this.Ft = CharsetInfo.TERMINAL_DEFAULT_CHARSETS[0]; // was this.Ft = Oo.Ft; // NEEDSWORK this.Ft
	this.charsetInfo = CharsetInfo.TERMINAL_DEFAULT_CHARSETS[0]; // was this.It = Oo.Ft;
	Utils.coreLogger.debug("charsetInfo = " + this.charsetInfo);
	this.Ts = 0;
	this.alternateWidth = 80; // this.Rs = 80; 
	this.alternateHeight = 24; // this.ys = 24;  
	this.nameThisSession();  // sets shortName and long name
	this.sessionType = "3270";
	this.sessionDeviceName;
	this.keyboardMap = KeyboardMap.standard; // this.Kn = gr;  // keyboardMapping
	this.Le = 3647;
	this.deviceType = DeviceType3270.rs;
	this.enableTN3270E = true; // this really should be called isTN3270Capable
	this.useBetterCapabilities = true;  // govern functions or capabilities in Tn3270 protocol
	this.capabilities = null;   // minimized this.Ns; - this is weird that not always filled
	this.inTN3270EMode = false; // minified this.Ps = !1;
	this.inInsertMode = false;  // this is probably isInsertMode (as opposed to overwrite which is 3270 default)
	this.convoType = VirtualScreen3270.convoTypes.NVT as number;  // the conversation type can flip back and forth between NVT and 3270, minified as this.Is
	this.Ds = !1;
	this.currentPartitionID = 0;  // minified as this.xs = 0;
	this.partitionState = 0; // was this.Os = 0
	this.partitionInfoMap = { 0: { amode: false, size: this.size } }; // minified as this.Ms
	this.replyMode = VirtualScreen3270.REPLY_MODE_FIELD; // general, not partition, was this.Fs
	
	// this.Ls.aid (nee .Bs) can hold a value from the nh map { PF01: nn, Clear, mmm}
	// the nm map seems to be a protocol commands for key/function table
	// so Ls.aid seems to be aid, defaulting to NO_AID
	// Ls.Fs/Ws/Gs seem to be partition characteristics
	// .s has seen 2 and 32
	// .Fs seems to be either 2 or 0 and has something to do with reply mode
	// .Ws is an empty string or 0 but is never used
	// .Qs is an empty string or 0 but is never used
	// .Gs is 0 everywhere
	this.Ls = { aid: TN3270EParser.AID_NO_AID, // 96 == 0x60
		    _s: 2,
		    replyMode: VirtualScreen3270.REPLY_MODE_FIELD,
		    Ws: "", Qs: "", Gs: 0 }; 
	this.usingAlternateSize = false; // minified as this.js = !1;
	this.scriptIsRunning = false; // this.Zn = !1; 
	this.Xn = false; // Xn and Me see to have opposite values in practice
	this.Me = false; // is it keyboard enablement??
	this.li = 0;
	// Vs is some sort of status of input and/or keyboard readiness or read-write state with host
	// Vs.zs changed to 1 in READ_BUFFER, READ_MOD, READ_PARTITION_QUERY why??
	// Vs.zs changed to 0 in handle3270HostMessage
	// Vs.hs set to false when sending a message back to host
	this.Vs = { zs: 0, Ks: 0, Hs: !1 }; 
	this.Ys = null; // something about keepalive timer thing
	this.responseDisposition = { Js: TN3270EParser.NO_RESPONSE,
				     Zs: TN3270EParser.NO_RESPONSE}; // { Js: 0, Zs: 0 };  minified as this.qs
	this.errorStringOrNeg1 = -1; // minified as this.Xs = -1;  - shitty programming practic alert
	this.$s = new Map();
	this.tu = !1;
	this.ii = ["Reset", "Attn", "Sys Req"];
	this.bindStatus = false; // this.lu = !1;
	this.nu = !1;
	this.iu = 0;
	this.eu = { passwordPrompt: "password" };
	this.su = { uu: !1, hu: !1, ru: !1, au: !1 };
	this.ou = true;
	this.cu = true;
	this.fu = false;
	// JOE adds these
	this.parser = null;  // many instances of this.Du in code
	this.Cu = null;      // many instances in code values in (2,4,88, and null)
    }

    static convoTypes:any = { LULU: 1, SSCPLU: 2, NVT: 3 };

    // I have no idea what this is
    static co = { In: 0, Dn: 1 };

    dumpFields(){
	if (this.fieldDataMap){
	    for (let p=0; p<this.size; p++){
		let fieldData = this.fieldDataMap[p];
		if (fieldData){
		    console.log("Field at "+p+" is "+fieldData+" len="+fieldData.length);
		}
	    }
	} else {
	    console.log("no fieldDataMap cached");
	}	
    }


    /** 
	connect only gets called by the global/static start3270!!
	l is a jsonObject like:
        {
          host:  <hostnameString>,
          port:  <portNumber>,
          security: <anIntegerInSecurityTypeEnumeration>,  // defaults to 0
          la:       <dataPertainingToSecurity>             // defaults to 0
        }
    */
    connect(url:string,l:any){ // (lc.prototype.connect = function (t, l) {
	if (0 === this.ti) {
            this.ti = 1;
            let screen = this; // was e
            var ws:WebSocket|null = new WebSocket(url);
            screen.websocket = ws;
            var isReady = false;
	    // this is highly suspicious
	    (ws as any).onopen2 == function () {
		if (l.host && l.port) {
                    let t:any = { t: "CONFIG", host: l.host, port: Number(l.port) };
                    if (2 === l.security) {
			t.security = { t: "tls", badCert: l.la };
		    } else if (0 != l.security){
			Utils.messageLogger.warn("Unknown security type requested!");
			screen.ti = 0;
			(ws as WebSocket).close();
		    }
		    (ws as WebSocket).send(JSON.stringify(t));
		    Utils.messageLogger.debug("Sent "+t);
		} else {
		    screen.ti = 0;
		}
	    }

	    ws.onopen = function () {
		if (l.host && l.port) {
                    let response:any = { t: "CONFIG", host: l.host, port: Number(l.port) };
                    if (2 === l.security){
			response.security = { t: "tls", badCert: l.la };
		    } else if (0 != l.security){
			Utils.messageLogger.warn("Unknown security type requested!");
			screen.ti = 0;
			(ws as WebSocket).close();
		    }
		    (ws as WebSocket).send(JSON.stringify(response));
		    Utils.messageLogger.debug("Sent "+response);
		} else {
		    screen.ti = 0;
		}
	    }

            ws.onerror = function (event) {
		screen.pi(event);
		screen.ti = 0;
		if (screen.Ys) {
		    clearInterval(screen.Ys);
		    ws = null;
		}
            }

	    ws.onclose = function (event) {
		(screen.renderer as PagedRenderer).Bl = false; 
		screen.gi(event);
		screen.ti = 0;
		screen.bindStatus = false;
		Utils.protocolLogger.debug("Unbind status=" + screen.bindStatus);
		if (screen.Ys) {
		    clearInterval(screen.Ys);
		    ws = null;
		}
            }
	    
            ws.onmessage = function (event) {
		screen.Cu = null;
		var jsonMessage = JSON.parse(event.data);
		Utils.messageLogger.debug("ws.onMessage "+jsonMessage);
		screen.dispatchWSMessage(jsonMessage);  // this kicks off message processing and parsing
		if (!isReady){
		    isReady = true;
		    screen.ti = 2;
		    screen.keepAlive();
		    if (screen.callbacks && screen.callbacks.readyCallback){
			screen.callbacks.readyCallback.apply(this, null);
		    }
		}
	    }
	}
    }

    showScreen(){ // (lc.prototype.Ge = function () {
	if (this.renderer == null){
	    Utils.coreLogger.debug("showScreen");
	    this.renderer = new Renderer3270(this, this.charsetInfo.baseTable);
	    if (null !== this.zn && void 0 !== this.zn){
		this.Ui(this.zn); // INTERIM .Ui
	    }
	}
	for (var t = 9; t < 18; t++) this.oiaLine.xn[t] = 0x20; // utf blank
	this.renderer.fullPaint();
    }

    keepAlive(){ // (lc.prototype.keepAlive = function () {
	if (this.na && this.na.keepAlive && this.na.keepAlive.timerOptions && this.na.keepAlive.timerValue) {
            const t = Number(this.na.keepAlive.timerValue),
		  l = Number(this.na.keepAlive.timerOptions);
            t &&
		(this.Ys = setInterval(() => {
                    this.sendKeepAlive(l);
		}, 60 * Number(t) * 1e3));// 1e3 == 499 // *UNKNOWN* logic/definitions
	}
    }

    sendKeepAlive(t:number){ // (lc.prototype.ia = function (t) {
	if (!this.parser){
	    this.parser = new TN3270EParser(this, "3270_CLIENT_MESSAGE");
	}
	let logger = Utils.coreLogger;
	let n = this.parser;
	if (1 === t) {
	    logger.debug("sending telnet keep alive options 241");
	    n.addTelnetResponse(253, 241); // *UNKNOWN* - this originally said (241) and that seems wrong
	} else if (2 === t){
	    logger.debug("sending telnet keep alive options 6");
	    n.addTelnetResponse(253, 6);
	}
	n.Fe(); // defined but crappy name still
    }

    /*
      lc.prototype.be (t)
        processWebsocketMessage()
	t is an anonymous javascript object with { type: "<string>", }
                typeString is one of "IP_RES", "CONNECTED" "CERT_PROMPT" "3270_HOST_MESSAGE"
		                     "3270_HOST_MESSAGE" "MESSAGE_BIND_IMAGE" "CERT_REJECT" "ERR"
                these messages original in terminalProxy.js
    */
    dispatchWSMessage(wsJSONMessage:any){ // (lc.prototype.be = function (t) {
	Utils.messageLogger.debug("Processing websocket message. Type=" + wsJSONMessage.t);
	let screen = this;
	let l = Utils.defaultGlobalLogger;
	switch (wsJSONMessage.t) {
	case "IP_RES":
            screen.ipAddress = wsJSONMessage.data; // an IP Address as a string according to terminalProxy
            break;
	case "CONNECTED":
            this.ce(wsJSONMessage);
            break;
	case "CERT_PROMPT":
            if (screen.callbacks && screen.callbacks.certificateCheck){
		screen.callbacks.certificateCheck(
		    screen.bi.host,
		    wsJSONMessage.fp,
		    (statusBoolean:boolean, reason:any) => {
			if (screen.websocket){
			    screen.websocket.send(JSON.stringify({ t: "CERT_RES", a: statusBoolean }));
			} else {
			    l.warn("no websocket on screen during dispatchWSMessage 1");
			}
			if (!wsJSONMessage){
			    Utils.coreLogger.info("Rejecting TLS certificate and closing connection. Reason=" + reason);
			}
		    });
	    } else if (screen.websocket){
		screen.websocket.send(JSON.stringify({ t: "CERT_RES", a: true }));
	    } else {
		l.warn("no websocket on screen during dispatchWSMessage 1");
	    }
            break;
	case "3270_HOST_MESSAGE":
            this.handle3270HostMessage(wsJSONMessage);
            break;
	case "MESSAGE_BIND_IMAGE":
            Utils.protocolLogger.debug("-- luName=" + wsJSONMessage.$h);
            break;
	case "MESSAGE_UNBIND_IMAGE":
            break;
        case "CERT_REJECT":
            if (screen.websocket){
	        screen.websocket.close(4001, "server sent close/error/exception message");
            }
            break;
	case "ERR":
            this.fe(wsJSONMessage);
	default:
            Utils.messageLogger.warn("Unhandled websocket message. Type=" + wsJSONMessage.t);
	}
    }

    
    handle3270HostMessage(wsJSONMessage:any):void{ //  (lc.prototype.Hh = function (t) {
	let screen = this; // minified as l
	this.Vs.zs = 0; // NEEDSWORK Vs
	let raw3270Data:Uint8Array|null = Utils.base64Decode(wsJSONMessage.B64); // was n
	Utils.messageLogger.debug("3270_HOST_MESSAGE raw data=");
	if (raw3270Data){
	    Utils.hexDumpU8(raw3270Data, Utils.messageLogger);
	    if (!screen.parser){
		screen.parser = new TN3270EParser(screen, "3270_CLIENT_MESSAGE");
	    }
	    var parser = screen.parser; 
            var e = 0;
	    parser.atEndOfHostMessage = false;
	    if (!this.inTN3270EMode){
		if (15 === parser.qh && 15 === parser.Jh){
		    parser.tn3270EMode = false; 
		    this.inTN3270EMode = false;
		    this.convoType = VirtualScreen3270.convoTypes.LULU;
		} else {
		    this.convoType = VirtualScreen3270.convoTypes.NVT;
		}
	    }
	    for (; e < raw3270Data.length; ) {
		if (e === raw3270Data.length - 1){
		    parser.atEndOfHostMessage = true; 
		}
		var b = raw3270Data[e];
		parser.process(b);
		e++;
	    }
	    parser.Fe(); // flushes response to websocket
	} else {
	    Utils.coreLogger.warn("protocol error, handle3270HostMessage did not get B64 bytes");
	}
    }

    eorAndSend(byteArray:number[]):void{ // (lc.prototype.tr = function (t) {
	byteArray.push(255);
	byteArray.push(239);
	this.sendBytes(byteArray);
	this.Vs.Hs = !1; // NEEDSWORK .Vs and .Hs
    }

    sendBytes(byteArray:number[]):void{ // (lc.prototype.Oh = function (t) {
	let logger = Utils.messageLogger;
	var message = { t: "3270_CLIENT_MESSAGE", data: Utils.base64Encode(byteArray) };
	logger.debug("sending client message "+JSON.stringify(message));
	Utils.hexDump(byteArray, logger);
	if (this.websocket != null){
	    this.websocket.send(JSON.stringify(message));
	}
    }

    sendBytesU8(byteArray:Uint8Array):void{ // (lc.prototype.Oh = function (t) {
	let logger = Utils.messageLogger;
	var message = { t: "3270_CLIENT_MESSAGE", data: Utils.base64EncodeU8(byteArray) };
	logger.debug("sending client message "+JSON.stringify(message));
	Utils.hexDumpU8(byteArray, logger);
	if (this.websocket != null){
	    this.websocket.send(JSON.stringify(message));
	}
    }

    sendNegotiationResponse(t:number,l:number[]):void{ // (lc.prototype.Gh = function (t, l) {
	let logger = Utils.telnetLogger;
	var messageBytes = [255, 250, t]
	for (var i = 0; i < l.length; i++){
	    messageBytes.push(l[i]);
	}
	messageBytes.push(255), messageBytes.push(240);
	var messageObject = { t: "3270_CLIENT_MESSAGE",
			      data: Utils.base64Encode(messageBytes) };
	logger.debug("sending telnet suboptions, dump follows");
	Utils.hexDump(messageBytes, logger);
	if (this.websocket != null){
	    this.websocket.send(JSON.stringify(messageObject));
	}
    }

    getLUName():string{ // (lc.prototype.getLUName = function () {
	return String.fromCharCode.apply(null, this.sessionDeviceName);
    }

    wu():number{ // (lc.prototype.wu = function () {
	return 2;
    }

    getAlternateWidth():number{ // (lc.prototype.vu = function () {
	if (this.deviceType){
	    return (this.deviceType === DeviceType3270.ps && this.inTN3270EMode ?  // IBM-DYNAMIC
		this.alternateWidth :
		this.deviceType.width);
	} else {
	    return 80;
	}
    }

    getAlternateHeight():number{ // (lc.prototype.pu = function () {
	return (this.deviceType ?
		(this.deviceType === DeviceType3270.ps && this.inTN3270EMode ?
		 this.alternateHeight :
		 this.deviceType.height) :
		24);
    }

    // is override o base class method
    handleTripleClick(offsetX:number,
		      offsetY:number,
		      coords:any,
		      screenPos:number):void{ // (lc.prototype.ue = function (t, l, n, i) {
	Utils.eventLogger.debug("triple click in 3270 is not implemented");
    }

    setDeviceType(t:any):void{ // (lc.prototype.Au = function (t) {
	if (t && (t.type > 0 && t.type <= 9)){
	    this.deviceType = t;
	} else {
	    Utils.protocolLogger.warn("Could not set device type, " + t.type + " not a valid number");
	}
    }

    getDeviceType():any{ // (lc.prototype.bu = function () {
	return this.deviceType;
    } 

    getAutomationProperties():any{ // lc.prototype.gu = function () {
	return { shortName: this.shortName,
		 longName: this.longName,
		 sessionType: this.sessionType,
		 eabSupport: !0, // see EHLLAPI IBM Doc
		 pssSupport: !1,
		 rows: this.height,
		 columns: this.width,
		 codePage: this.charsetInfo.name };
    }

    // helps set cursor on click?? 
    mu(coords:any, position:number):void{ // (lc.prototype.mu = function (t, l) {
	let logger = Utils.eventLogger;
	logger.debug("Element at pos=" + position + " is=" + this.screenElements[position]);
	var n = this.getDemoScreenContextPlus(position); // NEEDSWORK .Eu
	logger.debug("context is "+JSON.stringify(n));
	if (!(coords.rows >= this.height || coords.columns >= this.width)){
	    if (this.convoType !== VirtualScreen3270.convoTypes.NVT){
		console.log("JOE: about to setCursorPos to "+position);
		this.setCursorPos(position);
	    }
	    if (!(!this.Xn && this.Me)){
		this.ku();
	    }
	    if (this.renderer){
		this.renderer.redrawTransientElements();
	    }
	} else {
	    console.log("JOE: not setting cursor pos on click!!");
	}
    }

    handleClick(offsetX:number, offsetY:number,
		coords:any,
		screenPos:number):void{ // (lc.prototype.se = function (t, l, n, i) {
	this.mu(coords, screenPos);
    }

    getScreenContents(t:any,
		      l:number,
		      n:number,
		      i:number,
		      e:any,
		      s:any,
		      u:any,
		      h:any){ // (lc.prototype.Ci = function (t, l, n, i, e, s, u, h) {
	let renderer = this.getRenderer3270OrFail("getScreenContents");
	var r = [];
        var a = Renderer3270.buildDBCSArray(this);
	let o = -1 !== navigator.userAgent.indexOf("Windows");
        let c = renderer.unicodeToEBCDIC(13);
        let f = renderer.unicodeToEBCDIC(10);
	let fieldMark = Ebcdic.fieldMark;
	let recordMark = Ebcdic.recordMark;
	// iterating on row as d below i
	for (var d:number = n; d < i; d++) {
            var w:number = l;
            var v = t;
            if (h && (d != i - 1)){  // h means look outside colums, ie, not a square copy bounds
		w = this.width;
	    }
	    if (h && d != n){  // start on start of row if not first row, 
		v = 0;
	    }
            for (var p:number = v; p < w; p++) { // is v a start column? w an end column?
		var A;
                var b:number = 0,
                g = this.getScreenElementRowColumn(d, p);
		this.isFormatted && (A = this.getFieldDataByPosition(this.rowColZBToScreenPos(d, p), !0));
		var m = 0; // used to be null
		let charsetInfo = this.charsetInfo;
		if (s === true){
		    m = 0x40;
		}
		b = m;
		if (g)
                    if ((A && A.isNoDisplay() ? (b = 0x40) : (b = g.charToDisplay()) < 0x40 && ![fieldMark, recordMark].includes(b) && (b = m), 0 == e)) {
			var E = this.rowColZBToScreenPos(d, p);
			if (1 == a[E]) {
                            var k = this.screenElements[E + 1],
                            S = k ? k.charToDisplay() : 0; // JOE bold, but strongly-typed, defaulting!
                            (b = null != charsetInfo.unicodeEuroDBCS && charsetInfo.unicodeEuroDBCS[0] == b && charsetInfo.unicodeEuroDBCS[1] == S ? Unicode.euro : charsetInfo.extendedTable[b][S]),
			    p++;
			} else if (2 == a[E]) {
                            var T = this.screenElements[E - 1],
                            R = T ? T.charToDisplay() : 0; // JOE bold, but strongly-typed, defaulting!
                            b = null != charsetInfo.unicodeEuroDBCS && charsetInfo.unicodeEuroDBCS[0] == R && charsetInfo.unicodeEuroDBCS[1] == b ? Unicode.euro : charsetInfo.extendedTable[R][b];
			} else if (g.isGraphic)
                            if (u)
                            switch ((b = Renderer3270.graphicEbcdicToUnicode[b])) {
				case 61569: // 0xF081
                                    b = 8214; // some CJK char
                                    break;
				case 61570: // 0xF082
                                    b = 9552; // some CJK char
                                    break;
				case 61571: // 0xF083
                                    b = 9144; // some CJK char
                                    break;
				case 61572: // 0xF084 
                                    b = 931; // capital Sigma
                            }
			else b = 0x20; // ascii/unicode space
			else b = b === renderer.St ? Unicode.euro : b === fieldMark ? 42 : b === recordMark ? 59 : renderer.unicodeTable[b];
                    } else g.isGraphic && r.push(240);
		else !e && s && (b = 32);
		r.push(b);
            }
            0 == e ? (o && r.push(13), r.push(10)) : (o && r.push(c), r.push(f));
	}
	return String.fromCharCode.apply(null, o ? r.slice(0, r.length - 2) : r.slice(0, r.length - 1));
    }


    autotype(t:string, l:number){ // (lc.prototype.te = function (t, l) { // *UNKNOWN* second arg is never passed in
	if (this.renderer) {
            var n;
            if (null != this.charsetInfo.extendedTable) {
		var i = this.je() == this.cursorPos;  // NEEDSWORK .je
		n = this.Ve(t, i, !0);
            } else {
		n = [];
		for (var e = 0; e < t.length; e++) {
                    var s = this.Ql(t.charCodeAt(e)); // NEEDSWORK .Ql
                    n.push(s);
		}
            }
            var u = n.length;
            for (l && l < n.length && (u = l), e = 0; e < u; e++) {
		if (!0 !== this.enterCharacterAtCursor(n[e])) {  
		    this.renderer.fullPaint();
		    return false;
		}
	    }
	    if (15 == n[n.length - 1]){
		this.modifyCursorPos(-1); 
	    }
	    this.renderer.fullPaint();
            return true;
	}
	return false;
    }

    // .Ri(t) here
    paste(t:string):boolean{ // (lc.prototype.Ri = function (t) {
	let logger = Utils.eventLogger;
	let l = t.split("\n");
        let n = this.cursorPos;
        let i = this.cursorPos % this.width;
        let e = this.width - i;
	logger.debug("Pasting text starting at " + this.cursorPos +
	    ", length=" + t.length + ", lines=" + l.length);
	for (let t = 0; t < l.length; t++) {
            if (!(n < this.size)){
		logger.warn("Stopped pasting content at line=" + (t + 1) +
		    " because the cursor wrapped around to top of screen");
		this.Su(1);
		if (this.renderer) {
		    this.renderer.redrawTransientElements();
		    this.renderer.fullPaint();
		}
		return false;
	    }
            this.setCursorPos(n);
            let ii = l[t];
            for (let t = 0; t < e && t < ii.length; t++){
		if (!this.enterCharacterAtCursor(this.Ql(ii.charCodeAt(t)))){
		    this.modifyCursorPos(1);
		}
	    }
            n += this.width;
	}
	let fieldData = this.getFieldData3270ByPosition(this.cursorPos, true);
	if (fieldData && !fieldData.isEditable()){
	    this.Tu();
	}
	if (this.renderer){
	    this.renderer.fullPaint();
	}
	return true;
    }

    getParserOrFail(location:string):TN3270EParser{
	if (this.parser){
	    return this.parser;
	} else {
	    throw "Illegal State: no parser in "+location;
	}
    }

    getRenderer3270OrFail(location:string):Renderer3270{
	if (this.renderer){
	    return this.renderer as Renderer3270;
	} else {
	    throw "Illegal State: no renderer in "+location;
	}
    }

    static oiaWarnCount = 0;
    
    getOIAArray():any{ // (lc.prototype.Fl = function () {
	let OIA_PASSPORT_TE = [0x40, 0x40]; // JOE - stupid hack for now
	let co = VirtualScreen3270.co;
	let parser = this.parser;
	let renderer = this.getRenderer3270OrFail("getOIAArray");
	var t = this.oiaLine.xn;
	t.fill(0x20); // blanks
	/*
	if (VirtualScreen3270.oiaWarnCount < 10){
	    console.log("JOE HACKS getOIAArray()");
	    VirtualScreen3270.oiaWarnCount++
	}
	if (t.length > 0){
	    console.log("JOE early exit from OIAArray");
	    return t; // yikes!
	}
	*/
	var l = 0;
	if ((this.On == co.In ? ((t[l++] = 77), (t[l] = 65)) : this.On == co.Dn && ((t[l++] = OIA_PASSPORT_TE[0]), (t[l++] = OIA_PASSPORT_TE[1])), this.On == co.In)) {
            2 == this.bi.security && (t[3] = 43), this.inInsertMode && (t[51] = 94);
        var n = 76;
            if ((this.shortName && (t[6] = this.shortName.charCodeAt(0)), this.Cu))
		switch (((n = 9), this.Cu)) {
		case 1:
                    t[n - 1] = 7;
                    for (var i = 0; i < VirtualScreen3270.St.length; i++) t[n++] = VirtualScreen3270.St[i];
                    break;
		case 2:
                    for (i = 0; i < VirtualScreen3270.Et.length; i++) t[n++] = VirtualScreen3270.Et[i];
                    break;
		case 3:
                    for (i = 0; i < VirtualScreen3270.yt.length; i++) t[n++] = VirtualScreen3270.yt[i];
                    break;
		case 4:
                    t[n - 1] = 7;
                    let l = (this.Iu && 0 !== this.Iu.length) ?
			    VirtualScreen3270.xt.concat(this.Iu) : VirtualScreen3270.xt;
                    for (i = 0; i < l.length; i++) t[n++] = l[i];
                    break;
		case 88:
                    t[n++] = 88;
		}
	    /*
	      too harsh
	    if (parser == null){
		throw "Illegal State, parser null deep in body of getOIAArray";
	    }
	    */
	    renderer.jt > 0 && ((n = 53),
				(t[n++] = VirtualScreen3270.Pt[0]),
				(t[n++] = VirtualScreen3270.Pt[1]),
				(t[n] = VirtualScreen3270.Pt[2]));
            if (parser && parser.xu) {
		n = 76;
		let l = parser.xu;
		for (let i = 17; i > -1; i--)
                    if (l.length < i) t[n--] = 32;
		else {
                    let e;
                    l && "string" == typeof l && ((e = l.charAt(i)), e && (t[n--] = e.charCodeAt(0))), l && "object" == typeof l && ((e = l[i]), e && (t[n--] = e));
		}
            }
            let e:string = ""; // JOE: Maybe an oversimplification, but a good one!
	    var s,
		u = this.Te(this.cursorPos),
		h = 1 === String(u.row).length ? "0" + u.row.toString() : u.row.toString();
            for (
		1 === String(u.column).length ? (e = "00" + u.column.toString()) : 2 === String(u.column).length ? (e = "0" + u.column.toString()) : 3 === String(u.column).length && (e = "" + u.column.toString()),
		n = 76,
		t[n--] = 47,
		i = 2;
		i > -1;
		i--
            )
		h.length < i ? (t[n--] = 48) : (s = h.charAt(i)) && (t[n--] = s.charCodeAt(0));
            for (n = 79, i = 2; i > -1; i--)
		(e.length < i + 1 ?
		    (t[n--] = 48) :
		    (s = e.charAt(i)) && (t[n--] = s.charCodeAt(0)))
	} else this.On;
	return t;
    }


    clear(){ // (lc.prototype.clear = function () {
	this.screenElements = new Array(this.size);
	this.screenElements.fill(null);
	this.isFieldDataMapCached = false;  // was this.Ue
	this.isFormatted = false; 
	this.fieldDataMap = {};    
	this.Be = -1;    // ok for now
	if (this.renderer) {
	    this.renderer.clear();
	}
    }

    // some sort handleLoad, or doPostLoadStuff()
    doPostLoadStuff(){  // (lc.prototype.yu = function () {
	if (4 !== this.Cu){
	    this.Me = true;  // Me/Xn --  frick and frack
	    this.Xn = false;
	    this.Cu = null; 
	    this.scriptIsRunning = false;
	    this.Ls.Gs = 0;
	    this.Vs.zs = 0;
	}
	this.Ls.aid = TN3270EParser.AID_NO_AID;
	if (this.callbacks.screenLoadedCallback){
	    this.callbacks.screenLoadedCallback();
	}
    }

    Nu():void{ //(lc.prototype.Nu = function () {
	if (!(this.Xn && !this.Me)) {
	    this.Xn = true;
	    this.Me = false;
	}
    }
    
    Pu():void{ // (lc.prototype.Pu = function () {
	if (!(!this.Xn && this.Me)){
	    this.Xn = false;
	    this.Me = true;
	}
    }
    
    Fu():void{ // (lc.prototype.Fu = function () {
	if (this.oiaEnabled && this.oiaLine){
	    this.Cu = null;
	    this.Pu(),
	    (this.renderer && this.renderer.redrawTransientElements());
	}
    }

    // don't know if this is called
    Ou(t:any):any{ // (lc.prototype.Ou = function (t) {
	return !(!this.Xn ||
		 (this.su && this.su.uu && this.su.au ?
		  (this.doReset(), this.su.hu && this.doTab(), 1) :
		  this.ii && this.ii.includes(t)));
    }

    getFieldData3270ByPositionNoNull(position:number,lookInFieldDataMap:boolean):FieldData3270 {
	if (this.isFormatted){
	    let fieldData = this.getFieldData3270ByPosition(position,lookInFieldDataMap);
	    if (fieldData){
		return fieldData;
	    } else {
		throw "Failed to get FieldData3270 by position by caller that expects non-null";
	    }
	} else {
	    throw "Attempting to get FieldData3270 no null when not formatted";
	}
    }
    
    getFieldData3270ByPosition(position:number,lookInFieldDataMap:boolean):(FieldData3270|null){
	let fieldData:FieldData|null = this.getFieldDataByPosition(position,lookInFieldDataMap);
	if (fieldData){
	    return fieldData as FieldData3270;
	} else {
	    return null;
	}
    }
    
    Lu(t:number):boolean{ // (lc.prototype.Lu = function (t) {
	var l,
            n = this.size,
            i = this.getFieldData3270ByPosition(this.cursorPos, !0),
            e = this.screenElements[this.cursorPos];
	if (null == e && ((e = new ScreenElement(this.cursorPos, 0, null)),
			  (this.screenElements[this.cursorPos] = e),
			  this.isFormatted))
            for (l = 1; l < n; l++) {
		var s = (this.cursorPos - l) % n,
                    u = this.screenElements[s],
                    field = u ? u.field : null;
		if (field) {
                    e.field = field;
                    break;
		}
            }
	e.inputChar = t;
	e.isModified = true;
	if (!this.parser){
	    throw "No parser in VirtualScreen3270.lu - illegal state";
	}
	this.parser.Bu || (e.pn = !0), (this.Vs.Hs = !0), i && i.setModified();
	const r = this.getScreenElementByPosition(this.cursorPos);
	this.setCursorPos((this.cursorPos + 1) % n);
	let a = this.getFieldData3270ByPosition(this.cursorPos, true);
	for (; a && a.position === this.cursorPos; )
            if (r && i && a.ks()) { // isProtectedNumeric, maybe - JOE adding null check on i
		if (this._u(i, r)) {
                    this.Wu(i);
		    this.Tu();
                    break;
		}
            } else
		this.setCursorPos((this.cursorPos + 1) % n),
	(a = this.getFieldData3270ByPosition(this.cursorPos, true));
	return !0;
    }
    
    enterCharacterAtCursor(t:number):boolean{ // (lc.prototype.Fi = function (t) {
	console.log("JOE enterChar t="+JSON.stringify(t)+" cursorPos="+this.cursorPos);
	this.cacheFieldDataMap();
	var l,
            n = this.getFieldData3270ByPosition(this.cursorPos, true);
	if (n == null){
	    let keys = Object.keys(this.fieldDataMap);
            for (let kk = 0; kk < keys.length; kk++) {
                let field = this.fieldDataMap[keys[kk]];
		console.log("  key["+kk+"]="+keys[kk]+" => "+field+" w/len="+field.length);
	    }
	}
	return (
            this.size,
            this.isFormatted
		? null == n
		? (Utils.protocolLogger.warn("Cannot add character, fieldData not found when fields = " + this.fieldDataMap), !1)
		: n.attributes.isProtected() || n.position === this.cursorPos
		? (this.Su(1), false)
		: this.inInsertMode
	    // JOE - desperate cast on next line
		? ((l = this.Qu(this.cursorPos, (this.findMatchingFieldNearPosition(this.cursorPos, !1, !1, !1) as number), t)) || this.Su(1), l) 
		: this.Lu(t)
            : this.inInsertMode
		? ((l = this.Qu(this.cursorPos, this.cursorPos - 1, t)) || this.Su(1), l)
		: this.Lu(t)
	);
    }

    ku(){ // lc.prototype.ku = function () {
	if (this.su && this.su.uu && this.su.ru){
            setTimeout(() => {
		this.doReset();
		if (this.su.hu){
		    this.doTab();     // note that arrow functions inherit this scope
		}
            }, 800);
	}
    }

    clearCachedFieldInfo(){ //(lc.prototype.ju = function () {
        var t;
        for (t = 0; t < this.size; t++) {
	    let screenElement = this.screenElements[t];
	    if (screenElement != null){
		screenElement.field = null;
	    }
	}
        this.isFieldDataMapCached = false;
	this.Vu = false; // NEEDSWORK .Vu? ?? - screen context ??
    }

    cacheFieldDataMap(){ // (lc.prototype.bn = function () {
	if (this.isFieldDataMapCached) {
	    return this.isFormatted;
	}
	if (!this.fieldDataMap) {
	    this.isFormatted = false;
	    this.isFieldDataMapCached = true;
	    return this.isFormatted;
	}
	var size = this.size; // was t
        var positionOfFirstFieldData = -1; // was l
        var mostRecentField = null; // was n
	var u;
	for (u = 0; u < size; u++) {
            var i = (u + 1) % size;
	    var e = this.screenElements[u];
            if (null != e){
		if (null != e.fieldData){
		    if (positionOfFirstFieldData == -1) positionOfFirstFieldData = u;
		    i = (u + 1) % size;
		    mostRecentField = new Field((e.fieldData as FieldData3270), i, i);
		    e.field = mostRecentField;
		} else if (positionOfFirstFieldData != -1){
		    e.field = mostRecentField;
		    if (mostRecentField){
			mostRecentField.end = i;
		    } else {
			throw "Assumption Violation, if posOfMostRecent set, therefore mostRecent is set";
		    }
		}
	    } else {
		if (mostRecentField) (mostRecentField.end = i);
	    }
	}
	if (positionOfFirstFieldData != -1){
            for (u = 0; u < positionOfFirstFieldData; u++) {
		var e = this.screenElements[u];
		i = (u + 1) % size;
		if (e != null){
		    e.field = mostRecentField;
		    if (mostRecentField){
			mostRecentField.end = i;
		    } else {
			throw "Assumption Violation, mostRecentField must be set by now"
		    }
		}
            }
	}
	var keys = Object.keys(this.fieldDataMap);
	if (keys.length == 0){
	    return this.isFieldDataMapCached; // *UNKNOWN* - kind of weird, must be false, I think
	}
	if (keys.length == 1) {
	    this.fieldDataMap[keys[0]].length = this.size; // this field owns the whole screen
	} else {
	    // NOTE: some of the mojo in here is not fully understood!
            for (let uu = 0; uu < keys.length; uu++) {
		var h;
                var r = this.fieldDataMap[keys[uu]];
                var a = (h = uu === keys.length - 1 ?
			 this.fieldDataMap[keys[0]] :
			 this.fieldDataMap[keys[uu + 1]]).position - r.position;
		a < 0 && (a = this.size - r.position + h.position), (r.length = a);
            }
	}
	this.isFieldDataMapCached = true;
	return this.isFormatted;
    }

    Su(t:number,l?:any){ // (lc.prototype.Su = function (t, l) {
	if (this.oiaEnabled && this.oiaLine){ 
	    this.Nu(); // NEEDSWORK .Nu defined shabbily above
	    this.Cu = t || 88;  // NEEDSWORK .Cu
	    if (l){
		this.Iu = l; // NEEDSWORK .Iu  // where is this.Iu defined
	    }
	    if (2 !== this.Cu){
		this.ku();   // NEEDSWORK .ku
	    }
	    if (this.renderer){
		this.renderer.redrawTransientElements();  // NEEDSWORK - but stubbed impl in place
	    }
	}
    }
    
    setCharAttrs(position:number,charAttrs:CharacterAttributes3270){ // (lc.prototype.Ku = function (t, l) {
	if (charAttrs.isNonDefault()) {
            var element = this.screenElements[position];
            if (element != null){
		element.charAttrs = charAttrs.copy();
	    }
	}
    }
    
    handleErase(blockResize:boolean, isAlternateSize:boolean){ // (lc.prototype.Hu = function (t, l) {
	this.clear();
	this.graphicsState = new GraphicsState();
	this.bufferPos = 0; 
	this.setCursorPos(0); 
	if (!blockResize) {
            var newWidth = isAlternateSize ? this.getAlternateWidth() : this.defaultWidth;
            var newHeight = isAlternateSize ? this.getAlternateHeight() : this.defaultHeight;
            if (newWidth != this.width || newHeight != this.height) {
		Utils.protocolLogger.debug("Handle erase. new w,h= " + newWidth + "," + newHeight);
		var e = this.partitionInfoMap[this.currentPartitionID];
		if (e){
		    e.size = newHeight * newWidth;
		    this.resize(newWidth, newHeight);
		}
            }
	}
    }

    static IMPLICIT_PARTITION = -1; // was Mo

    // blessPartitionIDorWarn
    Yu(partitionID:number){ // (lc.prototype.Yu = function (t) {
	return ((partitionID == VirtualScreen3270.IMPLICIT_PARTITION) ||
		(partitionID == 0) ||
		(Utils.protocolLogger.warn("Only IMPLICIT_PARTITION and pid==0 handled currently, pidSeen=" + partitionID),
		 false));
    }

    handleWriteCommand(t:any){ // lc.prototype.qu = function (t) {
	let logger = Utils.protocolLogger;
	if (t) {
	    logger.debug("-- partitionID=" + t.partitionID+" screen.partitionState=");
	    logger.debug("-- eraseFirst=" + t.eraseFirst);
	    logger.debug("-- resizeProhibited=" + t.resizeProhibited);
	    logger.debug("-- useAlternateSize=" + t.useAlternate);
	    logger.debug("-- WCC=0x" + Utils.hexString(t.wcc));
            if (t.partitionID != VirtualScreen3270.IMPLICIT_PARTITION && t.partitionID != 0){
		return void logger.warn("Only IMPLICIT_PARTITION and pid==0 handled currently, pidSeen=" + t.partitionID +
				    " fullCommand="+t);
	    }
	    if ((t.wcc & TN3270EParser.WCC_MDT_RESET) != 0){
		var keys = Object.keys(this.fieldDataMap);
		for (var n = 0; n < keys.length; n++) {
		    this.fieldDataMap[keys[n]].clearModified();
		}
	    }
            if (t.eraseFirst) {
		logger.debug("Erase before writing");
		this.handleErase(t.resizeProhibited, t.useAlternate);
	    } else {
		logger.debug("writing without erasing");
	    }
	    console.log("JOE before handleWriteOrders size="+this.size);
	    this.handleWriteOrders(t.orders); 
	    this.clearCachedFieldInfo();
	    this.showScreen();
            console.log("JOE postLoad respdisp="+JSON.stringify(this.responseDisposition)+
			" wcc=0x"+Utils.hexString(t.wcc));
	    if (this.responseDisposition.Zs || this.responseDisposition.Js || (t.wcc & TN3270EParser.WCC_KEYBOARD_RESTORE)){
		/* bit 0x02 in the WCC is keyboard enable bit */
		console.log("JOE postLoad GOOD");
		this.doPostLoadStuff();             
	    } else {
		console.log("JOE postLoad BAD");
		this.Me = false;              // NEEDSWORK .Me - evil undeclared thing
	    }
	}
    }

    reportAttributeUpdateFailures(order:any,failureArray:any[]){
	let logger = Utils.protocolLogger;
	failureArray.forEach((updateStatus) => {
	    if (!updateStatus.status){
		this.oh(this.$s, updateStatus); // INTERIM
		this.fh();               // INTERIM
		logger.debug("order with bad char attrs: "+JSON.stringify(order));
	    }
        })
    }

    static readBA(b1:number, b2:number):number{// zh = function (t, l) {
        switch (b1 & 0xC0) {
        case 0:
            return ((0x3F & b1) << 8) | b2;
        case 0x40:
        case 0xC0:
            return ((0x3F & b1) << 6) | (0x3F & b2);
        default:
            Utils.protocolLogger.warn("Bad SBA position, b1=0x" + Utils.hexString(b1) +
				      ", b2=0x" + Utils.hexString(b2));
	    return 0;
        }
    }

    handleWriteOrders(orders:any[]){ // (lc.prototype.$u = function (t) {
	let logger = Utils.protocolLogger;
	let GRAPHIC_ESCAPE = 8; // just for readability
	let lastSFE:any = null; // was l - it's an order
        let n:any // the previous non character-data order
        let attributes = new CharacterAttributes3270(); // was i
	let lastCharAttrs:CharacterAttributes3270|null = null; // was b, declared in body
        let lastSetBufferAddressOrder:any = null; // was e
        let size:number = this.size;  // was s
        let orderCount:number = orders.length; // was h
	let A:number = 0; // JOE, praying A is never used before set
	logger.debug("Handling write orders. Order count=" + orderCount)
	for (var u = 0; u < orderCount; u++) {
            var order = orders[u]; // was r
            let h = u;
            var orderBufferPos = this.bufferPos; // was a
	    if (order.data){
		logger.debug("-- Order(data)=");
		Utils.hexDump(order.data, logger);
	    } else {
		logger.debug("-- Order="+JSON.stringify(order));
		logger.debug("---- Order buffer pos=" + orderBufferPos);
	    }
            if (order.key === 0xFFFFFF){
		logger.debug("---- Type=DATA_RUN");
		var dataBytes = order.data; // ebcdic, dbcs, etc
		var elementsCreated = 0; // was f
		var d = (elementsCreated + orderBufferPos) % size;
		var attrsForTheseChars =
		    ((n && n.key === TN3270EParser.ORDER_START_FIELD_EXTENDED)?
			(lastCharAttrs as CharacterAttributes3270) : // JOE if n is set, lastCharAttrs set
			attributes);
		for (var c = 0 ; c < dataBytes.length; ) {
                    var isGraphic = false;
		    var v = dataBytes[c++];
                    if (v == GRAPHIC_ESCAPE){
			isGraphic = true;
			v = dataBytes[c++];
		    }
		    // ScreenElement constructor(position,ebcdicChar,fieldData
		    A = (elementsCreated + orderBufferPos) % size;
		    let newElement = new ScreenElement(A, v, null);
		    newElement.isGraphic = isGraphic;
		    this.putScreenElement(A, newElement);
		    this.setCharAttrs(A, attrsForTheseChars);
		    elementsCreated++;
		}
		var p = (elementsCreated - 1 + orderBufferPos) % size;
		logger.debug("Set char attributes for positions=" + d + "-" + p + " to " + attrsForTheseChars);
		this.bufferPos = (orderBufferPos + elementsCreated) % size;
            } else if (order.key === TN3270EParser.ORDER_START_FIELD ||
		       order.key === TN3270EParser.ORDER_START_FIELD_EXTENDED){
		A = orderBufferPos % size;
                lastCharAttrs = new CharacterAttributes3270(order.ah); // classic bits
		var N = new FieldData3270(lastCharAttrs, A);
		N.precedingSBAOrder = lastSetBufferAddressOrder;
		var g = new ScreenElement(A, 64, N);
		if (order.key === TN3270EParser.ORDER_START_FIELD_EXTENDED){
                    let failureArray = lastCharAttrs.incorporateSFE(order.key, order);
		    lastSFE = N;
		    logger.debug("---- Type=START_FIELD_EXTENDED");
                    if (failureArray){
			this.reportAttributeUpdateFailures(order,failureArray);
			return false;
		    }
		} else {
		    logger.debug("---- Type=START_FIELD");
		}
		logger.debug("startField at " + A + " field=" + N);
		this.putScreenElement(A, g);
		this.bufferPos = (orderBufferPos + 1) % size;
            } else if (order.key === TN3270EParser.ORDER_MODIFY_FIELD){
		logger.debug("---- Type=MODIFY_FIELD");
		let ttt = orderBufferPos % size,
                    l = this.getFieldData3270ByPosition(ttt, false);
		if (l && l.attributes) {
                    let n = l.attributes;
		    let failureArray = n.incorporateSFE(order.key, order);
		    this.bufferPos = (orderBufferPos + 1) % size;
		    logger.debug("currentFieldData: "+l);
                    if (failureArray){
			this.reportAttributeUpdateFailures(order,failureArray);
                        return false;
		    }
                    var m = this.dh(ttt); // INTERIM
		    if (m){ // JOE - screening null case
			for (let ppp = 0; ppp < m && (P = this.getScreenElementByPosition(ttt + ppp)); ppp++){
			    this.setCharAttrs(ttt + ppp, n);
			}
		    }
		} else {
		    logger.warn("Buffer address does not contain a field attribute");
		}
            } else if (order.key === TN3270EParser.ORDER_ERASE_UNPROTECTED_TO_ADDRESS){
		logger.debug("---- Type=ERASE_UNPROTECTED_TO_ADDRESS");
		let t = VirtualScreen3270.readBA(order.wh, order.vh); // NEEDSWORK .wh .vh
		if (t >= this.size) {
		    logger.warn("Given ERASE_UNPROTECTED_TO_ADDRESS with address above maximum, discarding.");
		} else {
                    this.cacheFieldDataMap();
                    let l = t < this.bufferPos ? this.size - this.bufferPos + t : t - this.cursorPos,
			n = 0;
                    for (let t = 0; t < l; t++) {
			n = (this.bufferPos + t) % this.size;
			let fieldData2 = this.getFieldData3270ByPosition(n, true);
			if (this.isFormatted && fieldData2 && !fieldData2.isEditable()) continue; 
			let i = this.getScreenElementByPosition(n);
			i ? ((i.ebcdicChar = 0), (i.isModified = !1)) : ((i = new ScreenElement(n, 0, fieldData2)), this.putScreenElement(n, i));
                    }
		}
	    } else if (order.key === TN3270EParser.ORDER_INSERT_CURSOR){
		this.setCursorPos(orderBufferPos); 
		logger.debug("---- Type=INSERT_CURSOR");
		this.bufferPos = orderBufferPos + 0;
	    } else if (order.key === TN3270EParser.ORDER_SET_BUFFER_ADDRESS){
		lastSetBufferAddressOrder = order;
		this.bufferPos =  VirtualScreen3270.readBA(order.wh, order.vh) % size;
		logger.debug("---- Type=SET_BUFFER_ADDRESS");
		logger.debug("---- Pos1=" + order.wh);
		logger.debug("---- Pos2=" + order.vh);
		logger.debug("---- New Pos=" + this.bufferPos);
		/* HERE in handleWriteOrders */
		if (n && (TN3270EParser.ORDER_START_FIELD_EXTENDED === n.key)){ 
		    lastSFE.length = (this.bufferPos < lastSFE.position ?
				      this.size - lastSFE.position + this.bufferPos :
				      this.bufferPos - lastSFE.position);
                    var k = lastSFE.position;
		    // this bit of madness keeps the bufferPos (insertion point for orders)
		    // associated with the startField
                    var elementP = this.getScreenElementByPosition(A);
		    if (!elementP){
			elementP = new ScreenElement(A, 64, lastSFE);
			this.putScreenElement(A, elementP);
		    }
                    for (let ss = 1; ss < lastSFE.length; ss++){
			A = k + ss;
			(elementP = this.getScreenElementByPosition(A)) ||
			    ((elementP = new ScreenElement(A, 0, null)), this.putScreenElement(A, elementP));
		    }
                    lastSFE = null;
		}
            } else if (order.key === TN3270EParser.ORDER_REPEAT_TO_ADDRESS){
		let orderName = order.orderName;
		let charToRepeat = (orderName == "O_RN" ? 0 : (orderName == "O_RB" ? 0x40 : order.specificChar));
                let R = orderBufferPos;
                let stopPos =  VirtualScreen3270.readBA(order.b1, order.b2)
                logger.debug("---- Type=REPEAT_TO_ADDRESS");
                logger.debug("---- Stop Pos=" + stopPos);
                logger.debug("---- Char=" + charToRepeat);
                logger.debug("---- Graphic=" + order.isGraphic);
                if (stopPos >= size){
                    logger.warn("Ignoring RepeatTo with end out of range start=" + R + " end at " + stopPos + ", size=" + size);
		} else {
		    while (R != stopPos){
			let newElt = new ScreenElement(R, charToRepeat&0xFF , null);
			newElt.isGraphic = order.isGraphic;
			this.putScreenElement(R, newElt)
			if (n && n.key === TN3270EParser.ORDER_START_FIELD_EXTENDED){
			    this.setCharAttrs(A, (lastCharAttrs as CharacterAttributes3270));
			} else {
			    this.setCharAttrs(A, attributes);
			}
			// this.setCharAttrs(R, i); - this might be right, but the above looks more right!!
			R++;
			if (R == size) R = 0; // modular addition;
		    }
		}
		this.bufferPos = stopPos % size;
            } else if (order.key === TN3270EParser.ORDER_SET_ATTRIBUTE){
		let failureArray = attributes.incorporateSFE(order.key, order); // is it really atributes or lasCHarattribtes
		logger.debug("---- Type=SET_ATTRIBUTE");
		logger.debug("---- Attr=" + attributes);
		this.bufferPos = orderBufferPos + 0;
		if (failureArray){
		    this.reportAttributeUpdateFailures(order,failureArray);
                    return false;
		}
            } else if (order.key === TN3270EParser.ORDER_PROGRAM_TAB){
		logger.debug("---- Type=PROGRAM_TAB");
		this.handleProgramTab(orders, orderCount, orderBufferPos, size); 
	    } else {
		logger.warn("**** Unhandled order");
		logger.warn("**** "+JSON.stringify(order));
	    }
            if (0xFFFFFF !== order.key){ // that's the synthetic character data insertion order 
		n = order; 
	    }
	} // for loop from top
	logger.debug("Out of handle write loop");
	this.showScreen();
	this.cacheFieldDataMap();
	var fieldMapKeys = Object.keys(this.fieldDataMap);
	for (u = 0; u < fieldMapKeys.length; u++) {
            var P;
	    var N = (this.fieldDataMap[fieldMapKeys[u]] as FieldData3270); // JOE, ugly , but true cast
	    var F = N.length;
	    k = N.position; // NEEDSWORK, where does k come from ?
            if (((P = this.getScreenElementByPosition(k)) || ((P = new ScreenElement(k, 0x40, N)), this.putScreenElement(k, P)), F > 0)) // did i damage this
		for (var I = 1; I < F; I++) {
                    var D = (k + I) % this.size;
                    (P = this.getScreenElementByPosition(D)) || ((P = new ScreenElement(D, 0, null)), this.putScreenElement(D, P));
		}
	}
    }


    // l can look like { type: "create_partition_was_ra", code: "763", status: !1, gs: "1005" };
    // accumulates something about errors to a map
    oh(someMap:Map<any,any>,l:any){ // (lc.prototype.oh = function (t, l) {
	let n, i;
	if (l){
	    n = l.code;
	    i = { type: l.type, Eh: l.status, gs: l.gs };
	}
	if (!(0 !== someMap.size && someMap.get(n))){
	    someMap.set(n, i);
	}
    }
    
    fh() { // (lc.prototype.fh = function () {
	this.$s && 0 !== this.$s.size
            ? this.$s.forEach((t, l) => {
		Utils.Bt.includes(l) ? (this.errorStringOrNeg1 = l) : (this.errorStringOrNeg1 = -1);
            })
            : (this.errorStringOrNeg1 = -1);
    }
    
    /* Pl() wants throw up some alerts for pending errors in the screen.$s map */
    Pl(){ // lc.prototype.Pl = function () {
		let logger = Utils.protocolLogger;
		this.$s && 0 !== this.$s.size && setTimeout(() => {
			this.$s.forEach((t, l) => {
				logger.debug(VirtualScreen3270.Mh[t.type]);
			}),
			this.$s.clear();
		}, 0);
    }
    
    processTN3270Command(t:any){ // (lc.prototype.Kh = function (t) {
	let logger = Utils.protocolLogger;
	logger.debug("Processing parsed TN3270 command. ");
	console.log("Command is " + JSON.stringify(t));
	if (t != null){
	    if (t.orders) logger.debug("-- Order count=" + t.orders.length);
            switch ( t.key) {
	    case TN3270EParser.COMMAND_WRITE = 0xF1: // 241
	    case TN3270EParser.COMMAND_WRITE_LOCAL:
	    case TN3270EParser.COMMAND_WRITE_ASCII:
	    case TN3270EParser.COMMAND_ERASE_WRITE: // 245
	    case TN3270EParser.COMMAND_ERASE_WRITE_LOCAL:
	    case TN3270EParser.COMMAND_ERASE_WRITE_ASCII:
	    case TN3270EParser.COMMAND_ERASE_WRITE_ALTERNATE: // 126
	    case TN3270EParser.COMMAND_ERASE_WRITE_ALTERNATE_LOCAL:
	    case TN3270EParser.COMMAND_ERASE_WRITE_ALTERNATE_ASCII:
		logger.debug("-- Type=WRITE");
		this.handleWriteCommand(t);
		break;
            case TN3270EParser.COMMAND_READ_BUFFER:
            case 2:
            case 50:
		logger.debug("-- Type=READ BUFFER");
		this.Vs.zs = 1;
		this._h(this.Ls.aid); // INTERIM
		break;
            case TN3270EParser.COMMAND_READ_MODIFIED: // 246
            case 6:
            case 54:
		logger.debug("-- Type=READ_MODIFIED");
		this.Vs.zs = 1;
		this.doReadModified(this.Ls.aid); 
		break;
            case TN3270EParser.COMMAND_READ_MODIFIED_ALL: // 110
            case 14:
            case 62:
		logger.debug("-- Type=READ_MODIFIED_ALL");
		this.Vs.zs = 1;
		this.doReadModifiedAll(this.Ls.aid); 
		break;
            case TN3270EParser.COMMAND_WRITE_STRUCTURED_FIELD:
		logger.debug("-- Type=WRITE_STRUCTURED_FIELD");
		this.handleStructuredField(t); // NEEDSWORK .Mh
		break;
            default:
		logger.warn("Ignored TN3270 Command. Type=0x" + Utils.hexString(t.key));
	    }
        } else {
	    logger.warn("NO TN3270 command in message");
	}
    }

    /* 
       This uh() thing is only used in the NVT support.
       It calls Renderer.Gl, which seems absolutely nutty.  Maybe this is
       dead code.
     */

    nvtSendBytes(t:number[]):void{// (lc.prototype.uh = function (t) {
	let l = [];
	for (var n = 0; n < t.length; n++) {
	    if (this.renderer){ // will be true
		let renderer3270 =  this.renderer as Renderer3270;
		l.push(renderer3270.Gl(t[n])); // NEEDSWORK .Gl
	    } else {
		throw "Illegal State: no renderer during VirtualScreen3270.uh()"
	    }
	}
	Utils.messageLogger.debug("sending client message array " + l);
	this.sendBytes(l);
    }
    
    ir(t:string):number{ // lc.prototype.ir = function (t) {
	this.Ls.aid = VirtualScreen3270.nh[t]; // NEEDSWORK global nh
	return this.Ls.aid; // INTERIM LS.Bs
    }

    static qCommands = ["Cursor Up", "Cursor Right", "Rapid Right", "Cursor Down", "Cursor Left", "Rapid Left", "Tab", "Home", "End", "New Line", "Backspace", "Back Tab"]; // was global "q"

    static nh:any = { // functionNameNumberMap
          PF01: 241,
          PF02: 242,
          PF03: 243,
          PF04: 244,
          PF05: 245,
          PF06: 246,
          PF07: 247,
          PF08: 248,
          PF09: 249,
          PF10: 122,
          PF11: 123,
          PF12: 124,
          PF13: 193,
          PF14: 194,
          PF15: 195,
          PF16: 196,
          PF17: 197,
          PF18: 198,
          PF19: 199,
          PF20: 200,
          PF21: 201,
          PF22: 74,
          PF23: 75,
          PF24: 76,
          PA1: 108,
          PA2: 110,
          PA3: 107,
          Enter: 125, // 0x7D ENTER
          Clear: 109,
          "Clear Partition": 106,
          "Cursor Select": 126,
          Trigger: 127,
    };

    static ih = [241, 242, 243, 244, 245, 246, 247, 248, 249, 122, 123, 124, 193, 194, 195, 196, 197, 198, 199, 200, 201, 74, 75, 76, 125, 127];
    static st:any = { Copy: 273, Paste: 273 };

    
    handleFunction(fname:string){ // (lc.prototype.Je = function (t) {
	let logger = Utils.keyboardLogger; // was ka
	var l,
            n = this.ir(fname); // a number, plus side-effects to Ls.Bs
	console.log("JOE: handleFunction fname="+fname+" n="+n+" this.Me="+this.Me+" this.Vs="+
		    JSON.stringify(this.Vs));
	if (n && (true === this.Me) && !this.Vs.zs) { // INTERIM .Vs
	    let temp:number|null = n;
            if (126 === n && !(temp = this.er())){
		return;
	    }
	    n = (temp as number);
            if (VirtualScreen3270.ih.indexOf(n) > -1 && !this.sr()) return;
	    this.ur(n);
	    if (TN3270EParser.AID_CLEAR_KEY === n){
		this.clear();
		this.setCursorPos(0);
		this.bufferPos = 1 % this.size;
	    }
            return  !0;
	}
	if (n) { // *UNKNOWN*, how would this happen?
	    this.Su(3)
	    return false;
	}
	if (VirtualScreen3270.qCommands.indexOf(fname) >= 0) {
            const fieldData = this.getFieldData3270ByPosition(this.cursorPos, !0); 
	    const element = this.getScreenElementByPosition(this.cursorPos);
            if ("Cursor Up" == fname) this.handleCursorMovement(-this.width);
            else if ("Cursor Right" == fname) this.handleCursorMovement(1);
            else if ("Rapid Right" == fname) this.handleCursorMovement(2);
            else if ("Cursor Down" == fname) this.handleCursorMovement(this.width);
            else if ("Cursor Left" == fname) this.handleCursorMovement(-1);
            else if ("Rapid Left" == fname) this.handleCursorMovement(-2);
            else if ("Backspace" == fname) this.handleBackspace(); 
            else if ("Home" == fname) this.handleHome();
            else {
		if ("End" == fname) return void this.handleEnd();
		"New Line" == fname ?
		    this.handleNewLine() :
		    "Back Tab" == fname ?
		    this.handleBackTab() :
		    "Tab" == fname &&
		    this.doTab();
            }
            fieldData && (this._u(fieldData, element), this.Wu(fieldData));
	} else if ("Attn" == fname) this.wr();
	else if ("Sys Req" === fname) (this.Ds = !0), this.vr();
	else if ("Reset" === fname) this.doReset();
	else if ("Erase EOF" == fname) this.handleEraseEOF();
	else if ("Erase Field" == fname) this.handleEraseField();
	else if ("Erase Input" == fname) this.handleEraseInput();
	else if ("Erase Word" == fname) this.handleEraseWord();
	else if ("Delete" == fname) this.doDelete();
	else if ("Insert" == fname) {
	    this.inInsertMode = !this.inInsertMode;
	    if (this.renderer){
		this.renderer.redrawTransientElements();
	    }
	} else if ("Null" == fname) {
            const thing = 0;
            this.handleEnterSpecialCharacter(thing);
	} else if ("Dup" == fname) this.handleEnterSpecialCharacter(Ebcdic.fieldMark);  // this looks so messed up
	else if ("Field Mark" == fname) this.handleEnterSpecialCharacter(Ebcdic.recordMark); // with this having recordMark
	else if ("Hex Entry" == fname) {
            if (!this.kr()) return false;
            (this._e = []), (this.We = true);
	} else if ("Overstrike Sequence" == fname) {
            if (!this.kr()) return false;
            (this.Sr = true), (this.Tr = []);
	} else {
            if (!(null != (l = VirtualScreen3270.st[fname]) && 1 & l)){
		logger.warn("Unhandled 3270 function=" + fname);
		return false;
	    }
            this.runCommand(fname);
	}
	return !0;
    }
    
    kr(){ // (lc.prototype.kr = function () {
	let element = this.screenElements[this.cursorPos];
	const field = element && element.field;
	return (!(!field || !field.fieldData.isEditable() || this.cursorPos < field.start) ||
		(Utils.keyboardLogger.warn("Attempted to write in uneditable field"),
		 this.Su(1),
		 this.userAttentionSound(),
		 !1));
    }

    wr(){ // lc.prototype.wr = function () {
	if (this.inTN3270EMode){
	    this.sendBytes([255, 244]);
	} else {
	    this.sendBytes([255, 243]);
	}
    }

    sr(){ // (lc.prototype.sr = function () {
	if (this.isFormatted) {
            this.cacheFieldDataMap();
            let keys = Object.keys(this.fieldDataMap);
            for (let l = 0; l <keys.length; l++) {
		let n = this.fieldDataMap[keys[l]];
		if (n) {
                    let fieldCharAttrs = n.attributes,
			l = n.position;
                    if (!fieldCharAttrs.isProtected() && fieldCharAttrs.vs() && !fieldCharAttrs.isModified()) {
			let t = (l + 1) % this.size;
			return this.Su(3), this.setCursorPos(t), !1;
                    }
		}
            }
	}
	return !0;
    }
    
    vr(){ // lc.prototype.vr = function () {
	if (this.inTN3270EMode){
	    this.convoType = VirtualScreen3270.convoTypes.SSCPLU;
	    this.clear();
	    this.setCursorPos(0);
	    this.bufferPos = 1 % this.size;
	    this.isFormatted = !1;
	    this.doReset();
	} else {
	    this.Su(3);
	}
    }

    doReset(){ // (lc.prototype.Mu = function () {
	if (2 != this.Cu){
	    this.Fu();
	}
	this.inInsertMode = false;
	this.We = false;
	this._e = [];
	this.Sr = false;
	this.Tr = [];
	this.Vs.zs = 0;
    }
    
    // called from handleFunction("eraseField")
    handleEraseField(){ // lc.prototype.Ar = function () {
	var t, l, n;
	this.cacheFieldDataMap();
	if (this.isFormatted){
            if (!(n = this.getFieldData3270ByPosition(this.cursorPos, true)) || n.attributes.isProtected()) {
		this.Su(1);
		return (void (this.renderer && this.renderer.redrawTransientElements()));
	    }
            var i = this.Rr(this.cursorPos);
            t = i + this.dh(i);
	    l = i + 1;
	} else {
	    l = this.cursorPos;
	    t = this.size - 1;
	}
	this.zh(l, t, 0, !0, !0);
	if (n) {
	    n.setModified();
	}
	if (this.renderer){
	    this.renderer.fullPaint();
	}
    }

    static bh = [0, 0, 5, 1, 0, 0];
   
    static wi = 14;

    static Pt = [43, 67, 82];
    
    // these are reply/attention/AID things
    static Et = [88, 32, 91, 93]; 
    static St = [88, 32, 60, 45, 111, 45, 62];
    static yt = [88, 32, 45, 102];
    static xt = [88, 32, 80, 114, 111, 103, 32];
    static Mh:any = {
          O_MF: "An MF order was received with an invalid value.",
          O_SFE: "An SFE order was received with an invalid value.",
          O_SA: "An SA order was received with an invalid attribute type.",
          O_COM: "An unrecognized write command was received.",
          O_ORDER: "An unrecognized order was received.",
          ext_highlingting: "An SFE, SA or MF order was received with an invalid extended highlighting value.",
          ext_color: "An SFE, SA or MF order was received with an invalid extended color value.",
          attribute_type: "An SFE, SA or MF order was received with an invalid attribute type.",
          create_partition_was_ra: "A Create Partition structured field was received, but the partition was too large.",
    };

    
    _u(fieldData:FieldData3270,l:FieldData3270){ // (lc.prototype._u = function (t, l) {
	let n = !0,
            i = 0;
	if (fieldData && l) {
            if (this.isFormatted) {
		let e = this.getFieldData3270ByPositionNoNull(this.cursorPos, true).position,
                    s = fieldData.position,
                    u = fieldData.length;
		i = l.position;
		let h = s + u;
		if (!fieldData.attributes.isProtected() && fieldData.isModified() && fieldData.attributes.ws() && (e !== s || this.cursorPos === s))
                    for (let ttt = s + 1; ttt < h; ttt++) {
			let l = ttt % this.size,
                            i = this.getScreenElementByPosition(l),
                            e = i.charToDisplay();
			if (e === Ebcdic.fieldMark) {
                            n = !0;
                            break;
			}
                    0 === e && (n = !1);
                    }
            }
            return !!n || (this.setCursorPos(i), this.Su(3), !1);
	}
    }

    handleEraseEOF(){ // (lc.prototype.pr = function () {
	let t, l;
	if ((this.cacheFieldDataMap(), this.isFormatted)) {
            if (((l = this.getFieldData3270ByPosition(this.cursorPos, true)), !l || l.attributes.isProtected())) return this.Su(1), void (this.renderer && this.renderer.redrawTransientElements());
            {
		let l = this.Rr(this.cursorPos);
		t = l + this.dh(l);
            }
	} else t = this.size - 1;
	this.zh(this.cursorPos, t, 0, !0, !0), l && l.setModified(), this.renderer && this.renderer.fullPaint();
    }

    handleEraseInput(){ // (lc.prototype.br = function () {
	let t;
	this.cacheFieldDataMap();
	let l,
            n = 0,
            i = 0,
            e = 0;
	if (this.isFormatted) {
            var s = Object.keys(this.fieldDataMap);
            for (let l = 0; l < s.length; l++)
		if (((t = this.fieldDataMap[s[l]]), t && !t.attributes.isProtected())) {
                    (n = t.position), i++, 1 === i && (e = n + 1);
                    let l = n + t.length;
                    this.zh(n, l, 0, !0, !0), t && t.clearModified();
		}
	} else (l = this.size - 1), this.zh(n, l, 0, !0, !0), (e = 0);
	this.setCursorPos(e), this.renderer && this.renderer.fullPaint();
    }
    
    zh(t:number,l:number,n:number,i:boolean,e:boolean){ // (lc.prototype.zh = function (t, l, n, i, e) {
	let s,
            u = l < t ? l + this.size - t : l - t;
	for (let l = 0; l <= u; l++) {
            s = (t + l) % this.size;
            var h = this.screenElements[s];
            h && ((h.inputChar = n), (h.isModified = !!i), e && (h.charAttrs = null));
	}
    }

    // called from handleFunction("erase word")
    handleEraseWord(){ // (lc.prototype.gr = function () {
	let t, l, n, i;
	this.cacheFieldDataMap();
	let e = this.getScreenElementByPosition(this.cursorPos);
        let s = e.charToDisplay();
	if (this.isFormatted) {
            let t = this.getFieldData3270ByPositionNoNull(this.cursorPos, true);
	    let l = t.position;
	    let e = t.length;
            if (this.cursorPos === l || t.attributes.isProtected()) return this.Su(1), void (this.renderer && this.renderer.redrawTransientElements());
            (n = 64 !== s && 0 !== s ? this.cursorPos : this.cursorPos + 1), (i = l + e);
	} else {
	    n = this.cursorPos;
	    i = this.size;
	}
	for (let e = n; e < i; e++)
            if (((t = this.getScreenElementByPosition(e)), t)) {
		let n = t.charToDisplay();
		if (((l = t.position), !t || t.fieldData || 64 === n || 0 === n)) break;
		l++;
            }
	e && 64 !== s && 0 !== s && l++;
	for (let t = this.cursorPos; t < l; t++) this.doDelete();
    }
    
    Qu(t:number,l:number,n:number):boolean{ // (lc.prototype.Qu = function (t, l, n) {
	var e;
	this.cacheFieldDataMap();
	let i:number = (l < t) ? this.size + l : l;
	for (var s = -1, u = t; u < i; u++) {
            e = u % this.size;
            let h = this.screenElements[e];
            if (!h) {
		s = e;
		break;
            }
            if (0 == h.charToDisplay()){
		s = e;
		break;
            }
	}
	if (-1 == s) {
            let t = 0 == i ? this.size - 1 : (i - 1) % this.size,
		l = this.screenElements[t];
            (l && ( 64 == l.charToDisplay())) && (s = t); // JOE added non-null check
	}
	if (-1 == s) return false;
	for (let ll = s; ll != t; ll--) {
            e = ll % this.size;
            let tt = this.screenElements[e];
	    let nn = 0 == e ? this.screenElements[this.size - 1] : this.screenElements[e - 1];
	    if (!nn){
		throw "Illegal State: screenElement is null";
	    }
	    let ii = nn.charToDisplay();
            if (tt){
		tt.inputChar = ii;
		tt.isModified = true;
		this.Vs.Hs = true;
	    } else {
		tt = new ScreenElement(e, ii, null);
		tt.field = nn.field;
	    }
	}
	return this.Lu(n);
    }

    // called from handleFunction("delete") and .gr()
    doDelete(){ //(lc.prototype.mr = function () {
	let t;
	let l:FieldData3270|null = null;
	this.cacheFieldDataMap();
	let n = Math.floor(this.cursorPos / this.width) * this.width,
            i = n + this.width - 1;
	if (this.isFormatted){
            l = this.getFieldData3270ByPosition(this.cursorPos, !0);
	    if (l && l.isEditable() && this.cursorPos != l.position){
		this.cursorPos;
		let e = l.position;
		let dhRes = this.dh(e);
                let s = dhRes ? dhRes : l.length;  // dh can return null, null s and being
                                                   // annoying and invalidating next line
                let u = dhRes ? (e + s - 1) % this.size : (e + s) % this.size;
		t = (e !== u && u > n && u <= i) ? u : i;
            } else {
		this.Su(1);
		if (this.renderer){
		    this.renderer.redrawTransientElements();
		}
	    }
	} else {
	    t = i;
	    Utils.protocolLogger.debug("screenElements: "+ this.screenElements);
	}
	if (!t) return;
	for (let l = this.cursorPos; l < t; l++) {
            let t = this.screenElements[l];
            if (t) {
		let n = this.screenElements[l + 1];
		n ? ((t.inputChar = n.charToDisplay()),
		     (t.charAttrs = n.charAttrs),
		     t.inputChar !== t.ebcdicChar && ((t.isModified = !0), (this.Vs.Hs = !0))) :
		    ((t.isModified = !0),
		     (this.Vs.Hs = !0),
		     (t.inputChar = 0),
		     (t.charAttrs = null));
            }
	}
	let e = this.screenElements[t];
	if (e){
	    e.ebcdicChar;
	    e.isModified = !0;
	    e.inputChar = 0;
	    e.charAttrs = null;
	    this.Vs.Hs = !0;
	}
	if (l && l.isEditable() && this.cursorPos != l.position){
	    l.setModified();
	}
	if (this.renderer){
	    this.renderer.fullPaint();
	}
    }

    // called from handleFunction("FieldMark","Dup","Null")
    handleEnterSpecialCharacter(ch:number){ //   (lc.prototype.Er = function (t) {
	this.enterCharacterAtCursor(ch) && ch === Ebcdic.fieldMark && this.doTab();
	if (this.renderer){
	    this.renderer.fullPaint();
	}
    }

    // handle cursor movement
    handleCursorMovement(delta:number) { // lc.prototype.hr = function (t) {
	this.modifyCursorPos(delta); 
	if (1 === this.Cu){
	    this.Cu = null;
	    if (this.renderer){
		this.renderer.redrawTransientElements();
	    }
	}
    }

    // called from handle function
    er():number|null{ // lc.prototype.er = function () {
	if ((this.cacheFieldDataMap(), !this.isFormatted)) return 0;
	{
            let t = this.getFieldData3270ByPosition(this.cursorPos, !0);
            if (t) {
		if (t.isNoDisplay() || t.isDisplayNotDetectable()) return 0;
		let l = t.position;
		if (1 === t.length) return 0;
		let n = (l + 1) % this.size,
                    i = this.getScreenElementByPosition(n),
                    e = i.charToDisplay(),
                    s = this.getScreenElementByPosition(this.cursorPos),
                    u = s.charToDisplay();
		if (n !== this.cursorPos && 0 === u) return 0;
		let h = 126;
		if (110 != e && 111 != e) {
                    if (80 === e) h = 125;
                    else if (-65 & e) return 0;
                    return t.setModified(), this.inInsertMode && (this.inInsertMode = !1), h;
		}
		return (e ^= 1), (i.inputChar = e), (i.isModified = !0), (this.Vs.Hs = !0), 1 & e ? t.clearModified() : t.setModified(), this.renderer && this.renderer.fullPaint(), 0;
            } else {
		return null;
	    }
	}
    }

    handleNewLine(){ // (lc.prototype.cr = function () {
	this.cacheFieldDataMap();
	var t = Math.floor(this.cursorPos / this.width);
	if (!this.isFormatted) return this.setCursorPos((t + 1) * this.width), void (this.renderer && this.renderer.redrawTransientElements());
	var l = ((t + 1) * this.width) % this.size,
            n = this.getFieldData3270ByPosition(l, true);
	if (n && n.isEditable()) n.position == l ? this.setCursorPos(l + 1) : this.setCursorPos(l);
	else {
            var i = this.findMatchingEditableField(l, !1);
            i && this.setCursorPos(i + 1);
	}
	this.renderer && this.renderer.redrawTransientElements();
    }
    
    Tu():void{ // (lc.prototype.Tu = function () {
	var t = this.findMatchingEditableField(this.cursorPos, !1);
	if (null != t) {
	    Utils.protocolLogger.debug("Got editable field at " + t);
	    this.setCursorPos(t + 1);
	    if (this.renderer) {
		this.renderer.redrawTransientElements();
	    }
	} else {
	    this.setCursorPos(this.getFieldData3270ByPositionNoNull(this.cursorPos, !0).position + 1);
	    if (this.renderer){
		this.renderer.redrawTransientElements();
	    }
	}
    }
    
    doTab(){ // (lc.prototype.Uu = function () {
	if ((this.cacheFieldDataMap(), this.isFormatted)) {
            const t = this.getFieldData3270ByPositionNoNull(this.cursorPos, !0);
	    const l = t.position;
            if (l === this.cursorPos && t.isEditable()) {
		let t = (l + 1) % this.size;
		return this.setCursorPos(t), void (this.renderer && this.renderer.redrawTransientElements());
            }
            const n = this.findMatchingEditableField(this.cursorPos, !1);
            if (null != n) {
		Utils.protocolLogger.debug("Got editable field at " + n);
		this.setCursorPos(n + 1);
	    } else if (t.isEditable()){
		this.setCursorPos(t.position + 1);
	    }
	} else {
	    this.setCursorPos(0);
	}
	this.renderer && this.renderer.redrawTransientElements();
    }
    
    Cr(){ // (lc.prototype.Cr = function () {
	let element = this.screenElements[this.cursorPos];
	const field = element && element.field;
	if (field && field.fieldData.isEditable() && this.cursorPos >= field.start){
	    this.doDelete(); // INTERIM .mr
	}
    }
    
    Nr(){ // lc.prototype.Nr = function () {
	// *UNKNOWN* - why does this not wrap?? 
	if (0 != this.cursorPos){
	    this.modifyCursorPos(-1);
	}
	if (this.fu){  // *UNKNOWN* what does this.fu control?
	    this.Cr();
	}
    }
    
    Pr(){ // lc.prototype.Pr = function () {
	let element = this.screenElements[this.cursorPos];
	const t = element && element.field;
	if (!t || this.cursorPos <= t.start || !t.fieldData.isEditable()) {
            let t = this.findMatchingEditableField(this.cursorPos, !0);
            if (t) {
		const element2 = this.screenElements[t];
		const l = element2 && element2.field;
		l && ((t += l.fieldData.length - 1), Utils.protocolLogger.debug("Got editable field at " + t), this.setCursorPos(t), this.fu && this.doDelete());
            }
	} else this.Nr();
    }

    handleBackspace(){// (lc.prototype.rr = function () {
	this.cu ? this.Pr() : this.Nr();
    }

    handleHome(){//(lc.prototype.ar = function () {
	this.cacheFieldDataMap();
	if (!this.isFormatted) return this.setCursorPos(0), void (this.renderer && this.renderer.redrawTransientElements());
	var t = this.findMatchingEditableField(this.size - 2, !1);
	null != t && (this.setCursorPos(t + 1), this.renderer && this.renderer.redrawTransientElements());
    }

    handleBackTab(){ // (lc.prototype.dr = function () {
	this.cacheFieldDataMap();
	if (!this.isFormatted) return this.setCursorPos(0), void (this.renderer && this.renderer.redrawTransientElements());
	var t = this.screenElements[this.cursorPos];
	if (t && t.field && t.field.fieldData.isEditable()) { // JOE: added null check on element t
            var l = this.Rr(this.cursorPos) + 1;
            if (this.cursorPos != l && this.cursorPos + 1 != l) return this.setCursorPos(l), void (this.renderer && this.renderer.redrawTransientElements());
	}
	var n = this.findMatchingEditableField(this.cursorPos, !0);
	null != n && n != this.size - 1 && (this.setCursorPos(n + 1), this.renderer && this.renderer.redrawTransientElements());
    }
    
    handleEnd(){ // (lc.prototype.or = function () {
	this.cacheFieldDataMap();
	if (!this.isFormatted) return this.setCursorPos(this.size - 1), void (this.renderer && this.renderer.redrawTransientElements());
	let t:any;
        let l:number|null = this.cursorPos;
        let n = this.getFieldData3270ByPosition(this.cursorPos, true);
	if (!n || !n.isEditable()) {
            if (null == (l = this.findMatchingEditableField(this.cursorPos, !1))) return;
            n = this.getFieldData3270ByPosition(l, true);
	}
	if (n) {
            for (var i, e = (n.position + n.length) % this.size, s = 1; s < n.length; s++)
		if (((i = e - s < 0 ? this.size + (e - s) : e - s), (t = this.screenElements[i]) && (t.charToDisplay()) > 64)) return this.setCursorPos(1 == s ? i : i + 1), void (this.renderer && this.renderer.redrawTransientElements());
            this.setCursorPos(n.position + 1), this.renderer && this.renderer.redrawTransientElements();
	}
    }

    // called from handleFunction - indeterminate function
    Wu(t:FieldData3270){ // (lc.prototype.Wu = function (t) {
	const l = 1 & t.attributes.validation;
	return t.isModified() && l && ((this.getFieldData3270ByPositionNoNull(this.cursorPos, !0).position == t.position && this.cursorPos !== t.position) || this.handleFunction("Trigger")), !0;
    }

    // This is called from composition event and is weird,
    // and so is Ve
    ve(t:string):void{ // (lc.prototype.ve = function (t) {
	if (this.renderer) {
            let l = 0;
	    let n:boolean = this.je() == this.cursorPos;
	    let i:number[] = this.Ve(t, n, !0);
            for (l = 0; l < i.length; l++) this.Kl[this.cursorPos + l] = i[l];
            null !== this.zn && void 0 !== this.zn && this.Ui(this.zn), this.renderer.fullPaint();
	}
    }

    // I think t should always be a number, but... I have no proof yet
    ur(t:number):void{ // (lc.prototype.ur = function (t) {
	if (this.convoType === VirtualScreen3270.convoTypes.NVT){
	    this.nvtSendScreen(); // eh()
	    this.handleNVTData1([13, 10]);
	} else {
	    this.Me = false;
	    this.inInsertMode = false;
	    this.Vs.zs = 1;
	    this.doReadModified(t);
	}
    }

    // t is a full JSON message thingy
    // l is a QReply
    // and it's *NOT* called
    Fr(t:any,l:QReply ):void{ // (lc.prototype.Fr = function (t, l) {
	let logger = Utils.messageLogger;
	if (l){
	    logger.debug("Sending message with data to b64:");
	    Utils.hexDumpU8(l.data, logger);
	    t.command.data = l.toB64();
	}
	logger.debug("Sending message: "+t);
	if (null != this.websocket){
	    this.websocket.send(JSON.stringify(t));
	}
    }

    // called for handleReadModified -- evil assignment of t here
    doReadModified(aid:number){ // lc.prototype.Ke = function (t) {
	if (!aid || TN3270EParser.AID_STRUCTURED_FIELD == aid){
	    aid = TN3270EParser.AID_NO_AID;
	}
	return this.gatherModifiedAndSend(TN3270EParser.COMMAND_READ_MODIFIED, aid);
    }

    doReadModifiedAll(aid:number){ // (lc.prototype.Wh = function (t) {
	if (!aid || TN3270EParser.AID_STRUCTURED_FIELD == aid){
	    aid = TN3270EParser.AID_NO_AID;
	}
	return this.gatherModifiedAndSend(TN3270EParser.COMMAND_READ_MODIFIED_ALL, aid);
    }
    
    Dr(t:number[],l:boolean,n?:boolean){ // (lc.prototype.Dr = function (t, l, n) {
	if (t) {
            for (var i, e, s = 0; s < this.size; s++) (i = this.screenElements[s]) ? (n ? (e = i.inputChar) && i.isModified && (t.push(e), (i.isModified = !1), (i.ebcdicChar = e)) : (e = i.charToDisplay()) && (e < 64 && (e = 64), t.push(e))) : l || t.push(0);
            null != this.websocket && (this.eorAndSend(t), this.Su(2));
	}
    }
    
    xr(t:number[]){ // (lc.prototype.xr = function (t) {
	if (t) {
            for (var l = 0; l < this.size; l++) t.push(0);
            null != this.websocket && (this.eorAndSend(t), this.Su(2));
	}
    }

    static encodeBAArray = [
	64, 193, 194, 195, 196, 197, 198,199,200,201,74,75,76,77,78,79,80,209,210,211,212,213,214,215,216,217,
	90,91,92,93,94,95,96,97,226,227,228,229,230,231,232,233,106,107,108,109,110,111,240,241,242,243,244,245,
	246,247,248,249,122,123,124,125,126,127
    ];


    static encodePosition(partitionInfo:any, position:number){ // (lc.Vh = function (t, l) {
	let logger = Utils.protocolLogger;
	var b1, b2;
	if (partitionInfo.size > 0x3FFF){
	    logger.warn("partition size above 14 bits. could be an issue with 16 bit SBA.");
	}
	if ( !0 === partitionInfo.amode || partitionInfo.size > 4095){
	    b1 = position >> 8;
	    b2 = 255 & position;
	} else {
            let ttt = 192 & position;
            ttt >>= 6;
            let e = position >> 8;
            (e <<= 2),
	    (ttt |= e),
	    (ttt &= 63),
	    (b1 = VirtualScreen3270.encodeBAArray[ttt]),
	    (b2 = VirtualScreen3270.encodeBAArray[(position &= 63)]);
	}
	return { lr: b1, nr: b2 };
    }

    // read buffer, but its a fsck-ing nightmare of ambiguity about the array
    _h(t:number){ //  (lc.prototype._h = function (t) {
	let logger = Utils.protocolLogger;
	if (!t || (TN3270EParser.AID_STRUCTURED_FIELD == t)){
	    t = TN3270EParser.AID_NO_AID;
	}
	// n/l type ambiguities
	var l = this.partitionInfoMap[this.currentPartitionID];
	let n:number[] = this.buildReadResponseHeader();
        let localCharAttrs = new CharacterAttributes3270(0); // was i
	n.push(t);
	if (TN3270EParser.AID_CLEAR_KEY === t){
	    this.cursorPos = 0;
	}
	var e = VirtualScreen3270.encodePosition(l, this.cursorPos);
	if ((Utils.pushTelnetByte(n, e.lr), Utils.pushTelnetByte(n, e.nr), !this.isFormatted)) return TN3270EParser.AID_CLEAR_KEY === t ? this.xr(n) : this.Dr(n, false);
	for (var s = 0; s < this.size; s++)
            if (TN3270EParser.AID_CLEAR_KEY === t) n.push(0);
	else {
            let t = this.fieldDataMap[s];
            if (t)
		if (VirtualScreen3270.REPLY_MODE_FIELD === this.replyMode) n.push(29), n.push(t.attributes.sn);
            else {
		n.push(41);
		var u = t.attributes.os();
		n.push(u.length / 2);
		for (let t = 0; t < u.length; t++) n.push(u[t]);
            }
        else {
            let tt = this.screenElements[s];
            if (tt) {
                if (VirtualScreen3270.REPLY_MODE_CHARACTER === this.replyMode) {
                    let l:Map<number,number>|null = tt.charAttrs ? localCharAttrs.cs(tt.charAttrs as CharacterAttributes3270) : null;
                    if (null != l) {
                        // i  = tt.charAttrs; // i is not referenced downstream
			n.push(40);
			l.forEach(function(value,key){
			    n.push(key);
			    n.push(value);
			});
                    }
                }
                let l = tt.charToDisplay();
                l ? (l < 64 && l !== Ebcdic.fieldMark && l !== Ebcdic.recordMark && (l = 64), tt.isGraphic && n.push(8), n.push(l)) : n.push(0);
            }
        }
	}
	null != this.websocket && (logger.debug("aid=" + Utils.hexString(t)), logger.debug("Sending read response with bytes=" + n), this.eorAndSend(n), this.Su(2));
    }

    // this guy writes the 5-byte header, but also might some more stuff for non default/0 partitionID's
    // this never returns a falsy value
    buildReadResponseHeader():number[]{ // (lc.prototype.Or = function () {
	let t:number[];
	if (this.convoType === VirtualScreen3270.convoTypes.SSCPLU) {
	    this.Ds ? ((t = [255, 245, 7, 0, 0, 0, 0]), (this.Ds = !1)) : (t = [7, 0, 0, 0, 0]);
	} else if (this.parser && this.inTN3270EMode) { // JOE this.parser is in there to make TSC happy
            t = [0, 0, 0];
            let seqNo = this.parser.sequenceNumber++;
            Utils.pushTelnetByte(t, (seqNo && 0xFF00) >> 8);
	    Utils.pushTelnetByte(t, (seqNo && 0x00FF));
	    if (this.currentPartitionID){ // 0 if un-partitioned
		let partitionHeader = [136, 0, 0, 128, this.currentPartitionID];
		// let i = this.Mr();
		t.push(...partitionHeader);
	    }
	} else if (!this.parser){
	    throw "No Parser in VirtualScreen3270.or";
	} else {
	    t = [];
	}
	return t;
    }

    // no longer called, incorporated into lc.prototype.Or()
    Mr(){ // (lc.prototype.Mr = function () {
	let t;
	return (t = this.currentPartitionID ? [136, 0, 0, 128, this.currentPartitionID] : []), t;
    }
    
    Ur(t:number[],l:number){ // lc.prototype.Ur = function (t, l) {
	Utils.pushTelnetByte(t, l), null != this.websocket && (this.eorAndSend(t), this.Su(2));
    }
    
    Lr(){ // (lc.prototype.Lr = function () {
	let t = !1;
	if ((this.cacheFieldDataMap(), this.isFormatted)) {
            var l = Object.keys(this.fieldDataMap);
            for (n = 0; n < l.length; n++)
		if (this.fieldDataMap[l[n]].isModified()) {
                    t = !0;
                    break;
		}
	} else {
            let l;
            for (var n = 0; n < this.size; n++)
		if (((l = this.screenElements[n]), l && l.isModified)) {
                    t = !0;
                    break;
		}
	}
	return t;
    }

    static isShortReadAID(aid:number):boolean{
	return ((TN3270EParser.AID_PA1 === aid) ||    // 108
	    (TN3270EParser.AID_PA2 === aid) || // 110
	    (TN3270EParser.AID_PA3 === aid) || // 107
	    (TN3270EParser.AID_CLEAR_KEY === aid) || // 109
	    (TN3270EParser.AID_CLEAR_PARTITION_KEY === aid)); // 106
    }

    gatherModifiedAndSend(readCommand:number,
			  aid:number){ //(lc.prototype.Ir = function (t, l) {
	let logger = Utils.protocolLogger;
	console.log("JOE gatherModifiedAndSend readCommand="+readCommand+
	    " aid="+aid+" this.currentPartitionID="+this.currentPartitionID);
	this.cacheFieldDataMap();
	var n = this.partitionInfoMap[this.currentPartitionID];
	logger.debug("--- read command: " + Utils.hexString(readCommand));
	let i:number[] = this.buildReadResponseHeader();
	if (i) {
            if (this.convoType === VirtualScreen3270.convoTypes.SSCPLU) {
		return this.Dr(i, true, true);
	    }
            if ((readCommand === TN3270EParser.COMMAND_READ_MODIFIED) &&
		VirtualScreen3270.isShortReadAID(aid)){
		Utils.protocolLogger.debug("--- short read AID: " + Utils.hexString(aid));
		return this.Ur(i, aid);
	    }
            if ((readCommand === TN3270EParser.COMMAND_READ_MODIFIED_ALL) &&
		(TN3270EParser.AID_CLEAR_KEY === aid)){
		this.cursorPos = 0;
	    }
	    Utils.pushTelnetByte(i, aid);
            var e = VirtualScreen3270.encodePosition(n, this.cursorPos);
	    Utils.pushTelnetByte(i, e.lr);
	    Utils.pushTelnetByte(i, e.nr);
            if ( 110 === readCommand && TN3270EParser.AID_CLEAR_KEY === aid) return void (null != this.websocket && (this.eorAndSend(i), this.Su(2)));
	}
	if (!this.isFormatted) {
	    return this.Dr(i, true);
	}
	if (110 === readCommand || 126 !== aid) {
            this.size;
            for (var s = Object.keys(this.fieldDataMap), u = (this.Te(this.cursorPos), 0); u < s.length; u++) {
		var h = this.fieldDataMap[s[u]],
                    v = 0,
                    r = (h.position + 1) % this.size;
		if (h.isModified()) {
                    logger.debug("modified field found " + h + " with first pos " + r + " nonNullCount=" + v);
                    var a = [];
                    if (this.fieldDataMap[r]) logger.debug("skipping check on 0-length field at " + r);
                    else {
			var o, c, f, d = r, w = new Array(h.length - 1);
			for (var p = 0; p < h.length - 1; p++)
                            (o = (d + p) % this.size),
			(c = this.screenElements[o]) && (f = c.charToDisplay()) && (f < 64 && f !== Ebcdic.fieldMark && f !== Ebcdic.recordMark && (f = 64),
										    (w[v++] = { char: f, fn: c.isGraphic }));
			for (p = 0; p < v; p++) 1 == w[p].fn && (logger.debug("Pushed graphics escape for char=" + w[p].char),
								 a.push(8)), a.push(w[p].char);
			logger.debug("Modified data is length=" + a.length);
                    }
                    var A = VirtualScreen3270.encodePosition(n, r);
                    if ((Utils.pushTelnetByte(i, 17),
			 Utils.pushTelnetByte(i, A.lr),
			 Utils.pushTelnetByte(i, A.nr), a.length > 0)) {
			for (p = 0; p < a.length; p++) Utils.pushTelnetByte(i, a[p]);
			logger.debug("Sending modified field at " + r + " with bytes" + a);
                    }
		}
            }
	} else if (126 === aid) {
            let t = Object.keys(this.fieldDataMap);
            for (let l = 0; l < t.length; l++) {
		let e = this.fieldDataMap[t[l]],
                    s = (e.position + 1) % this.size;
		if (e.isModified()) {
                    let t = VirtualScreen3270.encodePosition(n, s);
                    Utils.pushTelnetByte(i, 17), Utils.pushTelnetByte(i, t.lr), Utils.pushTelnetByte(i, t.nr);
		}
            }
	}
	null != this.websocket && (this.eorAndSend(i), this.Su(2));
    }

    // matches a string against what's on the screen as a subfunction of _r()
    // no translation, just raw EBCDIC char matching
    matchEbcdic(ebcdicChars:number[],
		n:number){ // (lc.prototype.Br = function (t, n) {
	for (var i = ebcdicChars.length, e = 0; e < i; e++) {
            var s = ebcdicChars[e],
	    u = this.screenElements[n + e];
            if (!u || u.ebcdicChar != s) {
		Utils.coreLogger.debug("Could not find text");
		return false;
	    }
	}
	Utils.coreLogger.debug("found text");
	return true;
    }

    // matches a string against what's on the screen
    findFirstEbcdicMatchOnRow(ebcdicCharArray:number[], // but really a number array with one broken call in uses
       startColumn:number,
       endColumn:number,
       row:number):number{ // (lc.prototype._r = function (t, n, i, e) {
	let s;
        let u = ebcdicCharArray.length;
        let h = -1 == endColumn ? this.width - u : endColumn;
        let r:number = this.width * row;
	for (s = startColumn; s <= h; s++)
	    if (this.matchEbcdic(ebcdicCharArray, (r + s) % this.size)){
		Utils.coreLogger.debug("context matchPos=" + (r + s));
		return  r + s;
	    }
	return -1;
    }

    // returns a normal Javascript unicode string
    // warning, this does NOT handle alternate charsets at all!!!
    // fills missing elements as normal blank (unicode == 0x20)
    getRowCharsAsString(rowNumber:number,
			startColumn:number,
			length:number):string{ // (lc.prototype.Wr = function (t, l, n) {
        let e = this.width * rowNumber;
        let charArray = [];
	for (let i:number = 0; i < length; i++) {
            var u = this.screenElements[e + startColumn + i];
            charArray.push(u ? Renderer3270.ebcdic1047ToUnicode[u.ebcdicChar] : 0x20);
	}
	return String.fromCharCode.apply(null, charArray).trim();
    }
    
    Qr(t:number, n:number, i:number, e:number):string{ // (lc.prototype.Qr = function (t, n, i, e) {
    var s,
        u = "";
	for (s = t; s <= n; s++) {
            let h:number = e - i + 1;
            Utils.coreLogger.debug("colWidth=" + h), (u += this.getRowCharsAsString(s, i, h)), (u += " ");
	}
	return u.trim();
    }

    // returns first matching row number or -1
    findMatchingRow(firstLine:number, // 0 based or 1 based??
       l:boolean,
       n:boolean,  // is not used??
       startColumn:number,
       startColumnChar:number,
       endColumn:number,
       endColumnChar:number,
       allowableMiddleChars:number[]):number { // (lc.prototype.Gr = function (t, l, n, i, e, s, u, h) {
	// iterate over lines
	for (let r:number = firstLine; l ? r >= 0 : r < this.height; l ? r-- : r++) {
            let a:ScreenElement|null = this.getScreenElementRowColumn(r, startColumn);
	    let o:ScreenElement|null  = this.getScreenElementRowColumn(r, endColumn);
            if (a && o) {
		if (!a.match(startColumnChar, true) || !o.match(endColumnChar, true)) continue;
		let everythingMatches = true;
		for (let f = startColumn + 1; f < endColumn; f++) {
                    var d = this.getScreenElementRowColumn(r, f);
                    if (!d || !d.matchAnyOf(allowableMiddleChars, true)) {
			everythingMatches = !1;
			break;
                    }
		}
		if (everythingMatches) return r;
            }
	}
	return -1;
    }

    /*
      *UNKNOWN* why two definitions of jr(t,l) and neither is called??
    (lc.prototype.jr = function (t, l) {
	for (var n = this.Rr(t), i = this.dh(n) + n, e = [], s = n; s < i; s++) {
            var u = this.getScreenElementByPosition(n),
		h = u.charToDisplay();
        h < 64 && (h = 64), l ? e.push(this.renderer.Gt[h]) : e.push(h);
	}
	return String.fromCharCode.apply(null, e);
    }),
    (lc.prototype.jr = function (t, l) {
	var n = this.Rr(t),
            i = this.dh(t);
	return this.Vr(n, i, l);
    }),
    */
    
    Rr(t:number){ // (lc.prototype.Rr = function (t) {
	var l = this.screenElements[t];
	return l && l.field ? l.field.fieldData.position : null;
    }
    
    dh(t:number):number|null{ // (lc.prototype.dh = function (t) {
	let l:number|null = this.findMatchingFieldNearPosition(t, false, false, false);
        return null != l ? (l < t ? this.size - t : l - t) : null;
    }

    /* only called from defunct lc.prototype.jr
    Vr(t:number,l:number,n){ // (lc.prototype.Vr = function (t, l, n) {
	for (var i = this.Rr(t), e = this.dh(t), s = l > e - (t - i) ? i + e : t + l, u = [], h = t; h < s; h++) {
            let t = this.getScreenElementByPosition(h);
            var r = t.charToDisplay();
            n ? u.push(r) : u.push(this.renderer.unicodeTable[r]);
	}
	return String.fromCharCode.apply(null, u);
    }
    */
    
    zr(t:number):number|null{ // (lc.prototype.zr = function (t) {
	return this.Kr(t, !0, !1);
    }
    
    Kr(position:number, isEditable:boolean, n:boolean):number|null{ // (lc.prototype.Kr = function (t, l, n) {
	return this.findMatchingFieldNearPosition(position, !0, isEditable, n);
    }

    /* This gets a field that matches backwards/forwards, with editibility switch
       'thingy' arg is not understood yet.
       It is the basis for tabbing forwards and backwards throughout the input handling.
       Returns position of the field character that defines the field
 */
    findMatchingFieldNearPosition(position:number,
				  searchBackwards:boolean,
				  isEditable:boolean,
				  thingy:boolean):number|null{ //(lc.prototype.Gu = function (t, l, n, i) {
	this.cacheFieldDataMap();
	let fieldPosition:number = -1;
        let fieldData = this.getFieldData3270ByPosition(position, !0);
	if (fieldData){
	    fieldPosition = fieldData.position;
	    Utils.protocolLogger.debug("original element field data=" + fieldData.toString());
	}
	let fieldMapKeys:any[] = Object.keys(this.fieldDataMap);
        let r = 0; // the key to the one we want
	let e:number = 0;
	for (; e < fieldMapKeys.length; e++)
            if (fieldMapKeys[e] == fieldPosition) {
		r = e;
		break;
            }
	let loopDelta:number = new Boolean(searchBackwards).valueOf() ? -1 : 1;
	for (var o:number = r + loopDelta; ; ) {
            if ((o = (o < 0 ? fieldMapKeys.length + o : o % fieldMapKeys.length)) == e) return null;
            var c = fieldMapKeys[o];
            if (!this.isMatchingField(fieldPosition, (this.screenElements[c] as ScreenElement), isEditable) && // JOE used to sloppily compared == 0
		(!isEditable || this.fieldDataMap[c].isEditable())) {
		var f = Number(c),
                    d = (f + 1) % this.size,
                    w = this.fieldDataMap[d];
		if (!thingy || !w) return f;
            }
            o += loopDelta;
	}
	// The above for loop is really while(true), because test is empty
    }

    /* returns position of the field character that defines the field */
    findMatchingEditableField(position:number,searchBackwards:boolean){ // (lc.prototype.yr = function (t, l) {
	return this.findMatchingFieldNearPosition(position, searchBackwards, true, true);
    }
    
    isMatchingField(position:number,
       element:ScreenElement,
       requireEditableField:boolean):boolean{ // (lc.prototype.Hr = function (t, l, n) {
	if (element.field) {
            var field = element.field;
            if (!requireEditableField || field.fieldData.isEditable()){
		return field.fieldData.position === position;
	    }
	}
	return false;
    }
    
    findBoxTopRow(t:number,startColumn:number,endColumn:number){ // (lc.prototype.Yr = function (t, l, n) {
	return this.findMatchingRow(t, true, true,
				    startColumn, Ebcdic.boxTopLCorner,
				    endColumn, Ebcdic.boxTopRCorner,
				    [ Ebcdic.boxHLine] );
    }
    
    findBoxBottomRow(t:number,startColumn:number,endColumn:number){ // (lc.prototype.qr = function (t, l, n) {
	return this.findMatchingRow(t, false, true,
				    startColumn, 196,
				    endColumn, 212,
				    [ Ebcdic.boxHLine, Ebcdic.boxTUp ]);
    }
    
    findBoxDividerRow(t:number, startColumn:number, endColumn:number){ // (lc.prototype.Jr = function (t, n, i) {
	Utils.coreLogger.debug("find box divider from " + t);
	let middleChars = [ Ebcdic.boxHLine, 0xC7, 0xCC, Ebcdic.boxCrossedLines, 0xD7];
	return this.findMatchingRow(t, false, true,
				    startColumn, Ebcdic.boxTRight,
				    endColumn, Ebcdic.boxTLeft,
				    middleChars);
    }

    
    static ebcdicFile = [0xC6, 0x89, 0x93, 0x85]; // global zo - the word "File" in EBCDIC
    static ebcdicCommand = [0xC3, 0x96, 0x94, 0x94, 0x81, 0x85, 0x84]; // global Ko: "Command"
    static ebcdicMXI = [0xD4, 0xE7, 0xC9 ]; // global Ho: "MXI"

    // this seems fishy, like old demo code
    getDemoScreenContext(){ // (lc.prototype.Zr = function (t) { // parm was never used or passed in
	if (!this.isFieldDataMapCached || !this.Vu) { // JOE: changed from ==0 to ! because falsey tests are cranky in TS
            this.cacheFieldDataMap();
            var n:any = { application: "unknown" };
	    this.latestDemoScreenContext = n;
            if ((
		-1 != this.findFirstEbcdicMatchOnRow(VirtualScreen3270.ebcdicFile, 16, 20, 0) &&
		-1 != this.findFirstEbcdicMatchOnRow(VirtualScreen3270.ebcdicCommand, 1, 1, 2))){
		n.application = "e3270";
		n.screenID = this.getRowCharsAsString(3, 1, 8);
	    } else if (-1 != this.findFirstEbcdicMatchOnRow(VirtualScreen3270.ebcdicFile, 3, 3, 0) &&
		     -1 != this.findFirstEbcdicMatchOnRow(VirtualScreen3270.ebcdicMXI, 1, 1, 2)) {
		n.application = "MXI";
		Utils.coreLogger.debug("likely MXI, further investigation coming");
		var i = this.findFirstEbcdicMatchOnRow([ Ebcdic.hyphen ], 6, 20, 2);
                    -1 != i && (n.screenID = this.getRowCharsAsString(2, 6, i - 6));
            } else n.screenID = this.getRowCharsAsString(2, 1, 8);
            this.Vu = !0;
	}
	return this.latestDemoScreenContext;
    }

    // looks like more demo code
    // E3270 is an IBM 3270 screen formatter used in the OMEGAMON product family
    getE3270ScreenContextInfo(t:any,
       n:any, // bound, not used
       i:number,
       e:number){ // (lc.prototype.$r = function (t, n, i, e) {
	let logger = Utils.coreLogger;
	var s = this.findBoxTopRow(i, 1, this.width - 2);
	if ((logger.debug("box top = " + s), -1 != s)) {
            var u = this.findBoxBottomRow(i, 1, this.width - 2);
            if ((logger.debug("boxBottom = " + u), -1 != u)) {
		logger.debug("should identify e3270 table and column");
            var h = this.getRowCharsAsString(s + 1, 5, 120).trim();
		t.tableName = h;
		var r = this.findBoxDividerRow(s + 1, 1, this.width - 2),
                    a = -1 == r ? -1 : this.findBoxDividerRow(r + 1, 1, this.width - 2),
                    o = -1 == a ? -1 : this.findBoxDividerRow(a + 1, 1, this.width - 2);
		logger.debug("titleDivider=" + r + " colTitleTop=" + a + " colBottom=" + o);
		var c:any[] = [];
		t.columnInfos = c;
		if (-1 != o) {
                    var f,
                    d = 1,
			w = -1;
                    for (f = 2; f <= this.width - 1; f++) {
			let i = this.width * a,
                            s = this.screenElements[i + f];
			if (s && 162 != s.ebcdicChar) { // JOE: added nullity test
                            logger.debug("col sep at " + f + " char=0x" + Utils.hexString(s.ebcdicChar));
                            var v:any = { index: c.length };
                            (v.name = this.Qr(a + 1, o - 1, d + 1, f - 1)),
                            e > d && e < f && (logger.debug("setting ccIx = " + c.length + " for column = " + e + " pos=" + n), (t.currentColumnIndex = c.length)),
                            c.push(v),
                            -1 == w && (w = f),
                            (d = f);
			}
                    }
                var p = 0;
                    for (t.rowIds = [], f = o + 1; f < u; f++) {
			let l = this.width * f + 3,
                            n = this.screenElements[l];
			if (!n || !n.isGraphic|| 162 != n.ebcdicChar) {
                            var A = w - 2;
                            t.rowIds.push(this.getRowCharsAsString(f, 2, A)), i == f && (t.currentRowIndex = p), p++;
			}
                    }
                    t.rowCount = p;
		}
            }
	}
    }

    // looks like more demo code
    // E3270 is an IBM 3270 screen formatter used in the OMEGAMON product family
    getMXIScreenContextInfo(context:any,
			    screenPos:number, // not used inbody
			    n:number,
			    i:number){ // (lc.prototype.ta = function (t, l, n, i) {
	let e;
        let s:any[] = [];
	context.columnInfos = s;
	var u = 0,
            h = 6 * this.width,
            r = this.getRowCharsAsString(2, 6, 15),
            a = r.indexOf("-");
        /* There's some fiddling about to find columns in an MXI screen that I don't fully grok,
	   but is almost surely not important.
	*/
	for (-1 != a && (r = r.substring(0, a)), context.tableName = r, e = 1; e < this.width; e++) {
            var o = this.screenElements[h + e];
            if (o && o.fieldData) {
		var c:any = { index: s.length };
                var f = e - u - 1;
		c.name = this.getRowCharsAsString(5, u + 1, f);
		if (i > u && i < e){
		    context.currentColumnIndex = s.length;
		}
		s.push(c);
		u = e;
            }
	}
	n > 5 && n < this.height - 2 && (context.currentRowIndex = n - 5);
    }

    // more demo code?
    getDemoScreenContextPlus(screenPos:number){ // (lc.prototype.Eu = function (t) {
	var row = Math.floor(screenPos / this.width),
            column = Math.floor(screenPos % this.width);
	Utils.coreLogger.debug("before getScreenContext()");
	let context = this.getDemoScreenContext();
	if (context){
	    if ("e3270" == context.application) {
		this.getE3270ScreenContextInfo(context, screenPos, row, column);
	    } else if ("MXI" == context.application){
		this.getMXIScreenContextInfo(context, screenPos, row, column);
	    }
	}
	return context;
    }
    
    Ui(customizations:any){ // (lc.prototype.Ui = function (t) {
	if (customizations != null){
	    this.setCharsetInfo(this.zn.language); // why not 'customizations.language'
	}
    }
    
    handleContextMenu(event:MouseEvent){ // (lc.prototype.Ae = function (t) {
	let logger = Utils.coreLogger;
	event.preventDefault();
	var eventX = event.offsetX,
            eventY = event.offsetY;
	logger.debug("contextMenu handler x=" + eventX + ", y=" + eventY);
	if (this.renderer) {
            let rowAndColumn = this.renderer.getRowAndColumnFromEventXY(eventX, eventY);
	    logger.debug("row,col = "+rowAndColumn);
            if ( rowAndColumn != null){
		var logicalScreenPos = rowAndColumn.rows * this.width + rowAndColumn.columns;
		logger.debug("screenElt at " + logicalScreenPos + " = " + this.screenElements[logicalScreenPos]);
		var context = this.getDemoScreenContextPlus(logicalScreenPos);
		logger.debug("contextMenu screenContext="+context);
		if (this.callbacks && this.callbacks.contextCallback){
		    this.callbacks.contextCallback(event, context);
		}
            }
	}
    }

    handleDoubleClick(x:number,
		      y:number,
		      coords:any,
		      screenPos:number,
		      s?:any){ // (lc.prototype.oe = function (t, l, n, i) {
	this.mu(coords, screenPos);
	this.handleFunction("Enter");
	Utils.eventLogger.debug("dblclick, x=" + x + ", y=" + y);
    }

    Li(){ // (lc.prototype.Li = function () {
	Utils.eventLogger.debug("Resize completed");
    }

    handleSSCPData(t:any) { // lc.prototype.lh = function (t) {
	console.log("SSCP data is currently stubbed out");
    }

    handleNVTData1(t:any){ // lc.prototype.nh = function (t) {
	console.log("NVT data (case 1) is currently stubbed out");
    }

    handleNVTData2(t:any){ // lc.prototype.ih = function (t) {
	console.log("NVT data (case 2) is currently stubbed out");
    }

    /* There's some crazy stuff going on in here.  
       eh() is the only caller of uh()
       uh calls something called Gl() in a renderer.
       Gl adds a string (!) to an array to send back to server, not a number
     */
    nvtSendScreen(){ // (lc.prototype.eh = function () {
	let t = this.iu,
            l = [];
	t > this.screenElements.length && (t -= this.screenElements.length);
	for (var n = t; n < this.screenElements.length; n++) {
            let t = this.screenElements[n];
            if (!t) break;
            {
		let n = t.charToDisplay();
		if (-1 === n || 0 === n) break;
		if (n < 64){
		    (21 === n ? l.push(13, 37) : l.push(64));
		} else {
		    l.push(n);
		}
            }
	}
	if (this.parser){ // probably true in any usage
	    l.push(13, 37);
	    this.parser.sh && l.push(255, 249);
	    this.nvtSendBytes(l);
	    this.parser.Bu = true;
	}
    }

    // this.handleProgramTab(orders, orderCount, orderBufferPos, size); 
    handleProgramTab(orders:any,l:number,n:number,i:number){ // (lc.prototype.hh = function (t, l, n, i) {
	let logger = Utils.protocolLogger;
	let e:FieldData3270|null = null;
        let s:any = null;
        let u,
            h = 0,
            r = n % i,
            a = orders.length,
            order = orders[(l + a - 1) % a],
            c = 0,
            keys = Object.keys(this.fieldDataMap);
	if (!this.isFormatted)
            for (let pos = r; pos < i; pos++) {
		let l = this.getScreenElementByPosition(pos);
		if (l) {
                    if (l.field) break;
                    (l.inputChar = 0x40), (l.isModified = !0), (l.charAttrs = null), (this.Vs.Hs = !0);
		}
            }
	for (let pos = r; pos < i; pos++) {
            let l = this.getFieldData3270ByPosition(pos, false);
            if (l) {
		(e = l), (s = pos);
		break;
            }
	}
	if (e) {
            c = e.position;
	    (u = e.length ? e.length : this.rh(keys, c)); 
            let t = c + u;
            t > i && ((t = i), (u = i - c));
            let l = keys.indexOf(String(e.position));
            if (s && s >= c && s < t) {
		if (("O_D" === order.t || 0xFFFFFF === order.key) &&
		    ((h = u - (s - c)),
		     s !== c && h > 0))
                    for (let t = 0; t < h; t++) {
			let l = (s + t) % this.size;
			let element = this.getScreenElementByPosition(l);
			if (element){
			    element.inputChar = 0x40; // a blank
			    element.isModified = true;
			    element.charAttrs = null;
			    this.Vs.Hs = !0;
			}
                    }
		if (e.position == n && e.isEditable()) return void (this.bufferPos = (e.position + 1) % i);
		l = 1 === keys.length ? 0 : l + 1;
		for (let t = l; t < keys.length; t++) {
                    let l = this.fieldDataMap[keys[t]];
                    if (l && !l.attributes.isProtected()) return (this.bufferPos = (l.position + 1) % i), void logger.debug("---- bufferPos=" + this.bufferPos);
                    this.bufferPos = 0;
		}
            } else r >= t && (this.bufferPos = 0);
            logger.debug("---- currentFieldData.position=" + e.position),
	    logger.debug("---- currentFieldData.length=" + e.length),
	    logger.debug("---- fieldData=" + e),
	    logger.debug("---- isProtected=" + e.attributes.isProtected());
	} else this.bufferPos = 0;
    }
    
    rh(t:any[],l:number):number{ // (lc.prototype.rh = function (t, l) {
	let n,
            i = t.indexOf(String(l));
	if (i > -1)
            if (1 == t.length) n = this.size;
	else {
            let e;
            e = i === t.length - 1 ? this.fieldDataMap[t[0]] : this.fieldDataMap[t[i + 1]];
            let s = e.position - l;
            s < 0 && (s = this.size - l + e.position), (n = s);
	}
	else n = 0;
	return n;
    }


    buildImplicitPartitionReply(t:number,l:number):Uint8Array{ // (lc.prototype.Rh = function (t, l) {
	var n = new Uint8Array(13);
	(n[0] = 0),
	(n[1] = 0),
	(n[2] = 11),
	(n[3] = 1),
	(n[4] = 0),
	(n[5] = 0),
	(n[6] = 80),
	(n[7] = 0),
	(n[8] = 24),
	(n[9] = (t >> 8) & 255),
	(n[10] = 255 & t),
	(n[11] = (l >> 8) & 255),
	(n[12] = 255 & l);
	return n;
    }

    buildUsableAreaReply(t:number, l:number):Uint8Array{
	var n = new Uint8Array(19);
	(n[0] = 3), (n[1] = 0), (n[2] = (t >> 8) & 255), (n[3] = 255 & t), (n[4] = (l >> 8) & 255), (n[5] = 255 & l), (n[6] = 1);
	var i = window.screen.height,
        e = window.screen.width;

        var s,u;
	if (this.canvas){
	    s = this.canvas.height * ((l - 2) / l),
            u = this.canvas.width;
	} else {
	    throw "No canvas during buildUsableAreaReply";
	}
	return (
            (n[7] = 2),
            (n[8] = 56),
            (n[9] = (e >> 8) & 255),
            (n[10] = 255 & e),
            (n[11] = 1),
            (n[12] = 62),
            (n[13] = (i >> 8) & 255),
            (n[14] = 255 & i),
            (n[15] = Math.round(u / t)),
            (n[16] = Math.round(s / l)),
            (n[17] = 0),
            (n[18] = 0),
            n
	);
    }

    
    buildUsableAreaReply_new(altWidth:number, altHeight:number):Uint8Array{ // lc.prototype.yh = function (t, l) {
	console.log("JOE usable: altW="+altWidth+" altHeight="+altHeight);
	let reply = new Uint8Array(19);
	let headerSize = 4;
	let writeU16 = function(offset:number,v:number):void {
	    reply[offset-headerSize] = (v>>8)&0xFF;
	    reply[offset-headerSize+1] = v&0xFF;
	};
	// subtracting header size to better correspond to the 3270 
	reply[4-headerSize] = 3;    // flags - means allows 12/14/16 addressing  
	reply[5-headerSize] = 0;    // flags - no variable cells, matrix-characters, values in next two fields, cels, not pels
	// width of usable area in cells or pells;
	writeU16(6,altWidth);
	writeU16(8,altHeight);
	// units
	reply[10-headerSize] = 1;   // 00 means pels per inch, 01 means pels per millimeters
	if (this.canvas == null){
	    throw "No canvas during buildUsableAreaReply";
	}
	// the next 10-15 lines look like the most horrific bullshit in the history of bullshit
	// and why are we using (668 / screenWidth) millimeters
	// why is height numerator 308?  What chicanery is this?
	// so I think that this does not affect GDDM behavior too much
	var i = window.screen.height; 
        var e = window.screen.width;
	// 11 thru 14 are a fraction of (distance between x points in UNITS)
        reply[11-headerSize] = 2;
        reply[12-headerSize] = 56;
	writeU16(13,e);
	// 15 thru 18 are a fraction of (distance between x points in UNITS)
	reply[15-headerSize] = 1;
        reply[16-headerSize] = 62;
	writeU16(17,i);
	let s = this.canvas.height * ((altHeight - 2) / altHeight);  // is this an OIA hack??
        let u = this.canvas.width;
	let horizontalPixelsPerChar = Math.round(u / altWidth); // rough pixels per character as rendered
	let verticalPixelsPerChar = Math.round(s / altHeight); // rough pixels per character as rendered
	reply[19-headerSize] = horizontalPixelsPerChar;
	reply[20-headerSize] = verticalPixelsPerChar;
	// Per Book:  "for LU  Type  1,  the  BUFFSZ parameter is  not applicable  and  should be  set  to  X' 0000'"
        reply[21-headerSize] = 0,
        reply[22-headerSize] = 0;
	// I have some belief that (altWidth * horizontalPixelsPerChar) = width for graphics (GOCA) drawing,
	// and likewise for height
	// more fields needed here if variable size cells are specified in flags
        return reply;
    }
    
    static fh = [142, 0, 16, 13,
		 64, 0, 0, 0,
		 11,
		 0,    0,   0,  0,  0, 0,    0, 4, 150, 3, 68,   // CGCSGID 01174-00836
		 1,    0, 241,  0,  0, 0,    0, 3, 195, 1, 54,   // CGCSGID 00963-00310
		 128, 32, 248, 18, 16, 65, 234, 3, 169, 3, 69];  // CGCSGID 00937-00837

    /*
      0-1  Length
      2    0x81
      3    0x85
      4    Flags  8E Escape, Load PSSF No!!,  2-byte yes CGCSGID
      5    Flags  0  because not aware of this
      6    16 bits char slot width
      7    13 height
      8-11 bits for PS format types
      12   length of each slot

      each char set (1-based)
      1    PS store ID
      2    Flags 32 is DBCS
      3  
      8-11 CGCSGI see notes in CharsetInfo
    */

    /*
      This entire method is craven and misguided.   If the terminal supports
      dynamic changing of charsets, then it should do as such.   But instead
      it tweaks a template of a packet capture of some other program's Charsets
      QReply and slaps (C)GCSGID ID's into two 4-byte zones. 
     */
    
    buildDBCSCharacterSetReply():Uint8Array{ // (lc.prototype.Ch = function () {
	let charsetID1 = this.charsetInfo.CGCSGIDBase;
	let charsetID2 = this.charsetInfo.CGCSGIDExtended;
	if (!charsetID1 || !charsetID2){
	    throw "Illegal State: must have charset ID's for DBCS charset reply";
	}
	var l = VirtualScreen3270.fh.length,
            n = new Uint8Array(l);
	for (let t:number = 0; t < l; t++)
	    n[t] = ((t > 16 && t <= 20) ?
	        charsetID1[t - 16] :
		((t > 38 && t <= 42) ?
		    charsetID2[t - 38] :
		    VirtualScreen3270.fh[t]));
	Utils.protocolLogger.debug("replying to DBCS charsets, reply len=0x" + Utils.hexString(l));
	return n;
    }
    
    buildRPQReply():boolean{ //(lc.prototype.Nh = function () {
	return Utils.protocolLogger.debug("Not implemented: RPQ Reply"), !1;
    }
    
    static buildCodeSummaryReply(isDBCS:boolean):number[]{ // (lc.Ph = function (t) {
	let codes = [0x81, // 129 - usable area
		     0xA6, // 166 - implicit partition
		     0x86, // 134 - color
		     0x87, // 135 - highlighting
		     0x88, // 136 - reply modes
		     0x99, // 153 - auxiliary device
		     0x85, // 133 - character sets
		     0x95, // 149 - Dist Data Management (Why?)
		     0x84, // 132 - Alhpanumeric Partitions
		     0x80, // 128 - Code Summay itself
		     0x96, // 150 - Storage Pools
		     0xA8, // 168 - Transparency
		     0xB0, // 176 - Segment (Graphics)
		     0xB1, // 177 - Procedure (Graphics)
		     0xB2, // 178 - LineTypes (Graphics)
		     0xB3, // 179 - Port      (Graphics IO??)
		     0xB4, // 180 - Graphics Color (Graphics)
		     0x8A]; // 138 - Field Validation (Really??, if so what and how)
	// var l = [129, 166, 134, 135, 136, 153, 133, 149, 132, 128, 150, 168, 176, 177, 178, 179, 180, 138];
	if (isDBCS){
	    codes.push(0x91); // 145 DBCS_ASIA
	}
	return codes;
    }

    /*
      These Query Reply's are described in chapter 6 of

      http://www.bitsavers.org/pdf/ibm/3174/GA23-0059-07_3270_Data_Stream_Programmers_Reference_199206.pdf
      
    */  
    
    doQueryReply(specificCodes:number[]|null){ // (lc.prototype.Fh = function (t) {
	let logger = Utils.protocolLogger;
	var qReply = new QReply(4096); // was l
	if (!this.parser){
	    throw "No Parser present when doing query reply"; // an illegal state
	}
	if (this.inTN3270EMode) {
	    // These 5 bytes are the TN3270E header (dataType,flags,flags,seqByte1,seqByte2)
            qReply.addByte(0);
	    qReply.addByte(0);
	    qReply.addByte(0);  
            var seqNum = this.parser.sequenceNumber++;
            qReply.addByte((0xFF00 & seqNum) >> 8);
	    qReply.addByte(0xFF & seqNum);
	}
	qReply.addByte(0x88);
	// this use of alternate is probably more bold/arbitrary/expedient/wrong than I originally thought
	var s = this.getAlternateHeight();
	var u = this.getAlternateWidth();
	console.log("JOE doQueryReply with specificCodes="+JSON.stringify(specificCodes));
	var w = 0;
	if (specificCodes == null){
	    var h = this.renderer ? this.renderer.charWidth : 9,
		r = this.renderer ? this.renderer.charHeight : 12,
		usableAreaReply = this.buildUsableAreaReply(u, s);
            this.graphicsWidth = u * h;
	    this.graphicsHeight = s * r;
	    qReply.addU8CodeReply(QReply.CODE_USABLE_AREA, usableAreaReply);
	    logger.debug("Query reply early");
	    Utils.hexDumpU8(qReply.data.slice(0, qReply.fill),logger);
            var implicitPartitionReply = this.buildImplicitPartitionReply(u, s);
	    qReply.addU8CodeReply(QReply.CODE_IMPLICIT_PARTITION, implicitPartitionReply);
	    qReply.addCodeReply(QReply.CODE_COLOR, QReply.standardColorReply);
	    qReply.addCodeReply(QReply.CODE_HIGHLIGHTING, QReply.standardHighlightingReply);
	    qReply.addCodeReply(QReply.CODE_REPLY_MODES, QReply.standardReplyModesReply);
	    qReply.addCodeReply(QReply.CODE_AUXILIARY_DEVICE, QReply.standardAuxDeviceReply);
	    logger.debug("queryReply charset=" + this.charsetInfo.name + " font " + this.charsetInfo.font);
            if (this.charsetInfo.isDBCS) {
		var c = this.buildDBCSCharacterSetReply();
		qReply.addU8CodeReply(QReply.CODE_CHARACTER_SETS, c);
		qReply.addCodeReply(QReply.CODE_DBCS_ASIA, QReply.standardDBCSAsiaReply);
            } else {
		qReply.addCodeReply(QReply.CODE_CHARACTER_SETS, QReply.standardCharsetsReply);
	    }
            qReply.addCodeReply(QReply.CODE_DISTRIBUTED_DATA_MANAGEMENT, QReply.standardDDMReply);
	    qReply.addCodeReply(QReply.CODE_FIELD_VALIDATION, QReply.standardValidationReply);
	    qReply.addCodeReply(QReply.CODE_ALPHANUMERIC_PARTITIONS, QReply.standardAlphanumericPartitionsReply);
            let summaryReply = VirtualScreen3270.buildCodeSummaryReply(this.charsetInfo.isDBCS);
            qReply.addCodeReply(QReply.CODE_SUMMARY, summaryReply);
	    this.buildRPQReply() && w++;
	} else {
	    usableAreaReply = this.buildUsableAreaReply(u, s);
	    implicitPartitionReply = this.buildImplicitPartitionReply(u, s);
            for (var d = 0; d < specificCodes.length; d++) {
		var v = specificCodes[d];
		logger.debug("Handling reply to query code=0x" + Utils.hexString(v));
		switch (v){
		case QReply.CODE_SUMMARY:
                    let codeSummaryReply = VirtualScreen3270.buildCodeSummaryReply(this.charsetInfo.isDBCS);
                    qReply.addCodeReply(128, codeSummaryReply);
		    w++;
                    break;
		case QReply.CODE_USABLE_AREA:
                    qReply.addU8CodeReply(QReply.CODE_USABLE_AREA, usableAreaReply);
		    w++;
                    break;
		case QReply.CODE_IMAGE:
                    logger.warn("implement me TN3270E_REPLY_QCODE_IMAGE " + Utils.hexString(v));
                    break;
		case QReply.CODE_TEXT_PARTITIIONS:
                    logger.warn("implement me TN3270E_REPLY_QCODE_TEXT_PARTITIIONS " + Utils.hexString(v));
                    break;
		case QReply.CODE_ALPHANUMERIC_PARTITIONS:
                    qReply.addCodeReply(QReply.CODE_ALPHANUMERIC_PARTITIONS, QReply.standardAlphanumericPartitionsReply);
		    w++;
                    break;
		case QReply.CODE_CHARACTER_SETS:
                    if (this.charsetInfo.isDBCS){
			c = this.buildDBCSCharacterSetReply();
			qReply.addU8CodeReply(QReply.CODE_CHARACTER_SETS , c);
			w++;
			qReply.addCodeReply(QReply.CODE_DBCS_ASIA, QReply.standardDBCSAsiaReply);
			w++;
		    } else {
			qReply.addCodeReply(QReply.CODE_CHARACTER_SETS, QReply.standardCharsetsReply);
			w++;
		    }
                    break;
		case QReply.CODE_COLOR:
                    qReply.addCodeReply(QReply.CODE_COLOR, QReply.standardColorReply);
		    w++;
                    break;
		case QReply.CODE_HIGHLIGHTING:
                    qReply.addCodeReply(QReply.CODE_HIGHLIGHTING, QReply.standardHighlightingReply); w++;
                    break;
		case QReply.CODE_REPLY_MODES:
                    qReply.addCodeReply(QReply.CODE_REPLY_MODES, QReply.standardReplyModesReply);
		    w++;
                    break;
		case QReply.CODE_FIELD_VALIDATION:
                    qReply.addCodeReply(QReply.CODE_FIELD_VALIDATION, QReply.standardValidationReply);
		    w++;
                    break;
		case QReply.CODE_MSR_CONTROL:
                    logger.warn("implement me TN3270E_REPLY_QCODE_MSR_CONTROL " + Utils.hexString(v));
                    break;
		case QReply.CODE_FIELD_OUTLINING:
                    if (this.charsetInfo.isDBCS){ // *UNKNOWN*: why just do this for DBCS??
			qReply.addCodeReply(QReply.CODE_FIELD_OUTLINING, VirtualScreen3270.bh);
			w++;
		    }
                    break;
		case QReply.CODE_PARTITION_CHARACTERISTICS:
		case QReply.CODE_OEM_AUXILIARY_DEVICE:
		case QReply.CODE_FORMAT_PRESENTATION:
		case QReply.CODE_DBCS_ASIA:
		case QReply.CODE_SAVE_RESTORE_FORMAT:
		case QReply.CODE_FORMAT_STORAGE_AUX_DEVICE:
                    logger.warn("implement me TN3270E_REPLY_QCODE " + Utils.hexString(v));
                    break;
		case QReply.CODE_DISTRIBUTED_DATA_MANAGEMENT:
                    qReply.addCodeReply(QReply.CODE_DISTRIBUTED_DATA_MANAGEMENT, QReply.standardDDMReply);
		    w++;
                    break;
		case QReply.CODE_STORAGE_POOLS: 
                    qReply.addCodeReply(QReply.CODE_STORAGE_POOLS, QReply.standardStoragePoolsReply);
		    w++;
                    break;
		case QReply.CODE_DOC_INTERCHANGE_ARCHITECTURE:
		case QReply.CODE_DATA_CHAINING:
                    logger.warn("implement me TN3270E_REPLY_QCODE " + Utils.hexString(v));
                    break;
		case QReply.CODE_AUXILIARY_DEVICE:
                    qReply.addCodeReply(QReply.CODE_AUXILIARY_DEVICE, QReply.standardAuxDeviceReply);
		    w++;
                    break;
		case QReply.CODE_3270_IPDS:
		case QReply.CODE_PRODUCT_DEFINED_DATA_STREAM:
		case QReply.CODE_ANOMALY_IMPLEMENTATION:
		case QReply.CODE_IBM_AUXILIARY_DEVICE:
		case QReply.CODE_BEGIN_END_OF_FILE:
		case QReply.CODE_DEVICE_CHARACTERISTICS:
                    logger.warn("implement me TN3270E_REPLY_QCODE" + Utils.hexString(v));
                    break;
		case QReply.CODE_RPQ_NAMES:
                    this.buildRPQReply(); // does not yet work
                    break;
		case QReply.CODE_DATA_STREAMS:
                    logger.warn("implement me TN3270E_REPLY_QCODE" + Utils.hexString(v));
                    break;
		case QReply.CODE_IMPLICIT_PARTITION:
                    qReply.addU8CodeReply(QReply.CODE_IMPLICIT_PARTITION, implicitPartitionReply);
		    w++;
                    break;
		case QReply.CODE_PAPER_FEED_TECHNIQUES:
                    logger.warn("implement me TN3270E_REPLY_QCODE" + Utils.hexString(v));
                    break;
		case QReply.CODE_TRANSPARENCY:
                    qReply.addCodeReply(QReply.CODE_TRANSPARENCY, QReply.standardTransparencyReply);
		    w++;
                    break;
		case QReply.CODE_SETTABLE_PRINTER_CHARACTERISTICS:
		case QReply.CODE_IOCA_AUXILIARY_DEVICE:
		case QReply.CODE_COOPERATIVE_PROCESSING_REQUESTOR:
                    logger.warn("implement me TN3270E_REPLY_QCODE" + Utils.hexString(v));
                    break;
		case QReply.CODE_SEGMENT:
                    qReply.addCodeReply(QReply.CODE_SEGMENT, QReply.standardSegmentReply), w++;
                    break;
		case QReply.CODE_PROCEDURE:
                    qReply.addCodeReply(QReply.CODE_PROCEDURE, QReply.standardProcedureReply), w++;
                    break;
		case QReply.CODE_LINE_TYPES:
                    qReply.addCodeReply(QReply.CODE_LINE_TYPES, QReply.standardLineTypesReply), w++;
                    break;
		case QReply.CODE_PORT:
                    qReply.addCodeReply(QReply.CODE_PORT, QReply.standardCodePortReply1);
		    w++;
		    qReply.addCodeReply(QReply.CODE_PORT, QReply.standardCodePortReply2);
		    w++;
                    break;
		case QReply.CODE_GRAPHIC_COLOR:  
                    qReply.addCodeReply(QReply.CODE_GRAPHIC_COLOR, QReply.standardGraphicColorReply), w++;
                    break;
		case QReply.CODE_EXTENDED_DRAWING_ROUTINE: // what does PCOMM say for this??
                    logger.warn("implement me TN3270E_REPLY_QCODE" + Utils.hexString(v));
                    break;
		case QReply.CODE_GRAPHIC_SYMBOL_SETS:
                    QReply.standardGraphicSymbolReply[6] = u;
		    QReply.standardGraphicSymbolReply[7] = s;
		    QReply.standardGraphicSymbolReply[20] = u;
		    QReply.standardGraphicSymbolReply[21] = s;
		    qReply.addCodeReply(QReply.CODE_GRAPHIC_SYMBOL_SETS, QReply.standardGraphicSymbolReply);
		    w++;
                    break;
		case QReply.CODE_NULL:
                    break;
		default:
                    logger.warn("Could not respond to unrecognized query reply code=" + Utils.hexString(v));
		}
            }
            w || qReply.addCodeReply(QReply.CODE_NULL, []); // no bytes for null reply
	}
	if (this.websocket){
	    Utils.messageLogger.debug("Sending message with data:");
	    Utils.hexDumpU8(qReply.data, Utils.messageLogger);
	    // experiment cut these bytes
	    //qReply.addByte(255);
	    //qReply.addByte(239);
	    //this.sendBytesU8(qReply.data.slice(0, qReply.fill));
	    console.log("JOE new send qreply");
	    let replyTelnetBytes = qReply.getTelnetBytes();
	    this.sendBytes(replyTelnetBytes);
	    // end experiment send
	    this.Su(2);
	}
	logger.debug("Query reply generated and sent");
	Utils.hexDumpU8(qReply.data.slice(0, qReply.fill),logger);
    }
    
    handleStructuredField(t:any):void{ //(lc.prototype.Mh = function (t) {
	let logger = Utils.protocolLogger;
	let structuredFields:any[] = t.structuredFields; // was n = t.xe;
	logger.debug("Handling structured field. Fields length=" + structuredFields.length);
	for (let l = 0; l < structuredFields.length; l++) {
            var i = structuredFields[l];
            if ((logger.debug("-- Structured Field="+i), 1 === i.key)) {
		if (TN3270EParser.STRFLD_READ_PARTN_QUERY === i.sub || TN3270EParser.STRFLD_READ_PARTN_QUERY_LIST === i.sub) {
                    var e = i.Uh,
			s = i.Lh;
                    logger.debug("---- Type=READ_PARTITION"), this.doQueryReply("specific" == e ? s : null), (this.Vs.zs = 1);
		} else if (this.Yu(i.Bh)) {
                    let t = 97;
                    switch (((this.currentPartitionID = i.Bh), i.sub)) {
                    case TN3270EParser.COMMAND_READ_BUFFER:
			logger.debug("---- Type=READ_PARTITION; CMD=ReadBuffer"), this._h(t);
			break;
                    case TN3270EParser.COMMAND_READ_MODIFIED:
			logger.debug("---- Type=READ_PARTITION; CMD=Read Modified Fields"), this.doReadModified(t);
			break;
                    case TN3270EParser.COMMAND_READ_MODIFIED_ALL:
			logger.debug("---- Type=READ_PARTITION; CMD=Read Modified Fields All"), this.doReadModifiedAll(t);
                    }
		}
            } else if (TN3270EParser.STRFLD_OUTBOUND_3270_DATA_STREAM === i.key) {
		logger.debug("---- Type=OUTBOUND_DATASTREAM");
		var u = i.Qh;
		this.handleWriteCommand(u);
            } else if (TN3270EParser.STRFLD_SET_REPLY_MODE === i.key){
		if (i.Bh > 0){
		    logger.warn("Partitions above 0 (implicit) not yet implemented");
		} else if (i.mode < 0 || i.mode > 2){
		    logger.warn("Cannot set field mode to type=" + i.mode);
		} else {
		    this.replyMode = i.mode;
		    logger.debug("---- reply mode is " + i.mode);
		}
	    } else if (TN3270EParser.STRFLD_RESET_PARTN === i.key){
		this.Yu(i.Bh) && ((this.replyMode = VirtualScreen3270.REPLY_MODE_FIELD),
				  (this.currentPartitionID = i.Bh),
				  (this.Ls.replyMode = VirtualScreen3270.REPLY_MODE_FIELD),
				  (this.Ls.Ws = 0),
				  (this.Ls.Qs = 0),
				  logger.debug("---- reply mode is 0"));
	    } else if ((TN3270EParser.STRFLD_OBJECT_DATA  === i.key) ||
		(TN3270EParser.STRFLD_OBJECT_PICTURE === i.key) ||
		(TN3270EParser.STRFLD_OBJECT_CONTROL === i.key)){
		i.flags;
		logger.debug("---- Type=FIELD_OBJECT");
	    } else if (TN3270EParser.STRFLD_CREATE_PARTN  === i.key){
		(0 == this.partitionState ? (this.partitionInfoMap[0] && delete this.partitionInfoMap[0],
					     (this.partitionState = 1),
					     (this.currentPartitionID = i.Bh)) :
		    this.partitionInfoMap[i.Bh] && delete this.partitionInfoMap[i.Bh]);
		logger.debug("---- Type=CREATE_PARTITION");
                logger.debug("---- ID=" + i.Bh);
                logger.debug("New partition count=" + Object.keys(this.partitionInfoMap).length);
                (this.partitionInfoMap[i.Bh] = i);
	    } else {
		// JOE doesn't really like this next line, but hey, whatever;
		1 & t.key && (this.Me = true);
		logger.warn("Unimplemented Structured field type t=" + i.t + ", key=" + i.key);
	    }
	}
    }
    
    handleEraseAllUnprotected(){ // (lc.prototype.jh = function () {
	let t;
	this.cacheFieldDataMap();
	(this.Ls.aid = TN3270EParser.AID_NO_AID), (this.Me = true), (this.Ls._s = 32);
	let l,
            n = 0,
            i = 0,
            e = 0,
            s = this.partitionInfoMap[this.currentPartitionID];
	if ((VirtualScreen3270.encodePosition(s, this.cursorPos), this.isFormatted)) {
            var u = Object.keys(this.fieldDataMap);
            for (let l = 0; l < u.length; l++)
		if (((t = this.fieldDataMap[u[l]]), t && !t.attributes.isProtected())) {
                (n = t.position), e++, 1 === e && (i = n + 1);
                    let l = n + t.length;
                    this.zh(n, l, 0, !0, !0), t && t.ms();
		}
	} else (l = this.size - 1), this.zh(n, l, 0, !0, !0);
	this.setCursorPos(i);
	if (this.renderer){
	    this.renderer.fullPaint();
	}
    }


}

/* the Q(uery)Reply is the TN3270E way of negotiating for advanced features,
   like fancy graphics, colors, OEM-specific features, printing features,
   alternate display sizes (132 col vs 80 col), etc.
*/
class QReply { // was nc
    capacity:number;
    fill:number;
    data:Uint8Array;
    
    constructor(size:number){
	this.capacity = size;
	this.fill = 0;
	this.data = new Uint8Array(size);
    }

    addByte(b:number):void{ // (nc.prototype.kh = function (t) {
	if (this.fill >= this.capacity){
	    Utils.coreLogger.severe("qreply buffer at capacity = " + this.capacity);
	} else {
	    this.data[this.fill++] = b;
	}
    }

    addCodeReply(qCode:number,dataBytes:number[]):void{ // (nc.prototype.Sh = function (t, l) {
	var len = 4 + dataBytes.length;
	this.addByte((len >> 8) & 0xFF);
	this.addByte(len & 0xFF);
	this.addByte(TN3270EParser.STRFLD_QUERY_REPLY);
	this.addByte(qCode);
	for (var n = 0; n < dataBytes.length; n++) this.addByte(dataBytes[n]);
    }

    addU8CodeReply(qCode:number,dataBytes:Uint8Array):void{ // (nc.prototype.Sh = function (t, l) {
	var len = 4 + dataBytes.length;
	this.addByte((len >> 8) & 0xFF);
	this.addByte(len & 0xFF);
	this.addByte(TN3270EParser.STRFLD_QUERY_REPLY);
	this.addByte(qCode);
	for (var n = 0; n < dataBytes.length; n++) this.addByte(dataBytes[n]);
    }

    getTelnetBytes():number[]{ // (nc.prototype.Th = function () {
	Utils.coreLogger.debug("binaryBuffer fill was " + this.fill);
	var t:number[] = new Array();
	for (var n = 0; n < this.data.length && n !== this.fill; n++){
	    let b = this.data[n];
	    Utils.pushTelnetByte(t,b);
	    // t.push(this.data[n]);
	}
	// add standard trailer
	t.push(0xFF);
	t.push(0xEF);
	return t;
    }

    toB64():string{ // (nc.prototype.Th = function () {
	Utils.coreLogger.debug("binaryBuffer fill was " + this.fill);
	var t:number[] = new Array();
	for (var n = 0; n < this.data.length && n !== this.fill; n++){
	    let b = this.data[n];
	    Utils.pushTelnetByte(t,b);
	    // t.push(this.data[n]);
	}
	return window.btoa(String.fromCharCode.apply(null, t));
    }

    /*
      See http://www.bitsavers.org/pdf/ibm/3174/GA23-0059-07_3270_Data_Stream_Programmers_Reference_199206.pdf 
      
      for this lovely list.
     */
    static CODE_SUMMARY                    = 0x80;
    static CODE_USABLE_AREA                = 0x81;
    static CODE_IMAGE                      = 0x82;
    static CODE_TEXT_PARTITIIONS           = 0x83;
    static CODE_ALPHANUMERIC_PARTITIONS    = 0x84;
    static CODE_CHARACTER_SETS             = 0x85;
    static CODE_COLOR                      = 0x86;
    static CODE_HIGHLIGHTING               = 0x87;
    static CODE_REPLY_MODES                = 0x88;
    static CODE_FIELD_VALIDATION           = 0x8A;
    static CODE_MSR_CONTROL                = 0x8B;
    static CODE_FIELD_OUTLINING            = 0x8C;
    static CODE_PARTITION_CHARACTERISTICS  = 0x8E;
    static CODE_OEM_AUXILIARY_DEVICE       = 0x8F;
      /*
	Good example in https://www.ibm.com/docs/en/personal-communications/5.9?topic=programming-query-reply-data-structures-supported-by-ehllapi

	Length 0-1
        0x81
	0x8F
        <flag1>
        <flag2>
        <deviceType> - 8 bytes
        <userAssignedName> - 8 bytes
        SDP for DOID follows usually
	
       */
    static CODE_FORMAT_PRESENTATION        = 0x90;
    static CODE_DBCS_ASIA                  = 0x91;
    static CODE_SAVE_RESTORE_FORMAT        = 0x92;
    static CODE_FORMAT_STORAGE_AUX_DEVICE  = 0x94;
    static CODE_DISTRIBUTED_DATA_MANAGEMENT= 0x95;
    static CODE_STORAGE_POOLS              = 0x96;
    static CODE_DOC_INTERCHANGE_ARCHITECTURE = 0x97; 
    static CODE_DATA_CHAINING              = 0x98;
    static CODE_AUXILIARY_DEVICE           = 0x99;
    static CODE_3270_IPDS                  = 0x9A;
    static CODE_PRODUCT_DEFINED_DATA_STREAM= 0x9C;
    /* see PCOMM
        5080 is mentioned
	5080 Graphics System:

	This reference ID indicates the 5080 Graphics System data
	stream is supported by the auxiliary device. Descriptions of
	the 5080 Graphics Architecture, structured field, subset ID,
	DOID, and associated function sets are defined in IBM 5080
	Graphics System Principles of Operation 

	http://bitsavers.org/pdf/ibm/5080/GA23-0134-0_IBM_5080_Graphics_Systems_Principles_of_Operation_Mar1984.pdf

	https://www.ibm.com/docs/en/personal-communications/5.9?topic=programming-query-reply-data-structures-supported-by-ehllapi

	FLAGS
	REFID  0x01 is a 5080 0x02 is a WHIP API (IBM RT PC Workstation Host Interface Program Version 1.1 User's Guide and Reference Manual)
	SSID  subset

	Destination Origin SDPID

        The variant Graphic orders are in Chapter 5 above
    */
    static CODE_ANOMALY_IMPLEMENTATION     = 0x9D; // (what does this mean, what anomaly)
    static CODE_IBM_AUXILIARY_DEVICE       = 0x9E;
    static CODE_BEGIN_END_OF_FILE          = 0x9F;
    static CODE_DEVICE_CHARACTERISTICS     = 0xA0;
    static CODE_RPQ_NAMES                  = 0xA1;
    static CODE_DATA_STREAMS               = 0xA2;
    static CODE_IMPLICIT_PARTITION         = 0xA6;
    static CODE_PAPER_FEED_TECHNIQUES      = 0xA7;
    static CODE_TRANSPARENCY               = 0xA8;
    static CODE_SETTABLE_PRINTER_CHARACTERISTICS  = 0xA9;
    static CODE_IOCA_AUXILIARY_DEVICE             = 0xAA;
    static CODE_COOPERATIVE_PROCESSING_REQUESTOR  = 0xAB; /* This was a crazy feature for APL to work between
							     Host and Workstation in some way
							     https://www.semanticscholar.org/paper/An-experimental-facility-for-cooperative-processing-Kaneko/b68ec5b9941e4ab4e472e119837312ddbdc6c70a/figure/2
							     */
    /*
      See PCOMM doc ref'ed above
     */
    static CODE_SEGMENT                    = 0xB0;
    static CODE_PROCEDURE                  = 0xB1;
    static CODE_LINE_TYPES                 = 0xB2;
    static CODE_PORT                       = 0xB3;
    static CODE_GRAPHIC_COLOR              = 0xB4;
    static CODE_EXTENDED_DRAWING_ROUTINE   = 0xB5;
    static CODE_GRAPHIC_SYMBOL_SETS        = 0xB6;
    static CODE_NULL                       = 0xFF;

    static standardProcedureReply = [0, 1, 0, 0, 0, 252, 0, 6, 64, 6, 64, 6, 1, 255, 255, 255, 255]; // was yh
    /*	
	The procedure QReply is not documented in the 3270 data stream guide
 
     */

    static standardSegmentReply = [0, 4, 0, 252, 0, 252, 0, 5, 2, 0, 128, 0, 5, 2, 4, 128, 0, 5, 2, 11, 128, 0]; // was Sh
    /*	
	The segment QReply is not documented in the 3270 data stream guide
	The second byte 0x04, is probably the graphics capability level

	Interesting stuf at IBM PCOMM doc:
	https://www.ibm.com/docs/en/personal-communications/5.9?topic=programming-query-reply-data-structures-supported-by-ehllapi
     */

    static standardStoragePoolsReply = [19, 1, 1, 0, 0, 80, 0, 0, 0, 80, 0, 0, 1, 0, 5, 0, 6, 0, 7]; // was mh
    /* 
       Storage pools 
       This reply seems to be a single SDPID length = 19
       0x1 - means storage pool
       0x1 - id
       0x00008000  - size empty     - JOE we could say infinity nowadays, or maybe 0x7FFFFFFF
       0x00008000  - size available 
       oblist (0001 segment) (0005 Temp) (0006 line type) (0007 symbol set) - why does this not say procedure or extended drawing routine?
     */
    
    static standardLineTypesReply = [0, 9, 0, 7, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 3, 1, 64, 3, 2, 255]; // was Ph


    static standardTransparencyReply = [2, 0, 240, 255, 255]; // ws Eh  
    static standardColorReply = [0, 8, 0, 244, 241, 241, 242, 242, 243, 243, 244, 244, 245, 245, 246, 246, 247, 247]; // was uh
    static standardHighlightingReply = [4, 0, 240, 241, 241, 242, 242, 244, 244]; // was hh
    static standardReplyModesReply = [0, 1, 2]; // was rh (field,extended,character)
    static standardAuxDeviceReply = [0, 0]; // was ah
    static standardCharsetsReply = [130, 0, 7, 9, 64, 0, 0, 0, 7, 0, 0, 0, 2, 185, 0, 37, 1, 0, 241, 3, 195, 1, 54]; // was oh
    static standardGraphicSymbolReply = [0, 0, 9, 12, 0, 0, 0, 16, 1, 0, 0, 240, 2, 2, 0, 0, 0, 0, 0, 2, 185, 0, 37]; // was ch
    static standardDBCSAsiaReply = [0, 3, 1, 128, 3, 2, 1]; // was dh
    static standardDDMReply = [0, 0, 8, 0, 8, 0, 1, 1]; // was wh
                              // DDM: FLAGS 0000 LIMIN 0800 LIMOUT 0800 NSS 1 DDMSS 1
    static standardValidationReply = [7]; // was vh
    static standardAlphanumericPartitionsReply = [0, 30, 240, 0]; // was ph
    static standardCodePortReply1 = [0, 3, 2, 144, 9, 1, 0, 3, 2, 128, 0, 127, 255]; // was Ih
    static standardCodePortReply2 = [0, 7, 8, 64, 7, 3, 0, 1, 0, 0, 28]; //was Dh
    static standardGraphicColorReply = [0, 4, 0, 1, 255, 0, 8, 0, 8, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 2, 1, 0, 0, 0, 0, 3, 1, 1, 0, 0, 0, 4, 0, 0, 1, 0, 0, 5, 0, 1, 1, 0, 0, 6, 1, 0, 1, 0, 0, 7, 1, 1, 1, 0]; // was xh
}

interface EbcdicUnicodePair {
    ebcdicChar:number;
    unicodeChar:number;
}

class Renderer3270 extends PagedRenderer {  // Minified as Ya
    Jl:number; // a fallback color

    // the following is probably a list of 3270 extended colors (pink, turquoise and friends)
    colorPalette:number[] = [this.background, 7257087, 16711680, 16752800, 65280, 65535, 16776960, 16777215, 0, 128, 16750080, 8388736, 32768, 32896, 13816530, 16777215]; // this.Zl
    
    Xl:number = 65280; // low unproteced color - green
    $l:number = 16711680; // unprotected intensified color - red
    tn:number = 65535;    // protected low color = cyan
    ln:number = 16777215; // high protected - white

    // poorly understood fields
    nn:boolean;
    in:boolean;
    
    constructor(virtualScreen:VirtualScreen3270, unicodeTable:any){
	super(null, virtualScreen, unicodeTable);
	this.screen = virtualScreen;
	this.yt = -1;  // canvasWidth
	this.Ct = -1;  // canvasHeight
	this.Nt = -1;
	this.Pt = -1;
	this.font = null;
	this.fontFamily = ((virtualScreen.Ft && virtualScreen.Ft.pt) ?
			   virtualScreen.Ft.pt :
			   CharsetInfo.DEFAULT_FONT_FAMILY);
	Utils.coreLogger.debug("virtualScreen = " + virtualScreen);
	Utils.coreLogger.debug("charsetInfo=" + virtualScreen.charsetInfo);
	// this.Dt = !0; // fonts not ready
	// this.scaleH = 1;  // this.xt
	// this.scaleV = 1;  // this.Ot
	//this.activeWidth = -1; // this.Ut = -1;
	// this.activeHeight = -1; // this.Mt = -1;
	// this.charWidth = 1; // this.Lt = 1;
	// this.charHeight = 1; // this.Bt = 1;
	// this.ascent = 1; // this._t = 1;  // charAscent   from debug string
	// this.descent = 0; // was this.rl
	// this.leading = 0; // this.Wt = 0;  // charLeading, from debug string  // see "rl" too but not in Ea, hmmm
	this.Qt = 0;
	this.unicodeTable = unicodeTable; // this.Gt = n;
	this.jt = 0;
	this.Vt = 3;
	this.timerDelay = 500;
	this.Kt = true;
	this.hasFocus = virtualScreen.hasFocus();
	this.background = 0;
	this.Jl = 16050242; // a color, fallback foreground?
	//this.Xl = 65280; // low unproteced color - green
	//this.$l = 16711680; // unprotected intensified color - red
	//this.tn = 65535;    // protected low color = cyan
	//this.ln = 16777215; // high protected - white
	this.Xt = 16777215;
	this.qt = 16777215;
	this.Jt = 16711680;
	this.Zt = 65280;
	// more duplicate initializations of superClasses's members
	//this.scaleMethod = 1;
	//this.timerIntervalID = null; // this.$t = null;
	//this.tl = null; - other timeIntervalID
	if (3 == this.Vt && this.timerDelay >= 100){
	    this.ll();
	}
	this.Ul = 500;
	this.Bl = !1;
	this.Ul >= 100 && this.Ll();
	this.nn = false;
	this.in = true;
	// this.canvas is this.Rt
	// this.selectionCanvas = this.Il = null;
	// undelared:
	// this.St;  // set from charsetInfo.st (screen.It.St) during setCharsetInfo
    }

    static makeRGBColor(r:number,g:number,b:number):number{
	return (r<<16)|(g<<8)|b;
    }

    colorFromAttributes(charAttrs:CharacterAttributes3270):number{ // (Ya.prototype.en = function (t) {
	let logger = Utils.colorLogger;
        if ((0x0C & charAttrs.classicBits) == 0x0C){
	    return Renderer3270.nullColor;
	}
        if (charAttrs.un()) {
	    return Renderer3270.makeRGBColor(charAttrs.hn, charAttrs.rn, charAttrs.an);
	}
        var bits = charAttrs.classicBits;
        if (0 != charAttrs.color) {
	    return (240 == charAttrs.color ?
		    (8 == (12 & bits) ? this.ln : this.Xl) :
		    this.colorPalette[charAttrs.color - 240]);
	}
        if (0 != (bits & FieldConstants.FIELD_ATTRIBUTE_PROTECTED)){
            switch (12 & bits) {
            case FieldConstants.FIELD_ATTRIBUTE_DISPLAY_NOT_DETECTABLE:
            case FieldConstants.FIELD_ATTRIBUTE_DISPLAY_DETECTABLE:
                return this.tn;
            case FieldConstants.FIELD_ATTRIBUTE_INTENSIFIED_DETECTABLE:
                return this.ln;
            default:
                    throw "Reached default case for standard color attribute. Attribute=0x" + Utils.hexString(bits);
            }
        } else {
            switch (12 & bits) {
            case FieldConstants.FIELD_ATTRIBUTE_DISPLAY_NOT_DETECTABLE:
            case FieldConstants.FIELD_ATTRIBUTE_DISPLAY_DETECTABLE:
                return this.Xl;
            case FieldConstants.FIELD_ATTRIBUTE_INTENSIFIED_DETECTABLE:
                return this.$l;
            default:
                throw "Reached default case for standard color attribute. Attribute=0x" + Utils.hexString(bits);
            }
	}
    }

    static defaultScreenElement = new ScreenElement(0, 0x40, null);
    static ebcdic1047ToUnicode
	= [
	    0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 
	    0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
	    0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 
	    0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
	    // 0x20
	    0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 
	    0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
	    0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 
	    0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
	    // 0x40
	    0x0020, 0x00a0, 0x00e2, 0x00e4, 0x00e0, 0x00e1, 0x00e3, 0x00e5, 
	    0x00e7, 0x00f1, 0x00a2, 0x002e, 0x003c, 0x0028, 0x002b, 0x007c,
	    0x0026, 0x00e9, 0x00ea, 0x00eb, 0x00e8, 0x00ed, 0x00ee, 0x00ef, 
	    0x00ec, 0x00df, 0x0021, 0x0024, 0x002a, 0x0029, 0x003b, 0x005e,
	    // 0x60
	    0x002d, 0x002f, 0x00c2, 0x00c4, 0x00c0, 0x00c1, 0x00c3, 0x00c5, 
	    0x00c7, 0x00d1, 0x00a6, 0x002c, 0x0025, 0x005f, 0x003e, 0x003f,
	    0x00f8, 0x00c9, 0x00ca, 0x00cb, 0x00c8, 0x00cd, 0x00ce, 0x00cf, 
	    0x00cc, 0x0060, 0x003a, 0x0023, 0x0040, 0x0027, 0x003d, 0x0022,
	    // 0x80
	    0x00d8, 0x0061, 0x0062, 0x0063, 0x0064, 0x0065, 0x0066, 0x0067,     
	    0x0068, 0x0069, 0x00ab, 0x00bb, 0x00f0, 0x00fd, 0x00fe, 0x00b1, 
	    0x00b0, 0x006a, 0x006b, 0x006c, 0x006d, 0x006e, 0x006f, 0x0070, 
	    0x0071, 0x0072, 0x00aa, 0x00ba, 0x00e6, 0x00b8, 0x00c6, 0x00a4,
	    // 0xA0
	    0x00b5, 0x007e, 0x0073, 0x0074, 0x0075, 0x0076, 0x0077, 0x0078, 
	    0x0079, 0x007a, 0x00a1, 0x00bf, 0x00d0, 0x005b, 0x00de, 0x00ae, 
	    0x00ac, 0x00a3, 0x00a5, 0x00b7, 0x00a9, 0x00a7, 0x00b6, 0x00bc, 
	    0x00bd, 0x00be, 0x00dd, 0x00a8, 0x00af, 0x005d, 0x00b4, 0x00d7,
	    // 0xC0
	    0x007b, 0x0041, 0x0042, 0x0043, 0x0044, 0x0045, 0x0046, 0x0047, 
	    0x0048, 0x0049, 0x00ad, 0x00f4, 0x00f6, 0x00f2, 0x00f3, 0x00f5, 
	    0x007d, 0x004a, 0x004b, 0x004c, 0x004d, 0x004e, 0x004f, 0x0050, 
	    0x0051, 0x0052, 0x00b9, 0x00fb, 0x00fc, 0x00f9, 0x00fa, 0x00ff,
	    // 0xE0
	    0x005c, 0x00f7, 0x0053, 0x0054, 0x0055, 0x0056, 0x0057, 0x0058, 
	    0x0059, 0x005a, 0x00b2, 0x00d4, 0x00d6, 0x00d2, 0x00d3, 0x00d5, 
	    0x0030, 0x0031, 0x0032, 0x0033, 0x0034, 0x0035, 0x0036, 0x0037, 
	    0x0038, 0x0039, 0x00b3, 0x00db, 0x00dc, 0x00d9, 0x00da, 0x0000
	];
    static graphicEbcdicToUnicode  // was Qn global
	= [
	    0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 
	    0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,    
	    0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 
	    0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,
	    
	    0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 
	    0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,    
	    0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 
	    0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,    
	    // 0x40
	    0x0020, 0x0041, 0x0042, 0x0043, 0x0044, 0x0045, 0x0046, 0x0047, 
	    0x0048, 0x0049, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,    
	    0x0000, 0x004A, 0x004B, 0x004C, 0x004D, 0x004E, 0x004F, 0x0050, 
	    0x0051, 0x0052, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,    
	    // 0x60
	    0x0000, 0x0000, 0x0053, 0x0054, 0x0055, 0x0056, 0x0057, 0x0058, 
	    0x0059, 0x005A, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000,    
	    0x25CA, 0x005E, 0x00a8, 0x233B, 0x2378, 0x2377, 0x22A2, 0x22A3, 
	    0x1D5B, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 
	    // 0x80
	    0x007E, 0xF081, 0xF082, 0xF083, 0xF084, 0xF085, 0x0000, 0x0000, 
	    0x0000, 0x0000, 0x2191, 0x2193, 0x2264, 0x2308, 0x230A, 0x2192,
	    // 0x90
	    0x2395, 0x258C, 0x2590, 0x2580, 0x2584, 0x2588, 0x0000, 0x0000, 
	    0x0000, 0x0000, 0x2184, 0x2282, 0x00a4, 0x25CB, 0x00B1, 0x2190,
	    // 0xA0
	    0x203E, 0x00B0, 0x2500, 0x2022, 0x0000, 0x0000, 0x0000, 0x0000, 
	    0x0000, 0x0000, 0x2229, 0x22C3, 0x0000, 0x005B, 0x2265, 0x25E6,
	    // 0xB0
	    0x03B1, 0x03B5, 0x03B9, 0x03C1, 0x03C9, 0x0000, 0x00D7, 0x005C, 
	    0x00F7, 0x0000, 0x2207, 0x2206, 0x22A4, 0x005D, 0x2260, 0x2502,  
	    // 0xC0
	    0x007B, 0x207D, 0x002E, 0x220E, 0x2514, 0x250C, 0x251C, 0x2534, 
	    0x00a7, 0x0000, 0x2372, 0x2371, 0x2337, 0x233D, 0x2342, 0x2359,
	    // 0xD0
	    0x007D, 0x207E, 0x002D, 0x253C, 0x2518, 0x2510, 0x2524, 0x252C, 
	    0x00B6, 0x0000, 0x2336, 0x0021, 0x2352, 0x234B, 0x235E, 0x235D,   
	    // 0xE0
	    0x2261, 0x2081, 0x2082, 0x2083, 0x2364, 0x2365, 0x236A, 0x20AC, 
	    0x0000, 0x0000, 0x233F, 0x2340, 0x2235, 0x2296, 0x2339, 0x2355,
	    // 0xF0
	    0x2070, 0x00B9, 0x00B2, 0x00B3, 0x2074, 0x2075, 0x2076, 0x2077, 
	    0x2078, 0x2079, 0x0000, 0x236B, 0x2359, 0x235F, 0x234E, 0x0000];

    
    static specialSubstitutionTable:EbcdicUnicodePair[] =   [  { ebcdicChar: 28, unicodeChar: 42 },
							       { ebcdicChar: 30, unicodeChar: 59 },
							       { ebcdicChar: 64, unicodeChar: 46 },
							       { ebcdicChar: 0, unicodeChar: 176 }
							    ];

    static getSpecialSubstitute(c:number):number{
	let match = Renderer3270.specialSubstitutionTable.find((x) => x.ebcdicChar === c);
	if (match){
	    return match.unicodeChar;
	} else {
	    throw "Illegal State: no special substitute for "+c;
	}
    }
    
    static isSpecialMark(c:number):boolean{
	return (c == Ebcdic.fieldMark || c == Ebcdic.recordMark);
    }

    // min'ed as (Ya.prototype.on = function (t, l, n, i, e, s, u) {
    setRenderingData(lineIndex:number, // was t
		     unicodeArray:number[], // was l 
		     renderingFlagsArray:number[], // was n
		     charIndex:number, // was i
		     elementArg:ScreenElement|null, // was e
		     field:Field, // was s
		     u:number) {   // some sort of overriding char
	let element:ScreenElement = (elementArg != null ? elementArg : Renderer3270.defaultScreenElement);
	if (!u) {
	    u = element.charToDisplay();
	}
	if (u < 64 &&
	    (!this.nn || (this.nn && 0 != u)) && // INTERIM .nn - implemented, but I don't know what it means
	    !Renderer3270.isSpecialMark(u)){
	    u = 64;
	}
        let fieldData = null != field ? field.fieldData : null; // was h
        let specificCharAttrs:CharacterAttributes3270|null
	    = element.charAttrs as CharacterAttributes3270;  // was r  - for just this character, not field
        let fieldCharAttrs:CharacterAttributes3270|null
	    = null != fieldData ? (fieldData.attributes as CharacterAttributes3270): null;  // was a
        let renderingFlags = 0; // was o
	if (element.isGraphic){
            renderingFlags |= 1;
	    unicodeArray[charIndex] = Renderer3270.graphicEbcdicToUnicode[u];
	} else if (u === this.St){
            unicodeArray[charIndex] = Unicode.euro; // *UNKNOWN* Euro, what is this for?
	} else if (u === Ebcdic.fieldMark || u === Ebcdic.recordMark){
            unicodeArray[charIndex] = Renderer3270.getSpecialSubstitute(u);
	    if (this.in) {
		renderingFlags |= 8192;
	    }
	} else if (!this.nn || (0 !== u && 0x40 !== u)){
	    unicodeArray[charIndex] = this.unicodeTable[u]; // I hope almost everything falls in here
        } else {
	    unicodeArray[charIndex] = Renderer3270.getSpecialSubstitute(u);
	}
        // *UNKNOWN* does this test mean exact editable field marks have no rendering atributes??
        if (fieldData && fieldData.isEditable() &&
	    lineIndex * this.screen.width + charIndex == fieldData.position){
            renderingFlagsArray[charIndex] = 0;
        } else {
            var c = 0xF0; // 240 means no highlighting see references
	    if (null != specificCharAttrs){
		240 == specificCharAttrs.highlighting || (c = 0 == specificCharAttrs.highlighting ?
							  (null != fieldCharAttrs ? fieldCharAttrs.highlighting : 240) :
							  specificCharAttrs.highlighting);
	    } else if (null != fieldCharAttrs){
		c = fieldCharAttrs.highlighting;
	    }
	    // are these rendering attributes cumulative or exclusive?
	    // this is written exclusively but bits 1,2, and 4 bits are orthogonal
            switch (c){
            case 241: // Blinking, god save us!
                renderingFlags |= 8;
                break;
            case 242: // Reverse, 
                renderingFlags |= 2;
                break;
            case 244: // Underscore
                renderingFlags |= 4;
            }
            renderingFlagsArray[charIndex] = renderingFlags;
        }
    }
    
    getElementColor(element:ScreenElement,field:Field):number{ // (Ya.prototype.vn = function (t, l) {
	let logger = Utils.colorLogger;
	let nullColor = Renderer3270.nullColor;
        if (element == null) {
	    return this.Jl;
	}
        let fieldData:FieldData3270|null = (null!= field) ? field.fieldData : null; // was n
        let specificCharAttrs:CharacterAttributes3270 = (element.charAttrs as CharacterAttributes3270); // was i 
        let fieldCharAttrs:CharacterAttributes3270|null = null;
	if (null != fieldData){
	    fieldCharAttrs = fieldData.attributes as CharacterAttributes3270;
	}
	logger.debug("Getting color on element " + element + " perCharAttrs=" + specificCharAttrs +
		     " fieldAttrs=" + fieldCharAttrs + " field=" + field);
	if (element && element.fieldData && (field == null)){
	    logger.debug("Element has field vs fieldData inconsistency");
	}
        if (fieldCharAttrs != null && specificCharAttrs != null){
            var fieldColor = this.colorFromAttributes(fieldCharAttrs), // was s
                specificColor = this.colorFromAttributes(specificCharAttrs); // was u
            if (0 == specificCharAttrs.color || (0 == specificCharAttrs.classicBits && fieldColor == nullColor)) {
		logger.debug("Color: both field & element attr exist, but defaulting to field color");
		return fieldColor;
	    } else {
		logger.debug("Color: both field & element attr exist, but returning element color");
		return specificColor;
	    }
        } else if (null != fieldCharAttrs){
	    return this.colorFromAttributes(fieldCharAttrs);
	} else if ( null != specificCharAttrs){
	    return this.colorFromAttributes(specificCharAttrs);
	} else if (element.pn) {
	    return nullColor;
	} else {
	    logger.debug("No field or element attributes, setting color to low unprotected");
	    return this.Xl;
	}
    }

    /* isReverse not used,
       is it being handled by color manipulation to canvas.2dctx
       outside of this method??
       
       // and then the next function
       // flow recursively from full paint
    */
    renderCharactersSpecialCases(ctx:CanvasRenderingContext2D,
				 unicodeLine:number[],
				 lineOffset:number,
				 len:number,
				 x:number,
				 baseY:number,
				 isReverse:boolean):void { // (Ya.prototype.An = function (t,l,n,i,e,s, u) {
        var cWidth = this.charWidth,
            bottom = baseY + this.charHeight; // was o
        for (var h = 0; h < len; h++) {
            var c = unicodeLine[lineOffset + h];
	    Utils.renderLogger.debug("Draw graphics c=" + c + ", textX=" + x + ", baselineY=" + baseY +
				     ", reverse=" + isReverse);
            switch (c) {
            case 0xF081:
                BaseRenderer.drawLine(ctx, x, baseY, x, bottom);
		BaseRenderer.drawLine(ctx, x + cWidth - 1, baseY, x + cWidth - 1, bottom);
                break;
            case 0xF082: // 61570
                BaseRenderer.drawLine(ctx, x, baseY, x + cWidth - 1, baseY);
		BaseRenderer.drawLine(ctx, x, bottom, x + cWidth - 1, bottom);
                break;
            case 0xF083:
                BaseRenderer.drawLine(ctx, x, baseY, x, baseY + this.ascent);
                break;
            case 0xF084:
                BaseRenderer.drawLine(ctx, x + cWidth / 2, baseY, x + cWidth / 2, baseY + this.ascent);
                break;
            default:
                BaseRenderer.drawCharArraySlice(ctx, unicodeLine, lineOffset + h, 1, x, baseY);
            }
	    // *UNKNOWN*, why is unicode A-Z so special here??
	    // there is an underline being drawn!
            if (c >= 65 && c <= 90) {
		BaseRenderer.drawLine(ctx, x, bottom, x + cWidth, bottom);
	    }
	    x += cWidth;
        }
    }

    static get2DContextOrFail(canvas:HTMLCanvasElement):CanvasRenderingContext2D{
	let ctx = canvas.getContext("2d");
	if (ctx){
	    return ctx;
	} else {
	    throw "No 2d context or canvas = "+canvas;
	}
    }

    static nullColor = 0x8800FF00; // was ea

    // fullPaint override
    fullPaint():void{ // (Ya.prototype.ul = function () {
	let logger = Utils.renderLogger;
	let colorLogger = Utils.colorLogger;
	let nullColor = Renderer3270.nullColor;
        this.Bl = !1; // NEEDSWORK .Bl
	let screen:VirtualScreen3270 = this.screen as VirtualScreen3270;
        let canvas = screen.canvas; // was t
	if (!canvas){
	    Utils.coreLogger.warn("fullPaint w/o canvas");
	    return;
	}
        let canvasWidth = canvas.width; // was l - in pixels
        let canvasHeight = canvas.height // was n - in pixels
        let ctx:CanvasRenderingContext2D = Renderer3270.get2DContextOrFail(canvas); // was i
	if (screen.selectionCanvas){
	    this.selectionCTX = Renderer3270.get2DContextOrFail(screen.selectionCanvas); // as this.dl
	}
	// update font metrics if canvas has changed since last render
	if (!(-1 != this.yt && this.yt == canvasWidth && this.Ct == canvasHeight)){ // NEEDSWORK on all .yt and .Ct
	    this.setFontInformation(canvas, ctx);
	    if (screen.selectionCanvas){
		this.setFontInformation(screen.selectionCanvas, this.getSelectionCTXOrFail());
	    }
	    this.yt = canvasWidth,
	    this.Ct = canvasHeight;
	}
        BaseRenderer.setFillColor(ctx, this.background);
        ctx.fillRect(0, 0, this.activeWidth, this.activeHeight);
        if (this.fontsNOTReady){  // we couldn't get a reasonable font metrics for current font to fit on screen
            return;
	}
        ctx.font = this.font;
	ctx.textBaseline = "top";
	BaseRenderer.setFillColor(ctx, this.Jl);
	screen.cacheFieldDataMap();
        let logicalWidth = screen.width; // was s
	console.log("JOEPainting for screen size=" + screen.size+" logWidth="+logicalWidth);
        let unicodeArray:number[] = new Array(logicalWidth) // was u
        let colorArray:number[] = new Array(logicalWidth); // was h
        let renderingFlagsArray:number[] = new Array(logicalWidth); // was r
        let dbcsArray:Uint8Array = Renderer3270.buildDBCSArray(screen);  // was a
        let o = screen.charsetInfo.isDBCS ? screen.charsetInfo.extendedTable : screen.charsetInfo.baseTable;
        let charsetFont = screen.charsetInfo.font; // was c
        let f = screen.charsetInfo.unicodeEuroDBCS;
        f || (f = null); // make falsish null;
        var v = 0,               // no great name yet
            bufferPosOfLine = 0; // screenElement array offset, was p
        let outliningArray = new Array(logicalWidth); // was A
	logger.debug("Painting for screen size=" + screen.size);
        for (var lineIndex = 0; lineIndex < screen.height; lineIndex++) { // was var d
	    logger.debug("Rendering line=" + lineIndex + ", offset=" + bufferPosOfLine); // NEEDSWORK p
	    this.initLineArrays(unicodeArray, renderingFlagsArray, colorArray, logicalWidth);
            for (var charIndex = 0; charIndex < logicalWidth; charIndex ++) { // was w
		let bufferPosOfChar = bufferPosOfLine + charIndex;
                var element = screen.screenElements[bufferPosOfChar]; // was b
                var field = (null != element) ? element.field : null; // was g
                colorArray[charIndex] = nullColor;
                var m = screen.Kl[bufferPosOfChar]; // INTERIM .Kl is maintained, but not well-understood
                this.setRenderingData(lineIndex, unicodeArray, renderingFlagsArray,
				      charIndex, element, field, m); 
		if (null != element && null === element.fieldData){
		    colorArray[charIndex] = this.getElementColor(element, field); 
		    if (!colorArray[charIndex]){
			colorLogger.warn("Null color at (" + charIndex + "," + lineIndex + ") was 0x"+Utils.hexString(colorArray[charIndex]));
		    }
		} else {
		    colorLogger.debug("Color not set for null element at (" + charIndex + "," + lineIndex + ")");
		}
                var fieldData = null != field ? field.fieldData : null, // was E
                    fieldCharAttrs = null != fieldData ? fieldData.attributes : null; // was k
                outliningArray[charIndex] = null !== fieldCharAttrs ? fieldCharAttrs.outlining : 0;
            }
            var S = 0;
            for (charIndex = 0; charIndex < logicalWidth; ) {
                var runLength = this.similarCharRunLength(colorArray, renderingFlagsArray, dbcsArray, 
							  logicalWidth * lineIndex, charIndex, logicalWidth); // was T
                logger.debug("Run starts at (" + charIndex + "," + lineIndex + "). Length=" + runLength +
			     ", txtRndrAtr=0x" + Utils.hexString(renderingFlagsArray[charIndex]) +
			     ", color=0x" + Utils.hexString(colorArray[charIndex]));
                var R = String.fromCharCode.apply(null, unicodeArray);
                logger.debug('Line text="' + R + '"');
                var y = logicalWidth * lineIndex + charIndex; // bufferPos of runStart
                if (0 !== outliningArray[charIndex]) {
		    /* Outline is probably broken because this.En() is not in the minified code
		       but heres a workaround
		       */
                    //let t = this.En(); 
                    BaseRenderer.setStrokeColor(ctx, "#EEEECC"); // hacky color!
                    let elt2 = screen.screenElements[y],
                        field2 = null != elt2 ? elt2.field : null, // was shadowed n
                        fieldData2 = null != field2 ? field2.fieldData : null, // was shadowed s
                        charFieldAttrs2 = null != fieldData2 ? fieldData2.attributes : null; // was shadowed h
                    if (charFieldAttrs2 && 0 !== charFieldAttrs2.outlining) { 
                        let thingy = { zl: fieldData2,
				       Sn: y,
				       Tn: screen.screenElements.length, // silly
				       Rn: charFieldAttrs2,
				       yn: S, // that's a capital S
				       Cn: v,
				       Nn: runLength }; 
                        this.drawCharOutlining(ctx, thingy); // INTERIM, half-assed impl below
                    }
                }
                if (colorArray[charIndex] != nullColor) {
                    y = logicalWidth * lineIndex + charIndex; // y was bufferPos of runStart
		    BaseRenderer.setFillColor(ctx, colorArray[charIndex]);
		    BaseRenderer.setStrokeColor(ctx, colorArray[charIndex]);
		    ctx.lineWidth = 0.8;
                    var C = renderingFlagsArray[charIndex],
                        useReverse = 0 != (2 & C); // was N
		    if (useReverse){
			logger.debug("Setting reverse video at (" + charIndex + "," + lineIndex + ")");
			ctx.fillRect(S, v, runLength * this.charWidth, this.charHeight),
			BaseRenderer.setFillColor(ctx, 0);
		    }
                    if (0 != (1 & C)){
			this.renderCharactersSpecialCases(ctx, unicodeArray, charIndex, runLength, S, v, useReverse);
		    } else if (1 == dbcsArray[y]) {
                        var P = screen.screenElements[y],
                            F = screen.screenElements[y + 1],
                            I = screen.Kl[y];
                        null == I && (I = (P as ScreenElement).charToDisplay()); // JOE
                        var D,
                            x = screen.Kl[y + 1];
                        null == x && (x = (F as ScreenElement).charToDisplay()), // JOE
			(D = null != f && f[0] == I && f[1] == x ? Unicode.euro : o[I][x]), // *UNKNOWN* logic
			logger.debug("Should dbcs render b1=0x" + Utils.hexString(I) +
				     " b2=0x" + Utils.hexString(x) + " unicode=0x" + Utils.hexString(D));
                        var O = [D];
                        ctx.font = charsetFont;
			// MOST DBCS rendering happens here, I think
			BaseRenderer.drawCharArraySlice(ctx, O, 0, 1, S, v),
			ctx.font = this.font;
                    } else {
			if (2 != dbcsArray[y]){
			    logger.debug("Drawing chars at (" + charIndex + "," + lineIndex + ")");
			    if (0 != (8 & C)){
				this.Bl = true; // NEEDSWORK .Bl, .Ml
				if (this.Ml){
				    BaseRenderer.drawCharArraySlice(ctx, unicodeArray, charIndex, runLength, S, v);
				}
			    } else {
				// console.log("JOE guess drawCharArraySlice charIndex="+charIndex+" X="+S+" Y="+v);
				BaseRenderer.drawCharArraySlice(ctx, unicodeArray, charIndex, runLength, S, v);
			    }
			}
		    }
                    if (0 != (4 & C)) {
                        logger.debug("Adding underscore at (" + charIndex + "," + lineIndex + ")");
                        var M = v + (this.charHeight - 0.5);
                        BaseRenderer.drawLine(ctx, S, M, S + runLength * this.charWidth, M);
                    }
		    if (0 != (8192 & C)){
			logger.debug("Adding top score at (" + charIndex + "," + lineIndex + ")");
			BaseRenderer.drawLine(ctx, S, (M = v), S + runLength * this.charWidth, M)
		    }
		    if (useReverse){
			BaseRenderer.setFillColor(ctx, colorArray[charIndex]);
		    }
                } else if (-1 != this.pl(unicodeArray, charIndex, runLength)){ 
		    logger.debug("Skipping invisible or noColor chars at (" + charIndex + "," + lineIndex + ")");
		}
                charIndex += runLength;
		S += runLength * this.charWidth;
            }
            bufferPosOfLine += screen.width;
	    v += this.charHeight;
        }
        this.redrawTransientElements();
	if (canvas){
	    this.renderGraphics(canvas,
				screen.graphicsState,
				screen.graphicsWidth,screen.graphicsHeight,
				this.activeWidth,this.activeHeight);
	}
    }

    // gather group of similar characters, drawing-attr and colorwize
    similarCharRunLength(colorArray:number[],
			 renderingFlagsArray:number[],
			 dbcsArray:Uint8Array,
			 startingPos:number,
			 charPosInLine:number,
			 lineWidth:number):number { // (ka.prototype.Al = function (t, l, n, i, e, s) {
	let nullColor = Renderer3270.nullColor;
	var u = startingPos + 1;
	var h = colorArray[charPosInLine];
	var r = renderingFlagsArray[charPosInLine];
	var a = dbcsArray[startingPos + charPosInLine];
        for (;u < lineWidth &&
	     (h == nullColor ? colorArray[u] == nullColor : h == colorArray[u]) &&
	     r == renderingFlagsArray[u] &&
	     a == dbcsArray[startingPos + u]; ){
	    u++;
	}
        return u - startingPos;
    }

    static buildDBCSArray(screen:VirtualScreen3270):Uint8Array{ // Pa(t){
	let logger = Utils.renderLogger;
	var element = screen.screenElements[0], // was n
            dbcsArray = new Uint8Array(screen.size), // was i
            e = 0;
	if (screen.isFormatted) {
            if (element && element.fieldData) {
		e = 0;
            } else {
		for (var l = screen.size - 1; l > 0; l--){
		    let elementL = screen.screenElements[l];
                    if (elementL && elementL.fieldData) {
			e = l;
			break;
                    }
		}
	    }
	} else {
	    e = 0;
	}
	var size = screen.size, // was s
            u = false,
            h = false,
            r = 0,
            a = false,
            o = 0;
	for (l = 0; l < size; l++) {
            var c = (e + l) % size;
            if ((element = screen.screenElements[c])) {
		var f = screen.Kl[c];
		if (f == null){
		    f = element.charToDisplay();
		}
		if (element.fieldData){
		    let fieldData:FieldData3270 = element.fieldData as FieldData3270;
                    let charAttrs:CharacterAttributes3270 = fieldData.attributes; // was d
                    dbcsArray[c] = 0;
		    if (1 == charAttrs.sisoAllowed){
			u = true;
		    } else if (charAttrs.characterSet > 0){
			logger.debug("DBCS: detected DBCS field, fieldAttributes=" + charAttrs +
				     ", characterSet=" + Utils.hexString(charAttrs.characterSet));
			h = !0;
		    }
		} else if (f == 0x0E){ // EBCDIC SHIFT OUT 
                    dbcsArray[c] = 0;
		    a = !0;
		    logger.debug("DBCS: saw 0x0E (Shift-out) at pos=" + c + ", screenElement=" + element);
                } else if (f == 0x0F){ // EBCDIC SHIFT IN
                    dbcsArray[c] = 0;
		    a = !1;
		    r = 0;
		    logger.debug("DBCS: saw 0x0F (Shift-in) at pos=" + c + ", screenElement=" + element);
                } else if (a){
                    if (u){
			dbcsArray[c] = o % 2 == 0 ? 1 : 2;
			logger.debug("DBCS: set DBCS attributes in pos=" + c + " to=" + dbcsArray[c]);
		    } else {
			dbcsArray[c] = 0;
			o++
		    }
		} else {
                    r++;
		    if (h){
			dbcsArray[c] = r % 2 == 0 ? 1 : 2;
			logger.debug("DBCS: set DBCS attributes in pos=" + c + " to=" + dbcsArray[c]);
		    } else {
			dbcsArray[c] = 0;
		    }
		}
            } else dbcsArray[c] = 0;
	}
	return dbcsArray;
    }

    /* COMMENT! */
    
    drawCharOutlining(ctx:CanvasRenderingContext2D, outlineSpec:any){ // (Ya.prototype.Pn = function (t, l) {
        let n = outlineSpec.Rn.mn;
        let i:number = outlineSpec.zl.position as number;
        let e:number = outlineSpec.zl.length as number;
        let s:number = (i + e) % (outlineSpec.Tn as number);
        let u = outlineSpec.yn,
            h = outlineSpec.Cn,
            r = outlineSpec.Nn,
            a = outlineSpec.Sn,
            o = u + this.charWidth / 2;
        if (
            (2 & n && (1 === e && ((r = 1),
				   BaseRenderer.drawLine(ctx, o + r * this.charWidth, h,
							  o + r * this.charWidth, h + this.charHeight)),
		       s === a + r && BaseRenderer.drawLine(ctx, o + r * this.charWidth, h,
							     o + r * this.charWidth, h + this.charHeight)),
             8 & n && (1 === e && (r = 1), a === i && BaseRenderer.drawLine(ctx, o, h, o, h + this.charHeight)),
             1 & n)
        ) {
            let l = h + this.charHeight; // shadow l
            BaseRenderer.drawLine(ctx, o, l, o + r * this.charWidth, l);
        }
        4 & n && BaseRenderer.drawLine(ctx, o, h, o + r * this.charWidth, h);
    }
    
    renderGraphics(canvas:HTMLCanvasElement,  // Ya.prototype.Fn - but with more arguments!
		   graphicsState:GraphicsState,
		   graphicsWidth:number,
		   graphicsHeight:number,
		   activeWidth:number,
		   activeHeight:number){  // what are the active (text-background) dimensions
	let logger = Utils.renderLogger;
	let canvasWidth = canvas.width;
	let canvasHeight = canvas.height;
	console.log("JOEG in rg()");
	let ctx:CanvasRenderingContext2D|null = canvas.getContext("2d");
	if (!ctx){
	    logger.warn("cannot render graphics without 2d ctx");
	    return;
	}
	if (!graphicsWidth || !graphicsHeight){
	    logger.warn("cannot render without graphics dimensions set");
	    return;
	}
	if (!activeWidth || (activeWidth <= 0) || !activeHeight || (activeHeight <= 0)){
	    logger.warn("cannot render without active (font-metrics-based) dimensions set");
	    return;
	}
	console.log("JOEG about to render graphics");

	try {
	    ctx.save(); // in case this CTX is *exactly* the same object as any other result of canvas.getContext("2d")
	    graphicsState.render(ctx,
				 graphicsWidth,
				 graphicsHeight,
				 activeWidth,
				 activeHeight);
	} catch (e){
	    logger.warn("Graphics render failed "+e);
	} finally {
	    ctx.restore();
	}
    }

}
