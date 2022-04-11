/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
  Copyright Contributors to the Open Mainframe Project's TSTerm Project
*/

import { CharacterData } from "./CharData";

export class ComponentLogger {
    name:string;
    level:number;
    debugEnabled:boolean;

    constructor(name:string){
	this.name = name;
	this.level = 2;
	this.debugEnabled = false;
    }
    
    warn(s:string):void {
	console.log("WARN: ("+this.name+"): "+s);
    }

    severe(s:string):void{
	console.log("SEVERE: ("+this.name+"): "+s);
    }

    info(s:string):void{
	console.log("INFO: ("+this.name+"): "+s);
    }

    debug(s:string):void{
	if (this.level >= 4){
	    console.log("DEBUG: ("+this.name+"): "+s);
	}
    }

    debug2(s:string):void {
	if (this.level >= 5){
	    console.log("DEBUG2: ("+this.name+"): "+s);
	}
    }

    debug3(s:string):void {
	if (this.level >= 6){
	    console.log("DEBUG3: ("+this.name+"): "+s);
	}
    }
    
    setLevel(level:number):ComponentLogger{
	this.level = level;
	return this;
    }
}

export class Exception {
    message:string;
    name:string;

    constructor(message:string,name:string){
	this.message = message;
	this.name = name;
    }

    static runtimeException(message:string) { // To
	let e = new Exception(message,"RuntimeException");
	Utils.coreLogger.warn("Encountered exception:" + this.name + ", msg:" + message);
	return e;
    }

    static exception(message:string) { // Ro
	let e = new Exception(message,"Exception");
	Utils.coreLogger.warn("Encountered exception:" + this.name + ", msg:" + message);
	return e;
    }

    static terminalInputException(message:string) { // yo
	let e = new Exception(message,"TerminalInputException");
	Utils.coreLogger.warn("Encountered exception:" + this.name + ", msg:" + message);
	return e;
    }

    static unsuppotedOperationException(message:string) { // Co
	let e = new Exception(message,"UnsupportedOperationException");
	Utils.coreLogger.warn("Encountered exception:" + this.name + ", msg:" + message);
	return e;
    }
}


export class Utils {
    static defaultGlobalLogger:ComponentLogger;

    static hexString(x:number):string{   // minified as Uh(x)
	return (x || 0 === x) ? x.toString(16) : "<FAIL: Not A Number>";
    }

    static hexDump(byteArray:number[], logger:ComponentLogger, offsetArg?:number, lengthArg?:number){ // Lh = function (t, n, i, e) {
        var s = 0; // iteration index
        var offset = offsetArg || 0;  // u
        var length  = lengthArg || byteArray.length; // h
        var r = "";
        for (s = 0; s < length; s++){
	    r += Utils.hexString(byteArray[offset + s]) + " ";
	    if (s % 16 == 15){
		if (logger && logger.debug){
		    logger.debug(r);
		} else{
		    Utils.defaultGlobalLogger.debug(r);
		}
		r = "";
	    }
	}
	if (r.length > 0){
	    if (logger && logger.debug){
		logger.debug(r);
	    } else {
		Utils.defaultGlobalLogger.debug(r);
	    }
	}
    }

    static hexDumpU8(byteArray:Uint8Array, logger:ComponentLogger, offsetArg?:number, lengthArg?:number){ // Lh = function (t, n, i, e) {
        var s = 0; // iteration index
        var offset = offsetArg || 0;  // u
        var length  = lengthArg || byteArray.length; // h
        var r = "";
        for (s = 0; s < length; s++){
	    let hexDigits = Utils.hexString(byteArray[offset + s]);
	    if (hexDigits.length == 1){
		hexDigits = "0"+hexDigits;
	    }
	    r += (hexDigits+ " ");
	    if (s % 16 == 15){
		if (logger && logger.debug){
		    logger.debug(r);
		} else{
		    Utils.defaultGlobalLogger.debug(r);
		}
		r = "";
	    }
	}
	if (r.length > 0){
	    if (logger && logger.debug){
		logger.debug(r);
	    } else {
		Utils.defaultGlobalLogger.debug(r);
	    }
	}
    }

    // static qa = window.COM_RS_COMMON_LOGGER.makeComponentLogger("org.zowe.terminal.core.keyboard");
    static keyboardLogger:ComponentLogger = new ComponentLogger("TerminalKeyboard").setLevel(4);

    // was Ja
    // static Ja  = window.COM_RS_COMMON_LOGGER.makeComponentLogger("org.zowe.terminal.core.message");  // Ja
    static messageLogger:ComponentLogger = new ComponentLogger("TerminalMessage").setLevel(2);
    
    // static Za = window.COM_RS_COMMON_LOGGER.makeComponentLogger("org.zowe.terminal.core.protocol");
    static protocolLogger:ComponentLogger = new ComponentLogger("TN3270Protocol").setLevel(4);
    
    // static Xa = window.COM_RS_COMMON_LOGGER.makeComponentLogger("org.zowe.terminal.core.telnet");
    static telnetLogger:ComponentLogger = new ComponentLogger("TN3270Telnet").setLevel(2);
    
    // static $a = window.COM_RS_COMMON_LOGGER.makeComponentLogger("org.zowe.terminal.core.event");
    static eventLogger:ComponentLogger = new ComponentLogger("TerminalMessage").setLevel(2);
    
    //static to = window.COM_RS_COMMON_LOGGER.makeComponentLogger("org.zowe.terminal.core.parse");
    static parseLogger:ComponentLogger =  new ComponentLogger("TN3270Parse").setLevel(4);

    // l
    static coreLogger:ComponentLogger = new ComponentLogger("TerminalCore").setLevel(4); // should match to org.zowe.terminal.core
    
    //Sr = window.COM_RS_COMMON_LOGGER.makeComponentLogger("org.zowe.terminal.core.render"),
    static renderLogger:ComponentLogger = new ComponentLogger("TerminalRender").setLevel(2);
    
    //Tr = window.COM_RS_COMMON_LOGGER.makeComponentLogger("org.zowe.terminal.core.scaling"),
    static scalingLogger:ComponentLogger = new ComponentLogger("TerminalScaling");
    
    //Rr = window.COM_RS_COMMON_LOGGER.makeComponentLogger("org.zowe.terminal.core.color");
    static colorLogger:ComponentLogger = new ComponentLogger("TerminalColor");

    static graphicsLogger:ComponentLogger = new ComponentLogger("Graphics").setLevel(4);
    
    
    static superClassWarning(t:any):void{  // minified as bo(t){
	alert(t + ": You are in the superclass!");
    }

    static Bt:string[] = ["750", "752", "753", "763"];  // don't have a good name yet, but these are error strings

    static readU16(byteArray:number[], position:number):number {  // Kh(t,l)
        var n = (255 & byteArray[position]) << 8;
        return (255 & byteArray[position + 1]) | n;
    }

    static pseudoRead(byteArray:number[], position:number, length:number):number{
	return position >= length ? -1 : byteArray[position];
    }

    static b64EncodeArray:number[] = [
	65,     66,    67,    68,    69,    70,    71,    72,    73,    74,    75,
	76,     77,    78,    79,    80,    81,    82,    83,    84,    85,    86,
	87,     88,    89,    90,    97,    98,    99,    100,   101,   102,   103,
	104,    105,   106,   107,   108,   109,   110,   111,   112,   113,   114,
	115,    116,   117,   118,   119,   120,   121,   122,   48,    49,    50,
	51,     52,    53,    54,    55,    56,    57,    43,    47,
    ];


    static base64Encode(t:number[]):string { // minified as Qh(t)
	let encodeArray = Utils.b64EncodeArray;
	for (var l = [], n = t.length, i = Math.floor(n / 3), e = n - 3 * i, s = 0, u = 0; u < i; u++) {
            let n = 255 & t[s++],
		i = 255 & t[s++],
		e = 255 & t[s++];
            l.push(encodeArray[n >> 2]), l.push(encodeArray[((n << 4) & 63) | (i >> 4)]), l.push(encodeArray[((i << 2) & 63) | (e >> 6)]), l.push(encodeArray[63 & e]);
	}
	if (0 != e) {
            let n = 255 & t[s++];
            if ((l.push(encodeArray[n >> 2]), 1 == e)) l.push(encodeArray[(n << 4) & 63]), l.push(61), l.push(61);
            else {
		let i = 255 & t[s++];
		l.push(encodeArray[((n << 4) & 63) | (i >> 4)]), l.push(encodeArray[(i << 2) & 63]), l.push(61);
            }
	}
	return String.fromCharCode.apply(null, l);
    }

    static base64EncodeU8(t:Uint8Array):string { // minified as Qh(t)
	let encodeArray = Utils.b64EncodeArray;
	for (var l = [], n = t.length, i = Math.floor(n / 3), e = n - 3 * i, s = 0, u = 0; u < i; u++) {
            let n = 255 & t[s++],
		i = 255 & t[s++],
		e = 255 & t[s++];
            l.push(encodeArray[n >> 2]), l.push(encodeArray[((n << 4) & 63) | (i >> 4)]), l.push(encodeArray[((i << 2) & 63) | (e >> 6)]), l.push(encodeArray[63 & e]);
	}
	if (0 != e) {
            let n = 255 & t[s++];
            if ((l.push(encodeArray[n >> 2]), 1 == e)) l.push(encodeArray[(n << 4) & 63]), l.push(61), l.push(61);
            else {
		let i = 255 & t[s++];
		l.push(encodeArray[((n << 4) & 63) | (i >> 4)]), l.push(encodeArray[(i << 2) & 63]), l.push(61);
            }
	}
	return String.fromCharCode.apply(null, l);
    }

    static b64DecodeArray: number[] = [
	0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
	0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
	0,    0,    0,    0,    0,    0,    0,    0,    0,   62,    0,    0,    0,    63,   52,   53,   54,
	55,   56,   57,   58,   59,   60,   61,   0,    0,    0,    0,    0,    0,    0,    0,    1,    2,
	3,    4,    5,    6,    7,    8,    9,   10,    11,   12,   13,   14,   15,   16,   17,   18,   19,
	20,   21,   22,   23,   24,   25,   0,    0,    0,    0,    0,    0,    26,   27,   28,   29,   30, 
	31,   32,   33,   34,   35,   36,   37,   38,   39,   40,   41,   42,   43,   44,   45,   46,   47,
	48,   49,   50,   51,   0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
	0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
	0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
	0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
	0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
	0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
	0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
	0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0];


    /* returns a Uint8Array() */
    static base64Decode(t:string):Uint8Array|null {  // Gh = function (t) {
	let decodeArray = Utils.b64DecodeArray;
	let logger = Utils.coreLogger;
        var n = t.length,
            i = n / 4,
            e = 0,
            s = i,
            u = 0,
            h = 0;
        if (4 * i != n) {
	    logger.warn("Base64 decode failed, encountered 4-mult");
	    return null;
	}
        0 != n && "=" == t[n - 1] && (e++, s--, "=" == t[n - 2] && e++);
        var r = 3 * s;
        0 != e && (1 == e ? (r += 2) : r++);
        var a = new Uint8Array(r);
        let o = 4 * s;
        for (; u < o; ) {
            let l = decodeArray[t.charCodeAt(u++)],
                n = decodeArray[t.charCodeAt(u++)],
                i = decodeArray[t.charCodeAt(u++)],
                e = decodeArray[t.charCodeAt(u++)];
            (a[h++] = (l << 2) | (n >> 4)), (a[h++] = (n << 4) | (i >> 2)), (a[h++] = (i << 6) | e);
        }
        if (0 != e) {
            let l = decodeArray[t.charCodeAt(u++)],
                n = decodeArray[t.charCodeAt(u++)];
            if (((a[h++] = (l << 2) | (n >> 4)), 1 == e)) {
                let l = decodeArray[t.charCodeAt(u++)];
                a[h++] = (n << 4) | (l >> 2);
            }
        }
        return a; 
    }

    // Proper Telnet escaping util
    static pushTelnetByte(byteArray:number[], b:number):number{ // qo = function (t, l) {
	return 255 === b ? (byteArray.push(255), byteArray.push(255)) : byteArray.push(b), b;
    }

}
