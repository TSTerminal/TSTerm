/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
  Copyright Contributors to the Open Mainframe Project's TSTerm Project
*/

import { b64EncodeArray, b64DecodeArray } from './tables/base64';

export class ComponentLogger {
    name: string;
    level: number;
    debugEnabled: boolean;

    constructor(name: string) {
        this.name = name;
        this.level = 2;
        this.debugEnabled = false;
    }

    warn(s: string): void {
        console.log('WARN: (' + this.name + '): ' + s);
    }

    severe(s: string): void {
        console.log('SEVERE: (' + this.name + '): ' + s);
    }

    info(s: string): void {
        console.log('INFO: (' + this.name + '): ' + s);
    }

    debug(s: string): void {
        if (this.level >= 4) {
            console.log('DEBUG: (' + this.name + '): ' + s);
        }
    }

    debug2(s: string): void {
        if (this.level >= 5) {
            console.log('DEBUG2: (' + this.name + '): ' + s);
        }
    }

    debug3(s: string): void {
        if (this.level >= 6) {
            console.log('DEBUG3: (' + this.name + '): ' + s);
        }
    }

    setLevel(level: number): ComponentLogger {
        this.level = level;
        return this;
    }
}

export class Exception {
    message: string;
    name: string;

    private static anyException(message: string, type: string): Exception {
        const e = new Exception(message, type);
        Utils.coreLogger.warn('Encountered exception: ' + this.name + ', msg: ' + message);
        return e;
    }

    static runtimeException(message: string): Exception {
        return this.anyException(message, 'RuntimeException');
    }

    static exception(message: string): Exception {
        return this.anyException(message, 'Exception');
    }

    static terminalInputException(message: string): Exception {
        return this.anyException(message, 'TerminalInputException');
    }

    static unsuppotedOperationException(message: string): Exception {
        return this.anyException(message, 'UnsupportedOperationException');
    }

    constructor(message: string, name: string) {
        this.message = message;
        this.name = name;
    }

}

export class Utils {

    static defaultGlobalLogger: ComponentLogger;

    static keyboardLogger: ComponentLogger = new ComponentLogger('TerminalKeyboard').setLevel(4);

    static messageLogger: ComponentLogger = new ComponentLogger('TerminalMessage').setLevel(2);

    static protocolLogger: ComponentLogger = new ComponentLogger('TN3270Protocol').setLevel(4);

    static telnetLogger: ComponentLogger = new ComponentLogger('TN3270Telnet').setLevel(2);

    static eventLogger: ComponentLogger = new ComponentLogger('TerminalMessage').setLevel(2);

    static parseLogger: ComponentLogger =  new ComponentLogger('TN3270Parse').setLevel(4);

    static coreLogger: ComponentLogger = new ComponentLogger('TerminalCore').setLevel(4);

    static renderLogger: ComponentLogger = new ComponentLogger('TerminalRender').setLevel(2);

    static scalingLogger: ComponentLogger = new ComponentLogger('TerminalScaling');

    static colorLogger: ComponentLogger = new ComponentLogger('TerminalColor');

    static graphicsLogger: ComponentLogger = new ComponentLogger('Graphics').setLevel(4);

    static Bt: string[] = ['750', '752', '753', '763'];  // don't have a good name yet, but these are error strings

    static hexString(x: number): string {
        return (x || 0 === x) ? x.toString(16) : '<FAIL: Not A Number>';
    }

    static hexDump(byteArray: number[], logger: ComponentLogger, offsetArg?: number, lengthArg?: number): void {
        let s = 0;
        const offset = offsetArg || 0;
        const length = lengthArg || byteArray.length
        let r = '';
        for (s = 0; s < length; s++) {
            r += Utils.hexString(byteArray[offset + s]) + ' ';
            if (s % 16 === 15) {
                if (logger && logger.debug) {
                    logger.debug(r);
                } else {
                    Utils.defaultGlobalLogger.debug(r);
                }
            r = '';
            }
        }
        if (r.length > 0) {
            if (logger && logger.debug) {
                logger.debug(r);
            } else {
                Utils.defaultGlobalLogger.debug(r);
            }
        }
    }

    static hexDumpU8(byteArray: Uint8Array, logger: ComponentLogger, offsetArg?: number, lengthArg?: number): void {
        let s = 0;
        const offset = offsetArg || 0;
        const length = lengthArg || byteArray.length;
        let r = '';
        for (s = 0; s < length; s++) {
            let hexDigits = Utils.hexString(byteArray[offset + s]);
            if (hexDigits.length === 1) {
                hexDigits = '0' + hexDigits;
            }
            r += (hexDigits + ' ');
            if (s % 16 === 15) {
                if (logger && logger.debug) {
                    logger.debug(r);
                } else {
                    Utils.defaultGlobalLogger.debug(r);
                }
                r = '';
            }
        }
        if (r.length > 0) {
            if (logger && logger.debug) {
                logger.debug(r);
            } else {
                Utils.defaultGlobalLogger.debug(r);
            }
        }
    }

    static superClassWarning(t: any): void {
        alert(t + ': You are in the superclass!');
    }

    static readU16(byteArray: number[], position: number): number {
        const n = (255 & byteArray[position]) << 8;
        return (255 & byteArray[position + 1]) | n;
    }

    static pseudoRead(byteArray: number[], position: number, length: number): number {
        return position >= length ? -1 : byteArray[position];
    }

    static base64Encode(t: number[]): string { // minified as Qh(t)
        for (var l = [], n = t.length, i = Math.floor(n / 3), e = n - 3 * i, s = 0, u = 0; u < i; u++) {
            let n = 255 & t[s++],
                i = 255 & t[s++],
                e = 255 & t[s++];
            l.push(b64EncodeArray[n >> 2]), l.push(b64EncodeArray[((n << 4) & 63) | (i >> 4)]), l.push(b64EncodeArray[((i << 2) & 63) | (e >> 6)]), l.push(b64EncodeArray[63 & e]);
        }
        if (0 !== e) {
            let n = 255 & t[s++];
            if ((l.push(b64EncodeArray[n >> 2]), 1 === e)) {
                l.push(b64EncodeArray[(n << 4) & 63]), l.push(61), l.push(61);
            } else {
                let i = 255 & t[s++];
                l.push(b64EncodeArray[((n << 4) & 63) | (i >> 4)]), l.push(b64EncodeArray[(i << 2) & 63]), l.push(61);
            }
        }
        return String.fromCharCode.apply(null, l);
    }

    static base64EncodeU8(t: Uint8Array): string { // minified as Qh(t)
        for (var l = [], n = t.length, i = Math.floor(n / 3), e = n - 3 * i, s = 0, u = 0; u < i; u++) {
            let n = 255 & t[s++],
                i = 255 & t[s++],
                e = 255 & t[s++];
            l.push(b64EncodeArray[n >> 2]), l.push(b64EncodeArray[((n << 4) & 63) | (i >> 4)]), l.push(b64EncodeArray[((i << 2) & 63) | (e >> 6)]), l.push(b64EncodeArray[63 & e]);
        }
        if (0 !== e) {
            let n = 255 & t[s++];
            if ((l.push(b64EncodeArray[n >> 2]), 1 === e)) {
                l.push(b64EncodeArray[(n << 4) & 63]), l.push(61), l.push(61);
            } else {
                let i = 255 & t[s++];
                l.push(b64EncodeArray[((n << 4) & 63) | (i >> 4)]), l.push(b64EncodeArray[(i << 2) & 63]), l.push(61);
            }
        }
        return String.fromCharCode.apply(null, l);
    }
    
        /* returns a Uint8Array() */
    static base64Decode(t: string): Uint8Array|null {  // Gh = function (t) {
        let logger = Utils.coreLogger;
        var n = t.length,
            i = n / 4,
            e = 0,
            s = i,
            u = 0,
            h = 0;
        if (4 * i !== n) {
            logger.warn('Base64 decode failed, encountered 4-mult');
            return null;
        }
        0 !== n && '=' === t[n - 1] && (e++, s--, "=" === t[n - 2] && e++);
        var r = 3 * s;
        0 !== e && (1 === e ? (r += 2) : r++);
        var a = new Uint8Array(r);
        let o = 4 * s;
        for (; u < o; ) {
            let l = b64DecodeArray[t.charCodeAt(u++)],
                n = b64DecodeArray[t.charCodeAt(u++)],
                i = b64DecodeArray[t.charCodeAt(u++)],
                e = b64DecodeArray[t.charCodeAt(u++)];
            (a[h++] = (l << 2) | (n >> 4)), (a[h++] = (n << 4) | (i >> 2)), (a[h++] = (i << 6) | e);
        }
        if (0 !== e) {
            let l = b64DecodeArray[t.charCodeAt(u++)],
                n = b64DecodeArray[t.charCodeAt(u++)];
            if (((a[h++] = (l << 2) | (n >> 4)), 1 === e)) {
                let l = b64DecodeArray[t.charCodeAt(u++)];
                a[h++] = (n << 4) | (l >> 2);
            }
        }
        return a;
    }

     static pushTelnetByte(byteArray: number[], b: number): number {
        return 255 === b ? (byteArray.push(255), byteArray.push(255)) : byteArray.push(b), b;
    }

}
