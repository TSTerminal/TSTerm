import { Utils } from "./utils.js";
import { ScreenElement } from "./paged.js";
import { VirtualScreen3270, DeviceType3270, TN3270EParser } from "./model3270.js";

export class TerminalLauncher{
    constructor(){

    }

    static renderTest(screenParms:any){
	let width = 80;
	let height = 24;
	var screen = new VirtualScreen3270(width, height);
	screen.Oi(screenParms.parentDiv, screenParms);
	screen.initScreen();
	let r;
	let c;
	for (r=1; r<4; r++){
	    for (c=0; c<0x40; c++){
		let screenPos = r*width+c;
		let ebcdicChar = (r*0x40)+c;
		screen.putScreenElement(screenPos,new ScreenElement(screenPos,ebcdicChar,null));
	    }
	}
	console.log("renderTest(): before showScreen()");
	screen.showScreen();
	console.log("renderTest(): after showScreen()");
    }

    /* remember when using packet captures to test parsing to strip out telnet escape sequences and 
       trailers, etc */
    static wsfBytes:number[] =
	[ 0x00, 0x05, 0x9a, 0x3c, 0x7a, 0x00, 0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x08, 0x00, 0x45, 0x00,
	  0x00, 0xa7, 0x27, 0x25, 0x00, 0x00, 0x3f, 0x06, 0x20, 0x3f, 0xac, 0x1d, 0x7a, 0xa4, 0xac, 0x1d,
	  0x61, 0x0e, 0x02, 0x6f, 0xdd, 0xb1, 0x39, 0xc3, 0x71, 0x5f, 0xc2, 0x05, 0x7b, 0x2d, 0x50, 0x18,
	  0x0f, 0xff, 0x87, 0x11, 0x00, 0x00, 0x00, 0x01, 0x02, 0x00, 0x30, 0xf3, 0x00, 0x08, 0x0f, 0x02,
	  0x00, 0x00, 0x81, 0x01, 0x00, 0x0f, 0x10, 0x13, 0x00, 0x00, 0x1f, 0x08, 0x01, 0x18, 0x00, 0x73,
	  0x02, 0x00, 0x00, 0x00, 0x07, 0x06, 0x01, 0xff, /* 0xff, */ 0x41, 0x02, 0x00, 0x07, 0x06, 0x01, 0xff,
	  /* 0xff, */ 0x41, 0x03, 0x00, 0x23, 0x0f, 0x11, 0x00, 0xc0, 0x00, 0x30, 0x0a, 0x00, 0x00, 0x00, 0x00,
	  0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x21, 0x06, 0x03, 0x18, 0x00, 0x8f, 0x02, 0xee, 0x21, 0x06,
	  0x00, 0x30, 0x00, 0x8f, 0x02, 0x05, 0x00, 0x2d, 0x0f, 0x10, 0x00, 0xc0, 0x00, 0x70, 0x0c, 0x00,
	  0x00, 0x00, 0x00, 0x54, 0x00, 0x00, 0x18, 0x00, 0x00, 0x00, 0x00, 0xc1, 0x04, 0x00, 0x00, 0x00,
	  0x00, 0x81, 0x04, 0x00, 0x8f, 0x00, 0x00, 0x81, 0x04, 0x00, 0x8f, 0x00, 0x4c, 0x81, 0x04, 0x00,
	  0x00, 0x00, 0x00]; /* , 0xff, 0xef]; */

    
    static parseTest(screenParms:any):void{
	let width = 80;
	let height = 24;
	console.log("Starting parse WSF test...");
	var screen = new VirtualScreen3270(width, height);
	let parser = new TN3270EParser(screen, "3270_CLIENT_MESSAGE");
	screen.parser = parser;
	let wsfBytes = TerminalLauncher.wsfBytes;
	let order = parser.parseWSF(wsfBytes,0x3B,wsfBytes.length,true);
	console.log("WSF order = "+JSON.stringify(order));
	
    }

    static start3270 = function (screenParms:any, // { parentDiv: width: w height: h } html params was t
				 cnxnSettings:any, // n, includes charsetName
				 i:any,  // has contextRightClick and keyboardMappings
				 callbacks:any, // a js object with k-v paairs
				 additionalScreenProperties:any) {   // "e" clone-copy from this if supplied
	var securityType = 0;
	var u = 0; // dunno 
	var screen = new VirtualScreen3270(80, 24); // formerly h
	if (additionalScreenProperties){
	    screen = Object.assign(screen, additionalScreenProperties);
	}
	screen.Oi(screenParms.parentDiv, screenParms); // sets up drawing stuff
	screen.callbacks = callbacks;
	screen.Ne();  // sets up callbacs
        screen.na = cnxnSettings;
	// Joe doesn't like the follwing minification
        // (h.enableTN3270E = void 0 === cnxnSettings.enableTN3270E || cnxnSettings.enableTN3270E),
	screen.enableTN3270E = cnxnSettings.enableTN3270E;
	if (null != i){
	    screen.zn = i;
	    screen.keyboardMap = i.keyboardMappingVS;
	    screen.contextRightClick = i.contextRightClick;
	}
	if ((cnxnSettings.charsetName &&
	     ("string" == typeof cnxnSettings.charsetName))){
	    screen.setCharsetInfo(cnxnSettings.charsetName);
	}
	if (cnxnSettings.deviceType && "number" == typeof cnxnSettings.deviceType){
            switch (cnxnSettings.deviceType) {
            case 1:
                screen.deviceType = DeviceType3270.deviceType1E;
                break;
            case 2:
                screen.deviceType = DeviceType3270.deviceType2E;
                break;
            case 3:
                screen.deviceType = DeviceType3270.deviceType3E;
                break;
            case 4:
                screen.deviceType = DeviceType3270.deviceType4E;
                break;
            case 5:
                screen.deviceType = DeviceType3270.ps;
            }
            if (screen.deviceType === DeviceType3270.ps){
		if (cnxnSettings.alternateWidth &&
		    (typeof cnxnSettings.alternateWidth == "number")){
		    screen.alternateWidth = cnxnSettings.alternateWidth;
		}
		if (cnxnSettings.alternateHeight &&
		    (typeof cnxnSettings.alternateHeight == "number")){
		    screen.alternateHeight = cnxnSettings.alternateHeight;
		}
	    } // should we pop out anoher level
	    if (cnxnSettings.sessionDeviceName &&
		(typeof cnxnSettings.sessionDeviceName == "string")){
		screen.sessionDeviceName = cnxnSettings.sessionDeviceName;
	    }
	    if (cnxnSettings.oiaEnabled &&
		(typeof cnxnSettings.oidEnabled == "boolean")){
                screen.oiaEnabled = cnxnSettings.oiaEnabled ? 1 : 0;
	    }
	    if (cnxnSettings.security &&
		(typeof cnxnSettings.security == "object")){
		let securityParms = cnxnSettings.security;
		if (securityParms.type && ("number" == typeof securityParms.type)){
		    securityType = securityParms.type;
		}
		if (securityParms.badCert && ("number" == typeof securityParms.badCert)){
		    u = securityParms.badCert;
		}
	    }
        }
	// undeclared use of bi
	screen.bi = { host: cnxnSettings.host, port: Number(cnxnSettings.port),
		      security: securityType, la: u };
        screen.initScreen();
        Utils.coreLogger.debug("connect = " + cnxnSettings.connect);
        if (cnxnSettings.connect){
	    screen.connect(cnxnSettings.url, screen.bi);
	} else {
	    screen.scriptIsRunning = true;
	}
        screen.buildEventHandlers();
	if (screen.canvas){ // JOE - will be non-null
            screen.canvas.focus();
	}
        if (screen.callbacks && ("function" == typeof screen.callbacks.onInit)){
	    screen.callbacks.onInit();
	}
    }
    
}
